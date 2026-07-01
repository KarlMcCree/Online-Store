import { Star, ArrowRight, Heart, Eye, ShoppingCart } from "lucide-react";
import { useState } from "react";
import QuickViewModal from "./QuickViewModal";
import { useMedusaProducts, getProductPrice, getProductRating, getProductBadge } from "@/hooks/use-medusa-products";
import { useShop } from "@/contexts/ShopContext";

type Product = {
  id: number | string;
  title: string;
  price: string;
  originalPrice?: string;
  badge?: string;
  badgeColor?: string;
  rating: number;
  type: "digital" | "service";
  description: string;
  saleRibbon?: string;
};

const products: Product[] = [
  {
    id: 1,
    title: "Complete Visa Application Guide",
    price: "$9.99",
    originalPrice: "$19.99",
    badge: "BESTSELLER",
    badgeColor: "bg-secondary text-secondary-foreground",
    rating: 4.8,
    type: "digital",
    description: "A comprehensive step-by-step guide covering visa applications for over 20 countries. Includes document checklists, interview tips, and common mistakes to avoid.",
    saleRibbon: "HOT SALE 50% OFF",
  },
  {
    id: 2,
    title: "SOP Writing Masterclass",
    price: "$14.99",
    originalPrice: "$29.99",
    badge: "-50%",
    badgeColor: "bg-destructive text-destructive-foreground",
    rating: 4.9,
    type: "digital",
    description: "Master the art of writing compelling Statements of Purpose. Includes 15+ templates, university-specific tips, and expert review guidelines.",
  },
  {
    id: 3,
    title: "Country-Specific Checklist Bundle",
    price: "$4.99",
    badge: "NEW",
    badgeColor: "bg-primary text-primary-foreground",
    rating: 4.7,
    type: "digital",
    description: "Detailed country-specific checklists for UK, Canada, USA, and Australia. Know exactly what documents you need before you start.",
  },
  {
    id: 4,
    title: "Travel Insurance Comparison Guide",
    price: "$7.99",
    originalPrice: "$12.99",
    rating: 4.6,
    type: "digital",
    description: "Compare travel insurance plans across 10+ providers. Understand coverage types, exclusions, and find the best value for your journey.",
    saleRibbon: "SAVE 40% TODAY",
  },
];

const ProductCard = ({ product, onQuickView }: { product: Product; onQuickView: (p: Product) => void }) => {
  const { toggleFavourite, isFavourite, addToCart } = useShop();
  const wishlisted = isFavourite(product.id);

  const shopItem = {
    id: product.id,
    title: product.title,
    price: product.price,
    type: product.type,
  };

  return (
    <div className="group cursor-pointer">
      <div className="relative bg-muted rounded-lg overflow-hidden aspect-[3/4] mb-4">
        {/* Product visual */}
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-primary/5 to-secondary/10">
          <div className="text-center p-6">
            <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-secondary/20 flex items-center justify-center">
              <span className="text-2xl">📄</span>
            </div>
            <p className="text-xs text-muted-foreground font-body uppercase tracking-wider">
              {product.type === "digital" ? "Digital Product" : "Service"}
            </p>
          </div>
        </div>

        {/* Badge */}
        {product.badge && (
          <span className={`absolute top-3 left-3 text-[10px] font-bold px-2.5 py-1 rounded-sm ${product.badgeColor}`}>
            {product.badge}
          </span>
        )}

        {/* Side action icons */}
        <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0 transition-all duration-300">
          <button
            onClick={(e) => { e.stopPropagation(); toggleFavourite(shopItem); }}
            className={`w-9 h-9 rounded-full border border-border bg-background flex items-center justify-center hover:bg-secondary hover:text-secondary-foreground hover:border-secondary transition-all ${wishlisted ? "bg-destructive/10 text-destructive border-destructive/30" : "text-foreground"}`}
            aria-label="Add to wishlist"
          >
            <Heart className={`h-4 w-4 ${wishlisted ? "fill-current" : ""}`} />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); onQuickView(product); }}
            className="w-9 h-9 rounded-full border border-border bg-background text-foreground flex items-center justify-center hover:bg-secondary hover:text-secondary-foreground hover:border-secondary transition-all"
            aria-label="Quick view"
          >
            <Eye className="h-4 w-4" />
          </button>
        </div>

        {/* Sale ribbon marquee */}
        {product.saleRibbon && (
          <div className="absolute bottom-12 left-0 right-0 bg-destructive text-destructive-foreground overflow-hidden py-1">
            <div className="animate-marquee whitespace-nowrap flex">
              {Array.from({ length: 8 }).map((_, i) => (
                <span key={i} className="text-[10px] font-bold mx-4 tracking-wider">{product.saleRibbon}</span>
              ))}
            </div>
          </div>
        )}

        {/* Quick Add button */}
        <div className="absolute bottom-0 left-0 right-0 opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-300 p-3">
          <button
            onClick={(e) => { e.stopPropagation(); addToCart(shopItem); }}
            className="w-full bg-background text-foreground text-xs font-semibold py-2.5 rounded-full shadow-lg hover:bg-secondary hover:text-secondary-foreground transition-all flex items-center justify-center gap-2 font-body"
          >
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
            className={`h-3 w-3 ${
              i < Math.floor(product.rating) ? "fill-secondary text-secondary" : "text-border"
            }`}
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
  );
};

const FeaturedProducts = () => {
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const { data, isLoading } = useMedusaProducts({ limit: 4 });

  // Map Medusa products to local Product type, fallback to hardcoded
  const displayProducts: Product[] = data?.products?.length
    ? data.products.map((mp) => {
        const { price, originalPrice } = getProductPrice(mp);
        const badge = getProductBadge(mp);
        return {
          id: mp.id,
          title: mp.title,
          price: price || "$0.00",
          originalPrice: originalPrice ?? undefined,
          badge: badge?.text,
          badgeColor: badge?.color,
          rating: getProductRating(mp),
          type: (mp.metadata?.type as "digital" | "service") || "digital",
          description: mp.description || "",
          saleRibbon: mp.metadata?.saleRibbon as string | undefined,
        };
      })
    : products;

  return (
    <>
      <section id="products" className="py-16 md:py-24 bg-surface-warm">
        <div className="container">
          <div className="flex items-end justify-between mb-12">
            <div>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-3">
                Today's Top Picks
              </h2>
              <p className="text-muted-foreground font-body">
                Start your journey with our most popular digital guides.
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
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="bg-muted rounded-lg aspect-[3/4] mb-4" />
                  <div className="h-4 bg-muted rounded w-3/4 mb-2" />
                  <div className="h-3 bg-muted rounded w-1/2" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
              {displayProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onQuickView={setQuickViewProduct}
                />
              ))}
            </div>
          )}

          <div className="md:hidden mt-8 text-center">
            <a
              href="#"
              className="inline-flex items-center gap-2 text-sm font-medium text-foreground hover:text-secondary transition-colors font-body"
            >
              View All Products <ArrowRight className="h-4 w-4" />
            </a>
          </div>
        </div>
      </section>

      <QuickViewModal
        open={!!quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
        product={quickViewProduct ? {
          id: quickViewProduct.id,
          title: quickViewProduct.title,
          price: quickViewProduct.price,
          originalPrice: quickViewProduct.originalPrice,
          rating: quickViewProduct.rating,
          description: quickViewProduct.description,
          badge: quickViewProduct.badge,
        } : undefined}
      />
    </>
  );
};

export default FeaturedProducts;
