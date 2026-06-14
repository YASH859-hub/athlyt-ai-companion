import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect } from "react";
import { ArrowLeft, Bell, Dumbbell, Apple, Trophy, Sparkle } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { useApp } from "@/lib/store";
import { formatDistanceToNow } from "date-fns";

export const Route = createFileRoute("/_authenticated/notifications")({
  head: () => ({ meta: [{ title: "ATHLYT — Notifications" }] }),
  component: Notifs,
});

const iconFor = (t: string) => {
  if (t.toLowerCase().includes("workout") || t.toLowerCase().includes("train")) return Dumbbell;
  if (
    t.toLowerCase().includes("nutrition") ||
    t.toLowerCase().includes("water") ||
    t.toLowerCase().includes("hydr")
  )
    return Apple;
  if (t.toLowerCase().includes("achievement") || t.toLowerCase().includes("xp")) return Trophy;
  if (t.toLowerCase().includes("insight") || t.toLowerCase().includes("coach")) return Sparkle;
  return Bell;
};

function Notifs() {
  const items = useApp((s) => s.notifications);
  const mark = useApp((s) => s.markNotificationsRead);
  useEffect(() => {
    const t = setTimeout(mark, 700);
    return () => clearTimeout(t);
  }, [mark]);

  return (
    <AppShell>
      <div className="px-6 pt-14">
        <div className="flex items-center gap-3">
          <Link to="/" className="grid h-10 w-10 place-items-center rounded-full bg-surface">
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <h1 className="text-[28px] font-semibold tracking-tight">Notifications</h1>
        </div>

        {items.length === 0 ? (
          <div className="mt-16 text-center text-sm text-muted-foreground">All caught up.</div>
        ) : (
          <ul className="mt-8 space-y-2">
            {items.map((n) => {
              const Icon = iconFor(n.title);
              return (
                <li
                  key={n.id}
                  className={`flex gap-3 rounded-2xl border px-5 py-4 ${n.read ? "border-border bg-surface" : "border-primary/30 bg-primary/5"}`}
                >
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-surface-elevated">
                    <Icon className="h-4 w-4 text-primary" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-[15px] font-medium">{n.title}</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">{n.body}</p>
                    <p className="mt-1 text-[10px] uppercase tracking-[0.22em] text-muted-foreground/60">
                      {formatDistanceToNow(n.at, { addSuffix: true })}
                    </p>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </AppShell>
  );
}
