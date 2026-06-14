import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight, Check, Sparkle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useApp } from "@/lib/store";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/onboarding")({
  head: () => ({ meta: [{ title: "ATHLYT — Build your profile" }] }),
  component: Onboarding,
});

type Form = {
  goal: string;
  age: string;
  gender: string;
  height: string;
  weight: string;
  activity: string;
  target_weight: string;
  timeline: string;
  experience: string;
  environment: string;
  equipment: string[];
  diet: string;
  budget: string;
  protein: string;
};

const goals = [
  { v: "lose_fat", l: "Lose Fat" },
  { v: "build_muscle", l: "Build Muscle" },
  { v: "stay_fit", l: "Stay Fit" },
  { v: "improve_health", l: "Improve Health" },
  { v: "athletic", l: "Athletic Performance" },
];
const activities = ["Sedentary", "Light", "Moderate", "Active", "Very Active"];
const experiences = ["Beginner", "Intermediate", "Advanced"];
const envs = [
  { v: "gym", l: "Gym" },
  { v: "home", l: "Home" },
  { v: "hybrid", l: "Hybrid" },
];
const equips = ["Dumbbells", "Barbell", "Cables", "Machines", "Bands", "Bodyweight"];
const diets = [
  { v: "veg", l: "Vegetarian" },
  { v: "non_veg", l: "Non-Veg" },
  { v: "vegan", l: "Vegan" },
];
const budgets = ["$", "$$", "$$$"];
const proteins = ["Chicken & Eggs", "Fish & Seafood", "Plant-based", "Mixed"];

function Onboarding() {
  const navigate = useNavigate();
  const setTargets = useApp((s) => s.setTargets);
  const [step, setStep] = useState(0);
  const [saving, setSaving] = useState(false);
  const [f, setF] = useState<Form>({
    goal: "build_muscle",
    age: "26",
    gender: "Male",
    height: "178",
    weight: "76",
    activity: "Moderate",
    target_weight: "80",
    timeline: "12",
    experience: "Intermediate",
    environment: "gym",
    equipment: ["Dumbbells", "Barbell"],
    diet: "non_veg",
    budget: "$$",
    protein: "Mixed",
  });

  const set = (k: keyof Form, v: string | string[]) => setF((p) => ({ ...p, [k]: v }));
  const toggleEq = (e: string) =>
    set(
      "equipment",
      f.equipment.includes(e) ? f.equipment.filter((x) => x !== e) : [...f.equipment, e],
    );

  const next = () => setStep((s) => Math.min(s + 1, 5));
  const back = () => setStep((s) => Math.max(s - 1, 0));

  const finish = async () => {
    setSaving(true);
    const { data: user } = await supabase.auth.getUser();
    if (!user.user) return;
    const w = parseFloat(f.weight);
    const tgt = parseFloat(f.target_weight);
    const kcal =
      f.goal === "lose_fat"
        ? Math.round(w * 26)
        : f.goal === "build_muscle"
          ? Math.round(w * 36)
          : Math.round(w * 31);
    const protein = Math.round(w * 2);
    const water = Math.round(w * 40);
    setTargets({ kcal, protein, water });

    const { error } = await supabase
      .from("profiles")
      .update({
        goal: f.goal,
        age: parseInt(f.age),
        gender: f.gender,
        height_cm: parseInt(f.height),
        weight_kg: w,
        activity_level: f.activity,
        target_weight_kg: tgt,
        target_timeline_weeks: parseInt(f.timeline),
        experience: f.experience,
        environment: f.environment,
        equipment: f.equipment,
        diet: f.diet,
        budget: f.budget,
        protein_pref: f.protein,
        fitness_score: 72,
        program:
          f.goal === "build_muscle"
            ? "Hypertrophy 4-day"
            : f.goal === "lose_fat"
              ? "Cut & Conditioning"
              : "Foundation",
        onboarded: true,
      })
      .eq("id", user.user.id);
    setSaving(false);
    if (error) return toast.error(error.message);
    navigate({ to: "/" });
  };

  return (
    <div className="mx-auto min-h-[100dvh] max-w-[480px] px-6 pb-32 pt-12">
      <header className="flex items-center gap-3">
        <button
          onClick={back}
          disabled={step === 0}
          className="grid h-10 w-10 place-items-center rounded-full bg-surface disabled:opacity-30"
        >
          <ArrowLeft className="h-4 w-4" />
        </button>
        <div className="flex flex-1 gap-1.5">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className={`h-1 flex-1 rounded-full ${i <= step ? "bg-primary" : "bg-surface-elevated"}`}
            />
          ))}
        </div>
      </header>

      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 16 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -16 }}
          transition={{ duration: 0.3 }}
          className="mt-10"
        >
          {step === 0 && (
            <Step title="What's your goal?" subtitle="Pick the one that matters most.">
              <Grid options={goals} value={f.goal} onChange={(v) => set("goal", v)} />
            </Step>
          )}
          {step === 1 && (
            <Step title="Tell us about you" subtitle="Used to tune your plan.">
              <NumberField label="Age" value={f.age} onChange={(v) => set("age", v)} suffix="yrs" />
              <Pills
                label="Gender"
                options={["Male", "Female", "Other"]}
                value={f.gender}
                onChange={(v) => set("gender", v)}
              />
              <NumberField
                label="Height"
                value={f.height}
                onChange={(v) => set("height", v)}
                suffix="cm"
              />
              <NumberField
                label="Weight"
                value={f.weight}
                onChange={(v) => set("weight", v)}
                suffix="kg"
              />
              <Pills
                label="Activity"
                options={activities}
                value={f.activity}
                onChange={(v) => set("activity", v)}
              />
            </Step>
          )}
          {step === 2 && (
            <Step title="Your target" subtitle="We'll forecast your transformation.">
              <NumberField
                label="Target weight"
                value={f.target_weight}
                onChange={(v) => set("target_weight", v)}
                suffix="kg"
              />
              <NumberField
                label="Timeline"
                value={f.timeline}
                onChange={(v) => set("timeline", v)}
                suffix="weeks"
              />
              <Pills
                label="Training experience"
                options={experiences}
                value={f.experience}
                onChange={(v) => set("experience", v)}
              />
            </Step>
          )}
          {step === 3 && (
            <Step title="Where will you train?" subtitle="We'll match your environment.">
              <Grid options={envs} value={f.environment} onChange={(v) => set("environment", v)} />
              <div className="mt-6">
                <p className="text-[11px] uppercase tracking-[0.24em] text-muted-foreground">
                  Available equipment
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {equips.map((e) => (
                    <button
                      key={e}
                      onClick={() => toggleEq(e)}
                      className={`rounded-full border px-4 py-2 text-sm ${f.equipment.includes(e) ? "border-primary bg-primary/10 text-foreground" : "border-border text-muted-foreground"}`}
                    >
                      {e}
                    </button>
                  ))}
                </div>
              </div>
            </Step>
          )}
          {step === 4 && (
            <Step title="Nutrition" subtitle="So we plan meals you'll actually eat.">
              <Grid options={diets} value={f.diet} onChange={(v) => set("diet", v)} />
              <Pills
                label="Budget"
                options={budgets}
                value={f.budget}
                onChange={(v) => set("budget", v)}
              />
              <Pills
                label="Protein preference"
                options={proteins}
                value={f.protein}
                onChange={(v) => set("protein", v)}
              />
            </Step>
          )}
          {step === 5 && <Analysis form={f} />}
        </motion.div>
      </AnimatePresence>

      <div className="fixed bottom-0 left-1/2 z-30 w-full max-w-[480px] -translate-x-1/2 bg-gradient-to-t from-background via-background to-transparent px-6 pb-8 pt-6">
        {step < 5 ? (
          <button
            onClick={next}
            className="flex w-full items-center justify-center gap-2 rounded-full bg-primary py-4 text-[15px] font-semibold text-primary-foreground"
          >
            Continue <ArrowRight className="h-4 w-4" />
          </button>
        ) : (
          <button
            onClick={finish}
            disabled={saving}
            className="flex w-full items-center justify-center gap-2 rounded-full bg-primary py-4 text-[15px] font-semibold text-primary-foreground disabled:opacity-60"
          >
            {saving ? "Building your plan…" : "Enter ATHLYT"}
          </button>
        )}
      </div>
    </div>
  );
}

function Step({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <h1 className="text-[30px] font-semibold leading-tight tracking-tight text-balance">
        {title}
      </h1>
      <p className="mt-2 text-sm text-muted-foreground">{subtitle}</p>
      <div className="mt-8 space-y-5">{children}</div>
    </div>
  );
}

function Grid({
  options,
  value,
  onChange,
}: {
  options: { v: string; l: string }[];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="grid grid-cols-1 gap-3">
      {options.map((o) => (
        <button
          key={o.v}
          onClick={() => onChange(o.v)}
          className={`flex items-center justify-between rounded-2xl border px-5 py-4 text-left text-[15px] font-medium ${value === o.v ? "border-primary bg-primary/10" : "border-border bg-surface"}`}
        >
          {o.l}
          {value === o.v && <Check className="h-4 w-4 text-primary" />}
        </button>
      ))}
    </div>
  );
}
function Pills({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: string[];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <p className="text-[11px] uppercase tracking-[0.24em] text-muted-foreground">{label}</p>
      <div className="mt-3 flex flex-wrap gap-2">
        {options.map((o) => (
          <button
            key={o}
            onClick={() => onChange(o)}
            className={`rounded-full border px-4 py-2 text-sm ${value === o ? "border-primary bg-primary/10 text-foreground" : "border-border text-muted-foreground"}`}
          >
            {o}
          </button>
        ))}
      </div>
    </div>
  );
}
function NumberField({
  label,
  value,
  onChange,
  suffix,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  suffix?: string;
}) {
  return (
    <label className="block">
      <span className="text-[11px] uppercase tracking-[0.24em] text-muted-foreground">{label}</span>
      <div className="mt-2 flex items-baseline gap-2 rounded-2xl border border-border bg-surface px-4 py-4">
        <input
          type="number"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full bg-transparent text-[20px] font-semibold outline-none"
        />
        {suffix && <span className="text-sm text-muted-foreground">{suffix}</span>}
      </div>
    </label>
  );
}

function Analysis({ form }: { form: Form }) {
  const w = parseFloat(form.weight);
  const tgt = parseFloat(form.target_weight);
  const delta = (tgt - w).toFixed(1);
  const program =
    form.goal === "build_muscle"
      ? "Hypertrophy 4-day"
      : form.goal === "lose_fat"
        ? "Cut & Conditioning"
        : "Foundation";
  return (
    <div>
      <div className="flex items-center gap-2">
        <Sparkle className="h-4 w-4 text-primary" />
        <p className="text-[11px] uppercase tracking-[0.28em] text-muted-foreground">
          ATHLYT · AI analysis
        </p>
      </div>
      <h1 className="mt-4 text-[30px] font-semibold leading-tight tracking-tight">
        Your plan is ready.
      </h1>
      <p className="mt-2 text-sm text-muted-foreground">Personalized from your inputs.</p>

      <div className="mt-8 space-y-3">
        <Stat label="Fitness Score" value="72" sub="Above average · top 35%" />
        <Stat
          label="Recommended program"
          value={program}
          sub={`${form.experience} · ${form.environment}`}
        />
        <Stat
          label="Transformation forecast"
          value={`${delta > "0" ? "+" : ""}${delta} kg`}
          sub={`in ${form.timeline} weeks · realistic`}
        />
      </div>
    </div>
  );
}
function Stat({ label, value, sub }: { label: string; value: string; sub: string }) {
  return (
    <div className="rounded-2xl border border-border bg-surface p-5">
      <p className="text-[11px] uppercase tracking-[0.24em] text-muted-foreground">{label}</p>
      <p className="mt-2 text-2xl font-semibold tracking-tight">{value}</p>
      <p className="mt-1 text-xs text-muted-foreground">{sub}</p>
    </div>
  );
}
