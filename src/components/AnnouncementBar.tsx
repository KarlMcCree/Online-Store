import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useEffect } from "react";

const announcements = [
  "🎓 Study Abroad Spring Intake: 20% Off Processing Fees — Limited Time Only",
  "✈️ Free Consultation on Migration Programs — Book Now",
  "📘 New: Complete Visa Checklist Guide — Download Free",
];

const AnnouncementBar = () => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % announcements.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="bg-primary text-primary-foreground py-2.5 text-sm relative">
      <div className="container flex items-center justify-center gap-4">
        <button
          onClick={() => setCurrent((prev) => (prev - 1 + announcements.length) % announcements.length)}
          className="absolute left-4 md:left-8 opacity-70 hover:opacity-100 transition-opacity"
          aria-label="Previous announcement"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <p className="text-center font-medium px-8 transition-all duration-300">
          {announcements[current]}
        </p>
        <button
          onClick={() => setCurrent((prev) => (prev + 1) % announcements.length)}
          className="absolute right-4 md:right-8 opacity-70 hover:opacity-100 transition-opacity"
          aria-label="Next announcement"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

export default AnnouncementBar;
