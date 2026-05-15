"use client";

import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Container } from "@/components/layout/container";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";

// TODO(david): replace placeholder SVG with real logo asset once received.
function LogoMark() {
  return (
    <svg
      viewBox="0 0 40 40"
      className="w-9 h-9"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path d="M20 4L8 20C8 28 13 36 20 36C27 36 32 28 32 20L20 4Z" className="fill-accent" />
      <path d="M20 12L14 22C14 26 16.5 30 20 30C23.5 30 26 26 26 22L20 12Z" className="fill-background" />
    </svg>
  );
}

const services = [
  {
    href: "/services/whole-house-filtration",
    title: "Whole House Filtration",
    description: "Clean, filtered water at every tap.",
  },
  {
    href: "/services/water-softeners",
    title: "Water Softeners",
    description: "Eliminate hard-water scale and protect appliances.",
  },
  {
    href: "/services/reverse-osmosis",
    title: "Reverse Osmosis Systems",
    description: "Drinking-water-grade purification under your sink.",
  },
] as const;

const primaryLinks = [
  { href: "/about", label: "About" },
  { href: "/blog", label: "Blog" },
  { href: "/contact", label: "Contact" },
] as const;

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-background border-b border-border">
      <Container className="flex items-center justify-between py-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group" aria-label="Delahunty Water Systems — home">
          <LogoMark />
          <div className="flex flex-col leading-none">
            <span className="font-bold text-lg text-primary">
              DELAHUNTY<span className="text-accent font-normal">WATER</span>
            </span>
            <span className="text-[10px] tracking-[0.25em] text-muted-foreground mt-1">
              SYSTEMS
            </span>
          </div>
        </Link>

        {/* Desktop nav */}
        <NavigationMenu className="hidden md:flex" viewport={false}>
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
                <Link href="/about">About</Link>
              </NavigationMenuLink>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <NavigationMenuTrigger>Services</NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid w-[320px] gap-1 p-2">
                  {services.map((s) => (
                    <li key={s.href}>
                      <NavigationMenuLink asChild>
                        <Link href={s.href}>
                          <div className="font-medium text-foreground">{s.title}</div>
                          <p className="text-xs text-muted-foreground">{s.description}</p>
                        </Link>
                      </NavigationMenuLink>
                    </li>
                  ))}
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
                <Link href="/blog">Blog</Link>
              </NavigationMenuLink>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
                <Link href="/contact">Contact</Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>

        {/* CTA + mobile toggle */}
        <div className="flex items-center gap-2">
          {/* TODO(david): when his real phone number arrives, add a tel: link here
              on desktop similar to Wahoo's header (reference/wahoo/01-hero-desktop.png). */}
          <Button
            asChild
            className="hidden sm:inline-flex bg-cta hover:bg-cta/90 text-cta-foreground font-semibold rounded-full px-5"
          >
            <Link href="/contact">Get an Estimate</Link>
          </Button>

          <button
            type="button"
            className="md:hidden inline-flex items-center justify-center p-2 -mr-2 text-foreground"
            onClick={() => setMobileOpen((o) => !o)}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
            aria-controls="mobile-menu"
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </Container>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div id="mobile-menu" className="md:hidden border-t border-border bg-background">
          <Container className={cn("py-6 space-y-1")}>
            <Link
              href="/about"
              className="block py-3 text-base font-medium text-foreground hover:text-accent transition"
              onClick={() => setMobileOpen(false)}
            >
              About
            </Link>

            <div className="py-2">
              <span className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                Services
              </span>
              <ul className="space-y-1 pl-2">
                {services.map((s) => (
                  <li key={s.href}>
                    <Link
                      href={s.href}
                      onClick={() => setMobileOpen(false)}
                      className="block py-2 text-base text-foreground hover:text-accent transition"
                    >
                      {s.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {primaryLinks
              .filter((l) => l.href !== "/about")
              .map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  onClick={() => setMobileOpen(false)}
                  className="block py-3 text-base font-medium text-foreground hover:text-accent transition"
                >
                  {l.label}
                </Link>
              ))}

            <Button
              asChild
              className="w-full mt-4 bg-cta hover:bg-cta/90 text-cta-foreground font-semibold rounded-full"
            >
              <Link href="/contact" onClick={() => setMobileOpen(false)}>
                Get an Estimate
              </Link>
            </Button>
          </Container>
        </div>
      )}
    </header>
  );
}
