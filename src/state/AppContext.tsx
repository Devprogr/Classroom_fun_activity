import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
} from "react";
import type { Dispatch, ReactNode } from "react";
import type {
  AppState,
  Behaviour,
  Entry,
  Reward,
  Student,
} from "../types";
import { loadState, saveState } from "../lib/storage";
import { makeId } from "../lib/id";
import { colourForIndex, emojiForIndex } from "../lib/avatars";

type Action =
  | {
      type: "COMPLETE_SETUP";
      className: string;
      firstNames: string[];
      pin: string;
    }
  | { type: "SET_CLASS_NAME"; name: string }
  | { type: "ADD_STUDENTS"; firstNames: string[] }
  | { type: "UPDATE_STUDENT"; id: string; patch: Partial<Omit<Student, "id">> }
  | { type: "DELETE_STUDENT"; id: string }
  | { type: "AWARD"; entryId: string; behaviourId: string; studentIds: string[] }
  | { type: "MANUAL_ADJUST"; studentId: string; value: number; reason: string }
  | { type: "REDEEM_INDIVIDUAL"; rewardId: string; studentId: string }
  | { type: "REDEEM_CLASS"; rewardId: string }
  | { type: "DELETE_ENTRY"; entryId: string }
  | { type: "ADD_BEHAVIOUR"; behaviour: Omit<Behaviour, "id"> }
  | { type: "UPDATE_BEHAVIOUR"; id: string; patch: Partial<Omit<Behaviour, "id">> }
  | { type: "DELETE_BEHAVIOUR"; id: string }
  | { type: "ADD_REWARD"; reward: Omit<Reward, "id"> }
  | { type: "UPDATE_REWARD"; id: string; patch: Partial<Omit<Reward, "id">> }
  | { type: "DELETE_REWARD"; id: string }
  | { type: "SET_PIN"; pin: string }
  | { type: "RESET_POINTS" }
  | { type: "IMPORT_STATE"; state: AppState };

function studentsFromNames(names: string[], startIndex: number): Student[] {
  return names.map((firstName, i) => ({
    id: makeId(),
    firstName,
    emoji: emojiForIndex(startIndex + i),
    colour: colourForIndex(startIndex + i),
    points: 0,
  }));
}

function applyEntry(students: Student[], entry: Entry): Student[] {
  if (entry.classLevel) return students;
  const affected = new Set(entry.studentIds);
  return students.map((s) =>
    affected.has(s.id) ? { ...s, points: s.points + entry.value } : s,
  );
}

function reverseEntry(students: Student[], entry: Entry): Student[] {
  if (entry.classLevel) return students;
  const affected = new Set(entry.studentIds);
  return students.map((s) =>
    affected.has(s.id) ? { ...s, points: s.points - entry.value } : s,
  );
}

function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case "COMPLETE_SETUP": {
      return {
        ...state,
        setupComplete: true,
        pin: action.pin,
        classInfo: { name: action.className, createdAt: Date.now() },
        students: studentsFromNames(action.firstNames, 0),
      };
    }
    case "SET_CLASS_NAME":
      return { ...state, classInfo: { ...state.classInfo, name: action.name } };
    case "ADD_STUDENTS": {
      const newStudents = studentsFromNames(action.firstNames, state.students.length);
      return { ...state, students: [...state.students, ...newStudents] };
    }
    case "UPDATE_STUDENT":
      return {
        ...state,
        students: state.students.map((s) =>
          s.id === action.id ? { ...s, ...action.patch } : s,
        ),
      };
    case "DELETE_STUDENT":
      return {
        ...state,
        students: state.students.filter((s) => s.id !== action.id),
      };
    case "AWARD": {
      const behaviour = state.behaviours.find((b) => b.id === action.behaviourId);
      if (!behaviour || action.studentIds.length === 0) return state;
      const entry: Entry = {
        id: action.entryId,
        timestamp: Date.now(),
        studentIds: action.studentIds,
        behaviourId: behaviour.id,
        label: behaviour.label,
        value: behaviour.value,
        type: "award",
      };
      return {
        ...state,
        students: applyEntry(state.students, entry),
        log: [entry, ...state.log],
      };
    }
    case "MANUAL_ADJUST": {
      if (!Number.isFinite(action.value) || action.value === 0) return state;
      const entry: Entry = {
        id: makeId(),
        timestamp: Date.now(),
        studentIds: [action.studentId],
        label: action.reason || "Manual adjustment",
        value: action.value,
        type: "manual",
      };
      return {
        ...state,
        students: applyEntry(state.students, entry),
        log: [entry, ...state.log],
      };
    }
    case "REDEEM_INDIVIDUAL": {
      const reward = state.rewards.find((r) => r.id === action.rewardId);
      const student = state.students.find((s) => s.id === action.studentId);
      if (!reward || !student || reward.scope !== "individual") return state;
      if (student.points < reward.cost) return state;
      const entry: Entry = {
        id: makeId(),
        timestamp: Date.now(),
        studentIds: [student.id],
        rewardId: reward.id,
        label: reward.label,
        value: -reward.cost,
        type: "redeem",
      };
      return {
        ...state,
        students: applyEntry(state.students, entry),
        log: [entry, ...state.log],
      };
    }
    case "REDEEM_CLASS": {
      const reward = state.rewards.find((r) => r.id === action.rewardId);
      if (!reward || reward.scope !== "class") return state;
      const classTotal = state.students.reduce((sum, s) => sum + s.points, 0);
      if (classTotal < reward.cost) return state;
      const entry: Entry = {
        id: makeId(),
        timestamp: Date.now(),
        studentIds: [],
        rewardId: reward.id,
        label: reward.label,
        value: -reward.cost,
        type: "redeem",
        classLevel: true,
      };
      return { ...state, log: [entry, ...state.log] };
    }
    case "DELETE_ENTRY": {
      const entry = state.log.find((e) => e.id === action.entryId);
      if (!entry) return state;
      return {
        ...state,
        students: reverseEntry(state.students, entry),
        log: state.log.filter((e) => e.id !== action.entryId),
      };
    }
    case "ADD_BEHAVIOUR":
      return {
        ...state,
        behaviours: [...state.behaviours, { ...action.behaviour, id: makeId() }],
      };
    case "UPDATE_BEHAVIOUR":
      return {
        ...state,
        behaviours: state.behaviours.map((b) =>
          b.id === action.id ? { ...b, ...action.patch } : b,
        ),
      };
    case "DELETE_BEHAVIOUR":
      return {
        ...state,
        behaviours: state.behaviours.filter((b) => b.id !== action.id),
      };
    case "ADD_REWARD":
      return {
        ...state,
        rewards: [...state.rewards, { ...action.reward, id: makeId() }],
      };
    case "UPDATE_REWARD":
      return {
        ...state,
        rewards: state.rewards.map((r) =>
          r.id === action.id ? { ...r, ...action.patch } : r,
        ),
      };
    case "DELETE_REWARD":
      return {
        ...state,
        rewards: state.rewards.filter((r) => r.id !== action.id),
      };
    case "SET_PIN":
      return { ...state, pin: action.pin };
    case "RESET_POINTS": {
      const resetEntries: Entry[] = state.students
        .filter((s) => s.points !== 0)
        .map((s) => ({
          id: makeId(),
          timestamp: Date.now(),
          studentIds: [s.id],
          label: "Points reset",
          value: -s.points,
          type: "manual",
        }));
      return {
        ...state,
        students: state.students.map((s) => ({ ...s, points: 0 })),
        log: [...resetEntries, ...state.log],
      };
    }
    case "IMPORT_STATE":
      return action.state;
    default:
      return state;
  }
}

interface AppContextValue {
  state: AppState;
  dispatch: Dispatch<Action>;
  classTotal: number;
  getStudent: (id: string) => Student | undefined;
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, undefined, loadState);

  useEffect(() => {
    saveState(state);
  }, [state]);

  const classTotal = useMemo(
    () => state.students.reduce((sum, s) => sum + s.points, 0),
    [state.students],
  );

  const getStudent = useCallback(
    (id: string) => state.students.find((s) => s.id === id),
    [state.students],
  );

  const value = useMemo(
    () => ({ state, dispatch, classTotal, getStudent }),
    [state, classTotal, getStudent],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp(): AppContextValue {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
