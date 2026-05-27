import Image from "next/image";
import Link from "next/link";
import { Phone, Mail, MapPin, Clock } from "lucide-react";

import { Container } from "@/components/layout/container";
import { WaterRightBadge } from "@/components/water-right-badge";

const servicesLinks = [
  { href: "/services/city-water", label: "City Water" },
  { href: "/services/well-water", label: "Well Water" },
  { href: "/services/ro-systems", label: "RO Systems" },
] as const;

const companyLinks = [
  { href: "/about",   label: "About" },
  { href: "/blog",    label: "Blog" },
  { href: "/contact", label: "Contact" },
] as const;

// TODO(david): confirm the service-area list. These are placeholder cities
// chosen for NE Ohio coverage in FRONTEND_PLAN.md §9 / §2.H.
const serviceAreas = [
  "Cleveland",
  "Akron",
  "Canton",
  "Mentor",
  "Lakewood",
  "Strongsville",
  "Cuyahoga Falls",
  "Parma",
] as const;

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-primary text-primary-foreground">
      <Container className="py-14 md:py-20">
        <div className="grid gap-10 md:grid-cols-4">
          {/* Column 1: brand + NAP */}
          <div>
            <Image
              src="/brand/guardian-water-text-logo.png"
              alt="Guardian Water"
              width={440}
              height={300}
              className="mb-4 h-auto w-[200px] object-contain"
            />

            <p className="text-sm text-primary-foreground/70 leading-relaxed mb-6">
              Northeast Ohio&apos;s local water filtration experts. Cleaner, safer water for your home — installed by a team you can call.
            </p>

            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-accent shrink-0" aria-hidden="true" />
                <a
                  href="tel:+14406434222"
                  className="text-primary-foreground/70 hover:text-accent transition"
                >
                  (440) 643-4222
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-accent shrink-0" aria-hidden="true" />
                <a
                  href="mailto:sales@guardianwatercompany.com"
                  className="text-primary-foreground/70 hover:text-accent transition"
                >
                  sales@guardianwatercompany.com
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-accent shrink-0" aria-hidden="true" />
                <span className="text-primary-foreground/70">Mon–Fri, 9am–9pm</span>
              </li>
              {/* TODO(david): real street address */}
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-accent mt-0.5 shrink-0" aria-hidden="true" />
                <span className="text-primary-foreground/70">
                  Serving Northeast Ohio
                </span>
              </li>
            </ul>

            <WaterRightBadge className="mt-6 text-primary-foreground/70" />
          </div>

          {/* Column 2: services */}
          <div>
            <h4 className="font-semibold mb-4 text-sm uppercase tracking-wider">Services</h4>
            <ul className="space-y-2 text-sm text-primary-foreground/70">
              {servicesLinks.map((s) => (
                <li key={s.href}>
                  <Link href={s.href} className="hover:text-accent transition">
                    {s.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: company */}
          <div>
            <h4 className="font-semibold mb-4 text-sm uppercase tracking-wider">Company</h4>
            <ul className="space-y-2 text-sm text-primary-foreground/70">
              {companyLinks.map((c) => (
                <li key={c.href}>
                  <Link href={c.href} className="hover:text-accent transition">
                    {c.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: service area */}
          <div>
            <h4 className="font-semibold mb-4 text-sm uppercase tracking-wider">Service Area</h4>
            <ul className="flex flex-wrap gap-2 text-xs">
              {serviceAreas.map((area) => (
                <li
                  key={area}
                  className="rounded-full bg-primary-foreground/10 px-3 py-1 text-primary-foreground/80"
                >
                  {area}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-primary-foreground/15 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-primary-foreground/60">
          <p>&copy; {year} Guardian Water, LLC. All rights reserved.</p>
          <div className="flex gap-6">
            {/* TODO(david): real privacy + terms copy */}
            <Link href="/privacy" className="hover:text-accent transition">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-accent transition">
              Terms of Service
            </Link>
          </div>
        </div>
      </Container>
    </footer>
  );
}
