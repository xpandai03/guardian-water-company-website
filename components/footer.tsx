import Link from "next/link";
import { Phone, Mail, MapPin } from "lucide-react";

import { Container } from "@/components/layout/container";

// TODO(david): replace placeholder SVG with real logo asset once received.
function FooterLogoMark() {
  return (
    <svg
      viewBox="0 0 40 40"
      className="w-10 h-10"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path d="M20 4L8 20C8 28 13 36 20 36C27 36 32 28 32 20L20 4Z" className="fill-accent" />
      <path d="M20 12L14 22C14 26 16.5 30 20 30C23.5 30 26 26 26 22L20 12Z" className="fill-primary" />
    </svg>
  );
}

const servicesLinks = [
  { href: "/services/whole-house-filtration", label: "Whole House Filtration" },
  { href: "/services/water-softeners",        label: "Water Softeners" },
  { href: "/services/reverse-osmosis",        label: "Reverse Osmosis Systems" },
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
            <div className="flex items-center gap-3 mb-4">
              <FooterLogoMark />
              <div className="flex flex-col leading-none">
                <span className="font-bold text-lg">
                  DELAHUNTY<span className="text-accent font-normal">WATER</span>
                </span>
                <span className="text-[10px] tracking-[0.25em] text-primary-foreground/70 mt-1">
                  SYSTEMS
                </span>
              </div>
            </div>
            <p className="text-sm text-primary-foreground/70 leading-relaxed mb-6">
              Northeast Ohio&apos;s local water filtration experts. Cleaner, safer water for your home — installed by a team you can call.
            </p>

            <ul className="space-y-3 text-sm">
              {/* TODO(david): real phone number */}
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-accent shrink-0" aria-hidden="true" />
                <span className="text-primary-foreground/70">(xxx) xxx-xxxx</span>
              </li>
              {/* TODO(david): real email */}
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-accent shrink-0" aria-hidden="true" />
                <span className="text-primary-foreground/70">hello@delahuntywater.com</span>
              </li>
              {/* TODO(david): real address */}
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-accent mt-0.5 shrink-0" aria-hidden="true" />
                <span className="text-primary-foreground/70">
                  Serving Northeast Ohio
                </span>
              </li>
            </ul>
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
          <p>&copy; {year} Delahunty Water Systems. All rights reserved.</p>
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
