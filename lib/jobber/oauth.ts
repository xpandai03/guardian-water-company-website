// OAuth helpers for Jobber.
// - exchangeCodeForTokens: used once during the developer handshake.
// - refreshAccessToken:    used on every API call to mint a short-lived access token.
// See BACKEND_PLAN.md §3 + §4.

import { JOBBER_TOKEN_URL } from "@/lib/jobber/config";

export interface JobberTokenResponse {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  token_type: string;
  scope?: string;
}

export class JobberOAuthError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly body: string
  ) {
    super(message);
    this.name = "JobberOAuthError";
  }
}

async function postTokenForm(form: URLSearchParams): Promise<JobberTokenResponse> {
  const response = await fetch(JOBBER_TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: form.toString(),
    cache: "no-store",
  });

  const text = await response.text();
  if (!response.ok) {
    throw new JobberOAuthError(
      `Jobber token endpoint returned ${response.status}`,
      response.status,
      text
    );
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(text);
  } catch {
    throw new JobberOAuthError("Jobber token endpoint returned non-JSON body", response.status, text);
  }

  const body = parsed as Partial<JobberTokenResponse>;
  if (!body.access_token || !body.refresh_token) {
    throw new JobberOAuthError(
      "Jobber token response missing access_token or refresh_token",
      response.status,
      JSON.stringify(body)
    );
  }

  return body as JobberTokenResponse;
}

export interface ExchangeCodeArgs {
  code: string;
  clientId: string;
  clientSecret: string;
  redirectUri: string;
}

export async function exchangeCodeForTokens(args: ExchangeCodeArgs): Promise<JobberTokenResponse> {
  const form = new URLSearchParams({
    grant_type: "authorization_code",
    client_id: args.clientId,
    client_secret: args.clientSecret,
    code: args.code,
    redirect_uri: args.redirectUri,
  });
  return postTokenForm(form);
}

export interface RefreshArgs {
  refreshToken: string;
  clientId: string;
  clientSecret: string;
}

// Note: with refresh-token rotation OFF (BACKEND_PLAN.md §4), the returned
// `refresh_token` equals the input `refreshToken`. If rotation ever gets
// turned ON in the Jobber app, the caller must persist the new value. Today
// nothing reads the returned `refresh_token` from this function.
// TODO(when-rotation-on): see BACKEND_PLAN.md §4 for the KV persistence path.
export async function refreshAccessToken(args: RefreshArgs): Promise<JobberTokenResponse> {
  const form = new URLSearchParams({
    grant_type: "refresh_token",
    client_id: args.clientId,
    client_secret: args.clientSecret,
    refresh_token: args.refreshToken,
  });
  return postTokenForm(form);
}
