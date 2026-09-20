import { useState } from "react";

interface StudentBulkAddFormProps {
  onAdd: (firstNames: string[]) => void;
  buttonLabel?: string;
}

export function parseNames(raw: string): string[] {
  return raw
    .split(/\r?\n/)
    .map((line) => line.replace(/^[\s\-*•\d.)]+/, "").trim())
    .filter((line) => line.length > 0);
}

export default function StudentBulkAddForm({ onAdd, buttonLabel = "Add students" }: StudentBulkAddFormProps) {
  const [raw, setRaw] = useState("");
  const names = parseNames(raw);

  function handleAdd() {
    if (names.length === 0) return;
    onAdd(names);
    setRaw("");
  }

  return (
    <div>
      <textarea
        id="student-bulk-add-names"
        name="studentBulkAddNames"
        value={raw}
        onChange={(e) => setRaw(e.target.value)}
        placeholder={"Paste or type one first name per line, e.g.\nFreya\nOmar\nLucia"}
        rows={10}
        className="w-full resize-y rounded-2xl border border-slate-300 bg-white px-4 py-3 text-base leading-relaxed text-slate-900 focus:border-slate-500 focus:outline-none"
      />
      <div className="mt-2 flex items-center justify-between text-sm text-slate-500">
        <span>{names.length} name{names.length === 1 ? "" : "s"} detected</span>
      </div>
      <button
        type="button"
        onClick={handleAdd}
        disabled={names.length === 0}
        className="mt-3 w-full rounded-2xl bg-slate-900 py-4 text-lg font-bold text-stone-50 active:opacity-80 disabled:cursor-not-allowed disabled:opacity-40"
      >
        {buttonLabel}
      </button>
    </div>
  );
}
