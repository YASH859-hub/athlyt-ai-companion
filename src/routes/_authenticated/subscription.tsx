import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Check, Crown } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/subscription")({
  head: () => ({ meta: [{ title: "ATHLYT — Pro" }] }),
  component: Sub,
});

const plans = [
  { id: "monthly", name: "Monthly", price: "$14.99", per: "/month", save: null },
  { id: "yearly", name: "Yearly", price: "$89.99", per: "/year", save: "Save 50%" },
  { id: "premium", name: "Premium", price: "$199", per: "/year", save: "All-access" },
];

const features = [
  "Unlimited AI coaching",
  "Custom workout plans",
  "Macro & meal planning",
  "Recovery analytics",
  "Transformation reports",
  "Priority support",
];

function Sub() {
  const [pick, setPick] = useState("yearly");
  return (
    <div className="mx-auto min-h-[100dvh] max-w-[480px] px-6 pb-10 pt-12">
      <Link to="/profile" className="grid h-10 w-10 place-items-center rounded-full bg-surface"><ArrowLeft className="h-4 w-4" /></Link>
      <div className="mt-8 flex items-center gap-2"><Crown className="h-4 w-4 text-primary" /><p className="text-[11px] uppercase tracking-[0.3em] text-primary">ATHLYT Pro</p></div>
      <h1 className="mt-3 text-[34px] font-semibold tracking-tight leading-tight text-balance">Become the strongest version of yourself.</h1>

      <ul className="mt-8 space-y-2">
        {features.map((f) => (
          <li key={f} className="flex items-center gap-3 text-[15px]"><span className="grid h-5 w-5 place-items-center rounded-full bg-primary/15"><Check className="h-3 w-3 text-primary" /></span>{f}</li>
        ))}
      </ul>

      <div className="mt-8 space-y-3">
        {plans.map((p) => (
          <button key={p.id} onClick={() => setPick(p.id)} className={`flex w-full items-center justify-between rounded-2xl border px-5 py-4 ${pick === p.id ? "border-primary bg-primary/10" : "border-border bg-surface"}`}>
            <div className="text-left">
              <p className="text-[15px] font-semibold">{p.name}</p>
              {p.save && <p className="text-xs text-primary">{p.save}</p>}
            </div>
            <div className="text-right">
              <p className="text-base font-semibold">{p.price}<span className="text-xs text-muted-foreground">{p.per}</span></p>
            </div>
          </button>
        ))}
      </div>

      <button onClick={() => toast.success("Subscription will be available soon", { description: "Payments integration pending." })}
        className="mt-8 w-full rounded-full bg-primary py-4 text-[15px] font-semibold text-primary-foreground">Start 7-day free trial</button>
      <p className="mt-3 text-center text-[11px] text-muted-foreground">Cancel anytime. No commitments.</p>
    </div>
  );
}
