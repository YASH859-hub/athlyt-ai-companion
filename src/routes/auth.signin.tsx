import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const Route = createFileRoute("/auth/signin")({
  head: () => ({ meta: [{ title: "ATHLYT — Sign In" }] }),
  component: SignIn,
});

function SignIn() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password: pw });
    setLoading(false);
    if (error) return toast.error(error.message);
    navigate({ to: "/" });
  };

  return (
    <div className="mx-auto min-h-[100dvh] max-w-[480px] px-6 pb-10 pt-12">
      <Link to="/auth" className="grid h-10 w-10 place-items-center rounded-full bg-surface">
        <ArrowLeft className="h-4 w-4" />
      </Link>
      <h1 className="mt-8 text-[34px] font-semibold tracking-tight leading-tight">Welcome back</h1>
      <p className="mt-2 text-sm text-muted-foreground">Your coach is ready.</p>

      <form onSubmit={submit} className="mt-10 space-y-4">
        <label className="block">
          <span className="text-[11px] uppercase tracking-[0.24em] text-muted-foreground">
            Email
          </span>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@athlyt.com"
            className="mt-2 w-full rounded-2xl border border-border bg-surface px-4 py-4 text-[15px] outline-none focus:border-foreground/40"
          />
        </label>
        <label className="block">
          <span className="text-[11px] uppercase tracking-[0.24em] text-muted-foreground">
            Password
          </span>
          <input
            type="password"
            required
            value={pw}
            onChange={(e) => setPw(e.target.value)}
            placeholder="••••••••"
            className="mt-2 w-full rounded-2xl border border-border bg-surface px-4 py-4 text-[15px] outline-none focus:border-foreground/40"
          />
        </label>

        <div className="flex justify-end pt-1">
          <Link to="/auth/forgot" className="text-[13px] text-muted-foreground">
            Forgot password?
          </Link>
        </div>

        <button
          disabled={loading}
          className="mt-4 w-full rounded-full bg-primary py-4 text-[15px] font-semibold text-primary-foreground disabled:opacity-60"
        >
          {loading ? "Signing in…" : "Continue"}
        </button>
        <p className="pt-2 text-center text-[13px] text-muted-foreground">
          New here?{" "}
          <Link to="/auth/signup" className="font-semibold text-foreground">
            Create an account
          </Link>
        </p>
      </form>
    </div>
  );
}
