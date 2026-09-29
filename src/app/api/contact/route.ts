import { NextResponse } from "next/server";

// Contact form → Resend. The API key lives only in RESEND_API_KEY (server env),
// never in the client bundle. Node runtime (default) — no edge.
const CONTACT_TO = "kanmegneandre@gmail.com";
// Free Resend tier (no verified domain) must send from onboarding@resend.dev.
// Once devandre.sbs is verified in Resend, switch this to e.g. contact@devandre.sbs.
const CONTACT_FROM = "Portfolio <onboarding@resend.dev>";

const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => null);
    if (!body) {
      return NextResponse.json({ success: false, message: "Invalid request." }, { status: 400 });
    }

    const { name, email, message, botcheck } = body as {
      name?: unknown;
      email?: unknown;
      message?: unknown;
      botcheck?: unknown;
    };

    // Honeypot — a bot filled the hidden field. Pretend success, send nothing.
    if (botcheck) return NextResponse.json({ success: true });

    if (
      typeof name !== "string" ||
      typeof email !== "string" ||
      typeof message !== "string" ||
      name.trim().length < 2 ||
      message.trim().length < 10 ||
      !EMAIL_RE.test(email)
    ) {
      return NextResponse.json({ success: false, message: "Please check your inputs." }, { status: 400 });
    }

    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ success: false, message: "Email service not configured." }, { status: 500 });
    }

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: CONTACT_FROM,
        to: [CONTACT_TO],
        reply_to: email,
        subject: `Portfolio contact from ${name}`,
        text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
      }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      console.error("Resend error:", err);
      return NextResponse.json(
        { success: false, message: (err as { message?: string })?.message || "Could not send message." },
        { status: 502 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (e) {
    console.error("contact route error:", e);
    return NextResponse.json({ success: false, message: "Server error." }, { status: 500 });
  }
}
