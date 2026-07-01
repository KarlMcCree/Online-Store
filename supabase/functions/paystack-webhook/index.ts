// Paystack webhook — verifies signature with PAYSTACK_SECRET_KEY and
// idempotently marks paystack_orders rows as "paid" on charge.success.
//
// IMPORTANT: this function must be public (no JWT). Paystack will not send a
// Supabase access token. The supabase/config.toml entry below sets verify_jwt = false.

import { createClient } from "npm:@supabase/supabase-js@2";
import { createHmac } from "node:crypto";

const PAYSTACK_SECRET_KEY = Deno.env.get("PAYSTACK_SECRET_KEY")!;
const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

const admin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false },
});

Deno.serve(async (req) => {
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  const signature = req.headers.get("x-paystack-signature");
  const rawBody = await req.text();

  if (!signature) {
    return new Response(JSON.stringify({ error: "Missing signature" }), { status: 401 });
  }

  const expected = createHmac("sha512", PAYSTACK_SECRET_KEY).update(rawBody).digest("hex");
  if (expected !== signature) {
    console.warn("paystack-webhook: invalid signature");
    return new Response(JSON.stringify({ error: "Invalid signature" }), { status: 401 });
  }

  let event: { event?: string; data?: { reference?: string; amount?: number; metadata?: Record<string, unknown> } };
  try {
    event = JSON.parse(rawBody);
  } catch {
    return new Response(JSON.stringify({ error: "Invalid JSON" }), { status: 400 });
  }

  // Always respond 200 quickly so Paystack doesn't retry storms.
  // Handle known events; ignore the rest.
  if (event.event !== "charge.success") {
    return new Response(JSON.stringify({ received: true, ignored: event.event }), { status: 200 });
  }

  const reference = event.data?.reference;
  if (!reference) {
    return new Response(JSON.stringify({ error: "Missing reference" }), { status: 400 });
  }

  try {
    // Idempotency: fetch the order first
    const { data: order, error: fetchErr } = await admin
      .from("paystack_orders")
      .select("id, user_id, status, metadata")
      .eq("paystack_reference", reference)
      .maybeSingle();

    if (fetchErr) {
      console.error("paystack-webhook: fetch error", fetchErr);
      return new Response(JSON.stringify({ error: "DB error" }), { status: 500 });
    }

    if (!order) {
      // Order row may not exist yet if the frontend insert hasn't completed.
      // Acknowledge so Paystack stops retrying; the client-side verify path will reconcile.
      console.warn("paystack-webhook: no order for reference", reference);
      return new Response(JSON.stringify({ received: true, note: "order not found" }), { status: 200 });
    }

    if (order.status === "paid") {
      return new Response(JSON.stringify({ received: true, idempotent: true }), { status: 200 });
    }

    const { error: updateErr } = await admin
      .from("paystack_orders")
      .update({ status: "paid" })
      .eq("id", order.id)
      .eq("status", "pending"); // guard against concurrent updates

    if (updateErr) {
      console.error("paystack-webhook: update error", updateErr);
      return new Response(JSON.stringify({ error: "Update failed" }), { status: 500 });
    }

    // Create download entitlements from order metadata
    type CartItem = {
      id?: string | number;
      product_id?: string | null;
      title?: string;
      file_name?: string;
      file_url?: string | null;
      qty?: number;
      max_downloads?: number;
    };
    const items = (order.metadata as { items?: CartItem[] })?.items ?? [];
    const isUuid = (v: unknown): v is string =>
      typeof v === "string" && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(v);

    if (items.length > 0) {
      const rows = items.map((item) => {
        const productId = isUuid(item.product_id) ? item.product_id : isUuid(item.id) ? String(item.id) : null;
        return {
          user_id: order.user_id,
          order_id: order.id,
          product_id: productId,
          file_name: item.file_name ?? item.title ?? "Download",
          file_url: item.file_url ?? "",
          max_downloads: item.max_downloads ?? 5,
        };
      });
      const { error: docsErr } = await admin.from("documents").insert(rows);
      if (docsErr) {
        console.error("paystack-webhook: documents insert error", docsErr);
        // Don't fail the webhook — order is paid; entitlement can be reconciled.
      }
    }

    // Fire-and-forget: send order confirmation email
    try {
      const meta = (order.metadata ?? {}) as { email?: string; customer_email?: string; total?: number; currency?: string };
      const toEmail = meta.email ?? meta.customer_email ?? null;
      if (toEmail) {
        const totalKobo = event.data?.amount ?? 0;
        const total = meta.total ?? totalKobo / 100;
        await fetch(`${SUPABASE_URL}/functions/v1/send-order-email`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
          },
          body: JSON.stringify({
            to_email: toEmail,
            order_id: order.id,
            total,
            currency: meta.currency ?? "NGN",
            items,
          }),
        });
      } else {
        console.warn("paystack-webhook: no email in order metadata, skipping email");
      }
    } catch (emailErr) {
      console.error("paystack-webhook: email send error", emailErr);
    }



    return new Response(JSON.stringify({ received: true, updated: true }), { status: 200 });
  } catch (err) {
    console.error("paystack-webhook: unexpected error", err);
    return new Response(JSON.stringify({ error: (err as Error).message }), { status: 500 });
  }
});
