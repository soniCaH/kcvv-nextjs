import { describe, expect, it } from "vitest";
import { buildEventUid } from "./event-uid";

describe("buildEventUid", () => {
  it("namespaces the id under kcvv-event- with the club domain", () => {
    expect(buildEventUid("abc123")).toBe("kcvv-event-abc123@kcvvelewijt.be");
  });

  it("is pure: the same id always produces the same UID", () => {
    expect(buildEventUid("mosselfeest-id")).toBe(
      buildEventUid("mosselfeest-id"),
    );
  });

  it("produces distinct UIDs for distinct ids", () => {
    expect(buildEventUid("a")).not.toBe(buildEventUid("b"));
  });
});
