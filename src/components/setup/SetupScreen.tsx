import { useState } from "react";
import { useApp } from "../../state/AppContext";
import StudentBulkAddForm from "./StudentBulkAddForm";

type Step = "class" | "students" | "pin";

export default function SetupScreen() {
  const { dispatch } = useApp();
  const [step, setStep] = useState<Step>("class");
  const [className, setClassName] = useState("");
  const [names, setNames] = useState<string[]>([]);
  const [pin, setPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");
  const [pinError, setPinError] = useState("");

  function handleFinish() {
    if (pin.length !== 4 || !/^\d{4}$/.test(pin)) {
      setPinError("PIN must be exactly 4 digits");
      return;
    }
    if (pin !== confirmPin) {
      setPinError("PINs don't match");
      return;
    }
    dispatch({ type: "COMPLETE_SETUP", className: className.trim(), firstNames: names, pin });
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 p-4">
      <div className="w-full max-w-xl rounded-3xl bg-stone-50 p-8 text-slate-900 shadow-2xl">
        <p className="text-sm font-semibold uppercase tracking-widest text-slate-400">
          Class Points setup
        </p>
        <div className="mt-1 flex gap-1.5">
          {(["class", "students", "pin"] as Step[]).map((s) => (
            <div
              key={s}
              className={`h-1.5 flex-1 rounded-full ${
                s === step || (step === "students" && s === "class") || (step === "pin" && s !== "pin")
                  ? "bg-slate-900"
                  : "bg-slate-200"
              }`}
            />
          ))}
        </div>

        {step === "class" && (
          <div className="mt-6">
            <h1 className="text-2xl font-bold">What's your class called?</h1>
            <p className="mt-1 text-sm text-slate-500">Shown at the top of the classroom screen.</p>
            <input
              id="setup-class-name"
              name="className"
              autoFocus
              value={className}
              onChange={(e) => setClassName(e.target.value)}
              placeholder="e.g. Room 12, Grade 5"
              className="mt-5 w-full rounded-2xl border border-slate-300 px-4 py-4 text-lg focus:border-slate-500 focus:outline-none"
            />
            <button
              type="button"
              disabled={className.trim().length === 0}
              onClick={() => setStep("students")}
              className="mt-6 w-full rounded-2xl bg-slate-900 py-4 text-lg font-bold text-stone-50 active:opacity-80 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Continue
            </button>
          </div>
        )}

        {step === "students" && (
          <div className="mt-6">
            <h1 className="text-2xl font-bold">Add your students</h1>
            <p className="mt-1 text-sm text-slate-500">
              Paste one first name per line, then press Add. You can paste a whole class list at
              once.
            </p>
            <div className="mt-5">
              <StudentBulkAddForm onAdd={(added) => setNames((prev) => [...prev, ...added])} />
            </div>
            {names.length > 0 && (
              <div className="mt-4">
                <p className="text-sm font-semibold text-slate-500">
                  {names.length} student{names.length === 1 ? "" : "s"} ready
                </p>
                <div className="mt-2 flex max-h-40 flex-wrap gap-2 overflow-y-auto">
                  {names.map((n, i) => (
                    <span
                      key={`${n}-${i}`}
                      className="flex items-center gap-1 rounded-full bg-slate-200 px-3 py-1 text-sm"
                    >
                      {n}
                      <button
                        type="button"
                        onClick={() => setNames((prev) => prev.filter((_, idx) => idx !== i))}
                        className="text-slate-500"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            )}
            <div className="mt-6 flex gap-3">
              <button
                type="button"
                onClick={() => setStep("class")}
                className="rounded-2xl bg-slate-100 px-5 py-4 text-base font-semibold text-slate-600 active:bg-slate-200"
              >
                Back
              </button>
              <button
                type="button"
                disabled={names.length === 0}
                onClick={() => setStep("pin")}
                className="flex-1 rounded-2xl bg-slate-900 py-4 text-lg font-bold text-stone-50 active:opacity-80 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Continue
              </button>
            </div>
          </div>
        )}

        {step === "pin" && (
          <div className="mt-6">
            <h1 className="text-2xl font-bold">Set a 4-digit PIN</h1>
            <p className="mt-1 text-sm text-slate-500">
              This only keeps students from tapping into Settings or deleting things on the
              touchscreen. It is not real security — anyone who wants your data can read browser
              storage. Awarding points never needs the PIN.
            </p>
            <div className="mt-5 grid grid-cols-2 gap-3">
              <input
                id="setup-pin"
                name="pin"
                inputMode="numeric"
                maxLength={4}
                value={pin}
                onChange={(e) => setPin(e.target.value.replace(/\D/g, "").slice(0, 4))}
                placeholder="New PIN"
                className="rounded-2xl border border-slate-300 px-4 py-4 text-center text-lg tracking-[0.5em] focus:border-slate-500 focus:outline-none"
              />
              <input
                id="setup-confirm-pin"
                name="confirmPin"
                inputMode="numeric"
                maxLength={4}
                value={confirmPin}
                onChange={(e) => setConfirmPin(e.target.value.replace(/\D/g, "").slice(0, 4))}
                placeholder="Confirm PIN"
                className="rounded-2xl border border-slate-300 px-4 py-4 text-center text-lg tracking-[0.5em] focus:border-slate-500 focus:outline-none"
              />
            </div>
            {pinError && <p className="mt-2 text-sm font-semibold text-rose-600">{pinError}</p>}
            <div className="mt-6 flex gap-3">
              <button
                type="button"
                onClick={() => setStep("students")}
                className="rounded-2xl bg-slate-100 px-5 py-4 text-base font-semibold text-slate-600 active:bg-slate-200"
              >
                Back
              </button>
              <button
                type="button"
                onClick={handleFinish}
                className="flex-1 rounded-2xl bg-emerald-600 py-4 text-lg font-bold text-stone-50 active:opacity-80"
              >
                Start using Class Points
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
