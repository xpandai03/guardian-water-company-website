"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Phone } from "lucide-react"

export function Hero() {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    alert("Thank you! We'll contact you shortly with your free estimate.")
  }

  return (
    <section className="relative bg-hero-bg overflow-hidden">
      {/* Background decorative element */}
      <div className="absolute right-0 top-0 bottom-0 w-1/2 overflow-hidden">
        <svg viewBox="0 0 400 600" className="absolute right-0 top-1/2 -translate-y-1/2 w-[500px] h-[750px] opacity-20" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M200 50L50 300C50 450 100 550 200 550C300 550 350 450 350 300L200 50Z" className="fill-accent" />
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="flex flex-col gap-6 relative z-10">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-hero-foreground leading-tight">
              About Delahunty<br />Water Systems
            </h1>
            
            <p className="text-lg md:text-xl font-semibold text-accent">
              Premium Water Filtration for a Safer Home
            </p>
            
            <p className="text-hero-foreground/90 leading-relaxed">
              Born in Salt Lake, Park City, and Logan, Delahunty Water Systems is rooted in the heart of Utah. 
              Inspired by our state&apos;s natural purity, we&apos;re on a mission to bring clean, safe, great-tasting 
              water to every home—from mountain towns to valley neighborhoods.
            </p>
            
            <p className="text-hero-foreground/90 leading-relaxed">
              Water isn&apos;t just what we do—it&apos;s what we love. Our goal? To protect your home, your health, 
              and your happiness with reliable, no-hassle water filtration solutions you can trust.
            </p>

            <div className="flex flex-col gap-4 pt-4">
              <Button
                onClick={() => document.getElementById("booking")?.scrollIntoView({ behavior: "smooth" })}
                size="lg"
                className="bg-cta hover:bg-cta/90 text-cta-foreground text-base font-semibold w-fit px-8 rounded-full"
              >
                GET AN ESTIMATE
              </Button>
              
              <div className="flex items-center gap-2 text-hero-foreground/80">
                <span>or call</span>
                <a href="tel:4359015045" className="flex items-center gap-2 text-hero-foreground hover:text-accent transition">
                  <Phone className="w-4 h-4" />
                  <span className="font-semibold">(435) 901-5045</span>
                </a>
              </div>
            </div>
          </div>

          {/* Right Image */}
          <div className="relative h-[400px] md:h-[500px]">
            <img
              src="/hero-team.jpg"
              alt="Delahunty Water Systems team - professional water filtration technicians"
              className="w-full h-full object-cover rounded-2xl"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
