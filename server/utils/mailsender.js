import { BrevoClient } from '@getbrevo/brevo';

const brevo = new BrevoClient({
  apiKey: process.env.BREVO_API_KEY,
});

const mailsender = async (email, title, body) => {
  try {
    const result = await brevo.transactionalEmails.sendTransacEmail({
      subject: title,
      htmlContent: body,
      sender: { name: 'codevolveX', email: process.env.MAIL_USER },
      to: [{ email: email }],
    });
    console.log('Email sent. Message ID:', result.messageId);
    return result;
  } catch (error) {
    console.log('Brevo Error', error.message);
    return null;
  }
}
export default mailsender;