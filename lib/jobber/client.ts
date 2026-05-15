// getAccessToken: read env, refresh, return short-lived access token.
// Refresh-token rotation is OFF for v1 (see BACKEND_PLAN.md §4) so the stored
// refresh token never changes — no KV / DB layer required.

// TODO(session-1, step-5): implement. Stubbed at scaffold time.

import { JOBBER_GRAPHQL_VERSION_FALLBACK } from "@/lib/jobber/config";

export interface AccessTokenContext {
  accessToken: string;
  graphqlVersion: string;
}

export async function getAccessToken(): Promise<AccessTokenContext> {
  // Reads JOBBER_CLIENT_ID, JOBBER_CLIENT_SECRET, JOBBER_REFRESH_TOKEN, JOBBER_GRAPHQL_VERSION.
  void JOBBER_GRAPHQL_VERSION_FALLBACK;
  throw new Error("getAccessToken not implemented yet (session 1, step 5)");
}
