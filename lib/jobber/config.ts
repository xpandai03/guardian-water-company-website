// Jobber API endpoints + version pin.
// No secrets here — secrets come from process.env via lib/jobber/client.ts.
// Source of truth: BACKEND_PLAN.md §3.1 + §10.

export const JOBBER_AUTHORIZE_URL = "https://api.getjobber.com/api/oauth/authorize";
export const JOBBER_TOKEN_URL = "https://api.getjobber.com/api/oauth/token";
export const JOBBER_GRAPHQL_URL = "https://api.getjobber.com/api/graphql";

// Pinned API version. Override via env var when validated against a newer version in GraphiQL.
export const JOBBER_GRAPHQL_VERSION_FALLBACK = "2025-01-20";
