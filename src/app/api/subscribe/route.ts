import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const apiKey = process.env.CONVERTKIT_API_KEY;
  const formId = process.env.CONVERTKIT_FORM_ID;

  if (!apiKey || !formId) {
    return NextResponse.json({ error: "Email service not configured." }, { status: 503 });
  }

  let email: string | undefined;
  try {
    const body = await req.json();
    email = typeof body.email === "string" ? body.email.trim() : undefined;
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  if (!email || !email.includes("@")) {
    return NextResponse.json({ error: "A valid email address is required." }, { status: 400 });
  }

  try {
    const res = await fetch(
      `https://api.convertkit.com/v3/forms/${formId}/subscribe`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ api_key: apiKey, email }),
      }
    );

    if (!res.ok) {
      const text = await res.text();
      console.error("ConvertKit error:", res.status, text);
      return NextResponse.json({ error: "Could not subscribe. Please try again." }, { status: 502 });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Subscribe fetch failed:", err);
    return NextResponse.json({ error: "Network error. Please try again." }, { status: 502 });
  }
}
