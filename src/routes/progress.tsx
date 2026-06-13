import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Trophy, Flame, Dumbbell, Heart } from "lucide-react";
import { AppShell } from "@/components/AppShell";

export const Route = createFileRoute("/progress")({
  head: () => ({ meta: [{ title: "ATHLYT — Transformation" }, { name: "description", content: "Your transformation timeline." }] }),
  component: Progress,
});

const milestones = [
  { week: "Week 1", title: "First session logged", body: "The hardest rep is the first one." },
  { week: "Week 2", title: "Hit protein goal 5×", body: "Consistency unlocked." },
  { week: "Week 3", title: "+8% bench strength", body: "Your body is adapting." },
  { week: "Week 4", title: "Disciplined — Level 3", body: "You're becoming someone new." },
];

const trends = [
  { icon: Dumbbell, label: "Strength", value: "+12%", tone: "text-primary" },
  { icon: Heart, label: "Resting HR", value: "−4 bpm", tone: "text-primary" },
  { icon: Flame, label: "Weight", value: "−2.4 kg", tone: "text-primary" },
];

function Progress() {
  return (
    <AppShell>
      <div className="px-6 pt-12">
        <header>
          <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground">Your transformation</p>
          <h1 className="mt-2 text-4xl font-semibold tracking-tight">28 days in.<br /><span className="text-muted-foreground">A new chapter.</span></h1>
        </header>

        {/* Level */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 overflow-hidden rounded-3xl border border-border p-5"
          style={{ backgroundImage: "var(--gradient-mission)" }}
        >
          <div className="flex items-center gap-3">
            <span className="grid h-11 w-11 place-items-center rounded-2xl bg-primary text-primary-foreground">
              <Trophy className="h-5 w-5" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-xs uppercase tracking-wider text-muted-foreground">Level 3</p>
              <p className="text-lg font-semibold">Disciplined</p>
            </div>
            <p className="text-sm font-medium text-primary">2,140 / 3,000 XP</p>
          </div>
          <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/8">
            <div className="h-full rounded-full bg-primary" style={{ width: "71%" }} />
          </div>
          <p className="mt-3 text-xs text-muted-foreground">860 XP to <span className="text-foreground">Athlete</span></p>
        </motion.div>

        {/* Before / After */}
        <section className="mt-8">
          <h3 className="text-sm font-medium uppercase tracking-[0.18em] text-muted-foreground">Visual progress</h3>
          <div className="mt-3 grid grid-cols-2 gap-3">
            {["Day 1", "Day 28"].map((label, i) => (
              <div key={label} className="relative aspect-[3/4] overflow-hidden rounded-3xl border border-border"
                style={{ background: i === 0
                  ? "linear-gradient(180deg, #1a1a1a, #0B0B0B)"
                  : "linear-gradient(180deg, rgba(198,255,45,0.18), rgba(139,92,246,0.18), #0B0B0B)" }}>
                <div className="absolute inset-x-4 bottom-4">
                  <p className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground">{label}</p>
                  <p className="text-base font-semibold">{i === 0 ? "76.4 kg" : "74.0 kg"}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Trends */}
        <section className="mt-8 grid grid-cols-3 gap-3">
          {trends.map((t) => (
            <div key={t.label} className="rounded-2xl border border-border bg-surface/60 p-4">
              <t.icon className="h-4 w-4 text-muted-foreground" />
              <p className={`mt-3 text-lg font-semibold ${t.tone}`}>{t.value}</p>
              <p className="text-[11px] uppercase tracking-wider text-muted-foreground">{t.label}</p>
            </div>
          ))}
        </section>

        {/* Timeline */}
        <section className="mt-10">
          <h3 className="text-sm font-medium uppercase tracking-[0.18em] text-muted-foreground">Timeline</h3>
          <ol className="mt-4 relative">
            <span className="absolute left-[7px] top-1 bottom-1 w-px bg-border" />
            {milestones.map((m, i) => (
              <li key={i} className="relative pl-7 pb-6 last:pb-0">
                <span className="absolute left-0 top-1.5 grid h-4 w-4 place-items-center rounded-full bg-primary">
                  <span className="h-1.5 w-1.5 rounded-full bg-black" />
                </span>
                <p className="text-[11px] uppercase tracking-wider text-muted-foreground">{m.week}</p>
                <p className="mt-0.5 font-semibold">{m.title}</p>
                <p className="text-sm text-muted-foreground">{m.body}</p>
              </li>
            ))}
          </ol>
        </section>
      </div>
    </AppShell>
  );
}
