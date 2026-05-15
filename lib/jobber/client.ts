// getAccessToken: read env, refresh, return short-lived access token + the
// pinned GraphQL version to send on every API call.
//
// Refresh-token rotation is OFF for v1 (BACKEND_PLAN.md §4) so the stored
// refresh token never changes — no KV / DB layer required.

import { JOBBER_GRAPHQL_VERSION_FALLBACK } from "@/lib/jobber/config";
import { refreshAccessToken } from "@/lib/jobber/oauth";

export interface AccessTokenContext {
  accessToken: string;
  graphqlVersion: string;
}

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`Missing required env var: ${name}`);
  return value;
}

export async function getAccessToken(): Promise<AccessTokenContext> {
  const clientId = requireEnv("JOBBER_CLIENT_ID");
  const clientSecret = requireEnv("JOBBER_CLIENT_SECRET");
  const refreshToken = requireEnv("JOBBER_REFRESH_TOKEN");
  const graphqlVersion =
    process.env.JOBBER_GRAPHQL_VERSION ?? JOBBER_GRAPHQL_VERSION_FALLBACK;

  const tokens = await refreshAccessToken({ refreshToken, clientId, clientSecret });
  return { accessToken: tokens.access_token, graphqlVersion };
}
