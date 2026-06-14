import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Copy, Gift } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/referral")({
  head: () => ({ meta: [{ title: "ATHLYT — Invite" }] }),
  component: Referral,
});

const leaders = [
  { name: "Aria K.", refs: 32 },
  { name: "Jonas P.", refs: 24 },
  { name: "Mia R.", refs: 18 },
  { name: "You", refs: 4 },
];

function Referral() {
  const { data } = useQuery({
    queryKey: ["ref"],
    queryFn: async () => {
      const { data: u } = await supabase.auth.getUser();
      if (!u.user) return null;
      const { data } = await supabase
        .from("profiles")
        .select("referral_code, name")
        .eq("id", u.user.id)
        .maybeSingle();
      return data;
    },
  });
  const code = data?.referral_code ?? "ATHLYT";

  const share = async () => {
    const url = `${window.location.origin}/auth?ref=${code}`;
    if (navigator.share) {
      try {
        await navigator.share({ title: "Join me on ATHLYT", url });
        return;
      } catch {
        /* fall through */
      }
    }
    await navigator.clipboard.writeText(url);
    toast.success("Invite link copied");
  };

  return (
    <div className="mx-auto min-h-[100dvh] max-w-[480px] px-6 pb-10 pt-12">
      <Link to="/profile" className="grid h-10 w-10 place-items-center rounded-full bg-surface">
        <ArrowLeft className="h-4 w-4" />
      </Link>
      <div className="mt-8 flex items-center gap-2">
        <Gift className="h-4 w-4 text-primary" />
        <p className="text-[11px] uppercase tracking-[0.3em] text-primary">Invite friends</p>
      </div>
      <h1 className="mt-3 text-[32px] font-semibold tracking-tight leading-tight">
        Train together. Earn together.
      </h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Get 1 month of Pro for every 3 friends who join.
      </p>

      <div className="mt-8 rounded-2xl border border-border bg-surface p-5">
        <p className="text-[11px] uppercase tracking-[0.28em] text-muted-foreground">Your code</p>
        <div className="mt-3 flex items-center justify-between gap-2">
          <p className="text-3xl font-semibold tracking-[0.16em] text-primary">{code}</p>
          <button
            onClick={() => {
              navigator.clipboard.writeText(code);
              toast.success("Copied");
            }}
            className="grid h-10 w-10 place-items-center rounded-full bg-surface-elevated"
          >
            <Copy className="h-4 w-4" />
          </button>
        </div>
      </div>

      <button
        onClick={share}
        className="mt-4 w-full rounded-full bg-primary py-4 text-[15px] font-semibold text-primary-foreground"
      >
        Share invite link
      </button>

      <section className="mt-10">
        <p className="text-[11px] uppercase tracking-[0.28em] text-muted-foreground">
          Your rewards
        </p>
        <div className="mt-3 grid grid-cols-3 gap-2">
          {[3, 5, 10].map((n) => (
            <div key={n} className="rounded-2xl border border-border bg-surface p-3 text-center">
              <p className="text-2xl font-semibold">{n}</p>
              <p className="text-[10px] text-muted-foreground">
                friends → {n === 3 ? "1mo Pro" : n === 5 ? "3mo Pro" : "1yr Pro"}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-10">
        <p className="text-[11px] uppercase tracking-[0.28em] text-muted-foreground">Leaderboard</p>
        <ul className="mt-3 divide-y divide-border rounded-2xl border border-border bg-surface">
          {leaders.map((u, i) => (
            <li key={u.name} className="flex items-center justify-between px-5 py-3">
              <div className="flex items-center gap-3">
                <span className="text-sm text-muted-foreground w-4">{i + 1}</span>
                <span className="text-[15px]">{u.name}</span>
              </div>
              <span className="text-sm font-semibold">{u.refs}</span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
