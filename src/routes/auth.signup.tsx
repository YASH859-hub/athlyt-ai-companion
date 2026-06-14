import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const Route = createFileRoute("/auth/signup")({
  head: () => ({ meta: [{ title: "ATHLYT — Create Account" }] }),
  component: Signup,
});

function Signup() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [pw2, setPw2] = useState("");
  const [agree, setAgree] = useState(false);
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (pw !== pw2) return toast.error("Passwords don't match");
    if (!agree) return toast.error("Please accept terms");
    if (pw.length < 6) return toast.error("Password too short (min 6)");
    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email,
      password: pw,
      options: { data: { name }, emailRedirectTo: window.location.origin },
    });
    setLoading(false);
    if (error) return toast.error(error.message);
    toast.success("Welcome to ATHLYT");
    navigate({ to: "/onboarding" });
  };

  return (
    <div className="mx-auto min-h-[100dvh] max-w-[480px] px-6 pb-10 pt-12">
      <Link to="/auth" className="grid h-10 w-10 place-items-center rounded-full bg-surface"><ArrowLeft className="h-4 w-4" /></Link>
      <h1 className="mt-8 text-[34px] font-semibold tracking-tight leading-tight">Create your account</h1>
      <p className="mt-2 text-sm text-muted-foreground">Start your transformation in 30 seconds.</p>

      <form onSubmit={submit} className="mt-10 space-y-4">
        <Field label="Name" value={name} onChange={setName} placeholder="Om" />
        <Field label="Email" value={email} onChange={setEmail} type="email" placeholder="you@athlyt.com" />
        <Field label="Password" value={pw} onChange={setPw} type="password" placeholder="••••••••" />
        <Field label="Confirm password" value={pw2} onChange={setPw2} type="password" placeholder="••••••••" />

        <label className="flex items-start gap-3 pt-2 text-[13px] text-muted-foreground">
          <input type="checkbox" checked={agree} onChange={(e) => setAgree(e.target.checked)} className="mt-1 h-4 w-4 accent-primary" />
          <span>I agree to the Terms of Service and Privacy Policy.</span>
        </label>

        <button disabled={loading} className="mt-4 w-full rounded-full bg-primary py-4 text-[15px] font-semibold text-primary-foreground disabled:opacity-60">
          {loading ? "Creating…" : "Create account"}
        </button>
        <p className="pt-2 text-center text-[13px] text-muted-foreground">
          Have an account?{" "}<Link to="/auth/signin" className="font-semibold text-foreground">Sign in</Link>
        </p>
      </form>
    </div>
  );
}

function Field({ label, value, onChange, type = "text", placeholder }: { label: string; value: string; onChange: (v: string) => void; type?: string; placeholder?: string }) {
  return (
    <label className="block">
      <span className="text-[11px] uppercase tracking-[0.24em] text-muted-foreground">{label}</span>
      <input type={type} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} required
        className="mt-2 w-full rounded-2xl border border-border bg-surface px-4 py-4 text-[15px] outline-none focus:border-foreground/40" />
    </label>
  );
}
