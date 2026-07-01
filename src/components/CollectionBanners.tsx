const collections = [
  {
    title: "Study Abroad Programs",
    description: "UK, USA, Canada, Australia & more",
    gradient: "from-primary/80 to-primary/40",
  },
  {
    title: "Migration Services",
    description: "Expert guidance for your journey",
    gradient: "from-secondary/80 to-secondary/40",
  },
  {
    title: "BSB Travel Packages",
    description: "Curated travel experiences worldwide",
    gradient: "from-navy-light/80 to-navy-light/40",
  },
];

const CollectionBanners = () => {
  return (
    <section className="py-16 md:py-24">
      <div className="container">
        <div className="grid md:grid-cols-3 gap-6">
          {collections.map((col) => (
            <a
              key={col.title}
              href="#"
              className="group relative overflow-hidden rounded-lg h-64 md:h-80 flex items-end p-6"
            >
              <div className={`absolute inset-0 bg-gradient-to-t ${col.gradient}`} />
              <div className="relative z-10">
                <h3 className="font-display text-xl md:text-2xl font-bold text-primary-foreground mb-1">
                  {col.title}
                </h3>
                <p className="text-primary-foreground/80 text-sm font-body">
                  {col.description}
                </p>
                <span className="inline-block mt-3 text-xs font-semibold text-primary-foreground border-b border-primary-foreground/50 pb-0.5 group-hover:border-primary-foreground transition-colors font-body uppercase tracking-wider">
                  Explore Now
                </span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CollectionBanners;
