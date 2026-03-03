import { describe, it, expect } from "vitest";
import { Schema as S } from "effect";
import {
  RouterResponse,
  RouterEntity,
  RouterRedirect,
  RouterJsonApi,
} from "./router.schema";

describe("router.schema", () => {
  describe("RouterEntity", () => {
    it("should decode valid entity", () => {
      const input = {
        canonical: "http://api.kcvvelewijt.be/team/a-ploeg",
        type: "node",
        bundle: "team",
        id: "13",
        uuid: "01c24c48-ecfe-4c8c-bfac-87824c8f3194",
      };

      const result = S.decodeUnknownSync(RouterEntity)(input);

      expect(result.type).toBe("node");
      expect(result.bundle).toBe("team");
      expect(result.uuid).toBe("01c24c48-ecfe-4c8c-bfac-87824c8f3194");
    });
  });

  describe("RouterRedirect", () => {
    it("should decode valid redirect", () => {
      const input = {
        from: "/team/u15",
        to: "/jeugd/u15",
        status: "301",
      };

      const result = S.decodeUnknownSync(RouterRedirect)(input);

      expect(result.from).toBe("/team/u15");
      expect(result.to).toBe("/jeugd/u15");
      expect(result.status).toBe("301");
    });
  });

  describe("RouterJsonApi", () => {
    it("should decode valid jsonapi info", () => {
      const input = {
        individual:
          "http://api.kcvvelewijt.be/jsonapi/node/team/01c24c48-ecfe-4c8c-bfac-87824c8f3194",
        resourceName: "node--team",
        basePath: "/jsonapi",
        entryPoint: "http://api.kcvvelewijt.be/jsonapi",
      };

      const result = S.decodeUnknownSync(RouterJsonApi)(input);

      expect(result.resourceName).toBe("node--team");
      expect(result.basePath).toBe("/jsonapi");
    });

    it("should handle optional pathPrefix", () => {
      const input = {
        individual:
          "http://api.kcvvelewijt.be/jsonapi/node/team/01c24c48-ecfe-4c8c-bfac-87824c8f3194",
        resourceName: "node--team",
        pathPrefix: "jsonapi",
        basePath: "/jsonapi",
        entryPoint: "http://api.kcvvelewijt.be/jsonapi",
      };

      const result = S.decodeUnknownSync(RouterJsonApi)(input);

      expect(result.pathPrefix).toBe("jsonapi");
    });
  });

  describe("RouterResponse", () => {
    it("should decode complete response without redirect", () => {
      const input = {
        resolved: "http://api.kcvvelewijt.be/team/a-ploeg",
        isHomePath: false,
        entity: {
          canonical: "http://api.kcvvelewijt.be/team/a-ploeg",
          type: "node",
          bundle: "team",
          id: "13",
          uuid: "01c24c48-ecfe-4c8c-bfac-87824c8f3194",
        },
        label: "A-Ploeg",
        jsonapi: {
          individual:
            "http://api.kcvvelewijt.be/jsonapi/node/team/01c24c48-ecfe-4c8c-bfac-87824c8f3194",
          resourceName: "node--team",
          basePath: "/jsonapi",
          entryPoint: "http://api.kcvvelewijt.be/jsonapi",
        },
      };

      const result = S.decodeUnknownSync(RouterResponse)(input);

      expect(result.resolved).toBe("http://api.kcvvelewijt.be/team/a-ploeg");
      expect(result.isHomePath).toBe(false);
      expect(result.entity.uuid).toBe("01c24c48-ecfe-4c8c-bfac-87824c8f3194");
      expect(result.label).toBe("A-Ploeg");
      expect(result.redirect).toBeUndefined();
    });

    it("should decode response with redirect", () => {
      const input = {
        resolved: "http://api.kcvvelewijt.be/jeugd/u15",
        isHomePath: false,
        entity: {
          canonical: "http://api.kcvvelewijt.be/jeugd/u15",
          type: "node",
          bundle: "team",
          id: "42",
          uuid: "ae994645-747f-4423-b8af-1b1411eb5a9c",
        },
        label: "U15",
        jsonapi: {
          individual:
            "http://api.kcvvelewijt.be/jsonapi/node/team/ae994645-747f-4423-b8af-1b1411eb5a9c",
          resourceName: "node--team",
          basePath: "/jsonapi",
          entryPoint: "http://api.kcvvelewijt.be/jsonapi",
        },
        redirect: [
          {
            from: "/team/u15",
            to: "/jeugd/u15",
            status: "301",
          },
        ],
      };

      const result = S.decodeUnknownSync(RouterResponse)(input);

      expect(result.redirect).toHaveLength(1);
      expect(result.redirect?.[0].from).toBe("/team/u15");
      expect(result.redirect?.[0].to).toBe("/jeugd/u15");
    });

    it("should reject invalid response", () => {
      const input = {
        resolved: "http://api.kcvvelewijt.be/team/a-ploeg",
        // Missing required fields
      };

      expect(() => S.decodeUnknownSync(RouterResponse)(input)).toThrow();
    });
  });
});
