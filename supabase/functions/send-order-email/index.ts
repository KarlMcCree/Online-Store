// Send order confirmation email via Resend (through Lovable connector gateway).
// Public endpoint — called server-to-server from the paystack-webhook function.

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const GATEWAY_URL = "https://connector-gateway.lovable.dev/resend";
const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

type Item = {
  product_name?: string;
  title?: string;
  file_url?: string | null;
  file_name?: string | null;
  max_downloads?: number;
};

type Payload = {
  to_email: string;
  order_id: string;
  total: number;
  currency?: string;
  items: Item[];
};

function renderHtml(p: Payload): string {
  const currency = p.currency ?? "NGN";
  const fmt = (n: number) =>
    new Intl.NumberFormat("en-NG", { style: "currency", currency }).format(n);

  const rows = p.items
    .map((it) => {
      const name = it.product_name ?? it.title ?? it.file_name ?? "Download";
      const link = it.file_url
        ? `<a href="${it.file_url}" style="color:#b8860b;text-decoration:none;font-weight:600">Download file</a>`
        : `<span style="color:#888">Available in your dashboard</span>`;
      const limit = it.max_downloads ?? 5;
      return `
        <tr>
          <td style="padding:14px 0;border-bottom:1px solid #eee;color:#0b1d3a;font-family:Georgia,serif;font-size:16px">${name}</td>
          <td style="padding:14px 0;border-bottom:1px solid #eee;text-align:right">${link}<div style="font-size:12px;color:#666;margin-top:4px">Limit: ${limit} downloads</div></td>
        </tr>`;
    })
    .join("");

  return `<!doctype html>
<html><body style="margin:0;background:#f6f5f1;font-family:Helvetica,Arial,sans-serif;color:#0b1d3a">
  <table width="100%" cellpadding="0" cellspacing="0" style="padding:32px 0">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 4px 24px rgba(11,29,58,0.08)">
        <tr><td style="background:#0b1d3a;padding:28px 32px;color:#fff">
          <div style="font-family:Georgia,serif;font-size:24px;letter-spacing:.5px">Online Dynamics & BSB</div>
          <div style="opacity:.8;font-size:13px;margin-top:4px">Order confirmation</div>
        </td></tr>
        <tr><td style="padding:32px">
          <h1 style="font-family:Georgia,serif;font-size:22px;margin:0 0 8px;color:#0b1d3a">Thank you for your purchase</h1>
          <p style="margin:0 0 20px;color:#555;font-size:15px;line-height:1.5">
            Your payment was received and your downloads are ready below. You can also access them anytime from your dashboard.
          </p>
          <div style="background:#faf7ef;border:1px solid #efe6cf;border-radius:8px;padding:16px 18px;margin-bottom:24px">
            <div style="font-size:13px;color:#7a6a3a">Order reference</div>
            <div style="font-family:monospace;font-size:14px;color:#0b1d3a;margin-top:2px">${p.order_id}</div>
            <div style="font-size:13px;color:#7a6a3a;margin-top:10px">Total paid</div>
            <div style="font-size:18px;font-weight:700;color:#b8860b;margin-top:2px">${fmt(p.total)}</div>
          </div>
          <h2 style="font-family:Georgia,serif;font-size:17px;margin:0 0 8px">Your downloads</h2>
          <table width="100%" cellpadding="0" cellspacing="0">${rows}</table>
          <div style="margin-top:24px;padding:14px 16px;background:#f0f4fb;border-left:3px solid #0b1d3a;border-radius:4px;font-size:13px;color:#0b1d3a;line-height:1.5">
            <strong>A note on downloads:</strong> each file has a download limit (default 5). If you reach it, head to your dashboard and request a refill — we'll top you up.
          </div>
          <p style="margin:28px 0 0;font-size:13px;color:#888">Questions? Just reply to this email.</p>
        </td></tr>
        <tr><td style="padding:18px 32px;background:#faf7ef;color:#7a6a3a;font-size:12px;text-align:center">
          © ${new Date().getFullYear()} Online Dynamics & BSB
        </td></tr>
      </table>
    </td></tr>
  </table>
</body></html>`;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405, headers: corsHeaders });
  }

  if (!LOVABLE_API_KEY || !RESEND_API_KEY) {
    return new Response(JSON.stringify({ error: "Email service not configured" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  let body: Payload;
  try {
    body = await req.json();
  } catch {
    return new Response(JSON.stringify({ error: "Invalid JSON" }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  if (!body.to_email || !body.order_id || !Array.isArray(body.items)) {
    return new Response(JSON.stringify({ error: "Missing required fields" }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const html = renderHtml(body);

  const resp = await fetch(`${GATEWAY_URL}/emails`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${LOVABLE_API_KEY}`,
      "X-Connection-Api-Key": RESEND_API_KEY,
    },
    body: JSON.stringify({
      from: "Online Dynamics & BSB <onboarding@resend.dev>",
      to: [body.to_email],
      subject: `Your order is ready — ${body.order_id.slice(0, 8)}`,
      html,
    }),
  });

  const data = await resp.json().catch(() => ({}));
  if (!resp.ok) {
    console.error("send-order-email: resend error", resp.status, data);
    return new Response(JSON.stringify({ error: "Send failed", details: data }), {
      status: 502,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  return new Response(JSON.stringify({ sent: true, id: data?.id }), {
    status: 200,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
});
