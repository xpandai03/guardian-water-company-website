// Lead-creation orchestrator: takes a validated LeadInput and creates a
// Client + Request in Jobber. Two GraphQL calls (Case C, BACKEND_PLAN.md §3.3):
//
//   1. clientCreate   — creates client + property in one call (inline properties[])
//   2. requestCreate  — attaches a Request to the new client + property
//
// Throws on any error; the route handler decides how to translate into HTTP.

import { jobberGraphql } from "@/lib/jobber/graphql";
import { getAccessToken } from "@/lib/jobber/client";
import {
  CLIENT_CREATE_MUTATION,
  REQUEST_CREATE_MUTATION,
  type ClientCreateInput,
  type ClientCreateResponse,
  type JobberUserError,
  type RequestCreateInput,
  type RequestCreateResponse,
} from "@/lib/jobber/mutations";
import { type LeadInput, WATER_SOURCE_LABEL } from "@/lib/leads/schema";

export interface SubmitLeadResult {
  clientId: string;
  propertyId: string;
  requestId: string;
}

export class JobberMutationError extends Error {
  constructor(
    message: string,
    public readonly userErrors: JobberUserError[]
  ) {
    super(message);
    this.name = "JobberMutationError";
  }
}

// Title strategy: `requestDetails` is FormInput-only in the live schema, so
// the homeowner's water-source + free-text notes go in the request title
// where David will see them in the Jobber UI.
//
//   "Website lead — City Water — Water tastes like a swimming pool"
//   "Website lead — Well Water"   (when notes is empty)
//
// Notes truncated to 80 chars + ellipsis if longer; whole title capped at
// 140 chars defensively.
export function buildRequestTitle(input: LeadInput): string {
  const base = `Website lead — ${WATER_SOURCE_LABEL[input.waterSource]}`;
  const notes = input.notes.trim();
  if (!notes) return base;
  const truncated = notes.length > 80 ? `${notes.slice(0, 80)}…` : notes;
  const full = `${base} — ${truncated}`;
  return full.length > 140 ? `${full.slice(0, 139)}…` : full;
}

export async function submitLead(input: LeadInput): Promise<SubmitLeadResult> {
  const ctx = await getAccessToken();

  // ---- clientCreate (with inline property) ----
  const clientInput: ClientCreateInput = {
    firstName: input.firstName,
    lastName: input.lastName,
    emails: [{ description: "MAIN", primary: true, address: input.email }],
    phones: [{ description: "MAIN", primary: true, number: input.phone }],
    properties: [
      {
        address: {
          street1: input.street,
          province: "OH",
        },
      },
    ],
  };

  const clientResp = await jobberGraphql<ClientCreateResponse>(
    CLIENT_CREATE_MUTATION,
    { input: clientInput },
    ctx
  );

  if (clientResp.clientCreate.userErrors.length > 0) {
    throw new JobberMutationError(
      "clientCreate returned userErrors",
      clientResp.clientCreate.userErrors
    );
  }

  const client = clientResp.clientCreate.client;
  if (!client) {
    throw new Error("clientCreate returned a null client without userErrors");
  }

  const propertyId = client.clientProperties.nodes[0]?.id;
  if (!propertyId) {
    throw new Error(
      "clientCreate did not return a property id — inline property attach failed"
    );
  }

  // ---- requestCreate ----
  const requestInput: RequestCreateInput = {
    clientId: client.id,
    propertyId,
    title: buildRequestTitle(input),
  };

  const requestResp = await jobberGraphql<RequestCreateResponse>(
    REQUEST_CREATE_MUTATION,
    { input: requestInput },
    ctx
  );

  if (requestResp.requestCreate.userErrors.length > 0) {
    throw new JobberMutationError(
      "requestCreate returned userErrors",
      requestResp.requestCreate.userErrors
    );
  }

  const request = requestResp.requestCreate.request;
  if (!request) {
    throw new Error("requestCreate returned a null request without userErrors");
  }

  return { clientId: client.id, propertyId, requestId: request.id };
}
