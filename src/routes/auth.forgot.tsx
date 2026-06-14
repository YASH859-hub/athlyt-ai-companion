import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const Route = createFileRoute("/auth/forgot")({
  head: () => ({ meta: [{ title: "ATHLYT — Reset Password" }] }),
  component: Forgot,
});

function Forgot() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    setLoading(false);
    if (error) return toast.error(error.message);
    setSent(true);
  };

  return (
    <div className="mx-auto min-h-[100dvh] max-w-[480px] px-6 pb-10 pt-12">
      <Link to="/auth/signin" className="grid h-10 w-10 place-items-center rounded-full bg-surface"><ArrowLeft className="h-4 w-4" /></Link>
      {sent ? (
        <div className="mt-24 text-center">
          <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-primary/15">
            <CheckCircle2 className="h-7 w-7 text-primary" />
          </div>
          <h1 className="mt-6 text-[28px] font-semibold tracking-tight">Check your inbox</h1>
          <p className="mt-3 text-sm text-muted-foreground">We sent a reset link to <span className="text-foreground">{email}</span>.</p>
          <Link to="/auth/signin" className="mt-10 inline-flex rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground">Back to sign in</Link>
        </div>
      ) : (
        <>
          <h1 className="mt-8 text-[34px] font-semibold tracking-tight leading-tight">Reset password</h1>
          <p className="mt-2 text-sm text-muted-foreground">We'll email you a secure link.</p>
          <form onSubmit={submit} className="mt-10 space-y-4">
            <label className="block">
              <span className="text-[11px] uppercase tracking-[0.24em] text-muted-foreground">Email</span>
              <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                className="mt-2 w-full rounded-2xl border border-border bg-surface px-4 py-4 text-[15px] outline-none focus:border-foreground/40" />
            </label>
            <button disabled={loading} className="mt-2 w-full rounded-full bg-primary py-4 text-[15px] font-semibold text-primary-foreground disabled:opacity-60">
              {loading ? "Sending…" : "Send reset link"}
            </button>
          </form>
        </>
      )}
    </div>
  );
}
