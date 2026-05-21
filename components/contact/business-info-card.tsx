import type { ReactNode } from "react";
import { Clock, Mail, MapPin, Phone } from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

// Right-rail contact card for /contact.
//
// Every value here is a PLACEHOLDER. David has not finalized his phone number,
// hours, or email — see PHASE_A_PLAN.md §7. Each is marked TODO(david) and must
// be filled in before launch. Mirrors the placeholder pattern already used in
// components/footer.tsx.

function InfoRow({
  icon,
  label,
  children,
}: {
  icon: ReactNode;
  label: string;
  children: ReactNode;
}) {
  return (
    <div className="flex items-start gap-3">
      <span className="mt-0.5 text-accent" aria-hidden="true">
        {icon}
      </span>
      <div>
        <p className="font-semibold text-foreground">{label}</p>
        <div className="text-muted-foreground">{children}</div>
      </div>
    </div>
  );
}

export function BusinessInfoCard() {
  return (
    <Card className="border-border">
      <CardHeader>
        <CardTitle className="text-lg text-primary">Prefer to talk?</CardTitle>
      </CardHeader>
      <CardContent className="space-y-5 text-sm">
        {/* TODO(david): real phone number */}
        <InfoRow icon={<Phone className="h-4 w-4" />} label="Call or text">
          (xxx) xxx-xxxx
        </InfoRow>

        {/* TODO(david): real email address */}
        <InfoRow icon={<Mail className="h-4 w-4" />} label="Email">
          hello@guardianwater.com
        </InfoRow>

        {/* TODO(david): real business hours */}
        <InfoRow icon={<Clock className="h-4 w-4" />} label="Hours">
          Mon–Fri, 8:00am–6:00pm
        </InfoRow>

        {/* TODO(david): confirm service-area wording */}
        <InfoRow icon={<MapPin className="h-4 w-4" />} label="Service area">
          Serving Northeast Ohio
        </InfoRow>
      </CardContent>
    </Card>
  );
}
