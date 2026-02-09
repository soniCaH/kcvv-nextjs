/**
 * Search API Route Tests
 * Tests the /api/search endpoint validation logic
 *
 * Note: These tests focus on request validation (400 errors).
 * Integration tests with actual Drupal responses are handled separately
 * due to Effect's generator architecture making mocking complex.
 */

import { describe, it, expect } from "vitest";
import { NextRequest } from "next/server";
import { GET } from "./route";

// Helper to create NextRequest
function createRequest(url: string): NextRequest {
  return new NextRequest(new URL(url, "http://localhost:3000"));
}

describe("GET /api/search - Validation", () => {
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
    it("should accept GET method", () => {
      expect(GET).toBeDefined();
      expect(typeof GET).toBe("function");
    });
  });
});
