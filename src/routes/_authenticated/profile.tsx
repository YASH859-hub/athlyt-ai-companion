import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ChevronRight, Crown, Bell, Gift, Settings, LogOut, Shield, HelpCircle, Target } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { AppShell } from "@/components/AppShell";
import { supabase } from "@/integrations/supabase/client";
import { useApp } from "@/lib/store";

export const Route = createFileRoute("/_authenticated/profile")({
  head: () => ({ meta: [{ title: "ATHLYT — You" }] }),
  component: Profile,
});

function Profile() {
  const navigate = useNavigate();
  const xp = useApp((s) => s.xp);
  const level = useApp((s) => s.level);
  const streak = useApp((s) => s.streak);

  const { data: profile } = useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      const { data: u } = await supabase.auth.getUser();
      if (!u.user) return null;
      const { data } = await supabase.from("profiles").select("*").eq("id", u.user.id).maybeSingle();
      return data;
    },
  });

  const signOut = async () => { await supabase.auth.signOut(); navigate({ to: "/auth" }); };
  const name = profile?.name ?? "Athlete";
  const initials = name.split(" ").map((p) => p[0]).slice(0, 2).join("").toUpperCase();

  return (
    <AppShell>
      <div className="px-6 pt-14">
        <div className="flex items-center gap-4">
          <div className="grid h-16 w-16 place-items-center rounded-full bg-gradient-to-br from-primary to-secondary text-lg font-bold text-primary-foreground">{initials}</div>
          <div>
            <h1 className="text-[24px] font-semibold tracking-tight">{name}</h1>
            <p className="text-xs text-muted-foreground">{profile?.email}</p>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-3 gap-2">
          <Stat label="Level" value={`${level}`} />
          <Stat label="Streak" value={`${streak}d`} />
          <Stat label="XP" value={`${xp}`} />
        </div>

        <div className="mt-6 rounded-2xl border border-primary/30 bg-gradient-to-br from-primary/20 to-secondary/10 p-5">
          <div className="flex items-center gap-2"><Crown className="h-4 w-4 text-primary" /><p className="text-[11px] uppercase tracking-[0.28em] text-primary">{profile?.plan === "free" ? "Upgrade to Pro" : "ATHLYT Pro"}</p></div>
          <p className="mt-2 text-[18px] font-semibold leading-tight">{profile?.plan === "free" ? "Unlock advanced coaching" : "All features unlocked"}</p>
          <Link to="/subscription" className="mt-4 inline-flex rounded-full bg-foreground px-4 py-2 text-xs font-semibold text-background">{profile?.plan === "free" ? "See plans" : "Manage"}</Link>
        </div>

        <section className="mt-8">
          <p className="text-[11px] uppercase tracking-[0.28em] text-muted-foreground">Coaching</p>
          <ul className="mt-3 divide-y divide-border rounded-2xl border border-border bg-surface">
            <Row to="/onboarding" icon={Target} label="Goals & program" />
            <Row to="/notifications" icon={Bell} label="Notifications" />
            <Row to="/referral" icon={Gift} label="Invite friends" />
          </ul>
        </section>

        <section className="mt-6">
          <p className="text-[11px] uppercase tracking-[0.28em] text-muted-foreground">Account</p>
          <ul className="mt-3 divide-y divide-border rounded-2xl border border-border bg-surface">
            <Row to="/settings" icon={Settings} label="Settings" />
            <Row to="/settings" icon={Shield} label="Privacy" />
            <Row to="/settings" icon={HelpCircle} label="Support" />
          </ul>
        </section>

        <button onClick={signOut} className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl border border-border bg-surface py-4 text-sm font-semibold text-destructive">
          <LogOut className="h-4 w-4" /> Sign out
        </button>
        <p className="mt-6 text-center text-[10px] uppercase tracking-[0.32em] text-muted-foreground/60">ATHLYT · v1.0</p>
        <div className="h-10" />
      </div>
    </AppShell>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-border bg-surface px-3 py-3 text-center">
      <p className="text-xl font-semibold">{value}</p>
      <p className="mt-1 text-[10px] uppercase tracking-[0.22em] text-muted-foreground">{label}</p>
    </div>
  );
}
function Row({ to, icon: Icon, label }: { to: string; icon: typeof Crown; label: string }) {
  return (
    <li>
      <Link to={to} className="flex items-center justify-between px-5 py-4">
        <span className="flex items-center gap-3 text-[15px]"><Icon className="h-4 w-4 text-muted-foreground" />{label}</span>
        <ChevronRight className="h-4 w-4 text-muted-foreground" />
      </Link>
    </li>
  );
}
