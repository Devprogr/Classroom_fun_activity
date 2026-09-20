import { useState } from "react";
import { useApp } from "../../state/AppContext";
import StudentBulkAddForm from "../setup/StudentBulkAddForm";
import ConfirmDialog from "../common/ConfirmDialog";

export default function ClassAndStudentsSection() {
  const { state, dispatch } = useApp();
  const [name, setName] = useState(state.classInfo.name);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  function commitName() {
    const trimmed = name.trim();
    if (trimmed && trimmed !== state.classInfo.name) {
      dispatch({ type: "SET_CLASS_NAME", name: trimmed });
    }
  }

  const sortedStudents = [...state.students].sort((a, b) => a.firstName.localeCompare(b.firstName));
  const studentToDelete = sortedStudents.find((s) => s.id === confirmDeleteId);

  return (
    <div>
      <label className="block text-sm font-semibold text-slate-600">Class name</label>
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        onBlur={commitName}
        className="mt-1 w-full max-w-sm rounded-xl border border-slate-300 px-3 py-2 text-base focus:border-slate-500 focus:outline-none"
      />

      <div className="mt-6">
        <p className="mb-2 text-sm font-semibold text-slate-600">
          Current students ({sortedStudents.length})
        </p>
        <div className="flex flex-wrap gap-2">
          {sortedStudents.map((s) => (
            <span
              key={s.id}
              className="flex items-center gap-2 rounded-full bg-slate-100 py-1.5 pl-3 pr-2 text-sm"
            >
              {s.emoji} {s.firstName}
              <button
                type="button"
                onClick={() => setConfirmDeleteId(s.id)}
                className="flex h-5 w-5 items-center justify-center rounded-full bg-slate-300 text-xs text-slate-700"
              >
                ×
              </button>
            </span>
          ))}
          {sortedStudents.length === 0 && (
            <p className="text-sm text-slate-400">No students yet — add some below.</p>
          )}
        </div>
        <p className="mt-2 text-xs text-slate-400">
          To rename a student or change their emoji/colour, use the ⓘ info icon on their card on the
          Classroom screen.
        </p>
      </div>

      <div className="mt-6">
        <p className="mb-2 text-sm font-semibold text-slate-600">Add more students</p>
        <StudentBulkAddForm
          onAdd={(names) => dispatch({ type: "ADD_STUDENTS", firstNames: names })}
        />
      </div>

      {studentToDelete && (
        <ConfirmDialog
          title={`Remove ${studentToDelete.firstName}?`}
          message="Their card is removed from the classroom screen. Past log entries stay in reports for history."
          confirmLabel="Remove student"
          onCancel={() => setConfirmDeleteId(null)}
          onConfirm={() => {
            dispatch({ type: "DELETE_STUDENT", id: studentToDelete.id });
            setConfirmDeleteId(null);
          }}
        />
      )}
    </div>
  );
}
