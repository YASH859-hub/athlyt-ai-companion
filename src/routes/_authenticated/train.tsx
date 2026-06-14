import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ChevronRight, Pause, Play, Check } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { useApp, WORKOUTS, type Workout } from "@/lib/store";

export const Route = createFileRoute("/_authenticated/train")({
  head: () => ({ meta: [{ title: "ATHLYT — Train" }] }),
  component: Train,
});

function Train() {
  const [active, setActive] = useState<Workout | null>(null);
  if (active) return <Player workout={active} onExit={() => setActive(null)} />;
  return (
    <AppShell>
      <div className="px-6 pt-16">
        <p className="text-[11px] uppercase tracking-[0.3em] text-muted-foreground">Train</p>
        <h1 className="mt-3 text-[34px] font-semibold tracking-tight">Choose your session</h1>
        <p className="mt-2 text-sm text-muted-foreground">Picked for where you are this week.</p>

        <div className="mt-8 space-y-3">
          {WORKOUTS.map((w) => (
            <button key={w.id} onClick={() => setActive(w)} className="flex w-full items-center justify-between rounded-2xl border border-border bg-surface px-5 py-4 text-left">
              <div>
                <p className="text-[10px] uppercase tracking-[0.24em] text-muted-foreground">{w.category}</p>
                <p className="mt-1.5 text-[17px] font-semibold tracking-tight">{w.name}</p>
                <p className="mt-1 text-xs text-muted-foreground">{w.duration} min · {w.exercises.length} exercises · Lv {w.level}</p>
              </div>
              <ChevronRight className="h-5 w-5 text-muted-foreground" />
            </button>
          ))}
        </div>
      </div>
    </AppShell>
  );
}

function Player({ workout, onExit }: { workout: Workout; onExit: () => void }) {
  const complete = useApp((s) => s.completeWorkout);
  const navigate = useNavigate();
  const [i, setI] = useState(0);
  const [resting, setResting] = useState(false);
  const [rest, setRest] = useState(0);
  const [paused, setPaused] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [done, setDone] = useState(false);
  const startRef = useRef(Date.now());

  useEffect(() => {
    if (paused || done) return;
    const t = setInterval(() => setElapsed(Math.floor((Date.now() - startRef.current) / 1000)), 1000);
    return () => clearInterval(t);
  }, [paused, done]);

  useEffect(() => {
    if (!resting || rest <= 0) return;
    const t = setInterval(() => setRest((r) => (r > 0 ? r - 1 : 0)), 1000);
    return () => clearInterval(t);
  }, [resting, rest]);

  useEffect(() => { if (resting && rest === 0) setResting(false); }, [rest, resting]);

  const ex = workout.exercises[i];
  const next = () => {
    if (i + 1 >= workout.exercises.length) {
      complete(workout);
      setDone(true);
      return;
    }
    setRest(ex.rest); setResting(true); setI(i + 1);
  };

  if (done) {
    return (
      <div className="mx-auto grid min-h-[100dvh] max-w-[480px] place-items-center bg-background px-6">
        <div className="text-center">
          <div className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-primary/15"><Check className="h-9 w-9 text-primary" /></div>
          <h1 className="mt-8 text-[34px] font-semibold tracking-tight">Session complete</h1>
          <p className="mt-2 text-sm text-muted-foreground">{workout.name} · {Math.floor(elapsed/60)}m {elapsed%60}s</p>
          <div className="mt-8 inline-flex flex-col gap-2 rounded-3xl border border-border bg-surface p-6 text-left">
            <Row k="Exercises" v={`${workout.exercises.length}`} />
            <Row k="Duration" v={`${Math.floor(elapsed/60)} min`} />
            <Row k="XP earned" v={`+${80 + workout.exercises.length * 10}`} accent />
          </div>
          <div className="mt-8 flex flex-col gap-2">
            <button onClick={() => navigate({ to: "/" })} className="rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground">Back to today</button>
            <Link to="/progress" className="text-sm text-muted-foreground">See progress →</Link>
          </div>
        </div>
      </div>
    );
  }

  const pct = ((i + (resting ? 0.5 : 0)) / workout.exercises.length) * 100;

  return (
    <div className="mx-auto flex min-h-[100dvh] max-w-[480px] flex-col bg-background px-6 pb-10 pt-12">
      <header className="flex items-center justify-between">
        <button onClick={onExit} className="grid h-10 w-10 place-items-center rounded-full bg-surface"><ArrowLeft className="h-4 w-4" /></button>
        <div>
          <p className="text-center text-[10px] uppercase tracking-[0.28em] text-muted-foreground">{workout.name}</p>
          <p className="text-center text-xs">{Math.floor(elapsed/60)}:{String(elapsed%60).padStart(2,'0')}</p>
        </div>
        <button onClick={() => setPaused((p) => !p)} className="grid h-10 w-10 place-items-center rounded-full bg-surface">{paused ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}</button>
      </header>

      <div className="mt-6 flex gap-1.5">
        {workout.exercises.map((_, idx) => (
          <div key={idx} className={`h-1 flex-1 rounded-full ${idx < i ? "bg-primary" : idx === i ? "bg-foreground/60" : "bg-surface-elevated"}`} />
        ))}
      </div>

      <AnimatePresence mode="wait">
        {resting ? (
          <motion.div key="rest" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="my-auto text-center">
            <p className="text-[10px] uppercase tracking-[0.28em] text-muted-foreground">Rest</p>
            <p className="mt-6 text-[88px] font-semibold leading-none tracking-tight text-primary">{rest}</p>
            <p className="mt-4 text-sm text-muted-foreground">Next: {workout.exercises[i]?.name}</p>
            <button onClick={() => setResting(false)} className="mt-10 rounded-full bg-foreground px-6 py-3 text-sm font-semibold text-background">Skip rest</button>
          </motion.div>
        ) : (
          <motion.div key={ex.name} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} className="my-auto">
            <p className="text-[10px] uppercase tracking-[0.28em] text-muted-foreground">Exercise {i + 1} of {workout.exercises.length}</p>
            <h2 className="mt-3 text-[36px] font-semibold leading-tight tracking-tight">{ex.name}</h2>
            <div className="mt-8 flex items-baseline gap-6">
              <div><p className="text-[10px] uppercase tracking-[0.24em] text-muted-foreground">Sets</p><p className="text-4xl font-semibold">{ex.sets}</p></div>
              <div><p className="text-[10px] uppercase tracking-[0.24em] text-muted-foreground">Reps</p><p className="text-4xl font-semibold">{ex.reps}</p></div>
              <div><p className="text-[10px] uppercase tracking-[0.24em] text-muted-foreground">Rest</p><p className="text-4xl font-semibold">{ex.rest}s</p></div>
            </div>
            <div className="mt-12 h-44 rounded-3xl bg-surface" style={{ background: "radial-gradient(120% 80% at 80% 20%, rgba(139,92,246,0.25), transparent 60%), radial-gradient(80% 100% at 10% 100%, rgba(199,255,47,0.12), transparent 60%), #121212" }} />
          </motion.div>
        )}
      </AnimatePresence>

      <button onClick={next} className="mt-6 w-full rounded-full bg-primary py-4 text-[15px] font-semibold text-primary-foreground">
        {i + 1 >= workout.exercises.length ? "Finish workout" : "Complete set"}
      </button>
      <div className="mt-2 h-1 overflow-hidden rounded-full bg-surface-elevated"><div className="h-full bg-primary transition-all" style={{ width: `${pct}%` }} /></div>
    </div>
  );
}
function Row({ k, v, accent }: { k: string; v: string; accent?: boolean }) {
  return (
    <div className="flex items-center justify-between gap-12">
      <span className="text-xs uppercase tracking-[0.22em] text-muted-foreground">{k}</span>
      <span className={`text-base font-semibold ${accent ? "text-primary" : ""}`}>{v}</span>
    </div>
  );
}
