import { useState } from "react";
import { useApp } from "../../state/AppContext";
import type { Reward, RewardScope } from "../../types";
import ConfirmDialog from "../common/ConfirmDialog";

function RewardRow({ reward }: { reward: Reward }) {
  const { dispatch } = useApp();
  const [confirmDelete, setConfirmDelete] = useState(false);

  return (
    <div className="grid grid-cols-1 items-center gap-2 border-b border-slate-100 py-3 last:border-0 sm:grid-cols-[1fr_100px_130px_auto_auto]">
      <input
        id={`reward-label-${reward.id}`}
        name={`reward-label-${reward.id}`}
        value={reward.label}
        onChange={(e) =>
          dispatch({ type: "UPDATE_REWARD", id: reward.id, patch: { label: e.target.value } })
        }
        className="rounded-lg border border-slate-300 px-2 py-1.5 text-sm"
      />
      <input
        id={`reward-cost-${reward.id}`}
        name={`reward-cost-${reward.id}`}
        type="number"
        value={reward.cost}
        onChange={(e) =>
          dispatch({
            type: "UPDATE_REWARD",
            id: reward.id,
            patch: { cost: Math.max(0, Number(e.target.value) || 0) },
          })
        }
        className="rounded-lg border border-slate-300 px-2 py-1.5 text-sm"
      />
      <select
        id={`reward-scope-${reward.id}`}
        name={`reward-scope-${reward.id}`}
        value={reward.scope}
        onChange={(e) =>
          dispatch({
            type: "UPDATE_REWARD",
            id: reward.id,
            patch: { scope: e.target.value as RewardScope },
          })
        }
        className="rounded-lg border border-slate-300 px-2 py-1.5 text-sm"
      >
        <option value="individual">Individual</option>
        <option value="class">Class</option>
      </select>
      <label
        htmlFor={`reward-active-${reward.id}`}
        className="flex items-center gap-1.5 text-xs font-medium text-slate-600"
      >
        <input
          id={`reward-active-${reward.id}`}
          name={`reward-active-${reward.id}`}
          type="checkbox"
          checked={reward.active}
          onChange={(e) =>
            dispatch({ type: "UPDATE_REWARD", id: reward.id, patch: { active: e.target.checked } })
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
          title="Delete this reward?"
          message="Past redemptions stay in the log. This only removes it from the Store."
          confirmLabel="Delete"
          onCancel={() => setConfirmDelete(false)}
          onConfirm={() => {
            dispatch({ type: "DELETE_REWARD", id: reward.id });
            setConfirmDelete(false);
          }}
        />
      )}
    </div>
  );
}

export default function RewardsEditor() {
  const { state, dispatch } = useApp();
  const [newLabel, setNewLabel] = useState("");
  const [newCost, setNewCost] = useState("100");
  const [newScope, setNewScope] = useState<RewardScope>("individual");

  function handleAdd() {
    if (!newLabel.trim()) return;
    dispatch({
      type: "ADD_REWARD",
      reward: {
        label: newLabel.trim(),
        cost: Math.max(0, Number(newCost) || 0),
        scope: newScope,
        active: true,
      },
    });
    setNewLabel("");
    setNewCost("100");
  }

  return (
    <div>
      <div className="hidden text-xs font-semibold uppercase tracking-wide text-slate-400 sm:grid sm:grid-cols-[1fr_100px_130px_auto_auto] sm:gap-2 sm:pb-1">
        <span>Label</span>
        <span>Cost</span>
        <span>Scope</span>
        <span />
        <span />
      </div>
      {state.rewards.map((r) => (
        <RewardRow key={r.id} reward={r} />
      ))}

      <div className="mt-4 rounded-2xl bg-slate-100 p-4">
        <p className="mb-2 text-sm font-bold text-slate-600">Add a reward</p>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-[1fr_100px_130px_auto]">
          <input
            id="new-reward-label"
            name="newRewardLabel"
            value={newLabel}
            onChange={(e) => setNewLabel(e.target.value)}
            placeholder="Label"
            className="rounded-lg border border-slate-300 px-2 py-1.5 text-sm"
          />
          <input
            id="new-reward-cost"
            name="newRewardCost"
            type="number"
            value={newCost}
            onChange={(e) => setNewCost(e.target.value)}
            className="rounded-lg border border-slate-300 px-2 py-1.5 text-sm"
          />
          <select
            id="new-reward-scope"
            name="newRewardScope"
            value={newScope}
            onChange={(e) => setNewScope(e.target.value as RewardScope)}
            className="rounded-lg border border-slate-300 px-2 py-1.5 text-sm"
          >
            <option value="individual">Individual</option>
            <option value="class">Class</option>
          </select>
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
