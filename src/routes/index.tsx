import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowUpRight, Clock3, Sparkle } from "lucide-react";
import { AppShell } from "@/components/AppShell";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "ATHLYT — Today" },
      { name: "description", content: "Your personal AI transformation coach." },
    ],
  }),
  component: Home,
});

const suggestions = [
  "I only have 20 minutes",
  "Plan my meals",
  "Adjust today's workout",
  "Check my recovery",
];

function Home() {
  return (
    <AppShell>
      <div className="px-6 pt-16">
        {/* Greeting */}
        <motion.header
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <p className="text-[11px] uppercase tracking-[0.3em] text-muted-foreground">
            Tuesday · 06:48
          </p>
          <h1 className="mt-3 text-[40px] font-semibold leading-[1.05] tracking-tight">
            Good morning,<br />Om.
          </h1>
        </motion.header>

        {/* Hero AI insight */}
        <motion.section
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.6 }}
          className="mt-10"
        >
          <div className="flex items-center gap-2">
            <span className="grid h-5 w-5 place-items-center rounded-full bg-primary/15">
              <Sparkle className="h-3 w-3 text-primary" strokeWidth={2.5} />
            </span>
            <p className="text-[11px] uppercase tracking-[0.28em] text-muted-foreground">
              ATHLYT · Insight
            </p>
          </div>
          <p className="mt-4 text-[26px] font-medium leading-[1.2] tracking-tight text-balance text-foreground/95">
            You're <span className="text-primary">2 workouts</span> away from your strongest month ever.
          </p>
        </motion.section>

        {/* Today's Focus — single primary action */}
        <motion.section
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="mt-12"
        >
          <p className="text-[11px] uppercase tracking-[0.3em] text-muted-foreground">
            Today's Focus
          </p>

          <div className="mt-4 overflow-hidden rounded-[28px] border border-border bg-surface">
            <div className="relative h-56 overflow-hidden">
              <div
                className="absolute inset-0"
                style={{
                  background:
                    "radial-gradient(120% 80% at 80% 20%, rgba(139,92,246,0.32), transparent 60%), radial-gradient(80% 100% at 10% 100%, rgba(199,255,47,0.18), transparent 60%), #121212",
                }}
              />
              <div className="absolute left-6 top-6">
                <p className="text-[10px] uppercase tracking-[0.32em] text-white/60">
                  Push Day
                </p>
                <p className="mt-2 text-3xl font-semibold tracking-tight">
                  Chest & Triceps
                </p>
              </div>
              <div className="absolute bottom-6 left-6 flex items-center gap-4 text-sm text-white/70">
                <span className="inline-flex items-center gap-1.5">
                  <Clock3 className="h-3.5 w-3.5" /> 25 min
                </span>
                <span>·</span>
                <span>4 exercises</span>
                <span>·</span>
                <span>Level 3</span>
              </div>
            </div>

            <Link
              to="/train"
              className="flex items-center justify-between gap-4 bg-primary px-6 py-5 text-primary-foreground transition active:scale-[0.99]"
            >
              <span className="text-base font-semibold tracking-tight">
                Start session
              </span>
              <span className="grid h-9 w-9 place-items-center rounded-full bg-black/10">
                <ArrowUpRight className="h-4 w-4" strokeWidth={2.5} />
              </span>
            </Link>
          </div>
        </motion.section>

        {/* Coach suggestions */}
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.35, duration: 0.6 }}
          className="mt-12"
        >
          <div className="flex items-baseline justify-between">
            <p className="text-[11px] uppercase tracking-[0.3em] text-muted-foreground">
              Ask your coach
            </p>
            <Link to="/coach" className="text-xs text-muted-foreground">
              Open →
            </Link>
          </div>

          <ul className="mt-4 divide-y divide-border rounded-3xl border border-border bg-surface/60">
            {suggestions.map((s) => (
              <li key={s}>
                <Link
                  to="/coach"
                  className="flex items-center justify-between px-5 py-4 transition active:bg-white/[0.03]"
                >
                  <span className="text-[15px] text-foreground/90">{s}</span>
                  <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
                </Link>
              </li>
            ))}
          </ul>
        </motion.section>

        <p className="mt-12 text-center text-[10px] uppercase tracking-[0.32em] text-muted-foreground/60">
          Stay present · Move with intent
        </p>
      </div>
    </AppShell>
  );
}
