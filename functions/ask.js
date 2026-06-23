// functions/ask.js
// Cloudflare Pages Worker — handles Q&A requests from the resources page
// Receives: { question, section, context } from the resources page
// Returns: { answer } with citation numbers linked to study DOIs

export async function onRequestPost(context) {
  const { request, env } = context;

  // CORS headers for same-domain requests
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
        JSON.stringify({ error: "Service temporarily unavailable." }),
        { status: 503, headers }
      );
    }

    const systemPrompt = `You are a science communication assistant for the book "God Makes No Mistakes" by Ricardo Ramos, a father who nearly lost his transgender son due to lack of information about the biology of gender identity. Your role is to answer questions about the peer-reviewed research presented on this resources page.

STRICT RULES:
1. Answer ONLY from the scientific sources provided in the context below. Do not introduce outside information.
2. Every factual claim must include a citation number in square brackets, e.g. [22] or [57]. These numbers correspond to the studies listed on the page.
3. If a question cannot be answered from the provided sources, say clearly: "The sources in this section don't cover that specific question. You may find the answer in another section of this page."
4. Use plain, accessible language. No jargon. Write for a parent, not a researcher.
5. Be honest about limitations. If a finding has caveats (small sample size, minority view, contested), name them.
6. Never make claims stronger than the evidence supports.
7. Keep answers under 150 words unless the question genuinely requires more.

SECTION: ${section}

AVAILABLE SOURCES FOR THIS SECTION:
${sectionContext}`;

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-6",
        max_tokens: 400,
        system: systemPrompt,
        messages: [
          {
            role: "user",
            content: question,
          },
        ],
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      console.error("Anthropic API error:", err);
      return new Response(
        JSON.stringify({ error: "Could not get an answer right now. Please try again." }),
        { status: 502, headers }
      );
    }

    const data = await response.json();
    const answer = data.content?.[0]?.text || "No answer returned.";

    return new Response(JSON.stringify({ answer }), { status: 200, headers });

  } catch (err) {
    console.error("Worker error:", err);
    return new Response(
      JSON.stringify({ error: "Something went wrong. Please try again." }),
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
