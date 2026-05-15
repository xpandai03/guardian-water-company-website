"use client"

import { Button } from "@/components/ui/button"

export function AboutTrainer() {
  return (
    <section id="about" className="bg-background py-20 md:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* First Row - Quality Commitment */}
        <div className="grid md:grid-cols-2 gap-12 items-center mb-24">
          {/* Overlapping Images */}
          <div className="relative h-[400px] md:h-[450px]">
            {/* Main image - technician installing */}
            <div className="absolute top-0 right-0 w-[75%] h-[85%] rounded-xl overflow-hidden shadow-lg">
              <img 
                src="/technician-installing.jpg" 
                alt="Guardian Water technician installing water filtration system" 
                className="w-full h-full object-cover"
              />
            </div>
            {/* Overlapping smaller image - child drinking water */}
            <div className="absolute bottom-0 left-0 w-[45%] h-[55%] rounded-xl overflow-hidden shadow-xl border-4 border-background z-10">
              <img 
                src="/child-drinking-water.jpg" 
                alt="Child drinking clean filtered water" 
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Content */}
          <div className="flex flex-col gap-6">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-primary leading-tight">
              Born from a<br />
              <span className="text-accent">Commitment to Quality</span>
            </h2>

            <p className="text-muted-foreground leading-relaxed">
              It all started with a simple idea: that everyone deserves access to clean, worry-free water. 
              Over three decades later, Guardian Water has grown into Utah&apos;s trusted name for residential 
              water purification. We&apos;re family-owned, locally operated, and 100% focused on serving our 
              community with integrity, transparency, and a splash of good humor along the way.
            </p>

            <p className="text-muted-foreground leading-relaxed">
              When you work with us, you&apos;re not just another customer—you become part of the Guardian Water family.
            </p>
          </div>
        </div>

        {/* Second Row - 100% Satisfied */}
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="flex flex-col gap-6 order-2 md:order-1">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-primary leading-tight">
              We&apos;re Only Happy<br />
              When You&apos;re 100%<br />
              <span className="text-accent">Satisfied</span>
            </h2>

            <p className="text-muted-foreground leading-relaxed">
              Your satisfaction isn&apos;t just important—it&apos;s everything. That&apos;s why we back our systems with 
              strong warranties, outstanding support, and a 30-day satisfaction guarantee. If you&apos;re not 
              thrilled with your water system, we&apos;ll make it right. No fuss, no drama, no kidding.
            </p>
          </div>

          {/* Image with logo overlay */}
          <div className="relative h-[400px] md:h-[450px] order-1 md:order-2">
            <div className="absolute inset-0 rounded-xl overflow-hidden shadow-lg">
              <img 
                src="/family-water.jpg" 
                alt="Happy family enjoying clean water from Guardian Water" 
                className="w-full h-full object-cover"
              />
            </div>
            {/* Decorative water drop logo */}
            <div className="absolute -bottom-6 -right-6 w-32 h-32">
              <svg viewBox="0 0 100 100" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M50 10L20 50C20 70 32 90 50 90C68 90 80 70 80 50L50 10Z" className="fill-accent" />
                <path d="M50 30L35 55C35 68 41 80 50 80C59 80 65 68 65 55L50 30Z" className="fill-hero-bg" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
