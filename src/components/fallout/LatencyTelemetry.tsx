import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Gauge, Zap, Database, ArrowUpRight, Cpu, RefreshCw } from "lucide-react";
import axios from "axios";

interface TelemetryStats {
  avgLatency: number;
  throughputKeysPerSec: number;
  edgeCacheHitRate: number;
  nodeStatus: string;
  protocolVersion: string;
}

const LatencyTelemetry = () => {
  const [stats, setStats] = useState<TelemetryStats | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchTelemetry = async () => {
    setIsRefreshing(true);
    try {
      // Simulation of a MsgPack request if we had a binary client, 
      // but for now we use standard JSON for the UI demo.
      const response = await axios.get("/api/quantum/telemetry-optimized");
      setStats(response.data);
    } catch (err) {
      console.error("[TELEMETRY_FAILURE]", err);
    } finally {
      setTimeout(() => setIsRefreshing(false), 800);
    }
  };

  useEffect(() => {
    fetchTelemetry();
    const interval = setInterval(fetchTelemetry, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-quantum-panel border border-quantum-border rounded-2xl p-6 relative overflow-hidden glass">
      <div className="absolute inset-0 grid-bg opacity-10 pointer-events-none" />
      
      <div className="flex items-center justify-between mb-8 relative z-10">
        <div className="flex flex-col gap-1">
          <h3 className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#8E9299]">/ Performance</h3>
          <span className="text-lg font-bold tracking-tight text-white uppercase italic">Zero-Latency Buffers</span>
        </div>
        <button 
          onClick={fetchTelemetry}
          className="p-2 bg-white/5 hover:bg-white/10 rounded-xl text-quantum-primary transition-all"
        >
          <RefreshCw size={16} className={isRefreshing ? "animate-spin" : ""} />
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4 relative z-10">
        <div className="bg-white/5 border border-white/10 p-4 rounded-xl space-y-2">
          <div className="flex items-center justify-between">
            <Zap size={14} className="text-quantum-primary" />
            <span className="text-[10px] font-mono text-[#454545]">Lat. (avg)</span>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-black text-white italic tracking-tighter">
              {stats?.avgLatency.toFixed(3) || "---"}
            </span>
            <span className="text-[10px] font-mono text-quantum-primary uppercase">ms</span>
          </div>
        </div>

        <div className="bg-white/5 border border-white/10 p-4 rounded-xl space-y-2">
          <div className="flex items-center justify-between">
            <ArrowUpRight size={14} className="text-emerald-400" />
            <span className="text-[10px] font-mono text-[#454545]">Thrput</span>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-black text-white italic tracking-tighter">
              {stats?.throughputKeysPerSec.toLocaleString() || "---"}
            </span>
            <span className="text-[10px] font-mono text-[#454545] uppercase">K/s</span>
          </div>
        </div>

        <div className="bg-white/5 border border-white/10 p-4 rounded-xl space-y-2">
          <div className="flex items-center justify-between">
            <Database size={14} className="text-amber-400" />
            <span className="text-[10px] font-mono text-[#454545]">Cache Hit</span>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-black text-white italic tracking-tighter">
              {(stats?.edgeCacheHitRate ? stats.edgeCacheHitRate * 100 : 0).toFixed(0)}
            </span>
            <span className="text-[10px] font-mono text-[#454545] uppercase">%</span>
          </div>
        </div>

        <div className="bg-white/5 border border-white/10 p-4 rounded-xl space-y-2">
          <div className="flex items-center justify-between">
            <Cpu size={14} className="text-blue-400" />
            <span className="text-[10px] font-mono text-[#454545]">Engine</span>
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-black text-white uppercase italic truncate">
              {stats?.nodeStatus || "OFFLINE"}
            </span>
            <span className="text-[8px] font-mono text-[#454545] uppercase tracking-tighter">
              {stats?.protocolVersion || "V0.0"}
            </span>
          </div>
        </div>
      </div>

      <div className="mt-6 pt-6 border-t border-white/5 relative z-10">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[9px] font-mono uppercase tracking-widest text-[#454545]">WASM Buffer Saturation</span>
          <span className="text-[9px] font-mono text-quantum-primary">12.4%</span>
        </div>
        <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: "12.4%" }}
            className="h-full bg-quantum-primary shadow-quantum" 
          />
        </div>
      </div>
    </div>
  );
};

export default LatencyTelemetry;
