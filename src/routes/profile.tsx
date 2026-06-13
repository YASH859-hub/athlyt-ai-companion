import { createFileRoute } from "@tanstack/react-router";
import { ChevronRight, Bell, Target, Apple, Dumbbell, Shield, LogOut } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import orb from "@/assets/athlyt-orb.jpg";

export const Route = createFileRoute("/profile")({
  head: () => ({ meta: [{ title: "ATHLYT — Profile" }, { name: "description", content: "Your ATHLYT profile." }] }),
  component: Profile,
});

const groups: { title: string; items: { icon: any; label: string; sub?: string }[] }[] = [
  {
    title: "Journey",
    items: [
      { icon: Target, label: "Goal", sub: "Build lean muscle · 76kg → 80kg" },
      { icon: Dumbbell, label: "Training plan", sub: "5 days · Push / Pull / Legs" },
      { icon: Apple, label: "Nutrition", sub: "2,650 kcal · 180g protein" },
    ],
  },
  {
    title: "Preferences",
    items: [
      { icon: Bell, label: "Notifications" },
      { icon: Shield, label: "Privacy & data" },
      { icon: LogOut, label: "Sign out" },
    ],
  },
];

function Profile() {
  return (
    <AppShell>
      <div className="px-6 pt-12">
        <header className="flex items-center gap-4">
          <div className="relative">
            <img src={orb} alt="" width={72} height={72} className="h-18 w-18 rounded-full animate-float-orb" />
          </div>
          <div className="min-w-0">
            <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">Athlete</p>
            <h1 className="text-2xl font-semibold tracking-tight">Om Sharma</h1>
            <p className="text-sm text-primary">Level 3 · Disciplined</p>
          </div>
        </header>

        <div className="mt-6 grid grid-cols-3 overflow-hidden rounded-3xl border border-border bg-surface/60">
          {[
            { v: "28", l: "Day streak" },
            { v: "62", l: "Sessions" },
            { v: "94%", l: "Adherence" },
          ].map((s, i) => (
            <div key={s.l} className={`p-4 text-center ${i !== 0 ? "border-l border-border" : ""}`}>
              <p className="text-2xl font-semibold">{s.v}</p>
              <p className="mt-1 text-[11px] uppercase tracking-wider text-muted-foreground">{s.l}</p>
            </div>
          ))}
        </div>

        {groups.map((g) => (
          <section key={g.title} className="mt-8">
            <h3 className="mb-3 text-xs font-medium uppercase tracking-[0.22em] text-muted-foreground">{g.title}</h3>
            <ul className="overflow-hidden rounded-3xl border border-border bg-surface/60">
              {g.items.map((it, i) => (
                <li key={it.label} className={i !== 0 ? "border-t border-border" : ""}>
                  <button className="flex w-full items-center gap-4 px-5 py-4 text-left">
                    <span className="grid h-10 w-10 place-items-center rounded-xl bg-white/5">
                      <it.icon className="h-4 w-4 text-primary" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium">{it.label}</p>
                      {it.sub && <p className="truncate text-xs text-muted-foreground">{it.sub}</p>}
                    </div>
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  </button>
                </li>
              ))}
            </ul>
          </section>
        ))}

        <p className="mt-10 text-center text-[11px] uppercase tracking-[0.25em] text-muted-foreground">
          ATHLYT · v1.0
        </p>
      </div>
    </AppShell>
  );
}
