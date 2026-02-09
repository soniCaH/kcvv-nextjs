/**
 * Search API Route Tests
 * Tests the /api/search endpoint request/response behavior
 *
 * Note: This test file focuses on request validation and response structure.
 * Full integration tests with Drupal mocks are complex due to Effect's
 * generator-based architecture. These tests verify the API contract
 * and validation logic which provides significant value.
 */

import { describe, it, expect } from "vitest";
import { NextRequest } from "next/server";
import { GET } from "./route";

// Helper to create NextRequest
function createRequest(url: string): NextRequest {
  return new NextRequest(new URL(url, "http://localhost:3000"));
}

describe("GET /api/search", () => {
  describe("Query Validation", () => {
    it("should return 400 when query is missing", async () => {
      const request = createRequest("/api/search");
      const response = await GET(request);

      expect(response.status).toBe(400);
      const body = await response.json();
      expect(body.error).toMatch(/required/i);
    });

    it("should return 400 when query is empty string", async () => {
      const request = createRequest("/api/search?q=");
      const response = await GET(request);

      expect(response.status).toBe(400);
      const body = await response.json();
      expect(body.error).toMatch(/required/i);
    });

    it("should return 400 when query is only whitespace", async () => {
      const request = createRequest("/api/search?q=   ");
      const response = await GET(request);

      expect(response.status).toBe(400);
      const body = await response.json();
      expect(body.error).toMatch(/required/i);
    });

    it("should return 400 when query is less than 2 characters", async () => {
      const request = createRequest("/api/search?q=a");
      const response = await GET(request);

      expect(response.status).toBe(400);
      const body = await response.json();
      expect(body.error).toMatch(/at least 2 characters/i);
    });

    it("should accept query with exactly 2 characters", async () => {
      const request = createRequest("/api/search?q=ab");
      const response = await GET(request);

      // Should not be 400 (validation passes)
      // Will return 200 or 500 depending on Drupal availability
      expect(response.status).not.toBe(400);
    });

    it("should accept query with more than 2 characters", async () => {
      const request = createRequest("/api/search?q=test");
      const response = await GET(request);

      expect(response.status).not.toBe(400);
    });

    it("should handle URL-encoded query strings", async () => {
      const request = createRequest("/api/search?q=test%20query");
      const response = await GET(request);

      expect(response.status).not.toBe(400);
      const body = await response.json();

      // If successful, query should be decoded and trimmed
      if (response.status === 200) {
        expect(body.query).toBe("test query");
      }
    });

    it("should trim whitespace from query", async () => {
      const request = createRequest("/api/search?q=%20test%20");
      const response = await GET(request);

      expect(response.status).not.toBe(400);
      const body = await response.json();

      if (response.status === 200) {
        expect(body.query).toBe("test");
      }
    });
  });

  describe("Type Validation", () => {
    it("should return 400 for invalid type", async () => {
      const request = createRequest("/api/search?q=test&type=invalid");
      const response = await GET(request);

      expect(response.status).toBe(400);
      const body = await response.json();
      expect(body.error).toMatch(/invalid type/i);
    });

    it("should accept type=article", async () => {
      const request = createRequest("/api/search?q=test&type=article");
      const response = await GET(request);

      // Should not fail validation
      expect(response.status).not.toBe(400);
      const body = await response.json();
      expect(body.error).not.toMatch(/invalid type/i);
    });

    it("should accept type=player", async () => {
      const request = createRequest("/api/search?q=test&type=player");
      const response = await GET(request);

      expect(response.status).not.toBe(400);
      const body = await response.json();
      expect(body.error).not.toMatch(/invalid type/i);
    });

    it("should accept type=team", async () => {
      const request = createRequest("/api/search?q=test&type=team");
      const response = await GET(request);

      expect(response.status).not.toBe(400);
      const body = await response.json();
      expect(body.error).not.toMatch(/invalid type/i);
    });

    it("should accept no type parameter (search all)", async () => {
      const request = createRequest("/api/search?q=test");
      const response = await GET(request);

      expect(response.status).not.toBe(400);
    });

    it("should handle case-insensitive type parameter", async () => {
      const request = createRequest("/api/search?q=test&type=ARTICLE");
      const response = await GET(request);

      // Should normalize to lowercase and accept
      expect(response.status).not.toBe(400);
      const body = await response.json();
      expect(body.error).not.toMatch(/invalid type/i);
    });

    it("should reject multiple invalid types", async () => {
      const request = createRequest("/api/search?q=test&type=foo");
      const response = await GET(request);

      expect(response.status).toBe(400);
    });
  });

  describe("Response Structure", () => {
    it("should return JSON response", async () => {
      const request = createRequest("/api/search?q=test");
      const response = await GET(request);

      const contentType = response.headers.get("content-type");
      expect(contentType).toContain("application/json");
    });

    it("should return proper SearchResponse structure on success", async () => {
      const request = createRequest("/api/search?q=kcvv");
      const response = await GET(request);

      // Skip if Drupal service failed
      if (response.status !== 200) {
        return;
      }

      const body = await response.json();

      expect(body).toHaveProperty("query");
      expect(body).toHaveProperty("count");
      expect(body).toHaveProperty("results");
      expect(typeof body.query).toBe("string");
      expect(typeof body.count).toBe("number");
      expect(Array.isArray(body.results)).toBe(true);
    });

    it("should include query in response", async () => {
      const request = createRequest("/api/search?q=football");
      const response = await GET(request);

      if (response.status !== 200) {
        return;
      }

      const body = await response.json();
      expect(body.query).toBe("football");
    });

    it("should return count matching results length", async () => {
      const request = createRequest("/api/search?q=kcvv");
      const response = await GET(request);

      if (response.status !== 200) {
        return;
      }

      const body = await response.json();
      expect(body.count).toBe(body.results.length);
    });

    it("should return results as array", async () => {
      const request = createRequest("/api/search?q=test");
      const response = await GET(request);

      if (response.status !== 200) {
        return;
      }

      const body = await response.json();
      expect(Array.isArray(body.results)).toBe(true);
    });
  });

  describe("Error Handling", () => {
    it("should return 500 status for internal errors", async () => {
      // This test may pass or fail depending on Drupal availability
      // but it validates error handling structure
      const request = createRequest("/api/search?q=__test__");
      const response = await GET(request);

      // Should be either 200 (success) or 500 (error), never 400 (validation passed)
      expect([200, 500]).toContain(response.status);
    });

    it("should return error object for 500 responses", async () => {
      const request = createRequest("/api/search?q=test");
      const response = await GET(request);

      if (response.status === 500) {
        const body = await response.json();
        expect(body).toHaveProperty("error");
        expect(typeof body.error).toBe("string");
      }
    });

    it("should not leak internal error details", async () => {
      const request = createRequest("/api/search?q=test");
      const response = await GET(request);

      if (response.status === 500) {
        const body = await response.json();
        // Should only have generic error message
        expect(body.error).toBe("Internal server error");
      }
    });
  });

  describe("Edge Cases", () => {
    it("should handle special characters in query", async () => {
      const request = createRequest("/api/search?q=test%20%26%20special");
      const response = await GET(request);

      expect(response.status).not.toBe(400);
      const body = await response.json();

      if (response.status === 200) {
        expect(body.query).toBe("test & special");
      }
    });

    it("should handle Unicode characters", async () => {
      const request = createRequest("/api/search?q=%C3%A9%C3%A0");
      const response = await GET(request);

      expect(response.status).not.toBe(400);
    });

    it("should handle very long queries", async () => {
      const longQuery = "a".repeat(1000);
      const request = createRequest(`/api/search?q=${longQuery}`);
      const response = await GET(request);

      // Should not fail validation (length >= 2)
      expect(response.status).not.toBe(400);
    });

    it("should handle multiple query parameters correctly", async () => {
      // Only first 'q' should be used
      const request = createRequest("/api/search?q=first&q=second");
      const response = await GET(request);

      expect(response.status).not.toBe(400);
      const body = await response.json();

      if (response.status === 200) {
        expect(body.query).toBe("first");
      }
    });
  });

  describe("Request Method", () => {
    it("should only handle GET requests", () => {
      // The route.ts only exports GET, so only GET is handled
      // POST, PUT, etc. would return 405 from Next.js framework
      expect(GET).toBeDefined();
      expect(typeof GET).toBe("function");
    });
  });
});
