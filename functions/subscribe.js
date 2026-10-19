// Calls Brevo, retrying once on network errors, rate limits or server errors.
async function brevoFetch(url, init) {
  for (let attempt = 1; attempt <= 2; attempt++) {
    try {
      const res = await fetch(url, init);
      if ((res.status === 429 || res.status >= 500) && attempt === 1) {
        await new Promise(r => setTimeout(r, 600));
        continue;
      }
      return res;
    } catch (e) {
      if (attempt === 2) throw e;
      await new Promise(r => setTimeout(r, 600));
    }
  }
}

const json = (obj, status = 200) =>
  new Response(JSON.stringify(obj), { status, headers: { 'Content-Type': 'application/json' } });

const pendingKey = (email) => `pending:${email.trim().toLowerCase()}`;

// Creates or updates the contact in Brevo list 3. Returns true on success.
async function createContact(env, { name, email, country, relationship }) {
  if (!env.BREVO_API_KEY) { console.error('BREVO_API_KEY is not set'); return false; }
  try {
    const res = await brevoFetch('https://api.brevo.com/v3/contacts', {
      method: 'POST',
      headers: { 'accept': 'application/json', 'content-type': 'application/json', 'api-key': env.BREVO_API_KEY },
      body: JSON.stringify({
        email,
        attributes: { FIRSTNAME: name, COUNTRY: country, RELATIONSHIP: relationship },
        listIds: [3],
        updateEnabled: true,
      }),
    });
    if (res.ok || res.status === 204) return true;
    console.error('Brevo contact error:', res.status, await res.text());
    return false;
  } catch (e) {
    console.error('Brevo contact network error:', e);
    return false;
  }
}

// Sends the Chapter 1 delivery email. Returns true on success.
async function sendChapterEmail(env, { name, email }) {
  try {
    const emailRes = await deliveryRequest(env.BREVO_API_KEY, name, email);
    if (emailRes.ok) return true;
    console.error('Brevo email error:', emailRes.status, await emailRes.text());
    return false;
  } catch (e) {
    console.error('Brevo email network error:', e);
    return false;
  }
}

function deliveryRequest(BREVO_API_KEY, name, email) {
  const chapterUrl = 'https://ricardoramosauthor.com/chapter-1.html';
  return brevoFetch('https://api.brevo.com/v3/smtp/email', {
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
}

// Retries any signups saved while Brevo was unreachable. Runs in the background after a successful signup.
async function replayPending(env) {
  if (!env.SIGNUPS_BACKUP) return;
  try {
    const { keys } = await env.SIGNUPS_BACKUP.list({ prefix: 'pending:', limit: 20 });
    for (const { name: key } of keys) {
      const raw = await env.SIGNUPS_BACKUP.get(key);
      if (!raw) continue;
      const data = JSON.parse(raw);
      if (await createContact(env, data)) {
        await sendChapterEmail(env, data);
        await env.SIGNUPS_BACKUP.delete(key);
        console.log('Recovered pending signup', key);
      } else {
        break; // Brevo still failing, try again on the next signup
      }
    }
  } catch (e) {
    console.error('replayPending error:', e);
  }
}

export async function onRequestPost(context) {
  const { request, env } = context;

  try {
    const { name, email, country, relationship } = await request.json();
    if (!name || !email || !country || !relationship) {
      return json({ error: 'Missing required fields' }, 400);
    }
    const data = { name, email, country, relationship };

    if (!(await createContact(env, data))) {
      // Brevo is unreachable or rejecting us: keep the signup safe and replay it later.
      if (env.SIGNUPS_BACKUP) {
        await env.SIGNUPS_BACKUP.put(pendingKey(email), JSON.stringify({ ...data, savedAt: new Date().toISOString() }));
        console.error('Signup saved to backup for later replay:', pendingKey(email));
        return json({ success: true, emailSent: false, queued: true });
      }
      return json({ error: 'Failed to create contact' }, 500);
    }

    const emailSent = await sendChapterEmail(env, data);
    context.waitUntil(replayPending(env));
    return json({ success: true, emailSent });

  } catch (e) {
    console.error('subscribe function error:', e);
    return json({ error: 'Server error' }, 500);
  }
}

// Health check: reports whether the backup queue is connected and how many signups are waiting. No personal data.
export async function onRequestGet({ env }) {
  let pending = null;
  if (env.SIGNUPS_BACKUP) {
    try { pending = (await env.SIGNUPS_BACKUP.list({ prefix: 'pending:', limit: 100 })).keys.length; } catch {}
  }
  return json({ backup: !!env.SIGNUPS_BACKUP, pending, apiKey: !!env.BREVO_API_KEY });
}
