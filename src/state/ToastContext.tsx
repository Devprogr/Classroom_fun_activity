import { createContext, useCallback, useContext, useMemo, useRef, useState } from "react";
import type { ReactNode } from "react";

interface ToastState {
  id: string;
  message: string;
  onUndo?: () => void;
}

interface ToastContextValue {
  showToast: (message: string, onUndo?: () => void) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

const TOAST_DURATION_MS = 8000;

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toast, setToast] = useState<ToastState | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const dismiss = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setToast(null);
  }, []);

  const showToast = useCallback(
    (message: string, onUndo?: () => void) => {
      if (timerRef.current) clearTimeout(timerRef.current);
      const id = `${Date.now()}`;
      setToast({ id, message, onUndo });
      timerRef.current = setTimeout(() => {
        setToast((current) => (current?.id === id ? null : current));
      }, TOAST_DURATION_MS);
    },
    [],
  );

  const value = useMemo(() => ({ showToast }), [showToast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      {toast && (
        <div
          key={toast.id}
          className="animate-toast-in fixed bottom-6 left-1/2 z-[100] flex max-w-[92vw] -translate-x-1/2 items-center gap-4 rounded-2xl bg-stone-50 px-5 py-4 text-slate-900 shadow-xl"
        >
          <span className="text-base font-medium">{toast.message}</span>
          {toast.onUndo && (
            <button
              type="button"
              onClick={() => {
                toast.onUndo?.();
                dismiss();
              }}
              className="shrink-0 rounded-lg bg-slate-900 px-4 py-2 text-sm font-bold tracking-wide text-stone-50 active:opacity-80"
            >
              UNDO
            </button>
          )}
        </div>
      )}
    </ToastContext.Provider>
  );
}

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}
