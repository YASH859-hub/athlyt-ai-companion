import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Flame, Droplets, Footprints, Beef, Timer, ChevronRight, Mic, Utensils, Zap } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { MissionRing } from "@/components/MissionRing";
import orb from "@/assets/athlyt-orb.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "ATHLYT — Today's Mission" },
      { name: "description", content: "Your personal AI coach for transformation." },
    ],
  }),
  component: Home,
});

const stats = [
  { icon: Timer, label: "Workout", value: "25", unit: "min", pct: 60 },
  { icon: Beef, label: "Protein", value: "82", unit: "/120g", pct: 68 },
  { icon: Footprints, label: "Steps", value: "5.4k", unit: "/8k", pct: 67 },
  { icon: Droplets, label: "Hydration", value: "1.8", unit: "/3L", pct: 60 },
];

const quickActions = [
  { label: "I only have 20 mins", icon: Zap },
  { label: "Plan today's meals", icon: Utensils },
  { label: "Generate workout", icon: Flame },
  { label: "Track my food", icon: Mic },
];

function Home() {
  return (
    <AppShell>
      <div className="px-6 pt-14">
        {/* Greeting */}
        <motion.header
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-start justify-between"
        >
          <div className="min-w-0">
            <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground">Tuesday · Week 4</p>
            <h1 className="mt-2 text-4xl font-semibold tracking-tight text-balance">
              Good morning,<br />
              <span className="shimmer">Om.</span>
            </h1>
          </div>
          <img src={orb} alt="" width={56} height={56} className="h-14 w-14 shrink-0 animate-float-orb rounded-full" />
        </motion.header>

        {/* AI insight */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.5 }}
          className="mt-6 rounded-3xl border border-border bg-surface/60 p-5"
        >
          <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-primary">ATHLYT insight</p>
          <p className="mt-2 text-lg font-medium leading-snug text-balance">
            You're <span className="text-primary">3 workouts</span> away from your best month ever.
          </p>
        </motion.div>

        {/* Mission */}
        <section className="mt-8">
          <div className="mb-4 flex items-end justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">Today's Mission</p>
              <h2 className="mt-1 text-2xl font-semibold">Build the streak</h2>
            </div>
            <span className="rounded-full bg-primary/15 px-3 py-1 text-xs font-semibold text-primary">+220 XP</span>
          </div>

          <div
            className="relative overflow-hidden rounded-[2rem] border border-border p-6"
            style={{ backgroundImage: "var(--gradient-mission)" }}
          >
            <div className="flex items-center gap-6">
              <MissionRing value={64} label="Complete" sub="3 / 4 goals" />
              <div className="grid flex-1 gap-3">
                {stats.map((s) => (
                  <div key={s.label} className="flex items-center gap-3">
                    <span className="grid h-9 w-9 place-items-center rounded-xl bg-white/5">
                      <s.icon className="h-4 w-4 text-primary" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-baseline justify-between">
                        <span className="text-xs uppercase tracking-wider text-muted-foreground">{s.label}</span>
                        <span className="text-sm font-medium">
                          {s.value}<span className="text-muted-foreground">{s.unit}</span>
                        </span>
                      </div>
                      <div className="mt-1 h-1 overflow-hidden rounded-full bg-white/8">
                        <div className="h-full rounded-full bg-primary" style={{ width: `${s.pct}%` }} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <Link
              to="/train"
              className="mt-6 flex items-center justify-between rounded-2xl bg-primary px-5 py-4 text-primary-foreground"
            >
              <span className="font-semibold">Start today's session</span>
              <ChevronRight className="h-5 w-5" />
            </Link>
          </div>
        </section>

        {/* Quick actions */}
        <section className="mt-10">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-sm font-medium uppercase tracking-[0.18em] text-muted-foreground">Talk to ATHLYT</h3>
            <Link to="/coach" className="text-xs font-medium text-primary">Open chat →</Link>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {quickActions.map((a) => (
              <Link
                key={a.label}
                to="/coach"
                className="group rounded-2xl border border-border bg-surface/60 p-4 transition active:scale-[0.98]"
              >
                <a.icon className="h-5 w-5 text-primary" />
                <p className="mt-3 text-sm font-medium leading-snug text-balance">{a.label}</p>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </AppShell>
  );
}
