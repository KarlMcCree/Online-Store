import { useState, useEffect } from "react";
import { X } from "lucide-react";

const purchases = [
  { name: "Chidi Okafor", product: "Complete Visa Application Guide", time: "2 min ago" },
  { name: "Amina Bello", product: "SOP Writing Masterclass", time: "5 min ago" },
  { name: "Tolu Adeyemi", product: "1-on-1 Study Abroad Consultation", time: "8 min ago" },
  { name: "Grace Eze", product: "Country-Specific Checklist Bundle", time: "12 min ago" },
  { name: "Kelechi Nwankwo", product: "Travel Insurance Comparison Guide", time: "15 min ago" },
];

const PurchaseNotification = () => {
  const [current, setCurrent] = useState(0);
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (dismissed) return;

    const showTimer = setTimeout(() => {
      setVisible(true);
      const hideTimer = setTimeout(() => {
        setVisible(false);
        setTimeout(() => {
          setCurrent((prev) => (prev + 1) % purchases.length);
        }, 500);
      }, 4000);
      return () => clearTimeout(hideTimer);
    }, 3000);

    return () => clearTimeout(showTimer);
  }, [current, dismissed]);

  if (dismissed) return null;

  const purchase = purchases[current];

  return (
    <div
      className={`fixed bottom-6 left-6 z-[60] max-w-xs bg-card border border-border rounded-lg shadow-xl p-4 transition-all duration-500 ${
        visible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0 pointer-events-none"
      }`}
    >
      <button
        onClick={() => setDismissed(true)}
        className="absolute top-2 right-2 text-muted-foreground hover:text-foreground transition-colors"
        aria-label="Dismiss"
      >
        <X className="h-3.5 w-3.5" />
      </button>
      <div className="flex items-start gap-3">
        <div className="w-12 h-12 rounded-lg bg-secondary/10 flex items-center justify-center flex-shrink-0">
          <span className="text-lg">📄</span>
        </div>
        <div className="min-w-0">
          <p className="text-xs text-muted-foreground font-body">
            <span className="font-semibold text-foreground">{purchase.name}</span> has purchased!
          </p>
          <p className="text-sm font-medium text-foreground font-body mt-0.5 truncate">
            {purchase.product}
          </p>
          <p className="text-[10px] text-muted-foreground font-body mt-1">{purchase.time}</p>
        </div>
      </div>
    </div>
  );
};

export default PurchaseNotification;
