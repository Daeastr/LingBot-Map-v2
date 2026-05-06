import { useStore } from '../../store/useStore';
import { Badge } from '../ui/Badge';
import { CheckCircle, Power } from 'lucide-react';
import { cn } from '../../lib/utils';

export const Sidebar = () => {
  const { watchdogStatus, activeSensors, phase, setPhase, isActive, toggleActive } = useStore();

  const menuItems = [
    { id: 0, label: '0. Foundation', icon: 'base' },
    { id: 1, label: '1. Architecture', icon: 'arch' },
    { id: 2, label: '2. Training', icon: 'train' },
    { id: 3, label: '3. Edge Runtime', icon: 'runtime' },
    { id: 4, label: '4. Security', icon: 'security' },
    { id: 5, label: '5. AR/VR', icon: 'ar' },
    { id: 6, label: '6. Robotics', icon: 'robot' },
    { id: 7, label: '7. Multi-Agent', icon: 'multi' },
    { id: 8, label: '8. Governance', icon: 'gov' },
    { id: 9, label: '9. Evolution', icon: 'evo' },
  ];

  return (
    <div className="w-64 border-r border-[#141414] bg-[#E4E3E0] h-full flex flex-col font-sans">
      <div className="p-6 border-bottom border-[#141414]">
        <h1 className="text-xl font-bold tracking-tight text-[#141414]">LINGBOT-MAP</h1>
        <p className="text-[10px] font-mono text-[#141414]/60 uppercase tracking-widest mt-1">v2.0 spatial context agent</p>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-6">
        <section>
          <h2 className="text-[10px] font-mono text-[#141414]/40 uppercase tracking-widest mb-3">system phases</h2>
          <div className="space-y-1">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setPhase(item.id)}
                className={cn(
                  "w-full text-left px-3 py-2 text-sm rounded transition-colors flex items-center justify-between",
                  phase === item.id 
                    ? "bg-[#141414] text-[#E4E3E0]" 
                    : "text-[#141414] hover:bg-[#141414]/10"
                )}
              >
                <span>{item.label}</span>
                {phase > item.id && <CheckCircle size={12} className="opacity-50" />}
              </button>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-[10px] font-mono text-[#141414]/40 uppercase tracking-widest mb-3">active sensors</h2>
          <div className="flex flex-wrap gap-2">
            {activeSensors.map((sensor) => (
              <Badge key={sensor} variant="technical" className="text-[9px] px-1.5 py-0">
                {sensor}
              </Badge>
            ))}
          </div>
        </section>
      </div>

      <div className="p-4 border-t border-[#141414] bg-[#dbdad7]">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] font-mono uppercase tracking-widest">Watchdog</span>
          <div className="flex items-center gap-1">
            {watchdogStatus === 'nominal' ? (
              <Badge variant="success" className="text-[8px] uppercase">Nominal</Badge>
            ) : (
              <Badge variant="danger" className="text-[8px] uppercase">Critical</Badge>
            )}
          </div>
        </div>
        
        <div className="space-y-2">
          <button 
            onClick={toggleActive}
            className={cn(
              "w-full py-2.5 rounded flex items-center justify-center gap-2 transition-all",
              isActive 
                ? "bg-emerald-600 text-white shadow-lg active:scale-95" 
                : "bg-red-600 text-white shadow-lg active:scale-95"
            )}
          >
            <Power size={16} />
            <span className="font-bold tracking-tight uppercase text-xs">{isActive ? 'System Active' : 'System Halted'}</span>
          </button>

          <button 
            onClick={() => useStore.getState().authenticate(false)}
            className="w-full py-2 rounded border border-[#141414] text-[#141414] font-bold uppercase text-[10px] transition-all hover:bg-[#141414] hover:text-white"
          >
            Terminate Session (Sign Out)
          </button>
        </div>
      </div>
    </div>
  );
};
