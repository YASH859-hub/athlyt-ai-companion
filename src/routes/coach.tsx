import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUp, Mic, Plus, Dumbbell, Apple, HeartPulse } from "lucide-react";
import { AppShell } from "@/components/AppShell";

export const Route = createFileRoute("/coach")({
  head: () => ({
    meta: [
      { title: "ATHLYT — Coach" },
      { name: "description", content: "Your personal AI coach." },
    ],
  }),
  component: Coach,
});

type Msg =
  | { role: "ai" | "user"; kind: "text"; text: string }
  | { role: "ai"; kind: "workout"; title: string; sub: string; min: number }
  | { role: "ai"; kind: "meal"; title: string; protein: number; kcal: number };

const seed: Msg[] = [
  {
    role: "ai",
    kind: "text",
    text: "Morning, Om. You slept 7h 12m. Recovery is good — let's lock in a focused push session.",
  },
];

const prompts = [
  { label: "20-min upper body", icon: Dumbbell },
  { label: "Plan dinner", icon: Apple },
  { label: "Am I recovered?", icon: HeartPulse },
];

function Coach() {
  const [messages, setMessages] = useState<Msg[]>(seed);
  const [draft, setDraft] = useState("");

  const send = (text: string) => {
    const t = text.trim();
    if (!t) return;
    setMessages((m) => [...m, { role: "user", kind: "text", text: t }]);
    setDraft("");
    setTimeout(() => {
      setMessages((m) => [
        ...m,
        {
          role: "ai",
          kind: "text",
          text: "On it. Here's something tailored to where you are this week.",
        },
        {
          role: "ai",
          kind: "workout",
          title: "Express Push",
          sub: "5 exercises · low joint stress",
          min: 22,
        },
      ]);
    }, 600);
  };

  return (
    <AppShell>
      <div className="flex min-h-[100dvh] flex-col">
        {/* Header */}
        <header className="sticky top-0 z-10 flex items-center justify-between border-b border-border bg-background/85 px-6 py-4 backdrop-blur-2xl">
          <div className="flex items-center gap-3">
            <span className="relative grid h-9 w-9 place-items-center rounded-full bg-surface">
              <span className="absolute h-2 w-2 rounded-full bg-success animate-breath" />
            </span>
            <div>
              <p className="text-[15px] font-semibold leading-tight">ATHLYT</p>
              <p className="text-[11px] text-muted-foreground">Personal coach · online</p>
            </div>
          </div>
          <button className="grid h-9 w-9 place-items-center rounded-full bg-surface" aria-label="New">
            <Plus className="h-4 w-4" />
          </button>
        </header>

        <div className="flex-1 space-y-5 px-6 pb-40 pt-8">
          <AnimatePresence initial={false}>
            {messages.map((m, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                className={m.role === "user" ? "flex justify-end" : ""}
              >
                {m.kind === "text" && m.role === "ai" && (
                  <p className="max-w-[88%] text-[16px] leading-relaxed text-foreground/95">
                    {m.text}
                  </p>
                )}
                {m.kind === "text" && m.role === "user" && (
                  <div className="max-w-[82%] rounded-3xl rounded-br-md bg-primary px-4 py-3 text-[15px] font-medium text-primary-foreground">
                    {m.text}
                  </div>
                )}
                {m.kind === "workout" && (
                  <div className="max-w-[92%] overflow-hidden rounded-3xl border border-border bg-surface">
                    <div
                      className="h-24"
                      style={{
                        background:
                          "linear-gradient(120deg, rgba(139,92,246,0.35), rgba(199,255,47,0.15))",
                      }}
                    />
                    <div className="p-5">
                      <p className="text-[10px] uppercase tracking-[0.28em] text-muted-foreground">
                        Recommended workout
                      </p>
                      <p className="mt-2 text-xl font-semibold tracking-tight">{m.title}</p>
                      <p className="mt-1 text-sm text-muted-foreground">{m.sub} · {m.min} min</p>
                      <button className="mt-4 w-full rounded-full bg-primary py-3 text-sm font-semibold text-primary-foreground">
                        Start workout
                      </button>
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Composer + suggestions */}
        <div className="fixed bottom-0 left-1/2 z-30 w-full max-w-[480px] -translate-x-1/2 bg-gradient-to-t from-background via-background to-transparent px-4 pb-20 pt-6">
          <div className="mb-3 flex gap-2 overflow-x-auto [&::-webkit-scrollbar]:hidden">
            {prompts.map((p) => (
              <button
                key={p.label}
                onClick={() => send(p.label)}
                className="inline-flex shrink-0 items-center gap-2 rounded-full border border-border bg-surface px-3.5 py-2 text-xs text-foreground/90"
              >
                <p.icon className="h-3.5 w-3.5 text-muted-foreground" />
                {p.label}
              </button>
            ))}
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              send(draft);
            }}
            className="flex items-end gap-2 rounded-3xl border border-border bg-surface px-2 py-2"
          >
            <textarea
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder="Message ATHLYT"
              rows={1}
              className="flex-1 resize-none bg-transparent px-3 py-3 text-[15px] outline-none placeholder:text-muted-foreground"
            />
            {draft.trim() ? (
              <button
                type="submit"
                aria-label="Send"
                className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-primary text-primary-foreground"
              >
                <ArrowUp className="h-5 w-5" strokeWidth={2.8} />
              </button>
            ) : (
              <button
                type="button"
                aria-label="Voice"
                className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-foreground text-background"
              >
                <Mic className="h-5 w-5" />
              </button>
            )}
          </form>
        </div>
      </div>
    </AppShell>
  );
}
