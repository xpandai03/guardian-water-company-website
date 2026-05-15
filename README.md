# Delahunty Water Systems

Marketing + lead intake site for Delahunty Water Systems (Northeast Ohio).

Stack: Next.js 15 App Router · React 19 · TypeScript · Tailwind v4 · shadcn/ui · Zod · react-hook-form · Sonner · Vercel.

Plans:
- `FRONTEND_PLAN.md` — page inventory, components, design tokens.
- `BACKEND_PLAN.md` — Jobber + Twilio lead pipeline (this README's setup steps mirror that doc).

---

## Lead intake integration

The contact / estimate form on the site posts to `/api/leads`, which:

1. Validates the 6-field payload with Zod.
2. Creates a **Client** + **Request** in Jobber via the GraphQL API.
3. Sends a confirmation SMS to the lead via Twilio.

Everything is server-only Next.js route handlers on the same Vercel deployment — no external middleware, queues, or sheets.

### 1. Environment variables

Local: copy `.env.local.example` to `.env.local` and fill in. `.env.local` is gitignored.

Vercel: add **every** variable from `.env.local.example` to **both** the **Production** and **Preview** environment scopes (Vercel Dashboard → Project → Settings → Environment Variables). After updating env vars, redeploy — Vercel does not hot-reload them.

| Variable | Where it comes from |
|---|---|
| `JOBBER_CLIENT_ID` | Jobber Developer Center → your app → "Client ID" |
| `JOBBER_CLIENT_SECRET` | Same screen → "Client Secret" (server-only) |
| `JOBBER_REDIRECT_URI` | Exact callback URL registered in the Jobber app config, e.g. `https://delahuntywater.com/api/jobber/oauth/callback` |
| `JOBBER_REFRESH_TOKEN` | Set by the one-time OAuth handshake below |
| `JOBBER_GRAPHQL_VERSION` | Pin to the API version you validated in GraphiQL |
| `TWILIO_ACCOUNT_SID` | Twilio Console → Account → Account SID |
| `TWILIO_AUTH_TOKEN` | Twilio Console → Account → Auth Token (server-only) |
| `TWILIO_FROM_NUMBER` | An SMS-capable Twilio number in E.164 format |
| `LEAD_CONFIRMATION_SMS_TEMPLATE` | Optional override; `{firstName}` is the only variable |

### 2. One-time Jobber OAuth handshake

This is done **once** by the developer to mint a long-lived refresh token. After that the site uses the refresh token to talk to Jobber on every form submit.

Refresh-token rotation is **OFF** (`BACKEND_PLAN.md §4`), so once the token is pasted into Vercel it stays valid until the Jobber app is re-authorized.

**Steps:**

1. Deploy the app to Vercel (production) at least once. The OAuth callback route lives at:

   ```
   https://<your-domain>/api/jobber/oauth/callback
   ```

2. In the **Jobber Developer Center → your app → OAuth Callback URL**, set this exact URL. Save.

3. Construct the authorize URL (replace the two values, URL-encode the redirect URI):

   ```
   https://api.getjobber.com/api/oauth/authorize
     ?response_type=code
     &client_id=<JOBBER_CLIENT_ID>
     &redirect_uri=<URL_ENCODED_JOBBER_REDIRECT_URI>
     &state=handshake
   ```

4. Open the authorize URL in a browser **logged into David's Jobber account**. Click "Allow Access".

5. Jobber redirects to your callback. The page renders the `refresh_token` in a copy-friendly box.

6. Copy the refresh token. In Vercel → Settings → Environment Variables, add it as `JOBBER_REFRESH_TOKEN` to **Production AND Preview**. Save.

7. Trigger a new deployment (push any commit, or click "Redeploy" in Vercel) so the new env var loads.

The callback route can stay deployed for future re-authorizations, or be deleted after step 6 — it has no purpose in the user-facing flow. If keeping it deployed long-term, consider gating it behind a basic-auth header.

### 3. Rotating Twilio credentials

If a Twilio Auth Token is exposed (or just on a regular rotation cadence):

1. Twilio Console → Account → API Keys & Tokens → **Create new Auth Token** (Twilio supports two simultaneous Auth Tokens during rotation).
2. In Vercel → Environment Variables, update `TWILIO_AUTH_TOKEN` to the new value in Production AND Preview. Save.
3. Redeploy.
4. After verifying SMS delivery still works on a real form submit, return to Twilio Console and **revoke the old Auth Token**.

Same rotation pattern for `TWILIO_ACCOUNT_SID` is rare (it's tied to the account, not a credential). If the entire Twilio account changes, update SID + Auth Token + From Number together as one Vercel env update.

### 4. Pinning the Jobber API version

Jobber's GraphQL schema evolves. We pin via the `X-JOBBER-GRAPHQL-VERSION` header (sent on every request from `lib/jobber/graphql.ts`). To bump:

1. Open Jobber Developer Center → "Test in GraphiQL".
2. Run our `clientCreate` mutation against the new version. Confirm it still returns the expected shape.
3. Update `JOBBER_GRAPHQL_VERSION` in Vercel and redeploy.

If the new version breaks something, revert the env var; no code change required.
