// One-time OAuth handshake callback. See BACKEND_PLAN.md §3.3 + §5.
//
// Flow:
//   1. Developer opens the Jobber authorize URL in a browser.
//   2. Jobber redirects here with `?code=...`.
//   3. We POST `code` to Jobber's token endpoint and get back a long-lived refresh token.
//   4. We render an HTML page that displays the refresh token for copy/paste into Vercel.
//
// No `state` validation (BACKEND_PLAN.md §5).
// No tokens are logged anywhere; the response page is the only place they appear.

import { exchangeCodeForTokens, JobberOAuthError } from "@/lib/jobber/oauth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function htmlPage(args: { title: string; body: string; status: number }): Response {
  const doc = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <meta name="robots" content="noindex,nofollow" />
  <title>${escapeHtml(args.title)}</title>
  <style>
    :root { color-scheme: light; }
    * { box-sizing: border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif;
      max-width: 720px;
      margin: 48px auto;
      padding: 0 20px;
      color: #0b1d2a;
      line-height: 1.55;
    }
    h1 { font-size: 22px; margin: 0 0 8px; }
    p { margin: 8px 0 16px; color: #4a5b66; }
    pre {
      background: #f4f7f9;
      border: 1px solid #e2ebef;
      border-radius: 8px;
      padding: 16px;
      overflow-x: auto;
      font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
      font-size: 13px;
      word-break: break-all;
      white-space: pre-wrap;
    }
    .row { display: flex; gap: 8px; align-items: center; margin: 8px 0 24px; }
    button {
      font: inherit;
      padding: 8px 14px;
      border-radius: 6px;
      border: 1px solid #1ba6c9;
      background: #1ba6c9;
      color: #fff;
      cursor: pointer;
    }
    button.copied { background: #0e2a3a; border-color: #0e2a3a; }
    .notice {
      border-left: 3px solid #1ba6c9;
      background: #e6f6fa;
      padding: 12px 16px;
      border-radius: 0 8px 8px 0;
      margin: 16px 0;
    }
    .error { border-left-color: #c93131; background: #fde8e8; }
    code.kv { background: #eef3f5; padding: 1px 6px; border-radius: 4px; font-size: 12px; }
  </style>
</head>
<body>
  ${args.body}
</body>
</html>`;
  return new Response(doc, {
    status: args.status,
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "no-store",
      "X-Robots-Tag": "noindex, nofollow",
    },
  });
}

function errorPage(title: string, message: string, status = 400): Response {
  return htmlPage({
    title,
    status,
    body: `
      <h1>${escapeHtml(title)}</h1>
      <div class="notice error"><p>${escapeHtml(message)}</p></div>
      <p>If you reached this page by accident, you can close this tab. To restart the handshake, see the README "Lead intake integration" section.</p>
    `,
  });
}

function maskToken(token: string): string {
  if (token.length <= 4) return "****";
  return `…${token.slice(-4)}`;
}

export async function GET(request: Request): Promise<Response> {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const oauthError = url.searchParams.get("error");
  const errorDescription = url.searchParams.get("error_description");

  if (oauthError) {
    return errorPage(
      "Jobber OAuth error",
      errorDescription ? `${oauthError}: ${errorDescription}` : oauthError,
      400
    );
  }

  if (!code) {
    return errorPage(
      "Missing authorization code",
      "Jobber redirected here without a `code` query parameter. The authorize step probably failed — try opening the authorize URL again.",
      400
    );
  }

  const clientId = process.env.JOBBER_CLIENT_ID;
  const clientSecret = process.env.JOBBER_CLIENT_SECRET;
  const redirectUri = process.env.JOBBER_REDIRECT_URI;

  if (!clientId || !clientSecret || !redirectUri) {
    return errorPage(
      "Server not configured",
      "Set JOBBER_CLIENT_ID, JOBBER_CLIENT_SECRET, and JOBBER_REDIRECT_URI in Vercel env vars (Production + Preview), then redeploy and retry.",
      500
    );
  }

  let tokens;
  try {
    tokens = await exchangeCodeForTokens({ code, clientId, clientSecret, redirectUri });
  } catch (err) {
    const status = err instanceof JobberOAuthError ? err.status : 502;
    const detail = err instanceof JobberOAuthError ? err.message : "Unknown error";
    // Intentionally do not log the body — it can contain sensitive material.
    console.error("[oauth/callback] token exchange failed", { status, detail });
    return errorPage(
      "Token exchange failed",
      `Jobber rejected the authorization code (${status}). Most common causes: redirect URI mismatch, code already used, or wrong client secret. Try the authorize URL again.`,
      502
    );
  }

  // One safe diagnostic line — no full tokens.
  console.log("[oauth/callback] token exchange ok", {
    accessTokenSuffix: maskToken(tokens.access_token),
    refreshTokenSuffix: maskToken(tokens.refresh_token),
    expiresIn: tokens.expires_in,
    scope: tokens.scope ?? "(unspecified)",
  });

  const refreshTokenHtml = escapeHtml(tokens.refresh_token);

  return htmlPage({
    title: "Jobber refresh token — paste into Vercel",
    status: 200,
    body: `
      <h1>Jobber connected ✓</h1>
      <p>Copy the refresh token below and paste it into Vercel as <code class="kv">JOBBER_REFRESH_TOKEN</code> for both <strong>Production</strong> and <strong>Preview</strong> scopes, then redeploy.</p>

      <pre id="refresh-token">${refreshTokenHtml}</pre>
      <div class="row">
        <button id="copy-btn" type="button">Copy refresh token</button>
        <span id="copy-status" aria-live="polite"></span>
      </div>

      <div class="notice">
        <p><strong>Don't close this tab</strong> until the token is in Vercel and you've redeployed. This page won't render the token a second time.</p>
        <p>Token scope: <code class="kv">${escapeHtml(tokens.scope ?? "(unspecified)")}</code> · Access expires in ${tokens.expires_in}s (the refresh token is long-lived).</p>
      </div>

      <h2 style="font-size:16px;margin-top:24px;">Next steps</h2>
      <ol>
        <li>Vercel → Project → Settings → Environment Variables → Add <code class="kv">JOBBER_REFRESH_TOKEN</code> in Production AND Preview.</li>
        <li>Trigger a redeploy (push a commit, or click "Redeploy" in Vercel).</li>
        <li>Run <code class="kv">scripts/test-jobber-mutation.ts</code> locally to confirm the pipeline works end-to-end.</li>
      </ol>

      <script>
        (function () {
          var btn = document.getElementById("copy-btn");
          var status = document.getElementById("copy-status");
          var pre = document.getElementById("refresh-token");
          btn.addEventListener("click", function () {
            var text = pre.textContent || "";
            navigator.clipboard.writeText(text).then(
              function () {
                btn.classList.add("copied");
                btn.textContent = "Copied ✓";
                status.textContent = "Refresh token copied to clipboard.";
              },
              function () {
                status.textContent = "Could not copy automatically — select the text above and copy manually.";
              }
            );
          });
        })();
      </script>
    `,
  });
}
