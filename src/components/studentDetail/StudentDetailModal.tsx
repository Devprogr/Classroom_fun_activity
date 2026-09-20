import { useMemo, useState } from "react";
import { useApp } from "../../state/AppContext";
import { usePinGate } from "../../state/PinGateContext";
import Modal from "../common/Modal";
import ConfirmDialog from "../common/ConfirmDialog";
import { entriesForStudent, weeklyTotal } from "../../lib/reports";
import { formatDateTime } from "../../lib/date";
import { playPointsSound } from "../../lib/sound";
import { EMOJI_PICKER_OPTIONS, STUDENT_COLOURS } from "../../lib/avatars";

interface StudentDetailModalProps {
  studentId: string;
  onClose: () => void;
}

export default function StudentDetailModal({ studentId, onClose }: StudentDetailModalProps) {
  const { state, dispatch, getStudent } = useApp();
  const { requestPin } = usePinGate();
  const student = getStudent(studentId);

  const [editingName, setEditingName] = useState(false);
  const [nameDraft, setNameDraft] = useState(student?.firstName ?? "");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showColourPicker, setShowColourPicker] = useState(false);
  const [adjustValue, setAdjustValue] = useState("");
  const [adjustReason, setAdjustReason] = useState("");
  const [adjustError, setAdjustError] = useState("");
  const [confirmDeleteEntryId, setConfirmDeleteEntryId] = useState<string | null>(null);
  const [confirmRemoveStudent, setConfirmRemoveStudent] = useState(false);

  const recentEntries = useMemo(() => {
    if (!student) return [];
    return entriesForStudent(state.log, student.id)
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, 20);
  }, [state.log, student]);

  if (!student) {
    return (
      <Modal onClose={onClose}>
        <div className="p-6">
          <p className="text-slate-600">This student was removed.</p>
          <button
            type="button"
            onClick={onClose}
            className="mt-4 rounded-xl bg-slate-900 px-4 py-2 font-semibold text-stone-50"
          >
            Close
          </button>
        </div>
      </Modal>
    );
  }

  const weekTotal = weeklyTotal(state.log, student.id);

  const handleManualAdjust = () => {
    const value = Number(adjustValue);
    if (!Number.isFinite(value) || value === 0) {
      setAdjustError("Enter a non-zero number");
      return;
    }
    if (!adjustReason.trim()) {
      setAdjustError("Add a short reason");
      return;
    }
    dispatch({
      type: "MANUAL_ADJUST",
      studentId: student.id,
      value: Math.round(value),
      reason: adjustReason.trim(),
    });
    playPointsSound(Math.round(value));
    setAdjustValue("");
    setAdjustReason("");
    setAdjustError("");
  };

  const commitName = () => {
    const trimmed = nameDraft.trim();
    if (trimmed) {
      dispatch({ type: "UPDATE_STUDENT", id: student.id, patch: { firstName: trimmed } });
    }
    setEditingName(false);
  };

  return (
    <Modal onClose={onClose} wide>
      <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
        <h2 className="text-lg font-bold">Student details</h2>
        <button
          type="button"
          onClick={onClose}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-lg text-slate-600 active:bg-slate-200"
        >
          ×
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-5">
        <div className="flex flex-wrap items-center gap-4">
          <button
            type="button"
            onClick={() => setShowEmojiPicker((v) => !v)}
            style={{ borderColor: student.colour }}
            className="flex h-20 w-20 items-center justify-center rounded-full border-4 bg-white text-4xl"
          >
            {student.emoji}
          </button>
          <div className="flex-1">
            {editingName ? (
              <input
                autoFocus
                value={nameDraft}
                onChange={(e) => setNameDraft(e.target.value)}
                onBlur={commitName}
                onKeyDown={(e) => e.key === "Enter" && commitName()}
                className="rounded-xl border border-slate-300 px-3 py-2 text-xl font-bold focus:border-slate-500 focus:outline-none"
              />
            ) : (
              <button
                type="button"
                onClick={() => {
                  setNameDraft(student.firstName);
                  setEditingName(true);
                }}
                className="text-2xl font-bold text-slate-900"
              >
                {student.firstName} <span className="text-sm font-normal text-slate-400">(edit)</span>
              </button>
            )}
            <button
              type="button"
              onClick={() => setShowColourPicker((v) => !v)}
              className="mt-2 flex items-center gap-2 text-sm text-slate-500"
            >
              <span
                className="h-4 w-4 rounded-full border border-slate-300"
                style={{ backgroundColor: student.colour }}
              />
              Change colour
            </button>
          </div>
          <div className="flex gap-6 text-right">
            <div>
              <p className="text-xs font-semibold uppercase text-slate-400">This week</p>
              <p className={`text-2xl font-black tabular-nums ${weekTotal < 0 ? "text-rose-600" : "text-slate-900"}`}>
                {weekTotal}
              </p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase text-slate-400">All time</p>
              <p className={`text-2xl font-black tabular-nums ${student.points < 0 ? "text-rose-600" : "text-slate-900"}`}>
                {student.points}
              </p>
            </div>
          </div>
        </div>

        {showEmojiPicker && (
          <div className="mt-3 grid grid-cols-8 gap-2 rounded-2xl bg-slate-100 p-3 sm:grid-cols-10">
            {EMOJI_PICKER_OPTIONS.map((emoji) => (
              <button
                key={emoji}
                type="button"
                onClick={() => {
                  dispatch({ type: "UPDATE_STUDENT", id: student.id, patch: { emoji } });
                  setShowEmojiPicker(false);
                }}
                className="flex h-10 w-10 items-center justify-center rounded-lg text-xl active:bg-slate-200"
              >
                {emoji}
              </button>
            ))}
          </div>
        )}

        {showColourPicker && (
          <div className="mt-3 flex flex-wrap gap-2 rounded-2xl bg-slate-100 p-3">
            {STUDENT_COLOURS.map((colour) => (
              <button
                key={colour}
                type="button"
                onClick={() => {
                  dispatch({ type: "UPDATE_STUDENT", id: student.id, patch: { colour } });
                  setShowColourPicker(false);
                }}
                style={{ backgroundColor: colour }}
                className="h-10 w-10 rounded-full border-2 border-white shadow"
              />
            ))}
          </div>
        )}

        <div className="mt-6 rounded-2xl border border-slate-200 p-4">
          <h3 className="text-sm font-bold uppercase tracking-wide text-slate-500">
            Manual adjustment
          </h3>
          <div className="mt-2 flex flex-wrap gap-2">
            <input
              inputMode="numeric"
              value={adjustValue}
              onChange={(e) => setAdjustValue(e.target.value)}
              placeholder="e.g. 15 or -5"
              className="w-32 rounded-xl border border-slate-300 px-3 py-2 text-base focus:border-slate-500 focus:outline-none"
            />
            <input
              value={adjustReason}
              onChange={(e) => setAdjustReason(e.target.value)}
              placeholder="Reason"
              className="flex-1 rounded-xl border border-slate-300 px-3 py-2 text-base focus:border-slate-500 focus:outline-none"
            />
            <button
              type="button"
              onClick={handleManualAdjust}
              className="rounded-xl bg-slate-900 px-4 py-2 font-bold text-stone-50 active:opacity-80"
            >
              Apply
            </button>
          </div>
          {adjustError && <p className="mt-1 text-sm font-medium text-rose-600">{adjustError}</p>}
        </div>

        <div className="mt-6">
          <h3 className="text-sm font-bold uppercase tracking-wide text-slate-500">
            Last {recentEntries.length} log entries
          </h3>
          <div className="mt-2 divide-y divide-slate-100 rounded-2xl border border-slate-200">
            {recentEntries.length === 0 && (
              <p className="p-4 text-sm text-slate-400">No activity yet.</p>
            )}
            {recentEntries.map((entry) => (
              <div key={entry.id} className="flex items-center justify-between gap-3 px-4 py-3">
                <div>
                  <p className="text-sm font-medium text-slate-800">{entry.label}</p>
                  <p className="text-xs text-slate-400">{formatDateTime(entry.timestamp)}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span
                    className={`text-lg font-bold tabular-nums ${entry.value < 0 ? "text-rose-600" : "text-emerald-600"}`}
                  >
                    {entry.value > 0 ? `+${entry.value}` : entry.value}
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      requestPin(() => setConfirmDeleteEntryId(entry.id), "Enter PIN to delete entry")
                    }
                    className="rounded-lg bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-500 active:bg-slate-200"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <button
          type="button"
          onClick={() => requestPin(() => setConfirmRemoveStudent(true), "Enter PIN to remove student")}
          className="mt-6 w-full rounded-2xl border-2 border-rose-200 bg-rose-50 py-3 font-bold text-rose-600 active:bg-rose-100"
        >
          Remove student
        </button>
      </div>

      {confirmDeleteEntryId && (
        <ConfirmDialog
          title="Delete this log entry?"
          message="This reverses the points it added or removed. This can't be undone."
          confirmLabel="Delete entry"
          onCancel={() => setConfirmDeleteEntryId(null)}
          onConfirm={() => {
            dispatch({ type: "DELETE_ENTRY", entryId: confirmDeleteEntryId });
            setConfirmDeleteEntryId(null);
          }}
        />
      )}

      {confirmRemoveStudent && (
        <ConfirmDialog
          title={`Remove ${student.firstName}?`}
          message="Their card is removed from the classroom screen. Past log entries stay in reports for history."
          confirmLabel="Remove student"
          onCancel={() => setConfirmRemoveStudent(false)}
          onConfirm={() => {
            dispatch({ type: "DELETE_STUDENT", id: student.id });
            setConfirmRemoveStudent(false);
            onClose();
          }}
        />
      )}
    </Modal>
  );
}
