export async function onRequestPost(context) {
  const { request, env } = context;

  try {
    const body = await request.json();
    const { email } = body;

    if (!email) {
      return new Response(JSON.stringify({ error: 'Email required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const BREVO_API_KEY = env.BREVO_API_KEY;

    // Remove contact from list 3
    const res = await fetch(`https://api.brevo.com/v3/contacts/lists/3/contacts/remove`, {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'content-type': 'application/json',
        'api-key': BREVO_API_KEY,
      },
      body: JSON.stringify({
        emails: [email],
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      console.error('Brevo unsubscribe error:', err);
      return new Response(JSON.stringify({ error: 'Failed to unsubscribe' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (e) {
    console.error('unsubscribe function error:', e);
    return new Response(JSON.stringify({ error: 'Server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
