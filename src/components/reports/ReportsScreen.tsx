import { useMemo, useState } from "react";
import { useApp } from "../../state/AppContext";
import { filterLog, monthlyTotal, weeklyTotal } from "../../lib/reports";
import { formatDateTime, toDateInputValue } from "../../lib/date";
import { downloadCsv, rowsToCsv } from "../../lib/csv";

export default function ReportsScreen() {
  const { state, getStudent } = useApp();
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [studentFilter, setStudentFilter] = useState("");

  const totalsRows = useMemo(
    () =>
      [...state.students]
        .sort((a, b) => a.firstName.localeCompare(b.firstName))
        .map((s) => ({
          student: s,
          week: weeklyTotal(state.log, s.id),
          month: monthlyTotal(state.log, s.id),
          allTime: s.points,
        })),
    [state.students, state.log],
  );

  const filteredLog = useMemo(() => {
    const from = fromDate ? new Date(`${fromDate}T00:00:00`).getTime() : undefined;
    const to = toDate ? new Date(`${toDate}T23:59:59`).getTime() : undefined;
    return filterLog(state.log, { from, to, studentId: studentFilter || undefined }).sort(
      (a, b) => b.timestamp - a.timestamp,
    );
  }, [state.log, fromDate, toDate, studentFilter]);

  function studentNames(ids: string[]): string {
    if (ids.length === 0) return "Whole class";
    return ids.map((id) => getStudent(id)?.firstName ?? "(removed)").join("; ");
  }

  function exportLogCsv() {
    const rows = filteredLog.map((e) => [
      formatDateTime(e.timestamp),
      e.type,
      e.label,
      e.value,
      studentNames(e.studentIds),
    ]);
    const csv = rowsToCsv(["Date", "Type", "Label", "Value", "Students"], rows);
    downloadCsv(`class-points-log-${toDateInputValue(Date.now())}.csv`, csv);
  }

  function exportTotalsCsv() {
    const rows = totalsRows.map((r) => [r.student.firstName, r.allTime]);
    const csv = rowsToCsv(["Student", "Total points"], rows);
    downloadCsv(`class-points-totals-${toDateInputValue(Date.now())}.csv`, csv);
  }

  return (
    <div className="p-4 md:p-6">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold text-stone-100">Reports</h1>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={exportTotalsCsv}
            className="rounded-xl bg-slate-800 px-4 py-2 text-sm font-semibold text-stone-100 active:bg-slate-700"
          >
            Export totals CSV
          </button>
          <button
            type="button"
            onClick={exportLogCsv}
            className="rounded-xl bg-slate-800 px-4 py-2 text-sm font-semibold text-stone-100 active:bg-slate-700"
          >
            Export log CSV
          </button>
        </div>
      </div>

      <section className="mb-8 overflow-x-auto rounded-2xl bg-stone-50 shadow-sm">
        <table className="w-full min-w-[480px] text-left">
          <thead>
            <tr className="border-b border-slate-200 text-sm font-semibold uppercase tracking-wide text-slate-500">
              <th className="px-4 py-3">Student</th>
              <th className="px-4 py-3 text-right">This week</th>
              <th className="px-4 py-3 text-right">This month</th>
              <th className="px-4 py-3 text-right">All time</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {totalsRows.map(({ student, week, month, allTime }) => (
              <tr key={student.id}>
                <td className="px-4 py-3 font-medium text-slate-800">
                  {student.emoji} {student.firstName}
                </td>
                <td className={`px-4 py-3 text-right tabular-nums ${week < 0 ? "text-rose-600" : "text-slate-700"}`}>
                  {week}
                </td>
                <td className={`px-4 py-3 text-right tabular-nums ${month < 0 ? "text-rose-600" : "text-slate-700"}`}>
                  {month}
                </td>
                <td className={`px-4 py-3 text-right font-bold tabular-nums ${allTime < 0 ? "text-rose-600" : "text-slate-900"}`}>
                  {allTime}
                </td>
              </tr>
            ))}
            {totalsRows.length === 0 && (
              <tr>
                <td colSpan={4} className="px-4 py-6 text-center text-slate-400">
                  No students yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </section>

      <section>
        <div className="mb-3 flex flex-wrap items-end gap-3">
          <h2 className="text-lg font-bold text-stone-100">Activity log</h2>
          <div className="ml-auto flex flex-wrap items-end gap-2">
            <label className="text-xs font-semibold text-slate-400">
              From
              <input
                type="date"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                className="mt-1 block rounded-lg border border-slate-700 bg-slate-900 px-2 py-1.5 text-sm text-stone-100"
              />
            </label>
            <label className="text-xs font-semibold text-slate-400">
              To
              <input
                type="date"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
                className="mt-1 block rounded-lg border border-slate-700 bg-slate-900 px-2 py-1.5 text-sm text-stone-100"
              />
            </label>
            <label className="text-xs font-semibold text-slate-400">
              Student
              <select
                value={studentFilter}
                onChange={(e) => setStudentFilter(e.target.value)}
                className="mt-1 block rounded-lg border border-slate-700 bg-slate-900 px-2 py-1.5 text-sm text-stone-100"
              >
                <option value="">All students</option>
                {[...state.students]
                  .sort((a, b) => a.firstName.localeCompare(b.firstName))
                  .map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.firstName}
                    </option>
                  ))}
              </select>
            </label>
          </div>
        </div>
        <div className="overflow-x-auto rounded-2xl bg-stone-50 shadow-sm">
          <table className="w-full min-w-[600px] text-left">
            <thead>
              <tr className="border-b border-slate-200 text-sm font-semibold uppercase tracking-wide text-slate-500">
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Type</th>
                <th className="px-4 py-3">Label</th>
                <th className="px-4 py-3">Students</th>
                <th className="px-4 py-3 text-right">Value</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredLog.map((entry) => (
                <tr key={entry.id}>
                  <td className="px-4 py-3 text-sm text-slate-500">{formatDateTime(entry.timestamp)}</td>
                  <td className="px-4 py-3 text-sm capitalize text-slate-500">{entry.type}</td>
                  <td className="px-4 py-3 text-sm font-medium text-slate-800">{entry.label}</td>
                  <td className="px-4 py-3 text-sm text-slate-600">{studentNames(entry.studentIds)}</td>
                  <td className={`px-4 py-3 text-right text-sm font-bold tabular-nums ${entry.value < 0 ? "text-rose-600" : "text-emerald-600"}`}>
                    {entry.value > 0 ? `+${entry.value}` : entry.value}
                  </td>
                </tr>
              ))}
              {filteredLog.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-6 text-center text-slate-400">
                    No log entries match this filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
