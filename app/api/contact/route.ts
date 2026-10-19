import { NextResponse } from "next/server";

export async function POST(request: Request) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  if (typeof body !== "object" || body === null || Array.isArray(body)) {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const { name, email, message } = body as Record<string, unknown>;
  if (
    typeof name !== "string" ||
    typeof email !== "string" ||
    typeof message !== "string"
  ) {
    return NextResponse.json(
      { error: "Please provide your name, email, and message." },
      { status: 400 },
    );
  }

  const trimmedName = name.trim();
  const trimmedEmail = email.trim();
  const trimmedMessage = message.trim();
  if (
    !trimmedName ||
    trimmedName.length > 100 ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail) ||
    trimmedEmail.length > 254 ||
    !trimmedMessage ||
    trimmedMessage.length > 5000
  ) {
    return NextResponse.json(
      { error: "Please check your details and try again." },
      { status: 400 },
    );
  }

  const apiKey = process.env.RESEND_API_KEY;
  const recipient = process.env.CONTACT_EMAIL;
  const sender = process.env.CONTACT_FROM;
  if (!apiKey || !recipient || !sender) {
    console.error(
      "Contact form is not configured. Set RESEND_API_KEY, CONTACT_EMAIL, and CONTACT_FROM.",
    );
    return NextResponse.json(
      { error: "The contact form is temporarily unavailable. Please try again later." },
      { status: 503 },
    );
  }

  let resendResponse: Response;
  try {
    resendResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: sender,
        to: [recipient],
        reply_to: trimmedEmail,
        subject: `New contact form message from ${trimmedName}`,
        text: `Name: ${trimmedName}\nEmail: ${trimmedEmail}\n\n${trimmedMessage}`,
      }),
    });
  } catch (error) {
    console.error("Unable to reach Resend while sending a contact message.", error);
    return NextResponse.json(
      { error: "We couldn't send your message right now. Please try again." },
      { status: 502 },
    );
  }

  if (!resendResponse.ok) {
    const details = await resendResponse.text();
    console.error(
      `Resend rejected a contact form message (${resendResponse.status}): ${details}`,
    );
    return NextResponse.json(
      { error: "We couldn't send your message right now. Please try again." },
      { status: 502 },
    );
  }

  return NextResponse.json({ success: true });
}
