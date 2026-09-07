import { Effect } from "effect";
import { runPromise } from "@/lib/effect/runtime";
import { degradeSection } from "@/lib/effect/degrade";
import { SponsorRepository } from "@/lib/repositories/sponsor.repository";
import { SponsorsBlock } from "@/components/sponsors";
import type { Sponsor } from "@/components/sponsors";

export interface SponsorsSectionProps {
  className?: string;
}

export async function SponsorsSection({ className }: SponsorsSectionProps) {
  const sponsors = await runPromise(
    // `degradeSection`, not `Effect.catchAll` — `SponsorRepository.findAll()`
    // is typed `Effect<SponsorVM[]>` (every Sanity read ends in
    // `Effect.orDie`), so a `catchAll` on it type-checks but never runs
    // (#2505 round-3 review finding M1).
    degradeSection(
      Effect.gen(function* () {
        const repo = yield* SponsorRepository;
        const all = yield* repo.findAll();
        return all
          .filter(
            (s) =>
              s.tier === "hoofdsponsor" ||
              s.tier === "sponsor" ||
              (!s.tier &&
                s.type &&
                ["crossing", "green", "white"].includes(s.type)),
          )
          .map((s): Sponsor => ({
            id: s.id,
            name: s.name,
            logo: s.logoUrl ?? "",
            url: s.url ?? undefined,
            tier: s.tier ?? "sponsor",
          }));
      }),
      [] as Sponsor[],
      "[SponsorsSection] sponsors read failed; falling back to an empty list.",
    ),
  );

  return <SponsorsBlock sponsors={sponsors} className={className} />;
}
