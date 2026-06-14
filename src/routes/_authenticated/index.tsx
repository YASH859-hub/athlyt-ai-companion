import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowUpRight, Bell, Clock3, Flame, Sparkle } from "lucide-react";
import { useEffect } from "react";
import { AppShell } from "@/components/AppShell";
import { useApp, WORKOUTS } from "@/lib/store";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_authenticated/")({
  head: () => ({ meta: [{ title: "ATHLYT — Today" }] }),
  component: Home,
});

function Home() {
  const today = useApp((s) => s.today);
  const targets = useApp((s) => s.targets);
  const streak = useApp((s) => s.streak);
  const xp = useApp((s) => s.xp);
  const level = useApp((s) => s.level);
  const roll = useApp((s) => s.rollDayIfNeeded);
  const unread = useApp((s) => s.notifications.filter((n) => !n.read).length);

  useEffect(() => {
    roll();
  }, [roll]);

  const { data: profile } = useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      const { data: u } = await supabase.auth.getUser();
      if (!u.user) return null;
      const { data } = await supabase
        .from("profiles")
        .select("name, goal, program")
        .eq("id", u.user.id)
        .maybeSingle();
      return data;
    },
  });

  const w = WORKOUTS[0];
  const proteinPct = Math.min(100, (today.proteinIn / targets.protein) * 100);
  const waterPct = Math.min(100, (today.waterMl / targets.water) * 100);
  const kcalPct = Math.min(100, (today.kcalIn / targets.kcal) * 100);
  const xpInLevel = xp % 500;
  const name = profile?.name?.split(" ")[0] ?? "Athlete";

  const now = new Date();
  const day = now.toLocaleDateString("en", { weekday: "long" });
  const time = now.toLocaleTimeString("en", { hour: "2-digit", minute: "2-digit", hour12: false });

  return (
    <AppShell>
      <div className="px-6 pt-14">
        <motion.header
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex items-start justify-between"
        >
          <div>
            <p className="text-[11px] uppercase tracking-[0.3em] text-muted-foreground">
              {day} · {time}
            </p>
            <h1 className="mt-3 text-[40px] font-semibold leading-[1.05] tracking-tight">
              Good day,
              <br />
              {name}.
            </h1>
          </div>
          <Link
            to="/notifications"
            className="relative grid h-11 w-11 place-items-center rounded-full bg-surface"
          >
            <Bell className="h-4 w-4" />
            {unread > 0 && (
              <span className="absolute right-2.5 top-2.5 h-2 w-2 rounded-full bg-primary" />
            )}
          </Link>
        </motion.header>

        {/* Stat row */}
        <section className="mt-8 grid grid-cols-3 gap-3">
          <Stat
            icon={<Flame className="h-3.5 w-3.5 text-primary" />}
            label="Streak"
            value={`${streak}d`}
          />
          <Stat label="Level" value={`${level}`} sub={`${xpInLevel}/500 XP`} />
          <Stat
            label="Today"
            value={today.workoutDone ? "Done" : "Pending"}
            accent={today.workoutDone}
          />
        </section>

        {/* AI insight */}
        <motion.section
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
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
          <p className="mt-3 text-[22px] font-medium leading-[1.25] tracking-tight text-balance text-foreground/95">
            You're <span className="text-primary">2 workouts</span> from your strongest month ever.
          </p>
        </motion.section>

        {/* Today's Focus */}
        <motion.section
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-10"
        >
          <p className="text-[11px] uppercase tracking-[0.3em] text-muted-foreground">
            Today's Focus
          </p>
          <div className="mt-4 overflow-hidden rounded-[28px] border border-border bg-surface">
            <div className="relative h-44 overflow-hidden">
              <div
                className="absolute inset-0"
                style={{
                  background:
                    "radial-gradient(120% 80% at 80% 20%, rgba(139,92,246,0.32), transparent 60%), radial-gradient(80% 100% at 10% 100%, rgba(199,255,47,0.18), transparent 60%), #121212",
                }}
              />
              <div className="absolute left-6 top-6">
                <p className="text-[10px] uppercase tracking-[0.32em] text-white/60">
                  {w.category}
                </p>
                <p className="mt-2 text-3xl font-semibold tracking-tight">{w.name}</p>
              </div>
              <div className="absolute bottom-6 left-6 flex items-center gap-3 text-sm text-white/70">
                <span className="inline-flex items-center gap-1.5">
                  <Clock3 className="h-3.5 w-3.5" /> {w.duration} min
                </span>
                <span>·</span>
                <span>{w.exercises.length} exercises</span>
              </div>
            </div>
            <Link
              to="/train"
              className="flex items-center justify-between gap-4 bg-primary px-6 py-5 text-primary-foreground active:scale-[0.99]"
            >
              <span className="text-base font-semibold tracking-tight">
                {today.workoutDone ? "Review session" : "Start session"}
              </span>
              <span className="grid h-9 w-9 place-items-center rounded-full bg-black/10">
                <ArrowUpRight className="h-4 w-4" strokeWidth={2.5} />
              </span>
            </Link>
          </div>
        </motion.section>

        {/* Daily rings */}
        <section className="mt-10">
          <p className="text-[11px] uppercase tracking-[0.3em] text-muted-foreground">
            Daily progress
          </p>
          <div className="mt-4 space-y-3">
            <Bar
              label="Protein"
              current={today.proteinIn}
              target={targets.protein}
              unit="g"
              pct={proteinPct}
            />
            <Bar
              label="Hydration"
              current={today.waterMl}
              target={targets.water}
              unit="ml"
              pct={waterPct}
            />
            <Bar
              label="Calories"
              current={today.kcalIn}
              target={targets.kcal}
              unit="kcal"
              pct={kcalPct}
            />
          </div>
        </section>

        <section className="mt-10">
          <p className="text-[11px] uppercase tracking-[0.3em] text-muted-foreground">
            Upcoming milestone
          </p>
          <Link
            to="/progress"
            className="mt-4 flex items-center justify-between rounded-2xl border border-border bg-surface px-5 py-4"
          >
            <div>
              <p className="text-[15px] font-medium">10-day streak</p>
              <p className="mt-0.5 text-xs text-muted-foreground">{10 - streak} workouts away</p>
            </div>
            <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
          </Link>
        </section>

        <p className="my-10 text-center text-[10px] uppercase tracking-[0.32em] text-muted-foreground/60">
          Stay present · Move with intent
        </p>
      </div>
    </AppShell>
  );
}

function Stat({
  icon,
  label,
  value,
  sub,
  accent,
}: {
  icon?: React.ReactNode;
  label: string;
  value: string;
  sub?: string;
  accent?: boolean;
}) {
  return (
    <div
      className={`rounded-2xl border ${accent ? "border-primary/40 bg-primary/10" : "border-border bg-surface"} px-4 py-3`}
    >
      <div className="flex items-center gap-1.5">
        {icon}
        <p className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground">{label}</p>
      </div>
      <p className="mt-1.5 text-xl font-semibold tracking-tight">{value}</p>
      {sub && <p className="text-[10px] text-muted-foreground">{sub}</p>}
    </div>
  );
}
function Bar({
  label,
  current,
  target,
  unit,
  pct,
}: {
  label: string;
  current: number;
  target: number;
  unit: string;
  pct: number;
}) {
  return (
    <div className="rounded-2xl border border-border bg-surface px-5 py-4">
      <div className="flex items-baseline justify-between">
        <span className="text-[13px] text-muted-foreground">{label}</span>
        <span className="text-[13px] font-medium">
          <span className="text-foreground">{Math.round(current)}</span>
          <span className="text-muted-foreground">
            {" "}
            / {target} {unit}
          </span>
        </span>
      </div>
      <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-surface-elevated">
        <div
          className="h-full rounded-full bg-primary transition-all"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
