import type { ReactNode } from "react";
import { Clock, Mail, MapPin, Phone } from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

// Right-rail contact card for /contact.

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
        <InfoRow icon={<Phone className="h-4 w-4" />} label="Call or text">
          <a
            href="tel:+14406434222"
            className="hover:text-accent transition"
          >
            (440) 643-4222
          </a>
        </InfoRow>

        <InfoRow icon={<Mail className="h-4 w-4" />} label="Email">
          <a
            href="mailto:sales@guardianwatercompany.com"
            className="hover:text-accent transition"
          >
            sales@guardianwatercompany.com
          </a>
        </InfoRow>

        <InfoRow icon={<Clock className="h-4 w-4" />} label="Hours">
          Mon–Fri, 9am–9pm
        </InfoRow>

        {/* TODO(david): confirm service-area wording */}
        <InfoRow icon={<MapPin className="h-4 w-4" />} label="Service area">
          Serving Northeast Ohio
        </InfoRow>
      </CardContent>
    </Card>
  );
}
