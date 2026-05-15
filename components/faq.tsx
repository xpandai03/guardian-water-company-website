"use client"

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export function FAQ() {
  const faqs = [
    {
      question: "How do I know if I need a water filtration system?",
      answer:
        "Signs you may need water filtration include: hard water stains on fixtures, dry skin and hair after showering, an unpleasant taste or odor in your tap water, or concerns about contaminants. We offer free water testing to assess your home's specific needs.",
    },
    {
      question: "What's the difference between a water softener and a filtration system?",
      answer:
        "A water softener removes minerals like calcium and magnesium that cause hard water, while a filtration system removes contaminants, chlorine, and impurities that affect taste and safety. Many homes benefit from both systems working together.",
    },
    {
      question: "How long does installation typically take?",
      answer:
        "Most residential installations are completed in 2-4 hours. Our professional technicians handle everything from start to finish, and we always clean up after ourselves. We'll walk you through how to use and maintain your new system before we leave.",
    },
    {
      question: "Do you offer financing options?",
      answer:
        "Yes! We understand that water quality is essential, not optional. We offer flexible financing plans with competitive rates to make clean water accessible for every Utah family. Ask about our current promotions during your free estimate.",
    },
    {
      question: "What areas do you serve?",
      answer:
        "We proudly serve the greater Salt Lake City area, Park City, Logan, and surrounding Utah communities. Not sure if we service your area? Give us a call at (435) 901-5045 and we'll let you know!",
    },
    {
      question: "What's included in the 30-day satisfaction guarantee?",
      answer:
        "If you're not completely satisfied with your water system within 30 days of installation, we'll make it right. Whether that means adjustments, additional support, or a full refund—your happiness is our priority. No questions asked.",
    },
  ]

  return (
    <section id="faq" className="bg-secondary py-20 md:py-28">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-primary">
            Frequently Asked Questions
          </h2>
        </div>

        <Accordion type="single" collapsible className="space-y-4">
          {faqs.map((faq, index) => (
            <AccordionItem key={index} value={`item-${index}`} className="bg-card border border-border rounded-lg px-6 shadow-sm">
              <AccordionTrigger className="text-foreground font-semibold hover:text-accent text-left">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground leading-relaxed">{faq.answer}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  )
}
