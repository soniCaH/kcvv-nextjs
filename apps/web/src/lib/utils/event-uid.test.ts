import { describe, expect, it } from "vitest";
import { buildEventUid } from "./event-uid";

describe("buildEventUid", () => {
  it("namespaces the id under kcvv-event- with the club domain", () => {
    expect(buildEventUid("abc123")).toBe("kcvv-event-abc123@kcvvelewijt.be");
  });
});
