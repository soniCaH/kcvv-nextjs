// Shared schemas — consumed by both apps/web and apps/api
export * from "./schemas/index";

// HttpApi definition — apps/api implements this; apps/web consumes via HttpApiClient
export * from "./api/index";
