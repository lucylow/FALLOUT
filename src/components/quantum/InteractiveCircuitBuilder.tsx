import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Plus, 
  Trash2, 
  Play, 
  Cpu, 
  Sparkles, 
  Shield, 
  Zap,
  Info
} from "lucide-react";

interface Gate {
  id: string;
  type: string;
  qubit: number;
}

const GATE_TYPES = [
  { id: 'H', label: 'Hadamard', icon: Sparkles, color: 'text-cyan-400', bg: 'bg-cyan-500/10' },
  { id: 'X', label: 'Pauli-X', icon: Zap, color: 'text-purple-400', bg: 'bg-purple-500/10' },
  { id: 'Z', label: 'Pauli-Z', icon: Shield, color: 'text-blue-400', bg: 'bg-blue-500/10' },
  { id: 'M', label: 'Measure', icon: Cpu, color: 'text-quantum-primary', bg: 'bg-quantum-primary/10' },
];

const InteractiveCircuitBuilder = () => {
  const [gates, setGates] = useState<Gate[]>([]);
  const [selectedGateType, setSelectedGateType] = useState('H');
  const nQubits = 4;

  const addGate = (qubit: number) => {
    const newGate: Gate = {
      id: Math.random().toString(36).substr(2, 9),
      type: selectedGateType,
      qubit
    };
    setGates([...gates, newGate]);
  };

  const removeGate = (id: string) => {
    setGates(gates.filter(g => g.id !== id));
  };

  const clearCircuit = () => setGates([]);

  return (
    <div className="bg-quantum-panel border border-quantum-border rounded-2xl overflow-hidden glass shadow-2xl p-6 relative">
      <div className="absolute inset-0 grid-bg opacity-[0.03] pointer-events-none" />
      
      <div className="flex flex-col gap-8 relative z-10">
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-1">
            <h3 className="text-xl font-bold tracking-tighter text-white italic">Protocol Lab</h3>
            <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#8E9299]">Manual State Vector Composition</p>
          </div>
          
          <div className="flex items-center gap-2">
            <button 
              onClick={clearCircuit}
              className="p-2 hover:bg-quantum-danger/10 hover:text-quantum-danger rounded-xl transition-all border border-transparent hover:border-quantum-danger/20"
            >
              <Trash2 size={16} />
            </button>
            <button className="flex items-center gap-2 bg-quantum-primary text-black px-4 py-2 rounded-xl font-bold text-xs uppercase italic group">
              <Play size={14} fill="black" className="group-hover:scale-110 transition-transform" />
              <span>Simulate Protocol</span>
            </button>
          </div>
        </div>

        {/* Gate Library */}
        <div className="flex gap-3">
          {GATE_TYPES.map(type => (
            <button
              key={type.id}
              onClick={() => setSelectedGateType(type.id)}
              className={`flex items-center gap-3 px-4 py-3 rounded-2xl transition-all border ${
                selectedGateType === type.id 
                  ? `border-quantum-primary/40 ${type.bg} shadow-quantum` 
                  : 'border-quantum-border bg-quantum-bg/50 hover:border-quantum-border/80'
              }`}
            >
              <type.icon size={16} className={type.color} />
              <div className="flex flex-col items-start translate-y-[-1px]">
                <span className={`text-[11px] font-bold ${selectedGateType === type.id ? 'text-white' : 'text-[#8E9299]'}`}>
                  {type.label}
                </span>
                <span className="text-[8px] font-mono uppercase tracking-widest text-[#454545]">{type.id}-Gate</span>
              </div>
            </button>
          ))}
        </div>

        {/* Builder View */}
        <div className="bg-quantum-bg border border-quantum-border rounded-2xl p-8 min-h-[280px] flex flex-col justify-between">
          <div className="space-y-12">
            {Array.from({ length: nQubits }).map((_, i) => (
              <div key={i} className="relative group">
                {/* Wire */}
                <div className="absolute top-1/2 left-0 w-full h-[1px] bg-quantum-border group-hover:bg-quantum-primary/20 transition-colors" />
                <div className="absolute top-1/2 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-quantum-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                
                <div className="relative flex items-center gap-8 translate-y-[-15px]">
                  <span className="text-[10px] font-mono font-bold text-[#454545] w-8">q[{i}]</span>
                  
                  <div className="flex items-center gap-4 flex-1">
                    <AnimatePresence>
                      {gates.filter(g => g.qubit === i).map((gate) => {
                        const typeInfo = GATE_TYPES.find(t => t.id === gate.type);
                        return (
                          <motion.button
                            key={gate.id}
                            initial={{ scale: 0, x: -20, opacity: 0 }}
                            animate={{ scale: 1, x: 0, opacity: 1 }}
                            exit={{ scale: 0, opacity: 0 }}
                            whileHover={{ y: -2 }}
                            onClick={() => removeGate(gate.id)}
                            className={`w-10 h-10 rounded-xl border flex items-center justify-center font-mono font-black text-xs ${typeInfo?.bg} ${typeInfo?.color} border-current/20 shadow-lg relative group/gate`}
                          >
                            {gate.type}
                            <div className="absolute -top-1 -right-1 opacity-0 group-hover/gate:opacity-100 transition-opacity">
                              <div className="bg-quantum-danger rounded-full p-0.5 text-white">
                                <Trash2 size={8} strokeWidth={3} />
                              </div>
                            </div>
                          </motion.button>
                        );
                      })}
                    </AnimatePresence>
                    
                    <button 
                      onClick={() => addGate(i)}
                      className="w-10 h-10 border border-dashed border-quantum-border rounded-xl flex items-center justify-center text-[#454545] hover:border-quantum-primary/50 hover:text-quantum-primary transition-all hover:bg-quantum-primary/5"
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2 px-2">
          <Info size={12} className="text-[#454545]" />
          <p className="text-[9px] font-mono text-[#8E9299] uppercase tracking-widest leading-none">
            Compose your custom topology. The re-authentication engine will automatically mirror this configuration.
          </p>
        </div>
      </div>
    </div>
  );
};

export default InteractiveCircuitBuilder;
