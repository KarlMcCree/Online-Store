const scrollItems = [
  "Study in UK",
  "Study in Canada",
  "Study in USA",
  "Study in Australia",
  "Migration Services",
  "Second Passport",
  "Online Dynamics Travel",
  "Visa Processing",
  "SOP Writing",
  "Free Consultation",
];

const MarqueeSection = () => {
  const items = [...scrollItems, ...scrollItems, ...scrollItems];

  return (
    <section className="py-6 bg-primary overflow-hidden">
      <div className="animate-marquee flex whitespace-nowrap">
        {items.map((item, i) => (
          <a
            key={i}
            href="#"
            className="inline-flex items-center gap-4 mx-4 text-primary-foreground hover:text-secondary transition-colors"
          >
            <span className="font-display text-lg font-bold">{item}</span>
            <span className="text-secondary">✦</span>
          </a>
        ))}
      </div>
    </section>
  );
};

export default MarqueeSection;
