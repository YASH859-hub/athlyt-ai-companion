import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mic, ArrowUp, Sparkles } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import orb from "@/assets/athlyt-orb.jpg";

export const Route = createFileRoute("/coach")({
  head: () => ({ meta: [{ title: "ATHLYT Coach" }, { name: "description", content: "Conversational AI coaching." }] }),
  component: Coach,
});

type Msg = { role: "user" | "ai"; text: string };

const seed: Msg[] = [
  { role: "ai", text: "Morning, Om. Ready to move? I noticed you slept 7h12m — a great push day is in range." },
];

const prompts = [
  "Build me a 25-min push session",
  "What should I eat post-workout?",
  "I'm sore — recovery plan?",
  "Log: 4 eggs and 2 rotis",
];

function Coach() {
  const [messages, setMessages] = useState<Msg[]>(seed);
  const [draft, setDraft] = useState("");

  const send = (text: string) => {
    const t = text.trim();
    if (!t) return;
    setMessages((m) => [...m, { role: "user", text: t }]);
    setDraft("");
    setTimeout(() => {
      setMessages((m) => [
        ...m,
        { role: "ai", text: "Locked in. I'll tailor that to your week — give me a sec to design it around your recovery." },
      ]);
    }, 700);
  };

  return (
    <AppShell>
      <div className="flex min-h-[100dvh] flex-col px-5 pt-12">
        <header className="flex items-center gap-3">
          <img src={orb} alt="" width={44} height={44} className="h-11 w-11 animate-float-orb rounded-full" />
          <div className="min-w-0">
            <p className="text-base font-semibold">ATHLYT</p>
            <p className="text-xs text-primary">● Coaching live</p>
          </div>
        </header>

        <div className="mt-8 flex-1 space-y-4">
          <AnimatePresence initial={false}>
            {messages.map((m, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
              >
                {m.role === "ai" ? (
                  <p className="max-w-[85%] text-[15px] leading-relaxed text-foreground">{m.text}</p>
                ) : (
                  <div className="max-w-[85%] rounded-3xl rounded-br-md bg-primary px-4 py-3 text-[15px] font-medium leading-snug text-primary-foreground">
                    {m.text}
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Suggested prompts */}
        <div className="-mx-5 mt-6 flex gap-2 overflow-x-auto px-5 pb-2 [&::-webkit-scrollbar]:hidden">
          {prompts.map((p) => (
            <button
              key={p}
              onClick={() => send(p)}
              className="shrink-0 rounded-full border border-border bg-surface/60 px-4 py-2 text-xs font-medium text-muted-foreground"
            >
              {p}
            </button>
          ))}
        </div>

        {/* Composer */}
        <form
          onSubmit={(e) => { e.preventDefault(); send(draft); }}
          className="sticky bottom-28 mt-3 mb-4 flex items-end gap-2 glass rounded-3xl p-2"
        >
          <button type="button" className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-white/5" aria-label="Voice">
            <Mic className="h-5 w-5 text-muted-foreground" />
          </button>
          <textarea
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="Ask ATHLYT anything…"
            rows={1}
            className="flex-1 resize-none bg-transparent px-2 py-3 text-[15px] outline-none placeholder:text-muted-foreground"
          />
          <button
            type="submit"
            aria-label="Send"
            className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-primary text-primary-foreground disabled:opacity-40"
            disabled={!draft.trim()}
          >
            {draft.trim() ? <ArrowUp className="h-5 w-5" strokeWidth={3} /> : <Sparkles className="h-5 w-5" />}
          </button>
        </form>
      </div>
    </AppShell>
  );
}
