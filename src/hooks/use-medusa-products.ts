import { useQuery } from "@tanstack/react-query";
import { medusaFetch } from "@/lib/medusa/client";
import type { MedusaProduct, MedusaProductsResponse } from "@/lib/medusa/types";

interface UseMedusaProductsOptions {
  limit?: number;
  offset?: number;
  collectionId?: string;
  tags?: string[];
}

export function useMedusaProducts(options: UseMedusaProductsOptions = {}) {
  const { limit = 20, offset = 0, collectionId, tags } = options;

  return useQuery({
    queryKey: ["medusa-products", { limit, offset, collectionId, tags }],
    queryFn: async () => {
      const params: Record<string, string | number> = { limit, offset };

      if (collectionId) {
        params["collection_id[]"] = collectionId;
      }

      const data = await medusaFetch<MedusaProductsResponse>({
        path: "/products",
        params,
      });

      return data;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 1,
  });
}

// Helper to extract the best price from a Medusa product
export function getProductPrice(product: MedusaProduct, currencyCode = "usd") {
  const variant = product.variants?.[0];
  if (!variant) return { price: null, originalPrice: null };

  // Check for calculated price first (requires pricing context)
  if (variant.calculated_price) {
    const { calculated_amount, original_amount, currency_code } = variant.calculated_price;
    const formatter = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency_code,
    });
    return {
      price: formatter.format(calculated_amount / 100),
      originalPrice: original_amount !== calculated_amount
        ? formatter.format(original_amount / 100)
        : null,
    };
  }

  // Fallback to raw prices
  const priceObj = variant.prices?.find(
    (p) => p.currency_code === currencyCode
  );

  if (!priceObj) return { price: null, originalPrice: null };

  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currencyCode,
  });

  return {
    price: formatter.format(priceObj.amount / 100),
    originalPrice: null,
  };
}

// Helper to get product rating from metadata
export function getProductRating(product: MedusaProduct): number {
  const rating = product.metadata?.rating;
  return typeof rating === "number" ? rating : 4.5;
}

// Helper to get product badge from metadata or tags
export function getProductBadge(product: MedusaProduct): { text: string; color: string } | null {
  if (product.metadata?.badge) {
    return {
      text: String(product.metadata.badge),
      color: String(product.metadata?.badgeColor || "bg-primary text-primary-foreground"),
    };
  }

  const tag = product.tags?.[0];
  if (tag) {
    return {
      text: tag.value.toUpperCase(),
      color: "bg-secondary text-secondary-foreground",
    };
  }

  return null;
}
