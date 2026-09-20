import type { ReactNode } from "react";

interface SlideUpPanelProps {
  onClose: () => void;
  children: ReactNode;
}

export default function SlideUpPanel({ onClose, children }: SlideUpPanelProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      <button
        type="button"
        aria-label="Close panel"
        onClick={onClose}
        className="animate-fade-in absolute inset-0 bg-slate-950/70"
      />
      <div className="animate-slide-up relative flex max-h-[85vh] w-full flex-col rounded-t-3xl bg-slate-100 shadow-2xl">
        {children}
      </div>
    </div>
  );
}
