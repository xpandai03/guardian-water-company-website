"use client"

import { Phone, Mail, MapPin } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground py-12 md:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          {/* Logo & Description */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <svg viewBox="0 0 40 40" className="w-10 h-10" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M20 4L8 20C8 28 13 36 20 36C27 36 32 28 32 20L20 4Z" className="fill-accent" />
                <path d="M20 12L14 22C14 26 16.5 30 20 30C23.5 30 26 26 26 22L20 12Z" className="fill-primary" />
              </svg>
              <div className="flex flex-col">
                <span className="font-bold text-lg leading-tight">
                  DELAHUNTY<span className="text-accent font-normal">WATER</span>
                </span>
                <span className="text-[10px] tracking-[0.25em] text-primary-foreground/70">SYSTEMS</span>
              </div>
            </div>
            <p className="text-sm text-primary-foreground/70 leading-relaxed">
              Premium water filtration solutions for Utah homes. Family-owned, locally operated since 1994.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm text-primary-foreground/70">
              <li>
                <a href="#about" className="hover:text-accent transition">
                  About Us
                </a>
              </li>
              <li>
                <a href="#services" className="hover:text-accent transition">
                  Services
                </a>
              </li>
              <li>
                <a href="#testimonials" className="hover:text-accent transition">
                  Reviews
                </a>
              </li>
              <li>
                <a href="#faq" className="hover:text-accent transition">
                  FAQ
                </a>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-semibold mb-4">Our Services</h4>
            <ul className="space-y-2 text-sm text-primary-foreground/70">
              <li>
                <a href="#" className="hover:text-accent transition">
                  Whole House Filtration
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-accent transition">
                  Reverse Osmosis
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-accent transition">
                  Water Softeners
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-accent transition">
                  Water Testing
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold mb-4">Contact Us</h4>
            <ul className="space-y-3 text-sm text-primary-foreground/70">
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-accent" />
                <a href="tel:4359015045" className="hover:text-accent transition">
                  (435) 901-5045
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-accent" />
                <a href="mailto:info@delahuntywater.com" className="hover:text-accent transition">
                  info@delahuntywater.com
                </a>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-accent mt-0.5" />
                <span>Serving Salt Lake, Park City,<br />Logan & surrounding areas</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-primary-foreground/20 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-primary-foreground/70">
          <p>&copy; {new Date().getFullYear()} Delahunty Water Systems. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-accent transition">Privacy Policy</a>
            <a href="#" className="hover:text-accent transition">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
