import { createClient } from "npm:@supabase/supabase-js@2";
import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";
import { z } from "npm:zod@3.23.8";

const PAYSTACK_SECRET_KEY = Deno.env.get("PAYSTACK_SECRET_KEY")!;
const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY")!;

const InitializeSchema = z.object({
  amount: z.number().positive(), // amount in major currency units (e.g. NGN/USD)
  email: z.string().email(),
  currency: z.string().optional(),
  metadata: z.record(z.unknown()).optional(),
});

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });

async function authenticate(req: Request) {
  const authHeader = req.headers.get("Authorization");
  if (!authHeader?.startsWith("Bearer ")) return null;
  const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    global: { headers: { Authorization: authHeader } },
  });
  const token = authHeader.replace("Bearer ", "");
  const { data, error } = await supabase.auth.getClaims(token);
  if (error || !data?.claims) return null;
  return data.claims;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  const url = new URL(req.url);
  // Path is /paystack or /paystack/initialize etc. — match last segment.
  const segments = url.pathname.split("/").filter(Boolean);
  const action = segments[segments.length - 1];

  try {
    const claims = await authenticate(req);
    if (!claims) return json({ error: "Unauthorized" }, 401);

    if (action === "initialize" && req.method === "POST") {
      const body = await req.json().catch(() => null);
      const parsed = InitializeSchema.safeParse(body);
      if (!parsed.success) {
        return json({ error: parsed.error.flatten().fieldErrors }, 400);
      }
      const { amount, email, currency, metadata } = parsed.data;

      const reference = `od_${claims.sub}_${Date.now()}_${crypto.randomUUID().slice(0, 8)}`;

      const res = await fetch("https://api.paystack.co/transaction/initialize", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          amount: Math.round(amount * 100), // convert to kobo/cents
          reference,
          currency: currency ?? "NGN",
          metadata: { ...(metadata ?? {}), user_id: claims.sub },
        }),
      });
      const data = await res.json();
      if (!data.status) {
        return json({ error: data.message ?? "Initialize failed" }, 502);
      }
      return json({
        authorization_url: data.data.authorization_url,
        access_code: data.data.access_code,
        reference: data.data.reference,
      });
    }

    if (action === "verify" && req.method === "GET") {
      const reference = url.searchParams.get("reference");
      if (!reference) return json({ error: "Missing reference" }, 400);

      const res = await fetch(
        `https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`,
        { headers: { Authorization: `Bearer ${PAYSTACK_SECRET_KEY}` } },
      );
      const data = await res.json();
      if (!data.status) {
        return json({ error: data.message ?? "Verify failed" }, 502);
      }
      return json({
        status: data.data.status, // "success" | "failed" | "abandoned"
        amount: data.data.amount / 100,
        currency: data.data.currency,
        reference: data.data.reference,
        paid_at: data.data.paid_at,
      });
    }

    return json({ error: "Not found" }, 404);
  } catch (err) {
    console.error("paystack function error", err);
    return json({ error: (err as Error).message }, 500);
  }
});
