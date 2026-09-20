import type { Entry } from "../types";
import { startOfMonth, startOfWeek } from "./date";

export function entryValueForStudent(entry: Entry, studentId: string): number {
  if (entry.classLevel) return 0;
  return entry.studentIds.includes(studentId) ? entry.value : 0;
}

export function sumForStudent(log: Entry[], studentId: string, since?: number): number {
  return log.reduce((sum, e) => {
    if (since !== undefined && e.timestamp < since) return sum;
    return sum + entryValueForStudent(e, studentId);
  }, 0);
}

export function weeklyTotal(log: Entry[], studentId: string, now = new Date()): number {
  return sumForStudent(log, studentId, startOfWeek(now).getTime());
}

export function monthlyTotal(log: Entry[], studentId: string, now = new Date()): number {
  return sumForStudent(log, studentId, startOfMonth(now).getTime());
}

export function entriesForStudent(log: Entry[], studentId: string): Entry[] {
  return log.filter((e) => !e.classLevel && e.studentIds.includes(studentId));
}

export interface LogFilter {
  from?: number;
  to?: number;
  studentId?: string;
}

export function filterLog(log: Entry[], filter: LogFilter): Entry[] {
  return log.filter((e) => {
    if (filter.from !== undefined && e.timestamp < filter.from) return false;
    if (filter.to !== undefined && e.timestamp > filter.to) return false;
    if (filter.studentId && (e.classLevel || !e.studentIds.includes(filter.studentId))) {
      return false;
    }
    return true;
  });
}
