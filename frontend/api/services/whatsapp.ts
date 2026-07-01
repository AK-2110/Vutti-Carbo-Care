import twilio from 'twilio';

// Use environment variables in production, fallback to mock for development if not provided
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioNumber = process.env.TWILIO_WHATSAPP_NUMBER || 'whatsapp:+14155238886'; // Twilio sandbox number

const client = accountSid && authToken ? twilio(accountSid, authToken) : null;

export async function sendWhatsAppMessage(to: string, body: string) {
  // Format number for WhatsApp
  const formattedTo = to.startsWith('whatsapp:') ? to : `whatsapp:${to}`;
  
  if (client) {
    try {
      const message = await client.messages.create({
        body,
        from: twilioNumber,
        to: formattedTo
      });
      console.log(`WhatsApp message sent! SID: ${message.sid}`);
      return message;
    } catch (error) {
      console.error('Failed to send WhatsApp message:', error);
      throw error;
    }
  } else {
    // Mock service for development when credentials are not provided
    console.log('\n================ MOCK WHATSAPP MESSAGE ================');
    console.log(`TO: ${formattedTo}`);
    console.log(`BODY: ${body}`);
    console.log('=======================================================\n');
    return { status: 'mock_sent', to: formattedTo, body };
  }
}
