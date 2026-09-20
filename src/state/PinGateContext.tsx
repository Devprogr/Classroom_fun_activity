import { createContext, useCallback, useContext, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { useApp } from "./AppContext";
import PinModal from "../components/common/PinModal";

interface PinGateContextValue {
  requestPin: (onSuccess: () => void, label?: string) => void;
}

const PinGateContext = createContext<PinGateContextValue | null>(null);

export function PinGateProvider({ children }: { children: ReactNode }) {
  const { state } = useApp();
  const [challenge, setChallenge] = useState<{ onSuccess: () => void; label?: string } | null>(
    null,
  );

  const requestPin = useCallback(
    (onSuccess: () => void, label?: string) => {
      setChallenge({ onSuccess, label });
    },
    [],
  );

  const value = useMemo(() => ({ requestPin }), [requestPin]);

  return (
    <PinGateContext.Provider value={value}>
      {children}
      {challenge && (
        <PinModal
          expectedPin={state.pin}
          label={challenge.label}
          onCancel={() => setChallenge(null)}
          onSuccess={() => {
            const fn = challenge.onSuccess;
            setChallenge(null);
            fn();
          }}
        />
      )}
    </PinGateContext.Provider>
  );
}

export function usePinGate(): PinGateContextValue {
  const ctx = useContext(PinGateContext);
  if (!ctx) throw new Error("usePinGate must be used within PinGateProvider");
  return ctx;
}
