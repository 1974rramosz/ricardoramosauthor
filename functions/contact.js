export async function onRequestPost(context) {
  const { request, env } = context;

  try {
    const body = await request.json();
    const { name, email, message } = body;

    if (!name || !email || !message) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const BREVO_API_KEY = env.BREVO_API_KEY;

    // Send notification email to Ricardo
    const res = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'content-type': 'application/json',
        'api-key': BREVO_API_KEY,
      },
      body: JSON.stringify({
        sender: { name: 'ricardoramosauthor.com', email: 'ricardo@ricardoramosauthor.com' },
        to: [{ email: 'ricardo@ricardoramosauthor.com', name: 'Ricardo Ramos' }],
        replyTo: { email: email, name: name },
        subject: `Speaking enquiry from ${name}`,
        htmlContent: `
<!DOCTYPE html>
<html>
<body style="font-family:Georgia,serif;background:#FAFAF6;padding:40px;">
  <table width="560" style="background:#fff;padding:40px;max-width:560px;">
    <tr>
      <td>
        <p style="font-size:11px;letter-spacing:0.15em;text-transform:uppercase;color:#8E412E;margin:0 0 24px;">Speaking Enquiry</p>
        <p style="font-size:16px;color:#1a1a1a;margin:0 0 8px;"><strong>From:</strong> ${name}</p>
        <p style="font-size:16px;color:#1a1a1a;margin:0 0 24px;"><strong>Email:</strong> <a href="mailto:${email}" style="color:#8E412E;">${email}</a></p>
        <hr style="border:none;border-top:1px solid #E6CEBC;margin:0 0 24px;">
        <p style="font-size:16px;color:#444;line-height:1.8;white-space:pre-wrap;">${message}</p>
      </td>
    </tr>
  </table>
</body>
</html>
        `,
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      console.error('Brevo contact email error:', err);
      return new Response(JSON.stringify({ error: 'Failed to send message' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (e) {
    console.error('contact function error:', e);
    return new Response(JSON.stringify({ error: 'Server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
