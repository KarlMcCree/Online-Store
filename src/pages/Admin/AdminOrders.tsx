import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

type Order = {
  id: string;
  user_id: string | null;
  total: number;
  paystack_reference: string;
  status: string;
  metadata: Record<string, unknown> | null;
  created_at: string;
};

const STATUSES = ["pending", "paid", "delivered", "failed"] as const;

export default function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<string>("all");

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("paystack_orders")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) toast.error(error.message);
    setOrders((data as Order[]) ?? []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return orders.filter((o) => {
      if (filter !== "all" && o.status !== filter) return false;
      if (!q) return true;
      const email = ((o.metadata as { email?: string } | null)?.email ?? "").toLowerCase();
      return (
        o.paystack_reference.toLowerCase().includes(q) ||
        o.id.toLowerCase().includes(q) ||
        email.includes(q)
      );
    });
  }, [orders, search, filter]);

  const updateStatus = async (id: string, status: string) => {
    const prev = orders;
    setOrders((curr) => curr.map((o) => (o.id === id ? { ...o, status } : o)));
    const { error } = await supabase.from("paystack_orders").update({ status }).eq("id", id);
    if (error) {
      setOrders(prev);
      toast.error(error.message);
    } else {
      toast.success("Order updated");
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Orders</CardTitle>
        <div className="flex flex-col gap-2 pt-3 sm:flex-row">
          <Input placeholder="Search by reference, ID, or email…" value={search} onChange={(e) => setSearch(e.target.value)} className="sm:max-w-sm" />
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="sm:w-40"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All statuses</SelectItem>
              {STATUSES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
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
            {filtered.map((o) => (
              <TableRow key={o.id}>
                <TableCell className="font-mono text-xs">{o.paystack_reference}</TableCell>
                <TableCell>{(o.metadata as { email?: string } | null)?.email ?? "—"}</TableCell>
                <TableCell>₦{Number(o.total).toLocaleString()}</TableCell>
                <TableCell>
                  <Select value={o.status} onValueChange={(v) => updateStatus(o.id, v)}>
                    <SelectTrigger className="h-8 w-32"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {STATUSES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell>{new Date(o.created_at).toLocaleString()}</TableCell>
              </TableRow>
            ))}
            {!loading && filtered.length === 0 && (
              <TableRow><TableCell colSpan={5} className="text-center text-muted-foreground">No matching orders</TableCell></TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
