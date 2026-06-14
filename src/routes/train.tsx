import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Pause, Play, SkipForward, X, Repeat } from "lucide-react";
import { AppShell } from "@/components/AppShell";

export const Route = createFileRoute("/train")({
  head: () => ({
    meta: [
      { title: "ATHLYT — Train" },
      { name: "description", content: "One focused movement at a time." },
    ],
  }),
  component: Train,
});

const exercises = [
  { name: "Incline DB Press", target: "Upper chest", reps: 10, sets: 4, rest: 60 },
  { name: "Cable Fly", target: "Mid chest", reps: 12, sets: 3, rest: 45 },
  { name: "Overhead Press", target: "Shoulders", reps: 8, sets: 4, rest: 75 },
  { name: "Rope Pushdown", target: "Triceps", reps: 15, sets: 3, rest: 45 },
];

function Train() {
  const [idx, setIdx] = useState(0);
  const [playing, setPlaying] = useState(true);
  const ex = exercises[idx];
  const next = () => setIdx((i) => Math.min(exercises.length - 1, i + 1));
  const prev = () => setIdx((i) => Math.max(0, i - 1));

  return (
    <AppShell>
      <div className="flex min-h-[100dvh] flex-col px-6 pt-14">
        <header className="flex items-center justify-between">
          <button className="grid h-10 w-10 place-items-center rounded-full bg-surface" aria-label="Close">
            <X className="h-4 w-4" />
          </button>
          <div className="text-center">
            <p className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">Push Day</p>
            <p className="mt-1 text-sm font-semibold">
              {idx + 1}<span className="text-muted-foreground"> / {exercises.length}</span>
            </p>
          </div>
          <button className="grid h-10 w-10 place-items-center rounded-full bg-surface" aria-label="Alternatives">
            <Repeat className="h-4 w-4" />
          </button>
        </header>

        {/* segmented progress */}
        <div className="mt-5 flex gap-1.5">
          {exercises.map((_, i) => (
            <div key={i} className="h-0.5 flex-1 overflow-hidden rounded-full bg-white/8">
              <motion.div
                className="h-full bg-foreground"
                initial={false}
                animate={{ width: i < idx ? "100%" : i === idx ? "50%" : "0%" }}
              />
            </div>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.section
            key={idx}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.35 }}
            className="mt-8 flex flex-1 flex-col"
          >
            <p className="text-[11px] uppercase tracking-[0.3em] text-muted-foreground">
              {ex.target}
            </p>
            <h1 className="mt-2 text-[34px] font-semibold leading-[1.1] tracking-tight">
              {ex.name}
            </h1>

            {/* Animation surface */}
            <div className="relative mt-8 aspect-square overflow-hidden rounded-[32px] border border-border bg-surface">
              <div
                className="absolute inset-0 opacity-90"
                style={{
                  background:
                    "radial-gradient(60% 60% at 50% 40%, rgba(139,92,246,0.28), transparent 70%)",
                }}
              />
              <div className="absolute inset-0 grid place-items-center">
                <div className="text-center">
                  <p className="text-[11px] uppercase tracking-[0.3em] text-muted-foreground">
                    Set 1 of {ex.sets}
                  </p>
                  <p className="mt-3 text-[120px] font-semibold leading-none tracking-tight tabular-nums">
                    {ex.reps}
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">reps</p>
                </div>
              </div>
            </div>

            <p className="mt-5 text-sm text-muted-foreground">
              Control the negative. Drive through the chest, not the shoulders.
            </p>

            {/* Player controls */}
            <div className="mt-auto pb-6">
              <div className="mt-8 flex items-center justify-between">
                <button onClick={prev} className="grid h-12 w-12 place-items-center rounded-full bg-surface text-muted-foreground" aria-label="Previous">
                  <SkipForward className="h-5 w-5 rotate-180" />
                </button>

                <button
                  onClick={() => setPlaying((p) => !p)}
                  className="grid h-20 w-20 place-items-center rounded-full bg-primary text-primary-foreground active:scale-[0.97] transition"
                  aria-label={playing ? "Pause" : "Play"}
                >
                  {playing ? <Pause className="h-7 w-7" /> : <Play className="h-7 w-7 translate-x-0.5" />}
                </button>

                <button onClick={next} className="grid h-12 w-12 place-items-center rounded-full bg-surface" aria-label="Next">
                  <SkipForward className="h-5 w-5" />
                </button>
              </div>

              <p className="mt-6 text-center text-[11px] uppercase tracking-[0.3em] text-muted-foreground">
                Rest 00:{ex.rest.toString().padStart(2, "0")} after set
              </p>
            </div>
          </motion.section>
        </AnimatePresence>
      </div>
    </AppShell>
  );
}
