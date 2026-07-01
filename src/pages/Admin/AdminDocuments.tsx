import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";

type Doc = {
  id: string;
  user_id: string;
  order_id: string | null;
  file_name: string;
  file_url: string;
  download_count: number;
  max_downloads: number;
  created_at: string;
};

export default function AdminDocuments() {
  const [docs, setDocs] = useState<Doc[]>([]);
  const [emails, setEmails] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [refillFor, setRefillFor] = useState<Doc | null>(null);
  const [extra, setExtra] = useState("5");

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("documents")
      .select("id,user_id,order_id,file_name,file_url,download_count,max_downloads,created_at")
      .order("created_at", { ascending: false });
    if (error) toast.error(error.message);
    const list = (data as Doc[]) ?? [];
    setDocs(list);

    // Lookup emails from paystack_orders.metadata (we can't read auth.users from client)
    const orderIds = Array.from(new Set(list.map((d) => d.order_id).filter(Boolean))) as string[];
    if (orderIds.length) {
      const { data: ords } = await supabase
        .from("paystack_orders")
        .select("id,metadata")
        .in("id", orderIds);
      const map: Record<string, string> = {};
      (ords ?? []).forEach((o: { id: string; metadata: { email?: string } | null }) => {
        if (o.metadata?.email) map[o.id] = o.metadata.email;
      });
      setEmails(map);
    }
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const submitRefill = async () => {
    if (!refillFor) return;
    const add = Number(extra);
    if (!Number.isFinite(add) || add <= 0) { toast.error("Enter a positive number"); return; }
    const newMax = refillFor.max_downloads + add;
    const { error } = await supabase
      .from("documents")
      .update({ max_downloads: newMax })
      .eq("id", refillFor.id);
    if (error) { toast.error(error.message); return; }
    toast.success(`Added ${add} downloads`);
    setDocs((curr) => curr.map((d) => (d.id === refillFor.id ? { ...d, max_downloads: newMax } : d)));
    setRefillFor(null);
    setExtra("5");
  };

  return (
    <Card>
      <CardHeader><CardTitle>Customer documents</CardTitle></CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>File</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Downloads</TableHead>
              <TableHead>Issued</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {docs.map((d) => (
              <TableRow key={d.id}>
                <TableCell className="font-medium">{d.file_name}</TableCell>
                <TableCell>{(d.order_id && emails[d.order_id]) || d.user_id.slice(0, 8) + "…"}</TableCell>
                <TableCell>{d.download_count} / {d.max_downloads}</TableCell>
                <TableCell>{new Date(d.created_at).toLocaleDateString()}</TableCell>
                <TableCell className="text-right">
                  <Button size="sm" variant="outline" onClick={() => { setRefillFor(d); setExtra("5"); }}>Refill</Button>
                </TableCell>
              </TableRow>
            ))}
            {!loading && docs.length === 0 && (
              <TableRow><TableCell colSpan={5} className="text-center text-muted-foreground">No documents yet</TableCell></TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>

      <Dialog open={!!refillFor} onOpenChange={(o) => !o && setRefillFor(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>Refill downloads</DialogTitle></DialogHeader>
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">{refillFor?.file_name}</p>
            <Label>How many extra downloads?</Label>
            <Input type="number" min={1} value={extra} onChange={(e) => setExtra(e.target.value)} />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRefillFor(null)}>Cancel</Button>
            <Button onClick={submitRefill}>Add downloads</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
