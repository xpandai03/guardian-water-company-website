// Lead intake schema — 6 fields per the David brief.
// Source of truth: BACKEND_PLAN.md §2.

import { z } from "zod";

export const WATER_SOURCES = ["city", "well", "unknown"] as const;
export type WaterSource = (typeof WATER_SOURCES)[number];

export const leadSchema = z.object({
  firstName: z.string().trim().min(1, "First name is required").max(80),
  lastName:  z.string().trim().min(1, "Last name is required").max(80),
  phone:     z
    .string()
    .trim()
    .transform((v) => v.replace(/[^\d+]/g, ""))
    .refine((v) => /^(\+1)?\d{10}$/.test(v), "Enter a valid US phone number")
    .transform((v) => (v.startsWith("+1") ? v : `+1${v}`)),
  email:     z.string().trim().email("Enter a valid email").max(254),
  street:    z.string().trim().min(3, "Street address is required").max(200),
  waterSource: z.enum(WATER_SOURCES),
  notes:     z.string().trim().max(2000).optional().default(""),
  smsConsent: z.boolean().default(true),
});

export type LeadInput = z.infer<typeof leadSchema>;

// Human-readable label used in the Jobber request `details` body.
export const WATER_SOURCE_LABEL: Record<WaterSource, string> = {
  city:    "City Water",
  well:    "Well Water",
  unknown: "Not Sure",
};
