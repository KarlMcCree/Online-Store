import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AnnouncementBar from "@/components/AnnouncementBar";
import SEO from "@/components/SEO";
import { Star, ShoppingCart, Heart, Eye, Filter, ChevronDown } from "lucide-react";
import { useState } from "react";
import { useMedusaProducts, getProductPrice, getProductRating, getProductBadge } from "@/hooks/use-medusa-products";
import QuickViewModal from "@/components/QuickViewModal";

const categories = [
  "All",
  "Study Abroad",
  "Migration",
  "Digital Guides",
  "Consultation",
  "Travel Packages",
  "Second Passport",
];

const allProducts = [
  {
    id: 1,
    title: "Complete Visa Application Guide",
    price: "$9.99",
    originalPrice: "$19.99",
    badge: "BESTSELLER",
    badgeColor: "bg-secondary text-secondary-foreground",
    rating: 4.8,
    type: "digital" as const,
    category: "Digital Guides",
    description: "A comprehensive step-by-step guide covering visa applications for over 20 countries.",
  },
  {
    id: 2,
    title: "SOP Writing Masterclass",
    price: "$14.99",
    originalPrice: "$29.99",
    badge: "-50%",
    badgeColor: "bg-destructive text-destructive-foreground",
    rating: 4.9,
    type: "digital" as const,
    category: "Digital Guides",
    description: "Master the art of writing compelling Statements of Purpose with 15+ templates.",
  },
  {
    id: 3,
    title: "Country-Specific Checklist Bundle",
    price: "$4.99",
    badge: "NEW",
    badgeColor: "bg-primary text-primary-foreground",
    rating: 4.7,
    type: "digital" as const,
    category: "Digital Guides",
    description: "Detailed country-specific checklists for UK, Canada, USA, and Australia.",
  },
  {
    id: 4,
    title: "Travel Insurance Comparison Guide",
    price: "$7.99",
    originalPrice: "$12.99",
    rating: 4.6,
    type: "digital" as const,
    category: "Travel Packages",
    description: "Compare travel insurance plans across 10+ providers.",
  },
  {
    id: 5,
    title: "1-on-1 Study Abroad Consultation",
    price: "$149",
    badge: "POPULAR",
    badgeColor: "bg-secondary text-secondary-foreground",
    rating: 5.0,
    type: "service" as const,
    category: "Consultation",
    description: "Personalized guidance for your study abroad application with an expert advisor.",
  },
  {
    id: 6,
    title: "Complete Visa Processing Package",
    price: "$499",
    badge: "PREMIUM",
    badgeColor: "bg-primary text-primary-foreground",
    rating: 4.9,
    type: "service" as const,
    category: "Migration",
    description: "End-to-end visa application support and processing for your chosen country.",
  },
  {
    id: 7,
    title: "Second Passport Program",
    price: "From $2,999",
    rating: 4.8,
    type: "service" as const,
    category: "Second Passport",
    description: "Citizenship by investment programs in select countries worldwide.",
  },
  {
    id: 8,
    title: "BSB Travel Package — Dubai",
    price: "$1,299",
    badge: "HOT",
    badgeColor: "bg-destructive text-destructive-foreground",
    rating: 4.9,
    type: "service" as const,
    category: "Travel Packages",
    description: "All-inclusive travel package with accommodation, tours, and visa support.",
  },
  {
    id: 9,
    title: "UK Study Abroad Full Processing",
    price: "$799",
    rating: 4.7,
    type: "service" as const,
    category: "Study Abroad",
    description: "Complete application processing for UK universities including UCAS submission.",
  },
  {
    id: 10,
    title: "Canada PR Application Guide",
    price: "$12.99",
    badge: "NEW",
    badgeColor: "bg-primary text-primary-foreground",
    rating: 4.5,
    type: "digital" as const,
    category: "Migration",
    description: "Step-by-step guide to applying for Canadian Permanent Residency via Express Entry.",
  },
  {
    id: 11,
    title: "Australia Migration Toolkit",
    price: "$19.99",
    originalPrice: "$39.99",
    badge: "-50%",
    badgeColor: "bg-destructive text-destructive-foreground",
    rating: 4.6,
    type: "digital" as const,
    category: "Migration",
    description: "Everything you need to plan your migration to Australia – visas, jobs, and settlement.",
  },
  {
    id: 12,
    title: "BSB Travel Package — London",
    price: "$1,599",
    rating: 4.8,
    type: "service" as const,
    category: "Travel Packages",
    description: "Premium London travel package with guided tours, hotel, and cultural experiences.",
  },
];

const sortOptions = ["Newest", "Price: Low to High", "Price: High to Low", "Top Rated"];

const Services = () => {
  const [activeCategory, setActiveCategory] = useState("All");
  const [sortBy, setSortBy] = useState("Newest");
  const [showSort, setShowSort] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState<typeof allProducts[0] | null>(null);
  const [wishlist, setWishlist] = useState<number[]>([]);

  const filtered = activeCategory === "All"
    ? allProducts
    : allProducts.filter((p) => p.category === activeCategory);

  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === "Top Rated") return b.rating - a.rating;
    if (sortBy === "Price: Low to High") return parseFloat(a.price.replace(/[^0-9.]/g, "")) - parseFloat(b.price.replace(/[^0-9.]/g, ""));
    if (sortBy === "Price: High to Low") return parseFloat(b.price.replace(/[^0-9.]/g, "")) - parseFloat(a.price.replace(/[^0-9.]/g, ""));
    return b.id - a.id;
  });

  const toggleWishlist = (id: number) => {
    setWishlist((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]);
  };

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="Products & Services – The Digital Desk"
        description="Browse digital guides, consultations, and migration services to power your study-abroad journey."
        url="/services"
      />
      <AnnouncementBar />
      <Header />


      {/* Hero Banner */}
      <section className="bg-primary py-16 md:py-24">
        <div className="container text-center">
          <h1 className="font-display text-4xl md:text-5xl font-bold text-primary-foreground mb-4">
            Services & Products
          </h1>
          <p className="text-primary-foreground/70 font-body text-lg max-w-2xl mx-auto">
            Explore our full range of digital guides, expert consultations, and premium services to power your global journey.
          </p>
        </div>
      </section>

      {/* Filters & Products */}
      <section className="py-12 md:py-16">
        <div className="container">
          {/* Category Filter */}
          <div className="flex flex-wrap gap-3 mb-8">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-full text-sm font-medium font-body transition-all ${
                  activeCategory === cat
                    ? "bg-secondary text-secondary-foreground"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Sort & Count */}
          <div className="flex items-center justify-between mb-8">
            <p className="text-sm text-muted-foreground font-body">
              Showing <span className="font-semibold text-foreground">{sorted.length}</span> results
            </p>
            <div className="relative">
              <button
                onClick={() => setShowSort(!showSort)}
                className="flex items-center gap-2 text-sm font-body text-foreground border border-border rounded-lg px-4 py-2 hover:border-secondary transition-colors"
              >
                <Filter className="h-4 w-4" />
                {sortBy}
                <ChevronDown className="h-3.5 w-3.5" />
              </button>
              {showSort && (
                <div className="absolute right-0 top-full mt-1 bg-card border border-border rounded-lg shadow-lg z-10 min-w-[180px]">
                  {sortOptions.map((opt) => (
                    <button
                      key={opt}
                      onClick={() => { setSortBy(opt); setShowSort(false); }}
                      className={`block w-full text-left px-4 py-2.5 text-sm font-body hover:bg-muted transition-colors ${
                        sortBy === opt ? "text-secondary font-semibold" : "text-foreground"
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Product Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
            {sorted.map((product) => (
              <div key={product.id} className="group cursor-pointer">
                <div className="relative bg-muted rounded-lg overflow-hidden aspect-[3/4] mb-4">
                  <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-primary/5 to-secondary/10">
                    <div className="text-center p-6">
                      <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-secondary/20 flex items-center justify-center">
                        <span className="text-2xl">{product.type === "digital" ? "📄" : "🎯"}</span>
                      </div>
                      <p className="text-xs text-muted-foreground font-body uppercase tracking-wider">
                        {product.type === "digital" ? "Digital Product" : "Service"}
                      </p>
                    </div>
                  </div>

                  {product.badge && (
                    <span className={`absolute top-3 left-3 text-[10px] font-bold px-2.5 py-1 rounded-sm ${product.badgeColor}`}>
                      {product.badge}
                    </span>
                  )}

                  <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0 transition-all duration-300">
                    <button
                      onClick={(e) => { e.stopPropagation(); toggleWishlist(product.id); }}
                      className={`w-9 h-9 rounded-full border border-border bg-background flex items-center justify-center hover:bg-secondary hover:text-secondary-foreground hover:border-secondary transition-all ${wishlist.includes(product.id) ? "bg-destructive/10 text-destructive border-destructive/30" : "text-foreground"}`}
                      aria-label="Add to wishlist"
                    >
                      <Heart className={`h-4 w-4 ${wishlist.includes(product.id) ? "fill-current" : ""}`} />
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); setQuickViewProduct(product); }}
                      className="w-9 h-9 rounded-full border border-border bg-background text-foreground flex items-center justify-center hover:bg-secondary hover:text-secondary-foreground hover:border-secondary transition-all"
                      aria-label="Quick view"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="absolute bottom-0 left-0 right-0 opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-300 p-3">
                    <button className="w-full bg-background text-foreground text-xs font-semibold py-2.5 rounded-full shadow-lg hover:bg-secondary hover:text-secondary-foreground transition-all flex items-center justify-center gap-2 font-body">
                      <ShoppingCart className="h-3.5 w-3.5" />
                      Quick Add
                    </button>
                  </div>
                </div>

                <h3 className="font-body text-sm font-medium text-foreground group-hover:text-secondary transition-colors mb-1.5 line-clamp-2">
                  {product.title}
                </h3>

                <div className="flex items-center gap-1 mb-1.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`h-3 w-3 ${i < Math.floor(product.rating) ? "fill-secondary text-secondary" : "text-border"}`}
                    />
                  ))}
                  <span className="text-xs text-muted-foreground ml-1">{product.rating}</span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="font-body font-semibold text-foreground">{product.price}</span>
                  {product.originalPrice && (
                    <span className="text-sm text-muted-foreground line-through">{product.originalPrice}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />

      <QuickViewModal
        open={!!quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
        product={quickViewProduct ? {
          title: quickViewProduct.title,
          price: quickViewProduct.price,
          originalPrice: quickViewProduct.originalPrice,
          rating: quickViewProduct.rating,
          description: quickViewProduct.description,
          badge: quickViewProduct.badge,
        } : undefined}
      />
    </div>
  );
};

export default Services;
