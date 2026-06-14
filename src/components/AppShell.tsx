import { Link, Outlet, useLocation } from "@tanstack/react-router";
import { Home, Sparkle, Dumbbell, TrendingUp, User } from "lucide-react";
import type { ReactNode } from "react";

const tabs = [
  { to: "/", label: "Home", icon: Home },
  { to: "/coach", label: "Coach", icon: Sparkle },
  { to: "/train", label: "Train", icon: Dumbbell },
  { to: "/progress", label: "Progress", icon: TrendingUp },
  { to: "/profile", label: "Profile", icon: User },
] as const;

export function AppShell({ children }: { children?: ReactNode }) {
  const { pathname } = useLocation();

  return (
    <div className="relative mx-auto flex min-h-[100dvh] max-w-[480px] flex-col bg-background">
      <main className="flex-1 pb-28">{children ?? <Outlet />}</main>

      <nav className="fixed bottom-0 left-1/2 z-40 w-full max-w-[480px] -translate-x-1/2 border-t border-border bg-background/85 backdrop-blur-2xl">
        <ul className="grid grid-cols-5 px-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-2">
          {tabs.map((t) => {
            const active = pathname === t.to;
            const Icon = t.icon;
            return (
              <li key={t.to}>
                <Link
                  to={t.to}
                  className="flex flex-col items-center gap-1 py-2"
                  aria-label={t.label}
                >
                  <Icon
                    className={`h-[22px] w-[22px] transition ${active ? "text-foreground" : "text-muted-foreground/70"}`}
                    strokeWidth={active ? 2.4 : 1.8}
                  />
                  <span className={`text-[10px] tracking-wide ${active ? "text-foreground" : "text-muted-foreground/70"}`}>
                    {t.label}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}
