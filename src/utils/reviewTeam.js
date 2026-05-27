const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";
const MODEL = "llama-3.3-70b-versatile";

/**
 * Calls the Groq API to review a squad.
 *
 * WC mode  → football tactics review (squad balance + formation fit)
 * IPL mode → cricket XI review (batting depth + bowling attack)
 *
 * @param {Array<Object>} xi        – 11 player objects
 * @param {string}        formation – e.g. "4-3-3" (WC only; pass null for IPL)
 * @param {'wc'|'ipl'}    mode      – which sport / prompt style to use
 * @returns {Promise<{balanceScore: number, formationScore: number, tactical: string, roast: string}>}
 *
 * In IPL mode the returned keys keep the same names for ReviewCard compatibility:
 *   balanceScore  = Batting Depth score (1-10)
 *   formationScore = Bowling Attack score (1-10)
 */
export async function reviewTeam(xi, formation, mode = 'wc') {
  const apiKey = import.meta.env.VITE_GROQ_API_KEY;

  if (!apiKey || apiKey === "your_key_here") {
    throw new Error("Missing or placeholder VITE_GROQ_API_KEY in .env");
  }

  /* ── Build prompt based on mode ────────────────────────────────── */
  let systemPrompt, userPrompt;

  if (mode === 'ipl') {
    /* Cricket / IPL prompt */
    const playerList = xi
      .map((p, i) => `${i + 1}. ${p.name} – ${p.role} (${p.nationality}, ${p.battingStyle})`)
      .join("\n");

    systemPrompt =
      "You are a cricket analyst and IPL expert. Always respond with valid JSON only, no markdown fences, no extra text.";

    userPrompt = `Here is an IPL Dream XI assembled from players across multiple teams:\n\n${playerList}\n\nPlease respond in EXACTLY this JSON format and nothing else:\n{\n  "balanceScore": <1-10 integer rating of the batting depth and overall batting order strength>,\n  "formationScore": <1-10 integer rating of the bowling attack variety and penetration>,\n  "tactical": "<exactly 2 sentences about this XI\\'s team balance, strengths and weaknesses>",\n  "roast": "<one funny roast line about this Dream XI>"\n}`;

  } else {
    /* Football / WC prompt (original) */
    const playerList = xi
      .map((p, i) => `${i + 1}. ${p.name} – ${p.position}`)
      .join("\n");

    systemPrompt =
      "You are a football tactics expert. Always respond with valid JSON only, no markdown fences, no extra text.";

    userPrompt = `Here is a football starting XI in a ${formation} formation:\n\n${playerList}\n\nPlease respond in EXACTLY this JSON format and nothing else:\n{\n  "balanceScore": <1-10 integer rating of overall squad balance>,\n  "formationScore": <1-10 integer rating of how well these players fit the ${formation} formation>,\n  "tactical": "<exactly 2 sentences of tactical analysis>",\n  "roast": "<one funny roast line about this squad>"\n}`;
  }

  /* ── API call ───────────────────────────────────────────────────── */
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
          { role: "system", content: systemPrompt },
          { role: "user",   content: userPrompt   },
        ],
      }),
    });

    if (!res.ok) {
      const errorBody = await res.text();
      throw new Error(`Groq API error ${res.status}: ${errorBody}`);
    }

    const data = await res.json();
    const raw  = data.choices[0].message.content.trim();

    // Strip possible markdown code fences the model might still wrap around JSON
    const cleaned = raw.replace(/^```(?:json)?\s*/i, "").replace(/```\s*$/, "");

    const parsed = JSON.parse(cleaned);

    return {
      balanceScore:   Number(parsed.balanceScore)   || 0,
      formationScore: Number(parsed.formationScore) || 0,
      tactical: String(parsed.tactical ?? ""),
      roast:    String(parsed.roast    ?? ""),
    };

  } catch (err) {
    console.error("[reviewTeam] Failed to review squad:", err);

    // Return a graceful fallback so the UI can still render something
    return {
      balanceScore:   0,
      formationScore: 0,
      tactical: mode === 'ipl'
        ? "Unable to generate cricket analysis at this time."
        : "Unable to generate tactical analysis at this time.",
      roast: mode === 'ipl'
        ? "Even Ravi Shastri couldn't find words for this XI."
        : "Even the AI couldn't find words for this squad.",
    };
  }
}
