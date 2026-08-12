#!/usr/bin/env node
/**
 * Syncs the KCVV analytics taxonomy into the live GTM container (issue #1974).
 *
 * It idempotently upserts, in a GTM **workspace** only:
 *   1. the Custom-Event trigger's Event-name RegEx (= taxonomy `buildTriggerRegex()`),
 *   2. one Data Layer Variable per taxonomy param (deduped by dataLayer key),
 *   3. the GA4 Event tag's custom-parameter rows (deduped by param name),
 * then creates an **unpublished** container version. Nothing is auto-published —
 * you review the version diff in the GTM UI and publish.
 *
 * SAFETY
 *   --dry-run   Print the full plan (creates/updates) + the orphan report and
 *               exit WITHOUT writing anything.
 *   --dump      Read-only: print the live trigger, GA4 tag, and DLVs as JSON,
 *               so the exact resource shapes can be confirmed. No writes.
 *   --publish   Publish the version it creates, instead of leaving it for a
 *               manual review + publish in the GTM UI. Reversible: GTM keeps
 *               every version, and re-publishing the previous one rolls back.
 *   Abort       A real run aborts (non-zero) if the live trigger RegEx contains a
 *               token NOT in the taxonomy, instead of dropping it. --dry-run only
 *               warns. --force-regex overwrites the RegEx with the canonical one
 *               (use once the orphan tokens are confirmed stale).
 *   Orphans     Live DLV keys / tag param rows / regex tokens the taxonomy no
 *               longer contains are PRINTED (read-only) and never auto-deleted.
 *
 * UNATTENDED WRITES — GTM v2's write quota is low and bursty callers get 429s,
 * so every mutating call goes through one serialized, paced queue (see
 * `write()`): a fixed gap between writes, then exponential backoff on top for
 * whatever still bounces. A full sync is therefore SLOW by design — minutes,
 * not seconds — and that is the trade for a run that finishes on its own.
 *
 * There is no bulk-create endpoint for variables in GTM API v2, so DLVs cost
 * one request each; "batching" here means paced + resumable, not fewer calls.
 * The run is idempotent: it re-reads live state before planning AND again
 * before the create loop, so an interrupted run can simply be re-run and picks
 * up whatever is still missing without ever duplicating.
 *
 * AUTH — Google blocks gcloud's built-in OAuth client from requesting these
 * sensitive scopes for ADC. Use a user-owned OAuth client (one-time):
 *   1. GCP Console → enable "Tag Manager API" (+ "Google Analytics Admin API").
 *   2. OAuth consent screen → add yourself as a Test user.
 *   3. Credentials → create an OAuth client ID, type "Desktop app", download JSON.
 *   4. gcloud auth application-default login \
 *        --client-id-file=<that>.json \
 *        --scopes=https://www.googleapis.com/auth/tagmanager.edit.containers,\
 *                 https://www.googleapis.com/auth/tagmanager.edit.containerversions,\
 *                 https://www.googleapis.com/auth/tagmanager.publish
 *
 * The third scope is needed ONLY for --publish; the first two cover a normal
 * run. While the consent screen is in "Testing" status Google expires the
 * refresh token after 7 days, so step 4 has to be repeated periodically — a
 * `invalid_grant: Bad Request` from `print-access-token` is that expiry, not a
 * broken setup.
 *
 * ENV (required unless noted) — live values for the KCVV `GTM-P36Q8LHM`
 * container (account owned by kevin.van.ransbeeck@gmail.com — auth as that user):
 *   GTM_ACCOUNT_ID=4702633562
 *   GTM_CONTAINER_ID=247406304
 *   GTM_WORKSPACE_ID=10       (Default Workspace; or a fresh workspace's id)
 *   GTM_TRIGGER_NAME  (default "Custom Event — KCVV Analytics")
 *   GTM_TAG_NAME      (default "GA4 Event — KCVV Custom Events")
 *   GTM_DLV_PREFIX    (default "dlv - ")  — matches the live container convention
 *   GTM_WRITE_PACE_MS (default 4000) — minimum gap between two write calls.
 *                     Raise it if 429s still show up; the run just takes longer.
 *
 * Usage:
 *   node scripts/sync-gtm.mjs --dump
 *   node scripts/sync-gtm.mjs --dry-run
 *   node scripts/sync-gtm.mjs            # writes + creates an UNPUBLISHED version
 *   node scripts/sync-gtm.mjs --publish  # writes + creates + publishes it
 */

import { execSync } from "child_process";
import { params, buildTriggerRegex } from "./analytics-taxonomy.mjs";

const DRY_RUN = process.argv.includes("--dry-run");
const DUMP = process.argv.includes("--dump");
// Overwrite the live trigger RegEx even if it carries tokens absent from the
// taxonomy (e.g. stale/superseded ones). Without it, a real run aborts on those.
const FORCE_REGEX = process.argv.includes("--force-regex");
// Publish the created version too, so a run needs no follow-up in the GTM UI.
const PUBLISH = process.argv.includes("--publish");

const ACCOUNT_ID = reqEnv("GTM_ACCOUNT_ID");
const CONTAINER_ID = reqEnv("GTM_CONTAINER_ID");
const WORKSPACE_ID = reqEnv("GTM_WORKSPACE_ID");
const TRIGGER_NAME = process.env.GTM_TRIGGER_NAME ?? "Custom Event — KCVV Analytics";
const TAG_NAME = process.env.GTM_TAG_NAME ?? "GA4 Event — KCVV Custom Events";
const DLV_PREFIX = process.env.GTM_DLV_PREFIX ?? "dlv - ";
const WRITE_PACE_MS = Number(process.env.GTM_WRITE_PACE_MS ?? 4000);

const API = "https://tagmanager.googleapis.com/tagmanager/v2";
const WS = `${API}/accounts/${ACCOUNT_ID}/containers/${CONTAINER_ID}/workspaces/${WORKSPACE_ID}`;

const TOKEN = getToken();

function reqEnv(name) {
  const v = process.env[name];
  if (!v) {
    console.error(`Error: ${name} is required (see the usage header for all env vars).`);
    process.exit(1);
  }
  return v;
}

function getToken() {
  try {
    return execSync("gcloud auth application-default print-access-token", {
      stdio: ["pipe", "pipe", "pipe"],
    })
      .toString()
      .trim();
  } catch {
    console.error("Could not get a gcloud ADC token. See the AUTH section in this file's header.");
    process.exit(1);
  }
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function api(method, url, body, attempt = 0) {
  const res = await fetch(url, {
    method,
    headers: {
      Authorization: `Bearer ${TOKEN}`,
      ...(body ? { "Content-Type": "application/json" } : {}),
    },
    ...(body ? { body: JSON.stringify(body) } : {}),
    signal: AbortSignal.timeout(30_000),
  });
  // GTM API v2 has a low per-minute write quota; back off + retry on 429/5xx.
  // Writes are already paced by `write()`, so a 429 here means the quota is
  // tighter than GTM_WRITE_PACE_MS assumes — wait it out rather than give up.
  if ((res.status === 429 || res.status >= 500) && attempt < 8) {
    const retryAfter = Number(res.headers.get("retry-after"));
    const waitMs = retryAfter > 0 ? retryAfter * 1000 : Math.min(2000 * 2 ** attempt, 60000);
    console.warn(`  …${res.status} on ${method} ${url.split("/").pop()}; retrying in ${Math.round(waitMs / 1000)}s`);
    await sleep(waitMs);
    return api(method, url, body, attempt + 1);
  }
  const text = await res.text();
  const json = text ? JSON.parse(text) : {};
  if (!res.ok) {
    throw new Error(`${method} ${url} → ${res.status}: ${json?.error?.message ?? text}`);
  }
  return json;
}

/**
 * Every mutating call goes through here: one at a time, never closer together
 * than GTM_WRITE_PACE_MS. Serialising on a single promise chain keeps the gap
 * honest even though callers `await` in a loop, and means a burst can never
 * form in the first place — `api()`'s backoff is then only a safety net.
 */
let writeChain = Promise.resolve();
let lastWriteAt = 0;
function write(method, url, body) {
  writeChain = writeChain.then(async () => {
    const since = Date.now() - lastWriteAt;
    if (lastWriteAt > 0 && since < WRITE_PACE_MS) await sleep(WRITE_PACE_MS - since);
    lastWriteAt = Date.now();
    return api(method, url, body);
  });
  return writeChain;
}

/**
 * Re-read an entity by path, then PUT it with GTM's optimistic-concurrency
 * `fingerprint`. Two things this buys over PUTting the copy fetched at plan
 * time: the mutation applies to whatever the entity looks like NOW (a paced
 * run can spend minutes between planning and writing), and a concurrent edit
 * in the GTM UI makes the write fail loudly instead of silently reverting it.
 */
async function updateEntity(path, mutate, label) {
  const fresh = await api("GET", `${API}/${path}`);
  const updated = structuredClone(fresh);
  if (mutate(updated) === false) {
    console.log(`• ${label}: already up to date on re-read; skipped`);
    return null;
  }
  const url = `${API}/${path}?fingerprint=${encodeURIComponent(fresh.fingerprint ?? "")}`;
  try {
    return await write("PUT", url, updated);
  } catch (e) {
    if (String(e.message).includes("409") || /fingerprint/i.test(e.message)) {
      throw new Error(
        `${label}: changed in GTM while this run was in flight. Nothing was written — re-run the script.`,
      );
    }
    throw e;
  }
}

/** Find the entity named `name` in a `GET list` response keyed by `key`. */
function findByName(list, key, name) {
  return (list[key] ?? []).find((e) => e.name === name);
}

/**
 * The taxonomy's dataLayer keys (== GA4 param names), deduped. The Set is what
 * every plan is built from, so a key listed twice in the taxonomy (easy to do
 * when a param serves two event families) can never become two DLVs.
 */
const TAXONOMY_KEYS = new Set(params.map((p) => p.parameterName));
const TAXONOMY_KEY_LIST = [...TAXONOMY_KEYS];

/** DLV resource for a dataLayer key. The key lives in the `name` parameter. */
function dlvResource(key) {
  return {
    name: `${DLV_PREFIX}${key}`,
    type: "v",
    parameter: [
      { type: "integer", key: "dataLayerVersion", value: "2" },
      { type: "boolean", key: "setDefaultValue", value: "false" },
      { type: "template", key: "name", value: key },
    ],
  };
}

/** The dataLayer key a DLV variable reads (its `name` parameter value). */
function dlvKey(variable) {
  return variable.parameter?.find((p) => p.key === "name")?.value;
}

/** The arg1 (regex) value of a customEvent trigger's matchRegex filter. */
function triggerRegexParam(trigger) {
  const filter = (trigger.customEventFilter ?? []).find((f) => f.type === "matchRegex");
  return filter?.parameter?.find((p) => p.key === "arg1");
}

/** The GA4 Event tag's custom-param list ("eventSettingsTable" or "eventParameters"). */
function tagParamList(tag) {
  return (tag.parameter ?? []).find(
    (p) => p.type === "list" && (p.key === "eventSettingsTable" || p.key === "eventParameters"),
  );
}

/** Param names already present as rows in the GA4 tag's custom-param list. */
function tagParamNames(tag) {
  const list = tagParamList(tag)?.list ?? [];
  return list
    .map((row) => row.map?.find((m) => m.key === "parameter")?.value)
    .filter(Boolean);
}

/**
 * Index a live variables list two ways: DLVs by the dataLayer key they read
 * (how we decide a key is already covered) and ALL variable names (how we
 * avoid POSTing a name the container already uses for something else).
 */
function indexVariables(variablesList) {
  const byKey = new Map();
  const names = new Set();
  for (const v of variablesList.variable ?? []) {
    if (v.name) names.add(v.name);
    if (v.type === "v") {
      const key = dlvKey(v);
      if (key) byKey.set(key, v);
    }
  }
  return { byKey, names };
}

function tagParamRow(name) {
  return {
    type: "map",
    map: [
      { type: "template", key: "parameter", value: name },
      { type: "template", key: "parameterValue", value: `{{${DLV_PREFIX}${name}}}` },
    ],
  };
}

async function main() {
  // ── Load live entities ────────────────────────────────────────────────
  const [variablesList, triggersList, tagsList] = await Promise.all([
    api("GET", `${WS}/variables`),
    api("GET", `${WS}/triggers`),
    api("GET", `${WS}/tags`),
  ]);

  const trigger = findByName(triggersList, "trigger", TRIGGER_NAME);
  const tag = findByName(tagsList, "tag", TAG_NAME);
  if (!trigger) throw new Error(`Trigger "${TRIGGER_NAME}" not found (set GTM_TRIGGER_NAME).`);
  if (!tag) throw new Error(`Tag "${TAG_NAME}" not found (set GTM_TAG_NAME).`);

  if (DUMP) {
    console.log(JSON.stringify({ trigger, tag, variables: variablesList.variable ?? [] }, null, 2));
    return;
  }

  const { byKey: liveDlvByKey, names: liveVarNames } = indexVariables(variablesList);

  // ── 1. Trigger regex (abort if live has an unknown token) ─────────────
  const canonical = buildTriggerRegex();
  const canonicalTokens = canonical.split("|");
  const liveRegex = triggerRegexParam(trigger)?.value ?? "";
  // Tolerate an anchored/grouped live regex (`^(a|b|c)$`) when token-checking.
  const liveTokens = liveRegex
    .replace(/^\^?\(?/, "")
    .replace(/\)?\$?$/, "")
    .split("|")
    .filter(Boolean);
  const unknownTokens = liveTokens.filter((t) => !canonicalTokens.includes(t));
  const regexNeedsUpdate = liveRegex !== canonical;
  if (unknownTokens.length > 0) {
    const msg =
      `live trigger RegEx carries token(s) absent from the taxonomy: ${unknownTokens.join(", ")}\n` +
      `  → if stale/superseded, rerun with --force-regex to overwrite; if a real manual\n` +
      `    addition, add it to scripts/analytics-taxonomy.mjs first.`;
    if (DRY_RUN || FORCE_REGEX) {
      console.warn(`WARNING: ${msg}`);
    } else {
      console.error(`ABORT: ${msg}`);
      process.exit(2);
    }
  }

  // ── 2. DLVs to create (deduped by dataLayer key) ──────────────────────
  const dlvCandidates = TAXONOMY_KEY_LIST.filter((k) => !liveDlvByKey.has(k));
  // A variable already holding the target NAME but reading a different key is
  // not ours to overwrite, and POSTing it again would either 409 or leave two
  // same-named variables. Report it and let a human decide.
  const dlvNameConflicts = dlvCandidates.filter((k) => liveVarNames.has(`${DLV_PREFIX}${k}`));
  const dlvsToCreate = dlvCandidates.filter((k) => !liveVarNames.has(`${DLV_PREFIX}${k}`));

  // ── 3. GA4 tag param rows to add (deduped by name) ────────────────────
  const liveTagParams = new Set(tagParamNames(tag));
  const tagRowsToAdd = TAXONOMY_KEY_LIST.filter((k) => !liveTagParams.has(k));

  // ── Orphan report (read-only) ─────────────────────────────────────────
  const orphanDlvs = [...liveDlvByKey.keys()].filter((k) => !TAXONOMY_KEYS.has(k));
  const orphanTagParams = [...liveTagParams].filter((k) => !TAXONOMY_KEYS.has(k));

  // ── Plan ──────────────────────────────────────────────────────────────
  console.log("── Plan ───────────────────────────────────────────");
  console.log(`Trigger regex: ${regexNeedsUpdate ? "UPDATE" : "up-to-date"}`);
  if (regexNeedsUpdate) {
    console.log(`  live:      ${liveRegex || "(empty)"}`);
    console.log(`  canonical: ${canonical}`);
  }
  console.log(`DLVs to create (${dlvsToCreate.length}): ${dlvsToCreate.join(", ") || "—"}`);
  if (dlvNameConflicts.length > 0) {
    console.log(
      `  ! name already taken by a non-DLV / mismatched variable (${dlvNameConflicts.length}), skipped: ${dlvNameConflicts.join(", ")}`,
    );
  }
  console.log(`GA4 tag param rows to add (${tagRowsToAdd.length}): ${tagRowsToAdd.join(", ") || "—"}`);
  const writeCount =
    (regexNeedsUpdate ? 1 : 0) + dlvsToCreate.length + (tagRowsToAdd.length > 0 ? 1 : 0) + 1;
  console.log(
    `Writes: ${writeCount}, paced ${WRITE_PACE_MS}ms apart → ~${Math.ceil((writeCount * WRITE_PACE_MS) / 1000)}s minimum.`,
  );
  console.log("── Orphan report (read-only; nothing deleted) ─────");
  console.log(`  regex tokens not in taxonomy (${unknownTokens.length}): ${unknownTokens.join(", ") || "—"}`);
  console.log(`  DLV keys not in taxonomy (${orphanDlvs.length}): ${orphanDlvs.join(", ") || "—"}`);
  console.log(`  tag param rows not in taxonomy (${orphanTagParams.length}): ${orphanTagParams.join(", ") || "—"}`);

  if (DRY_RUN) {
    console.log("\n--dry-run: no changes written.");
    return;
  }

  // ── Apply ───────────────────────────────────────────────────────────────
  if (regexNeedsUpdate) {
    await updateEntity(
      trigger.path,
      (updated) => {
        const param = triggerRegexParam(updated);
        if (param) {
          if (param.value === canonical) return false;
          param.value = canonical;
        } else {
          // Live trigger has no matchRegex filter yet — append one, preserving
          // any other existing filter conditions on the trigger.
          updated.customEventFilter = [
            ...(updated.customEventFilter ?? []),
            {
              type: "matchRegex",
              parameter: [
                { type: "template", key: "arg0", value: "{{_event}}" },
                { type: "template", key: "arg1", value: canonical },
              ],
            },
          ];
        }
      },
      "trigger regex",
    );
    console.log(`✓ trigger regex updated`);
  }

  // Re-read the variables right before creating any. Cheap insurance for two
  // cases: a trigger write above that spent minutes in backoff, and a re-run of
  // an interrupted sync, which must see the DLVs the previous attempt already
  // created rather than duplicate them.
  if (dlvsToCreate.length > 0) {
    const { byKey: freshDlvByKey, names: freshNames } = indexVariables(
      await api("GET", `${WS}/variables`),
    );
    for (const key of dlvsToCreate) {
      if (freshDlvByKey.has(key)) {
        console.log(`• DLV already present, skipped: ${DLV_PREFIX}${key}`);
        continue;
      }
      if (freshNames.has(`${DLV_PREFIX}${key}`)) {
        console.log(`! name taken by another variable, skipped: ${DLV_PREFIX}${key}`);
        continue;
      }
      await write("POST", `${WS}/variables`, dlvResource(key));
      console.log(`✓ DLV created: ${DLV_PREFIX}${key}`);
    }
  }

  if (tagRowsToAdd.length > 0) {
    await updateEntity(
      tag.path,
      (updated) => {
        // Re-dedupe against the freshly-read tag, not the planned snapshot.
        const present = new Set(tagParamNames(updated));
        const rows = tagRowsToAdd.filter((k) => !present.has(k));
        if (rows.length === 0) return false;
        let list = tagParamList(updated);
        if (!list) {
          list = { type: "list", key: "eventSettingsTable", list: [] };
          updated.parameter = [...(updated.parameter ?? []), list];
        }
        list.list = [...(list.list ?? []), ...rows.map(tagParamRow)];
      },
      "GA4 tag param rows",
    );
    console.log(`✓ GA4 tag param rows added: ${tagRowsToAdd.length}`);
  }

  // ── Container version ───────────────────────────────────────────────────
  const version = await write("POST", `${WS}:create_version`, {
    name: "KCVV analytics taxonomy sync",
    notes: `Automated by scripts/sync-gtm.mjs (#1974). Trigger RegEx: ${canonical}`,
  });
  const created = version?.containerVersion;
  const id = created?.containerVersionId ?? "(see GTM UI)";

  if (!PUBLISH) {
    console.log(`\n✓ Created UNPUBLISHED container version ${id}. Review + publish it in the GTM UI.`);
    return;
  }

  if (!created?.path) {
    throw new Error(`Version ${id} created, but no path came back — publish it in the GTM UI.`);
  }
  await write("POST", `${API}/${created.path}:publish`);
  console.log(`\n✓ Created AND PUBLISHED container version ${id}. Events reach GA4 from now on.`);
  console.log(`  Roll back by re-publishing the previous version in the GTM UI.`);
}

main().catch((e) => {
  console.error(e.message);
  process.exit(1);
});
