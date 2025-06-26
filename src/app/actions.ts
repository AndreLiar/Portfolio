'use server';

import { Resend } from 'resend';
import { z } from 'zod';

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  email: z.string().email("Please enter a valid email address."),
  message: z.string().min(10, "Message must be at least 10 characters."),
});


export async function sendEmail(values: z.infer<typeof formSchema>) {
    const validatedFields = formSchema.safeParse(values);
    if (!process.env.RESEND_API_KEY) {
        return { error: 'Resend API Key is not configured.' };
    }
    const resend = new Resend(process.env.RESEND_API_KEY);

    if (!validatedFields.success) {
      return { error: 'Invalid form data.' };
    }

    const { name, email, message } = validatedFields.data;

    try {
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
            return { error: data.error.message };
        }

        return { success: 'Email sent successfully!' };
    } catch (error) {
        console.error('Email sending error:', error);
        return { error: 'Something went wrong.' };
    }
}
