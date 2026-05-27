"use client";

// Lead-capture form for /contact. Posts to the existing POST /api/leads route
// (AUDIT_PHASE_A.md §3), which validates with the same leadSchema and creates a
// Client + Property + Request in David's Jobber CRM.
//
// Phase A scope — see PHASE_A_PLAN.md §3.

import { useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { CircleCheck } from "lucide-react";

import {
  leadSchema,
  type LeadInput,
  WATER_SOURCES,
  WATER_SOURCE_LABEL,
} from "@/lib/leads/schema";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";

// The form holds the schema INPUT shape — values before Zod runs its transforms
// (phone normalization) and defaults (notes). zodResolver hands the OUTPUT
// shape (LeadInput) to onSubmit. See AUDIT_PHASE_A.md §2, Flag 2.
type LeadFormInput = z.input<typeof leadSchema>;

// Mirrors the /api/leads response contract — AUDIT_PHASE_A.md §3.
type LeadApiResponse =
  | { ok: true; clientId: string; requestId: string }
  | { ok: false; error: string; fieldErrors?: Record<string, string[]> };

const GENERIC_ERROR = "Could not submit your request, please try again";

// Used to map server-side 400 fieldErrors back onto individual fields.
const FORM_FIELD_NAMES: readonly (keyof LeadFormInput)[] = [
  "firstName",
  "lastName",
  "phone",
  "email",
  "street",
  "waterSource",
  "notes",
];

export function EstimateForm() {
  const [submitted, setSubmitted] = useState(false);

  const form = useForm<LeadFormInput>({
    resolver: zodResolver(leadSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      phone: "",
      email: "",
      street: "",
      notes: "",
      // waterSource intentionally omitted — no schema default forces a choice.
    },
  });

  const isSubmitting = form.formState.isSubmitting;

  const onSubmit: SubmitHandler<LeadFormInput> = async (values) => {
    // zodResolver has already validated `values`. Re-run the schema to obtain
    // the OUTPUT shape — normalized phone, defaulted notes — as a typed
    // LeadInput. @hookform/resolvers@3 doesn't surface the transformed type
    // through useForm, so this explicit parse bridges z.input -> z.output
    // (see AUDIT_PHASE_A.md §2, Flag 2).
    const lead: LeadInput = leadSchema.parse(values);

    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(lead),
      });

      const data = (await res
        .json()
        .catch(() => null)) as LeadApiResponse | null;

      // 201 — lead created.
      if (res.ok && data?.ok) {
        setSubmitted(true);
        return;
      }

      // 400 with per-field errors — surface them inline on each field.
      if (res.status === 400 && data && !data.ok && data.fieldErrors) {
        const fieldErrors = data.fieldErrors;
        let applied = false;
        for (const name of FORM_FIELD_NAMES) {
          const message = fieldErrors[name]?.[0];
          if (message) {
            form.setError(name, { type: "server", message });
            applied = true;
          }
        }
        toast.error(
          applied
            ? "Please fix the highlighted fields and try again."
            : data.error || GENERIC_ERROR,
        );
        return;
      }

      // 500 / 502 / anything else — generic toast with a retry action.
      toast.error(data && !data.ok && data.error ? data.error : GENERIC_ERROR, {
        action: {
          label: "Try again",
          onClick: () => void form.handleSubmit(onSubmit)(),
        },
      });
    } catch {
      // Network failure / fetch rejection.
      toast.error(GENERIC_ERROR, {
        action: {
          label: "Try again",
          onClick: () => void form.handleSubmit(onSubmit)(),
        },
      });
    }
  };

  // Success state — replaces the form card entirely (PHASE_A_PLAN.md §3).
  if (submitted) {
    return (
      <Card className="border-border">
        <CardContent className="flex flex-col items-center gap-4 py-12 text-center">
          <CircleCheck
            className="h-12 w-12 text-cta"
            strokeWidth={1.75}
            aria-hidden="true"
          />
          <h2 className="text-2xl font-bold text-primary">Request received</h2>
          <p className="max-w-sm text-muted-foreground leading-relaxed">
            Thanks — we&apos;ve got your request. David will personally reach
            out within one business day.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-border">
      <CardHeader>
        <CardTitle className="text-xl text-primary">
          Request your free water test
        </CardTitle>
        <CardDescription>
          Tell us a little about your home and water — it takes about a minute.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} noValidate>
            {/* Native fieldset[disabled] cascades to every control + the submit
                button during submission — blocks edits and double-submits. */}
            <fieldset
              disabled={isSubmitting}
              className="m-0 min-w-0 space-y-5 border-0 p-0"
            >
              {/* First + last name */}
              <div className="grid gap-5 sm:grid-cols-2">
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>First name</FormLabel>
                      <FormControl>
                        <Input
                          autoComplete="given-name"
                          placeholder="Jane"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="lastName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Last name</FormLabel>
                      <FormControl>
                        <Input
                          autoComplete="family-name"
                          placeholder="Doe"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Phone + email */}
              <div className="grid gap-5 sm:grid-cols-2">
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone</FormLabel>
                      <FormControl>
                        <Input
                          type="tel"
                          inputMode="tel"
                          autoComplete="tel"
                          placeholder="(216) 555-0142"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          inputMode="email"
                          autoComplete="email"
                          placeholder="jane@example.com"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Street address */}
              <FormField
                control={form.control}
                name="street"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Street address</FormLabel>
                    <FormControl>
                      <Input
                        autoComplete="street-address"
                        placeholder="123 Maple St, Cleveland, OH"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Water source */}
              <FormField
                control={form.control}
                name="waterSource"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Where does your water come from?</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select your water source" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {WATER_SOURCES.map((source) => (
                          <SelectItem key={source} value={source}>
                            {WATER_SOURCE_LABEL[source]}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Notes (optional) */}
              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Anything else?{" "}
                      <span className="font-normal text-muted-foreground">
                        (optional)
                      </span>
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        rows={4}
                        placeholder="Tell us about any water concerns — taste, smell, staining, hard water…"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                size="lg"
                className="w-full rounded-full bg-cta font-semibold text-cta-foreground hover:bg-cta/90"
              >
                {isSubmitting ? (
                  <>
                    <Spinner />
                    Submitting…
                  </>
                ) : (
                  "Request my free water test"
                )}
              </Button>
            </fieldset>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
