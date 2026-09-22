import { Resend } from 'resend';

const resendApiKey = process.env.RESEND_API_KEY;
const resend = resendApiKey ? new Resend(resendApiKey) : null;
const fromEmail = process.env.EMAIL_FROM || 'AgentBlazer Club <onboarding@resend.dev>';

export interface SendRegistrationEmailParams {
  to: string;
  name: string;
  eventName: string;
  eventDate: string;
  eventVenue: string;
}

export async function sendRegistrationEmail(params: SendRegistrationEmailParams): Promise<boolean> {
  const { to, name, eventName, eventDate, eventVenue } = params;

  if (!resend) {
    console.log(`📧 [Simulated Email] Sent registration confirmation to ${to} for "${eventName}"`);
    return true;
  }

  try {
    const data = await resend.emails.send({
      from: fromEmail,
      to,
      subject: `Registration Confirmed: ${eventName} - AgentBlazer Club`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; background: #0b0716; color: #ffffff; border-radius: 12px; border: 1px solid #7c3aed;">
          <h2 style="color: #a78bfa; margin-top: 0;">🎉 Registration Confirmed!</h2>
          <p>Hi <strong>${name}</strong>,</p>
          <p>You have successfully registered for <strong>${eventName}</strong> organized by the <strong>AgentBlazer Club</strong> (Department of CSE, SJEC).</p>
          
          <div style="background: rgba(124, 58, 237, 0.15); border: 1px solid #7c3aed; padding: 16px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 4px 0;"><strong>📅 Date:</strong> ${eventDate}</p>
            <p style="margin: 4px 0;"><strong>📍 Venue:</strong> ${eventVenue}</p>
          </div>

          <p>Please make sure to arrive 15 minutes before the session starts.</p>
          <p style="color: #9ca3af; font-size: 13px; margin-top: 24px;">See you at the symposium!<br/>— Team AgentBlazer</p>
        </div>
      `,
    });

    return Boolean(data.data?.id);
  } catch (err) {
    console.error('❌ Failed to send registration email:', err);
    return false;
  }
}
