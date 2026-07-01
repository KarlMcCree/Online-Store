import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import hero1 from "@/assets/hero-1.jpg";
import hero2 from "@/assets/hero-2.jpg";
import hero3 from "@/assets/hero-3.jpg";

const slides = [
  {
    image: hero1,
    subtitle: "YOUR GATEWAY TO THE WORLD",
    title: ["Elevate Your Future with", "Global Opportunities"],
    cta: "Explore Services",
  },
  {
    image: hero2,
    subtitle: "STUDY ABROAD PROGRAMS",
    title: ["Achieve Your Dreams", "Study Anywhere"],
    cta: "Start Your Journey",
  },
  {
    image: hero3,
    subtitle: "MIGRATION & TRAVEL SERVICES",
    title: ["Seamless Migration", "Made Simple"],
    cta: "Learn More",
  },
];

const HeroSlider = () => {
  const [current, setCurrent] = useState(0);
  const { isAuthenticated, openAuthModal } = useAuth();
  const navigate = useNavigate();

  const handleCta = () => {
    if (isAuthenticated) {
      navigate("/services");
    } else {
      openAuthModal("signup", "Create your free account to unlock services, save favourites, and track your journey.");
    }
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const slide = slides[current];

  return (
    <section className="relative w-full h-[75vh] min-h-[500px] overflow-hidden">
      {slides.map((s, i) => (
        <img
          key={i}
          src={s.image}
          alt={s.subtitle}
          width={1920}
          height={1080}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${
            i === current ? "opacity-100" : "opacity-0"
          }`}
          {...(i === 0 ? {} : { loading: "lazy" as const })}
        />
      ))}
      {/* Overlay */}
      <div className="absolute inset-0 bg-foreground/40" />

      {/* Content */}
      <div className="absolute inset-0 flex items-center justify-center text-center">
        <div className="animate-fade-in-up" key={current}>
          <p className="text-primary-foreground/80 text-xs sm:text-sm tracking-[0.3em] uppercase mb-4 font-body">
            {slide.subtitle}
          </p>
          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-primary-foreground leading-tight mb-8">
            {slide.title[0]}
            <br />
            {slide.title[1]}
          </h1>
          <button
            onClick={handleCta}
            className="inline-block bg-background text-foreground font-medium text-sm px-8 py-3.5 rounded-full hover:bg-secondary hover:text-secondary-foreground transition-all duration-300 tracking-wide"
          >
            {isAuthenticated ? slide.cta : "Create Free Account"}
          </button>
        </div>
      </div>

      {/* Arrows */}
      <button
        onClick={() => setCurrent((prev) => (prev - 1 + slides.length) % slides.length)}
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-background/20 backdrop-blur-sm text-primary-foreground p-2 rounded-full hover:bg-background/40 transition-colors"
        aria-label="Previous slide"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>
      <button
        onClick={() => setCurrent((prev) => (prev + 1) % slides.length)}
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-background/20 backdrop-blur-sm text-primary-foreground p-2 rounded-full hover:bg-background/40 transition-colors"
        aria-label="Next slide"
      >
        <ChevronRight className="h-5 w-5" />
      </button>

      {/* Dots */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`h-1 rounded-full transition-all duration-300 ${
              i === current ? "w-8 bg-background" : "w-4 bg-background/50"
            }`}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </section>
  );
};

export default HeroSlider;
