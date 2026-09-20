import { useState } from "react";

interface PinModalProps {
  expectedPin: string | null;
  label?: string;
  onSuccess: () => void;
  onCancel: () => void;
}

const PAD_KEYS = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "", "0", "back"];

export default function PinModal({ expectedPin, label, onSuccess, onCancel }: PinModalProps) {
  const [digits, setDigits] = useState("");
  const [error, setError] = useState(false);

  function press(key: string) {
    setError(false);
    if (key === "back") {
      setDigits((d) => d.slice(0, -1));
      return;
    }
    if (key === "") return;
    if (digits.length >= 4) return;
    const next = digits + key;
    setDigits(next);
    if (next.length === 4) {
      if (expectedPin && next === expectedPin) {
        setTimeout(onSuccess, 80);
      } else {
        setError(true);
        setTimeout(() => setDigits(""), 350);
      }
    }
  }

  return (
    <div className="animate-fade-in fixed inset-0 z-[200] flex items-center justify-center bg-slate-950/80 p-4">
      <div className="w-full max-w-xs rounded-3xl bg-stone-50 p-6 text-center text-slate-900 shadow-2xl">
        <h2 className="text-lg font-bold">{label ?? "Enter teacher PIN"}</h2>
        <p className="mt-1 text-sm text-slate-500">This just keeps students out.</p>
        <div className="mt-5 flex justify-center gap-4">
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              className={`h-4 w-4 rounded-full border-2 ${
                error
                  ? "border-rose-500 bg-rose-500"
                  : i < digits.length
                    ? "border-slate-900 bg-slate-900"
                    : "border-slate-300 bg-transparent"
              }`}
            />
          ))}
        </div>
        {error && <p className="mt-2 text-sm font-medium text-rose-600">Wrong PIN, try again</p>}
        <div className="mt-6 grid grid-cols-3 gap-3">
          {PAD_KEYS.map((key, i) =>
            key === "" ? (
              <div key={`empty-${i}`} />
            ) : (
              <button
                key={key}
                type="button"
                onClick={() => press(key)}
                className="flex h-16 items-center justify-center rounded-2xl bg-slate-100 text-2xl font-semibold text-slate-900 active:bg-slate-200"
              >
                {key === "back" ? "⌫" : key}
              </button>
            ),
          )}
        </div>
        <button
          type="button"
          onClick={onCancel}
          className="mt-5 w-full rounded-xl py-3 text-base font-semibold text-slate-500 active:bg-slate-100"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
