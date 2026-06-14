import { createFileRoute } from "@tanstack/react-router";
import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowUp, Mic, Plus, Dumbbell, Apple, HeartPulse } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { AppShell } from "@/components/AppShell";
import { useApp } from "@/lib/store";
import { useServerFn } from "@tanstack/react-start";
import { askCoach } from "@/lib/coach.functions";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_authenticated/coach")({
  head: () => ({ meta: [{ title: "ATHLYT — Coach" }] }),
  component: Coach,
});

const prompts = [
  { label: "20-min upper body", icon: Dumbbell },
  { label: "Plan dinner", icon: Apple },
  { label: "Am I recovered?", icon: HeartPulse },
];

function Coach() {
  const messages = useApp((s) => s.messages);
  const addMessage = useApp((s) => s.addMessage);
  const clear = useApp((s) => s.clearMessages);
  const [draft, setDraft] = useState("");
  const [sending, setSending] = useState(false);
  const fn = useServerFn(askCoach);
  const endRef = useRef<HTMLDivElement>(null);

  const { data: profile } = useQuery({
    queryKey: ["profile-light"],
    queryFn: async () => {
      const { data: u } = await supabase.auth.getUser();
      if (!u.user) return null;
      const { data } = await supabase
        .from("profiles")
        .select("name,goal,diet,experience")
        .eq("id", u.user.id)
        .maybeSingle();
      return data;
    },
  });

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length, sending]);

  const send = async (text: string) => {
    const t = text.trim();
    if (!t || sending) return;
    addMessage({ role: "user", text: t });
    setDraft("");
    setSending(true);
    const history = [...messages, { role: "user" as const, text: t }].slice(-12).map((m) => ({
      role: (m.role === "ai" ? "assistant" : "user") as "user" | "assistant",
      content: m.text,
    }));
    try {
      const res = await fn({ data: { messages: history, profile: profile ?? undefined } });
      addMessage({ role: "ai", text: res.text });
    } catch {
      addMessage({ role: "ai", text: "Something went wrong. Try again." });
    } finally {
      setSending(false);
    }
  };

  return (
    <AppShell>
      <div className="flex min-h-[100dvh] flex-col">
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
          <button
            onClick={clear}
            aria-label="New chat"
            className="grid h-9 w-9 place-items-center rounded-full bg-surface"
          >
            <Plus className="h-4 w-4" />
          </button>
        </header>

        <div className="flex-1 space-y-5 px-6 pb-44 pt-8">
          {messages.map((m) => (
            <motion.div
              key={m.id}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              className={m.role === "user" ? "flex justify-end" : ""}
            >
              {m.role === "ai" ? (
                <div className="prose prose-invert prose-sm max-w-[90%] [&>*]:!my-1.5 [&_p]:text-[16px] [&_p]:leading-relaxed text-foreground/95">
                  <ReactMarkdown>{m.text}</ReactMarkdown>
                </div>
              ) : (
                <div className="max-w-[82%] rounded-3xl rounded-br-md bg-primary px-4 py-3 text-[15px] font-medium text-primary-foreground">
                  {m.text}
                </div>
              )}
            </motion.div>
          ))}
          {sending && (
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground [animation-delay:-0.3s]" />
              <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground [animation-delay:-0.15s]" />
              <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground" />
            </div>
          )}
          <div ref={endRef} />
        </div>

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
                disabled={sending}
                aria-label="Send"
                className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-primary text-primary-foreground disabled:opacity-50"
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
