import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
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

// Google Tag Manager — David's Google Ads container (requested 2026-09-30).
// Production only so preview/dev traffic never pollutes Ads data.
// Do NOT duplicate this anywhere else or add a second GTM/gtag snippet — see docs/HANDOFF.md.
const GTM_ID = "GTM-N5LKMG7K";
const enableGtm = process.env.VERCEL_ENV === "production";

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="font-sans">
        {enableGtm && (
          <noscript>
            <iframe
              src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
              height="0"
              width="0"
              style={{ display: "none", visibility: "hidden" }}
            />
          </noscript>
        )}
        {enableGtm && (
          <Script id="gtm-init" strategy="afterInteractive">
            {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${GTM_ID}');`}
          </Script>
        )}
        {children}
        <Toaster theme="light" position="top-center" richColors closeButton />
        {process.env.NODE_ENV === "production" && <Analytics />}
      </body>
    </html>
  );
}
