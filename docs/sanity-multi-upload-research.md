# Sanity 6.3 — Multi-File Upload on Arrays of `image`

> **Question:** does Sanity Studio v6.3 apply its native multi-file upload to an array whose `of`
> contains an `image` type that carries custom `fields` (`alt`, `caption`, `credit`)?
>
> **Context:** research ticket [#2352](https://github.com/soniCaH/www.kcvvelewijt.be/issues/2352),
> part of map [#2348](https://github.com/soniCaH/www.kcvvelewijt.be/issues/2348).
> Target schema: `packages/sanity-schemas/src/photoGallery.ts` → field `images`.

## Sources

| Source                                                                                                                                    | What it is                                                                                                                                                                                         | Trust   |
| ----------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------- |
| `sanity@6.3.0` in `node_modules`                                                                                                          | The installed studio runtime. Original TypeScript recovered from the shipped sourcemaps (`lib/_chunks-es/*.js.map`, which ship `sourcesContent`). Paths below are the package's own `src/…` paths. | Primary |
| `@sanity/schema@6.3.0`                                                                                                                    | Executed directly (schema compiler probe, see [Re-verifying](#re-verifying))                                                                                                                       | Primary |
| [Image \| Sanity Docs](https://www.sanity.io/docs/studio/image-type)                                                                      | Official v6 docs                                                                                                                                                                                   | Primary |
| [Technical limits \| Sanity Docs](https://www.sanity.io/docs/content-lake/technical-limits)                                               | Official Content Lake limits                                                                                                                                                                       | Primary |
| [MDN — `FileSystemDirectoryReader.readEntries()`](https://developer.mozilla.org/en-US/docs/Web/API/FileSystemDirectoryReader/readEntries) | Browser API behaviour                                                                                                                                                                              | Primary |
| [sanity-io/sanity#12129](https://github.com/sanity-io/sanity/issues/12129), [#1804](https://github.com/sanity-io/sanity/issues/1804)      | Upstream issues (both closed)                                                                                                                                                                      | Primary |

No community blog posts were used. Quoted source snippets are semantically verbatim but have been
restyled by this repo's Prettier config (semicolons, double quotes) — Sanity's own sources use
`semi: false` / `singleQuote: true`.

**Versions:** `apps/studio` and `apps/studio-staging` both pin `sanity@6.3.0`.
`packages/sanity-schemas` and `packages/sanity-studio` declare `sanity@6.1.0` as peer + dev only, so
the runtime that matters is 6.3.0.

---

## Verdict

| #   | Question                           | Answer                                                                                                                                                                                                         |
| --- | ---------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | Multi-upload with custom `fields`? | **Yes.** Adding `fields: [...]` to an `image` array member does not degrade it. The gate is the schema **type chain**, not the field list.                                                                     |
| 2   | Is file order preserved?           | **Yes**, deterministically — item slots are created synchronously in file order, before any upload resolves.                                                                                                   |
| 3   | Filename → `alt` seeding?          | **No built-in seeding.** The filename only reaches the transient `_upload.file.name` and the asset's `originalFilename`. Supported hooks exist (custom array input, custom `Uploader`).                        |
| 4   | Practical ceiling on one drop?     | **No file-count cap.** Sanity throttles _network_ uploads to **4 concurrent** (FIFO queue). Per-file thumbnail generation is **not** throttled — that, not Sanity or the API, is the real risk at 50-80 files. |

---

## How the studio decides a drop is uploadable

Both array layouts wrap their item list in an upload target and hand it the **array member types**:

```tsx
// src/core/form/inputs/arrays/ArrayOfObjectsInput/List/ListArrayInput.tsx  (same in Grid/GridArrayInput.tsx)
<UploadTargetCard
  {...elementProps}
  onSelectFile={onSelectFile}
  onUpload={onUpload}
  types={schemaType.of}
>
```

`UploadTargetCard` → `uploadTarget()` → `handleFiles()` → `getFilesAndAssetSources()`. That last
function is the literal answer to question 1:

```ts
// src/core/form/inputs/files/common/uploadTarget/uploadTarget.tsx  →  getFilesAndAssetSources()
const imageType = types.find((type) => _isType(type, "image"));
const fileType = types.find((type) => _isType(type, "file"));
const videoType = types.find((type) => _isType(type, "sanity.video"));

return files.map((file) => {
  if (
    imageType &&
    file.type.startsWith("image/") &&
    imageAssetSource &&
    matchesSchemaTypeAccept(file, imageType, "image")
  ) {
    return { file, schemaType: imageType, assetSource: imageAssetSource };
  }
  // …file, then video…
  return { file, schemaType: null, assetSource: null }; // ← rejected
});
```

And `_isType` walks the **type chain**, never the fields:

```ts
// src/core/util/schemaUtils.ts
export function _isType(schemaType: SchemaType, typeName: string): boolean {
  if (schemaType.name === typeName) return true;
  if (!schemaType.type) return false;
  return _isType(schemaType.type, typeName);
}
```

The same predicate exists a second time as `is.type()` in `src/core/form/utils/is.ts`, used by
`resolveUploader()` (`src/core/form/studio/uploads/resolveUploader.ts`) and by
`resolveUploadAssetSources()` (`src/core/form/studio/uploads/resolveUploadAssetSources.ts`).
Every gate on the path is a type-chain check. **Nothing anywhere inspects `fields`.**

Entries whose `assetSource` is `null` are rejected with a toast
(`inputs.array.error.cannot-upload-unable-to-convert`, "…can't be uploaded because there's no known
conversion…"). If _every_ entry is rejected, the drop is a no-op.

---

## 1. Does multi-upload work with custom `fields`? — Yes

Compiling the current and the proposed schema with the real `@sanity/schema@6.3.0` compiler and
running `_isType` over the resulting member types:

| Array member definition                                                                     | Compiled type chain     | `_isType(member, 'image')` | Multi-drop  |
| ------------------------------------------------------------------------------------------- | ----------------------- | -------------------------- | ----------- |
| `{name: 'galleryImage', type: 'object', fields: [image, alt, caption, credit]}` — **today** | `galleryImage → object` | `false`                    | ❌ rejected |
| `{name: 'galleryImage', type: 'image', fields: [alt, caption, credit]}`                     | `galleryImage → image`  | `true`                     | ✅ works    |
| `{type: 'image', fields: [alt, caption]}` (anonymous)                                       | `image → image`         | `true`                     | ✅ works    |

The compiler merges the custom fields into the intrinsic image fields rather than replacing them —
the flattened member compiles to `asset, media, hotspot, crop, alt, caption, credit`. So `hotspot`
and `crop` survive, and the custom metadata sits **beside** them on the same object.

This also confirms the map's premise: the current `photoGallery.images` shape (array of a plain
`object` that _wraps_ an image) is exactly the case upstream
[#1804](https://github.com/sanity-io/sanity/issues/1804) asked for and never got. That issue is
closed without the feature.

### Consequences of flattening

- **Item `_type` changes.** Named member → `_type: 'galleryImage'`; anonymous → `_type: 'image'`
  (`createProtoValue`, `src/core/form/utils/createProtoValue.ts`: `type.name === 'object' ? {} : {_type: type.name}`).
- **The nested `image` object disappears.** `images[].image.asset` becomes `images[].asset`. That is
  the five-query frontend contract change already flagged on #2348
  (`apps/web/src/lib/repositories/photoGallery.repository.ts`).
- **Mixed-type arrays are safe on 6.3.** `getFilesAndAssetSources` picks the _first_ image-ish member
  and silently ignores non-uploadable members. The older behaviour reported in
  [#12129](https://github.com/sanity-io/sanity/issues/12129) — one non-image member poisoning the whole
  drop — does not exist in this code path.
- **Drop and paste only; there is no "select many" button.** `ArrayOfObjectsFunctions.tsx` renders
  only _Add item_ (which appends one empty item). `openFilePicker({multiple})` is used exclusively by
  the File/Image _inputs_ (`UploadDropDownMenu.tsx`, `FileInputMenuItem.tsx`), never by the array. So
  the bulk path is: drag files onto the array, or paste them onto the focused array.
- **Asset-source destination picker.** If more than one upload-capable asset source is registered,
  every drop first shows a destination picker (`uploadTarget.tsx`, `uniqueAssetSources.length > 1`).
  Both our studios register only the default dataset source (Media Library defaults to
  `enabled: false` in `src/core/config/prepareConfig.tsx` and neither `sanity.config.ts` enables it),
  so the picker never appears.

Official docs agree, under **Image → Uploading images via Drag & Drop or Paste**:

> Arrays of images accept batches of files to be dropped on them.

> When you drag and drop images into the Portable Text Editor or an Array field in Sanity Studio, it
> will automatically pick the most suitable field to add the image to based on the `accept` option
> configured on the image fields. If multiple fields match the dropped image type, it will use the
> first matching field.

…and the same page documents `fields` on the image type ("useful for adding custom properties like
caption, attribution, etc.") with **no** caveat about upload behaviour.

---

## 2. Is file order preserved? — Yes

Every step from the drop event to the inserted array item is order-preserving, and no step waits on
an upload:

1. `extractDroppedFiles(dataTransfer)` returns `Array.from(dataTransfer.files)` unchanged
   (`src/core/form/inputs/files/common/fileTarget/utils/extractFiles.ts`).
2. `getFilesAndAssetSources()` is `files.map(...)`; `handleFiles`/`handleUploadFiles` only `.filter()`
   the result — both order-preserving.
3. `handleUploadFiles` then does a **synchronous** `ready.forEach((entry) => onSelectFile({...}))`.
4. Each `onSelectFile` (→ `handleSelectFile`, `src/core/form/members/object/fields/ArrayOfObjectsField.tsx`)
   creates a proto item with a fresh `_key` and appends it immediately:

   ```ts
   handleInsert({
     items: [item],
     position: "after",
     referenceItem: -1,
     open: false,
   });
   handleChange(
     PatchEvent.from(createInitialUploadPatches(file)).prefixAll({ _key: key }),
   );
   ```

   `insert(items, 'after', [-1])` resolves to an append —
   `arrayInsert` (`src/core/form/patch/arrayInsert.ts`) computes
   `idx = Math.abs((len + -1) % len) % len` = `len - 1`, then `normalizedIdx = idx + 1` = `len`.

5. Only _after_ the slot exists does the upload start (`uploader.upload([file], …)`), and every patch
   it emits is addressed by `{_key: key}`. **A slow file cannot overtake a fast one** — it can only
   fill in its own pre-allocated slot later.

So the array order equals the order the browser reports in `DataTransfer.files`.

**Residual risk (outside Sanity):** the order in `DataTransfer.files` is decided by the browser/OS
for a multi-file drag, not by Sanity. Nothing in the studio re-sorts it, but it is not something
Sanity can guarantee either. Practical mitigation for the cover-image concern: the first item is
still drag-reorderable, and editors can verify the cover after the drop.

Two cosmetic side effects of the per-file insert loop, both harmless:
`onPathFocus` fires once per inserted item (focus lands on the last one), and `open: false` means
items do **not** pop open one by one (an old bug fixed long ago upstream).

---

## 3. Filename → `alt` seeding? — Not built in

There is **no** code path in `sanity@6.3.0` that copies a filename into a sibling document field. The
filename reaches exactly two places:

```ts
// src/core/form/studio/uploads/utils.ts  →  createInitialUploadPatches()
const value = {
  progress: 2,
  createdAt: now,
  updatedAt: now,
  file: { name: file.name, type: file.type },
};
return [set(value, [UPLOAD_STATUS_KEY])]; // UPLOAD_STATUS_KEY === '_upload'
```

1. **`_upload.file.name`** — transient only. `CLEANUP_EVENT` (same file) unsets the whole `_upload`
   object when the upload completes.
2. **`originalFilename` on the asset document** — set server-side when
   `options.storeOriginalFilename` is truthy (`preserveFilename` in
   `src/core/form/studio/inputs/client-adapters/assets.ts`). It lives on `sanity.imageAsset`, not on
   the referencing item, and every document referencing that asset shares it.

Grepping the whole package: `originalFilename` appears only in _display_ code (asset browser rows,
download filenames, `<Image alt={originalFilename}>` in the picker) and `altText` only in
upsell/free-trial marketing components plus the Media Library `videoAsset` schema. Nothing writes a
document field from a filename.

### Supported hooks, best first

| Hook                                          | API                                                                                                                                                                                             | Notes                                                                                                                                                                                                                                                     |
| --------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Custom array input wrapping `onSelectFile`    | `ArrayOfObjectsInputProps.onSelectFile` / `InputOnSelectFileFunctionProps` — both exported from `sanity`                                                                                        | Cleanest fit. The wrapper sees `{file, schemaType, assetSource}` **before** the item is inserted, so it can call through and then patch `alt` from `file.name` on the same `_key`. House pattern for custom inputs: `packages/sanity-studio/src/inputs/`. |
| Custom `AssetSource` with a custom `Uploader` | `AssetSourceUploaderClass` / `AssetSourceUploader`, exported from `@sanity/types`                                                                                                               | `upload(files, {schemaType, onChange})` can emit arbitrary patches, including `set(name, ['alt'])`. Heavier: replaces the whole dataset upload implementation (`src/core/form/studio/assetSourceDataset/uploader.ts`).                                    |
| Sanity Functions + Agent Actions              | `defineMediaLibraryAssetFunction`, `agent.action.prompt` — see Sanity's [auto-generate alt text recipe](https://www.sanity.io/recipes/auto-generate-alt-text-for-media-library-assets-53d0069d) | **Media Library only.** Writes an `aspects.altText` aspect on the _asset_, not the `alt` field on our array item. Not applicable while the studios use the dataset asset source.                                                                          |
| `initialValue` on the member type             | `InitialValueResolver`                                                                                                                                                                          | **Does not work here.** `resolveInitialArrayValues` runs against the schema type; the resolver never receives the `File`.                                                                                                                                 |

Sanity's own [recipe for populating fields from a file upload](https://www.sanity.io/recipes/populate-fields-with-data-from-a-file-upload-b5cccda5)
confirms the shape of the answer — it intercepts `onChange` in a custom input, watches for
`patch.type === 'set' && patch.path[0] === 'asset'`, and patches the sibling field. (It is written
against the pre-v3 form builder, so it is a pattern reference, not copy-paste code.)

---

## 4. Practical ceiling on one drop

**Sanity imposes no limit on the number of files in a drop.** There is no `MAX_FILES`, no slice, no
batching of the file list — grepped across `src/core/form`.

### What _is_ bounded

```ts
// src/core/form/studio/inputs/client-adapters/assets.ts
const MAX_CONCURRENT_UPLOADS = 4;
const uploadAsset = withMaxConcurrency(
  uploadSanityAsset,
  MAX_CONCURRENT_UPLOADS,
);
```

- `withMaxConcurrency` (`src/core/form/studio/utils/withMaxConcurrency.ts`) is a **FIFO** throttler —
  overflow observables go into `pendingObservables` and are released with `.shift()`. It is created
  at module scope, so the limit of 4 is **global to the studio session**, not per array or per drop.
- Everything inside the gate is throttled: the SHA-1 dedupe hash (which reads the _entire_ file into
  an `ArrayBuffer` via `FileReader`), the `*[_type == $documentType && sha1hash == $hash][0]` lookup,
  and the actual `client.assets.upload()`.
- Content Lake allows **25 req/s** `POST` to `/assets/` per IP (429 until the next one-second window),
  with a 100 MB max request body and 256 megapixel max image. 4 concurrent uploads is nowhere near
  that ceiling. **The API is not the constraint.**

### What is _not_ bounded — the actual risk

`uploadImage` merges an unthrottled preview branch alongside the throttled upload branch:

```ts
// src/core/form/studio/uploads/uploadImage.ts
return concat(
  of(createInitialUploadEvent(file)),
  merge(upload$, setPreviewUrl$),
  of(CLEANUP_EVENT),
);
```

`setPreviewUrl$` = `readExif(file)` (reads the first 128 KB) → `rotateImage(file, orientation)`,
which does `new Image()` on `URL.createObjectURL(file)` and draws it to a canvas. Because
`ArrayOfObjectsField.handleSelectFile` constructs **one `DatasetUploader` per file** and subscribes
immediately inside the synchronous `forEach`, all N preview pipelines start at once.

Assessed consequences (**inferred from source, not measured** — no studio run was performed):

- N full-resolution JPEG decodes live simultaneously in the tab. A 4000×3000 photo is roughly 48 MB
  decoded; 60-80 of them at once is the plausible failure mode long before Sanity or the API complain.
- `URL.createObjectURL(file)` in `rotateImage` is never revoked (the source carries a
  `// todo: cancel loading (if possible?)` comment), so those blobs are pinned for the tab's lifetime.
- The _output_ is cheap and not a concern: `orient()` renders at `THUMB_SIZE = 120` and emits
  `canvas.toDataURL('image/jpeg', 0.1)` — a few KB per item, and it lands in the transient `_upload`
  which is unset on completion.

### Hard truncation: folder drops

`walk()` in `extractFiles.ts` calls `dir.readEntries(resolve, reject)` **once**. Per MDN:

> In Chromium-based browsers, `readEntries()` will only return the first 100 `FileSystemEntry`
> instances. In order to obtain all of the instances, `readEntries()` must be called multiple times.

So **dragging a folder of >100 photos into Chrome silently drops everything past the first 100.**
This does _not_ affect a multi-file selection: `extractDroppedFiles` early-returns
`dataTransfer.files` whenever it is non-empty, and only falls back to `walk()` for directory entries.
Worth telling editors: select the files, don't drag the folder.

### Our schema's own `max(80)`

`photoGallery.images` carries `r.max(80).warning(...)`. `ArrayValidationProvider`
(`src/core/form/inputs/arrays/common/ArrayValidationContext.tsx`) reads the `max` **constraint**
regardless of its error/warning level and disables the _Add item_ button once `itemCount >= 80`.
`uploadTarget.handleFiles` does **not** consult it — its only guards are `isReadOnly`,
`disableUpload` (all asset members having `options.disableNew`) and `types.length === 0`. So a drop
can push the array past 80; the validation warning then fires as designed.

### Recommendation for the spec

A 50-80 file multi-select drop sits comfortably inside Sanity's own throttle and the Content Lake
rate limits. Ship it, and if the spec wants a belt: cap the drop in a custom input wrapper, or tell
editors to drop in batches of ~25. Do **not** build a queue to work around API limits — that is not
where the ceiling is.

---

## Re-verifying

Sanity ships `sourcesContent` in its sourcemaps, so the original TypeScript can be recovered without
cloning the repo:

```bash
# from the repo root, after pnpm install
SANITY_LIB=$(node -e "console.log(require.resolve('sanity/package.json'))" | xargs dirname)/lib/_chunks-es
node -e '
  const fs = require("fs"), path = require("path"), dir = process.env.SANITY_LIB
  for (const f of fs.readdirSync(dir).filter((n) => n.endsWith(".js.map"))) {
    const m = JSON.parse(fs.readFileSync(path.join(dir, f), "utf8"))
    if (!m.sourcesContent) continue
    m.sources.forEach((s, i) => {
      const dest = path.join("/tmp/sanity-src", s.replace(/^(\.\.\/)+/, ""))
      if (m.sourcesContent[i] == null || fs.existsSync(dest)) return
      fs.mkdirSync(path.dirname(dest), {recursive: true})
      fs.writeFileSync(dest, m.sourcesContent[i])
    })
  }
'
```

The type-chain probe behind the table in [section 1](#1-does-multi-upload-work-with-custom-fields--yes):

```javascript
import { Schema } from "@sanity/schema";

// mirrors sanity's src/core/util/schemaUtils.ts -> _isType
const isType = (t, name) =>
  t.name === name ? true : t.type ? isType(t.type, name) : false;

const arrayOf = (member) => ({
  name: "probeDoc",
  type: "document",
  fields: [{ name: "images", type: "array", of: [member] }],
});

const schema = Schema.compile({
  name: "probe",
  types: [
    arrayOf({
      name: "galleryImage",
      type: "image",
      fields: [{ name: "alt", type: "string" }],
    }),
  ],
});

const member = schema.get("probeDoc").fields.find((f) => f.name === "images")
  .type.of[0];
console.log(isType(member, "image")); // => true
console.log(member.fields.map((f) => f.name)); // => asset, media, hotspot, crop, alt
```
