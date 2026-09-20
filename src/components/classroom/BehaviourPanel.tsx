import type { Behaviour, Student } from "../../types";
import SlideUpPanel from "../common/SlideUpPanel";

interface BehaviourPanelProps {
  students: Student[];
  behaviours: Behaviour[];
  onAward: (behaviour: Behaviour) => void;
  onClose: () => void;
}

const SECTIONS: { category: Behaviour["category"]; title: string; classes: string }[] = [
  {
    category: "positive",
    title: "Positive",
    classes: "bg-emerald-50 border-emerald-200",
  },
  {
    category: "leader",
    title: "Classroom leader",
    classes: "bg-amber-50 border-amber-200",
  },
  {
    category: "negative",
    title: "Needs improvement",
    classes: "bg-rose-50 border-rose-200",
  },
];

const TILE_CLASSES: Record<Behaviour["category"], string> = {
  positive: "bg-emerald-600 text-white",
  leader: "bg-amber-500 text-white",
  negative: "bg-rose-600 text-white",
};

export default function BehaviourPanel({ students, behaviours, onAward, onClose }: BehaviourPanelProps) {
  const names = students.map((s) => s.firstName).join(", ");

  return (
    <SlideUpPanel onClose={onClose}>
      <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">
            Award to
          </p>
          <h2 className="text-xl font-bold text-slate-900">{names}</h2>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-lg text-slate-600 active:bg-slate-200"
        >
          ×
        </button>
      </div>
      <div className="flex-1 overflow-y-auto px-6 py-4">
        {SECTIONS.map((section) => {
          const items = behaviours.filter(
            (b) => b.category === section.category && b.active,
          );
          if (items.length === 0) return null;
          return (
            <div key={section.category} className="mb-6">
              <h3 className="mb-2 text-sm font-bold uppercase tracking-wide text-slate-500">
                {section.title}
              </h3>
              <div className={`grid grid-cols-2 gap-3 rounded-2xl border p-3 sm:grid-cols-3 md:grid-cols-4 ${section.classes}`}>
                {items.map((b) => (
                  <button
                    key={b.id}
                    type="button"
                    onClick={() => onAward(b)}
                    className={`flex min-h-[80px] flex-col items-center justify-center gap-1 rounded-xl px-3 py-3 text-center shadow-sm active:opacity-80 ${TILE_CLASSES[section.category]}`}
                  >
                    <span className="text-2xl font-black tabular-nums">
                      {b.value > 0 ? `+${b.value}` : b.value}
                    </span>
                    <span className="text-sm font-medium leading-tight">{b.label}</span>
                    {b.note && <span className="text-xs opacity-80">{b.note}</span>}
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </SlideUpPanel>
  );
}
