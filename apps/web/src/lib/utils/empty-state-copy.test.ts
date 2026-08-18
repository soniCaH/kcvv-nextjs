import { describe, it, expect } from "vitest";
import { filteredEmptyBody, pendingEmptyBody } from "./empty-state-copy";

describe("filteredEmptyBody", () => {
  it("builds the standard filter-emptied sentence", () => {
    expect(filteredEmptyBody("het volledige overzicht")).toBe(
      "Probeer een andere categorie, of bekijk het volledige overzicht.",
    );
  });
});

describe("pendingEmptyBody", () => {
  it("defaults to singular agreement", () => {
    expect(
      pendingEmptyBody("er een wedstrijd of evenement gepland wordt", "het"),
    ).toBe(
      "Zodra er een wedstrijd of evenement gepland wordt, verschijnt het hier.",
    );
  });

  it("uses plural agreement when asked", () => {
    expect(
      pendingEmptyBody("de kalender is vrijgegeven", "de wedstrijden", true),
    ).toBe(
      "Zodra de kalender is vrijgegeven, verschijnen de wedstrijden hier.",
    );
  });
});
