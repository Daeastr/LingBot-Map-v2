import { useStore } from '../../store/useStore';
import { Card, CardTitle } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { motion, AnimatePresence } from 'motion/react';

export const PhaseStatus = () => {
  const { phase } = useStore();

  const phaseDetails = [
    { id: 0, title: 'Foundation Baseline', desc: 'Validating geometric Layer invariants and SE(3) equivariance.' },
    { id: 1, title: 'Data Engine Boot', desc: 'Ingesting multimodal sensor streams and generating synthetic 3D tiles.' },
    { id: 2, title: 'Model Optimization', desc: 'Quantization-aware training and kernel fusion in progress.' },
    { id: 3, title: 'Edge Runtime Deployment', desc: 'Active memory pressure tests on Jetson Orin target.' },
    { id: 4, title: 'Coherence Gating', desc: 'Watchdog active. Monotonic timestamp enforcement enabled.' },
    { id: 5, title: 'AR/VR Surface', desc: 'Semantic occlusion layer projecting to world anchors.' },
    { id: 6, title: 'Robotics Safety', desc: 'Deterministic fallback mode ARMED. Safety threshold: 0.05 RMSE.' },
    { id: 7, title: 'Multi-Agent Mesh', desc: 'Hierarchical tile merge protocol broadcasting on ephemeral mesh.' },
    { id: 8, title: 'Governance Layer', desc: 'DVC lineage verification and SOC2 compliance monitoring.' },
    { id: 9, title: 'Continuous Evolution', desc: 'Federated feedback loop active. Incremental weights detected.' },
  ];

  const current = phaseDetails[phase];

  return (
    <Card className="bg-transparent border-none shadow-none flex flex-col justify-center">
      <AnimatePresence mode="wait">
        <motion.div
          key={phase}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex items-center gap-3 mb-2">
            <Badge variant="technical" className="text-[10px]">PHASE_{phase.toString().padStart(2, '0')}</Badge>
            <CardTitle className="text-xl tracking-tight leading-none">{current.title}</CardTitle>
          </div>
          <p className="text-sm text-[#141414]/60 max-w-xl italic italic-serif leading-relaxed">
            "{current.desc}"
          </p>
        </motion.div>
      </AnimatePresence>
    </Card>
  );
};
