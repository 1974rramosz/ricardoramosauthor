// functions/ask.js
// Full cross-section context version — answers draw from all sections

const FULL_CONTEXT = `
DEVELOPMENTAL BIOLOGY:
[57] Ristori et al. 2020: Genital sex forms in trimester one. Brain sexual differentiation follows later in a separate hormonal surge. Two independent developmental events. Nothing requires them to produce the same outcome.
[41] Joel et al. 2015: Over 1,400 brain scans show most brains are a mosaic. Only 0-8% sorted cleanly into one male or female category.
[58] Polderman et al. 2018: Genetics account for 30-60% of gender identity variance. Non-genetic variance points to prenatal hormonal environment, not parenting or social influence.
[59] Batista et al. 2019: In 144 people with sex development conditions, prenatal androgen exposure predicted adult identity better than genital appearance at birth.
[49] Hughes et al. 2012: People with XY chromosomes who cannot respond to testosterone develop as women. Chromosomes are the opening instruction, not the whole script.
Roselli 2018: Gender identity and sexual orientation are two separate developmental processes. Neither determines the other.

NEUROSCIENCE:
Majid et al. 2019: fMRI showing transgender participants' self-recognition brain networks activated for images matching their gender identity, not birth-assigned sex. The brain's own sense of self aligns with experienced identity.
Wiersch et al. 2023: Brain sex classification more accurate using gender identity than birth-assigned sex, even after controlling for brain size as a confound.
[4] Guillamon et al. 2016: BNSTc and INAH3 brain structures show consistent patterns across independent groups. Important limitation: postmortem samples are small and hormone therapy may independently change brain structure.

DIAGNOSTIC HISTORY:
DSM-5 (2013): Replaced "gender identity disorder" with "gender dysphoria." Explicitly states gender non-conformity is NOT in itself a mental disorder. The diagnosis targets clinically significant distress — not the identity itself.
ICD-11 (2022): The WHO moved gender incongruence OUT of the mental disorders chapter entirely, into "conditions related to sexual health." Trans identity is not classified as a mental disorder by the world's leading health authority.
History: Homosexuality was classified as a mental disorder in DSM-I (1952) and removed in 1973. Every revision of diagnostic manuals has moved away from pathology toward recognition of natural variation.

OUTCOMES AND MENTAL HEALTH:
[22] Ryan et al. 2010: Highly accepting families produced 82% lower odds of their child attempting to end their life, and 56% lower depression rates. The variable was family acceptance — not medication or therapy alone.
[2] Olson et al. 2016: Supported transgender children showed mental health scores statistically indistinguishable from cisgender population norms. Support removed the mental health gap entirely.
[64] Bockting et al. 2013: 44.1% depression, 33.2% anxiety in transgender community sample. Social stigma — not identity — was the explanatory variable. These rates reflect what happens to any population under sustained stigma.
[68] Russell et al. 2018: Using a trans young person's chosen name across contexts linked to 71% lower depression and 65% lower suicidal ideation.
[62] Meyer 2003: Minority stress model — the causal chain runs from stigma to discrimination and rejection to mental health outcomes. The distress is caused by the social response, not the identity itself.

CONTESTED GROUND:
[50] Cass Review 2024: Independent NHS review raising concerns about clinical pace for medical interventions in minors. Does NOT say trans identity is not real or that parents should reject their children.
[51] Arraiza Zabalegui 2024: Methodological critique of postmortem brain studies — small samples, lack of replication, hormone therapy confound.
Mohammadi 2018 (minority view): Proposes brain differences may result from lifestyle rather than innate biology. Cannot account for heritability or prenatal hormone findings. Non-retracted but minority position.
Gliske 2019 (RETRACTED): Proposed gender dysphoria as a sensory pathology. Retracted April 2020 for working backward from a pathology assumption. Do not cite.
`;

export async function onRequestPost(context) {
  const { request, env } = context;

  const headers = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
  };

  try {
    const body = await request.json();
    const { question, section } = body;

    if (!question || question.trim().length < 3) {
      return new Response(
        JSON.stringify({ error: "Please enter a question." }),
        { status: 200, headers }
      );
    }

    if (!env.ANTHROPIC_API_KEY) {
      return new Response(
        JSON.stringify({ error: "API key not configured." }),
        { status: 200, headers }
      );
    }

    const systemPrompt = `You are a science communication assistant for the book "God Makes No Mistakes" by Ricardo Ramos — a father who nearly lost his transgender son due to a lack of scientific information. Your role is to answer questions about the peer-reviewed research on this resources page.

The reader is asking from the "${section}" section, but you may draw from any relevant source in the full knowledge base below.

RULES:
1. Answer from the full knowledge base provided. Do not introduce outside information.
2. Include citation numbers in brackets like [22] or [57] for every factual claim.
3. Use plain, accessible language. Write for a parent who is skeptical, not a researcher.
4. Be honest about limitations. Name caveats when they exist.
5. If a question reflects a common misconception (e.g. "isn't this a mental illness"), address the misconception directly and respectfully using the evidence.
6. Keep answers under 200 words.

FULL KNOWLEDGE BASE:
${FULL_CONTEXT}`;

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-6",
        max_tokens: 500,
        system: systemPrompt,
        messages: [{ role: "user", content: question }],
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      return new Response(
        JSON.stringify({ error: "Could not get an answer. Please try again.", detail: err }),
        { status: 200, headers }
      );
    }

    const data = await response.json();
    const answer = data.content?.[0]?.text || "No answer returned.";
    return new Response(JSON.stringify({ answer }), { status: 200, headers });

  } catch (err) {
    return new Response(
      JSON.stringify({ error: "Something went wrong. Please try again.", detail: err.message }),
      { status: 200, headers }
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
