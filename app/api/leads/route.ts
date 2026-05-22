// POST /api/leads — public lead intake endpoint.
//
// Flow (BACKEND_PLAN.md §6):
//   1. Parse JSON body. Non-JSON → 400.
//   2. Validate with leadSchema (Zod). Invalid → 400 + field errors.
//   3. submitLead(): refreshAccessToken → clientCreate (with inline property)
//      → requestCreate. Jobber error → 502 generic. Code/config error → 500 generic.
//   4. On success, if smsConsent === true, fire a Twilio confirmation SMS
//      (Phase D). SMS failure is logged but never changes the response.
//   5. Success → 201 with { ok: true, clientId, requestId, sms }.
//
// Error responses are intentionally generic to the public; full detail is
// logged server-side. Phone numbers / emails are never logged from this
// handler — submitLead and the SMS sender handle their own redaction policy.

import { NextResponse } from "next/server";

import { leadSchema } from "@/lib/leads/schema";
import { JobberMutationError, submitLead } from "@/lib/leads/submit-lead";
import { JobberOAuthError } from "@/lib/jobber/oauth";
import { JobberGraphqlError } from "@/lib/jobber/graphql";
import { sendLeadConfirmationSms } from "@/lib/twilio/sms";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const GENERIC_ERROR_MESSAGE = "Could not submit your request, please try again";

export async function POST(request: Request): Promise<Response> {
  // 1. Parse JSON.
  let rawBody: unknown;
  try {
    rawBody = await request.json();
  } catch {
    return NextResponse.json(
      { ok: false, error: "Request body must be valid JSON" },
      { status: 400 }
    );
  }

  // 2. Validate.
  const parsed = leadSchema.safeParse(rawBody);
  if (!parsed.success) {
    return NextResponse.json(
      {
        ok: false,
        error: "Validation failed",
        fieldErrors: parsed.error.flatten().fieldErrors,
      },
      { status: 400 }
    );
  }

  // 3. Submit to Jobber.
  try {
    const result = await submitLead(parsed.data);

    // 4. Confirmation SMS — TCPA-gated. Only fires when the homeowner
    // explicitly checked the consent box (smsConsent === true). The SMS is a
    // nice-to-have: a failure here is logged but NEVER changes the response —
    // the lead is already safely in Jobber. The `sms` field is an
    // internal-only debug aid (sent | failed | skipped); safe to keep in prod.
    // See BACKEND_PLAN.md §6 step 6 + §7.
    let sms: "sent" | "failed" | "skipped" = "skipped";
    if (parsed.data.smsConsent === true) {
      try {
        const smsResult = await sendLeadConfirmationSms({
          toE164: parsed.data.phone,
          firstName: parsed.data.firstName,
        });
        sms = smsResult.ok ? "sent" : "failed";
        if (!smsResult.ok) {
          console.error(
            `[api/leads] confirmation SMS failed: ${smsResult.error}`
          );
        }
      } catch (smsErr) {
        // sendLeadConfirmationSms is designed never to throw; this is a
        // defensive backstop guaranteeing SMS can never fail the request.
        sms = "failed";
        const reason =
          smsErr instanceof Error ? smsErr.message : String(smsErr);
        console.error(
          `[api/leads] confirmation SMS threw unexpectedly: ${reason}`
        );
      }
    }

    return NextResponse.json(
      {
        ok: true,
        clientId: result.clientId,
        requestId: result.requestId,
        sms,
      },
      { status: 201 }
    );
  } catch (err) {
    // 502 for upstream (Jobber) errors. 500 for everything else (config / code).
    if (err instanceof JobberOAuthError) {
      console.error("[api/leads] Jobber OAuth failure", { status: err.status });
      return NextResponse.json(
        { ok: false, error: GENERIC_ERROR_MESSAGE },
        { status: 502 }
      );
    }
    if (err instanceof JobberGraphqlError) {
      console.error("[api/leads] Jobber GraphQL failure", {
        status: err.status,
        errors: err.graphqlErrors,
      });
      return NextResponse.json(
        { ok: false, error: GENERIC_ERROR_MESSAGE },
        { status: 502 }
      );
    }
    if (err instanceof JobberMutationError) {
      console.error("[api/leads] Jobber mutation userErrors", {
        userErrors: err.userErrors,
      });
      return NextResponse.json(
        { ok: false, error: GENERIC_ERROR_MESSAGE },
        { status: 502 }
      );
    }
    if (err instanceof Error) {
      console.error(`[api/leads] unexpected error: ${err.name}: ${err.message}`);
    } else {
      console.error("[api/leads] unexpected non-Error:", err);
    }
    return NextResponse.json(
      { ok: false, error: GENERIC_ERROR_MESSAGE },
      { status: 500 }
    );
  }
}

// Explicit 405 for non-POST so probes don't get a confusing 404.
export async function GET(): Promise<Response> {
  return NextResponse.json(
    { ok: false, error: "Method not allowed — use POST" },
    { status: 405, headers: { Allow: "POST" } }
  );
}
