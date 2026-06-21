"use client";

// lib/state.tsx — all app state lives client-side (React Context + localStorage).
// No database. The provider loads persisted state in an effect and exposes a
// `hydrated` flag so consumers can avoid acting on / rendering persisted state
// before it is available (prevents hydration mismatches).

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { Lang, Tradition } from "@/lib/types";

const STORAGE_KEY = "saarthi.v1";

/** Streak milestones that earn a one-time celebration. */
const MILESTONES = [7, 21, 40, 108] as const;

/** A single reflection / journal entry. */
export interface Reflection {
  id: string;
  dateISO: string;
  text: string;
  practice: string | null;
}

/** Enrollment record for a guided sadhana. */
export interface SadhanaEnrollment {
  startedISO: string;
}

/** The persisted shape of the app. Kept flat and JSON-serializable. */
interface PersistedState {
  onboarded: boolean;
  deityId: string | null;
  lang: Lang;
  tradition: Tradition | null;
  sankalpTime: string | null; // "HH:MM" local time the user commits to
  streak: number;
  lastCompleted: string | null; // ISO date "YYYY-MM-DD"
  completedDates: string[]; // ISO dates, ascending
  reflections: Reflection[]; // newest first
  sadhanaEnrollments: Record<string, SadhanaEnrollment>;
  lastIntention: string | null;
  milestonesSeen: number[]; // streak milestones already celebrated
}

const DEFAULT_STATE: PersistedState = {
  onboarded: false,
  deityId: null,
  lang: "en",
  tradition: null,
  sankalpTime: null,
  streak: 0,
  lastCompleted: null,
  completedDates: [],
  reflections: [],
  sadhanaEnrollments: {},
  lastIntention: null,
  milestonesSeen: [],
};

/** The full value exposed by useSaarthi(). */
export interface SaarthiContextValue extends PersistedState {
  hydrated: boolean;
  setDeity(id: string): void;
  setLang(l: Lang): void;
  setTradition(t: Tradition): void;
  setSankalpTime(time: string): void;
  completeOnboarding(): void;
  markPracticeDone(): {
    alreadyDone: boolean;
    streak: number;
    newMilestone: number | null;
  };
  isCompletedToday(): boolean;
  addReflection(text: string, practice?: string): void;
  deleteReflection(id: string): void;
  setIntention(text: string): void;
  enrollSadhana(id: string): void;
  isEnrolled(id: string): boolean;
  sadhanaDay(id: string, totalDays: number): number;
  resetAll(): void;
}

const SaarthiContext = createContext<SaarthiContextValue | null>(null);

// ---------------------------------------------------------------------------
// Date helpers (exported per the contract).
// ---------------------------------------------------------------------------

/** Today's date as a local "YYYY-MM-DD" string. */
export function todayISO(): string {
  return toISO(new Date());
}

/** Format a Date as local "YYYY-MM-DD" (no timezone shift). */
function toISO(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

/** Local "YYYY-MM-DD" for `offset` days from today (negative = past). */
function isoOffset(offset: number): string {
  const d = new Date();
  d.setDate(d.getDate() + offset);
  return toISO(d);
}

/** Whole days elapsed between two local "YYYY-MM-DD" dates (to - from). */
function daysBetween(fromISO: string, toISODate: string): number {
  const from = new Date(`${fromISO}T00:00:00`);
  const to = new Date(`${toISODate}T00:00:00`);
  const ms = to.getTime() - from.getTime();
  return Math.round(ms / 86_400_000);
}

/**
 * The last 7 days, oldest → newest, ending today. Each entry marks whether the
 * practice was completed on that date. Used by the streak/calendar widgets.
 */
export function last7Days(
  completedDates: string[],
): { date: string; done: boolean }[] {
  const set = new Set(completedDates);
  const out: { date: string; done: boolean }[] = [];
  for (let i = 6; i >= 0; i--) {
    const date = isoOffset(-i);
    out.push({ date, done: set.has(date) });
  }
  return out;
}

// ---------------------------------------------------------------------------
// Provider
// ---------------------------------------------------------------------------

export function SaarthiProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<PersistedState>(DEFAULT_STATE);
  const [hydrated, setHydrated] = useState(false);

  // Load persisted state once, on the client.
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as Partial<PersistedState>;
        // Merge over defaults so missing/new keys are always present.
        setState({ ...DEFAULT_STATE, ...parsed });
      }
    } catch {
      // Corrupt or unavailable storage — fall back to defaults silently.
    } finally {
      setHydrated(true);
    }
  }, []);

  // Persist on every change — but only AFTER hydration has applied. We gate on
  // the `hydrated` *state*, not a ref: the load effect above runs earlier in the
  // same commit, so a ref flipped there would already read true here and persist
  // the still-default `state`, clobbering saved data on the first page load.
  // Gating on `hydrated` (false until the load effect's setState re-renders)
  // guarantees the first persisted value is the loaded one, not the default.
  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // Storage may be full or blocked; the in-memory state still works.
    }
  }, [state, hydrated]);

  const setDeity = useCallback((id: string) => {
    setState((s) => ({ ...s, deityId: id }));
  }, []);

  const setLang = useCallback((l: Lang) => {
    setState((s) => ({ ...s, lang: l }));
  }, []);

  const setTradition = useCallback((tr: Tradition) => {
    setState((s) => ({ ...s, tradition: tr }));
  }, []);

  const setSankalpTime = useCallback((time: string) => {
    setState((s) => ({ ...s, sankalpTime: time }));
  }, []);

  const completeOnboarding = useCallback(() => {
    setState((s) => ({ ...s, onboarded: true }));
  }, []);

  const isCompletedToday = useCallback(() => {
    return state.lastCompleted === todayISO();
  }, [state.lastCompleted]);

  /**
   * Mark today's practice complete and recompute the streak.
   * - already done today → no change, alreadyDone:true, newMilestone:null
   * - last done yesterday → streak + 1
   * - otherwise           → streak resets to 1
   * If the resulting streak hits an uncelebrated milestone (7/21/40/108),
   * record it and report it once via `newMilestone`.
   */
  const markPracticeDone = useCallback((): {
    alreadyDone: boolean;
    streak: number;
    newMilestone: number | null;
  } => {
    const today = todayISO();
    const yesterday = isoOffset(-1);

    // Read-then-decide synchronously so we can return the right value.
    let result: {
      alreadyDone: boolean;
      streak: number;
      newMilestone: number | null;
    } = {
      alreadyDone: false,
      streak: state.streak,
      newMilestone: null,
    };

    setState((s) => {
      if (s.lastCompleted === today) {
        result = { alreadyDone: true, streak: s.streak, newMilestone: null };
        return s;
      }
      const nextStreak = s.lastCompleted === yesterday ? s.streak + 1 : 1;
      const completedDates = s.completedDates.includes(today)
        ? s.completedDates
        : [...s.completedDates, today];

      const isMilestone = (MILESTONES as readonly number[]).includes(nextStreak);
      const newMilestone =
        isMilestone && !s.milestonesSeen.includes(nextStreak)
          ? nextStreak
          : null;
      const milestonesSeen =
        newMilestone !== null
          ? [...s.milestonesSeen, newMilestone]
          : s.milestonesSeen;

      result = { alreadyDone: false, streak: nextStreak, newMilestone };
      return {
        ...s,
        streak: nextStreak,
        lastCompleted: today,
        completedDates,
        milestonesSeen,
      };
    });

    return result;
  }, [state.streak]);

  const addReflection = useCallback((text: string, practice?: string) => {
    setState((s) => ({
      ...s,
      reflections: [
        {
          id: `r_${Date.now()}`,
          dateISO: todayISO(),
          text,
          practice: practice ?? null,
        },
        ...s.reflections,
      ],
    }));
  }, []);

  const deleteReflection = useCallback((id: string) => {
    setState((s) => ({
      ...s,
      reflections: s.reflections.filter((r) => r.id !== id),
    }));
  }, []);

  const setIntention = useCallback((text: string) => {
    const trimmed = text.trim();
    setState((s) => ({ ...s, lastIntention: trimmed === "" ? null : trimmed }));
  }, []);

  const enrollSadhana = useCallback((id: string) => {
    setState((s) => {
      if (s.sadhanaEnrollments[id]) return s;
      return {
        ...s,
        sadhanaEnrollments: {
          ...s.sadhanaEnrollments,
          [id]: { startedISO: todayISO() },
        },
      };
    });
  }, []);

  const isEnrolled = useCallback(
    (id: string) => Boolean(state.sadhanaEnrollments[id]),
    [state.sadhanaEnrollments],
  );

  const sadhanaDay = useCallback(
    (id: string, totalDays: number) => {
      const enrollment = state.sadhanaEnrollments[id];
      if (!enrollment) return 0;
      const elapsed = daysBetween(enrollment.startedISO, todayISO());
      return Math.min(elapsed + 1, totalDays);
    },
    [state.sadhanaEnrollments],
  );

  const resetAll = useCallback(() => {
    setState(DEFAULT_STATE);
    try {
      window.localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
  }, []);

  const value = useMemo<SaarthiContextValue>(
    () => ({
      ...state,
      hydrated,
      setDeity,
      setLang,
      setTradition,
      setSankalpTime,
      completeOnboarding,
      markPracticeDone,
      isCompletedToday,
      addReflection,
      deleteReflection,
      setIntention,
      enrollSadhana,
      isEnrolled,
      sadhanaDay,
      resetAll,
    }),
    [
      state,
      hydrated,
      setDeity,
      setLang,
      setTradition,
      setSankalpTime,
      completeOnboarding,
      markPracticeDone,
      isCompletedToday,
      addReflection,
      deleteReflection,
      setIntention,
      enrollSadhana,
      isEnrolled,
      sadhanaDay,
      resetAll,
    ],
  );

  return (
    <SaarthiContext.Provider value={value}>{children}</SaarthiContext.Provider>
  );
}

/** Access the Saarthi app state. Must be used within <SaarthiProvider>. */
export function useSaarthi(): SaarthiContextValue {
  const ctx = useContext(SaarthiContext);
  if (!ctx) {
    throw new Error("useSaarthi must be used within <SaarthiProvider>");
  }
  return ctx;
}
