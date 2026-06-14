import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Plus, Trophy, TrendingUp, X } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { useApp } from "@/lib/store";

export const Route = createFileRoute("/_authenticated/progress")({
  head: () => ({ meta: [{ title: "ATHLYT — Progress" }] }),
  component: Progress,
});

function Progress() {
  const weights = useApp((s) => s.weights);
  const sessions = useApp((s) => s.sessions);
  const xp = useApp((s) => s.xp);
  const level = useApp((s) => s.level);
  const achievements = useApp((s) => s.achievements);
  const addWeight = useApp((s) => s.addWeight);
  const [adding, setAdding] = useState(false);
  const [w, setW] = useState("");

  const minW = Math.min(...weights.map((x) => x.kg)) - 1;
  const maxW = Math.max(...weights.map((x) => x.kg)) + 1;
  const range = maxW - minW;

  return (
    <AppShell>
      <div className="px-6 pt-14">
        <p className="text-[11px] uppercase tracking-[0.3em] text-muted-foreground">Your journey</p>
        <h1 className="mt-3 text-[34px] font-semibold tracking-tight">Level {level}</h1>
        <p className="mt-1 text-sm text-muted-foreground">{xp} XP earned · {xp % 500}/500 to next</p>
        <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-surface-elevated">
          <div className="h-full bg-primary" style={{ width: `${(xp % 500) / 5}%` }} />
        </div>

        {/* Weight chart */}
        <section className="mt-10">
          <div className="flex items-center justify-between">
            <p className="text-[11px] uppercase tracking-[0.28em] text-muted-foreground">Body weight</p>
            <button onClick={() => setAdding(true)} className="inline-flex items-center gap-1 rounded-full bg-surface px-3 py-1.5 text-xs"><Plus className="h-3 w-3" /> Log</button>
          </div>
          <div className="mt-4 rounded-2xl border border-border bg-surface p-5">
            <p className="text-2xl font-semibold">{weights[weights.length - 1]?.kg.toFixed(1)} kg</p>
            <svg viewBox="0 0 300 100" className="mt-3 h-24 w-full">
              <polyline fill="none" stroke="oklch(0.94 0.22 124)" strokeWidth="2"
                points={weights.map((p, i) => `${(i / (weights.length - 1)) * 300},${100 - ((p.kg - minW) / range) * 90}`).join(" ")} />
              {weights.map((p, i) => (
                <circle key={i} cx={(i / (weights.length - 1)) * 300} cy={100 - ((p.kg - minW) / range) * 90} r={2.5} fill="oklch(0.94 0.22 124)" />
              ))}
            </svg>
          </div>
        </section>

        {/* Consistency */}
        <section className="mt-8 rounded-2xl border border-border bg-surface p-5">
          <div className="flex items-center gap-2"><TrendingUp className="h-4 w-4 text-primary" /><p className="text-[11px] uppercase tracking-[0.28em] text-muted-foreground">Consistency · last 14 days</p></div>
          <div className="mt-4 grid grid-cols-14 gap-1">
            {Array.from({ length: 14 }).map((_, i) => {
              const date = new Date(Date.now() - (13 - i) * 86400000).toDateString();
              const done = sessions.some((s) => new Date(s.at).toDateString() === date);
              return <div key={i} className={`h-7 rounded ${done ? "bg-primary" : "bg-surface-elevated"}`} />;
            })}
          </div>
        </section>

        {/* Achievements */}
        <section className="mt-8">
          <p className="text-[11px] uppercase tracking-[0.28em] text-muted-foreground">Achievements</p>
          <ul className="mt-4 space-y-2">
            {achievements.map((a) => (
              <li key={a.id} className="flex items-center gap-3 rounded-2xl border border-border bg-surface px-5 py-4">
                <span className="grid h-9 w-9 place-items-center rounded-full bg-primary/15"><Trophy className="h-4 w-4 text-primary" /></span>
                <div>
                  <p className="text-[15px] font-medium">{a.title}</p>
                  <p className="text-xs text-muted-foreground">{new Date(a.unlockedAt).toLocaleDateString()}</p>
                </div>
              </li>
            ))}
          </ul>
        </section>

        {/* Transformation photos placeholder */}
        <section className="mt-8 mb-4">
          <p className="text-[11px] uppercase tracking-[0.28em] text-muted-foreground">Transformation</p>
          <div className="mt-4 grid grid-cols-2 gap-2">
            {["Week 1", "Today"].map((l) => (
              <div key={l} className="aspect-[3/4] rounded-2xl border border-dashed border-border bg-surface/50 grid place-items-center text-xs text-muted-foreground">
                {l}
              </div>
            ))}
          </div>
          <button className="mt-3 w-full rounded-2xl border border-border bg-surface py-3 text-sm">+ Add photo</button>
        </section>

        <Link to="/" className="mt-4 mb-8 block text-center text-xs text-muted-foreground">Back to today →</Link>
      </div>

      {adding && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/60 p-6">
          <div className="w-full max-w-sm rounded-3xl border border-border bg-surface p-6">
            <div className="flex items-center justify-between">
              <p className="text-base font-semibold">Log weight</p>
              <button onClick={() => setAdding(false)} className="grid h-8 w-8 place-items-center rounded-full bg-surface-elevated"><X className="h-4 w-4" /></button>
            </div>
            <input type="number" step="0.1" value={w} onChange={(e) => setW(e.target.value)} placeholder="kg" autoFocus
              className="mt-4 w-full rounded-2xl border border-border bg-background px-4 py-3 text-2xl font-semibold outline-none" />
            <button onClick={() => { const n = parseFloat(w); if (n) { addWeight(n); setW(""); setAdding(false); } }}
              className="mt-4 w-full rounded-full bg-primary py-3 font-semibold text-primary-foreground">Save</button>
          </div>
        </div>
      )}
    </AppShell>
  );
}
