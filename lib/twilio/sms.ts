// Twilio confirmation SMS sender (Phase D).
//
// Sends a single transactional confirmation SMS to a lead after their request
// has landed in Jobber. Talks to the Twilio REST API directly via fetch — no
// `twilio` npm SDK. See BACKEND_PLAN.md §7 for template copy.
//
// Contract: this module NEVER throws. Every failure path returns
// { ok: false, error } so the caller (app/api/leads/route.ts) can keep the
// user request successful even when SMS delivery fails — Jobber is the source
// of truth, the SMS is a nice-to-have. TCPA consent gating is the caller's
// responsibility; this module only sends.

const TWILIO_API_BASE = "https://api.twilio.com/2010-04-01";

// Fallback SMS body, used only when LEAD_CONFIRMATION_SMS_TEMPLATE is unset.
// Kept byte-identical to the env value so behaviour does not change if the
// env var is added or removed. `{firstName}` is the only template variable.
const DEFAULT_SMS_TEMPLATE =
  "Hi {firstName}, thanks for reaching out to Guardian Water. We'll call you within one business day. — David";

export interface SendLeadConfirmationSmsArgs {
  toE164: string; // recipient phone, E.164 (e.g. +12165550199)
  firstName: string;
}

export interface SendLeadConfirmationSmsResult {
  ok: boolean;
  sid?: string;
  error?: string;
}

// Mask all but the last 4 digits for server logs: +12165550199 -> ******0199
function redactPhone(phone: string): string {
  if (phone.length <= 4) return "****";
  return `${"*".repeat(phone.length - 4)}${phone.slice(-4)}`;
}

// Defensive sanitisation before template substitution: strip CR/LF (guards
// against body/header injection via the name field), collapse whitespace,
// trim, and cap length so a hostile name can't bloat the SMS.
function sanitizeFirstName(raw: string): string {
  return raw
    .replace(/[\r\n]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 50);
}

export async function sendLeadConfirmationSms(
  args: SendLeadConfirmationSmsArgs
): Promise<SendLeadConfirmationSmsResult> {
  // Env var name is TWILIO_PHONE_NUMBER to match what is already configured
  // in Vercel (Production + Preview) — not TWILIO_FROM_NUMBER.
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const fromNumber = process.env.TWILIO_PHONE_NUMBER;

  if (!accountSid || !authToken || !fromNumber) {
    const missing = [
      !accountSid && "TWILIO_ACCOUNT_SID",
      !authToken && "TWILIO_AUTH_TOKEN",
      !fromNumber && "TWILIO_PHONE_NUMBER",
    ]
      .filter(Boolean)
      .join(", ");
    const error = `Twilio is not configured — missing env var(s): ${missing}`;
    console.error(`[twilio/sms] ${error}`);
    return { ok: false, error };
  }

  const template =
    process.env.LEAD_CONFIRMATION_SMS_TEMPLATE?.trim() || DEFAULT_SMS_TEMPLATE;
  const body = template.replace(
    /\{firstName\}/g,
    sanitizeFirstName(args.firstName)
  );

  const endpoint = `${TWILIO_API_BASE}/Accounts/${encodeURIComponent(
    accountSid
  )}/Messages.json`;
  const auth = Buffer.from(`${accountSid}:${authToken}`).toString("base64");
  const form = new URLSearchParams({
    To: args.toE164,
    From: fromNumber,
    Body: body,
  });

  try {
    const res = await fetch(endpoint, {
      method: "POST",
      headers: {
        Authorization: `Basic ${auth}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: form,
    });

    const payload = (await res.json().catch(() => null)) as
      | { sid?: string; message?: string; code?: number }
      | null;

    if (!res.ok) {
      const reason =
        payload?.message ?? `Twilio responded ${res.status} ${res.statusText}`;
      console.error(
        `[twilio/sms] send failed for ${redactPhone(args.toE164)}: ${reason}` +
          (payload?.code ? ` (code ${payload.code})` : "")
      );
      return { ok: false, error: reason };
    }

    if (!payload?.sid) {
      const error = "Twilio returned a success status without a message sid";
      console.error(
        `[twilio/sms] ${error} for ${redactPhone(args.toE164)}`
      );
      return { ok: false, error };
    }

    return { ok: true, sid: payload.sid };
  } catch (err) {
    const reason = err instanceof Error ? err.message : String(err);
    console.error(
      `[twilio/sms] network error sending to ${redactPhone(
        args.toE164
      )}: ${reason}`
    );
    return { ok: false, error: reason };
  }
}
