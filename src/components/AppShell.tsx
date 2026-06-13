import { Link, Outlet, useLocation, useNavigate } from "@tanstack/react-router";
import { Home, MessageCircle, Dumbbell, TrendingUp, User, Sparkles } from "lucide-react";
import type { ReactNode } from "react";
import { motion } from "framer-motion";

const tabs = [
  { to: "/", label: "Home", icon: Home },
  { to: "/coach", label: "Coach", icon: MessageCircle },
  { to: "/train", label: "Train", icon: Dumbbell },
  { to: "/progress", label: "Progress", icon: TrendingUp },
  { to: "/profile", label: "Profile", icon: User },
] as const;

export function AppShell({ children }: { children?: ReactNode }) {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  return (
    <div className="relative mx-auto flex min-h-[100dvh] max-w-[480px] flex-col">
      <main className="flex-1 pb-32">{children ?? <Outlet />}</main>

      {/* Floating AI button */}
      <button
        onClick={() => navigate({ to: "/coach" })}
        aria-label="Open ATHLYT coach"
        className="fixed bottom-20 left-1/2 z-50 -translate-x-1/2"
      >
        <span className="relative grid h-16 w-16 place-items-center rounded-full animate-pulse-ring"
          style={{ background: "var(--gradient-fab)", boxShadow: "var(--shadow-glow-primary)" }}>
          <Sparkles className="h-7 w-7 text-black" strokeWidth={2.5} />
        </span>
      </button>

      {/* Bottom nav */}
      <nav className="fixed bottom-3 left-1/2 z-40 w-[calc(100%-1.5rem)] max-w-[460px] -translate-x-1/2 glass rounded-full px-2 py-2">
        <ul className="grid grid-cols-5">
          {tabs.map((t, i) => {
            const active = pathname === t.to;
            const Icon = t.icon;
            const isCenter = i === 2;
            return (
              <li key={t.to} className="flex justify-center">
                <Link
                  to={t.to}
                  className={`relative flex h-12 w-12 flex-col items-center justify-center rounded-full transition ${isCenter ? "invisible" : ""}`}
                  aria-label={t.label}
                >
                  {active && (
                    <motion.span
                      layoutId="tab-active"
                      className="absolute inset-0 rounded-full bg-primary/10"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                  <Icon
                    className={`relative h-5 w-5 transition ${active ? "text-primary" : "text-muted-foreground"}`}
                    strokeWidth={active ? 2.5 : 2}
                  />
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}
