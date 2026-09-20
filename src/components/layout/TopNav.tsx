export type Tab = "classroom" | "store" | "reports" | "settings";

interface TopNavProps {
  active: Tab;
  onSelect: (tab: Tab) => void;
}

const TABS: { value: Tab; label: string }[] = [
  { value: "classroom", label: "Classroom" },
  { value: "store", label: "Store" },
  { value: "reports", label: "Reports" },
  { value: "settings", label: "Settings" },
];

export default function TopNav({ active, onSelect }: TopNavProps) {
  return (
    <nav className="sticky top-0 z-30 flex items-center gap-1 border-b border-slate-800 bg-slate-950/95 px-3 py-2 backdrop-blur">
      <span className="mr-2 px-2 text-sm font-black tracking-tight text-stone-100">
        Class Points
      </span>
      {TABS.map((tab) => (
        <button
          key={tab.value}
          type="button"
          onClick={() => onSelect(tab.value)}
          className={`rounded-xl px-4 py-2.5 text-sm font-bold transition ${
            active === tab.value
              ? "bg-stone-50 text-slate-900"
              : "text-stone-300 active:bg-slate-800"
          }`}
        >
          {tab.value === "settings" ? "🔒 Settings" : tab.label}
        </button>
      ))}
    </nav>
  );
}
