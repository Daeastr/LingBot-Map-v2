import { useStore } from '../../store/useStore';
import { Card } from '../ui/Card';
import { Zap, Cpu, Activity, Clock } from 'lucide-react';
import { formatMs } from '../../lib/utils';

export const LatencyMonitor = () => {
  const { telemetry } = useStore();

  const metrics = [
    { label: 'Latency', value: formatMs(telemetry.latency), icon: Clock, color: 'text-amber-500' },
    { label: 'Compute', value: `${(telemetry.computeBudget * 100).toFixed(0)}%`, icon: Cpu, color: 'text-blue-500' },
    { label: 'Memory', value: `${telemetry.memoryUsage}MB`, icon: Activity, color: 'text-emerald-500' },
    { label: 'Thermal', value: `${(telemetry.thermalPressure * 100).toFixed(0)}%`, icon: Zap, color: 'text-rose-500' },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      {metrics.map((m) => (
        <Card key={m.label} variant="technical" className="p-3">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[9px] uppercase tracking-widest opacity-40">{m.label}</span>
            <m.icon size={12} className={m.color} />
          </div>
          <div className="text-lg font-bold">{m.value}</div>
        </Card>
      ))}
    </div>
  );
};
