import React, { useRef, useEffect } from "react";
import { Terminal as TerminalIcon, ChevronRight, Hash } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { AuditEntry } from "../../types";

interface TerminalProps {
  logs: AuditEntry[];
}

const Terminal = ({ logs }: TerminalProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [logs]);

  return (
    <div className="bg-quantum-panel border border-quantum-border rounded-2xl flex flex-col h-[420px] overflow-hidden shadow-2xl relative">
      <div className="absolute inset-0 grid-bg opacity-10 pointer-events-none" />
      
      <div className="p-4 border-b border-quantum-border flex items-center gap-2 justify-between bg-quantum-panel/50 backdrop-blur-sm relative z-10">
        <div className="flex items-center gap-3">
          <div className="p-1.5 bg-quantum-primary text-black rounded-lg">
            <TerminalIcon size={12} />
          </div>
          <span className="text-[10px] font-bold font-mono uppercase tracking-[0.2em] text-white">Security Orchestration</span>
        </div>
        <div className="flex gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-quantum-border" />
          <div className="w-2.5 h-2.5 rounded-full bg-quantum-border" />
        </div>
      </div>

      <div 
        ref={scrollRef} 
        className="p-5 overflow-y-auto terminal-scroll font-mono text-[11px] flex flex-col gap-4 flex-1 relative z-10"
      >
        <AnimatePresence initial={false}>
          {logs.map((log, i) => (
            <motion.div 
              key={log.timestamp + i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex flex-col gap-1.5 group"
            >
              <div className="flex items-center gap-2 opacity-30 group-hover:opacity-60 transition-opacity">
                <Hash size={10} className="text-quantum-primary" />
                <span>{new Date(log.timestamp).toLocaleTimeString([], { hour12: false })}</span>
                <span className="mx-1">/</span>
                <span className={`font-bold tracking-widest uppercase ${log.decision.includes("REKEY") ? "text-quantum-primary" : "text-amber-500"}`}>
                  {log.decision}
                </span>
              </div>
              
              <div className="flex gap-3">
                <ChevronRight size={14} className="mt-0.5 shrink-0 text-quantum-primary opacity-40 group-hover:opacity-100 transition-opacity" />
                <div className="flex flex-col gap-2">
                  <p className="leading-relaxed text-white/90">
                    <span className="italic">"{(log.reason || "System baseline established.").substring(0, 150)}"</span>
                  </p>
                  
                  {log.newKeyId && (
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="bg-white/[0.03] border border-white/5 rounded-lg p-2 flex items-center gap-3"
                    >
                      <div className="flex flex-col gap-0.5">
                        <span className="text-[8px] uppercase tracking-tighter text-[#454545]">Quantum Anchor</span>
                        <span className="text-quantum-primary font-bold">{log.newKeyId}</span>
                      </div>
                      <div className="w-px h-6 bg-white/10" />
                      <div className="flex flex-col gap-0.5">
                        <span className="text-[8px] uppercase tracking-tighter text-[#454545]">Decoherence</span>
                        <span className="text-white">{(log.qber! * 100).toFixed(3)}%</span>
                      </div>
                    </motion.div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        
        {logs.length === 0 && (
          <div className="text-[#8E9299] font-mono text-[10px] uppercase tracking-widest animate-pulse h-full flex items-center justify-center">
            Initializing secure socket...
          </div>
        )}
      </div>
      
      <div className="p-3 bg-quantum-bg/50 border-t border-quantum-border flex items-center justify-between pointer-events-none relative z-10">
        <span className="text-[9px] font-mono text-[#454545] uppercase tracking-widest">Buffer: 1024kb</span>
        <div className="flex items-center gap-2">
          <div className="w-1 h-3 bg-quantum-primary animate-[pulse_1s_infinite]" />
        </div>
      </div>
    </div>
  );
};

export default Terminal;
