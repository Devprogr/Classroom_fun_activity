import { useState } from "react";
import { useApp } from "../../state/AppContext";
import ConfirmDialog from "../common/ConfirmDialog";

export default function ResetSection() {
  const { dispatch } = useApp();
  const [confirmOpen, setConfirmOpen] = useState(false);

  return (
    <div>
      <button
        type="button"
        onClick={() => setConfirmOpen(true)}
        className="rounded-xl border-2 border-rose-200 bg-rose-50 px-4 py-2.5 text-sm font-bold text-rose-600 active:bg-rose-100"
      >
        Reset all points to zero
      </button>
      <p className="mt-2 text-xs text-slate-400">
        Students, behaviours, and rewards are kept. Only point totals go back to zero — the change
        is written to the log so reports stay accurate.
      </p>

      {confirmOpen && (
        <ConfirmDialog
          title="Reset all points to zero?"
          message='Every student goes back to 0 points. Students, behaviours, and rewards are kept. Type RESET below to confirm.'
          confirmLabel="Reset points"
          requireTypedWord="RESET"
          onCancel={() => setConfirmOpen(false)}
          onConfirm={() => {
            dispatch({ type: "RESET_POINTS" });
            setConfirmOpen(false);
          }}
        />
      )}
    </div>
  );
}
