import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ShoppingCart, Heart, Search, LogOut,
  LayoutDashboard, Newspaper, Package, CreditCard, FileText, Settings, ShoppingBag,
  Trash2, Minus, Plus, Download, RefreshCw, Sparkles, Clock, ArrowRight, Check,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useShop } from "@/contexts/ShopContext";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase/client";
import PreferencesModal from "@/components/PreferencesModal";
import SEO from "@/components/SEO";

type PaystackDocument = {
  id: string;
  file_name: string;
  file_url: string;
  download_count: number;
  max_downloads: number;
  created_at: string;
  order_id: string | null;
};

type Tab = "overview" | "blog" | "products" | "cart" | "favourites" | "orders" | "payments" | "documents" | "settings";

const blogPosts = [
  { id: 1, title: "Top 10 Countries for Study Abroad in 2025", category: "Study Abroad", date: "Mar 15, 2025", readTime: "8 min" },
  { id: 2, title: "How to Write a Winning Statement of Purpose", category: "Guides", date: "Mar 10, 2025", readTime: "6 min" },
  { id: 3, title: "Canada Express Entry: Complete Guide for 2025", category: "Migration", date: "Mar 5, 2025", readTime: "12 min" },
  { id: 4, title: "5 Common Visa Mistakes and How to Avoid Them", category: "Visa Tips", date: "Feb 28, 2025", readTime: "5 min" },
];

const allProducts = [
  { id: "p1", title: "Complete Visa Application Guide", price: "$9.99", type: "digital" as const },
  { id: "p2", title: "SOP Writing Masterclass", price: "$14.99", type: "digital" as const },
  { id: "p3", title: "Country-Specific Checklist Bundle", price: "$4.99", type: "digital" as const },
  { id: "p4", title: "Travel Insurance Comparison Guide", price: "$7.99", type: "digital" as const },
  { id: "p5", title: "IELTS Prep Workbook", price: "$12.99", type: "digital" as const },
  { id: "p6", title: "Scholarship Application Toolkit", price: "$19.99", type: "digital" as const },
];

const Dashboard = () => {
  const { user, isAuthenticated, logout, openAuthModal } = useAuth();
  const {
    cart, favourites, recentlyViewed, orders, payments, documents, preferences,
    cartCount, cartSubtotal, removeFromCart, updateQty, clearCart, checkout,
    addToCart, toggleFavourite, isFavourite, downloadDocument, refillDocument,
  } = useShop();
  const navigate = useNavigate();
  const [tab, setTab] = useState<Tab>("overview");
  const [search, setSearch] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [prefsOpen, setPrefsOpen] = useState(false);
  const [docsOrderFilter, setDocsOrderFilter] = useState<string | null>(null);

  const goToOrderDocs = (orderId: string) => {
    setDocsOrderFilter(orderId);
    setTab("documents");
  };

  // Auth gate
  useEffect(() => {
    if (!isAuthenticated) openAuthModal("login", "Sign in to view your dashboard.");
  }, [isAuthenticated, openAuthModal]);

  // First-visit preferences prompt
  useEffect(() => {
    if (isAuthenticated && !preferences.completed) {
      const t = setTimeout(() => setPrefsOpen(true), 400);
      return () => clearTimeout(t);
    }
  }, [isAuthenticated, preferences.completed]);

  // Products ordered by interaction count, then defaults
  const orderedProducts = useMemo(() => {
    const interactions = new Map(recentlyViewed.map((r) => [String(r.id), r.interactions]));
    return [...allProducts].sort((a, b) => (interactions.get(b.id) ?? 0) - (interactions.get(a.id) ?? 0));
  }, [recentlyViewed]);

  const filteredProducts = orderedProducts.filter((p) =>
    !search || p.title.toLowerCase().includes(search.toLowerCase())
  );

  if (!isAuthenticated || !user) {
    return (
      <main className="min-h-screen bg-surface-warm flex items-center justify-center p-6">
        <div className="text-center">
          <h1 className="font-display text-3xl font-bold text-foreground mb-3">Sign in required</h1>
          <p className="text-muted-foreground font-body mb-6">Please sign in to access your dashboard.</p>
          <button
            onClick={() => openAuthModal("login")}
            className="bg-secondary text-secondary-foreground font-semibold px-8 py-3 rounded-full hover:bg-secondary/90 transition-colors font-body"
          >
            Sign In
          </button>
        </div>
      </main>
    );
  }

  const navItems: { key: Tab; label: string; icon: typeof LayoutDashboard; badge?: number }[] = [
    { key: "overview", label: "Overview", icon: LayoutDashboard },
    { key: "blog", label: "Blog", icon: Newspaper },
    { key: "products", label: "Products", icon: ShoppingBag },
    { key: "cart", label: "Cart", icon: ShoppingCart, badge: cartCount },
    { key: "favourites", label: "Favourites", icon: Heart, badge: favourites.length },
    { key: "orders", label: "Orders", icon: Package, badge: orders.length },
    { key: "payments", label: "Payment History", icon: CreditCard },
    { key: "documents", label: "My Documents", icon: FileText, badge: documents.length },
    { key: "settings", label: "Settings", icon: Settings },
  ];

  const handleLogout = () => {
    logout();
    toast({ title: "Signed out" });
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-surface-warm">
      <SEO
        title="My Dashboard – The Digital Desk"
        description="Manage your orders, downloads, and preferences in your Digital Desk dashboard."
        url="/dashboard"
      />
      {/* Top welcome bar (replaces site header on /dashboard) */}
      <header className="bg-background border-b border-border sticky top-0 z-30">
        <div className="flex items-center justify-between gap-4 px-4 md:px-8 py-4">
          <div className="flex items-center gap-3 min-w-0">
            <Link to="/" className="flex-shrink-0 font-display text-base font-bold text-foreground hidden md:block">
              OD&BSB
            </Link>
            <div className="hidden sm:block min-w-0">
              <h1 className="font-display text-lg md:text-xl font-bold text-foreground truncate">
                Welcome, {user.name}
              </h1>
              <p className="text-[11px] text-muted-foreground font-body">Your personalized workspace</p>
            </div>
          </div>

          {showSearch && (
            <div className="flex-1 max-w-md">
              <input
                autoFocus
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search products, orders, documents..."
                className="w-full px-4 py-2 rounded-full border border-border bg-background text-sm font-body focus:outline-none focus:border-secondary"
              />
            </div>
          )}

          <div className="text-xs text-muted-foreground font-body hidden md:block">
            {new Date().toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric" })}
          </div>
        </div>
      </header>

      {/* Main app shell: left icon rail + content + right nav rail */}
      <div className="flex min-h-[calc(100vh-73px)]">
        {/* LEFT icon rail */}
        <aside className="w-16 bg-background border-r border-border flex flex-col items-center py-6 gap-2 sticky top-[73px] h-[calc(100vh-73px)]">
          <RailButton icon={ShoppingCart} label="Cart" badge={cartCount} active={tab === "cart"} onClick={() => setTab("cart")} />
          <RailButton icon={Heart} label="Favourites" badge={favourites.length} active={tab === "favourites"} onClick={() => setTab("favourites")} />
          <RailButton icon={Search} label="Search" active={showSearch} onClick={() => setShowSearch((v) => !v)} />
          <div className="flex-1" />
          <RailButton icon={LogOut} label="Log out" onClick={handleLogout} variant="danger" />
        </aside>

        {/* CENTER content */}
        <main className="flex-1 min-w-0 p-6 md:p-8">
          {tab === "overview" && <OverviewPanel
            user={user}
            preferences={preferences}
            cartCount={cartCount}
            favCount={favourites.length}
            ordersCount={orders.length}
            docsCount={documents.length}
            recentlyViewed={recentlyViewed}
            onOpenPrefs={() => setPrefsOpen(true)}
            onTab={setTab}
          />}

          {tab === "blog" && <BlogPanel />}

          {tab === "products" && <ProductsPanel products={filteredProducts} />}

          {tab === "cart" && <CartPanel cart={cart} cartSubtotal={cartSubtotal} updateQty={updateQty} removeFromCart={removeFromCart} clearCart={clearCart} checkout={checkout} recentlyViewed={recentlyViewed} />}

          {tab === "favourites" && <FavouritesPanel favourites={favourites} addToCart={addToCart} toggleFavourite={toggleFavourite} recentlyViewed={recentlyViewed} />}

          {tab === "orders" && <OrdersPanel onViewDocs={goToOrderDocs} />}

          {tab === "payments" && <PaymentsPanel payments={payments} />}

          {tab === "documents" && <DocumentsPanel documents={documents} downloadDocument={downloadDocument} refillDocument={refillDocument} orderFilter={docsOrderFilter} clearOrderFilter={() => setDocsOrderFilter(null)} />}

          {tab === "settings" && <SettingsPanel onEditPrefs={() => setPrefsOpen(true)} preferences={preferences} />}
        </main>

        {/* RIGHT nav rail */}
        <aside className="w-64 bg-background border-l border-border hidden lg:flex flex-col p-4 sticky top-[73px] h-[calc(100vh-73px)] overflow-y-auto">
          <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground font-body px-3 mb-2">Workspace</p>
          <nav className="flex flex-col gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = tab === item.key;
              return (
                <button
                  key={item.key}
                  onClick={() => setTab(item.key)}
                  className={`flex items-center justify-between gap-3 px-3 py-2.5 rounded-lg text-sm font-body font-medium transition-colors ${
                    active ? "bg-secondary text-secondary-foreground" : "text-foreground hover:bg-muted"
                  }`}
                >
                  <span className="flex items-center gap-3">
                    <Icon className="h-4 w-4" />
                    {item.label}
                  </span>
                  {item.badge ? (
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${active ? "bg-background/20" : "bg-secondary text-secondary-foreground"}`}>
                      {item.badge}
                    </span>
                  ) : null}
                </button>
              );
            })}
          </nav>

          {!preferences.completed && (
            <button
              onClick={() => setPrefsOpen(true)}
              className="mt-4 text-left bg-secondary/10 border border-secondary/30 rounded-lg p-3 hover:bg-secondary/20 transition-colors"
            >
              <div className="flex items-center gap-2 mb-1">
                <Sparkles className="h-3.5 w-3.5 text-secondary" />
                <span className="text-xs font-semibold text-foreground font-body">Personalize</span>
              </div>
              <p className="text-[11px] text-muted-foreground font-body leading-snug">Tell us your preferences to unlock tailored recommendations.</p>
            </button>
          )}
        </aside>
      </div>

      {/* Mobile bottom nav for the right-rail items (since right rail is hidden < lg) */}
      <nav className="lg:hidden fixed bottom-0 inset-x-0 bg-background border-t border-border z-20 overflow-x-auto">
        <div className="flex">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = tab === item.key;
            return (
              <button
                key={item.key}
                onClick={() => setTab(item.key)}
                className={`flex-shrink-0 flex flex-col items-center gap-1 px-4 py-2 text-[10px] font-body ${
                  active ? "text-secondary" : "text-muted-foreground"
                }`}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </button>
            );
          })}
        </div>
      </nav>

      <PreferencesModal open={prefsOpen} onClose={() => setPrefsOpen(false)} />
    </div>
  );
};

// ============ Rail button ============
const RailButton = ({
  icon: Icon, label, badge, active, onClick, variant,
}: {
  icon: typeof ShoppingCart; label: string; badge?: number; active?: boolean; onClick: () => void; variant?: "danger";
}) => (
  <button
    onClick={onClick}
    title={label}
    aria-label={label}
    className={`relative w-11 h-11 rounded-xl flex items-center justify-center transition-colors ${
      variant === "danger"
        ? "text-destructive hover:bg-destructive/10"
        : active
        ? "bg-secondary text-secondary-foreground"
        : "text-foreground hover:bg-muted"
    }`}
  >
    <Icon className="h-5 w-5" />
    {!!badge && badge > 0 && (
      <span className="absolute -top-1 -right-1 bg-destructive text-destructive-foreground text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
        {badge > 9 ? "9+" : badge}
      </span>
    )}
  </button>
);

// ============ Panels ============
const OverviewPanel = ({ user, preferences, cartCount, favCount, ordersCount, docsCount, recentlyViewed, onOpenPrefs, onTab }: any) => (
  <div className="space-y-6">
    <div>
      <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-1">Hi {user.name}, here's your overview</h2>
      <p className="text-muted-foreground font-body text-sm">Pick up where you left off, or explore something new.</p>
    </div>

    {!preferences.completed && (
      <div className="bg-gradient-to-r from-secondary/15 to-secondary/5 border border-secondary/30 rounded-xl p-5 flex items-center gap-4">
        <div className="w-12 h-12 rounded-full bg-secondary/20 flex items-center justify-center flex-shrink-0">
          <Sparkles className="h-5 w-5 text-secondary" />
        </div>
        <div className="flex-1">
          <p className="font-display font-bold text-foreground">Personalize your dashboard</p>
          <p className="text-sm text-muted-foreground font-body">Tell us your destination, study level, and budget for tailored recommendations.</p>
        </div>
        <button onClick={onOpenPrefs} className="bg-secondary text-secondary-foreground font-semibold px-5 py-2 rounded-full text-sm font-body hover:bg-secondary/90">Set preferences</button>
      </div>
    )}

    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard label="Cart" value={cartCount} onClick={() => onTab("cart")} />
      <StatCard label="Favourites" value={favCount} onClick={() => onTab("favourites")} />
      <StatCard label="Orders" value={ordersCount} onClick={() => onTab("orders")} />
      <StatCard label="Documents" value={docsCount} onClick={() => onTab("documents")} />
    </div>

    <div>
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-display text-lg font-bold text-foreground flex items-center gap-2"><Clock className="h-4 w-4 text-secondary" /> Recently interacted</h3>
        {recentlyViewed.length > 0 && <button onClick={() => onTab("products")} className="text-xs text-secondary font-body flex items-center gap-1">See products <ArrowRight className="h-3 w-3" /></button>}
      </div>
      {recentlyViewed.length === 0 ? (
        <div className="bg-background border border-border rounded-xl p-8 text-center">
          <p className="text-sm text-muted-foreground font-body">Your interactions with products will appear here.</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {recentlyViewed.slice(0, 6).map((r: any) => (
            <div key={r.id} className="bg-background border border-border rounded-lg p-3 flex items-center gap-3">
              <div className="w-10 h-10 rounded-md bg-secondary/10 flex items-center justify-center text-lg">📄</div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-body font-medium text-foreground truncate">{r.title}</p>
                <p className="text-[11px] text-muted-foreground font-body">{r.interactions} interaction{r.interactions > 1 ? "s" : ""}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  </div>
);

const BlogPanel = () => (
  <div>
    <div className="flex items-center justify-between mb-6">
      <div>
        <h2 className="font-display text-2xl font-bold text-foreground">From the Blog</h2>
        <p className="text-sm text-muted-foreground font-body">Latest insights from our team.</p>
      </div>
      <Link to="/blog" className="text-sm text-secondary font-body flex items-center gap-1">View all <ArrowRight className="h-3 w-3" /></Link>
    </div>
    <div className="grid sm:grid-cols-2 gap-4">
      {blogPosts.map((post) => (
        <Link key={post.id} to="/blog" className="block bg-background border border-border rounded-xl p-5 hover:border-secondary transition-colors">
          <span className="text-[10px] font-bold uppercase tracking-wider text-secondary font-body">{post.category}</span>
          <h3 className="font-display text-base font-bold text-foreground mt-2 mb-2">{post.title}</h3>
          <p className="text-xs text-muted-foreground font-body">{post.date} · {post.readTime}</p>
        </Link>
      ))}
    </div>
  </div>
);

const ProductsPanel = ({ products }: { products: typeof allProducts }) => {
  const { addToCart, toggleFavourite, isFavourite, trackInteraction } = useShop();
  return (
    <div>
      <div className="mb-6">
        <h2 className="font-display text-2xl font-bold text-foreground">Products</h2>
        <p className="text-sm text-muted-foreground font-body">Sorted by what you've engaged with most.</p>
      </div>
      {products.length === 0 ? (
        <p className="text-sm text-muted-foreground font-body">No products match your search.</p>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {products.map((p) => (
            <div key={p.id} onMouseEnter={() => trackInteraction(p)} className="bg-background border border-border rounded-xl p-5 group hover:border-secondary transition-colors">
              <div className="aspect-[4/3] rounded-lg bg-gradient-to-br from-primary/5 to-secondary/10 flex items-center justify-center mb-4">
                <span className="text-4xl">📄</span>
              </div>
              <h3 className="font-body font-semibold text-foreground mb-1">{p.title}</h3>
              <p className="text-secondary font-bold font-body mb-3">{p.price}</p>
              <div className="flex gap-2">
                <button onClick={() => addToCart(p)} className="flex-1 bg-secondary text-secondary-foreground text-sm font-semibold py-2 rounded-full hover:bg-secondary/90 font-body">Add to cart</button>
                <button onClick={() => toggleFavourite(p)} className={`w-9 h-9 rounded-full border flex items-center justify-center ${isFavourite(p.id) ? "bg-destructive/10 text-destructive border-destructive/30" : "border-border text-foreground hover:border-secondary"}`}>
                  <Heart className={`h-4 w-4 ${isFavourite(p.id) ? "fill-current" : ""}`} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const CartPanel = ({ cart, cartSubtotal, updateQty, removeFromCart, clearCart, checkout, recentlyViewed }: any) => (
  <div>
    <div className="flex items-center justify-between mb-6">
      <h2 className="font-display text-2xl font-bold text-foreground">Your Cart</h2>
      {cart.length > 0 && <button onClick={clearCart} className="text-sm text-muted-foreground hover:text-destructive font-body">Clear cart</button>}
    </div>
    {cart.length === 0 ? (
      <EmptyState icon={ShoppingCart} title="Your cart is empty" description="Browse products to start adding items." />
    ) : (
      <div className="bg-background border border-border rounded-xl p-6">
        <div className="space-y-1">
          {cart.map((item: any) => (
            <div key={item.id} className="flex items-center gap-4 py-4 border-b border-border last:border-b-0">
              <div className="w-14 h-14 rounded-lg bg-secondary/10 flex items-center justify-center flex-shrink-0 text-xl">📄</div>
              <div className="flex-1 min-w-0">
                <p className="font-body font-medium text-foreground truncate">{item.title}</p>
                <p className="text-sm font-semibold text-foreground font-body mt-0.5">{item.price}</p>
              </div>
              <div className="flex items-center border border-border rounded-full">
                <button onClick={() => updateQty(item.id, item.qty - 1)} className="px-2.5 py-1.5 text-foreground hover:text-secondary"><Minus className="h-3 w-3" /></button>
                <span className="px-2 text-sm font-body text-foreground">{item.qty}</span>
                <button onClick={() => updateQty(item.id, item.qty + 1)} className="px-2.5 py-1.5 text-foreground hover:text-secondary"><Plus className="h-3 w-3" /></button>
              </div>
              <button onClick={() => removeFromCart(item.id)} className="text-muted-foreground hover:text-destructive"><Trash2 className="h-4 w-4" /></button>
            </div>
          ))}
        </div>
        <div className="mt-6 flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground font-body">Subtotal</p>
            <p className="text-2xl font-bold text-foreground font-body">${cartSubtotal.toFixed(2)}</p>
          </div>
          <button onClick={checkout} className="bg-secondary text-secondary-foreground font-semibold px-8 py-3 rounded-full hover:bg-secondary/90 transition-colors font-body">Checkout</button>
        </div>
      </div>
    )}

    {recentlyViewed.length > 0 && (
      <div className="mt-8">
        <h3 className="font-display text-base font-bold text-foreground mb-3">Recently interacted</h3>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {recentlyViewed.slice(0, 6).map((r: any) => (
            <div key={r.id} className="bg-background border border-border rounded-lg p-3 flex items-center gap-3">
              <div className="w-10 h-10 rounded-md bg-secondary/10 flex items-center justify-center text-lg">📄</div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-body font-medium text-foreground truncate">{r.title}</p>
                <p className="text-[11px] text-muted-foreground font-body">{r.price}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    )}
  </div>
);

const FavouritesPanel = ({ favourites, addToCart, toggleFavourite, recentlyViewed }: any) => (
  <div>
    <h2 className="font-display text-2xl font-bold text-foreground mb-6">Favourites</h2>
    {favourites.length === 0 ? (
      <EmptyState icon={Heart} title="No favourites yet" description="Save products you love for easy access later." />
    ) : (
      <div className="grid sm:grid-cols-2 gap-4">
        {favourites.map((item: any) => (
          <div key={item.id} className="flex items-center gap-4 p-4 bg-background border border-border rounded-xl">
            <div className="w-14 h-14 rounded-lg bg-secondary/10 flex items-center justify-center flex-shrink-0 text-xl">📄</div>
            <div className="flex-1 min-w-0">
              <p className="font-body font-medium text-foreground truncate">{item.title}</p>
              <p className="text-sm text-foreground font-body">{item.price}</p>
            </div>
            <div className="flex flex-col gap-1">
              <button onClick={() => addToCart(item)} className="text-xs bg-secondary text-secondary-foreground px-3 py-1.5 rounded-full font-body">Add</button>
              <button onClick={() => toggleFavourite(item)} className="text-xs text-muted-foreground hover:text-destructive font-body">Remove</button>
            </div>
          </div>
        ))}
      </div>
    )}
    {recentlyViewed.length > 0 && (
      <div className="mt-8">
        <h3 className="font-display text-base font-bold text-foreground mb-3">Recently interacted</h3>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {recentlyViewed.slice(0, 6).map((r: any) => (
            <div key={r.id} className="bg-background border border-border rounded-lg p-3 flex items-center gap-3">
              <div className="w-10 h-10 rounded-md bg-secondary/10 flex items-center justify-center text-lg">📄</div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-body font-medium text-foreground truncate">{r.title}</p>
                <p className="text-[11px] text-muted-foreground font-body">{r.price}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    )}
  </div>
);

type PaystackOrderRow = {
  id: string;
  status: string;
  created_at: string;
  paystack_reference: string | null;
  metadata: { items?: any[]; total?: number; currency?: string; email?: string } | null;
};

const statusBadgeClass = (status: string) => {
  switch (status) {
    case "paid": return "bg-emerald-100 text-emerald-700 border-emerald-200";
    case "delivered": return "bg-blue-100 text-blue-700 border-blue-200";
    case "pending": return "bg-amber-100 text-amber-700 border-amber-200";
    case "failed": return "bg-rose-100 text-rose-700 border-rose-200";
    default: return "bg-muted text-muted-foreground border-border";
  }
};

const OrdersPanel = ({ onViewDocs }: { onViewDocs: (orderId: string) => void }) => {
  const { user } = useAuth();
  const [rows, setRows] = useState<PaystackOrderRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    let cancelled = false;
    (async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("paystack_orders")
        .select("id, status, created_at, paystack_reference, metadata")
        .order("created_at", { ascending: false });
      if (cancelled) return;
      if (error) {
        toast({ title: "Couldn't load orders", description: error.message, variant: "destructive" });
      } else {
        setRows((data ?? []) as PaystackOrderRow[]);
      }
      setLoading(false);
    })();
    return () => { cancelled = true; };
  }, [user]);

  return (
    <div>
      <h2 className="font-display text-2xl font-bold text-foreground mb-6">Orders</h2>
      {loading ? (
        <div className="bg-background border border-border rounded-xl p-8 text-center text-sm text-muted-foreground font-body">Loading…</div>
      ) : rows.length === 0 ? (
        <EmptyState icon={Package} title="No orders yet" description="Your past orders will show up here." />
      ) : (
        <div className="bg-background border border-border rounded-xl overflow-hidden">
          <table className="w-full text-sm font-body">
            <thead className="bg-muted/50 text-xs uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="text-left px-4 py-3">Order ID</th>
                <th className="text-left px-4 py-3">Date</th>
                <th className="text-right px-4 py-3">Total</th>
                <th className="text-center px-4 py-3">Status</th>
                <th className="text-right px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((o) => {
                const currency = o.metadata?.currency ?? "NGN";
                const total = o.metadata?.total ?? 0;
                const fmt = new Intl.NumberFormat("en-NG", { style: "currency", currency }).format(total);
                return (
                  <tr key={o.id} className="border-t border-border">
                    <td className="px-4 py-3 text-foreground font-mono text-xs">{o.id.slice(0, 8)}…</td>
                    <td className="px-4 py-3 text-muted-foreground">{new Date(o.created_at).toLocaleDateString()}</td>
                    <td className="px-4 py-3 text-right text-foreground font-semibold">{fmt}</td>
                    <td className="px-4 py-3 text-center">
                      <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full border ${statusBadgeClass(o.status)}`}>
                        {o.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => onViewDocs(o.id)}
                        className="text-xs font-semibold text-secondary hover:underline font-body inline-flex items-center gap-1"
                      >
                        <FileText className="h-3 w-3" /> View documents
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};


const PaymentsPanel = ({ payments }: any) => (
  <div>
    <h2 className="font-display text-2xl font-bold text-foreground mb-6">Payment History</h2>
    {payments.length === 0 ? (
      <EmptyState icon={CreditCard} title="No payments yet" description="Your payment activity will appear here." />
    ) : (
      <div className="bg-background border border-border rounded-xl overflow-hidden">
        <table className="w-full text-sm font-body">
          <thead className="bg-muted/50 text-xs uppercase tracking-wider text-muted-foreground">
            <tr>
              <th className="text-left px-4 py-3">Reference</th>
              <th className="text-left px-4 py-3">Date</th>
              <th className="text-left px-4 py-3">Method</th>
              <th className="text-right px-4 py-3">Amount</th>
              <th className="text-right px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {payments.map((p: any) => (
              <tr key={p.id} className="border-t border-border">
                <td className="px-4 py-3 text-foreground font-medium">{p.id}</td>
                <td className="px-4 py-3 text-muted-foreground">{new Date(p.date).toLocaleDateString()}</td>
                <td className="px-4 py-3 text-foreground">{p.method}</td>
                <td className="px-4 py-3 text-right text-foreground font-semibold">${p.amount.toFixed(2)}</td>
                <td className="px-4 py-3 text-right">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-secondary/15 text-secondary">{p.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )}
  </div>
);

const DocumentsPanel = ({ documents, downloadDocument, refillDocument, orderFilter, clearOrderFilter }: any) => {
  const { user } = useAuth();
  const [liveDocs, setLiveDocs] = useState<PaystackDocument[]>([]);
  const [loadingLive, setLoadingLive] = useState(true);

  useEffect(() => {
    if (!user) return;
    let cancelled = false;
    (async () => {
      setLoadingLive(true);
      const { data, error } = await supabase
        .from("documents")
        .select("id, file_name, file_url, download_count, max_downloads, created_at, order_id")
        .order("created_at", { ascending: false });
      if (cancelled) return;
      if (error) {
        toast({ title: "Couldn't load documents", description: error.message, variant: "destructive" });
      } else {
        setLiveDocs((data ?? []) as PaystackDocument[]);
      }
      setLoadingLive(false);
    })();
    return () => { cancelled = true; };
  }, [user]);

  const handleLiveDownload = async (doc: PaystackDocument) => {
    const remaining = doc.max_downloads - doc.download_count;
    if (remaining <= 0) {
      toast({ title: "No downloads left", description: "You've used your download quota for this file." });
      return;
    }
    if (!doc.file_url) {
      toast({ title: "File not available yet", description: "Your purchase is confirmed but the file link is missing.", variant: "destructive" });
      return;
    }
    // Optimistic increment + RLS-protected update
    const nextCount = doc.download_count + 1;
    setLiveDocs((prev) => prev.map((d) => d.id === doc.id ? { ...d, download_count: nextCount } : d));
    const { error } = await supabase
      .from("documents")
      .update({ download_count: nextCount })
      .eq("id", doc.id);
    if (error) {
      setLiveDocs((prev) => prev.map((d) => d.id === doc.id ? { ...d, download_count: doc.download_count } : d));
      toast({ title: "Download blocked", description: error.message, variant: "destructive" });
      return;
    }
    window.open(doc.file_url, "_blank", "noopener,noreferrer");
    toast({ title: "Download started", description: `${doc.max_downloads - nextCount} downloads remaining.` });
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="font-display text-2xl font-bold text-foreground">My Documents</h2>
        <p className="text-sm text-muted-foreground font-body">Files from your purchases. Each document includes a download quota.</p>
      </div>

      {/* Live purchased documents from Paystack orders */}
      <section className="mb-8">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-display text-base font-bold text-foreground">Purchased downloads</h3>
          {orderFilter && (
            <button
              onClick={clearOrderFilter}
              className="text-xs font-body text-secondary hover:underline"
            >
              Showing order {orderFilter.slice(0, 8)}… · Clear filter
            </button>
          )}
        </div>
        {loadingLive ? (
          <div className="bg-background border border-border rounded-xl p-8 text-center text-sm text-muted-foreground font-body">Loading…</div>
        ) : (() => {
          const filtered = orderFilter ? liveDocs.filter((d) => d.order_id === orderFilter) : liveDocs;
          if (filtered.length === 0) {
            return <EmptyState icon={FileText} title={orderFilter ? "No documents for this order" : "No purchased downloads yet"} description={orderFilter ? "This order has no document entitlements attached." : "Files from completed Paystack orders will appear here."} />;
          }
          return (
          <div className="grid sm:grid-cols-2 gap-4">
            {filtered.map((d) => {
              const remaining = d.max_downloads - d.download_count;
              const exhausted = remaining <= 0;
              const pct = (d.download_count / d.max_downloads) * 100;
              return (
                <div key={d.id} className="bg-background border border-border rounded-xl p-5">
                  <div className="flex items-start gap-3 mb-4">
                    <div className="w-12 h-12 rounded-lg bg-secondary/10 flex items-center justify-center flex-shrink-0 text-xl">📄</div>
                    <div className="flex-1 min-w-0">
                      <p className="font-body font-semibold text-foreground truncate">{d.file_name}</p>
                      <p className="text-[11px] text-muted-foreground font-body">Purchased {new Date(d.created_at).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="mb-3">
                    <div className="flex items-center justify-between text-xs font-body mb-1">
                      <span className="text-muted-foreground">Downloads used</span>
                      <span className={`font-semibold ${exhausted ? "text-destructive" : "text-foreground"}`}>{d.download_count} / {d.max_downloads}</span>
                    </div>
                    <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                      <div className={`h-full ${exhausted ? "bg-destructive" : "bg-secondary"} transition-all`} style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                  <button
                    onClick={() => handleLiveDownload(d)}
                    disabled={exhausted}
                    className="w-full bg-secondary text-secondary-foreground text-sm font-semibold py-2.5 rounded-full hover:bg-secondary/90 font-body flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Download className="h-3.5 w-3.5" /> {exhausted ? "Quota reached" : `Download (${remaining} left)`}
                  </button>
                </div>
              );
            })}
          </div>
          );
        })()}
      </section>


      {/* Legacy / sample documents (local state) */}
      {documents.length > 0 && (
        <section>
          <h3 className="font-display text-base font-bold text-foreground mb-3">Sample documents</h3>
          <div className="grid sm:grid-cols-2 gap-4">
            {documents.map((d: any) => {
              const remaining = d.downloadLimit - d.downloadsUsed;
              const exhausted = remaining <= 0;
              const pct = (d.downloadsUsed / d.downloadLimit) * 100;
              return (
                <div key={d.id} className="bg-background border border-border rounded-xl p-5">
                  <div className="flex items-start gap-3 mb-4">
                    <div className="w-12 h-12 rounded-lg bg-secondary/10 flex items-center justify-center flex-shrink-0 text-xl">📄</div>
                    <div className="flex-1 min-w-0">
                      <p className="font-body font-semibold text-foreground">{d.title}</p>
                      <p className="text-[11px] text-muted-foreground font-body">Purchased {new Date(d.purchasedAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="mb-3">
                    <div className="flex items-center justify-between text-xs font-body mb-1">
                      <span className="text-muted-foreground">Downloads used</span>
                      <span className={`font-semibold ${exhausted ? "text-destructive" : "text-foreground"}`}>{d.downloadsUsed} / {d.downloadLimit}</span>
                    </div>
                    <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                      <div className={`h-full ${exhausted ? "bg-destructive" : "bg-secondary"} transition-all`} style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                  {exhausted ? (
                    <button onClick={() => refillDocument(d.id)} className="w-full bg-foreground text-background text-sm font-semibold py-2.5 rounded-full font-body flex items-center justify-center gap-2">
                      <RefreshCw className="h-3.5 w-3.5" /> Top up access · {d.refillPrice}
                    </button>
                  ) : (
                    <button onClick={() => downloadDocument(d.id)} className="w-full bg-secondary text-secondary-foreground text-sm font-semibold py-2.5 rounded-full hover:bg-secondary/90 font-body flex items-center justify-center gap-2">
                      <Download className="h-3.5 w-3.5" /> Download ({remaining} left)
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
};

const SettingsPanel = ({ onEditPrefs, preferences }: any) => (
  <div>
    <h2 className="font-display text-2xl font-bold text-foreground mb-6">Settings</h2>

    <div className="bg-background border border-border rounded-xl p-5 mb-4">
      <div className="flex items-center justify-between mb-3">
        <div>
          <p className="font-body font-semibold text-foreground">Your preferences</p>
          <p className="text-xs text-muted-foreground font-body">Used to personalize recommendations.</p>
        </div>
        <button onClick={onEditPrefs} className="text-xs bg-secondary text-secondary-foreground px-4 py-2 rounded-full font-semibold font-body">Edit</button>
      </div>
      <div className="grid sm:grid-cols-2 gap-3 text-sm font-body">
        <PrefRow label="Destination" value={preferences.destination} />
        <PrefRow label="Study level" value={preferences.studyLevel} />
        <PrefRow label="Budget" value={preferences.budget} />
        <PrefRow label="Interests" value={preferences.interests?.join(", ")} />
        {preferences.other && <PrefRow label="Notes" value={preferences.other} />}
      </div>
    </div>

    <div className="space-y-3 max-w-2xl">
      <SettingRow label="Email notifications" description="Product updates and offers" />
      <SettingRow label="Marketing emails" description="Tips on study abroad & migration" />
      <SettingRow label="Two-factor authentication" description="Add an extra layer of security" />
    </div>
  </div>
);

const PrefRow = ({ label, value }: { label: string; value?: string }) => (
  <div>
    <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground font-body">{label}</p>
    <p className="text-foreground font-body mt-0.5">{value || <span className="text-muted-foreground italic">Not set</span>}</p>
  </div>
);

// ============ Shared bits ============
const StatCard = ({ label, value, onClick }: { label: string; value: number; onClick?: () => void }) => (
  <button onClick={onClick} className="bg-background border border-border rounded-xl p-5 text-left hover:border-secondary transition-colors">
    <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground font-body">{label}</p>
    <p className="text-3xl font-bold text-foreground font-body mt-1">{value}</p>
  </button>
);

const EmptyState = ({ icon: Icon, title, description }: { icon: typeof ShoppingCart; title: string; description: string }) => (
  <div className="bg-background border border-border rounded-xl p-12 text-center">
    <Icon className="h-10 w-10 mx-auto text-muted-foreground/40 mb-3" />
    <h3 className="font-display text-base font-bold text-foreground mb-1">{title}</h3>
    <p className="text-muted-foreground font-body text-sm">{description}</p>
  </div>
);

const SettingRow = ({ label, description }: { label: string; description: string }) => {
  const [on, setOn] = useState(false);
  return (
    <div className="flex items-center justify-between p-4 bg-background border border-border rounded-lg">
      <div>
        <p className="font-body font-medium text-foreground">{label}</p>
        <p className="text-xs text-muted-foreground font-body">{description}</p>
      </div>
      <button
        onClick={() => setOn(!on)}
        className={`relative w-11 h-6 rounded-full transition-colors ${on ? "bg-secondary" : "bg-muted"}`}
        aria-label={label}
      >
        <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-background rounded-full shadow transition-transform ${on ? "translate-x-5" : ""}`} />
      </button>
    </div>
  );
};

export default Dashboard;
