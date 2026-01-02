import { resend } from "@/lib/resend";

interface SendEventRegistrationEmailProps {
  email: string;
  name: string;
  eventTitle: string;
  eventDate: Date;
  eventLocation?: string;
  ticketId: string;
}

export async function sendEventRegistrationEmail({
  email,
  name,
  eventTitle,
  eventDate,
  eventLocation,
  ticketId,
}: SendEventRegistrationEmailProps) {
  try {
    const formattedDate = new Intl.DateTimeFormat('en-IN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(eventDate));

    const ticketLink = `${process.env.NEXTAUTH_URL}/profile`; // Directing to profile to view tickets

    const { data, error } = await resend.emails.send({
      from: 'GrowthYari <orders@growthyari.com>', // Using 'orders' or similar for transactional
      to: email,
      subject: `Ticket Confirmation: ${eventTitle}`,
      html: `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; border: 1px solid #e2e8f0;">
            <!-- Header -->
            <div style="background-color: #059669; padding: 24px; text-align: center;">
                <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 600;">Booking Confirmed!</h1>
            </div>

            <!-- Content -->
            <div style="padding: 32px 24px;">
                <p style="color: #334155; font-size: 16px; line-height: 1.5; margin-bottom: 24px;">
                    Hi <strong>${name}</strong>,
                </p>
                <p style="color: #334155; font-size: 16px; line-height: 1.5; margin-bottom: 24px;">
                    Thank you for registering for <strong>${eventTitle}</strong>. We are excited to have you join us!
                </p>

                <!-- Event Details Card -->
                <div style="background-color: #f8fafc; border-radius: 8px; padding: 20px; border: 1px solid #e2e8f0; margin-bottom: 24px;">
                    <h2 style="color: #0f172a; font-size: 18px; margin: 0 0 16px 0;">Event Details</h2>
                    
                    <div style="margin-bottom: 12px;">
                        <p style="color: #64748b; font-size: 14px; margin: 0 0 4px 0;">Date & Time</p>
                        <p style="color: #334155; font-size: 16px; font-weight: 500; margin: 0;">${formattedDate}</p>
                    </div>

                    ${eventLocation ? `
                    <div style="margin-bottom: 12px;">
                        <p style="color: #64748b; font-size: 14px; margin: 0 0 4px 0;">Location</p>
                        <p style="color: #334155; font-size: 16px; font-weight: 500; margin: 0;">${eventLocation}</p>
                    </div>
                    ` : ''}
                    
                    <div>
                         <p style="color: #64748b; font-size: 14px; margin: 0 0 4px 0;">Ticket ID</p>
                         <p style="color: #334155; font-size: 14px; font-family: monospace; background: #e2e8f0; display: inline-block; padding: 2px 6px; rounded: 4px; margin: 0;">${ticketId}</p>
                    </div>
                </div>

                <!-- CTA Button -->
                <div style="text-align: center; margin-bottom: 32px;">
                    <a href="${ticketLink}" style="display: inline-block; background-color: #059669; color: #ffffff; padding: 14px 32px; border-radius: 6px; text-decoration: none; font-weight: 600; font-size: 16px;">
                        View Your Ticket
                    </a>
                </div>

                <p style="color: #64748b; font-size: 14px; line-height: 1.5; text-align: center;">
                    Please present your ticket QR code at the venue entrance.
                </p>
            </div>

            <!-- Footer -->
            <div style="background-color: #f1f5f9; padding: 24px; text-align: center; border-top: 1px solid #e2e8f0;">
                <p style="color: #94a3b8; font-size: 12px; margin: 0;">
                    © ${new Date().getFullYear()} GrowthYari. All rights reserved.
                </p>
            </div>
        </div>
      `,
    });

    if (error) {
      console.error("Failed to send event registration email:", error);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (error) {
    console.error("Error sending event registration email:", error);
    return { success: false, error };
  }
}
