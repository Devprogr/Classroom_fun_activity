interface ProgressBarProps {
  current: number;
  target: number;
}

export default function ProgressBar({ current, target }: ProgressBarProps) {
  const pct = target > 0 ? Math.max(0, Math.min(100, (current / target) * 100)) : 0;
  const met = current >= target;
  return (
    <div>
      <div className="h-3 w-full overflow-hidden rounded-full bg-slate-200">
        <div
          className={`h-full rounded-full transition-all ${met ? "bg-emerald-500" : "bg-sky-500"}`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <p className="mt-1 text-xs font-medium text-slate-500">
        {met ? "Class total covers this" : `${Math.max(0, target - current)} more points needed`}
      </p>
    </div>
  );
}
