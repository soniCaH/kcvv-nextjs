/**
 * Search API Route Tests
 * Tests the /api/search endpoint validation and success responses
 */

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { NextRequest } from "next/server";
import { GET } from "./route";

// Mock Next.js cache - pass through the function
vi.mock("next/cache", () => ({
  unstable_cache: <T>(fn: () => T) => fn,
}));

// Mock fetch to return Drupal responses for testing
const mockFetch = vi.fn();

// Helper to create NextRequest
function createRequest(url: string): NextRequest {
  return new NextRequest(new URL(url, "http://localhost:3000"));
}

describe("GET /api/search", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    // Use vi.stubGlobal for proper cleanup between tests
    vi.stubGlobal("fetch", mockFetch);

    // Setup mock fetch to return empty Drupal responses by default
    // This allows tests to pass without complex schema-compliant mocks
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => ({
        data: [],
        links: {},
      }),
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

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
  });

  describe("Type Validation", () => {
    it("should return 400 for invalid type", async () => {
      const request = createRequest("/api/search?q=test&type=invalid");
      const response = await GET(request);

      expect(response.status).toBe(400);
      const body = await response.json();
      expect(body.error).toMatch(/invalid type/i);
    });

    it("should return 400 for unknown type", async () => {
      const request = createRequest("/api/search?q=test&type=foo");
      const response = await GET(request);

      expect(response.status).toBe(400);
      const body = await response.json();
      expect(body.error).toMatch(/invalid type/i);
    });
  });

  describe("Combined Validation", () => {
    it("should validate query first (empty query + invalid type)", async () => {
      const request = createRequest("/api/search?q=&type=invalid");
      const response = await GET(request);

      // Should fail on query validation first
      expect(response.status).toBe(400);
      const body = await response.json();
      expect(body.error).toMatch(/required/i);
    });

    it("should validate query length before type (1 char + invalid type)", async () => {
      const request = createRequest("/api/search?q=a&type=invalid");
      const response = await GET(request);

      // Should fail on query length validation first
      expect(response.status).toBe(400);
      const body = await response.json();
      expect(body.error).toMatch(/at least 2 characters/i);
    });

    it("should validate type when query is valid", async () => {
      const request = createRequest("/api/search?q=test&type=badtype");
      const response = await GET(request);

      // Query is valid, should fail on type validation
      expect(response.status).toBe(400);
      const body = await response.json();
      expect(body.error).toMatch(/invalid type/i);
    });
  });

  describe("Request Structure", () => {
    it("should export GET handler", () => {
      expect(GET).toBeDefined();
      expect(typeof GET).toBe("function");
    });
  });

  describe("Successful Requests", () => {
    it("should return 200 with results for valid query", async () => {
      const request = createRequest("/api/search?q=test");
      const response = await GET(request);

      expect(response.status).toBe(200);
      const body = await response.json();
      expect(body).toHaveProperty("query", "test");
      expect(body).toHaveProperty("results");
      expect(body).toHaveProperty("count");
      expect(Array.isArray(body.results)).toBe(true);
    });

    it("should accept type=article and return 200", async () => {
      const request = createRequest("/api/search?q=test&type=article");
      const response = await GET(request);

      expect(response.status).toBe(200);
      const body = await response.json();
      expect(body.query).toBe("test");
      expect(Array.isArray(body.results)).toBe(true);
      // Mock returns empty data, so expect empty results
      expect(body.results).toEqual([]);
      expect(body.count).toBe(0);
    });

    it("should accept type=player and return 200", async () => {
      const request = createRequest("/api/search?q=test&type=player");
      const response = await GET(request);

      expect(response.status).toBe(200);
      const body = await response.json();
      expect(body.query).toBe("test");
      expect(Array.isArray(body.results)).toBe(true);
      // Mock returns empty data, so expect empty results
      expect(body.results).toEqual([]);
      expect(body.count).toBe(0);
    });

    it("should accept type=team and return 200", async () => {
      const request = createRequest("/api/search?q=test&type=team");
      const response = await GET(request);

      expect(response.status).toBe(200);
      const body = await response.json();
      expect(body.query).toBe("test");
      expect(Array.isArray(body.results)).toBe(true);
      // Mock returns empty data, so expect empty results
      expect(body.results).toEqual([]);
      expect(body.count).toBe(0);
    });

    it("should trim and normalize query in response", async () => {
      const request = createRequest("/api/search?q=%20%20test%20%20");
      const response = await GET(request);

      expect(response.status).toBe(200);
      const body = await response.json();
      expect(body.query).toBe("test"); // Trimmed
    });
  });
});
