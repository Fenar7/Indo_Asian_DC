import { NextRequest, NextResponse } from "next/server";

// ─── Helpers ─────────────────────────────────────────────────────────────────

function generateOrderCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";
  for (let i = 0; i < 6; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  const now = new Date();
  const date = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, "0")}${String(now.getDate()).padStart(2, "0")}`;
  return `IAF-${date}-${code}`;
}

function formatINR(n: number): string {
  return `Rs. ${n.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function buildMessage(
  orderCode: string,
  customer: { name: string; businessName: string; address1: string; address2: string; zip: string; notes: string },
  items: Array<{ name: string; code: string; quantity: number; price?: string }>,
  total: number
): string {
  const lines: string[] = [];
  lines.push(`🛒 *New Order — ${orderCode}*`);
  lines.push("");
  lines.push("👤 *Customer Details*");
  lines.push(`Name: ${customer.name}`);
  if (customer.businessName) lines.push(`Business: ${customer.businessName}`);
  lines.push("");
  lines.push("📦 *Order Items*");
  items.forEach((item, i) => {
    const priceNum = parseFloat((item.price ?? "0").replace(/[^\d.]/g, ""));
    const lineTotal = isNaN(priceNum) ? "" : ` — Rs.${(priceNum * item.quantity).toLocaleString("en-IN")}`;
    lines.push(`${i + 1}. ${item.name} (${item.code}) × ${item.quantity}${lineTotal}`);
  });
  lines.push("");
  lines.push(`💰 *Total: ${formatINR(total)}*`);
  lines.push("");
  lines.push("📍 *Shipping Address*");
  lines.push(customer.address1);
  if (customer.address2) lines.push(customer.address2);
  if (customer.zip) lines.push(`Zip: ${customer.zip}`);
  if (customer.notes) {
    lines.push("");
    lines.push(`📝 *Notes:* ${customer.notes}`);
  }
  return lines.join("\n");
}

// ─── Green API sender ────────────────────────────────────────────────────────

async function sendViaGreenApi(message: string): Promise<void> {
  const instanceId = process.env.GREEN_API_INSTANCE_ID;
  const token = process.env.GREEN_API_TOKEN;
  const ownerPhone = "917558895355"; // without +

  if (!instanceId || !token) {
    console.warn("[place-order] GREEN_API credentials not set — skipping WhatsApp send.");
    return;
  }

  const url = `https://api.green-api.com/waInstance${instanceId}/sendMessage/${token}`;

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chatId: `${ownerPhone}@c.us`,
      message,
    }),
    cache: "no-store",
  });

  if (!res.ok) {
    const body = await res.text();
    console.error("[place-order] Green API error:", res.status, body);
  } else {
    console.log("[place-order] ✅ WhatsApp sent successfully via Green API");
  }
}

// ─── POST /api/place-order ───────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { customer, items, total } = body as {
      customer: { name: string; businessName: string; address1: string; address2: string; zip: string; notes: string };
      items: Array<{ name: string; code: string; quantity: number; price?: string }>;
      total: number;
    };

    // Server-side validation
    if (!customer?.name?.trim())    return NextResponse.json({ error: "Name is required" },    { status: 400 });
    if (!customer?.address1?.trim()) return NextResponse.json({ error: "Address is required" }, { status: 400 });
    if (!items?.length)              return NextResponse.json({ error: "Cart is empty" },        { status: 400 });

    const orderCode = generateOrderCode();
    const message = buildMessage(orderCode, customer, items, total);

    // Log + send WhatsApp in background (don't await on the order response)
    console.log(`\n📦 Order ${orderCode} | ${customer.name} | Rs.${total}`);
    sendViaGreenApi(message).catch((e) => console.error("[place-order] WhatsApp error:", e));

    return NextResponse.json({ orderCode, message }, { status: 200 });
  } catch (err) {
    console.error("[place-order] Unexpected error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
