// Jobber GraphQL mutation strings + typed variable shapes.
// clientCreate is final (BACKEND_PLAN.md §3.2).
// propertyCreate / requestCreate are TODOs until session 1 step 5 resolves
// Case A vs Case B against the live schema (BACKEND_PLAN.md §3.3).

// ---------------------------------------------------------------------------
// clientCreate (final)
// ---------------------------------------------------------------------------

export const CLIENT_CREATE_MUTATION = /* GraphQL */ `
  mutation ClientCreate($input: ClientCreateInput!) {
    clientCreate(input: $input) {
      client {
        id
        firstName
        lastName
      }
      userErrors {
        message
        path
      }
    }
  }
`;

export interface JobberPhoneInput {
  description: "MAIN" | "WORK" | "MOBILE" | "HOME";
  primary: boolean;
  number: string;
}

export interface JobberEmailInput {
  description: "MAIN" | "WORK";
  primary: boolean;
  address: string;
}

export interface JobberAddressInput {
  street1: string;
  city?: string;
  province?: string;     // Jobber uses `province` for state in NA
  postalCode?: string;
  country?: string;
}

export interface ClientCreateInput {
  firstName: string;
  lastName: string;
  emails: JobberEmailInput[];
  phones: JobberPhoneInput[];
  billingAddress?: JobberAddressInput;
}

export interface ClientCreateResponse {
  clientCreate: {
    client: { id: string; firstName: string; lastName: string } | null;
    userErrors: { message: string; path: string[] }[];
  };
}

// ---------------------------------------------------------------------------
// propertyCreate (placeholder — finalized in session 1 step 5)
// ---------------------------------------------------------------------------

// TODO(session-1, step-5): replace once GraphiQL introspection confirms
// PropertyCreateInput shape. See BACKEND_PLAN.md §3.3.
export const PROPERTY_CREATE_MUTATION = /* GraphQL */ `
  # placeholder — do not call until session 1 step 5
  mutation PropertyCreatePlaceholder { __typename }
`;

// ---------------------------------------------------------------------------
// requestCreate (placeholder — finalized in session 1 step 5)
// ---------------------------------------------------------------------------

// TODO(session-1, step-5): replace once GraphiQL introspection confirms
// RequestCreateInput shape (Case A inline vs Case B separate property). See
// BACKEND_PLAN.md §3.3.
export const REQUEST_CREATE_MUTATION = /* GraphQL */ `
  # placeholder — do not call until session 1 step 5
  mutation RequestCreatePlaceholder { __typename }
`;

// Address-mode flag — flip to "inline" after schema check confirms Case A.
// Default "separate" assumes the more conservative path (3 calls).
export type AddressMode = "inline" | "separate";
export const ADDRESS_MODE: AddressMode = "separate";
