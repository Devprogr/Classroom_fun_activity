import type { Student } from "../../types";

interface StudentCardProps {
  student: Student;
  selected: boolean;
  selectMode: boolean;
  onTap: () => void;
  onInfo: () => void;
}

export default function StudentCard({ student, selected, selectMode, onTap, onInfo }: StudentCardProps) {
  const negative = student.points < 0;

  return (
    <button
      type="button"
      onClick={onTap}
      style={{ borderColor: student.colour }}
      className={`relative flex min-h-[140px] flex-col items-center justify-center gap-1 rounded-3xl border-4 bg-stone-50 px-3 py-4 text-center shadow-sm transition active:scale-[0.97] ${
        selected ? "ring-4 ring-sky-400 ring-offset-2 ring-offset-slate-950" : ""
      }`}
    >
      {selectMode && (
        <span
          className={`absolute left-3 top-3 flex h-7 w-7 items-center justify-center rounded-full border-2 text-sm font-bold ${
            selected
              ? "border-sky-500 bg-sky-500 text-white"
              : "border-slate-300 bg-white text-transparent"
          }`}
        >
          ✓
        </span>
      )}
      <span
        role="button"
        aria-label={`${student.firstName} details`}
        onClick={(e) => {
          e.stopPropagation();
          onInfo();
        }}
        className="absolute right-2 top-2 flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-base text-slate-500 active:bg-slate-200"
      >
        ⓘ
      </span>
      <span className="text-4xl leading-none">{student.emoji}</span>
      <span className="mt-1 max-w-full truncate text-lg font-semibold text-slate-700">
        {student.firstName}
      </span>
      <span
        className={`text-4xl font-black leading-none tabular-nums ${
          negative ? "text-rose-600" : "text-slate-900"
        }`}
      >
        {student.points}
      </span>
    </button>
  );
}
