import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase/client";

type PaystackSetupOptions = {
  key: string;
  email: string;
  amount: number; // in kobo/cents
  ref: string;
  currency?: string;
  callback: (response: { reference: string }) => void;
  onClose: () => void;
};

type PaystackHandler = { openIframe: () => void };

declare global {
  interface Window {
    PaystackPop?: {
      setup: (options: PaystackSetupOptions) => PaystackHandler;
    };
  }
}

export type ShopItem = {
  id: string | number;
  title: string;
  price: string;
  image?: string;
  type?: "digital" | "service";
  /** UUID of the matching row in `products`. Optional for legacy/mock items. */
  product_id?: string;
  /** Display filename used when creating a download entitlement. */
  file_name?: string;
  /** URL the user will download after purchase. */
  file_url?: string;
};

export type CartItem = ShopItem & { qty: number };

export type RecentItem = ShopItem & { interactedAt: string; interactions: number };

export type Order = {
  id: string;
  date: string;
  total: number;
  status: "completed" | "processing" | "refunded";
  items: { title: string; qty: number; price: number }[];
};

export type Payment = {
  id: string;
  date: string;
  amount: number;
  method: "Card" | "Crypto" | "Bank";
  status: "paid" | "pending" | "failed";
  reference: string;
};

export type PurchasedDocument = {
  id: string;
  title: string;
  purchasedAt: string;
  downloadLimit: number;
  downloadsUsed: number;
  refillPrice: string;
};

export type UserPreferences = {
  destination?: string;
  studyLevel?: string;
  budget?: string;
  interests: string[];
  other?: string;
  completed: boolean;
};

const DEFAULT_PREFS: UserPreferences = { interests: [], completed: false };

type ShopContextType = {
  cart: CartItem[];
  favourites: ShopItem[];
  recentlyViewed: RecentItem[];
  orders: Order[];
  payments: Payment[];
  documents: PurchasedDocument[];
  preferences: UserPreferences;
  addToCart: (item: ShopItem) => boolean;
  removeFromCart: (id: ShopItem["id"]) => void;
  updateQty: (id: ShopItem["id"], qty: number) => void;
  clearCart: () => void;
  toggleFavourite: (item: ShopItem) => boolean;
  isFavourite: (id: ShopItem["id"]) => boolean;
  trackInteraction: (item: ShopItem) => void;
  downloadDocument: (id: string) => void;
  refillDocument: (id: string) => void;
  savePreferences: (prefs: UserPreferences) => void;
  checkout: () => Promise<boolean>;
  cartCount: number;
  cartSubtotal: number;
};

const ShopContext = createContext<ShopContextType | undefined>(undefined);

const GUEST_CART_KEY = "od_bsb_cart_guest";
const cartKey = (uid: string) => `od_bsb_cart_${uid}`;
const favKey = (uid: string) => `od_bsb_fav_${uid}`;
const recentKey = (uid: string) => `od_bsb_recent_${uid}`;
const ordersKey = (uid: string) => `od_bsb_orders_${uid}`;
const paymentsKey = (uid: string) => `od_bsb_payments_${uid}`;
const docsKey = (uid: string) => `od_bsb_docs_${uid}`;
const prefsKey = (uid: string) => `od_bsb_prefs_${uid}`;

const parsePrice = (p: string): number => {
  const m = p.replace(/[^0-9.]/g, "");
  return parseFloat(m) || 0;
};

const readJSON = <T,>(key: string, fallback: T): T => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch { return fallback; }
};

const mergeCarts = (a: CartItem[], b: CartItem[]): CartItem[] => {
  const map = new Map<string | number, CartItem>();
  [...a, ...b].forEach((item) => {
    const existing = map.get(item.id);
    if (existing) map.set(item.id, { ...existing, qty: existing.qty + item.qty });
    else map.set(item.id, { ...item });
  });
  return Array.from(map.values());
};

// Seed mock data on first dashboard visit so the UI feels alive
const seedMockData = (uid: string) => {
  if (!localStorage.getItem(ordersKey(uid))) {
    const orders: Order[] = [
      {
        id: "ORD-1042",
        date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 14).toISOString(),
        total: 24.98,
        status: "completed",
        items: [
          { title: "Complete Visa Application Guide", qty: 1, price: 9.99 },
          { title: "SOP Writing Masterclass", qty: 1, price: 14.99 },
        ],
      },
      {
        id: "ORD-1067",
        date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(),
        total: 4.99,
        status: "completed",
        items: [{ title: "Country-Specific Checklist Bundle", qty: 1, price: 4.99 }],
      },
    ];
    localStorage.setItem(ordersKey(uid), JSON.stringify(orders));
  }
  if (!localStorage.getItem(paymentsKey(uid))) {
    const payments: Payment[] = [
      { id: "PAY-9981", date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 14).toISOString(), amount: 24.98, method: "Card", status: "paid", reference: "ORD-1042" },
      { id: "PAY-9994", date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(), amount: 4.99, method: "Crypto", status: "paid", reference: "ORD-1067" },
    ];
    localStorage.setItem(paymentsKey(uid), JSON.stringify(payments));
  }
  if (!localStorage.getItem(docsKey(uid))) {
    const docs: PurchasedDocument[] = [
      { id: "DOC-VG", title: "Complete Visa Application Guide", purchasedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 14).toISOString(), downloadLimit: 5, downloadsUsed: 1, refillPrice: "$2.99" },
      { id: "DOC-SOP", title: "SOP Writing Masterclass", purchasedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 14).toISOString(), downloadLimit: 5, downloadsUsed: 0, refillPrice: "$3.99" },
      { id: "DOC-CHK", title: "Country-Specific Checklist Bundle", purchasedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(), downloadLimit: 5, downloadsUsed: 5, refillPrice: "$1.99" },
    ];
    localStorage.setItem(docsKey(uid), JSON.stringify(docs));
  }
};

export const ShopProvider = ({ children }: { children: ReactNode }) => {
  const { user, isAuthenticated, openAuthModal } = useAuth();
  const navigate = useNavigate();
  const [cart, setCart] = useState<CartItem[]>(() => readJSON(GUEST_CART_KEY, [] as CartItem[]));
  const [favourites, setFavourites] = useState<ShopItem[]>([]);
  const [recentlyViewed, setRecentlyViewed] = useState<RecentItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [documents, setDocuments] = useState<PurchasedDocument[]>([]);
  const [preferences, setPreferences] = useState<UserPreferences>(DEFAULT_PREFS);

  // On login/logout: load user-scoped data
  useEffect(() => {
    if (user) {
      seedMockData(user.id);
      const userCart = readJSON<CartItem[]>(cartKey(user.id), []);
      const guestCart = readJSON<CartItem[]>(GUEST_CART_KEY, []);
      const merged = mergeCarts(userCart, guestCart);
      setCart(merged);
      if (guestCart.length) localStorage.removeItem(GUEST_CART_KEY);
      setFavourites(readJSON(favKey(user.id), []));
      setRecentlyViewed(readJSON(recentKey(user.id), []));
      setOrders(readJSON(ordersKey(user.id), []));
      setPayments(readJSON(paymentsKey(user.id), []));
      setDocuments(readJSON(docsKey(user.id), []));
      setPreferences(readJSON(prefsKey(user.id), DEFAULT_PREFS));
    } else {
      setCart(readJSON(GUEST_CART_KEY, []));
      setFavourites([]);
      setRecentlyViewed([]);
      setOrders([]);
      setPayments([]);
      setDocuments([]);
      setPreferences(DEFAULT_PREFS);
    }
  }, [user]);

  // Persistence
  useEffect(() => {
    const key = user ? cartKey(user.id) : GUEST_CART_KEY;
    localStorage.setItem(key, JSON.stringify(cart));
  }, [cart, user]);
  useEffect(() => { if (user) localStorage.setItem(favKey(user.id), JSON.stringify(favourites)); }, [favourites, user]);
  useEffect(() => { if (user) localStorage.setItem(recentKey(user.id), JSON.stringify(recentlyViewed)); }, [recentlyViewed, user]);
  useEffect(() => { if (user) localStorage.setItem(docsKey(user.id), JSON.stringify(documents)); }, [documents, user]);
  useEffect(() => { if (user) localStorage.setItem(prefsKey(user.id), JSON.stringify(preferences)); }, [preferences, user]);

  const requireAuth = useCallback((reason: string) => {
    if (!isAuthenticated) {
      openAuthModal("signup", reason);
      return false;
    }
    return true;
  }, [isAuthenticated, openAuthModal]);

  const trackInteraction = useCallback((item: ShopItem) => {
    setRecentlyViewed((prev) => {
      const existing = prev.find((r) => r.id === item.id);
      const next: RecentItem = existing
        ? { ...existing, interactedAt: new Date().toISOString(), interactions: existing.interactions + 1 }
        : { ...item, interactedAt: new Date().toISOString(), interactions: 1 };
      const filtered = prev.filter((r) => r.id !== item.id);
      return [next, ...filtered].slice(0, 20);
    });
  }, []);

  const addToCart = (item: ShopItem) => {
    setCart((prev) => {
      const existing = prev.find((c) => c.id === item.id);
      if (existing) return prev.map((c) => c.id === item.id ? { ...c, qty: c.qty + 1 } : c);
      return [...prev, { ...item, qty: 1 }];
    });
    trackInteraction(item);
    toast({ title: "Added to cart", description: item.title });
    return true;
  };

  const removeFromCart = (id: ShopItem["id"]) =>
    setCart((prev) => prev.filter((c) => c.id !== id));

  const updateQty = (id: ShopItem["id"], qty: number) =>
    setCart((prev) => prev.map((c) => c.id === id ? { ...c, qty: Math.max(1, qty) } : c));

  const clearCart = () => setCart([]);

  const isFavourite = (id: ShopItem["id"]) => favourites.some((f) => f.id === id);

  const toggleFavourite = (item: ShopItem) => {
    if (!requireAuth("Create an account to save favourites.")) return false;
    setFavourites((prev) => {
      if (prev.some((f) => f.id === item.id)) {
        toast({ title: "Removed from favourites" });
        return prev.filter((f) => f.id !== item.id);
      }
      toast({ title: "Added to favourites", description: item.title });
      return [...prev, item];
    });
    trackInteraction(item);
    return true;
  };

  const downloadDocument = (id: string) => {
    setDocuments((prev) => prev.map((d) => {
      if (d.id !== id) return d;
      const remaining = d.downloadLimit - d.downloadsUsed;
      if (remaining <= 0) {
        toast({ title: "No downloads left", description: "Top up access to download again." });
        return d;
      }
      toast({ title: "Download started", description: `${remaining - 1} downloads remaining.` });
      return { ...d, downloadsUsed: d.downloadsUsed + 1 };
    }));
  };

  const refillDocument = (id: string) => {
    setDocuments((prev) => prev.map((d) => d.id === id ? { ...d, downloadsUsed: 0 } : d));
    toast({ title: "Access refilled", description: "5 fresh downloads added." });
  };

  const savePreferences = (prefs: UserPreferences) => {
    setPreferences({ ...prefs, completed: true });
    toast({ title: "Preferences saved", description: "We'll personalize your recommendations." });
  };

  const checkout = async (): Promise<boolean> => {
    if (cart.length === 0) {
      toast({ title: "Your cart is empty" });
      return false;
    }
    if (!requireAuth("Create an account to complete your purchase.")) return false;
    if (!user) return false;

    if (typeof window === "undefined" || !window.PaystackPop) {
      toast({ title: "Payment unavailable", description: "Paystack failed to load. Refresh and try again.", variant: "destructive" });
      return false;
    }

    const publicKey = import.meta.env.VITE_PAYSTACK_PUBLIC_KEY as string | undefined;
    if (!publicKey) {
      toast({ title: "Payment not configured", description: "Missing VITE_PAYSTACK_PUBLIC_KEY.", variant: "destructive" });
      return false;
    }

    const total = cartSubtotal;
    const itemsSnapshot = cart.map((c) => ({
      id: c.id,
      product_id: c.product_id ?? null,
      title: c.title,
      file_name: c.file_name ?? c.title,
      file_url: c.file_url ?? null,
      qty: c.qty,
      price: parsePrice(c.price),
    }));

    try {
      const { data: initData, error: initErr } = await supabase.functions.invoke("paystack/initialize", {
        method: "POST",
        body: { amount: total, email: user.email, currency: "NGN", metadata: { items: itemsSnapshot } },
      });
      if (initErr || !initData?.reference) {
        toast({ title: "Could not start payment", description: initErr?.message ?? "Please try again.", variant: "destructive" });
        return false;
      }

      const { reference } = initData as { reference: string };

      return await new Promise<boolean>((resolve) => {
        const handler = window.PaystackPop!.setup({
          key: publicKey,
          email: user.email!,
          amount: Math.round(total * 100), // kobo
          ref: reference,
          currency: "NGN",
          callback: (response) => {
            // Verify + persist in background
            (async () => {
              const { data: verifyData, error: verifyErr } = await supabase.functions.invoke(
                `paystack/verify?reference=${encodeURIComponent(response.reference)}`,
                { method: "GET" },
              );
              if (verifyErr || verifyData?.status !== "success") {
                toast({
                  title: "Payment could not be confirmed",
                  description: "We weren't able to verify your payment. If you were charged, please contact support with your reference.",
                  variant: "destructive",
                });
                resolve(false);
                return;
              }
              const { error: insertErr } = await supabase.from("paystack_orders").insert({
                user_id: user.id,
                total,
                paystack_reference: response.reference,
                status: "paid",
                metadata: { items: itemsSnapshot, email: user.email, currency: "NGN", total },
              });
              if (insertErr) {
                toast({
                  title: "Order partially saved",
                  description: "Payment was confirmed but we couldn't save the order. Contact support so we can release your downloads.",
                  variant: "destructive",
                });
              }
              setCart([]);
              toast({ title: "Payment successful", description: "Redirecting you to your order confirmation..." });
              navigate(`/order-confirmation?reference=${encodeURIComponent(response.reference)}`);
              resolve(true);
            })();
          },
          onClose: () => {
            toast({ title: "Payment cancelled", description: "No charge was made. You can try again anytime." });
            resolve(false);
          },
        });
        handler.openIframe();
      });
    } catch (e) {
      toast({
        title: "Checkout failed",
        description: (e as Error).message || "Something went wrong starting your payment. Please try again or contact support.",
        variant: "destructive",
      });
      return false;
    }
  };

  const cartCount = cart.reduce((s, c) => s + c.qty, 0);
  const cartSubtotal = cart.reduce((s, c) => s + parsePrice(c.price) * c.qty, 0);

  return (
    <ShopContext.Provider
      value={{
        cart, favourites, recentlyViewed, orders, payments, documents, preferences,
        addToCart, removeFromCart, updateQty, clearCart,
        toggleFavourite, isFavourite, trackInteraction,
        downloadDocument, refillDocument, savePreferences,
        checkout, cartCount, cartSubtotal,
      }}
    >
      {children}
    </ShopContext.Provider>
  );
};

export const useShop = () => {
  const ctx = useContext(ShopContext);
  if (!ctx) throw new Error("useShop must be used within ShopProvider");
  return ctx;
};
