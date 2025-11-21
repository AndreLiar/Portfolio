import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { z } from 'zod';

// Force Node.js runtime for Resend
export const runtime = 'nodejs';

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  email: z.string().email("Please enter a valid email address."),
  message: z.string().min(10, "Message must be at least 10 characters."),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    if (!process.env.RESEND_API_KEY) {
      return NextResponse.json(
        { error: 'Resend API Key is not configured.' },
        { status: 500 }
      );
    }

    const validatedFields = formSchema.safeParse(body);
    if (!validatedFields.success) {
      return NextResponse.json(
        { error: 'Invalid form data.', details: validatedFields.error.issues },
        { status: 400 }
      );
    }

    const { name, email, message } = validatedFields.data;
    const resend = new Resend(process.env.RESEND_API_KEY);

    const data = await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: 'kanmegneandre@gmail.com',
      subject: `New message from ${name} via portfolio`,
      reply_to: email,
      html: `
        <h1>New message from your portfolio</h1>
        <p><strong>From:</strong> ${name} (${email})</p>
        <p><strong>Message:</strong></p>
        <p>${message}</p>
      `,
    });

    if (data.error) {
      console.error('Resend Error:', data.error);
      return NextResponse.json(
        { error: data.error.message },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { success: 'Email sent successfully!' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Email sending error:', error);
    return NextResponse.json(
      { error: 'Something went wrong.' },
      { status: 500 }
    );
  }
}