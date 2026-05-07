import { useStore } from './store/useStore';
import { AuthView } from './components/AuthView';
import { Sidebar } from './components/layout/Sidebar';
import { Scene3D } from './components/spatial/Scene3D';
import { PhaseStatus } from './components/phases/PhaseStatus';
import { LatencyMonitor } from './components/telemetry/LatencyMonitor';
import { DriftChart } from './components/telemetry/DriftChart';
import { NotificationStack } from './components/NotificationStack';

export default function App() {
  const { isAuthenticated, tiles } = useStore();

  if (!isAuthenticated) {
    return <AuthView />;
  }

  return (
    <div className="flex h-screen bg-[#dbdad7] font-sans overflow-hidden">
      <Sidebar />

      <main className="flex-1 flex flex-col overflow-hidden">
        <div className="p-6 border-b border-[#141414]/10">
          <PhaseStatus />
        </div>

        <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-6 p-6 overflow-auto">
          <div className="relative min-h-[320px]">
            <Scene3D tiles={tiles} />
          </div>

          <div className="flex flex-col gap-4">
            <LatencyMonitor />
            <DriftChart />
          </div>
        </div>
      </main>

      <NotificationStack />
    </div>
  );
}
