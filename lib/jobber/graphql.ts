// Thin GraphQL POST wrapper for Jobber.
// Returns the raw `data` object on success and throws on transport / GraphQL errors.
// See BACKEND_PLAN.md §3.1.

// TODO(session-1, step-5): implement. Stubbed for now so the smoke test script
// import resolves at scaffold time.

export interface JobberGraphqlOptions {
  accessToken: string;
  graphqlVersion: string;
}

export async function jobberGraphql<TData>(
  _query: string,
  _variables: Record<string, unknown>,
  _options: JobberGraphqlOptions
): Promise<TData> {
  throw new Error("jobberGraphql not implemented yet (session 1, step 5)");
}
