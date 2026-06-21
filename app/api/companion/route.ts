// app/api/companion/route.ts — server Route Handler for the Saarthi companion.
//
// The ONLY place the Anthropic API key is ever read or used. It is read from
// the server environment and never returned to the client. The client posts a
// transcript + a little context (deity / tradition / language) and receives a
// single text reply, or a friendly error code it can render gracefully.

import { NextResponse } from "next/server";

// Run on the Node.js runtime (not edge) so process.env access is straightforward.
export const runtime = "nodejs";

type Role = "user" | "assistant";

interface ChatMessage {
  role: Role;
  content: string;
}

interface CompanionRequest {
  messages: ChatMessage[];
  deity?: string;
  tradition?: string;
  lang?: "en" | "hi";
}

const ANTHROPIC_URL = "https://api.anthropic.com/v1/messages";
const MODEL = "claude-sonnet-4-6";

/**
 * Build the system prompt that holds Saarthi in role and enforces its
 * devotional guardrails. The deity / tradition / language are interpolated so
 * the companion honours the user's chosen path and replies in their language.
 */
function buildSystemPrompt(
  deity: string,
  tradition: string,
  lang: "en" | "hi",
): string {
  const language = lang === "hi" ? "Hindi" : "English";
  return [
    `You are Saarthi, a warm, humble daily spiritual companion for a practitioner of Sanatan dharma — a guide who walks beside the user, never a guru lecturing from above. The user's chosen deity is ${deity}, tradition ${tradition}; reply in ${language}.`,
    `Ground everything in canon (Vedas, Upanishads, Gita, Ramayana, Puranas, established stotras). Never invent a shloka, fact, story, or practice. If unsure of an exact verse or detail, say so plainly and offer what is well-attested instead — never fabricate Sanskrit or attribute words to a text you are unsure of.`,
    `Respect sampradaya plurality (Shaiva, Vaishnava, Shakta, regional) — present differences as differences; never declare one tradition the only correct one; honour the user's chosen path.`,
    `Never use fear or guilt. No "do this or misfortune follows," no shame, no pressure. Offer comfort, meaning, and gentle guidance only.`,
    `You serve two modes; infer which the user needs from their words. (1) Verse mode — when they ask you to recite, dictate, or give a verse, mantra, shloka, stotra, or prayer (or ask for one "for X"): recite the single most apt, well-attested verse and nothing else — present it as Devanagari, then transliteration (IAST), then a one-line plain meaning, then name its source; offer at most one short line of context, do not lecture. (2) Information mode — for any other question: answer with brief, grounded guidance, quoting a verse only if it genuinely helps. If you are not certain of an exact verse, say so and offer one you are sure of rather than fabricating Sanskrit.`,
    `Stay in role: devotional practice, meaning of texts, rituals, stories, applying their wisdom to daily life. Gently redirect anything outside this. Keep replies short, warm, practical — a few sentences, like a companion, not an essay. Privacy: never ask for sensitive personal data.`,
  ].join("\n\n");
}

export async function POST(request: Request) {
  const apiKey = process.env.ANTHROPIC_API_KEY;

  // No key configured — tell the client to show the calm "resting" message.
  // The key is never exposed; we only signal its absence.
  if (!apiKey) {
    return NextResponse.json({ error: "missing_key" }, { status: 503 });
  }

  let body: CompanionRequest;
  try {
    body = (await request.json()) as CompanionRequest;
  } catch {
    return NextResponse.json({ error: "bad_request" }, { status: 400 });
  }

  const messages = Array.isArray(body.messages) ? body.messages : [];
  if (messages.length === 0) {
    return NextResponse.json({ error: "bad_request" }, { status: 400 });
  }

  const deity = body.deity?.trim() || "their chosen deity";
  const tradition = body.tradition?.trim() || "unspecified";
  const lang: "en" | "hi" = body.lang === "hi" ? "hi" : "en";

  const system = buildSystemPrompt(deity, tradition, lang);

  // Pass only the role/content pairs the API expects; ignore any extra fields.
  const safeMessages = messages.map((m) => ({
    role: m.role === "assistant" ? "assistant" : "user",
    content: String(m.content ?? ""),
  }));

  let upstream: Response;
  try {
    upstream = await fetch(ANTHROPIC_URL, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: 1024,
        system,
        messages: safeMessages,
      }),
    });
  } catch (err) {
    // Network-level failure reaching Anthropic.
    return NextResponse.json(
      { error: "upstream", detail: String(err) },
      { status: 502 },
    );
  }

  if (!upstream.ok) {
    // Surface a generic upstream error; do not leak the key or full internals.
    let detail = `status ${upstream.status}`;
    try {
      detail = await upstream.text();
    } catch {
      // keep the status-only detail
    }
    return NextResponse.json({ error: "upstream", detail }, { status: 502 });
  }

  let data: { content?: Array<{ type?: string; text?: string }> };
  try {
    data = (await upstream.json()) as typeof data;
  } catch (err) {
    return NextResponse.json(
      { error: "upstream", detail: String(err) },
      { status: 502 },
    );
  }

  // Anthropic returns content as an array of blocks; keep the text blocks.
  const text = (data.content ?? [])
    .filter((block) => block.type === "text" && typeof block.text === "string")
    .map((block) => block.text as string)
    .join("")
    .trim();

  return NextResponse.json({ text });
}
