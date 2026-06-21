# Saarthi (सारथी)

**Your guide, every day. From darkness, to light.**

Saarthi is a daily Sanatani spiritual-practice companion — *a Hallow for Sanatan
dharma*. It turns the scattered, infinite, free devotional content of Sanatan
dharma into one short, personalized, voice-first daily practice: the morning
habit, with streaks, guided meditation, shlokas, stories, and an AI companion.

*Saarthi* means "the charioteer" — the divine guide who steers you (Krishna to
Arjuna). The role is the name: a companion who walks beside you, not a guru
above you.

> This is a POC. Audio, the "deity voice", panchang data, and the content corpus
> are clearly-marked placeholders. See **Placeholders** below.

**Live deployment:** connected to Vercel — every push to `main` ships a
production build automatically. The app builds and runs without any env var; set
`ANTHROPIC_API_KEY` in Vercel (Project → Settings → Environment Variables →
Production) to wake the AI Companion. See **Deploy to Vercel** below.

---

## Features

Warm **dark** devotional theme. Five tabs (mobile bottom bar / desktop left rail): **Today · Discover · Practice · Companion · You**, with deeper sections reached from Today/Discover.

- **Onboarding** — choose your deity (Ishta-devta), language (English / हिन्दी), tradition/sampradaya, and a daily practice time (sankalp).
- **Today** — the daily loop: greeting + panchang, today's shlok-of-the-day, a suggested-practice carousel, a one-tap daily question, today's wisdom, an active-sadhana strip, and the streak + sankalp ("Complete today's practice" → "Practice sealed for today") with a 7-day gold chain.
- **Session player** (`/session`) — the core flow. **Begin practice** (anywhere) opens a focused, audio-first player: **setup** (length 5/10/15 · guide voice · background: tanpura/bells/water/silence · intention) → **playing** (data-driven timer, breathing animation, transcript toggle, intention overlay, speed, sleep timer) → **completion** (streak increment + milestone celebration + a one-line reflection) → back to Today.
- **Discover** — search across the whole corpus, intention categories (calm/focus/sleep/before-an-exam/…), and themed Collections.
- **Practice** — shlokas/mantras (Devanagari + IAST + meaning + audio) and the daily aarti; each opens in the player.
- **Meditate / Night / Chant (Japa)** — guided stillness; a night prayer + sleep katha with a default sleep timer; a 108-mala japa counter with chant loops.
- **Sadhanas** — 9 / 21 / 40-day guided journeys with day-by-day unlock and gold progress.
- **Katha & Talks** — puranic stories + short talks (audio) + bite-sized lessons (each with an *Ask Saarthi about this* deep-link). `/learn` redirects here.
- **Satsang** — a community stub: share an intention + a "practicing now" presence line.
- **Companion** — an AI chat (Saarthi) grounded in canon, with voice input and read-aloud. Calls Anthropic server-side.
- **You** — change deity / sampradaya / language / sankalp; streak stats; your **Reflections** journal; a downloads stub; **Saarthi Plus** + **Gift Saarthi** (non-functional); privacy.
- **Habit layer** — streak milestones (7 / 21 / 40 / 108) celebrate once; the sankalp time is kept.
- **Bilingual** — English / हिन्दी toggle switches all copy and UI chrome.

---

## Tech stack

- **Next.js 14** (App Router) + **TypeScript** + **Tailwind CSS 3**
- **No database.** All state is client-side: React Context + `localStorage`.
- **AI companion** via a Next.js Route Handler at `/api/companion` that calls the
  Anthropic API server-side with `fetch` (model `claude-sonnet-4-6`). The API key
  comes from `process.env.ANTHROPIC_API_KEY` and is **never** exposed to the client.
- **Voice** via the browser Web Speech API (`SpeechRecognition` for input,
  `SpeechSynthesis` for read-aloud) — a placeholder for a future produced "deity voice".
- **Fonts** (Google, via `next/font`): Inter (UI), Fraunces (English headings),
  Noto Serif Devanagari (shlokas/mantras).
- Deployable to **Vercel** with zero extra config.

---

## Local setup

Requires Node 18+ (developed on Node 20).

```bash
# 1. Install dependencies
npm install

# 2. (Optional) enable the AI Companion — copy the example env and add your key
cp .env.example .env.local
#   then edit .env.local and set:
#   ANTHROPIC_API_KEY=sk-ant-...

# 3. Run the dev server
npm run dev
```

Open **http://localhost:3000**. On first run you'll land in onboarding.

Without an `ANTHROPIC_API_KEY`, the whole app works — only the Companion chat
shows a gentle "the companion is resting — add your ANTHROPIC_API_KEY to begin."
message. Add the key (and restart `npm run dev`) to get live responses.

Get a key at <https://console.anthropic.com/>.

### Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Start the dev server (http://localhost:3000) |
| `npm run build` | Production build |
| `npm run start` | Serve the production build |
| `npm run lint` | Next.js lint |

---

## Project structure

```
app/
  layout.tsx            # fonts, metadata, providers + nav shell
  providers.tsx         # SaarthiProvider + app frame + bottom/side nav
  page.tsx              # splash → redirects to /onboarding or /today
  globals.css           # DARK theme tokens (CSS vars) + breathe + glow utilities
  icon.svg              # charioteer favicon
  onboarding/page.tsx   # 5-step onboarding (deity, language, tradition, sankalp)
  today/page.tsx        # the daily loop + carousel/daily question/active sadhana
  session/page.tsx      # the session player: setup → playing → completion
  discover/page.tsx     # search + categories + collections
  practice/page.tsx     # shlokas, aarti (open in the player)
  meditate/ night/ chant/   # guided stillness · night prayer+katha · 108 japa
  sadhanas/page.tsx + sadhanas/[id]/page.tsx   # journeys + day-by-day detail
  katha/page.tsx        # stories + talks + lessons (learn/ redirects here)
  satsang/page.tsx      # community stub
  companion/page.tsx    # AI chat (text + voice)
  profile/page.tsx      # "You": settings, streak, reflections, Plus, gift
  api/companion/route.ts# server-side Anthropic call (key never sent to client)
lib/
  types.ts              # Deity/Shloka/… + Voice/Background/Collection/Sadhana/…
  content.ts            # seed corpus + voices/backgrounds/collections/sadhanas + resolvePractice()
  state.tsx             # Context + localStorage (deity, lang, streak, reflections, sadhanas, milestones)
  i18n.ts               # t() localizer + nav/greeting chrome (en/hi)
  panchang.ts           # mocked rotating tithi line
components/
  Logo.tsx, Nav.tsx     # charioteer mark + 5-tab responsive nav
  ui/                   # Card, Button, Badge, ScreenHeader, AudioButton
  session/ today/ discover/ practice/ meditate/ night/ chant/
  sadhanas/ katha/ satsang/ profile/ onboarding/   # per-screen pieces
public/audio/           # placeholder WAV tones (see public/audio/README.md)
```

**Scaling to hundreds of deities is data-driven** — everything renders from
`lib/content.ts`, so adding a deity = adding one entry.

---

## The AI companion

`POST /api/companion` takes `{ messages, deity, tradition, lang }`, builds a
system prompt enforcing Saarthi's guardrails (ground in canon, never invent a
shloka or fact, respect sampradaya plurality, never use fear or guilt, stay in
role, reply in the user's language, never ask for sensitive data), calls
Anthropic (`claude-sonnet-4-6`, `max_tokens: 1024`), and returns the text. If the
key is missing it fails gracefully with a friendly message. The key is read only
on the server and is never bundled into client code.

---

## Placeholders (clearly marked in code)

| Placeholder | Marker |
| --- | --- |
| Audio (shlokas, meditations, stories, aarti, japa) + session backgrounds (tanpura / bells / water) | short generated tones in `public/audio/` (incl. `bg-tanpura/bg-bells/bg-water`) — `TODO: replace with produced audio.` |
| Guide voices in the session player | labelled placeholders for a future produced/cloned deity voice — `TODO: produced voice.` |
| "Deity voice" | browser TTS — `TODO: replace with produced/cloned deity voice assets.` |
| Panchang / tithi | small rotating mock in `lib/panchang.ts` — `TODO: integrate a real panchang API.` |
| Content corpus | curated seed set in `lib/content.ts` — `TODO: ingest full verified corpus.` |
| Saarthi Plus / transactional offerings | non-functional stubs in Profile |

---

## Deploy to Vercel

The app deploys to Vercel with zero extra config. You only need to set one
environment variable: `ANTHROPIC_API_KEY`.

### Option A — Vercel CLI (no Git required)

```bash
npm i -g vercel        # if you don't have it
vercel                 # from the project root — follow the prompts to link/create the project
```

Then add the key (run once per environment) and deploy to production:

```bash
vercel env add ANTHROPIC_API_KEY production   # paste your sk-ant-... key when prompted
vercel --prod
```

(Optionally also add it to `preview` and `development` so preview deploys can use the Companion.)

### Option B — Connect a Git repo (recommended for ongoing work)

```bash
git init && git add -A && git commit -m "Saarthi POC"
# push to a new GitHub/GitLab/Bitbucket repo
```

1. Go to <https://vercel.com/new> and **import** the repository.
2. Vercel auto-detects Next.js — no build settings to change.
3. Under **Settings → Environment Variables**, add:
   - **Name:** `ANTHROPIC_API_KEY`  **Value:** your `sk-ant-...` key  **Environments:** Production (and Preview/Development if you want the Companion there).
4. **Deploy.** Every push to the default branch ships to production; PRs get preview URLs.

> Without `ANTHROPIC_API_KEY` set, the deployment still works end-to-end — only
> the Companion shows the "resting" message. Everything else (onboarding, streaks,
> practice, meditation, learn) runs entirely client-side.

---

## Privacy

Your faith is yours. Saarthi keeps your choices on your device (`localStorage`)
and never sells your data. The Companion sends only your chat messages and your
chosen deity/tradition/language to Anthropic to generate a reply.
