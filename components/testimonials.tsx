"use client"

export function Testimonials() {
  const testimonials = [
    {
      name: "Jennifer Martinez",
      location: "Salt Lake City, UT",
      image: "/professional-woman-headshot.png",
      quote:
        "The difference in our water quality is incredible. My kids actually drink more water now because it tastes so much better. The Delahunty team was professional and had everything installed in just a few hours.",
    },
    {
      name: "Robert Thompson",
      location: "Park City, UT",
      image: "/professional-man-headshot.png",
      quote:
        "After dealing with hard water for years, we finally made the switch. Our appliances are running better, and there's no more mineral buildup on our fixtures. Best home investment we've made.",
    },
    {
      name: "Amanda Chen",
      location: "Logan, UT",
      image: "/professional-woman-smiling.png",
      quote:
        "From the free estimate to the final installation, Delahunty made everything simple. The team explained every option and helped us choose the perfect system for our family's needs.",
    },
  ]

  return (
    <section id="testimonials" className="bg-background py-20 md:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-primary">
            What Our Customers Say
          </h2>
          <p className="text-muted-foreground mt-4 max-w-2xl mx-auto">
            Join thousands of Utah families enjoying cleaner, safer water
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-card border border-border rounded-xl p-8 shadow-sm hover:shadow-md transition">
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="text-cta text-lg">
                    ★
                  </span>
                ))}
              </div>
              <p className="text-muted-foreground mb-6 leading-relaxed">&quot;{testimonial.quote}&quot;</p>
              <div className="flex items-center gap-4">
                <img
                  src={testimonial.image || "/placeholder.svg"}
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <p className="font-semibold text-foreground">{testimonial.name}</p>
                  <p className="text-sm text-muted-foreground">{testimonial.location}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
