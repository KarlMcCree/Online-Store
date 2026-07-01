import { X, Minus, Plus, ShoppingCart } from "lucide-react";
import { Link } from "react-router-dom";
import { useShop } from "@/contexts/ShopContext";

interface CartDrawerProps {
  open: boolean;
  onClose: () => void;
}

const CartDrawer = ({ open, onClose }: CartDrawerProps) => {
  const { cart, updateQty, removeFromCart, cartSubtotal, checkout } = useShop();

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-[70] bg-foreground/40 transition-opacity duration-300 ${
          open ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 bottom-0 z-[80] w-full max-w-md bg-background border-l border-border shadow-2xl transform transition-transform duration-300 ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-border">
            <h3 className="font-display text-lg font-bold text-foreground">Shopping Cart</h3>
            <button onClick={onClose} className="text-foreground hover:text-secondary transition-colors" aria-label="Close cart">
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Items */}
          <div className="flex-1 overflow-y-auto px-6 py-4">
            {cart.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <ShoppingCart className="h-16 w-16 text-muted-foreground/30 mb-4" />
                <p className="text-muted-foreground font-body">Your cart is empty</p>
              </div>
            ) : (
              <div className="space-y-4">
                {cart.map((item) => (
                  <div key={item.id} className="flex gap-4 py-4 border-b border-border">
                    <div className="w-20 h-20 rounded-lg bg-secondary/10 flex items-center justify-center flex-shrink-0">
                      <span className="text-2xl">📄</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground font-body truncate">{item.title}</p>
                      <p className="text-sm font-semibold text-foreground font-body mt-1">{item.price}</p>
                      <div className="flex items-center gap-3 mt-2">
                        <button onClick={() => updateQty(item.id, item.qty - 1)} className="w-7 h-7 rounded-full border border-border flex items-center justify-center text-foreground hover:bg-muted transition-colors">
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="text-sm font-body font-medium text-foreground">{item.qty}</span>
                        <button onClick={() => updateQty(item.id, item.qty + 1)} className="w-7 h-7 rounded-full border border-border flex items-center justify-center text-foreground hover:bg-muted transition-colors">
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>
                    </div>
                    <button onClick={() => removeFromCart(item.id)} className="text-muted-foreground hover:text-destructive transition-colors self-start">
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="border-t border-border px-6 py-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-body font-medium text-foreground">Subtotal</span>
              <span className="font-body font-bold text-foreground text-lg">
                ${cartSubtotal.toFixed(2)}
              </span>
            </div>
            <Link
              to="/dashboard"
              onClick={onClose}
              className="block w-full text-center bg-foreground text-background font-semibold py-3 rounded-full hover:bg-foreground/90 transition-colors font-body"
            >
              View Cart
            </Link>
            <button onClick={checkout} className="w-full bg-secondary text-secondary-foreground font-semibold py-3.5 rounded-full hover:bg-secondary/90 transition-colors font-body">
              Checkout
            </button>
            <button onClick={onClose} className="w-full text-center text-sm text-muted-foreground hover:text-foreground transition-colors font-body py-2">
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default CartDrawer;
