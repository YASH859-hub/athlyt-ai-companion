import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { AppShell } from "@/components/AppShell";

export const Route = createFileRoute("/progress")({
  head: () => ({
    meta: [
      { title: "ATHLYT — Transformation" },
      { name: "description", content: "Your transformation journey." },
    ],
  }),
  component: Progress,
});

const timeline = [
  { week: "Week 1", title: "The first rep", body: "You showed up. That's the rep that counts.", weight: "76.4 kg", state: "past" },
  { week: "Week 4", title: "Disciplined", body: "+8% bench. Resting HR down 4 bpm.", weight: "75.1 kg", state: "current" },
  { week: "Week 8", title: "Athlete", body: "Bodyweight pull-ups, unbroken.", weight: "—", state: "future" },
  { week: "Week 12", title: "A new baseline", body: "Composition shift visible.", weight: "—", state: "future" },
];

const trends = [
  { label: "Strength", value: "+12%" },
  { label: "Resting HR", value: "−4" },
  { label: "Weight", value: "−1.3" },
];

function Progress() {
  return (
    <AppShell>
      <div className="px-6 pt-16">
        <header>
          <p className="text-[11px] uppercase tracking-[0.3em] text-muted-foreground">
            28 days in
          </p>
          <h1 className="mt-3 text-[40px] font-semibold leading-[1.05] tracking-tight">
            You are becoming<br />
            <span className="text-muted-foreground">someone new.</span>
          </h1>
        </header>

        {/* Level */}
        <motion.section
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-10 rounded-[28px] border border-border bg-surface p-6"
        >
          <div className="flex items-baseline justify-between">
            <p className="text-[11px] uppercase tracking-[0.3em] text-muted-foreground">
              Level 3
            </p>
            <p className="text-[11px] text-muted-foreground">2,140 / 3,000 XP</p>
          </div>
          <p className="mt-3 text-3xl font-semibold tracking-tight">Disciplined</p>
          <div className="mt-5 h-1 overflow-hidden rounded-full bg-white/6">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: "71%" }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="h-full rounded-full bg-primary"
            />
          </div>
          <p className="mt-3 text-xs text-muted-foreground">
            860 XP to <span className="text-foreground">Athlete</span>
          </p>
        </motion.section>

        {/* Trends — minimal */}
        <section className="mt-8 grid grid-cols-3 gap-px overflow-hidden rounded-[24px] border border-border bg-border">
          {trends.map((t) => (
            <div key={t.label} className="bg-background p-5">
              <p className="text-2xl font-semibold tracking-tight">{t.value}</p>
              <p className="mt-2 text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
                {t.label}
              </p>
            </div>
          ))}
        </section>

        {/* Timeline */}
        <section className="mt-12">
          <p className="text-[11px] uppercase tracking-[0.3em] text-muted-foreground">
            Transformation timeline
          </p>
          <ol className="relative mt-6">
            <span className="absolute left-[5px] top-2 bottom-2 w-px bg-border" />
            {timeline.map((m, i) => {
              const active = m.state === "current";
              const future = m.state === "future";
              return (
                <li key={i} className="relative pb-10 pl-7 last:pb-0">
                  <span
                    className={`absolute left-0 top-2 h-2.5 w-2.5 rounded-full ${
                      active ? "bg-primary ring-4 ring-primary/20" : future ? "bg-white/15" : "bg-foreground"
                    }`}
                  />
                  <p className={`text-[11px] uppercase tracking-[0.28em] ${active ? "text-primary" : "text-muted-foreground"}`}>
                    {m.week}
                  </p>
                  <p className={`mt-1 text-xl font-semibold tracking-tight ${future ? "text-muted-foreground" : ""}`}>
                    {m.title}
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">{m.body}</p>
                  {m.weight !== "—" && (
                    <p className="mt-2 text-[11px] uppercase tracking-wider text-muted-foreground">
                      {m.weight}
                    </p>
                  )}
                </li>
              );
            })}
          </ol>
        </section>
      </div>
    </AppShell>
  );
}
