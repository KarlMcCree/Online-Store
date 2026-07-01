import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

type OrderRow = {
  id: string;
  total: number;
  status: string;
  created_at: string;
  metadata: Record<string, unknown> | null;
};

export default function AdminOverview() {
  const [orders, setOrders] = useState<OrderRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from("paystack_orders")
        .select("id,total,status,created_at,metadata")
        .order("created_at", { ascending: false })
        .limit(100);
      setOrders((data as OrderRow[]) ?? []);
      setLoading(false);
    })();
  }, []);

  const paid = orders.filter((o) => o.status === "paid");
  const revenue = paid.reduce((sum, o) => sum + Number(o.total ?? 0), 0);
  const recent = orders.slice(0, 8);

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader><CardTitle className="text-sm font-medium text-muted-foreground">Total orders</CardTitle></CardHeader>
          <CardContent><div className="text-3xl font-semibold">{loading ? "—" : orders.length}</div></CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle className="text-sm font-medium text-muted-foreground">Paid orders</CardTitle></CardHeader>
          <CardContent><div className="text-3xl font-semibold">{loading ? "—" : paid.length}</div></CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle className="text-sm font-medium text-muted-foreground">Revenue (paid)</CardTitle></CardHeader>
          <CardContent><div className="text-3xl font-semibold">₦{revenue.toLocaleString()}</div></CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader><CardTitle>Recent orders</CardTitle></CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Reference</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recent.map((o) => (
                <TableRow key={o.id}>
                  <TableCell className="font-mono text-xs">{o.id.slice(0, 8)}…</TableCell>
                  <TableCell>{(o.metadata as { email?: string } | null)?.email ?? "—"}</TableCell>
                  <TableCell>₦{Number(o.total).toLocaleString()}</TableCell>
                  <TableCell><span className="rounded-full bg-muted px-2 py-0.5 text-xs">{o.status}</span></TableCell>
                  <TableCell>{new Date(o.created_at).toLocaleDateString()}</TableCell>
                </TableRow>
              ))}
              {!loading && recent.length === 0 && (
                <TableRow><TableCell colSpan={5} className="text-center text-muted-foreground">No orders yet</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
