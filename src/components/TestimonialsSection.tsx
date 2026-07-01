import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    name: "Adaeze Okonkwo",
    role: "Studied in Canada",
    rating: 5,
    text: "Online Dynamics & BSB made my dream of studying abroad a reality! The visa processing was seamless, and the consultation gave me clarity on every step. Highly recommended!",
  },
  {
    name: "Emeka Nwosu",
    role: "Migrated to the UK",
    rating: 5,
    text: "The migration support I received was top-notch. From document preparation to interview coaching, they guided me through everything. I'm now settled in London!",
  },
];

const TestimonialsSection = () => {
  return (
    <section className="py-16 md:py-24">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-3">
            What Our Clients Say
          </h2>
          <p className="text-muted-foreground font-body">
            Real stories from people who achieved their global dreams.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {testimonials.map((t) => (
            <div
              key={t.name}
              className="bg-card border border-border rounded-lg p-8 relative"
            >
              <Quote className="h-8 w-8 text-secondary/30 mb-4" />
              <div className="flex items-center gap-1 mb-4">
                {Array.from({ length: t.rating }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-secondary text-secondary" />
                ))}
              </div>
              <p className="text-foreground font-body leading-relaxed mb-6 italic">
                "{t.text}"
              </p>
              <div>
                <p className="font-display font-semibold text-foreground">{t.name}</p>
                <p className="text-sm text-muted-foreground font-body">{t.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
