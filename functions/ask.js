// functions/ask.js
export async function onRequestPost(context) {
  const { request, env } = context;

  const headers = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
  };

  try {
    const body = await request.json();
    const { question, section, context: sectionContext } = body;

    if (!question || question.trim().length < 3) {
      return new Response(
        JSON.stringify({ error: "Please enter a question." }),
        { status: 400, headers }
      );
    }

    if (!env.ANTHROPIC_API_KEY) {
      return new Response(
        JSON.stringify({ error: "API key not configured." }),
        { status: 503, headers }
      );
    }

    const systemPrompt = `You are a science communication assistant for the book "God Makes No Mistakes" by Ricardo Ramos. Answer questions about the peer-reviewed research on this page.

RULES:
1. Answer ONLY from the sources provided in the context below.
2. Include citation numbers in brackets like [22] or [57] for every factual claim.
3. If the question cannot be answered from the provided sources, say: "The sources in this section don't cover that specific question. You may find the answer in another section of this page."
4. Use plain language. Write for a parent, not a researcher.
5. Be honest about limitations. Name caveats when they exist.
6. Keep answers under 150 words.

SECTION: ${section}

SOURCES:
${sectionContext}`;

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-opus-4-6",
        max_tokens: 400,
        system: systemPrompt,
        messages: [{ role: "user", content: question }],
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      console.error("Anthropic error:", err);
      return new Response(
        JSON.stringify({ error: "Could not get an answer. Please try again.", detail: err }),
        { status: 502, headers }
      );
    }

    const data = await response.json();
    const answer = data.content?.[0]?.text || "No answer returned.";
    return new Response(JSON.stringify({ answer }), { status: 200, headers });

  } catch (err) {
    console.error("Worker error:", err.message);
    return new Response(
      JSON.stringify({ error: "Something went wrong. Please try again.", detail: err.message }),
      { status: 500, headers }
    );
  }
}

export async function onRequestOptions() {
  return new Response(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}
