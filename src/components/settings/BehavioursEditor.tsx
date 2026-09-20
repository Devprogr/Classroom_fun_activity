import { useState } from "react";
import { useApp } from "../../state/AppContext";
import type { Behaviour, BehaviourCategory } from "../../types";
import ConfirmDialog from "../common/ConfirmDialog";

const CATEGORY_LABELS: Record<BehaviourCategory, string> = {
  positive: "Positive",
  negative: "Negative",
  leader: "Classroom leader",
};

function BehaviourRow({ behaviour }: { behaviour: Behaviour }) {
  const { dispatch } = useApp();
  const [confirmDelete, setConfirmDelete] = useState(false);

  return (
    <div className="grid grid-cols-1 items-center gap-2 border-b border-slate-100 py-3 last:border-0 sm:grid-cols-[1fr_90px_150px_140px_auto_auto]">
      <input
        id={`behaviour-label-${behaviour.id}`}
        name={`behaviour-label-${behaviour.id}`}
        value={behaviour.label}
        onChange={(e) =>
          dispatch({ type: "UPDATE_BEHAVIOUR", id: behaviour.id, patch: { label: e.target.value } })
        }
        className="rounded-lg border border-slate-300 px-2 py-1.5 text-sm"
      />
      <input
        id={`behaviour-value-${behaviour.id}`}
        name={`behaviour-value-${behaviour.id}`}
        type="number"
        value={behaviour.value}
        onChange={(e) =>
          dispatch({
            type: "UPDATE_BEHAVIOUR",
            id: behaviour.id,
            patch: { value: Number(e.target.value) || 0 },
          })
        }
        className="rounded-lg border border-slate-300 px-2 py-1.5 text-sm"
      />
      <select
        id={`behaviour-category-${behaviour.id}`}
        name={`behaviour-category-${behaviour.id}`}
        value={behaviour.category}
        onChange={(e) =>
          dispatch({
            type: "UPDATE_BEHAVIOUR",
            id: behaviour.id,
            patch: { category: e.target.value as BehaviourCategory },
          })
        }
        className="rounded-lg border border-slate-300 px-2 py-1.5 text-sm"
      >
        {(Object.keys(CATEGORY_LABELS) as BehaviourCategory[]).map((c) => (
          <option key={c} value={c}>
            {CATEGORY_LABELS[c]}
          </option>
        ))}
      </select>
      <input
        id={`behaviour-note-${behaviour.id}`}
        name={`behaviour-note-${behaviour.id}`}
        value={behaviour.note ?? ""}
        placeholder="frequency note"
        onChange={(e) =>
          dispatch({
            type: "UPDATE_BEHAVIOUR",
            id: behaviour.id,
            patch: { note: e.target.value },
          })
        }
        className="rounded-lg border border-slate-300 px-2 py-1.5 text-sm"
      />
      <label
        htmlFor={`behaviour-active-${behaviour.id}`}
        className="flex items-center gap-1.5 text-xs font-medium text-slate-600"
      >
        <input
          id={`behaviour-active-${behaviour.id}`}
          name={`behaviour-active-${behaviour.id}`}
          type="checkbox"
          checked={behaviour.active}
          onChange={(e) =>
            dispatch({
              type: "UPDATE_BEHAVIOUR",
              id: behaviour.id,
              patch: { active: e.target.checked },
            })
          }
        />
        Active
      </label>
      <button
        type="button"
        onClick={() => setConfirmDelete(true)}
        className="rounded-lg bg-rose-50 px-2 py-1.5 text-xs font-semibold text-rose-600 active:bg-rose-100"
      >
        Delete
      </button>
      {confirmDelete && (
        <ConfirmDialog
          title="Delete this behaviour?"
          message="Past log entries that used it keep their own record and stay intact."
          confirmLabel="Delete"
          onCancel={() => setConfirmDelete(false)}
          onConfirm={() => {
            dispatch({ type: "DELETE_BEHAVIOUR", id: behaviour.id });
            setConfirmDelete(false);
          }}
        />
      )}
    </div>
  );
}

export default function BehavioursEditor() {
  const { state, dispatch } = useApp();
  const [newLabel, setNewLabel] = useState("");
  const [newValue, setNewValue] = useState("10");
  const [newCategory, setNewCategory] = useState<BehaviourCategory>("positive");
  const [newNote, setNewNote] = useState("");

  function handleAdd() {
    if (!newLabel.trim()) return;
    dispatch({
      type: "ADD_BEHAVIOUR",
      behaviour: {
        label: newLabel.trim(),
        value: Number(newValue) || 0,
        category: newCategory,
        note: newNote.trim() || undefined,
        active: true,
      },
    });
    setNewLabel("");
    setNewValue("10");
    setNewNote("");
  }

  return (
    <div>
      <div className="hidden text-xs font-semibold uppercase tracking-wide text-slate-400 sm:grid sm:grid-cols-[1fr_90px_150px_140px_auto_auto] sm:gap-2 sm:pb-1">
        <span>Label</span>
        <span>Value</span>
        <span>Category</span>
        <span>Note</span>
        <span />
        <span />
      </div>
      {state.behaviours.map((b) => (
        <BehaviourRow key={b.id} behaviour={b} />
      ))}

      <div className="mt-4 rounded-2xl bg-slate-100 p-4">
        <p className="mb-2 text-sm font-bold text-slate-600">Add a behaviour</p>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-[1fr_90px_150px_140px_auto]">
          <input
            id="new-behaviour-label"
            name="newBehaviourLabel"
            value={newLabel}
            onChange={(e) => setNewLabel(e.target.value)}
            placeholder="Label"
            className="rounded-lg border border-slate-300 px-2 py-1.5 text-sm"
          />
          <input
            id="new-behaviour-value"
            name="newBehaviourValue"
            type="number"
            value={newValue}
            onChange={(e) => setNewValue(e.target.value)}
            className="rounded-lg border border-slate-300 px-2 py-1.5 text-sm"
          />
          <select
            id="new-behaviour-category"
            name="newBehaviourCategory"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value as BehaviourCategory)}
            className="rounded-lg border border-slate-300 px-2 py-1.5 text-sm"
          >
            {(Object.keys(CATEGORY_LABELS) as BehaviourCategory[]).map((c) => (
              <option key={c} value={c}>
                {CATEGORY_LABELS[c]}
              </option>
            ))}
          </select>
          <input
            id="new-behaviour-note"
            name="newBehaviourNote"
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            placeholder="frequency note (optional)"
            className="rounded-lg border border-slate-300 px-2 py-1.5 text-sm"
          />
          <button
            type="button"
            onClick={handleAdd}
            disabled={!newLabel.trim()}
            className="rounded-lg bg-slate-900 px-3 py-1.5 text-sm font-bold text-stone-50 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Add
          </button>
        </div>
      </div>
    </div>
  );
}
