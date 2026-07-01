import { Star, ArrowRight } from "lucide-react";
import { useMedusaProducts, getProductPrice, getProductRating, getProductBadge } from "@/hooks/use-medusa-products";

type Service = {
  id: number;
  title: string;
  price: string;
  description: string;
  rating: number;
  badge?: string;
};

const services: Service[] = [
  {
    id: 1,
    title: "1-on-1 Study Abroad Consultation",
    price: "$149",
    description: "Personalized guidance for your study abroad application",
    rating: 5.0,
    badge: "POPULAR",
  },
  {
    id: 2,
    title: "Complete Visa Processing Package",
    price: "$499",
    description: "End-to-end visa application support and processing",
    rating: 4.9,
    badge: "PREMIUM",
  },
  {
    id: 3,
    title: "Second Passport Program",
    price: "From $2,999",
    description: "Citizenship by investment programs in select countries",
    rating: 4.8,
  },
  {
    id: 4,
    title: "BSB Travel Package — Dubai",
    price: "$1,299",
    description: "All-inclusive travel package with accommodation & tours",
    rating: 4.9,
    badge: "HOT",
  },
];

const HighTicketServices = () => {
  // Try fetching from Medusa collection tagged "services" via metadata
  const { data, isLoading } = useMedusaProducts({ limit: 4, tags: ["service"] });

  const displayServices: Service[] = data?.products?.length
    ? data.products.map((mp) => {
        const { price } = getProductPrice(mp);
        const badge = getProductBadge(mp);
        return {
          id: mp.id as unknown as number,
          title: mp.title,
          price: price || "$0.00",
          description: mp.description || "",
          rating: getProductRating(mp),
          badge: badge?.text,
        };
      })
    : services;

  return (
    <section className="py-16 md:py-24 bg-surface-warm">
      <div className="container">
        <div className="flex items-end justify-between mb-12">
          <div>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-3">
              Premium Services
            </h2>
            <p className="text-muted-foreground font-body">
              Expert-led services to fast-track your global ambitions.
            </p>
          </div>
          <a
            href="#"
            className="hidden md:flex items-center gap-2 text-sm font-medium text-foreground hover:text-secondary transition-colors font-body"
          >
            View All <ArrowRight className="h-4 w-4" />
          </a>
        </div>

        {isLoading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="animate-pulse bg-card rounded-lg border border-border p-6">
                <div className="h-4 bg-muted rounded w-1/3 mb-4" />
                <div className="h-5 bg-muted rounded w-3/4 mb-2" />
                <div className="h-3 bg-muted rounded w-full mb-4" />
                <div className="h-6 bg-muted rounded w-1/4" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {displayServices.map((service) => (
            <div
              key={service.id}
              className="bg-card rounded-lg border border-border p-6 hover:shadow-lg hover:border-secondary/30 transition-all duration-300 group cursor-pointer"
            >
              {service.badge && (
                <span className="inline-block text-[10px] font-bold bg-secondary text-secondary-foreground px-2.5 py-1 rounded-sm mb-4">
                  {service.badge}
                </span>
              )}
              <h3 className="font-display text-lg font-semibold text-foreground mb-2 group-hover:text-secondary transition-colors">
                {service.title}
              </h3>
              <p className="text-sm text-muted-foreground mb-4 font-body line-clamp-2">
                {service.description}
              </p>
              <div className="flex items-center gap-1 mb-3">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`h-3 w-3 ${
                      i < Math.floor(service.rating) ? "fill-secondary text-secondary" : "text-border"
                    }`}
                  />
                ))}
                <span className="text-xs text-muted-foreground ml-1">{service.rating}</span>
              </div>
              <p className="font-body text-xl font-bold text-foreground">{service.price}</p>
            </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default HighTicketServices;
