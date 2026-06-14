import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, ChevronRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useApp } from "@/lib/store";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/settings")({
  head: () => ({ meta: [{ title: "ATHLYT — Settings" }] }),
  component: Settings,
});

function Settings() {
  const navigate = useNavigate();
  const reset = useApp((s) => s.reset);

  const signOut = async () => { await supabase.auth.signOut(); navigate({ to: "/auth" }); };

  return (
    <div className="mx-auto min-h-[100dvh] max-w-[480px] px-6 pb-10 pt-12">
      <div className="flex items-center gap-3">
        <Link to="/profile" className="grid h-10 w-10 place-items-center rounded-full bg-surface"><ArrowLeft className="h-4 w-4" /></Link>
        <h1 className="text-[28px] font-semibold tracking-tight">Settings</h1>
      </div>

      <Section title="Preferences">
        <Item label="Notifications" to="/notifications" />
        <Item label="Goals & program" to="/onboarding" />
        <Item label="Subscription" to="/subscription" />
      </Section>

      <Section title="Privacy">
        <Item label="Data & privacy" onClick={() => toast("Coming soon")} />
        <Item label="Export my data" onClick={() => toast("We'll email your data within 24h")} />
      </Section>

      <Section title="Support">
        <Item label="Help center" onClick={() => toast("Opening help center")} />
        <Item label="Contact support" onClick={() => toast("support@athlyt.app")} />
      </Section>

      <Section title="Danger">
        <button onClick={() => { reset(); toast.success("App data cleared"); }} className="flex w-full items-center justify-between px-5 py-4 text-left text-[15px] text-warning">
          Reset app data <ChevronRight className="h-4 w-4 text-muted-foreground" />
        </button>
        <button onClick={signOut} className="flex w-full items-center justify-between px-5 py-4 text-left text-[15px] text-destructive">
          Sign out <ChevronRight className="h-4 w-4 text-muted-foreground" />
        </button>
      </Section>

      <p className="mt-8 mb-4 text-center text-[10px] uppercase tracking-[0.32em] text-muted-foreground/60">ATHLYT · v1.0</p>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-8">
      <p className="text-[11px] uppercase tracking-[0.28em] text-muted-foreground">{title}</p>
      <ul className="mt-3 divide-y divide-border rounded-2xl border border-border bg-surface">{children}</ul>
    </section>
  );
}
function Item({ label, to, onClick }: { label: string; to?: string; onClick?: () => void }) {
  const cls = "flex w-full items-center justify-between px-5 py-4 text-[15px]";
  if (to) return <li><Link to={to} className={cls}>{label}<ChevronRight className="h-4 w-4 text-muted-foreground" /></Link></li>;
  return <li><button onClick={onClick} className={cls + " text-left"}>{label}<ChevronRight className="h-4 w-4 text-muted-foreground" /></button></li>;
}
