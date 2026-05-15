// End-to-end smoke test against David's live Jobber.
//
// Runs the same submitLead pipeline the future /api/leads route will use, with
// hardcoded test data. Creates a real Client + Request — delete from David's
// Jobber UI after verifying.
//
// Run from the repo root:
//   pnpm exec tsx --env-file=.env.local scripts/test-jobber-mutation.ts
//
// Or, if `tsx` isn't installed locally:
//   npx tsx --env-file=.env.local scripts/test-jobber-mutation.ts
//
// Required env vars (from .env.local — see .env.local.example):
//   JOBBER_CLIENT_ID, JOBBER_CLIENT_SECRET, JOBBER_REFRESH_TOKEN,
//   JOBBER_GRAPHQL_VERSION (recommended: 2025-04-16)

import { JobberMutationError, submitLead } from "@/lib/leads/submit-lead";
import { leadSchema } from "@/lib/leads/schema";

async function main(): Promise<void> {
  // Re-runs the same Zod normalization the API route will, so this exercises
  // the full client → server validation contract too.
  const parsed = leadSchema.parse({
    firstName: "Smoke",
    lastName: "Test",
    email: "smoke@xpand.test",
    phone: "+12165551234",
    street: "456 Smoke Test Ave",
    waterSource: "well",
    notes: "End-to-end smoke test from script — please delete",
  });

  console.log("[smoke] submitting test lead to Jobber…");
  console.log(`[smoke] graphql version: ${process.env.JOBBER_GRAPHQL_VERSION ?? "(unset, using fallback)"}`);

  try {
    const result = await submitLead(parsed);
    console.log("[smoke] success");
    console.log(`  clientId:   ${result.clientId}`);
    console.log(`  propertyId: ${result.propertyId}`);
    console.log(`  requestId:  ${result.requestId}`);
    console.log("");
    console.log("Open David's Jobber UI to confirm the test client + request appear, then delete them.");
  } catch (err) {
    if (err instanceof JobberMutationError) {
      console.error("[smoke] mutation userErrors:");
      for (const ue of err.userErrors) {
        console.error(`  - ${ue.path.join(".") || "(root)"}: ${ue.message}`);
      }
    } else if (err instanceof Error) {
      console.error(`[smoke] failed: ${err.name}: ${err.message}`);
      if (err.stack) console.error(err.stack);
    } else {
      console.error("[smoke] failed with non-Error:", err);
    }
    process.exit(1);
  }
}

void main();
