"use client"

import { Button } from "@/components/ui/button"
import { Search, Menu, X } from "lucide-react"
import { useState } from "react"

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const handleGetEstimate = () => {
    const bookingSection = document.getElementById("booking")
    bookingSection?.scrollIntoView({ behavior: "smooth" })
  }

  return (
    <header className="sticky top-0 z-50 bg-background border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <svg viewBox="0 0 40 40" className="w-10 h-10" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M20 4L8 20C8 28 13 36 20 36C27 36 32 28 32 20L20 4Z" className="fill-accent" />
            <path d="M20 12L14 22C14 26 16.5 30 20 30C23.5 30 26 26 26 22L20 12Z" className="fill-hero-bg" />
          </svg>
          <div className="flex flex-col">
            <span className="font-bold text-lg text-primary leading-tight">
              DELAHUNTY<span className="text-accent font-normal">WATER</span>
            </span>
            <span className="text-[10px] tracking-[0.25em] text-muted-foreground">SYSTEMS</span>
          </div>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          <a href="#about" className="text-sm font-medium text-accent hover:text-primary transition">
            About
          </a>
          <a href="#services" className="text-sm font-medium text-muted-foreground hover:text-primary transition">
            Services
          </a>
          <a href="#contact" className="text-sm font-medium text-muted-foreground hover:text-primary transition">
            Contact
          </a>
          <a href="#faq" className="text-sm font-medium text-muted-foreground hover:text-primary transition">
            FAQ
          </a>
          <button className="text-muted-foreground hover:text-primary transition">
            <Search className="w-5 h-5" />
          </button>
        </nav>

        {/* CTA Button */}
        <div className="flex items-center gap-4">
          <Button 
            onClick={handleGetEstimate} 
            className="hidden sm:flex bg-cta hover:bg-cta/90 text-cta-foreground font-semibold px-6 rounded-full"
          >
            GET AN ESTIMATE
          </Button>
          
          {/* Mobile Menu Button */}
          <button 
            className="md:hidden text-foreground"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-background border-t border-border px-4 py-6 space-y-4">
          <a href="#about" className="block text-sm font-medium text-foreground hover:text-accent transition">
            About
          </a>
          <a href="#services" className="block text-sm font-medium text-foreground hover:text-accent transition">
            Services
          </a>
          <a href="#contact" className="block text-sm font-medium text-foreground hover:text-accent transition">
            Contact
          </a>
          <a href="#faq" className="block text-sm font-medium text-foreground hover:text-accent transition">
            FAQ
          </a>
          <Button 
            onClick={handleGetEstimate} 
            className="w-full bg-cta hover:bg-cta/90 text-cta-foreground font-semibold rounded-full"
          >
            GET AN ESTIMATE
          </Button>
        </div>
      )}
    </header>
  )
}
