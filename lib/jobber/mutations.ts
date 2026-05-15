// Jobber GraphQL mutation strings + typed variable shapes.
//
// Locked against Jobber GraphQL version 2025-04-16 via live introspection
// + a successful end-to-end test mutation. See BACKEND_PLAN.md §3.
//
// Resolved approach: "Case C" — ClientCreateInput accepts inline `properties[]`,
// so we do client + property creation in a SINGLE clientCreate call, then
// requestCreate with both ids. No standalone propertyCreate is needed.

// ---------------------------------------------------------------------------
// Shared scalar shapes (introspected names: PhoneNumberCreateAttributes,
// EmailCreateAttributes, AddressAttributes, PropertyAttributes)
// ---------------------------------------------------------------------------

// Confirmed working enum value for both phone + email `description`. Other
// enum values exist (WORK / HOME / etc.) but `MAIN` is the canonical default
// used by Jobber's own UI for primary contact info.
export type JobberContactDescription = "MAIN";

export interface PhoneNumberCreateAttributes {
  description: JobberContactDescription;
  primary: boolean;
  number: string; // E.164
}

export interface EmailCreateAttributes {
  description: JobberContactDescription;
  primary: boolean;
  address: string;
}

// All fields optional per introspection; populate what we have.
// Jobber uses `province` for the US "state" field in NA.
export interface AddressAttributes {
  street1?: string;
  street2?: string;
  city?: string;
  province?: string;
  postalCode?: string;
  country?: string;
}

// PropertyAttributes.address is NON_NULL.
export interface PropertyAttributes {
  address: AddressAttributes;
}

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
        clientProperties {
          nodes {
            id
          }
        }
      }
      userErrors {
        message
        path
      }
    }
  }
`;

export interface ClientCreateInput {
  firstName: string;
  lastName: string;
  emails: EmailCreateAttributes[];
  phones: PhoneNumberCreateAttributes[];
  properties?: PropertyAttributes[];
  billingAddress?: AddressAttributes;
}

export interface JobberClient {
  id: string;
  firstName: string;
  lastName: string;
  clientProperties: {
    nodes: { id: string }[];
  };
}

export interface JobberUserError {
  message: string;
  path: string[];
}

export interface ClientCreateResponse {
  clientCreate: {
    client: JobberClient | null;
    userErrors: JobberUserError[];
  };
}

// ---------------------------------------------------------------------------
// requestCreate (final)
// ---------------------------------------------------------------------------
//
// requestDetails on RequestCreateInput is a FormInput type — it does NOT take
// free-text. v1 puts homeowner context in the `title` field instead; see
// `buildRequestTitle` in lib/leads/submit-lead.ts. v1.5 will attach a real
// Jobber Form via FormInput once David configures intake forms.

export const REQUEST_CREATE_MUTATION = /* GraphQL */ `
  mutation RequestCreate($input: RequestCreateInput!) {
    requestCreate(input: $input) {
      request {
        id
        title
      }
      userErrors {
        message
        path
      }
    }
  }
`;

export interface RequestCreateInput {
  clientId: string;       // NON_NULL
  propertyId?: string;    // optional in schema; we always send it
  title?: string;         // optional in schema; we always send it
}

export interface JobberRequest {
  id: string;
  title: string | null;
}

export interface RequestCreateResponse {
  requestCreate: {
    request: JobberRequest | null;
    userErrors: JobberUserError[];
  };
}
