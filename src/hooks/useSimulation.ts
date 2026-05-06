import { useEffect, useRef } from 'react';
import { useStore } from '../store/useStore';
import { GeometricContextTransformer, TileFusionEngine } from '../core/engine';

export const useSimulation = () => {
  const { isActive, updateTelemetry, updateDrift, addTile, setWatchdogStatus } = useStore();
  const transformerRef = useRef(new GeometricContextTransformer());
  const fusionRef = useRef(new TileFusionEngine());
  
  useEffect(() => {
    if (!isActive) return;

    const interval = setInterval(() => {
      // 1. Simulate Inference
      const drift = transformerRef.current.predict({});
      updateDrift(drift);

      // 2. Simulate Telemetry Updates
      updateTelemetry({
        latency: 3.5 + Math.random() * 2,
        driftRmse: drift.uncertainty,
        computeBudget: 0.7 + Math.random() * 0.2
      });

      // 3. Conditional Tile Fusion
      if (Math.random() > 0.95) {
        const newTile = fusionRef.current.fuse(drift, {});
        addTile(newTile);
      }

      // 4. Watchdog Checks
      if (drift.uncertainty > 0.08) {
        setWatchdogStatus('critical');
      } else if (drift.uncertainty > 0.04) {
        setWatchdogStatus('warning');
      } else {
        setWatchdogStatus('nominal');
      }

    }, 200);

    return () => clearInterval(interval);
  }, [isActive, updateDrift, updateTelemetry, addTile, setWatchdogStatus]);
};
