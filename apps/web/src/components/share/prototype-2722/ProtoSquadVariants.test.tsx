import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { KickoffTemplate } from "../KickoffTemplate/KickoffTemplate";
import { ShareBadgeContext } from "../shared/ShareFrame";
import { ProtoVariantContext, type ProtoVariant } from "./ProtoSquadVariants";

/**
 * PROTOTYPE — #2722. Throwaway. Not a spec.
 *
 * The prototype is judged by eye in the browser; this only proves each variant
 * mounts and puts the squad SOMEWHERE, so a broken variant is not mistaken for
 * a design verdict.
 */
function renderKickoff(variant: ProtoVariant, badge: string | undefined) {
  return render(
    <ProtoVariantContext.Provider value={variant}>
      <ShareBadgeContext.Provider value={badge}>
        <KickoffTemplate matchName="KFC Eppegem — KCVV Elewijt" />
      </ShareBadgeContext.Provider>
    </ProtoVariantContext.Provider>,
  );
}

describe("PROTOTYPE #2722 squad variants", () => {
  it("off — keeps the shipped #2700 corner mark", () => {
    renderKickoff("off", "B");
    expect(screen.getByText("B")).toBeInTheDocument();
    expect(screen.queryByText("B-PLOEG")).not.toBeInTheDocument();
  });

  it("A — corner flash still carries the short label", () => {
    renderKickoff("A", "B");
    expect(screen.getByText("B")).toBeInTheDocument();
  });

  it("B — band carries the full label and drops the corner mark", () => {
    renderKickoff("B", "B");
    expect(screen.getByText("B-PLOEG")).toBeInTheDocument();
    expect(screen.queryByText("B")).not.toBeInTheDocument();
  });

  it("B — a federation age code passes through to the band unexpanded", () => {
    renderKickoff("B", "U15");
    expect(screen.getByText("U15")).toBeInTheDocument();
  });

  it("C — squad rides the club name, and nothing else", () => {
    renderKickoff("C", "B");
    expect(screen.getByText("KCVV Elewijt B")).toBeInTheDocument();
    expect(screen.queryByText("B")).not.toBeInTheDocument();
    expect(screen.queryByText("B-PLOEG")).not.toBeInTheDocument();
  });

  it("C — leaves the opponent name alone", () => {
    renderKickoff("C", "B");
    expect(screen.getByText("KFC Eppegem")).toBeInTheDocument();
  });

  it.each(["off", "A", "B", "C"] as const)(
    "%s — an absent squad renders no mark, band or dangling suffix",
    (variant) => {
      renderKickoff(variant, undefined);
      expect(screen.getByText("KCVV Elewijt")).toBeInTheDocument();
      expect(screen.queryByText("B-PLOEG")).not.toBeInTheDocument();
    },
  );
});
