import catStudy from "@/assets/cat-study-abroad.jpg";
import catMigration from "@/assets/cat-migration.jpg";
import catDigital from "@/assets/cat-digital.jpg";
import catConsultation from "@/assets/cat-consultation.jpg";
import catTravel from "@/assets/cat-travel.jpg";
import catPassport from "@/assets/cat-passport.jpg";

const collections = [
  { title: "Study Abroad", image: catStudy },
  { title: "Migration Services", image: catMigration },
  { title: "Digital Guides", image: catDigital },
  { title: "Expert Consultation", image: catConsultation },
  { title: "Travel Packages", image: catTravel },
  { title: "Second Passport", image: catPassport },
];

const CollectionSlider = () => {
  const items = [...collections, ...collections, ...collections];

  return (
    <section className="py-12 overflow-hidden">
      <div className="animate-collection-marquee flex gap-6">
        {items.map((col, i) => (
          <a
            key={i}
            href="#"
            className="group relative flex-shrink-0 w-56 h-72 rounded-lg overflow-hidden"
          >
            <img
              src={col.image}
              alt={col.title}
              loading="lazy"
              width={512}
              height={512}
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-foreground/70 via-transparent to-transparent" />
            <div className="absolute bottom-4 left-4 right-4">
              <p className="font-display font-bold text-primary-foreground text-lg">
                {col.title}
              </p>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
};

export default CollectionSlider;
