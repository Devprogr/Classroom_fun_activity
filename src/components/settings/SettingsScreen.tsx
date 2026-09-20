import type { ReactNode } from "react";
import BehavioursEditor from "./BehavioursEditor";
import RewardsEditor from "./RewardsEditor";
import ClassAndStudentsSection from "./ClassAndStudentsSection";
import BackupSection from "./BackupSection";
import ResetSection from "./ResetSection";

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="mb-6 rounded-2xl bg-stone-50 p-5 text-slate-900 shadow-sm">
      <h2 className="mb-4 text-lg font-bold">{title}</h2>
      {children}
    </section>
  );
}

export default function SettingsScreen() {
  return (
    <div className="mx-auto max-w-4xl p-4 md:p-6">
      <h1 className="mb-1 text-2xl font-bold text-stone-100">Settings</h1>
      <p className="mb-6 text-sm font-medium text-amber-400">
        The PIN only stops a student from tapping something destructive on this touchscreen — it
        is not real security and the data is not encrypted or hidden from anyone with access to
        this browser.
      </p>

      <Section title="Class & students">
        <ClassAndStudentsSection />
      </Section>

      <Section title="Behaviours">
        <BehavioursEditor />
      </Section>

      <Section title="Rewards">
        <RewardsEditor />
      </Section>

      <Section title="Backup">
        <BackupSection />
      </Section>

      <Section title="Reset">
        <ResetSection />
      </Section>

      <p className="mt-2 text-center text-sm font-medium text-slate-400">
        Your data is saved in this browser only. Export a backup every week.
      </p>
    </div>
  );
}
