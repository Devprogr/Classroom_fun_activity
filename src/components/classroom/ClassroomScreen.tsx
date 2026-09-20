import { useMemo, useState } from "react";
import { useApp } from "../../state/AppContext";
import { useToast } from "../../state/ToastContext";
import { makeId } from "../../lib/id";
import { playPointsSound } from "../../lib/sound";
import type { Behaviour, Student } from "../../types";
import StudentCard from "./StudentCard";
import ClassTotalCard from "./ClassTotalCard";
import BehaviourPanel from "./BehaviourPanel";
import StudentDetailModal from "../studentDetail/StudentDetailModal";

type SortMode = "name" | "points-desc" | "points-asc" | "random";

const SORT_OPTIONS: { value: SortMode; label: string }[] = [
  { value: "name", label: "First name" },
  { value: "points-desc", label: "Points: high to low" },
  { value: "points-asc", label: "Points: low to high" },
  { value: "random", label: "Random" },
];

function shuffle<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export default function ClassroomScreen() {
  const { state, dispatch, classTotal } = useApp();
  const { showToast } = useToast();
  const [sortMode, setSortMode] = useState<SortMode>("name");
  const [randomTick, setRandomTick] = useState(0);
  const [selectMode, setSelectMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [panelTargetIds, setPanelTargetIds] = useState<string[] | null>(null);
  const [detailStudentId, setDetailStudentId] = useState<string | null>(null);

  const sortedStudents = useMemo(() => {
    const students = state.students;
    switch (sortMode) {
      case "name":
        return [...students].sort((a, b) => a.firstName.localeCompare(b.firstName));
      case "points-desc":
        return [...students].sort((a, b) => b.points - a.points);
      case "points-asc":
        return [...students].sort((a, b) => a.points - b.points);
      case "random":
        return shuffle(students);
      default:
        return students;
    }
    // randomTick is intentionally in the deps so the Shuffle button forces a re-shuffle
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.students, sortMode, randomTick]);

  function handleCardTap(student: Student) {
    if (selectMode) {
      setSelectedIds((prev) =>
        prev.includes(student.id) ? prev.filter((id) => id !== student.id) : [...prev, student.id],
      );
      return;
    }
    setPanelTargetIds([student.id]);
  }

  function handleAward(behaviour: Behaviour) {
    const targetIds = panelTargetIds ?? [];
    const targetStudents = state.students.filter((s) => targetIds.includes(s.id));
    if (targetStudents.length === 0) return;
    const entryId = makeId();
    dispatch({ type: "AWARD", entryId, behaviourId: behaviour.id, studentIds: targetIds });
    playPointsSound(behaviour.value);
    setPanelTargetIds(null);
    setSelectMode(false);
    setSelectedIds([]);

    const names =
      targetStudents.length === 1
        ? targetStudents[0].firstName
        : `${targetStudents.length} students`;
    const sign = behaviour.value > 0 ? "+" : "";
    const message = `${sign}${behaviour.value} ${behaviour.label} to ${names}`;
    showToast(message, () => {
      dispatch({ type: "DELETE_ENTRY", entryId });
    });
  }

  const panelStudents = panelTargetIds
    ? state.students.filter((s) => panelTargetIds.includes(s.id))
    : [];

  const activeBehaviours = state.behaviours.filter((b) => b.active);

  return (
    <div className="p-4 md:p-6">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold text-stone-100">{state.classInfo.name}</h1>
        <div className="flex flex-wrap items-center gap-2">
          <select
            id="classroom-sort-mode"
            name="sortMode"
            value={sortMode}
            onChange={(e) => setSortMode(e.target.value as SortMode)}
            className="rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-sm font-medium text-stone-100"
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          {sortMode === "random" && (
            <button
              type="button"
              onClick={() => setRandomTick((t) => t + 1)}
              className="rounded-xl bg-slate-800 px-3 py-2 text-sm font-medium text-stone-100 active:bg-slate-700"
            >
              🔀 Shuffle
            </button>
          )}
          <button
            type="button"
            onClick={() => {
              setSelectMode((v) => !v);
              setSelectedIds([]);
            }}
            className={`rounded-xl px-3 py-2 text-sm font-semibold ${
              selectMode ? "bg-sky-600 text-white" : "bg-slate-800 text-stone-100"
            }`}
          >
            {selectMode ? "Selecting multiple ✓" : "Select multiple"}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
        <ClassTotalCard className={state.classInfo.name} total={classTotal} />
        {sortedStudents.map((student) => (
          <StudentCard
            key={student.id}
            student={student}
            selected={selectedIds.includes(student.id)}
            selectMode={selectMode}
            onTap={() => handleCardTap(student)}
            onInfo={() => setDetailStudentId(student.id)}
          />
        ))}
        {state.students.length === 0 && (
          <p className="col-span-full py-16 text-center text-slate-400">
            No students yet. Add them from Settings.
          </p>
        )}
      </div>

      {selectMode && selectedIds.length > 0 && (
        <div className="fixed bottom-24 left-1/2 z-40 flex -translate-x-1/2 items-center gap-3 rounded-full bg-stone-50 px-5 py-3 shadow-2xl">
          <span className="text-sm font-semibold text-slate-700">
            {selectedIds.length} selected
          </span>
          <button
            type="button"
            onClick={() => setSelectedIds([])}
            className="rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-600 active:bg-slate-200"
          >
            Clear
          </button>
          <button
            type="button"
            onClick={() => setPanelTargetIds(selectedIds)}
            className="rounded-full bg-slate-900 px-5 py-2 text-sm font-bold text-stone-50 active:opacity-80"
          >
            Award behaviour
          </button>
        </div>
      )}

      {panelTargetIds && (
        <BehaviourPanel
          students={panelStudents}
          behaviours={activeBehaviours}
          onAward={handleAward}
          onClose={() => setPanelTargetIds(null)}
        />
      )}

      {detailStudentId && (
        <StudentDetailModal studentId={detailStudentId} onClose={() => setDetailStudentId(null)} />
      )}
    </div>
  );
}
