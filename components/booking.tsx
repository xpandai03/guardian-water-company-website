"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Phone } from "lucide-react"

export function Booking() {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    alert("Thank you! We'll contact you shortly with your free estimate.")
  }

  return (
    <section id="booking" className="bg-hero-bg py-20 md:py-28">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Form Section */}
          <div className="bg-background rounded-2xl p-8 md:p-10 shadow-xl">
            <h2 className="text-2xl md:text-3xl font-bold text-primary text-center mb-2">
              Get An Estimate
            </h2>
            
            <div className="flex items-center justify-center gap-2 text-muted-foreground mb-8">
              <span>or call now</span>
              <a href="tel:4359015045" className="flex items-center gap-2 text-primary hover:text-accent transition">
                <Phone className="w-4 h-4" />
                <span className="font-semibold">(435) 901-5045</span>
              </a>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                type="text"
                placeholder="First Name*"
                required
                className="h-14 text-base border-2 border-border rounded-lg px-4 focus:border-accent"
              />
              <Input
                type="tel"
                placeholder="Phone*"
                required
                className="h-14 text-base border-2 border-border rounded-lg px-4 focus:border-accent"
              />
              <Input
                type="text"
                placeholder="Zip Code"
                className="h-14 text-base border-2 border-border rounded-lg px-4 focus:border-accent"
              />

              <Button
                type="submit"
                className="w-full h-14 bg-cta hover:bg-cta/90 text-cta-foreground text-lg font-semibold rounded-full mt-6"
              >
                GET AN ESTIMATE
              </Button>
            </form>

            <p className="text-center text-sm text-muted-foreground mt-6">
              <a href="#" className="underline hover:text-primary transition">Privacy Policy</a>
            </p>
          </div>

          {/* Image Section */}
          <div className="relative h-[400px] md:h-[500px] hidden md:block">
            <div className="absolute inset-0 rounded-2xl overflow-hidden">
              <img
                src="/hero-team.jpg"
                alt="Delahunty Water Systems professional team"
                className="w-full h-full object-cover"
              />
            </div>
            {/* Decorative water drop */}
            <div className="absolute -bottom-4 -right-4 w-28 h-28">
              <svg viewBox="0 0 100 100" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M50 10L20 50C20 70 32 90 50 90C68 90 80 70 80 50L50 10Z" className="fill-accent" />
                <path d="M50 30L35 55C35 68 41 80 50 80C59 80 65 68 65 55L50 30Z" className="fill-background" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
