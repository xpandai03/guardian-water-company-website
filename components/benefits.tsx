"use client"

import { Button } from "@/components/ui/button"
import { Droplets, Sparkles, Wrench, Leaf, GlassWater, Settings } from "lucide-react"

export function Benefits() {
  const benefits = [
    {
      icon: GlassWater,
      title: "Healthier Drinking Water",
      description: "Removes harmful contaminants like heavy metals and bacteria, ensuring cleaner and safer water.",
    },
    {
      icon: Sparkles,
      title: "Gentle on Skin & Hair",
      description: "Softened water prevents dryness and irritation, keeping skin and hair healthier and hydrated.",
    },
    {
      icon: Wrench,
      title: "Protects Your Plumbing & Appliances",
      description: "Prevents scale buildup, protecting pipes and fixtures while extending the lifespan of appliances.",
    },
    {
      icon: Leaf,
      title: "Eco-Friendly & Cost-Effective",
      description: "Reduce bottled water waste, save money, and enjoy clean, great-tasting water at home.",
    },
    {
      icon: Droplets,
      title: "Better-Tasting & Odor-Free Water",
      description: "Eliminates chlorine taste and impurities, delivering fresh, crisp, and great-tasting water.",
    },
    {
      icon: Settings,
      title: "Tailored to Your Needs",
      description: "Custom filtration tailored to your needs, improving taste, purity, and overall water quality.",
    },
  ]

  const handleGetEstimate = () => {
    const bookingSection = document.getElementById("booking")
    bookingSection?.scrollIntoView({ behavior: "smooth" })
  }

  return (
    <section id="services" className="bg-secondary py-20 md:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-primary">
            Why Choose Delahunty?
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-x-16 gap-y-12 max-w-5xl mx-auto">
          {benefits.map((benefit, index) => (
            <div key={index} className="flex flex-col border-b border-border pb-8">
              <div className="w-16 h-16 rounded-full bg-hero-bg flex items-center justify-center mb-4">
                <benefit.icon className="w-8 h-8 text-accent" strokeWidth={1.5} />
              </div>
              <h3 className="text-xl font-bold text-primary mb-2">{benefit.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{benefit.description}</p>
            </div>
          ))}
        </div>

        <div className="text-center mt-16">
          <p className="text-muted-foreground mb-6">
            Don&apos;t settle for anything less than clean, safe water. Take control of your home&apos;s water quality today.
          </p>
          <Button
            onClick={handleGetEstimate}
            size="lg"
            className="bg-cta hover:bg-cta/90 text-cta-foreground text-base font-semibold px-10 rounded-full"
          >
            GET AN ESTIMATE
          </Button>
        </div>
      </div>
    </section>
  )
}
