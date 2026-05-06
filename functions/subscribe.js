export async function onRequestPost(context) {
  const { request, env } = context;

  try {
    const body = await request.json();
    const { name, email, country, relationship } = body;

    if (!name || !email || !country || !relationship) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const BREVO_API_KEY = env.BREVO_API_KEY;
    const CHAPTER1_FILE_ID = '1q3t4Agrkcgt95qpIBNNinN-LHxq9_3j3';

    // 1. Create or update contact in Brevo list 3
    const contactRes = await fetch('https://api.brevo.com/v3/contacts', {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'content-type': 'application/json',
        'api-key': BREVO_API_KEY,
      },
      body: JSON.stringify({
        email: email,
        attributes: {
          FIRSTNAME: name,
          COUNTRY: country,
          RELATIONSHIP: relationship,
        },
        listIds: [3],
        updateEnabled: true,
      }),
    });

    if (!contactRes.ok && contactRes.status !== 204) {
      const err = await contactRes.text();
      console.error('Brevo contact error:', err);
      return new Response(JSON.stringify({ error: 'Failed to create contact' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // 2. Send Chapter 1 delivery email via Brevo transactional
    const chapterUrl = `https://drive.google.com/file/d/${CHAPTER1_FILE_ID}/view`;

    const emailRes = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'content-type': 'application/json',
        'api-key': BREVO_API_KEY,
      },
      body: JSON.stringify({
        sender: { name: 'Ricardo Ramos', email: 'ricardo@ricardoramosauthor.com' },
        to: [{ email: email, name: name }],
        subject: 'Chapter 1 — God Makes No Mistakes',
        htmlContent: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0;padding:0;background:#FAFAF6;font-family:Georgia,serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#FAFAF6;">
    <tr>
      <td align="center" style="padding:48px 24px;">
        <table width="560" cellpadding="0" cellspacing="0" style="background:#fff;max-width:560px;width:100%;">

          <!-- Header -->
          <tr>
            <td style="background:#1A1008;padding:32px 40px;">
              <p style="margin:0;font-family:Georgia,serif;font-size:11px;letter-spacing:0.15em;text-transform:uppercase;color:#A2A182;">God Makes No Mistakes</p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:48px 40px;">
              <p style="margin:0 0 24px;font-size:16px;color:#1a1a1a;line-height:1.7;">
                ${name},
              </p>
              <p style="margin:0 0 24px;font-size:16px;color:#444;line-height:1.8;">
                Here is Chapter 1.
              </p>
              <p style="margin:0 0 40px;font-size:16px;color:#444;line-height:1.8;">
                It is called <em>Is This a Phase?</em> It starts where most parents start — certain, loving, and completely wrong about what is happening. I hope it tells you something useful about where you are right now.
              </p>

              <!-- CTA Button -->
              <table cellpadding="0" cellspacing="0" style="margin:0 0 40px;">
                <tr>
                  <td style="background:#8E412E;padding:16px 36px;">
                    <a href="${chapterUrl}" style="color:#fff;font-family:Georgia,serif;font-size:14px;letter-spacing:0.08em;text-decoration:none;text-transform:uppercase;">Read Chapter 1 →</a>
                  </td>
                </tr>
              </table>

              <p style="margin:0 0 24px;font-size:16px;color:#444;line-height:1.8;">
                When the book is ready, you will be the first to know. Until then — read slowly. The question it asks is worth sitting with.
              </p>
              <p style="margin:0 0 8px;font-size:16px;color:#1a1a1a;line-height:1.7;">
                Ricardo
              </p>
              <p style="margin:0;font-size:14px;color:#888;font-style:italic;line-height:1.6;">
                Author, <em>God Makes No Mistakes</em>
              </p>
            </td>
          </tr>

          <!-- Divider -->
          <tr>
            <td style="padding:0 40px;">
              <hr style="border:none;border-top:1px solid #E6CEBC;margin:0;">
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:24px 40px;">
              <p style="margin:0;font-size:12px;color:#aaa;line-height:1.7;">
                You received this because you requested Chapter 1 at ricardoramosauthor.com.<br>
                <a href="https://ricardoramosauthor.com/unsubscribe.html?email=${encodeURIComponent(email)}" style="color:#8E412E;text-decoration:none;">Unsubscribe</a>
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
        `,
      }),
    });

    if (!emailRes.ok) {
      const err = await emailRes.text();
      console.error('Brevo email error:', err);
      // Contact was created — still return success, email failure is non-fatal
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (e) {
    console.error('subscribe function error:', e);
    return new Response(JSON.stringify({ error: 'Server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
