import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { CheckCircle2, Download, ArrowRight, AlertTriangle } from "lucide-react";
import { supabase } from "@/lib/supabase/client";
import LoadingSpinner from "@/components/LoadingSpinner";
import SEO from "@/components/SEO";

type OrderRow = {
  id: string;
  total: number | null;
  status: string | null;
  created_at: string;
  paystack_reference: string | null;
  metadata: Record<string, unknown> | null;
};

type DocRow = {
  id: string;
  file_name: string;
  file_url: string;
  max_downloads: number;
  download_count: number;
};

const formatMoney = (amount: number, currency = "NGN") =>
  new Intl.NumberFormat("en-NG", { style: "currency", currency }).format(amount);

const OrderConfirmation = () => {
  const [params] = useSearchParams();
  const reference = params.get("reference");
  const [loading, setLoading] = useState(true);
  const [order, setOrder] = useState<OrderRow | null>(null);
  const [docs, setDocs] = useState<DocRow[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      if (!reference) {
        setError("Missing payment reference.");
        setLoading(false);
        return;
      }
      const { data: orderRow, error: orderErr } = await supabase
        .from("paystack_orders")
        .select("id,total,status,created_at,paystack_reference,metadata")
        .eq("paystack_reference", reference)
        .maybeSingle();

      if (cancelled) return;
      if (orderErr || !orderRow) {
        setError("We couldn't find your order.");
        setLoading(false);
        return;
      }
      setOrder(orderRow as OrderRow);

      const { data: docRows } = await supabase
        .from("documents")
        .select("id,file_name,file_url,max_downloads,download_count")
        .eq("order_id", orderRow.id);
      if (cancelled) return;
      setDocs((docRows ?? []) as DocRow[]);
      setLoading(false);
    };
    load();
    return () => { cancelled = true; };
  }, [reference]);

  if (loading) {
    return (
      <div className="min-h-screen bg-surface-warm">
        <SEO title="Order Confirmation" description="Your order is being confirmed." />
        <LoadingSpinner fullScreen label="Confirming your order..." />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-surface-warm flex items-center justify-center p-6">
        <SEO title="Order Not Found" description="We couldn't locate your order." />
        <div className="max-w-md w-full text-center bg-card border border-border rounded-xl p-8 shadow-sm">
          <div className="w-14 h-14 rounded-full bg-destructive/10 text-destructive flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="h-7 w-7" />
          </div>
          <h1 className="font-display text-2xl font-bold mb-2">We couldn't find your order</h1>
          <p className="text-muted-foreground text-sm font-body mb-6">
            {error ?? "The reference you used may be invalid or the order is still processing."}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/dashboard" className="bg-secondary text-secondary-foreground px-5 py-2.5 rounded-full text-sm font-semibold hover:bg-secondary/90 transition-colors">
              Go to Dashboard
            </Link>
            <Link to="/" className="border border-border px-5 py-2.5 rounded-full text-sm font-semibold hover:bg-muted transition-colors">
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const currency = (order.metadata as { currency?: string } | null)?.currency ?? "NGN";
  const total = Number(order.total ?? 0);
  const itemsFromMeta = (order.metadata as { items?: { title?: string; file_url?: string | null }[] } | null)?.items ?? [];

  return (
    <div className="min-h-screen bg-surface-warm py-12 px-4">
      <SEO title="Payment Successful" description="Thank you for your purchase. Access your downloads now." />
      <div className="max-w-2xl mx-auto">
        <div className="bg-card border border-border rounded-2xl shadow-sm p-8 text-center">
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="h-9 w-9" />
          </div>
          <h1 className="font-display text-3xl font-bold mb-2">Payment Successful!</h1>
          <p className="text-muted-foreground font-body">
            Thank you for your purchase. A confirmation email is on its way.
          </p>
        </div>

        <div className="bg-card border border-border rounded-2xl shadow-sm p-6 mt-6">
          <h2 className="font-display text-lg font-semibold mb-4">Order Summary</h2>
          <dl className="grid grid-cols-2 gap-3 text-sm font-body">
            <dt className="text-muted-foreground">Order ID</dt>
            <dd className="text-right font-mono text-xs">{order.id.slice(0, 8).toUpperCase()}</dd>
            <dt className="text-muted-foreground">Reference</dt>
            <dd className="text-right font-mono text-xs break-all">{order.paystack_reference}</dd>
            <dt className="text-muted-foreground">Date</dt>
            <dd className="text-right">{new Date(order.created_at).toLocaleString()}</dd>
            <dt className="text-muted-foreground">Total</dt>
            <dd className="text-right font-semibold">{formatMoney(total, currency)}</dd>
          </dl>
        </div>

        <div className="bg-card border border-border rounded-2xl shadow-sm p-6 mt-6">
          <h2 className="font-display text-lg font-semibold mb-4">Your Downloads</h2>
          {docs.length === 0 && itemsFromMeta.length === 0 ? (
            <p className="text-sm text-muted-foreground font-body">
              Your downloads are being prepared. Refresh in a moment or check your Dashboard.
            </p>
          ) : (
            <ul className="divide-y divide-border">
              {(docs.length > 0
                ? docs.map((d) => ({ key: d.id, name: d.file_name, url: d.file_url, sub: `${d.max_downloads - d.download_count} downloads remaining` }))
                : itemsFromMeta.map((it, i) => ({ key: String(i), name: it.title ?? "Download", url: it.file_url ?? null, sub: "Available in your Dashboard" }))
              ).map((row) => (
                <li key={row.key} className="py-3 flex items-center justify-between gap-4">
                  <div className="min-w-0">
                    <p className="text-sm font-medium truncate">{row.name}</p>
                    <p className="text-xs text-muted-foreground">{row.sub}</p>
                  </div>
                  {row.url ? (
                    <a
                      href={row.url}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 bg-secondary text-secondary-foreground text-xs font-semibold px-4 py-2 rounded-full hover:bg-secondary/90 transition-colors"
                    >
                      <Download className="h-3.5 w-3.5" /> Download
                    </a>
                  ) : (
                    <span className="text-xs text-muted-foreground">Pending</span>
                  )}
                </li>
              ))}
            </ul>
          )}
          <p className="text-xs text-muted-foreground mt-4 font-body">
            You can also find your downloads anytime in your{" "}
            <Link to="/dashboard" className="underline hover:text-foreground">Dashboard</Link>.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center mt-8">
          <Link to="/" className="inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-full text-sm font-semibold hover:bg-primary/90 transition-colors">
            Continue Shopping <ArrowRight className="h-4 w-4" />
          </Link>
          <Link to="/dashboard" className="inline-flex items-center justify-center border border-border px-6 py-3 rounded-full text-sm font-semibold hover:bg-muted transition-colors">
            Go to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmation;
