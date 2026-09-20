import { useState } from "react";
import { useApp } from "../../state/AppContext";
import Modal from "../common/Modal";
import type { Reward } from "../../types";

interface RedeemIndividualModalProps {
  reward: Reward;
  onClose: () => void;
}

export default function RedeemIndividualModal({ reward, onClose }: RedeemIndividualModalProps) {
  const { state, dispatch } = useApp();
  const [studentId, setStudentId] = useState<string | null>(null);
  const [error, setError] = useState("");

  const students = [...state.students].sort((a, b) => a.firstName.localeCompare(b.firstName));
  const selected = students.find((s) => s.id === studentId);

  function handleRedeem() {
    if (!selected) {
      setError("Choose a student first");
      return;
    }
    if (selected.points < reward.cost) {
      setError(`${selected.firstName} only has ${selected.points} points`);
      return;
    }
    dispatch({ type: "REDEEM_INDIVIDUAL", rewardId: reward.id, studentId: selected.id });
    onClose();
  }

  return (
    <Modal onClose={onClose}>
      <div className="border-b border-slate-200 px-6 py-4">
        <h2 className="text-lg font-bold">Redeem: {reward.label}</h2>
        <p className="text-sm text-slate-500">Costs {reward.cost} points</p>
      </div>
      <div className="max-h-[50vh] flex-1 overflow-y-auto px-6 py-4">
        <p className="mb-2 text-sm font-semibold text-slate-500">Which student?</p>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {students.map((s) => {
            const affordable = s.points >= reward.cost;
            return (
              <button
                key={s.id}
                type="button"
                onClick={() => {
                  setStudentId(s.id);
                  setError("");
                }}
                className={`flex flex-col items-center rounded-xl border-2 px-3 py-3 text-center ${
                  studentId === s.id
                    ? "border-sky-500 bg-sky-50"
                    : "border-slate-200 bg-white active:bg-slate-50"
                }`}
              >
                <span className="text-2xl">{s.emoji}</span>
                <span className="mt-1 text-sm font-semibold text-slate-800">{s.firstName}</span>
                <span className={`text-sm font-bold ${affordable ? "text-emerald-600" : "text-rose-500"}`}>
                  {s.points} pts
                </span>
              </button>
            );
          })}
        </div>
        {error && <p className="mt-3 text-sm font-semibold text-rose-600">{error}</p>}
      </div>
      <div className="flex gap-3 border-t border-slate-200 px-6 py-4">
        <button
          type="button"
          onClick={onClose}
          className="flex-1 rounded-xl bg-slate-100 py-3 font-semibold text-slate-700 active:bg-slate-200"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={handleRedeem}
          className="flex-1 rounded-xl bg-emerald-600 py-3 font-bold text-stone-50 active:opacity-80"
        >
          Redeem
        </button>
      </div>
    </Modal>
  );
}
