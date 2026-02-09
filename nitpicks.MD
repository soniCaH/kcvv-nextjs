# 🧹 Nitpick comments (11)
## src/app/api/search/route.test.ts (2)

### 155-161: Misleading test name: "should reject multiple invalid types".

This test only sends a single invalid type foo. The name suggests it tests multiple type values in one request. Rename to something like "should reject unknown type values" for clarity.

### 305-312: Method guard test only checks that GET is a function — doesn't verify other methods are rejected.

The comment says "POST, PUT, etc. would return 405 from Next.js framework," which is correct, but the test name "should only handle GET requests" overpromises relative to what's asserted. Consider renaming to "should export GET handler" to match the actual assertion.

## src/components/search/SearchFilters.test.tsx (1)
329-342: Test provides no additional value over existing rendering tests.

The comment on line 331 acknowledges this — size is a visual prop and the assertion just checks tabs exist, which is already covered by "should configure all four tabs." Consider removing or marking as a placeholder.

## tests/helpers/search.helpers.ts (1)
100-148: Non-deterministic IDs from Math.random() can hinder debugging.

Factory functions use Math.random() for generating IDs (e.g., line 105: `article-${Math.random()}`). While this ensures uniqueness, it makes test failures harder to reproduce and snapshot tests unstable. Consider using an incrementing counter instead:

♻️ Suggested approach

+let idCounter = 0;
+
 export function createMockArticle(
   overrides: Partial<SearchResult> = {},
 ): SearchResult {
   return {
     type: "article",
-    id: `article-${Math.random()}`,
+    id: `article-${++idCounter}`,
     title: "Test Article",

## src/components/search/SearchResults.test.tsx (2)
### 15-41: Next.js module mocks are duplicated across test files.

The vi.mock("next/link") and vi.mock("next/image") blocks here are identical to those in SearchResult.test.tsx. Consider extracting them into a shared test setup file (e.g., alongside your search.helpers.ts or in a Vitest setup file) to reduce duplication and ensure consistency.

### 391-404: Accessibility test relies on Tailwind CSS class names.

Asserting semantic structure via .space-y-4 (line 402) couples the test to styling implementation. If classes are refactored, this test breaks without any actual accessibility regression. Prefer role-based or semantic queries where possible.

## src/components/search/SearchForm.test.tsx (1)
### 44-50: Icon presence test is fragile — relies on CSS class selector.

Querying by [class*="absolute"] (line 48) may match unrelated elements or break on class changes. If the icon is purely decorative, consider whether this test adds value. If it does, using a data-testid would be more robust.

## src/components/search/SearchResult.test.tsx (2)
### 335-363: Styling tests assert Tailwind implementation details.

These tests (hover:shadow-md, hover:border-green-main, transition-shadow, group) are tightly coupled to CSS class names. Any Tailwind config change or class rename will break them without affecting actual behavior. Consider whether these assertions add sufficient value, or if visual regression testing would be more appropriate.

### 108-118: CSS class selectors used for absence checks are brittle.

Multiple tests assert the absence of elements via Tailwind class combinations (.w-24.h-24, .text-xs.text-gray-500, .flex.flex-wrap.gap-2, .text-sm.text-gray-dark). These will break if classes are reordered or renamed. Where possible, prefer queryByRole, queryByText, or data-testid attributes for more resilient queries.

Also applies to: 131-141, 176-196, 274-285

## src/components/search/SearchInterface.test.tsx (2)
### 13-21: Shared mutable mockSearchParams singleton is fragile for future test additions.

beforeEach only deletes "q" and "type", so any future test that sets a different param (e.g., "page") would silently leak into subsequent tests. Consider resetting it fully.

♻️ Suggested improvement
  beforeEach(() => {
    // Reset mocks
    mockPush.mockClear();
-   mockSearchParams.delete("q");
-   mockSearchParams.delete("type");
+   // Clear all params to prevent cross-test leakage
+   Array.from(mockSearchParams.keys()).forEach((key) =>
+     mockSearchParams.delete(key),
+   );
### 492-497: Test name overpromises — it only verifies unmount doesn't throw, not that the AbortController is cleaned up.

Consider either renaming to "should unmount without errors" to match what it actually asserts, or strengthening it by starting a fetch (so an AbortController is active), then unmounting and verifying the signal was aborted.

♻️ Stronger alternative
-it("should cleanup abort controller on unmount", () => {
-  const { unmount } = render(<SearchInterface />);
-
-  // Unmount should not throw
-  expect(() => unmount()).not.toThrow();
-});
+it("should abort in-flight request on unmount", async () => {
+  const user = userEvent.setup();
+  let capturedSignal: AbortSignal | undefined;
+
+  fetchMock.mockImplementationOnce((_url: string, options: RequestInit) => {
+    capturedSignal = options?.signal as AbortSignal;
+    return new Promise(() => {}); // never resolves
+  });
+
+  const { unmount } = render(<SearchInterface />);
+
+  const input = screen.getByRole("textbox");
+  await user.type(input, "test");
+  const submitButton = screen.getByRole("button", { name: /^zoek$/i });
+  await user.click(submitButton);
+
+  await waitFor(() => {
+    expect(capturedSignal).toBeDefined();
+  });
+
+  unmount();
+
+  expect(capturedSignal!.aborted).toBe(true);
+});
