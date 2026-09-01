// apps/web/src/lib/utils/card-subject-artefact.test.tsx
import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { getCardSubjectArtefact } from "./card-subject-artefact";

describe("getCardSubjectArtefact", () => {
  it("returns undefined for a document subject — the hatch stays NewsCard's own default", () => {
    expect(getCardSubjectArtefact({ kind: "document" })).toBeUndefined();
  });

  it("resolves a player person to the jersey garment", () => {
    const { getByTestId } = render(
      <>
        {getCardSubjectArtefact({
          kind: "person",
          personType: "player",
          id: "player-1",
        })}
      </>,
    );
    expect(getByTestId("jersey-illustration")).toHaveAttribute(
      "data-garment",
      "jersey",
    );
  });

  it("resolves a staff person to the coat garment — #2485's amendment", () => {
    const { getByTestId } = render(
      <>
        {getCardSubjectArtefact({
          kind: "person",
          personType: "staff",
          id: "staff-1",
        })}
      </>,
    );
    expect(getByTestId("jersey-illustration")).toHaveAttribute(
      "data-garment",
      "coat",
    );
  });

  it("resolves the same seed to the same figure for a person subject", () => {
    const first = render(
      <>
        {getCardSubjectArtefact({
          kind: "person",
          personType: "player",
          id: "stable-id",
        })}
      </>,
    );
    const firstMarkup = first.container.innerHTML;
    first.unmount();

    const second = render(
      <>
        {getCardSubjectArtefact({
          kind: "person",
          personType: "player",
          id: "stable-id",
        })}
      </>,
    );
    expect(second.container.innerHTML).toBe(firstMarkup);
    second.unmount();
  });

  it("resolves a team to a contained JerseyShirt on a cream-soft ground", () => {
    const { container } = render(
      <>{getCardSubjectArtefact({ kind: "team", ageLabel: "U14" })}</>,
    );
    expect(container.querySelector(".bg-cream-soft")).toBeInTheDocument();
    expect(container.textContent).toContain("U14");
  });

  it("resolves a team without an age label — JerseyShirt renders no letter overlay", () => {
    const { container } = render(
      <>{getCardSubjectArtefact({ kind: "team" })}</>,
    );
    expect(container.querySelector(".bg-cream-soft")).toBeInTheDocument();
    expect(container.textContent).toBe("");
  });

  it("resolves a club to a contained Crest — real logo", () => {
    // #2472: `<Crest>` does not — and must not — try to tell a real crest
    // apart from PSD's generic grey-shield placeholder. Any truthy URL
    // (real or placeholder) renders through this exact same path, with no
    // detection of any kind.
    const { container } = render(
      <>
        {getCardSubjectArtefact({
          kind: "club",
          name: "KFC Zemst",
          logoUrl: "/images/logos/clubs/dummy-vert.svg",
        })}
      </>,
    );
    const img = container.querySelector("img");
    expect(img).toHaveAttribute("src", "/images/logos/clubs/dummy-vert.svg");
    expect(img).toHaveClass("object-contain");
  });

  it("a club with no logo falls to Crest's own initialled-disc — never invented here", () => {
    const { container } = render(
      <>{getCardSubjectArtefact({ kind: "club", name: "SK Laar" })}</>,
    );
    expect(container.querySelector("img")).not.toBeInTheDocument();
    expect(container.textContent).toBe("S");
  });
});
