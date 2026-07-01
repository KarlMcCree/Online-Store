// Medusa v2 Store API types

export interface MedusaMoneyAmount {
  id: string;
  amount: number;
  currency_code: string;
  min_quantity?: number;
  max_quantity?: number;
}

export interface MedusaProductVariant {
  id: string;
  title: string;
  sku?: string;
  prices: MedusaMoneyAmount[];
  inventory_quantity?: number;
  calculated_price?: {
    calculated_amount: number;
    original_amount: number;
    currency_code: string;
  };
}

export interface MedusaProductImage {
  id: string;
  url: string;
}

export interface MedusaProductTag {
  id: string;
  value: string;
}

export interface MedusaProductCollection {
  id: string;
  title: string;
  handle: string;
}

export interface MedusaProduct {
  id: string;
  title: string;
  handle: string;
  description?: string;
  subtitle?: string;
  thumbnail?: string;
  images?: MedusaProductImage[];
  variants?: MedusaProductVariant[];
  tags?: MedusaProductTag[];
  collection?: MedusaProductCollection;
  collection_id?: string;
  metadata?: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

export interface MedusaProductsResponse {
  products: MedusaProduct[];
  count: number;
  offset: number;
  limit: number;
}
