import { createFileRoute } from "@tanstack/react-router";
import { ChevronRight, Settings2 } from "lucide-react";
import { AppShell } from "@/components/AppShell";

export const Route = createFileRoute("/profile")({
  head: () => ({
    meta: [
      { title: "ATHLYT — Athlete" },
      { name: "description", content: "Your athlete identity." },
    ],
  }),
  component: Profile,
});

const ranks = [
  "Starter",
  "Committed",
  "Disciplined",
  "Athlete",
  "Elite",
  "Champion",
  "Legend",
];

const achievements = [
  { label: "First sweat", earned: true },
  { label: "7-day arc", earned: true },
  { label: "Protein 30×", earned: true },
  { label: "PR set", earned: false },
  { label: "30-day arc", earned: false },
  { label: "Athlete", earned: false },
];

const groups = [
  { label: "Goal", value: "Build lean muscle · 76 → 80 kg" },
  { label: "Training", value: "Push / Pull / Legs · 5 days" },
  { label: "Nutrition", value: "2,650 kcal · 180g protein" },
  { label: "Notifications", value: "On" },
];

function Profile() {
  const currentLevel = 3;

  return (
    <AppShell>
      <div className="px-6 pt-14">
        <header className="flex items-start justify-between">
          <div>
            <p className="text-[11px] uppercase tracking-[0.3em] text-muted-foreground">
              Athlete
            </p>
            <h1 className="mt-3 text-[34px] font-semibold leading-[1.05] tracking-tight">
              Om Sharma
            </h1>
          </div>
          <button className="grid h-10 w-10 place-items-center rounded-full bg-surface" aria-label="Settings">
            <Settings2 className="h-4 w-4" />
          </button>
        </header>

        {/* Identity */}
        <section className="mt-8 overflow-hidden rounded-[28px] border border-border bg-surface p-6">
          <div className="flex items-center gap-4">
            <div
              className="relative h-16 w-16 rounded-full"
              style={{
                background:
                  "conic-gradient(from 220deg, #C7FF2F, #8B5CF6, #C7FF2F)",
              }}
            >
              <div className="absolute inset-[3px] grid place-items-center rounded-full bg-surface text-lg font-semibold">
                OM
              </div>
            </div>
            <div className="min-w-0">
              <p className="text-[10px] uppercase tracking-[0.28em] text-muted-foreground">
                Current rank
              </p>
              <p className="text-2xl font-semibold tracking-tight">Disciplined</p>
              <p className="text-xs text-muted-foreground">Next: Athlete · 860 XP</p>
            </div>
          </div>

          {/* Rank ladder */}
          <div className="mt-6 flex items-center justify-between">
            {ranks.map((r, i) => {
              const passed = i < currentLevel;
              const current = i === currentLevel - 1;
              return (
                <div key={r} className="flex flex-col items-center gap-1.5">
                  <span
                    className={`h-1.5 w-1.5 rounded-full ${
                      current
                        ? "bg-primary ring-4 ring-primary/20"
                        : passed
                        ? "bg-foreground"
                        : "bg-white/15"
                    }`}
                  />
                  <span
                    className={`text-[8px] uppercase tracking-wider ${
                      current ? "text-primary" : passed ? "text-foreground" : "text-muted-foreground/60"
                    }`}
                  >
                    {r.slice(0, 4)}
                  </span>
                </div>
              );
            })}
          </div>
        </section>

        {/* Stats */}
        <section className="mt-6 grid grid-cols-3 gap-px overflow-hidden rounded-[24px] border border-border bg-border">
          {[
            { v: "28", l: "Day arc" },
            { v: "62", l: "Sessions" },
            { v: "94%", l: "Adherence" },
          ].map((s) => (
            <div key={s.l} className="bg-background p-5 text-center">
              <p className="text-xl font-semibold tracking-tight">{s.v}</p>
              <p className="mt-1 text-[10px] uppercase tracking-wider text-muted-foreground">
                {s.l}
              </p>
            </div>
          ))}
        </section>

        {/* Achievements */}
        <section className="mt-10">
          <p className="text-[11px] uppercase tracking-[0.3em] text-muted-foreground">
            Milestones
          </p>
          <div className="mt-4 grid grid-cols-3 gap-3">
            {achievements.map((a) => (
              <div
                key={a.label}
                className={`aspect-square rounded-2xl border p-3 flex flex-col justify-between ${
                  a.earned
                    ? "border-border bg-surface"
                    : "border-dashed border-white/10 bg-transparent"
                }`}
              >
                <div
                  className={`h-7 w-7 rounded-full ${
                    a.earned ? "bg-primary" : "bg-white/8"
                  }`}
                />
                <p className={`text-[11px] ${a.earned ? "text-foreground" : "text-muted-foreground/60"}`}>
                  {a.label}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Setup */}
        <section className="mt-10">
          <p className="text-[11px] uppercase tracking-[0.3em] text-muted-foreground">
            Setup
          </p>
          <ul className="mt-4 divide-y divide-border overflow-hidden rounded-3xl border border-border bg-surface">
            {groups.map((g) => (
              <li key={g.label}>
                <button className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left">
                  <div className="min-w-0">
                    <p className="text-[11px] uppercase tracking-wider text-muted-foreground">
                      {g.label}
                    </p>
                    <p className="mt-0.5 truncate text-sm">{g.value}</p>
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                </button>
              </li>
            ))}
          </ul>
        </section>

        <p className="mt-10 text-center text-[10px] uppercase tracking-[0.3em] text-muted-foreground/60">
          ATHLYT · v1.0
        </p>
      </div>
    </AppShell>
  );
}
