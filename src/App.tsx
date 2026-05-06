import { Sidebar } from './components/layout/Sidebar';
import { Scene3D } from './components/spatial/Scene3D';
import { DriftChart } from './components/telemetry/DriftChart';
import { LatencyMonitor } from './components/telemetry/LatencyMonitor';
import { PhaseStatus } from './components/phases/PhaseStatus';
import { AuthView } from './components/AuthView';
import { useSimulation } from './hooks/useSimulation';
import { Badge } from './components/ui/Badge';
import { useStore } from './store/useStore';
import { Terminal, ShieldCheck, Database, Box, Search, AlertCircle, Info, Trash2, RefreshCcw } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from './lib/utils';
import { Input } from './components/ui/Input';
import { AlertDialog } from './components/ui/Modal';
import { NotificationStack } from './components/NotificationStack';
import { useState } from 'react';

export default function App() {
  const { isAuthenticated, searchQuery, setSearchQuery, tiles, telemetry, addNotification } = useStore();
  const [showPurgeDialog, setShowPurgeDialog] = useState(false);
  const _isFatalError = false;
  useSimulation();

  if (!isAuthenticated) {
    return <AuthView />;
  }

  // Simulate Fatal Error based on telemetry (UX-CONFIG 6.1)
  if (telemetry.thermalPressure > 0.98 || _isFatalError) {
    return (
      <div className="fixed inset-0 bg-[#050505] z-[200] flex items-center justify-center font-mono">
        <div className="max-w-xl w-full border border-rose-600 bg-rose-950/20 p-8 text-rose-500 rounded-lg shadow-[0_0_100px_rgba(225,29,72,0.1)]">
          <div className="flex items-center gap-3 mb-6">
            <AlertCircle size={32} />
            <h1 className="text-2xl font-bold uppercase tracking-tighter">KERNEL PANIC</h1>
          </div>
          <div className="space-y-4 mb-10 opacity-80">
            <p>KERNEL_PANIC: Thermal throttling detected. Reboot required.</p>
            <p>SPATIAL_INDEX_CORRUPTED: FUSION_CORE_FREEZE</p>
            <p className="text-sm italic text-rose-400">"The system has been halted to prevent permanent hardware degradation."</p>
          </div>
          <button 
            onClick={() => window.location.reload()}
            className="flex items-center gap-3 bg-rose-500 text-white px-6 py-3 rounded font-bold uppercase text-sm hover:bg-rose-400 transition-colors"
          >
            <RefreshCcw size={18} />
            Reboot System
          </button>
        </div>
      </div>
    );
  }

  const filteredTiles = tiles.filter(t => 
    searchQuery === '' || t.semanticClass.includes(searchQuery.toLowerCase()) || t.id.includes(searchQuery)
  );

  const handlePurge = () => {
    useStore.setState({ tiles: [] });
    addNotification({ type: 'warning', message: 'CACHE_PURGED: Volatile index empty.' });
    setShowPurgeDialog(false);
  };

  return (
    <div className="flex h-screen w-full bg-[#E4E3E0] text-[#141414] overflow-hidden selection:bg-[#141414] selection:text-[#E4E3E0]">
      <Sidebar />
      
      <main className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        {/* Verification Banner - UX-CONFIG 3.1 */}
        <div className="bg-amber-100 border-b border-amber-200 px-6 py-2 flex items-center justify-between">
          <div className="flex items-center gap-2 text-amber-800">
            <Info size={14} />
            <span className="text-[10px] font-mono uppercase tracking-widest font-bold">STATE: UNVERIFIED</span>
            <span className="text-[10px] opacity-60">Map write-access suspended.</span>
          </div>
          <button 
            onClick={() => addNotification({ type: 'success', message: 'VERIFICATION_LINK_DISPATCHED: CHECK SIGNAL INTERFACE.' })}
            className="text-[9px] font-bold uppercase underline underline-offset-2 hover:opacity-70"
          >
            RESEND LINK
          </button>
        </div>

        <div className="flex-1 flex flex-col p-6 gap-6 min-h-0 overflow-y-auto">
          {/* Top bar */}
          <header className="flex items-center justify-between">
            <PhaseStatus />
            
            <div className="flex items-center gap-6">
              <div className="relative w-64 group">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 opacity-30 group-focus-within:opacity-100 transition-opacity" />
                <Input 
                  placeholder="SEARCH SPATIAL INDEX..." 
                  className="pl-9 h-9 text-[10px] bg-white/50 border-[#141414]/10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <div className="flex items-center gap-4">
                <div className="text-right">
                  <div className="text-[10px] uppercase tracking-widest opacity-40 font-mono">node</div>
                  <div className="text-xs font-mono font-bold">JETSON-AGX-001</div>
                </div>
                <div className="h-8 w-[1px] bg-[#141414]/10" />
                <div className="text-right">
                  <div className="text-[10px] uppercase tracking-widest opacity-40 font-mono">integrity</div>
                  <div className="flex items-center gap-1 text-emerald-600">
                    <ShieldCheck size={14} />
                    <span className="text-xs font-mono font-bold uppercase tracking-tight">Verified</span>
                  </div>
                </div>
              </div>
            </div>
          </header>

          {/* Dashboard Grid */}
          <div className="flex-1 grid grid-cols-12 gap-6 min-h-0">
            {/* Main Visualizer */}
            <div className="col-span-12 lg:col-span-8 flex flex-col gap-4">
              <div className="flex-1 min-h-0 relative">
                <AnimatePresence mode="wait">
                  {tiles.length === 0 ? (
                    <motion.div 
                      key="empty-first"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="absolute inset-0 flex items-center justify-center bg-[#050505] rounded-xl border border-[#222] z-10"
                    >
                      <div className="text-center space-y-4">
                        <div className="w-16 h-16 border-2 border-dashed border-white/20 rounded-full mx-auto flex items-center justify-center animate-pulse">
                          <Box size={24} className="text-white/20" />
                        </div>
                        <div className="space-y-1">
                          <h3 className="text-white text-sm font-bold uppercase tracking-widest">NO_CONTEXT</h3>
                          <p className="text-white/40 text-[10px] max-w-[200px] mx-auto italic leading-relaxed">
                            Ingest sensor stream to begin mapping environment.
                          </p>
                        </div>
                        <button 
                          onClick={() => addNotification({ type: 'error', message: 'clearance_auth_failure: permission_denied_at_edge' })}
                          className="bg-white text-black text-[10px] font-bold uppercase py-2 px-6 rounded hover:bg-white/90 active:scale-95 transition-all"
                        >
                          START INGESTION
                        </button>
                      </div>
                    </motion.div>
                  ) : filteredTiles.length === 0 ? (
                    <motion.div 
                      key="empty-search"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="absolute inset-0 flex items-center justify-center bg-[#050505]/80 backdrop-blur-sm rounded-xl border border-[#222] z-10"
                    >
                      <div className="text-center space-y-4">
                        <AlertCircle size={32} className="text-white/20 mx-auto" />
                        <div className="space-y-1">
                          <h3 className="text-white text-sm font-bold uppercase tracking-widest">No results for "{searchQuery}"</h3>
                          <p className="text-white/40 text-[10px] italic">Adjust your spatial query parameters.</p>
                        </div>
                        <button 
                          onClick={() => setSearchQuery('')}
                          className="text-white/60 text-[10px] font-bold uppercase underline underline-offset-4 hover:text-white"
                        >
                          Clear Search
                        </button>
                      </div>
                    </motion.div>
                  ) : null}
                </AnimatePresence>
                
                <Scene3D tiles={filteredTiles} />
                
                {/* Overlay data */}
                <div className="absolute bottom-4 right-4 flex flex-col gap-2 pointer-events-none">
                  <div className="bg-black/90 backdrop-blur-md p-3 rounded-lg border border-white/10 text-white font-mono text-[10px] w-64 shadow-2xl">
                    <div className="flex justify-between border-b border-white/10 pb-1 mb-1">
                      <span className="opacity-40 uppercase">Memory Pool</span>
                      <span className="text-emerald-400">1.2GB/16.0GB</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="opacity-40 uppercase">Shader Cache</span>
                      <span>READY</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="opacity-40 uppercase">Compute Kernel</span>
                      <span className="text-blue-400">OPTIMIZED</span>
                    </div>
                  </div>
                </div>
              </div>

              <LatencyMonitor />
            </div>

            {/* Right Column: Telemetry & Logs */}
            <div className="col-span-12 lg:col-span-4 flex flex-col gap-4 overflow-y-auto pr-2 custom-scrollbar">
              <DriftChart />
              
              <section className="space-y-3">
                <div className="flex items-center justify-between border-b border-[#141414] pb-2">
                  <div className="flex items-center gap-2">
                    <Terminal size={14} />
                    <span className="text-xs font-bold uppercase tracking-widest">Runtime Events</span>
                  </div>
                  <Badge variant="technical" className="text-[10px]">LIVE</Badge>
                </div>

                <div className="space-y-2 font-mono text-[10px]">
                  {[...Array(6)].map((_, i) => (
                    <motion.div 
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="p-2 border border-[#141414]/10 rounded bg-[#dbdad7]/50 flex gap-3"
                    >
                      <span className="opacity-30">[{new Date().toLocaleTimeString()}]</span>
                      <span className={cn(i % 3 === 0 ? "text-blue-600" : "text-[#141414]")}>
                        {i % 3 === 0 ? "MAP_TILE_ADMITTED" : i % 3 === 1 ? "DRIFT_VECTOR_SYNCHRONIZED" : "WATCHDOG_HEARTBEAT_NOMINAL"}
                      </span>
                    </motion.div>
                  ))}
                </div>
              </section>

              <section className="bg-[#141414] p-5 rounded-xl text-white font-mono shadow-xl relative overflow-hidden">
                <Database size={64} className="absolute -right-4 -bottom-4 opacity-5 text-emerald-400" />
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Database size={16} className="text-emerald-400" />
                    <span className="text-xs font-bold uppercase tracking-widest text-emerald-400 underline underline-offset-4">Governance Snapshot</span>
                  </div>
                  <button 
                    onClick={() => setShowPurgeDialog(true)}
                    className="p-1.5 rounded hover:bg-white/10 text-rose-400 transition-colors"
                    title="Purge Map Index"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
                <div className="space-y-2 text-[9px] opacity-70">
                  <div className="flex justify-between border-b border-white/5 pb-1">
                    <span>DATASET_ID</span>
                    <span>LING-v4.1-WAR-PRO</span>
                  </div>
                  <div className="flex justify-between border-b border-white/5 pb-1">
                    <span>MODEL_HASH</span>
                    <span>sha256:7f9e...2a11</span>
                  </div>
                  <div className="flex justify-between border-b border-white/5 pb-1">
                    <span>SBOM_VERIFIED</span>
                    <span className="text-emerald-400">TRUE</span>
                  </div>
                  <div className="flex justify-between">
                    <span>ITAR_POLICY</span>
                    <span>COMPLIANT-GA-7</span>
                  </div>
                </div>
              </section>
              
              <section className="mt-2 border border-[#141414] p-5 rounded-xl relative overflow-hidden group hover:bg-[#141414] hover:text-white transition-all cursor-pointer shadow-sm">
                <Box className="absolute -right-4 -bottom-4 opacity-10 group-hover:opacity-20 transition-all" size={80} />
                <h3 className="text-xs font-bold uppercase tracking-widest mb-2 italic">Spatial Intelligence Foundation</h3>
                <p className="text-[10px] opacity-60 leading-relaxed mb-4">
                  Continuously predicting and correcting SE(3) transforms without global optimization. Edge-native spatial reasoning at scale.
                </p>
                <div className="text-[10px] font-bold underline underline-offset-2 uppercase text-inherit flex items-center gap-2">
                  Read System Case <span className="translate-x-0 group-hover:translate-x-1 transition-transform">&rarr;</span>
                </div>
              </section>
            </div>
          </div>
        </div>
      </main>

      <AlertDialog 
        isOpen={showPurgeDialog}
        onClose={() => setShowPurgeDialog(false)}
        onConfirm={handlePurge}
        title="Purge Map Index?"
        message="This will permanently remove the geometric context for this region. This cannot be undone."
        confirmText="PURGE DATA"
      />

      <NotificationStack />
    </div>
  );
}
