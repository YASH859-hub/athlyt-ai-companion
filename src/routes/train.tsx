import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, ChevronRight, Pause, RotateCcw } from "lucide-react";
import { AppShell } from "@/components/AppShell";

export const Route = createFileRoute("/train")({
  head: () => ({ meta: [{ title: "ATHLYT — Train" }, { name: "description", content: "Single-focus workout experience." }] }),
  component: Train,
});

const exercises = [
  { name: "Incline Dumbbell Press", reps: "4 × 10", rest: 60, tag: "Chest" },
  { name: "Cable Fly", reps: "3 × 12", rest: 45, tag: "Chest" },
  { name: "Overhead Press", reps: "4 × 8", rest: 75, tag: "Shoulders" },
  { name: "Tricep Rope Pushdown", reps: "3 × 15", rest: 45, tag: "Arms" },
];

function Train() {
  const [idx, setIdx] = useState(0);
  const [playing, setPlaying] = useState(true);
  const ex = exercises[idx];
  const progress = ((idx + 1) / exercises.length) * 100;

  const next = () => setIdx((i) => Math.min(exercises.length - 1, i + 1));

  return (
    <AppShell>
      <div className="px-6 pt-12">
        <header className="flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground">Push Day · Level 3</p>
            <h1 className="mt-1 text-2xl font-semibold">Chest & Triceps</h1>
          </div>
          <div className="text-right">
            <p className="text-xs text-muted-foreground">Exercise</p>
            <p className="text-base font-semibold">{idx + 1}<span className="text-muted-foreground">/{exercises.length}</span></p>
          </div>
        </header>

        <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-white/5">
          <motion.div className="h-full rounded-full bg-primary" animate={{ width: `${progress}%` }} />
        </div>

        <AnimatePresence mode="wait">
          <motion.section
            key={idx}
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.35 }}
            className="mt-6"
          >
            {/* Video area */}
            <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] border border-border"
              style={{ background: "linear-gradient(160deg, rgba(198,255,45,0.12), rgba(139,92,246,0.18) 70%, #0B0B0B)" }}>
              <div className="absolute inset-0 grid place-items-center">
                <button
                  onClick={() => setPlaying((p) => !p)}
                  className="grid h-20 w-20 place-items-center rounded-full bg-white/10 backdrop-blur-xl border border-white/20"
                  aria-label={playing ? "Pause" : "Play"}
                >
                  {playing ? <Pause className="h-7 w-7" /> : <Play className="h-7 w-7 translate-x-0.5" />}
                </button>
              </div>
              <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
                <span className="rounded-full bg-black/40 px-3 py-1 text-xs font-medium uppercase tracking-wider backdrop-blur">
                  {ex.tag}
                </span>
                <span className="rounded-full bg-primary px-3 py-1 text-xs font-bold text-primary-foreground">
                  {ex.reps}
                </span>
              </div>
            </div>

            <div className="mt-6">
              <h2 className="text-3xl font-semibold tracking-tight text-balance">{ex.name}</h2>
              <p className="mt-2 text-sm text-muted-foreground">Control the negative. Drive through the chest, not the shoulders.</p>
            </div>

            {/* Rest timer pill */}
            <div className="mt-6 flex items-center justify-between rounded-2xl border border-border bg-surface/60 px-5 py-4">
              <div>
                <p className="text-xs uppercase tracking-wider text-muted-foreground">Rest</p>
                <p className="text-2xl font-semibold tabular-nums">00:{ex.rest.toString().padStart(2, "0")}</p>
              </div>
              <button className="grid h-11 w-11 place-items-center rounded-full bg-white/5" aria-label="Reset">
                <RotateCcw className="h-4 w-4" />
              </button>
            </div>

            {/* Swipe-right CTA */}
            <button
              onClick={next}
              className="mt-6 flex w-full items-center justify-between rounded-full bg-primary px-6 py-5 text-primary-foreground active:scale-[0.99]"
            >
              <span className="font-semibold">Swipe to complete set</span>
              <span className="grid h-9 w-9 place-items-center rounded-full bg-black/15">
                <ChevronRight className="h-5 w-5" />
              </span>
            </button>
          </motion.section>
        </AnimatePresence>
      </div>
    </AppShell>
  );
}
