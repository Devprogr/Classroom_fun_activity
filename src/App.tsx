import { useState } from "react";
import { AppProvider, useApp } from "./state/AppContext";
import { ToastProvider } from "./state/ToastContext";
import { PinGateProvider, usePinGate } from "./state/PinGateContext";
import SetupScreen from "./components/setup/SetupScreen";
import TopNav, { type Tab } from "./components/layout/TopNav";
import ClassroomScreen from "./components/classroom/ClassroomScreen";
import StoreScreen from "./components/store/StoreScreen";
import ReportsScreen from "./components/reports/ReportsScreen";
import SettingsScreen from "./components/settings/SettingsScreen";

function AppShell() {
  const { state } = useApp();
  const { requestPin } = usePinGate();
  const [activeTab, setActiveTab] = useState<Tab>("classroom");

  if (!state.setupComplete) {
    return <SetupScreen />;
  }

  function handleSelect(tab: Tab) {
    if (tab === "settings") {
      requestPin(() => setActiveTab("settings"));
      return;
    }
    setActiveTab(tab);
  }

  return (
    <div className="min-h-screen bg-slate-950">
      <TopNav active={activeTab} onSelect={handleSelect} />
      {activeTab === "classroom" && <ClassroomScreen />}
      {activeTab === "store" && <StoreScreen />}
      {activeTab === "reports" && <ReportsScreen />}
      {activeTab === "settings" && <SettingsScreen />}
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <ToastProvider>
        <PinGateProvider>
          <AppShell />
        </PinGateProvider>
      </ToastProvider>
    </AppProvider>
  );
}
