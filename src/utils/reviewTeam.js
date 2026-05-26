const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";
const MODEL = "llama-3.3-70b-versatile";

/**
 * Calls the Groq API to review a squad's tactical balance, formation fit,
 * and deliver a roast line.
 *
 * @param {Array<Object>} xi  – Array of 11 player objects (must have at least `name` and `position`)
 * @param {string} formation  – e.g. "4-3-3", "3-5-2"
 * @returns {Promise<{balanceScore: number, formationScore: number, tactical: string, roast: string}>}
 */
export async function reviewTeam(xi, formation) {
  const apiKey = import.meta.env.VITE_GROQ_API_KEY;

  if (!apiKey || apiKey === "your_key_here") {
    throw new Error("Missing or placeholder VITE_GROQ_API_KEY in .env");
  }

  const playerList = xi
    .map((p, i) => `${i + 1}. ${p.name} – ${p.position}`)
    .join("\n");

  const userPrompt = `Here is a football starting XI in a ${formation} formation:

${playerList}

Please respond in EXACTLY this JSON format and nothing else:
{
  "balanceScore": <1-10 integer rating of overall squad balance>,
  "formationScore": <1-10 integer rating of how well these players fit the ${formation} formation>,
  "tactical": "<exactly 2 sentences of tactical analysis>",
  "roast": "<one funny roast line about this squad>"
}`;

  try {
    const res = await fetch(GROQ_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: 500,
        messages: [
          {
            role: "system",
            content:
              "You are a football tactics expert. Always respond with valid JSON only, no markdown fences, no extra text.",
          },
          { role: "user", content: userPrompt },
        ],
      }),
    });

    if (!res.ok) {
      const errorBody = await res.text();
      throw new Error(`Groq API error ${res.status}: ${errorBody}`);
    }

    const data = await res.json();
    const raw = data.choices[0].message.content.trim();

    // Strip possible markdown code fences the model might still wrap around JSON
    const cleaned = raw.replace(/^```(?:json)?\s*/i, "").replace(/```\s*$/, "");

    const parsed = JSON.parse(cleaned);

    return {
      balanceScore: Number(parsed.balanceScore) || 0,
      formationScore: Number(parsed.formationScore) || 0,
      tactical: String(parsed.tactical ?? ""),
      roast: String(parsed.roast ?? ""),
    };
  } catch (err) {
    console.error("[reviewTeam] Failed to review squad:", err);

    // Return a graceful fallback so the UI can still render something
    return {
      balanceScore: 0,
      formationScore: 0,
      tactical: "Unable to generate tactical analysis at this time.",
      roast: "Even the AI couldn't find words for this squad.",
    };
  }
}
