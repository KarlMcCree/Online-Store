import { Search, User, Heart, ShoppingCart, Menu, X } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import SearchOverlay from "./SearchOverlay";
import CartDrawer from "./CartDrawer";
import { useAuth } from "@/contexts/AuthContext";
import { useShop } from "@/contexts/ShopContext";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Services", href: "/services" },
  { label: "About", href: "/about" },
  { label: "Blog", href: "/blog" },
  { label: "Contact", href: "/contact" },
];

const Header = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const { isAuthenticated, openAuthModal } = useAuth();
  const { cartCount, favourites } = useShop();
  const navigate = useNavigate();

  const handleAccount = () => {
    if (isAuthenticated) navigate("/dashboard");
    else openAuthModal("login", "Sign in to access your account.");
  };

  const handleFavourites = () => {
    if (isAuthenticated) navigate("/dashboard");
    else openAuthModal("signup", "Create an account to save favourites.");
  };

  const handleCart = () => {
    setCartOpen(true);
  };

  return (
    <>
      <header className="bg-background sticky top-0 z-50 border-b border-border">
        <div className="container flex items-center justify-between py-4">
          {/* Left nav */}
          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                to={link.href}
                className="text-sm font-medium text-foreground hover:text-secondary transition-colors tracking-wide"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Mobile menu button */}
          <button
            className="lg:hidden text-foreground"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>

          {/* Logo */}
          <Link to="/" className="flex flex-col items-center">
            <span className="font-display text-2xl font-bold tracking-tight text-foreground">
              Online Dynamics & BSB
            </span>
          </Link>

          {/* Right icons */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSearchOpen(true)}
              className="text-foreground hover:text-secondary transition-colors"
              aria-label="Search"
            >
              <Search className="h-5 w-5" />
            </button>
            <button onClick={handleAccount} className="text-foreground hover:text-secondary transition-colors hidden sm:block" aria-label="Account">
              <User className="h-5 w-5" />
            </button>
            <button onClick={handleFavourites} className="relative text-foreground hover:text-secondary transition-colors hidden sm:block" aria-label="Wishlist">
              <Heart className="h-5 w-5" />
              {isAuthenticated && favourites.length > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-secondary text-secondary-foreground text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {favourites.length}
                </span>
              )}
            </button>
            <button
              onClick={handleCart}
              className="relative text-foreground hover:text-secondary transition-colors"
              aria-label="Cart"
            >
              <ShoppingCart className="h-5 w-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-secondary text-secondary-foreground text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Mobile nav */}
        {mobileOpen && (
          <nav className="lg:hidden border-t border-border bg-background py-4">
            <div className="container flex flex-col gap-3">
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  to={link.href}
                  className="text-sm font-medium text-foreground hover:text-secondary py-2 transition-colors"
                  onClick={() => setMobileOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </nav>
        )}
      </header>

      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  );
};

export default Header;
