import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const Route = createFileRoute("/reset-password")({
  head: () => ({ meta: [{ title: "ATHLYT — New password" }] }),
  component: Reset,
});

function Reset() {
  const navigate = useNavigate();
  const [pw, setPw] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password: pw });
    setLoading(false);
    if (error) return toast.error(error.message);
    toast.success("Password updated");
    navigate({ to: "/" });
  };

  return (
    <div className="mx-auto min-h-[100dvh] max-w-[480px] px-6 pb-10 pt-24">
      <h1 className="text-[34px] font-semibold tracking-tight">Set a new password</h1>
      <form onSubmit={submit} className="mt-10 space-y-4">
        <label className="block">
          <span className="text-[11px] uppercase tracking-[0.24em] text-muted-foreground">New password</span>
          <input type="password" required minLength={6} value={pw} onChange={(e) => setPw(e.target.value)}
            className="mt-2 w-full rounded-2xl border border-border bg-surface px-4 py-4 text-[15px] outline-none focus:border-foreground/40" />
        </label>
        <button disabled={loading} className="w-full rounded-full bg-primary py-4 text-[15px] font-semibold text-primary-foreground disabled:opacity-60">
          {loading ? "Updating…" : "Update password"}
        </button>
      </form>
    </div>
  );
}
