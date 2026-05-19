import React, { useState, useEffect } from "react";
import { Search, Zap, Shield, Cpu, History, Command } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface CommandPaletteProps {
  onNavigate: (id: any) => void;
  isOpen: boolean;
  onClose: () => void;
}

const CommandPalette = ({ onNavigate, isOpen, onClose }: CommandPaletteProps) => {
  const [query, setQuery] = useState("");

  const commands = [
    { id: "landing", label: "Navigate to Home", icon: Zap },
    { id: "fallout", label: "Quantum Dashboard", icon: Shield },
    { id: "sentiment", label: "AI Analysis", icon: Cpu },
    { id: "docs", label: "Blueprint Library", icon: History },
  ].filter(cmd => cmd.label.toLowerCase().includes(query.toLowerCase()));

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-32 px-4 bg-quantum-bg/80 backdrop-blur-sm animate-in fade-in duration-200">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: -20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="w-full max-w-xl bg-quantum-panel border border-quantum-border rounded-2xl shadow-2xl overflow-hidden"
      >
        <div className="p-4 border-b border-quantum-border flex items-center gap-3">
          <Search size={18} className="text-[#454545]" />
          <input 
            autoFocus
            type="text" 
            placeholder="Type a command or search..." 
            className="bg-transparent border-none outline-none flex-1 text-sm text-white"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <div className="flex items-center gap-1.5 px-2 py-1 bg-quantum-bg border border-quantum-border rounded text-[10px] text-[#8E9299]">
            <span className="font-mono">ESC</span>
          </div>
        </div>
        
        <div className="max-h-80 overflow-y-auto p-2">
          {commands.map((cmd) => (
            <button
              key={cmd.id}
              onClick={() => {
                onNavigate(cmd.id);
                onClose();
              }}
              className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-quantum-border transition-colors group"
            >
              <div className="flex items-center gap-4">
                <div className="p-2 bg-quantum-bg border border-quantum-border rounded-lg group-hover:text-quantum-primary transition-colors">
                  <cmd.icon size={18} />
                </div>
                <span className="text-sm font-medium">{cmd.label}</span>
              </div>
              <div className="text-[10px] font-mono text-[#454545] border border-quantum-border px-1.5 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                G + {cmd.id[0].toUpperCase()}
              </div>
            </button>
          ))}
          {commands.length === 0 && (
            <div className="p-8 text-center text-[#8E9299] text-xs italic">
              No matching commands found.
            </div>
          )}
        </div>
        
        <div className="p-4 bg-quantum-bg/50 border-t border-quantum-border flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1 text-[10px] text-[#454545]">
              <div className="bg-quantum-border px-1 rounded">↑↓</div>
              <span>Navigate</span>
            </div>
            <div className="flex items-center gap-1 text-[10px] text-[#454545]">
              <div className="bg-quantum-border px-1 rounded">↵</div>
              <span>Execute</span>
            </div>
          </div>
          <div className="flex items-center gap-2 text-[10px] text-quantum-primary/40 font-mono">
            <Command size={10} />
            <span>FALLOUT INTELLIGENCE SYSTEM</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default CommandPalette;
