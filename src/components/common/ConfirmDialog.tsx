import { useState } from "react";
import type { ReactNode } from "react";

interface ConfirmDialogProps {
  title: string;
  message: ReactNode;
  confirmLabel?: string;
  danger?: boolean;
  /** If set, the confirm button stays disabled until the user types this exact word. */
  requireTypedWord?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmDialog({
  title,
  message,
  confirmLabel = "Confirm",
  danger = true,
  requireTypedWord,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  const [typed, setTyped] = useState("");
  const locked = Boolean(requireTypedWord) && typed !== requireTypedWord;

  return (
    <div className="animate-fade-in fixed inset-0 z-[200] flex items-center justify-center bg-slate-950/80 p-4">
      <div className="w-full max-w-sm rounded-3xl bg-stone-50 p-6 text-slate-900 shadow-2xl">
        <h2 className="text-lg font-bold">{title}</h2>
        <div className="mt-2 text-sm leading-relaxed text-slate-600">{message}</div>
        {requireTypedWord && (
          <input
            autoFocus
            value={typed}
            onChange={(e) => setTyped(e.target.value)}
            placeholder={`Type ${requireTypedWord} to confirm`}
            className="mt-4 w-full rounded-xl border border-slate-300 px-4 py-3 text-base tracking-wide focus:border-slate-500 focus:outline-none"
          />
        )}
        <div className="mt-6 flex gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 rounded-xl bg-slate-100 py-3 text-base font-semibold text-slate-700 active:bg-slate-200"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={locked}
            onClick={onConfirm}
            className={`flex-1 rounded-xl py-3 text-base font-bold text-stone-50 active:opacity-80 disabled:cursor-not-allowed disabled:opacity-40 ${
              danger ? "bg-rose-600" : "bg-emerald-600"
            }`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
