import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  ZoomIn, 
  ZoomOut, 
  RefreshCw, 
  Download, 
  Settings as SettingsIcon,
  Activity,
  Cpu,
  Layers
} from "lucide-react";
import { generateBB84Model, CircuitModel, QuantumGate } from "../../lib/quantumViz";
import { KeyStatus } from "../../types";

interface QuantumCircuitDiagramProps {
  keyStatus: KeyStatus | null;
  className?: string;
}

const GATE_COLORS: Record<string, string> = {
  H: "bg-cyan-500/20 text-cyan-400 border-cyan-500/30",
  X: "bg-purple-500/20 text-purple-400 border-purple-500/30",
  Z: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  M: "bg-quantum-primary/20 text-quantum-primary border-quantum-primary/30",
  ID: "bg-gray-800 text-gray-400 border-gray-700"
};

const QuantumCircuitDiagram = ({ keyStatus, className = "" }: QuantumCircuitDiagramProps) => {
  const [model, setModel] = useState<CircuitModel>(generateBB84Model(keyStatus));
  const [zoom, setZoom] = useState(1);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (keyStatus) {
      handleRefresh();
    }
  }, [keyStatus?.keyId]);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setModel(generateBB84Model(keyStatus));
      setIsRefreshing(false);
    }, 600);
  };

  const handleDownload = () => {
    const svg = document.getElementById("quantum-circuit-svg");
    if (!svg) return;
    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();
    img.onload = () => {
      canvas.width = img.width * 2;
      canvas.height = img.height * 2;
      ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);
      const url = canvas.toDataURL("image/png");
      const a = document.createElement("a");
      a.download = `fallout_circuit_${Date.now()}.png`;
      a.href = url;
      a.click();
    };
    img.src = "data:image/svg+xml;base64," + btoa(svgData);
  };

  const rowHeight = 60;
  const colWidth = 80;
  const startX = 100;
  const totalWidth = 600;

  return (
    <div className={`bg-quantum-panel border border-quantum-border rounded-2xl overflow-hidden glass shadow-2xl ${className}`}>
      <div className="absolute inset-0 grid-bg opacity-10 pointer-events-none" />
      
      {/* Header */}
      <div className="p-4 border-b border-quantum-border flex items-center justify-between relative z-10 bg-quantum-panel/50 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <div className="p-1.5 bg-quantum-primary/10 text-quantum-primary rounded-lg">
            <Activity size={14} />
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] font-bold font-mono uppercase tracking-[0.2em] text-[#8E9299]">/ Protocol Vis</span>
            <span className="text-sm font-bold text-white">Quantum Handshake Topology</span>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setZoom(prev => Math.max(0.5, prev - 0.1))}
            className="p-1.5 hover:bg-white/5 rounded-lg text-[#8E9299] transition-colors"
          >
            <ZoomOut size={14} />
          </button>
          <span className="text-[10px] font-mono text-[#454545] w-8 text-center">{Math.round(zoom * 100)}%</span>
          <button 
            onClick={() => setZoom(prev => Math.min(2, prev + 0.1))}
            className="p-1.5 hover:bg-white/5 rounded-lg text-[#8E9299] transition-colors"
          >
            <ZoomIn size={14} />
          </button>
          <div className="w-px h-4 bg-quantum-border mx-1" />
          <button 
            onClick={handleRefresh}
            className={`p-1.5 hover:bg-white/5 rounded-lg text-[#8E9299] transition-colors ${isRefreshing ? 'animate-spin' : ''}`}
          >
            <RefreshCw size={14} />
          </button>
          <button 
            onClick={handleDownload}
            className="p-1.5 hover:bg-white/5 rounded-lg text-[#8E9299] transition-colors"
          >
            <Download size={14} />
          </button>
        </div>
      </div>

      <div 
        ref={containerRef}
        className="p-8 overflow-auto min-h-[300px] relative z-0 flex items-center justify-center terminal-scroll"
      >
        <AnimatePresence mode="wait">
          {isRefreshing ? (
            <motion.div 
              key="loader"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center gap-4 py-12"
            >
              <RefreshCw className="text-quantum-primary animate-spin" size={32} />
              <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-quantum-primary animate-pulse">Decoding State Vector...</span>
            </motion.div>
          ) : (
            <motion.div
              key="circuit"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: zoom }}
              transition={{ type: "spring", damping: 20 }}
              style={{ transformOrigin: "center center" }}
            >
              <svg 
                id="quantum-circuit-svg"
                width={totalWidth} 
                height={model.qubits * rowHeight + 40} 
                viewBox={`0 0 ${totalWidth} ${model.qubits * rowHeight + 40}`}
                className="overflow-visible"
              >
                {/* Qubit labels and Lines */}
                {Array.from({ length: model.qubits }).map((_, i) => (
                  <g key={`qubit-${i}`}>
                    <text 
                      x={20} 
                      y={i * rowHeight + 45} 
                      className="fill-[#454545] font-mono text-[10px] font-bold"
                    >
                      ψ[{i}]
                    </text>
                    <line 
                      x1={startX} 
                      y1={i * rowHeight + 40} 
                      x2={totalWidth - 40} 
                      y2={i * rowHeight + 40} 
                      stroke="rgba(255,255,255,0.05)" 
                      strokeWidth="1.5"
                    />
                    <line 
                      x1={startX} 
                      y1={i * rowHeight + 40} 
                      x2={totalWidth - 40} 
                      y2={i * rowHeight + 40} 
                      stroke="url(#wire-gradient)" 
                      strokeWidth="1"
                      strokeDasharray="4 4"
                    />
                  </g>
                ))}

                <defs>
                  <linearGradient id="wire-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="rgba(0, 255, 156, 0.1)" />
                    <stop offset="50%" stopColor="rgba(0, 255, 156, 0.4)" />
                    <stop offset="100%" stopColor="rgba(0, 255, 156, 0.1)" />
                  </linearGradient>
                </defs>

                {/* Gates */}
                {model.gates.map((gate, idx) => {
                  const x = startX + gate.position * colWidth + 20;
                  const y = gate.qubit * rowHeight + 40;
                  return (
                    <g key={`${gate.type}-${idx}`}>
                      <rect 
                        x={x - 15} 
                        y={y - 15} 
                        width={30} 
                        height={30} 
                        rx={6}
                        className={`fill-quantum-panel stroke-current ${GATE_COLORS[gate.type].split(' ')[2]}`}
                        strokeWidth="1.5"
                      />
                      <text 
                        x={x} 
                        y={y + 4} 
                        textAnchor="middle" 
                        className={`font-mono font-black text-xs ${GATE_COLORS[gate.type].split(' ')[1]}`}
                      >
                        {gate.type}
                      </text>
                    </g>
                  );
                })}
              </svg>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="p-4 bg-quantum-bg/50 border-t border-quantum-border flex items-center justify-between">
        <div className="flex gap-4">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded bg-cyan-500/50 shadow-[0_0_5px_cyan]" />
            <span className="text-[9px] font-mono text-[#8E9299] uppercase tracking-tighter">Hadamard</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded bg-purple-500/50 shadow-[0_0_5px_purple]" />
            <span className="text-[9px] font-mono text-[#8E9299] uppercase tracking-tighter">Pauli-X</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded bg-quantum-primary/50 shadow-[0_0_5px_lime]" />
            <span className="text-[9px] font-mono text-[#8E9299] uppercase tracking-tighter">Measure</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Layers size={10} className="text-[#454545]" />
          <span className="text-[9px] font-mono text-[#454545] uppercase tracking-widest leading-none">Depth: 128Q</span>
        </div>
      </div>
    </div>
  );
};

export default QuantumCircuitDiagram;
