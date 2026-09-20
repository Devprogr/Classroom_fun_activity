import type { ReactNode } from "react";

interface ModalProps {
  onClose: () => void;
  children: ReactNode;
  wide?: boolean;
}

export default function Modal({ onClose, children, wide }: ModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button
        type="button"
        aria-label="Close"
        onClick={onClose}
        className="animate-fade-in absolute inset-0 bg-slate-950/70"
      />
      <div
        className={`animate-fade-in relative flex max-h-[90vh] w-full flex-col overflow-hidden rounded-3xl bg-stone-50 text-slate-900 shadow-2xl ${
          wide ? "max-w-3xl" : "max-w-lg"
        }`}
      >
        {children}
      </div>
    </div>
  );
}
