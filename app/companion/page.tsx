"use client";

// app/companion/page.tsx — the Saarthi companion chat screen.
//
// A warm, voice-first chat: a message list (user on the right, Saarthi on the
// left), a text input + send, an optional MIC for voice input, and a "Read
// aloud" toggle that speaks Saarthi's replies.
//
// Web Speech API is a PLACEHOLDER for a future produced/cloned deity voice — do
// NOT present it as the actual deity's voice. The UI wording ("Read aloud")
// reflects that it is a neutral assistive narration, not the deity speaking.
//
// All Anthropic calls go through /api/companion so the key never reaches the
// client. On a missing key or any failure, we show a calm inline message and
// never crash.

import {
  Suspense,
  useCallback,
  useEffect,
  useRef,
  useState,
  type FormEvent,
} from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { useSaarthi } from "@/lib/state";
import { getDeity } from "@/lib/content";
import { t } from "@/lib/i18n";
import type { Lang, Localized } from "@/lib/types";
import { Button, Card, ScreenHeader } from "@/components/ui";
import { Logo } from "@/components/Logo";

// ---------------------------------------------------------------------------
// Screen copy (both languages switch via the active `lang`).
// ---------------------------------------------------------------------------
const copy = {
  title: { en: "Companion", hi: "सहचर" } as Localized,
  subtitle: {
    en: "Sit a while with Saarthi.",
    hi: "कुछ क्षण सारथी के संग बैठें।",
  } as Localized,
  grounding: {
    en: "Saarthi grounds its guidance in the texts.",
    hi: "सारथी अपना मार्गदर्शन शास्त्रों में आधारित रखता है।",
  } as Localized,
  emptyTitle: {
    en: "Ask Saarthi anything.",
    hi: "सारथी से कुछ भी पूछें।",
  } as Localized,
  emptyBody: {
    en: "A shloka's meaning, a story, a doubt, or a moment you're facing — Saarthi grounds every answer in the texts.",
    hi: "किसी श्लोक का अर्थ, कोई कथा, कोई शंका, या कोई क्षण जिससे आप गुज़र रहे हैं — सारथी हर उत्तर को शास्त्रों में आधारित रखता है।",
  } as Localized,
  inputPlaceholder: {
    en: "Write to Saarthi",
    hi: "सारथी को लिखें",
  } as Localized,
  send: { en: "Send", hi: "भेजें" } as Localized,
  thinking: { en: "Saarthi is reflecting", hi: "सारथी विचार कर रहा है" } as Localized,
  resting: {
    en: "Saarthi is resting. (Add your API key to wake the companion.)",
    hi: "सारथी विश्राम में है। (सहचर को जगाने के लिए अपनी API कुंजी जोड़ें।)",
  } as Localized,
  trouble: {
    en: "Saarthi could not answer just now. Please try again in a moment.",
    hi: "सारथी अभी उत्तर नहीं दे सका। कृपया कुछ क्षण बाद पुनः प्रयास करें।",
  } as Localized,
  micStart: { en: "Speak to Saarthi", hi: "सारथी से बोलें" } as Localized,
  micStop: { en: "Stop listening", hi: "सुनना रोकें" } as Localized,
  readAloudOn: { en: "Read aloud on", hi: "पढ़कर सुनाना चालू" } as Localized,
  readAloudOff: { en: "Read aloud off", hi: "पढ़कर सुनाना बंद" } as Localized,
  voiceNote: {
    en: "Read aloud uses your device voice — a placeholder for a future Saarthi voice.",
    hi: "पढ़कर सुनाना आपके उपकरण की आवाज़ का उपयोग करता है — भविष्य की सारथी आवाज़ हेतु एक अस्थायी विकल्प।",
  } as Localized,
  you: { en: "You", hi: "आप" } as Localized,
  saarthi: { en: "Saarthi", hi: "सारथी" } as Localized,
  needDeityTitle: {
    en: "Finish setting up first",
    hi: "पहले सेटअप पूरा करें",
  } as Localized,
  needDeityBody: {
    en: "Choose a deity and complete your sankalp, then Saarthi can walk beside you.",
    hi: "एक देवता चुनें और अपना संकल्प पूरा करें, फिर सारथी आपके साथ चल सकेगा।",
  } as Localized,
  finishOnboarding: {
    en: "Complete onboarding",
    hi: "ऑनबोर्डिंग पूरी करें",
  } as Localized,
  loading: { en: "Loading", hi: "लोड हो रहा है" } as Localized,
};

// Suggested openers shown on the empty state.
const seeds: Localized[] = [
  { en: 'What does "Om Namah Shivaya" mean?', hi: '"ॐ नमः शिवाय" का क्या अर्थ है?' },
  { en: "I'm anxious about a decision.", hi: "मैं एक निर्णय को लेकर चिंतित हूँ।" },
  { en: "Tell me a story of Ganesha.", hi: "गणेश की एक कथा सुनाइए।" },
  { en: "Help me begin a 21-day sadhana.", hi: "मुझे 21-दिवसीय साधना आरंभ करने में सहायता करें।" },
];

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

// ---------------------------------------------------------------------------
// Minimal Web Speech API typings (the lib DOM types are not always present).
// These describe only what we use; everything is feature-detected at runtime.
// ---------------------------------------------------------------------------
interface SpeechRecognitionResultLike {
  0: { transcript: string };
}
interface SpeechRecognitionEventLike {
  results: { 0: SpeechRecognitionResultLike };
}
interface SpeechRecognitionLike {
  lang: string;
  interimResults: boolean;
  maxAlternatives: number;
  continuous: boolean;
  start(): void;
  stop(): void;
  onresult: ((e: SpeechRecognitionEventLike) => void) | null;
  onerror: (() => void) | null;
  onend: (() => void) | null;
}
type SpeechRecognitionCtor = new () => SpeechRecognitionLike;

function getRecognitionCtor(): SpeechRecognitionCtor | null {
  if (typeof window === "undefined") return null;
  const w = window as unknown as {
    SpeechRecognition?: SpeechRecognitionCtor;
    webkitSpeechRecognition?: SpeechRecognitionCtor;
  };
  return w.SpeechRecognition ?? w.webkitSpeechRecognition ?? null;
}

// ---------------------------------------------------------------------------
// Page (server boundary): wraps the search-param consumer in <Suspense>, a
// hard requirement in Next 14 for any component calling useSearchParams().
// ---------------------------------------------------------------------------
export default function CompanionPage() {
  return (
    <Suspense fallback={<CompanionSkeleton />}>
      <CompanionChat />
    </Suspense>
  );
}

function CompanionSkeleton() {
  return (
    <div aria-hidden="true" className="animate-pulse">
      <div className="mb-6">
        <div className="h-8 w-40 rounded-lg bg-line/70" />
        <div className="mt-2 h-4 w-56 rounded bg-line/60" />
      </div>
      <div className="space-y-3">
        <div className="h-24 rounded-3xl bg-line/40" />
        <div className="h-12 rounded-2xl bg-line/40" />
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// The actual chat. Reads ?seed= via useSearchParams (hence the Suspense above).
// ---------------------------------------------------------------------------
function CompanionChat() {
  const { hydrated, lang, deityId, tradition } = useSaarthi();
  const searchParams = useSearchParams();

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [notice, setNotice] = useState<Localized | null>(null);

  // Voice input (mic) + read-aloud (speaker) — both Web Speech API placeholders.
  const [listening, setListening] = useState(false);
  const [readAloud, setReadAloud] = useState(false);
  const [micSupported, setMicSupported] = useState(false);
  const [ttsSupported, setTtsSupported] = useState(false);

  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const seededRef = useRef(false);

  const deity = getDeity(deityId);
  const speechLang = lang === "hi" ? "hi-IN" : "en-US";

  // Feature-detect Web Speech APIs once on the client.
  useEffect(() => {
    setMicSupported(getRecognitionCtor() !== null);
    setTtsSupported(
      typeof window !== "undefined" && "speechSynthesis" in window,
    );
  }, []);

  // Keep the transcript scrolled to the newest message.
  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages, sending]);

  // Stop any in-flight speech / recognition when leaving the screen.
  useEffect(() => {
    return () => {
      try {
        recognitionRef.current?.stop();
      } catch {
        // ignore
      }
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  // Read aloud Saarthi's reply via SpeechSynthesis (placeholder voice).
  const speak = useCallback(
    (text: string) => {
      if (!readAloud) return;
      if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
      try {
        window.speechSynthesis.cancel();
        const utter = new SpeechSynthesisUtterance(text);
        utter.lang = speechLang;
        utter.rate = 0.96;
        window.speechSynthesis.speak(utter);
      } catch {
        // Speech is optional; never break the chat over it.
      }
    },
    [readAloud, speechLang],
  );

  // Send a transcript to the companion API and append the reply.
  const send = useCallback(
    async (text: string) => {
      const trimmed = text.trim();
      if (!trimmed || sending) return;

      setNotice(null);
      const next: ChatMessage[] = [
        ...messages,
        { role: "user", content: trimmed },
      ];
      setMessages(next);
      setInput("");
      setSending(true);

      try {
        const res = await fetch("/api/companion", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({
            messages: next,
            deity: deity ? deity.name.en : deityId ?? undefined,
            tradition: tradition ?? undefined,
            lang,
          }),
        });

        if (!res.ok) {
          const data = (await res.json().catch(() => ({}))) as {
            error?: string;
          };
          setNotice(data.error === "missing_key" ? copy.resting : copy.trouble);
          return;
        }

        const data = (await res.json()) as { text?: string };
        const reply = (data.text ?? "").trim();
        if (!reply) {
          setNotice(copy.trouble);
          return;
        }
        setMessages((prev) => [...prev, { role: "assistant", content: reply }]);
        speak(reply);
      } catch {
        // Network or parsing failure — fail gracefully.
        setNotice(copy.trouble);
      } finally {
        setSending(false);
      }
    },
    [messages, sending, deity, deityId, tradition, lang, speak],
  );

  // Deep-link: ?seed=... prefills the input and auto-sends the first message.
  useEffect(() => {
    if (!hydrated || seededRef.current) return;
    if (!deity) return; // wait until we know onboarding is complete
    const seed = searchParams.get("seed");
    if (seed && seed.trim()) {
      seededRef.current = true;
      setInput(seed);
      void send(seed);
    }
    // We intentionally run this once when ready; send is stable enough for our use.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hydrated, deity, searchParams]);

  // Voice input via SpeechRecognition (placeholder for a future voice feature).
  const toggleMic = useCallback(() => {
    if (listening) {
      recognitionRef.current?.stop();
      return;
    }
    const Ctor = getRecognitionCtor();
    if (!Ctor) return;
    try {
      const rec = new Ctor();
      rec.lang = speechLang;
      rec.interimResults = false;
      rec.maxAlternatives = 1;
      rec.continuous = false;
      rec.onresult = (e) => {
        const transcript = e.results[0]?.[0]?.transcript ?? "";
        if (transcript) setInput((prev) => (prev ? `${prev} ${transcript}` : transcript));
      };
      rec.onerror = () => setListening(false);
      rec.onend = () => setListening(false);
      recognitionRef.current = rec;
      rec.start();
      setListening(true);
    } catch {
      setListening(false);
    }
  }, [listening, speechLang]);

  const toggleReadAloud = useCallback(() => {
    setReadAloud((on) => {
      const next = !on;
      // If turning off mid-utterance, stop speaking immediately.
      if (!next && typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
      return next;
    });
  }, []);

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    void send(input);
  };

  const tr = (v: Localized) => t(v, lang as Lang);

  // --- Guard: calm skeleton until persisted state is available. ---
  if (!hydrated) {
    return <CompanionSkeleton />;
  }

  // --- Guard: no deity chosen yet — gently send the user to onboarding. ---
  if (!deity) {
    return (
      <div>
        <ScreenHeader title={tr(copy.title)} subtitle={tr(copy.subtitle)} />
        <Card className="text-center">
          <div className="mx-auto mb-3 text-saffron">
            <Logo size={44} />
          </div>
          <h2 className="font-serif text-xl text-ink">
            {tr(copy.needDeityTitle)}
          </h2>
          <p className="mx-auto mt-2 max-w-xs text-[15px] leading-relaxed text-muted">
            {tr(copy.needDeityBody)}
          </p>
          <Link href="/onboarding" className="mt-5 inline-block">
            <Button variant="primary">{tr(copy.finishOnboarding)}</Button>
          </Link>
        </Card>
      </div>
    );
  }

  // Per-deity accent applied via CSS var on a wrapper (documented `any` cast).
  const accentStyle = { ["--accent" as string]: deity.accent } as React.CSSProperties;

  return (
    <div style={accentStyle} className="flex min-h-[calc(100dvh-7rem)] flex-col">
      <ScreenHeader title={tr(copy.title)} subtitle={tr(copy.subtitle)} />

      {/* Grounding posture — quiet reassurance that guidance is text-rooted. */}
      <p className="-mt-3 mb-4 flex items-center gap-2 text-xs text-muted">
        <span
          aria-hidden="true"
          className="inline-block h-1.5 w-1.5 rounded-full bg-[color:var(--accent)]"
        />
        {tr(copy.grounding)}
      </p>

      {/* Transcript */}
      <div
        ref={scrollRef}
        className="flex-1 space-y-3 overflow-y-auto pb-2"
        aria-live="polite"
        aria-label={tr(copy.title)}
      >
        {messages.length === 0 ? (
          <EmptyState
            lang={lang as Lang}
            disabled={sending}
            onSeed={(text) => void send(text)}
          />
        ) : (
          messages.map((m, i) => (
            <Bubble
              key={i}
              role={m.role}
              content={m.content}
              youLabel={tr(copy.you)}
              saarthiLabel={tr(copy.saarthi)}
            />
          ))
        )}

        {sending ? <TypingIndicator label={tr(copy.thinking)} /> : null}

        {notice ? (
          <div
            role="status"
            className="rounded-2xl border border-line bg-paper px-4 py-3 text-sm leading-relaxed text-muted"
          >
            {tr(notice)}
          </div>
        ) : null}
      </div>

      {/* Composer */}
      <form onSubmit={onSubmit} className="mt-3 border-t border-line pt-3">
        <div className="flex items-end gap-2">
          {micSupported ? (
            <button
              type="button"
              onClick={toggleMic}
              aria-pressed={listening}
              aria-label={listening ? tr(copy.micStop) : tr(copy.micStart)}
              title={listening ? tr(copy.micStop) : tr(copy.micStart)}
              className={[
                "grid h-11 w-11 shrink-0 place-items-center rounded-full border transition-colors",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-saffron focus-visible:ring-offset-2 focus-visible:ring-offset-paper",
                listening
                  ? "border-transparent bg-[color:var(--accent)] text-white"
                  : "border-line bg-card text-muted hover:text-[color:var(--accent)] hover:border-[color:var(--accent)]",
              ].join(" ")}
            >
              <MicIcon />
            </button>
          ) : null}

          <label htmlFor="companion-input" className="sr-only">
            {tr(copy.inputPlaceholder)}
          </label>
          <textarea
            id="companion-input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              // Enter to send, Shift+Enter for a newline.
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                void send(input);
              }
            }}
            rows={1}
            placeholder={tr(copy.inputPlaceholder)}
            disabled={sending}
            className="max-h-32 min-h-[2.75rem] flex-1 resize-none rounded-2xl border border-line bg-card px-4 py-3 text-[15px] leading-relaxed text-ink placeholder:text-muted/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-saffron focus-visible:ring-offset-2 focus-visible:ring-offset-paper disabled:opacity-60"
          />

          <button
            type="submit"
            disabled={sending || !input.trim()}
            aria-label={tr(copy.send)}
            title={tr(copy.send)}
            className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-[color:var(--accent)] text-white transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-saffron focus-visible:ring-offset-2 focus-visible:ring-offset-paper disabled:cursor-not-allowed disabled:opacity-40"
          >
            <SendIcon />
          </button>
        </div>

        {/* Read-aloud toggle + its honest placeholder note. */}
        {ttsSupported ? (
          <div className="mt-2.5 flex items-center gap-2">
            <button
              type="button"
              onClick={toggleReadAloud}
              aria-pressed={readAloud}
              aria-label={readAloud ? tr(copy.readAloudOn) : tr(copy.readAloudOff)}
              className={[
                "inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-saffron focus-visible:ring-offset-2 focus-visible:ring-offset-paper",
                readAloud
                  ? "border-transparent bg-[color:var(--accent)] text-white"
                  : "border-line bg-card text-muted hover:text-ink",
              ].join(" ")}
            >
              <SpeakerIcon on={readAloud} />
              {readAloud ? tr(copy.readAloudOn) : tr(copy.readAloudOff)}
            </button>
            <span className="text-[11px] leading-snug text-muted/80">
              {tr(copy.voiceNote)}
            </span>
          </div>
        ) : null}
      </form>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Pieces
// ---------------------------------------------------------------------------

function EmptyState({
  lang,
  disabled,
  onSeed,
}: {
  lang: Lang;
  disabled: boolean;
  onSeed: (text: string) => void;
}) {
  return (
    <div className="pt-6 text-center">
      <div className="mx-auto mb-4 text-[color:var(--accent)]">
        <Logo size={48} />
      </div>
      <h2 className="font-serif text-xl text-ink">{t(copy.emptyTitle, lang)}</h2>
      <p className="mx-auto mt-2 max-w-xs text-[15px] leading-relaxed text-muted">
        {t(copy.emptyBody, lang)}
      </p>
      <div className="mt-5 flex flex-col items-stretch gap-2">
        {seeds.map((s, i) => (
          <button
            key={i}
            type="button"
            disabled={disabled}
            onClick={() => onSeed(t(s, lang))}
            className="rounded-2xl border border-line bg-card px-4 py-3 text-left text-sm leading-relaxed text-ink transition-colors hover:border-[color:var(--accent)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-saffron focus-visible:ring-offset-2 focus-visible:ring-offset-paper disabled:opacity-60"
          >
            {t(s, lang)}
          </button>
        ))}
      </div>
    </div>
  );
}

function Bubble({
  role,
  content,
  youLabel,
  saarthiLabel,
}: {
  role: "user" | "assistant";
  content: string;
  youLabel: string;
  saarthiLabel: string;
}) {
  const isUser = role === "user";
  return (
    <div className={isUser ? "flex justify-end" : "flex justify-start"}>
      <div className={isUser ? "max-w-[85%]" : "max-w-[88%]"}>
        <span className="mb-1 block px-1 text-[11px] font-medium text-muted">
          {isUser ? youLabel : saarthiLabel}
        </span>
        <div
          className={[
            "whitespace-pre-wrap rounded-3xl px-4 py-3 text-[15px] leading-relaxed",
            isUser
              ? "rounded-br-lg bg-[color:var(--accent)] text-white"
              : "rounded-bl-lg border border-line bg-card text-ink",
          ].join(" ")}
        >
          {content}
        </div>
      </div>
    </div>
  );
}

function TypingIndicator({ label }: { label: string }) {
  return (
    <div className="flex justify-start" role="status" aria-label={label}>
      <div className="flex items-center gap-1.5 rounded-3xl rounded-bl-lg border border-line bg-card px-4 py-3.5">
        <Dot delay="0ms" />
        <Dot delay="160ms" />
        <Dot delay="320ms" />
        <span className="sr-only">{label}</span>
      </div>
    </div>
  );
}

function Dot({ delay }: { delay: string }) {
  // Gentle pulse; honours prefers-reduced-motion via the global rule.
  return (
    <span
      aria-hidden="true"
      className="inline-block h-1.5 w-1.5 animate-breathe rounded-full bg-muted/70"
      style={{ animationDuration: "1.4s", animationDelay: delay }}
    />
  );
}

// ---------------------------------------------------------------------------
// Inline icons (stroke currentColor unless filled).
// ---------------------------------------------------------------------------
function MicIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="9" y="3" width="6" height="11" rx="3" />
      <path d="M5 11a7 7 0 0 0 14 0" />
      <path d="M12 18v3" />
    </svg>
  );
}

function SendIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M5 12h13" />
      <path d="M12 5l7 7-7 7" />
    </svg>
  );
}

function SpeakerIcon({ on }: { on: boolean }) {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M4 9v6h4l5 4V5L8 9H4z" />
      {on ? (
        <>
          <path d="M16 9a3 3 0 0 1 0 6" />
          <path d="M18.5 6.5a7 7 0 0 1 0 11" />
        </>
      ) : (
        <path d="M22 9l-6 6M16 9l6 6" />
      )}
    </svg>
  );
}
