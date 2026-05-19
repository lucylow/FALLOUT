import React from "react";
import { Lock, Activity, Cpu, Wifi, Zap } from "lucide-react";
import { motion } from "motion/react";
import { 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  AreaChart, 
  Area 
} from "recharts";
import { KeyStatus, AuditEntry } from "../../types";
import { THREAT_SIGNALS } from "../../constants";
import MetricCard from "./MetricCard";
import Terminal from "./Terminal";
import LatencyTelemetry from "./LatencyTelemetry";
import QuantumCircuitDiagram from "../quantum/QuantumCircuitDiagram";
import InteractiveCircuitBuilder from "../quantum/InteractiveCircuitBuilder";
import axios from "axios";

import HelpTooltip from "../ux/HelpTooltip";
import AriaLiveRegion from "../ux/AriaLiveRegion";
import { useUXOrchestrator } from "../../hooks/useUXOrchestrator";

interface FalloutDashboardProps {
  keyStatus: KeyStatus | null;
  auditLog: AuditEntry[];
  simValue: number;
  setSimValue: (val: number) => void;
  isInjecting: boolean;
  injectThreat: (signal: string) => void;
}

const FalloutDashboard = ({ 
  keyStatus, 
  auditLog, 
  simValue, 
  setSimValue, 
  isInjecting, 
  injectThreat 
}: FalloutDashboardProps) => {
  useUXOrchestrator('fallout', keyStatus);
  
  const chartData = auditLog
    .filter((log) => log.decision === "REKEY" || log.decision === "REKEY_FAILED")
    .map((log) => ({
      time: new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      qber: log.qber ? log.qber * 100 : 0
    }))
    .reverse();

  return (
    <div className="animate-in fade-in duration-700 space-y-6">
      <AriaLiveRegion message={`QBER is currently ${(keyStatus?.qber ? keyStatus.qber * 100 : 0).toFixed(2)} percent. Key status is ${keyStatus?.status || 'Unknown'}.`} />
      
      {/* Global Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <MetricCard 
          title="Active Key Cluster" 
          value={keyStatus?.keyId || "---"} 
          subValue={keyStatus?.keyValue || "No active stream"}
          icon={Lock} 
          loading={!keyStatus}
        />
        <MetricCard 
          title="Measured QBER" 
          value={keyStatus ? `${(keyStatus.qber * 100).toFixed(2)}%` : "0.00%"} 
          subValue="Error probability per qubit"
          icon={Activity}
          color={keyStatus && keyStatus.qber > 0.08 ? "danger" : "primary"}
          loading={!keyStatus}
        />
        <HelpTooltip content="The entropy level indicates the cryptographic strength of the current key stream. 128-bit is standard for enterprise QKD links.">
          <MetricCard 
            title="Entropy Level" 
            value="128-bit" 
            subValue="AES-QKD Hardened Wrapper"
            icon={Cpu} 
          />
        </HelpTooltip>
        <MetricCard 
          title="Uptilt Connectivity" 
          value="99.94%" 
          subValue="Quantum Channel Availability"
          icon={Wifi} 
          color="warning"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 flex flex-col gap-6">
          <motion.div 
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-quantum-panel border border-quantum-border rounded-2xl p-6 h-[380px] relative glass overflow-hidden"
          >
            <div className="absolute inset-0 grid-bg opacity-30 pointer-events-none" />
            
            <div className="flex items-center justify-between mb-10 relative z-10">
              <div className="flex flex-col gap-1">
                <h3 className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#8E9299]">/ Telemetry</h3>
                <span className="text-lg font-bold tracking-tight text-white">QBER Historical Drift</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5 text-[9px] font-bold font-mono text-quantum-danger uppercase tracking-wider bg-quantum-danger/10 px-2 py-1 rounded">
                  <div className="w-1.5 h-1.5 rounded-full bg-quantum-danger animate-pulse" />
                  <span>Limit: 8.0%</span>
                </div>
              </div>
            </div>

            <div className="h-[240px] w-full relative z-10">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorQber" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--color-quantum-primary)" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="var(--color-quantum-primary)" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" vertical={false} />
                  <XAxis 
                    dataKey="time" 
                    stroke="#454545" 
                    fontSize={10} 
                    tickLine={false} 
                    axisLine={false} 
                    dy={12}
                    fontFamily="var(--font-mono)"
                  />
                  <YAxis 
                    stroke="#454545" 
                    fontSize={10} 
                    tickLine={false} 
                    axisLine={false} 
                    domain={[0, 15]}
                    tickFormatter={(v) => `${v}%`}
                    fontFamily="var(--font-mono)"
                    dx={-10}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'rgba(20, 20, 24, 0.95)', 
                      border: '1px solid rgba(255,255,255,0.1)', 
                      borderRadius: '12px',
                      fontSize: '11px',
                      fontFamily: 'var(--font-mono)',
                      boxShadow: '0 10px 30px rgba(0,0,0,0.5)'
                    }}
                    cursor={{ stroke: 'rgba(255,255,255,0.1)', strokeWidth: 1 }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="qber" 
                    stroke="var(--color-quantum-primary)" 
                    fillOpacity={1} 
                    fill="url(#colorQber)" 
                    strokeWidth={3}
                    animationDuration={1500}
                    dot={{ r: 0 }}
                    activeDot={{ r: 5, fill: '#00FF9C', stroke: '#fff', strokeWidth: 2 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          <div className="bg-quantum-panel border border-quantum-border rounded-2xl p-7 relative overflow-hidden group">
            <div className="flex items-center justify-between mb-8">
              <div className="flex flex-col gap-1">
                <h3 className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#8E9299]">/ Controls</h3>
                <span className="text-lg font-bold tracking-tight text-white">System Stress Testing</span>
              </div>
              <div className="flex items-center gap-4 text-[11px] font-mono">
                <span className="text-[#8E9299]">Intensity:</span>
                <span className={`font-bold transition-colors ${(simValue > 0.1) ? 'text-quantum-danger' : 'text-quantum-primary'}`}>
                  {(simValue * 100).toFixed(1)}%
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {THREAT_SIGNALS.map((t) => (
                <button
                  key={t.id}
                  disabled={isInjecting}
                  onClick={() => injectThreat(t.id)}
                  className="flex items-center gap-4 bg-quantum-bg/50 hover:bg-quantum-border border border-quantum-border p-4 rounded-xl transition-all group disabled:opacity-50 relative overflow-hidden"
                >
                  <div className={`p-2.5 bg-quantum-panel rounded-xl group-hover:bg-quantum-primary/10 group-hover:text-quantum-primary transition-all duration-300`}>
                    <t.icon size={18} />
                  </div>
                  <div className="flex flex-col items-start">
                    <span className="text-[13px] font-semibold text-white group-hover:text-quantum-primary transition-colors">{t.label}</span>
                    <span className="text-[9px] font-bold font-mono text-[#454545] uppercase tracking-widest group-hover:text-[#8E9299] transition-colors">Invoke State</span>
                  </div>
                </button>
              ))}
              
              <button
                disabled={isInjecting}
                onClick={async () => {
                  try {
                    await axios.post("/api/quantum/fast-handshake", { n_qubits: 4096, noise: 0.005 });
                    injectThreat("REKEY"); // Trigger UI rekey response for visual consistency
                  } catch (err) {
                    console.error("Fast Handshake failed", err);
                  }
                }}
                className="flex items-center gap-4 bg-quantum-primary/10 hover:bg-quantum-primary/20 border border-quantum-primary/30 p-4 rounded-xl transition-all group relative overflow-hidden"
              >
                <div className="p-2.5 bg-quantum-primary text-black rounded-xl transition-all duration-300">
                  <Zap size={18} />
                </div>
                <div className="flex flex-col items-start">
                  <span className="text-[13px] font-black text-quantum-primary uppercase italic">Fast Handshake</span>
                  <span className="text-[9px] font-bold font-mono text-quantum-primary/60 uppercase tracking-widest">WASM Pipeline</span>
                </div>
              </button>
            </div>
            
            <div className="mt-8 px-1">
              <input 
                type="range" 
                min="0" 
                max="0.2" 
                step="0.01" 
                value={simValue} 
                onChange={(e) => setSimValue(parseFloat(e.target.value))}
                className="w-full h-1.5 bg-quantum-bg border border-quantum-border rounded-full appearance-none cursor-pointer accent-quantum-primary hover:accent-emerald-300 transition-all"
              />
            </div>

            {isInjecting && (
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{ duration: 1.5, ease: "linear" }}
                className="absolute bottom-0 left-0 h-[3px] bg-quantum-primary shadow-[0_0_15px_#00FF9C]" 
              />
            )}
          </div>
        </div>

        <div className="lg:col-span-1 space-y-6">
          <LatencyTelemetry />
          <Terminal logs={auditLog} />
          
          <motion.div 
            whileHover={{ scale: 1.02 }}
            className="bg-quantum-primary/5 border border-quantum-primary/20 rounded-2xl p-6 flex flex-col gap-4 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-4 opacity-[0.03] text-quantum-primary pointer-events-none">
              <Zap size={100} strokeWidth={1} />
            </div>
            <div className="flex items-center gap-2.5 text-quantum-primary">
              <div className="w-1.5 h-1.5 rounded-full bg-quantum-primary animate-pulse" />
              <span className="text-[11px] font-bold uppercase tracking-[0.2em]">Protocol Status: Nominal</span>
            </div>
            <p className="text-[12px] text-quantum-primary/80 font-mono leading-relaxed relative z-10">
              FALLOUT Core is active. Gemini AI engine is parsing quantum entropy anomalies. System integrity at 99.98% confidence level. 
            </p>
          </motion.div>
        </div>
      </div>

      {/* Quantum Laboratories Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-between px-2">
            <div className="flex flex-col gap-1">
              <h2 className="text-xl font-bold tracking-tighter text-white italic uppercase">Topology Engine</h2>
              <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#8E9299]">Real-time state vector telemetry</p>
            </div>
          </div>
          <QuantumCircuitDiagram keyStatus={keyStatus} />
        </div>
        
        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-between px-2">
            <div className="flex flex-col gap-1">
              <h2 className="text-xl font-bold tracking-tighter text-white italic uppercase">Handshake Sandbox</h2>
              <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#8E9299]">Experimental Protocol Simulation</p>
            </div>
          </div>
          <InteractiveCircuitBuilder />
        </div>
      </div>
    </div>
  );
};

export default FalloutDashboard;
