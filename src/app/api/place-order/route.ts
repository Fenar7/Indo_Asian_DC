import { NextRequest, NextResponse } from "next/server";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { createClient } from "@sanity/client";

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

// ─── PDF Generator ───────────────────────────────────────────────────────────

function generateOrderPdf(
  orderCode: string,
  customer: { name: string; businessName: string; address1: string; address2: string; zip: string; notes: string },
  items: Array<{ name: string; code: string; quantity: number; price?: string }>,
  total: number
): Buffer {
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  const pageW = doc.internal.pageSize.getWidth();
  const margin = 14;
  let y = 20;

  // Brand colour
  const brandRed = [230, 51, 42] as [number, number, number];
  const darkGrey = [33, 33, 33] as [number, number, number];
  const lightGrey = [245, 245, 245] as [number, number, number];

  // ── Header ──
  doc.setFillColor(...brandRed);
  doc.rect(0, 0, pageW, 18, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.text("INDO ASIAN FOODS LTD", margin, 12);

  doc.setTextColor(...darkGrey);
  doc.setFontSize(11);
  doc.setFont("helvetica", "normal");
  doc.text("Premium Indian Groceries & Spices", margin, 24);

  // Order info box
  y = 32;
  doc.setFillColor(...lightGrey);
  doc.roundedRect(margin, y, pageW - margin * 2, 22, 2, 2, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.setTextColor(...brandRed);
  doc.text("ORDER INVOICE", margin + 4, y + 8);
  doc.setTextColor(...darkGrey);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.text(`Order Code: ${orderCode}`, margin + 4, y + 15);
  doc.text(`Date: ${new Date().toLocaleDateString("en-IN")}`, margin + 80, y + 15);

  // ── Customer Details ──
  y = 60;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(...brandRed);
  doc.text("CUSTOMER DETAILS", margin, y);
  doc.setDrawColor(...brandRed);
  doc.line(margin, y + 2, margin + 50, y + 2);

  y += 8;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(...darkGrey);
  doc.text(`Name: ${customer.name}`, margin, y);
  y += 6;
  if (customer.businessName) {
    doc.text(`Business: ${customer.businessName}`, margin, y);
    y += 6;
  }
  doc.text(`Address: ${customer.address1}`, margin, y);
  y += 6;
  if (customer.address2) {
    doc.text(`          ${customer.address2}`, margin, y);
    y += 6;
  }
  if (customer.zip) {
    doc.text(`Zip Code: ${customer.zip}`, margin, y);
    y += 6;
  }
  if (customer.notes) {
    doc.text(`Notes: ${customer.notes}`, margin, y);
    y += 6;
  }

  // ── Product Table ──
  y += 4;
  const tableBody = items.map((item, i) => {
    const priceNum = parseFloat((item.price ?? "0").replace(/[^\d.]/g, ""));
    const lineTotal = isNaN(priceNum) ? "—" : formatINR(priceNum * item.quantity);
    const unitPrice = isNaN(priceNum) ? "—" : formatINR(priceNum);
    return [
      String(i + 1),
      item.name,
      item.code,
      String(item.quantity),
      unitPrice,
      lineTotal,
    ];
  });

  autoTable(doc, {
    startY: y,
    head: [["#", "Product", "Code", "Qty", "Unit Price", "Total"]],
    body: tableBody,
    theme: "grid",
    headStyles: {
      fillColor: brandRed,
      textColor: [255, 255, 255],
      fontStyle: "bold",
      fontSize: 10,
    },
    bodyStyles: {
      fontSize: 9,
      textColor: darkGrey,
    },
    alternateRowStyles: {
      fillColor: lightGrey,
    },
    columnStyles: {
      0: { cellWidth: 10, halign: "center" },
      1: { cellWidth: "auto" },
      2: { cellWidth: 28, halign: "center" },
      3: { cellWidth: 18, halign: "center" },
      4: { cellWidth: 32, halign: "right" },
      5: { cellWidth: 32, halign: "right" },
    },
    margin: { left: margin, right: margin },
    styles: {
      overflow: "linebreak",
      cellPadding: 2,
    },
  });

  // ── Totals ──
  const finalY = (doc as any).lastAutoTable?.finalY ?? y + 40;
  y = finalY + 10;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(...darkGrey);
  doc.text(`Subtotal`, pageW - margin - 60, y, { align: "right" });
  doc.text(formatINR(total), pageW - margin, y, { align: "right" });
  y += 7;
  doc.text(`Shipping`, pageW - margin - 60, y, { align: "right" });
  doc.text("FREE", pageW - margin, y, { align: "right" });

  y += 10;
  doc.setFillColor(...lightGrey);
  doc.roundedRect(pageW - margin - 90, y - 6, 90, 14, 2, 2, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.setTextColor(...brandRed);
  doc.text(`Grand Total`, pageW - margin - 85, y + 3);
  doc.text(formatINR(total), pageW - margin, y + 3, { align: "right" });

  // ── Footer ──
  const footerY = doc.internal.pageSize.getHeight() - 18;
  doc.setFillColor(...brandRed);
  doc.rect(0, footerY, pageW, 18, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.text("Thank you for your order! We will contact you shortly on WhatsApp.", margin, footerY + 6);
  doc.text("Indo Asian Foods Ltd | indoasianfoods.com | +91 75588 95355", margin, footerY + 12);

  return Buffer.from(doc.output("arraybuffer"));
}

// ─── Sanity Upload ───────────────────────────────────────────────────────────

async function uploadPdfToSanity(pdfBuffer: Buffer, orderCode: string): Promise<string> {
  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
  const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
  const token = process.env.NEXT_PUBLIC_SANITY_EDIT_TOKEN;

  if (!projectId || !token) {
    throw new Error("Sanity credentials not configured");
  }

  const client = createClient({
    projectId,
    dataset,
    token,
    apiVersion: "2024-04-01",
    useCdn: false,
  });

  const timestamp = Date.now();
  const filename = `invoice-${orderCode}-${timestamp}.pdf`;

  const asset = await client.assets.upload("file", pdfBuffer as unknown as Blob, {
    filename,
    contentType: "application/pdf",
  });

  console.log("[place-order] PDF uploaded to Sanity:", asset.url);
  return asset.url;
}

// ─── Green API senders ───────────────────────────────────────────────────────

async function sendPdfViaGreenApi(pdfBuffer: Buffer, orderCode: string, customerName: string): Promise<boolean> {
  const instanceId = process.env.GREEN_API_INSTANCE_ID;
  const token = process.env.GREEN_API_TOKEN;
  const ownerPhone = "917558895355";

  if (!instanceId || !token) {
    console.warn("[place-order] GREEN_API credentials not set — skipping PDF WhatsApp send.");
    return false;
  }

  const url = `https://api.green-api.com/waInstance${instanceId}/sendFileByUpload/${token}`;

  const form = new FormData();
  form.append("chatId", `${ownerPhone}@c.us`);
  form.append("caption", `New Order: ${orderCode} from ${customerName}`);
  form.append("file", new Blob([new Uint8Array(pdfBuffer)], { type: "application/pdf" }), `invoice-${orderCode}.pdf`);

  try {
    const res = await fetch(url, {
      method: "POST",
      body: form,
      cache: "no-store",
    });

    if (!res.ok) {
      const body = await res.text();
      console.error("[place-order] Green API file upload error:", res.status, body);
      return false;
    }

    console.log("[place-order] ✅ PDF sent successfully via Green API");
    return true;
  } catch (e) {
    console.error("[place-order] Green API file upload exception:", e);
    return false;
  }
}

async function sendViaGreenApi(message: string): Promise<void> {
  const instanceId = process.env.GREEN_API_INSTANCE_ID;
  const token = process.env.GREEN_API_TOKEN;
  const ownerPhone = "917558895355";

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
    console.log("[place-order] ✅ WhatsApp text sent successfully via Green API");
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
    if (!items?.length)              return NextResponse.json({ error: "Cart is empty" },        { status: 400 });

    const orderCode = generateOrderCode();
    const message = buildMessage(orderCode, customer, items, total);

    console.log(`\n📦 Order ${orderCode} | ${customer.name} | Rs.${total}`);

    // 1. Generate PDF
    const pdfBuffer = generateOrderPdf(orderCode, customer, items, total);

    // 2. Upload PDF to Sanity (always)
    let pdfUrl: string | null = null;
    try {
      pdfUrl = await uploadPdfToSanity(pdfBuffer, orderCode);
    } catch (e) {
      console.error("[place-order] Sanity PDF upload failed:", e);
    }

    // 3. Try sending PDF via Green API
    let pdfSent = false;
    try {
      pdfSent = await sendPdfViaGreenApi(pdfBuffer, orderCode, customer.name);
    } catch (e) {
      console.error("[place-order] Green API PDF send failed:", e);
    }

    // 4. Fallback: send text message if PDF failed
    if (!pdfSent) {
      sendViaGreenApi(message).catch((e) => console.error("[place-order] WhatsApp text error:", e));
    }

    // 5. Return response
    const response: { orderCode: string; pdfUrl?: string; message?: string } = { orderCode };
    if (pdfUrl) response.pdfUrl = pdfUrl;
    if (!pdfSent) response.message = message;

    return NextResponse.json(response, { status: 200 });
  } catch (err) {
    console.error("[place-order] Unexpected error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
