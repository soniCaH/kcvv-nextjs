// Shared schemas — consumed by both apps/web and kcvv-api
export * from "./schemas/index.js";

// HttpApi definition — kcvv-api implements this; apps/web consumes via HttpApiClient
export * from "./api/index.js";
