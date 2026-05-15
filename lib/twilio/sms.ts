// Twilio confirmation SMS sender.
// See BACKEND_PLAN.md §7 for template copy and PLAN.md §6 for the API call shape.

// TODO(session-2): implement. Stubbed at scaffold time so imports compile.
// Session 1 does not send any SMS.

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
