import { useRef, useState } from "react";
import type { ChangeEvent } from "react";
import { useApp } from "../../state/AppContext";
import { downloadJson } from "../../lib/csv";
import { toDateInputValue } from "../../lib/date";
import ConfirmDialog from "../common/ConfirmDialog";
import type { AppState } from "../../types";

function isValidBackup(value: unknown): value is AppState {
  if (!value || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;
  return (
    Array.isArray(v.students) &&
    Array.isArray(v.behaviours) &&
    Array.isArray(v.rewards) &&
    Array.isArray(v.log) &&
    typeof v.classInfo === "object" &&
    v.classInfo !== null
  );
}

export default function BackupSection() {
  const { state, dispatch } = useApp();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [pendingImport, setPendingImport] = useState<AppState | null>(null);
  const [importError, setImportError] = useState("");

  function handleExport() {
    downloadJson(`class-points-backup-${toDateInputValue(Date.now())}.json`, state);
  }

  function handleFileChosen(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setImportError("");
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(String(reader.result));
        if (!isValidBackup(parsed)) {
          setImportError("That file doesn't look like a Class Points backup.");
          return;
        }
        setPendingImport(parsed);
      } catch {
        setImportError("Couldn't read that file as JSON.");
      }
    };
    reader.readAsText(file);
  }

  return (
    <div>
      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={handleExport}
          className="rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-bold text-stone-50 active:opacity-80"
        >
          Export backup (.json)
        </button>
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="rounded-xl bg-slate-100 px-4 py-2.5 text-sm font-bold text-slate-700 active:bg-slate-200"
        >
          Import backup
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="application/json"
          className="hidden"
          onChange={handleFileChosen}
        />
      </div>
      {importError && <p className="mt-2 text-sm font-semibold text-rose-600">{importError}</p>}

      {pendingImport && (
        <ConfirmDialog
          title="Overwrite current data?"
          message="Importing this backup replaces the class, students, behaviours, rewards, and log currently in this browser. This can't be undone unless you have another backup."
          confirmLabel="Import and overwrite"
          onCancel={() => setPendingImport(null)}
          onConfirm={() => {
            dispatch({ type: "IMPORT_STATE", state: pendingImport });
            setPendingImport(null);
          }}
        />
      )}
    </div>
  );
}
