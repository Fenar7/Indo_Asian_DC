import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@sanity/client";

const sanityClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: "2024-01-01",
  useCdn: false, // always fetch fresh password
});

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const { password } = await req.json();

    if (!password || typeof password !== "string") {
      return NextResponse.json({ error: "Password required" }, { status: 400 });
    }

    // Fetch password from Sanity (server-side only, never exposed to client)
    const doc = await sanityClient.fetch(
      `*[_type == "sitePassword"][0]{ password }`
    );

    if (!doc?.password) {
      return NextResponse.json(
        { error: "Site password not configured. Please set it in Sanity Studio." },
        { status: 500 }
      );
    }

    if (password !== doc.password) {
      return NextResponse.json({ error: "Incorrect password. Please try again." }, { status: 401 });
    }

    // Password correct — set secure httpOnly cookie
    const secret = process.env.SITE_AUTH_SECRET!;
    const res = NextResponse.json({ ok: true }, { status: 200 });

    res.cookies.set("site_auth", secret, {
      httpOnly: true,          // JS can never read it
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 30, // 30 days
    });

    return res;
  } catch (err) {
    console.error("[auth/login] Error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
