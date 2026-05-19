import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Brain, 
  Send, 
  Bot, 
  Shield, 
  Zap, 
  Terminal as TerminalIcon,
  Search,
  Database,
  History,
  Activity,
  ArrowRight,
  Cpu,
  RefreshCw,
  MoreVertical
} from "lucide-react";
import { useAgentStore } from "../../store/agentStore";
import { AgentStep, AgentMemoryEntry } from "../../types";

const AgentIntelligenceCenter = () => {
  const [input, setInput] = useState("");
  const { isOrchestrating, activeSteps, memories, lastResponse, startOrchestration, addMemory } = useAgentStore();
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [activeSteps, lastResponse]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isOrchestrating) return;
    startOrchestration(input);
    setInput("");
  };

  const getAgentInfo = (agentName: string) => {
    const name = agentName.toUpperCase();
    if (name.includes("SUPERVISOR")) return { icon: Bot, color: "text-amber-400", bg: "bg-amber-400/10" };
    if (name.includes("QUANTUM")) return { icon: Zap, color: "text-quantum-primary", bg: "bg-quantum-primary/10" };
    if (name.includes("SECURITY")) return { icon: Shield, color: "text-quantum-danger", bg: "bg-quantum-danger/10" };
    return { icon: Cpu, color: "text-blue-400", bg: "bg-blue-400/10" };
  };

  return (
    <div className="animate-in fade-in duration-700 grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-140px)]">
      {/* Search & Reasoner Panel */}
      <div className="lg:col-span-2 flex flex-col gap-6">
        <div className="bg-quantum-panel border border-quantum-border rounded-2xl flex flex-col flex-1 overflow-hidden relative glass">
          <div className="absolute inset-0 grid-bg opacity-[0.03] pointer-events-none" />
          
          <div className="p-4 border-b border-quantum-border flex items-center justify-between bg-quantum-panel/50 backdrop-blur-sm relative z-10">
            <div className="flex items-center gap-3">
              <div className="p-1.5 bg-quantum-primary text-black rounded-lg shadow-quantum transition-transform hover:scale-105">
                <Brain size={14} />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-bold font-mono uppercase tracking-[0.2em] text-[#8E9299]">/ Intelligence Core</span>
                <span className="text-sm font-bold text-white">Multi-Agent Orchestration</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-[9px] font-bold font-mono uppercase tracking-widest ${isOrchestrating ? 'bg-quantum-primary/10 text-quantum-primary animate-pulse' : 'bg-white/5 text-[#454545]'}`}>
                <div className={`w-1.5 h-1.5 rounded-full ${isOrchestrating ? 'bg-quantum-primary' : 'bg-current'}`} />
                {isOrchestrating ? "Reasoning Sequence Active" : "Core Ready"}
              </div>
              <button className="p-2 hover:bg-white/5 rounded-lg text-[#454545] transition-colors">
                <MoreVertical size={16} />
              </button>
            </div>
          </div>

          <div 
            ref={scrollRef}
            className="flex-1 overflow-y-auto p-6 space-y-6 terminal-scroll relative z-10"
          >
            {activeSteps.length === 0 && !lastResponse && (
              <div className="h-full flex flex-col items-center justify-center opacity-30 text-center gap-4">
                <TerminalIcon size={48} className="text-[#8E9299]" />
                <div className="flex flex-col">
                  <p className="text-xs font-mono uppercase tracking-[0.2em]">Awaiting Instruction</p>
                  <p className="text-[10px] italic">"Ask about protocol drift, entropy thresholds, or rekey policy."</p>
                </div>
              </div>
            )}

            <AnimatePresence initial={false}>
              {activeSteps.map((step, i) => {
                const info = getAgentInfo(step.agent);
                return (
                  <motion.div 
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex flex-col gap-3 group"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-xl ${info.bg} ${info.color}`}>
                        <info.icon size={16} />
                      </div>
                      <div className="flex flex-col">
                        <span className={`text-[10px] font-black font-mono uppercase tracking-widest ${info.color}`}>
                          {step.agent}
                        </span>
                        <span className="text-[9px] text-[#454545] font-mono">
                          {new Date(step.timestamp).toLocaleTimeString()}
                        </span>
                      </div>
                    </div>
                    
                    <div className="pl-12 flex flex-col gap-2">
                      <p className="text-white/90 leading-relaxed font-sans text-[13px] border-l-2 border-white/5 pl-4 transition-colors group-hover:border-quantum-primary/20">
                        {step.thought}
                      </p>
                      {step.action && (
                        <div className="flex items-center gap-2 bg-white/5 p-2 rounded-lg border border-white/10 w-fit">
                          <Activity size={10} className="text-quantum-primary" />
                          <span className="text-[10px] font-mono text-quantum-primary uppercase font-bold tracking-tighter">Action: {step.action}</span>
                        </div>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>

            {lastResponse && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-8 bg-quantum-primary/5 border border-quantum-primary/20 rounded-[2rem] p-8 relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 p-6 opacity-5 rotate-12">
                  <Sparkles size={120} className="text-quantum-primary" strokeWidth={1} />
                </div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-quantum-primary text-black p-1 rounded-lg">
                    <Shield size={14} />
                  </div>
                  <span className="text-xs font-black uppercase tracking-widest text-quantum-primary italic">Synthesis Complete</span>
                </div>
                <div className="text-white text-base leading-relaxed relative z-10 font-bold tracking-tight">
                  {lastResponse}
                </div>
              </motion.div>
            )}

            {isOrchestrating && (
              <div className="flex items-center gap-3 pl-4 opacity-50">
                <RefreshCw size={14} className="animate-spin text-quantum-primary" />
                <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-quantum-primary animate-pulse">Next Agent responding...</span>
              </div>
            )}
          </div>

          <div className="p-4 bg-quantum-panel/50 border-t border-quantum-border relative z-10">
            <form onSubmit={handleSubmit} className="relative group">
              <input 
                type="text" 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                disabled={isOrchestrating}
                className="w-full bg-quantum-bg/50 border border-quantum-border rounded-2xl pl-12 pr-24 py-4 text-sm focus:border-quantum-primary/50 outline-none transition-all placeholder:text-[#454545] font-sans group-hover:border-quantum-border/80"
                placeholder="Instruct Intelligence Core..."
              />
              <Search size={16} className="absolute left-5 top-1/2 -translate-y-1/2 text-[#454545] group-focus-within:text-quantum-primary transition-colors" />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
                <span className="text-[9px] font-mono text-[#454545] uppercase tracking-widest mr-2 group-focus-within:opacity-0 transition-opacity">Shift + Enter</span>
                <button 
                  type="submit"
                  disabled={!input.trim() || isOrchestrating}
                  className="bg-quantum-primary text-black p-2 rounded-xl hover:shadow-quantum transition-all disabled:opacity-30"
                >
                  <Send size={16} />
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Memory & Sidebar Section */}
      <div className="flex flex-col gap-6">
        <div className="bg-quantum-panel border border-quantum-border rounded-2xl flex flex-col h-1/2 relative glass overflow-hidden">
          <div className="p-4 border-b border-quantum-border flex items-center justify-between bg-quantum-panel/50 backdrop-blur-sm">
            <div className="flex items-center gap-3">
              <Database size={16} className="text-quantum-primary" />
              <span className="text-[10px] font-bold font-mono uppercase tracking-[0.2em] text-white">Memory Bank</span>
            </div>
            <span className="text-[9px] font-mono text-[#454545] bg-white/5 px-2 py-0.5 rounded text-white">{memories.length} / 50</span>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-4 terminal-scroll">
            {memories.map((m) => (
              <div key={m.id} className="bg-white/[0.03] border border-white/5 rounded-xl p-3 hover:border-quantum-primary/20 transition-all group">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[8px] font-bold font-mono uppercase tracking-widest bg-quantum-primary/10 text-quantum-primary px-1.5 py-0.5 rounded">
                    {m.relevance}
                  </span>
                  <span className="text-[8px] text-[#454545] font-mono">{new Date(m.timestamp).toLocaleDateString()}</span>
                </div>
                <p className="text-[11px] text-[#8E9299] leading-relaxed italic group-hover:text-white transition-colors">"{m.content}"</p>
              </div>
            ))}
            {memories.length === 0 && (
              <div className="h-full flex flex-col items-center justify-center opacity-20 text-center gap-2 mt-8">
                <Database size={24} className="text-[#8E9299]" />
                <p className="text-[9px] font-mono uppercase tracking-widest">Storage Empty</p>
              </div>
            )}
          </div>
        </div>

        <div className="bg-quantum-panel border border-quantum-border rounded-2xl flex flex-col h-1/2 relative glass overflow-hidden">
          <div className="p-4 border-b border-quantum-border flex items-center justify-between bg-quantum-panel/50 backdrop-blur-sm">
            <div className="flex items-center gap-3">
              <History size={16} className="text-amber-400" />
              <span className="text-[10px] font-bold font-mono uppercase tracking-[0.2em] text-white">Operational History</span>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto p-4 terminal-scroll space-y-3">
            {[
              { id: 1, event: "REKEY_INITIATED", status: "SUCCESS", time: "10m ago" },
              { id: 2, event: "TELEMETRY_SCAN", status: "NOMINAL", time: "22m ago" },
              { id: 3, event: "CORE_REBOOT", status: "SYSTEM", time: "1h ago" },
              { id: 4, event: "MEMORY_FLUSH", status: "CLEAN", time: "2h ago" },
            ].map(log => (
              <div key={log.id} className="flex items-center justify-between p-2 rounded-lg hover:bg-white/5 transition-colors border-l-2 border-transparent hover:border-amber-400/30">
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold text-white/80">{log.event}</span>
                  <span className="text-[8px] font-mono text-[#454545]">{log.time}</span>
                </div>
                <span className={`text-[8px] font-bold font-mono ${log.status === 'SUCCESS' ? 'text-quantum-primary' : 'text-[#454545]'}`}>
                  {log.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgentIntelligenceCenter;

// Simple decorative component
const Sparkles = ({ size, className, strokeWidth }: { size: number, className?: string, strokeWidth?: number }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth={strokeWidth || 2} 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="M12 3v3m0 12v3M3 12h3m12 0h3M5.6 5.6l2.1 2.1m8.6 8.6l2.1 2.1M5.6 18.4l2.1-2.1m8.6-8.6l2.1-2.1" />
  </svg>
);
