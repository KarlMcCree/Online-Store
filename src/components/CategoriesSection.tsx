import catStudy from "@/assets/cat-study-abroad.jpg";
import catMigration from "@/assets/cat-migration.jpg";
import catDigital from "@/assets/cat-digital.jpg";
import catConsultation from "@/assets/cat-consultation.jpg";
import catTravel from "@/assets/cat-travel.jpg";
import catPassport from "@/assets/cat-passport.jpg";

const categories = [
  { name: "Study Abroad", image: catStudy },
  { name: "Migration", image: catMigration },
  { name: "Digital Guides", image: catDigital },
  { name: "Consultation", image: catConsultation },
  { name: "Travel Packages", image: catTravel },
  { name: "Second Passport", image: catPassport },
];

const CategoriesSection = () => {
  return (
    <section id="services" className="py-16 md:py-24">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-3">
            Browse Our Services
          </h2>
          <p className="text-muted-foreground font-body">
            Everything you need to start your global journey.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6">
          {categories.map((cat) => (
            <a
              key={cat.name}
              href="#"
              className="group flex flex-col items-center text-center"
            >
              <div className="w-28 h-28 md:w-32 md:h-32 rounded-full overflow-hidden bg-muted mb-4 group-hover:shadow-lg transition-shadow duration-300 border-2 border-transparent group-hover:border-secondary">
                <img
                  src={cat.image}
                  alt={cat.name}
                  loading="lazy"
                  width={512}
                  height={512}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
              </div>
              <span className="text-sm font-medium text-foreground group-hover:text-secondary transition-colors font-body">
                {cat.name}
              </span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoriesSection;
