interface ClassTotalCardProps {
  className: string;
  total: number;
}

export default function ClassTotalCard({ className, total }: ClassTotalCardProps) {
  const negative = total < 0;
  return (
    <div className="col-span-full flex min-h-[100px] items-center justify-between rounded-3xl bg-slate-900 px-6 py-5 shadow-sm">
      <div>
        <p className="text-sm font-semibold uppercase tracking-widest text-slate-400">
          {className || "Class"} total
        </p>
        <p className="text-xs text-slate-500">Sum of every student's points</p>
      </div>
      <p
        className={`text-5xl font-black tabular-nums ${negative ? "text-rose-400" : "text-emerald-400"}`}
      >
        {total}
      </p>
    </div>
  );
}
