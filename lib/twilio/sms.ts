/**
 * DORMANT — SMS confirmation deferred per client request
 * (David, May 22, 2026 call). Code is intact for future
 * re-enable. To re-activate:
 *   1. Restore the SMS trigger in app/api/leads/route.ts
 *   2. Ensure TWILIO_* env vars are set in Vercel
 *   3. Restore the smsConsent field in lib/leads/schema.ts
 *      and the checkbox in components/estimate-form.tsx
 */

// Twilio confirmation SMS sender.
// See BACKEND_PLAN.md §7 for template copy and PLAN.md §6 for the API call shape.

export interface SendSmsArgs {
  to: string;       // E.164
  body: string;     // ≤ 160 chars to stay 1-segment
}

export interface SendSmsResult {
  sid: string;
  status: string;
}

export async function sendLeadConfirmationSms(_args: SendSmsArgs): Promise<SendSmsResult> {
  throw new Error("sendLeadConfirmationSms not implemented yet (session 2)");
}
