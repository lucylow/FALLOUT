import React, { useState, useEffect, useRef } from "react";
import { 
  Zap, 
  Activity, 
  ShieldAlert, 
  RefreshCcw, 
  Lock, 
  AlertTriangle,
  Play,
  RotateCcw
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

const QkdDemo = () => {
  const [qber, setQber] = useState(2.4);
  const [activeKey, setActiveKey] = useState("QK-99XA-02");
  const [logs, setLogs] = useState<any[]>([
    { id: 1, time: "10:00:00", msg: "BB84 Stream Stable.", status: "ok" }
  ]);
  const [isRekeying, setIsRekeying] = useState(false);
  const [autoRekey, setAutoRekey] = useState(true);
  const [isEveActive, setIsEveActive] = useState(false);

  // Simulation loop
  useEffect(() => {
    const timer = setInterval(() => {
      if (!isRekeying) {
        setQber(prev => {
          let noise = (Math.random() - 0.5) * 0.5;
          let base = isEveActive ? 12 : 2.5;
          let newVal = Math.max(1.5, Math.min(25, base + noise));
          
          if (newVal > 8 && autoRekey && !isRekeying) {
            triggerRekey("QBER Threshold Violation");
          }
          return newVal;
        });
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [isEveActive, autoRekey, isRekeying]);

  const triggerRekey = (reason: string) => {
    if (isRekeying) return;
    setIsRekeying(true);
    addLog(`Policy Trigger: ${reason}`, "warn");
    
    setTimeout(() => {
      const newKey = `QK-${Math.random().toString(36).substring(2, 6).toUpperCase()}-${Math.floor(Math.random()*99)}`;
      setActiveKey(newKey);
      setIsRekeying(false);
      setIsEveActive(false);
      setQber(2.1);
      addLog(`New Key Synchronized: ${newKey}`, "success");
    }, 2000);
  };

  const addLog = (msg: string, status: string) => {
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    setLogs(prev => [{ id: Date.now(), time, msg, status }, ...prev].slice(0, 5));
  };

  return (
    <div className="bg-quantum-panel border border-quantum-border rounded-3xl overflow-hidden shadow-2xl flex flex-col lg:flex-row min-h-[500px]">
      {/* Simulation Controls */}
      <div className="lg:w-1/3 p-8 border-b lg:border-b-0 lg:border-r border-quantum-border">
        <h3 className="font-mono text-xs uppercase tracking-widest text-[#8E9299] mb-8">Threat Ingress Panel</h3>
        <div className="flex flex-col gap-4">
          <button 
            onClick={() => {
              setQber(15.5);
              addLog("Injecting Photon Distortion Spike...", "danger");
            }}
            className="flex items-center gap-3 p-4 bg-quantum-bg border border-quantum-border rounded-xl hover:border-quantum-danger/50 hover:bg-quantum-danger/5 transition-all text-left group"
          >
            <div className="p-2 bg-quantum-panel group-hover:text-quantum-danger transition-colors rounded-lg">
              <Activity size={20} />
            </div>
            <div>
              <p className="text-sm font-bold">Inject QBER Spike</p>
              <p className="text-[10px] text-[#8E9299] font-mono">Manual Signal Jamming</p>
            </div>
          </button>

          <button 
            onClick={() => {
              setIsEveActive(true);
              addLog("Quantum Eavesdropper Simulated.", "danger");
            }}
            className={`flex items-center gap-3 p-4 bg-quantum-bg border border-quantum-border rounded-xl transition-all text-left group ${
              isEveActive ? "border-quantum-danger bg-quantum-danger/10" : "hover:border-quantum-danger/50 hover:bg-quantum-danger/5"
            }`}
          >
            <div className={`p-2 bg-quantum-panel rounded-lg ${isEveActive ? "text-quantum-danger" : "group-hover:text-quantum-danger"}`}>
              <ShieldAlert size={20} />
            </div>
            <div>
              <p className="text-sm font-bold">Simulate Eve Attack</p>
              <p className="text-[10px] text-[#8E9299] font-mono">MITM Intrusion Attempt</p>
            </div>
          </button>

          <button 
            onClick={() => triggerRekey("Manual Force Override")}
             className="flex items-center gap-3 p-4 bg-quantum-bg border border-quantum-border rounded-xl hover:border-quantum-primary/50 hover:bg-quantum-primary/5 transition-all text-left group"
          >
            <div className="p-2 bg-quantum-panel group-hover:text-quantum-primary transition-colors rounded-lg">
              <RefreshCcw size={20} />
            </div>
            <div>
              <p className="text-sm font-bold">Force Cycle Rekey</p>
              <p className="text-[10px] text-[#8E9299] font-mono">Instant Key Handshake</p>
            </div>
          </button>
        </div>

        <div className="mt-8 pt-8 border-t border-quantum-border">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-mono text-[#8E9299]">Autonomous Mode</span>
            <div 
              onClick={() => setAutoRekey(!autoRekey)}
              className={`w-10 h-5 rounded-full cursor-pointer transition-colors relative ${autoRekey ? "bg-quantum-primary" : "bg-[#454545]"}`}
            >
              <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-transform ${autoRekey ? "left-6" : "left-1"}`} />
            </div>
          </div>
          <p className="text-[10px] text-[#8E9299] leading-relaxed">
            When enabled, the FALLOUT agent will automatically detect and resolve threats based on QBER deviations.
          </p>
        </div>
      </div>

      {/* Visualizer and Stream */}
      <div className="flex-1 p-8 bg-quantum-bg/50 relative overflow-hidden">
        {/* QKD Transmission Viz */}
        <div className="h-[200px] flex items-center justify-center relative mb-12">
          {/* Alice and Bob Nodes */}
          <div className="absolute left-0 w-24 h-24 bg-quantum-panel border border-quantum-border rounded-2xl flex flex-col items-center justify-center gap-2 z-10">
            <div className="w-8 h-8 rounded-full bg-quantum-primary/20 flex items-center justify-center text-quantum-primary">
              <Lock size={16} />
            </div>
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#8E9299]">Alice</span>
          </div>

          <div className="absolute right-0 w-24 h-24 bg-quantum-panel border border-quantum-border rounded-2xl flex flex-col items-center justify-center gap-2 z-10">
            <div className="w-8 h-8 rounded-full bg-quantum-primary/20 flex items-center justify-center text-quantum-primary">
              <Lock size={16} />
            </div>
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#8E9299]">Bob</span>
          </div>

          <div className="w-full h-0.5 bg-gradient-to-r from-quantum-primary/20 via-quantum-primary/5 to-quantum-primary/20 relative">
            {/* Photon Particle Animation */}
            {!isRekeying && Array.from({ length: 6 }).map((_, i) => (
              <motion.div
                key={i}
                initial={{ left: 0, opacity: 0 }}
                animate={{ left: "100%", opacity: [0, 1, 1, 0] }}
                transition={{ duration: 2, repeat: Infinity, delay: i * 0.4 }}
                className="absolute top-1/2 -translate-y-1/2 w-2 h-2 rounded-full shadow-[0_0_8px_#00FF9C] bg-quantum-primary"
              />
            ))}
            
            {isRekeying && (
              <div className="absolute inset-0 bg-quantum-primary/30 flex items-center justify-center animate-pulse">
                <span className="text-[10px] font-mono font-bold text-quantum-primary animate-bounce">SYNCING ENTROPY BITS...</span>
              </div>
            )}
          </div>
        </div>

        {/* Dashboard Readout */}
        <div className="grid grid-cols-2 gap-6">
          <div className="bg-quantum-panel border border-quantum-border p-5 rounded-2xl">
            <span className="text-[10px] font-mono text-[#8E9299] uppercase tracking-widest block mb-2">Active Stream Key</span>
            <div className="flex items-center gap-2">
              <span className={`text-2xl font-bold font-mono tracking-tighter ${isRekeying ? "animate-pulse blur-sm opacity-50" : ""}`}>
                {activeKey}
              </span>
              {!isRekeying && <Zap size={16} className="text-quantum-primary" />}
            </div>
          </div>
          <div className="bg-quantum-panel border border-quantum-border p-5 rounded-2xl">
            <span className="text-[10px] font-mono text-[#8E9299] uppercase tracking-widest block mb-2">Channel Stability</span>
            <div className="flex items-center gap-2">
              <span className={`text-2xl font-bold font-mono tracking-tighter ${qber > 8 ? "text-quantum-danger" : "text-white"}`}>
                {qber.toFixed(2)}%
              </span>
              <span className="text-[10px] text-[#8E9299]">QBER</span>
            </div>
          </div>
        </div>

        {/* Agent Logs */}
        <div className="mt-6 bg-quantum-panel/50 border border-quantum-border rounded-2xl p-5 h-[160px] flex flex-col font-mono text-xs">
          <div className="flex items-center justify-between mb-4 pb-2 border-b border-quantum-border/50">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-quantum-primary animate-pulse" />
              <span className="font-bold opacity-60">FALLOUT Agent Heartbeat</span>
            </div>
            <RotateCcw 
              size={12} 
              className="cursor-pointer hover:text-quantum-primary transition-colors" 
              onClick={() => setLogs([{ id: 1, time: "10:00:00", msg: "Logs Flushed.", status: "ok" }])}
            />
          </div>
          <div className="flex-1 overflow-y-auto space-y-2">
            <AnimatePresence>
              {logs.map((log) => (
                <motion.div 
                  key={log.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex gap-3"
                >
                  <span className="opacity-30">[{log.time}]</span>
                  <span className={
                    log.status === "warn" ? "text-yellow-500" : 
                    log.status === "danger" ? "text-quantum-danger" : 
                    log.status === "success" ? "text-quantum-primary" : 
                    "text-[#8E9299]"
                  }>
                    {log.msg}
                  </span>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QkdDemo;
