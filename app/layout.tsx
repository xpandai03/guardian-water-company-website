import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";

import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
  variable: "--font-inter",
});

// TODO(david): replace with real business description + locale once David sends
// the final company copy. Keeping NE Ohio-grounded placeholder for now.
//
// Favicon + apple-touch-icon are served via Next.js file-based metadata
// (app/icon.png, app/apple-icon.png), so no `icons` field is needed here.
export const metadata: Metadata = {
  title: {
    default: "Guardian Water | Northeast Ohio Water Filtration",
    template: "%s | Guardian Water",
  },
  description:
    "Northeast Ohio's local water filtration experts. Whole house filtration, water softeners, and reverse osmosis systems for cleaner, safer water at home.",
  verification: {
    other: {
      "facebook-domain-verification": "7d0wmokxz7vzuwgea6541o99uc55vr",
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="font-sans">
        {children}
        <Toaster theme="light" position="top-center" richColors closeButton />
        {process.env.NODE_ENV === "production" && <Analytics />}
      </body>
    </html>
  );
}
