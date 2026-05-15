"use client"

import { Button } from "@/components/ui/button"
import { Phone } from "lucide-react"

export function FinalCTA() {
  const handleGetEstimate = () => {
    const bookingSection = document.getElementById("booking")
    bookingSection?.scrollIntoView({ behavior: "smooth" })
  }

  return (
    <section className="bg-hero-bg py-20 md:py-28" id="contact">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl md:text-5xl font-bold text-hero-foreground mb-6 text-balance">
          Ready for Better Water?
        </h2>
        <p className="text-lg text-hero-foreground/90 mb-8 max-w-2xl mx-auto leading-relaxed">
          Join thousands of Utah families who trust Delahunty Water Systems for cleaner, safer, better-tasting water. 
          Get your free estimate today—no pressure, no obligation.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button
            onClick={handleGetEstimate}
            size="lg"
            className="bg-cta hover:bg-cta/90 text-cta-foreground text-base font-semibold px-10 rounded-full"
          >
            GET AN ESTIMATE
          </Button>
          <span className="text-hero-foreground/70">or</span>
          <a 
            href="tel:4359015045" 
            className="flex items-center gap-2 text-hero-foreground hover:text-accent transition font-semibold"
          >
            <Phone className="w-5 h-5" />
            <span>(435) 901-5045</span>
          </a>
        </div>
        <p className="text-sm text-hero-foreground/70 mt-8">
          Family-owned • Locally operated • Serving Utah since 1994
        </p>
      </div>
    </section>
  )
}
