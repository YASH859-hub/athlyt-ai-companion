import { createFileRoute, Outlet, redirect, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_authenticated")({
  ssr: false,
  beforeLoad: async () => {
    const { data } = await supabase.auth.getUser();
    if (!data.user) throw redirect({ to: "/auth" });
    return { user: data.user };
  },
  component: AuthedLayout,
});

function AuthedLayout() {
  const { user } = Route.useRouteContext();
  const navigate = useNavigate();
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    const check = async () => {
      const { data } = await supabase.from("profiles").select("onboarded").eq("id", user.id).maybeSingle();
      if (!data?.onboarded && window.location.pathname !== "/onboarding") {
        navigate({ to: "/onboarding" });
      }
      setChecked(true);
    };
    void check();
  }, [user.id, navigate]);

  if (!checked) {
    return (
      <div className="grid min-h-[100dvh] place-items-center bg-background">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary/30 border-t-primary" />
      </div>
    );
  }
  return <Outlet />;
}
