// Thin GraphQL POST wrapper for Jobber.
// Returns the parsed `data` object on success; throws on transport errors,
// non-OK status, or non-empty `errors` array. `userErrors` from individual
// mutations are surfaced via the response shape and inspected by callers.
// See BACKEND_PLAN.md §3.1.

import { JOBBER_GRAPHQL_URL } from "@/lib/jobber/config";

export interface JobberGraphqlOptions {
  accessToken: string;
  graphqlVersion: string;
}

export class JobberGraphqlError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly graphqlErrors?: unknown
  ) {
    super(message);
    this.name = "JobberGraphqlError";
  }
}

interface GraphqlBody<TData> {
  data?: TData;
  errors?: unknown;
}

export async function jobberGraphql<TData>(
  query: string,
  variables: Record<string, unknown>,
  options: JobberGraphqlOptions
): Promise<TData> {
  const response = await fetch(JOBBER_GRAPHQL_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${options.accessToken}`,
      "Content-Type": "application/json",
      "X-JOBBER-GRAPHQL-VERSION": options.graphqlVersion,
    },
    body: JSON.stringify({ query, variables }),
    cache: "no-store",
  });

  const text = await response.text();

  let body: GraphqlBody<TData>;
  try {
    body = JSON.parse(text) as GraphqlBody<TData>;
  } catch {
    throw new JobberGraphqlError(
      `Jobber GraphQL returned non-JSON body (status ${response.status})`,
      response.status
    );
  }

  if (!response.ok) {
    throw new JobberGraphqlError(
      `Jobber GraphQL transport error (status ${response.status})`,
      response.status,
      body.errors
    );
  }

  if (Array.isArray(body.errors) && body.errors.length > 0) {
    throw new JobberGraphqlError(
      "Jobber GraphQL returned errors",
      response.status,
      body.errors
    );
  }

  if (!body.data) {
    throw new JobberGraphqlError(
      "Jobber GraphQL response missing `data`",
      response.status
    );
  }

  return body.data;
}
