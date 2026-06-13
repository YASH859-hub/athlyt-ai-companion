export function MissionRing({ value, label, sub }: { value: number; label: string; sub?: string }) {
  const pct = Math.min(100, Math.max(0, value));
  return (
    <div className="relative grid h-44 w-44 place-items-center">
      <div
        className="ring-progress h-full w-full rounded-full"
        style={{ ["--progress" as string]: `${pct}%` }}
      />
      <div className="absolute inset-2 rounded-full bg-background grid place-items-center text-center">
        <div>
          <div className="text-5xl font-semibold tracking-tight">{pct}<span className="text-xl text-muted-foreground">%</span></div>
          <div className="mt-1 text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">{label}</div>
          {sub && <div className="mt-1 text-[11px] text-muted-foreground/80">{sub}</div>}
        </div>
      </div>
    </div>
  );
}
