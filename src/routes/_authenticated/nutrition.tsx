import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Search, Droplet, Plus, X } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { useApp, FOODS } from "@/lib/store";

export const Route = createFileRoute("/_authenticated/nutrition")({
  head: () => ({ meta: [{ title: "ATHLYT — Nutrition" }] }),
  component: Nutrition,
});

function Nutrition() {
  const today = useApp((s) => s.today);
  const targets = useApp((s) => s.targets);
  const meals = useApp((s) => s.meals.filter((m) => new Date(m.at).toDateString() === new Date().toDateString()));
  const log = useApp((s) => s.logMeal);
  const remove = useApp((s) => s.removeMeal);
  const water = useApp((s) => s.addWater);
  const [search, setSearch] = useState("");
  const [adding, setAdding] = useState(false);

  const carbs = meals.reduce((s, m) => s + m.carbs, 0);
  const fat = meals.reduce((s, m) => s + m.fat, 0);
  const filtered = FOODS.filter((f) => f.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <AppShell>
      <div className="px-6 pt-14">
        <p className="text-[11px] uppercase tracking-[0.3em] text-muted-foreground">Today's fuel</p>
        <h1 className="mt-3 text-[34px] font-semibold tracking-tight">{today.kcalIn} <span className="text-muted-foreground text-[20px]">/ {targets.kcal} kcal</span></h1>

        {/* Macro bars */}
        <section className="mt-8 grid grid-cols-3 gap-2">
          <Macro label="Protein" current={today.proteinIn} target={targets.protein} />
          <Macro label="Carbs" current={carbs} target={Math.round(targets.kcal * 0.4 / 4)} />
          <Macro label="Fat" current={fat} target={Math.round(targets.kcal * 0.25 / 9)} />
        </section>

        {/* Water */}
        <section className="mt-6 rounded-2xl border border-border bg-surface p-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2"><Droplet className="h-4 w-4 text-secondary" /><span className="text-sm font-medium">Hydration</span></div>
            <span className="text-sm text-muted-foreground">{today.waterMl} / {targets.water} ml</span>
          </div>
          <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-surface-elevated">
            <div className="h-full bg-secondary" style={{ width: `${Math.min(100, (today.waterMl / targets.water) * 100)}%` }} />
          </div>
          <div className="mt-4 flex gap-2">
            {[250, 500, 750].map((ml) => (
              <button key={ml} onClick={() => water(ml)} className="flex-1 rounded-full border border-border py-2 text-xs">+{ml}ml</button>
            ))}
          </div>
        </section>

        {/* Meals */}
        <section className="mt-8">
          <div className="flex items-center justify-between">
            <p className="text-[11px] uppercase tracking-[0.28em] text-muted-foreground">Meals today</p>
            <button onClick={() => setAdding(true)} className="inline-flex items-center gap-1 rounded-full bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground">
              <Plus className="h-3 w-3" /> Log meal
            </button>
          </div>

          {meals.length === 0 ? (
            <div className="mt-4 rounded-2xl border border-dashed border-border bg-surface/40 p-8 text-center text-sm text-muted-foreground">
              No meals logged yet today.
            </div>
          ) : (
            <ul className="mt-4 divide-y divide-border rounded-2xl border border-border bg-surface">
              {meals.map((m) => (
                <li key={m.id} className="flex items-center justify-between px-5 py-3">
                  <div>
                    <p className="text-[15px] font-medium">{m.name}</p>
                    <p className="text-xs text-muted-foreground">{m.kcal} kcal · {m.protein}g P</p>
                  </div>
                  <button onClick={() => remove(m.id)} className="grid h-8 w-8 place-items-center rounded-full bg-surface-elevated text-muted-foreground"><X className="h-3.5 w-3.5" /></button>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      {adding && (
        <div className="fixed inset-0 z-50 mx-auto flex max-w-[480px] flex-col bg-background">
          <div className="flex items-center justify-between border-b border-border px-6 py-4">
            <p className="text-base font-semibold">Log a meal</p>
            <button onClick={() => setAdding(false)} className="grid h-9 w-9 place-items-center rounded-full bg-surface"><X className="h-4 w-4" /></button>
          </div>
          <div className="border-b border-border px-6 py-3">
            <div className="flex items-center gap-2 rounded-2xl bg-surface px-4 py-3">
              <Search className="h-4 w-4 text-muted-foreground" />
              <input autoFocus value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search food…" className="w-full bg-transparent text-[15px] outline-none" />
            </div>
          </div>
          <ul className="flex-1 divide-y divide-border overflow-y-auto">
            {filtered.map((f) => (
              <li key={f.name}>
                <button onClick={() => { log(f); setAdding(false); setSearch(""); }} className="flex w-full items-center justify-between px-6 py-4 text-left">
                  <div>
                    <p className="text-[15px] font-medium">{f.name}</p>
                    <p className="text-xs text-muted-foreground">{f.kcal} kcal · P{f.protein} · C{f.carbs} · F{f.fat}</p>
                  </div>
                  <Plus className="h-4 w-4 text-primary" />
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </AppShell>
  );
}
function Macro({ label, current, target }: { label: string; current: number; target: number }) {
  const pct = Math.min(100, (current / target) * 100);
  return (
    <div className="rounded-2xl border border-border bg-surface px-3 py-3">
      <p className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground">{label}</p>
      <p className="mt-1 text-lg font-semibold">{Math.round(current)}<span className="text-xs text-muted-foreground">/{target}g</span></p>
      <div className="mt-2 h-1 overflow-hidden rounded-full bg-surface-elevated"><div className="h-full bg-primary" style={{ width: `${pct}%` }} /></div>
    </div>
  );
}
