import { useState } from "react";
import { useApp } from "../../state/AppContext";
import type { Reward } from "../../types";
import ProgressBar from "./ProgressBar";
import RedeemIndividualModal from "./RedeemIndividualModal";
import ConfirmDialog from "../common/ConfirmDialog";
import { formatDate } from "../../lib/date";

export default function StoreScreen() {
  const { state, dispatch, classTotal } = useApp();
  const [redeemIndividual, setRedeemIndividual] = useState<Reward | null>(null);
  const [confirmClassReward, setConfirmClassReward] = useState<Reward | null>(null);
  const [classError, setClassError] = useState("");

  const individualRewards = state.rewards.filter((r) => r.scope === "individual" && r.active);
  const classRewards = state.rewards.filter((r) => r.scope === "class" && r.active);

  function lastRedeemedOn(rewardId: string): number | null {
    const entries = state.log.filter(
      (e) => e.rewardId === rewardId && e.classLevel && e.type === "redeem",
    );
    if (entries.length === 0) return null;
    return entries.reduce((max, e) => Math.max(max, e.timestamp), 0);
  }

  function handleRedeemClass(reward: Reward) {
    if (classTotal < reward.cost) {
      setClassError(`The class needs ${reward.cost - classTotal} more points.`);
      return;
    }
    setClassError("");
    setConfirmClassReward(reward);
  }

  return (
    <div className="p-4 md:p-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-stone-100">Store</h1>
        <p className="text-lg font-bold text-emerald-400">Class total: {classTotal}</p>
      </div>

      <section className="mb-8">
        <h2 className="mb-3 text-lg font-bold text-stone-100">Individual rewards</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {individualRewards.map((reward) => (
            <div key={reward.id} className="rounded-2xl bg-stone-50 p-4 shadow-sm">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-base font-bold text-slate-900">{reward.label}</p>
                  <p className="text-sm text-slate-500">{reward.cost} points</p>
                </div>
              </div>
              <div className="mt-3">
                <ProgressBar current={classTotal} target={reward.cost} />
              </div>
              <button
                type="button"
                onClick={() => setRedeemIndividual(reward)}
                className="mt-3 w-full rounded-xl bg-slate-900 py-3 font-bold text-stone-50 active:opacity-80"
              >
                Redeem for a student
              </button>
            </div>
          ))}
          {individualRewards.length === 0 && (
            <p className="text-slate-400">No individual rewards yet. Add some in Settings.</p>
          )}
        </div>
      </section>

      <section>
        <h2 className="mb-1 text-lg font-bold text-stone-100">Class rewards</h2>
        <p className="mb-3 text-sm text-slate-400">
          Redeeming a class reward does not subtract points from anyone — it just checks the class
          total and logs that the class earned it.
        </p>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {classRewards.map((reward) => {
            const redeemedOn = lastRedeemedOn(reward.id);
            const affordable = classTotal >= reward.cost;
            return (
              <div key={reward.id} className="rounded-2xl bg-stone-50 p-4 shadow-sm">
                <p className="text-base font-bold text-slate-900">{reward.label}</p>
                <p className="text-sm text-slate-500">{reward.cost} points</p>
                <div className="mt-3">
                  <ProgressBar current={classTotal} target={reward.cost} />
                </div>
                {redeemedOn && (
                  <p className="mt-2 text-xs font-semibold text-emerald-600">
                    Redeemed on {formatDate(redeemedOn)}
                  </p>
                )}
                <button
                  type="button"
                  disabled={!affordable}
                  onClick={() => handleRedeemClass(reward)}
                  className="mt-3 w-full rounded-xl bg-slate-900 py-3 font-bold text-stone-50 active:opacity-80 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Redeem for the class
                </button>
              </div>
            );
          })}
          {classRewards.length === 0 && (
            <p className="text-slate-400">No class rewards yet. Add some in Settings.</p>
          )}
        </div>
        {classError && <p className="mt-3 text-sm font-semibold text-rose-400">{classError}</p>}
      </section>

      {redeemIndividual && (
        <RedeemIndividualModal reward={redeemIndividual} onClose={() => setRedeemIndividual(null)} />
      )}

      {confirmClassReward && (
        <ConfirmDialog
          title={`Redeem "${confirmClassReward.label}" for the class?`}
          message="This checks the class total, logs the redemption with today's date, and does not subtract points from any student."
          confirmLabel="Redeem"
          danger={false}
          onCancel={() => setConfirmClassReward(null)}
          onConfirm={() => {
            dispatch({ type: "REDEEM_CLASS", rewardId: confirmClassReward.id });
            setConfirmClassReward(null);
          }}
        />
      )}
    </div>
  );
}
