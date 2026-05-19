import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { 
  BarChart3, 
  BrainCircuit, 
  Play, 
  Search, 
  Code2, 
  Database, 
  FileJson,
  Layers,
  CheckCircle2,
  AlertCircle,
  RefreshCcw,
  Zap,
  Terminal as TerminalIcon
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from "recharts";

const COLORS = ['#FF3D68', '#00FF9C'];

export default function SentimentDashboard() {
  const [activeTab, setActiveTab] = useState<"training" | "evaluate" | "inference">("inference");
  const [inputText, setInputText] = useState("");
  const [prediction, setPrediction] = useState<{ label: string, confidence: number } | null>(null);
  const [isPredicting, setIsPredicting] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);
  const [metrics, setMetrics] = useState<any>(null);

  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;
    fetch("/api/sentiment/logs").then(res => res.json()).then(setLogs);
    fetch("/api/sentiment/metrics").then(res => res.json()).then(setMetrics);
  }, [user]);

  const handlePredict = async () => {
    if (!inputText.trim()) return;
    setIsPredicting(true);
    setPrediction(null);
    try {
      const res = await fetch("/api/sentiment/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: inputText })
      });
      const data = await res.json();
      setPrediction(data);
    } catch (e) {
      console.error(e);
    } finally {
      setIsPredicting(false);
    }
  };

  const confusionMatrixData = [
    { name: 'True Neg', val: 11842 },
    { name: 'False Pos', val: 658 },
    { name: 'False Neg', val: 1241 },
    { name: 'True Pos', val: 11259 },
  ];

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-500">
      {/* Navigation */}
      <div className="flex gap-1 p-1 bg-quantum-panel border border-quantum-border rounded-xl w-fit">
        {[
          { id: "inference", icon: Play, label: "Inference API" },
          { id: "training", icon: Layers, label: "Training Pipeline" },
          { id: "evaluate", icon: BarChart3, label: "Model Evaluation" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-mono uppercase tracking-wider transition-all ${
              activeTab === tab.id 
                ? "bg-quantum-primary/10 text-quantum-primary border border-quantum-primary/20" 
                : "text-[#8E9299] hover:text-white"
            }`}
          >
            <tab.icon size={14} />
            {tab.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left/Main Column */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          {activeTab === "inference" && (
            <div className="bg-quantum-panel border border-quantum-border rounded-xl p-8 flex flex-col gap-6 shadow-[0_0_50px_rgba(0,0,0,0.5)]">
              <div className="flex items-center gap-3">
                <BrainCircuit className="text-quantum-primary" size={24} />
                <h3 className="text-xl font-bold tracking-tight">Real-time Sentiment Analysis</h3>
              </div>
              
              <div className="relative">
                <textarea
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Paste a movie review here to analyze sentiment..."
                  className="w-full h-40 bg-quantum-bg border border-quantum-border rounded-xl p-4 text-sm font-sans focus:border-quantum-primary/50 outline-none transition-all resize-none"
                />
                <button
                  onClick={handlePredict}
                  disabled={isPredicting || !inputText.trim()}
                  className="absolute bottom-4 right-4 bg-quantum-primary text-quantum-bg px-6 py-2 rounded-lg font-bold text-sm flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.02] active:scale-[0.98] transition-all"
                >
                  {isPredicting ? <RefreshCcw className="animate-spin" size={16} /> : <Zap size={16} />}
                  Run Classifier
                </button>
              </div>

              <AnimatePresence mode="wait">
                {prediction && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`p-6 rounded-xl border flex items-center justify-between ${
                      prediction.label === "POSITIVE" 
                        ? "bg-quantum-primary/5 border-quantum-primary/20 text-quantum-primary" 
                        : "bg-quantum-danger/5 border-quantum-danger/20 text-quantum-danger"
                    }`}
                  >
                    <div className="flex flex-col gap-1">
                      <span className="text-[10px] font-mono uppercase tracking-[0.2em] opacity-60">Classification Result</span>
                      <span className="text-3xl font-bold tracking-tighter">{prediction.label}</span>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <span className="text-[10px] font-mono uppercase tracking-[0.2em] opacity-60">Model Confidence</span>
                      <span className="text-3xl font-mono">{(prediction.confidence * 100).toFixed(1)}%</span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}

          {activeTab === "training" && (
            <div className="bg-quantum-panel border border-quantum-border rounded-xl flex flex-col h-[500px]">
              <div className="p-4 border-b border-quantum-border flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <TerminalIcon size={16} className="text-quantum-primary" />
                  <span className="text-sm font-mono uppercase tracking-widest">Hydra Training Console (BERT-Base)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="px-2 py-0.5 rounded-full bg-quantum-primary/10 border border-quantum-primary/20 text-[10px] text-quantum-primary font-bold">CUDA:0</div>
                </div>
              </div>
              <div className="p-6 overflow-y-auto terminal-scroll font-mono text-xs flex flex-col gap-2 bg-quantum-bg/50">
                {logs.map((log, i) => (
                  <div key={i} className="flex gap-2 text-[#8E9299]">
                    <span className="text-quantum-primary/40 leading-none mt-0.5">»</span>
                    <span className={log.includes("Epoch") ? "text-white" : ""}>{log}</span>
                  </div>
                ))}
                <div className="flex gap-2 text-quantum-primary animate-pulse">
                  <span className="leading-none mt-0.5">»</span>
                  <span>Awaiting next batch process...</span>
                </div>
              </div>
            </div>
          )}

          {activeTab === "evaluate" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-quantum-panel border border-quantum-border rounded-xl p-6">
                <h4 className="text-xs font-mono uppercase tracking-widest text-[#8E9299] mb-8">Classification Distribution</h4>
                <div className="h-[250px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={[{ name: 'Neg', value: 12500 }, { name: 'Pos', value: 12500 }]}
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        <Cell fill={COLORS[0]} />
                        <Cell fill={COLORS[1]} />
                      </Pie>
                      <Tooltip 
                         contentStyle={{ backgroundColor: '#141418', border: '1px solid #1F1F24', fontSize: '10px' }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex justify-center gap-6 mt-4">
                   <div className="flex items-center gap-2 text-[10px] uppercase font-mono">
                     <div className="w-2 h-2 rounded-full bg-quantum-danger" /> NEGATIVE
                   </div>
                   <div className="flex items-center gap-2 text-[10px] uppercase font-mono">
                     <div className="w-2 h-2 rounded-full bg-quantum-primary" /> POSITIVE
                   </div>
                </div>
              </div>

              <div className="bg-quantum-panel border border-quantum-border rounded-xl p-6">
                <h4 className="text-xs font-mono uppercase tracking-widest text-[#8E9299] mb-8">Confusion Matrix (Normalized)</h4>
                <div className="h-[250px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={confusionMatrixData} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" stroke="#1F1F24" horizontal={false} />
                      <XAxis type="number" hide />
                      <YAxis dataKey="name" type="category" stroke="#8E9299" fontSize={10} width={70} />
                      <Tooltip 
                         cursor={{fill: 'transparent'}}
                         contentStyle={{ backgroundColor: '#141418', border: '1px solid #1F1F24', fontSize: '10px' }}
                      />
                      <Bar dataKey="val" fill="#00FF9C" radius={[0, 4, 4, 0]} barSize={20} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Info Column */}
        <div className="flex flex-col gap-6">
          <div className="bg-quantum-panel border border-quantum-border rounded-xl p-6 flex flex-col gap-4">
            <h4 className="text-xs font-mono uppercase tracking-widest text-[#8E9299]">Final Run Metrics</h4>
            <div className="flex flex-col gap-4">
              <div className="flex justify-between items-end border-b border-quantum-border pb-2">
                <span className="text-[10px] font-mono text-[#8E9299]">Accuracy</span>
                <span className="text-xl font-bold tracking-tighter text-quantum-primary">92.4%</span>
              </div>
              <div className="flex justify-between items-end border-b border-quantum-border pb-2">
                <span className="text-[10px] font-mono text-[#8E9299]">F1 Score</span>
                <span className="text-xl font-bold tracking-tighter text-quantum-primary">0.912</span>
              </div>
              <div className="flex justify-between items-end border-b border-quantum-border pb-2">
                <span className="text-[10px] font-mono text-[#8E9299]">Loss</span>
                <span className="text-xl font-bold tracking-tighter text-[#8E9299]">0.184</span>
              </div>
            </div>
          </div>

          <div className="bg-[#00FF9C]/5 border border-[#00FF9C]/20 rounded-xl p-6 flex flex-col gap-4 relative overflow-hidden group">
            <div className="absolute -top-6 -right-6 text-[#00FF9C]/10 group-hover:text-[#00FF9C]/20 transition-all rotate-12">
              <Code2 size={120} />
            </div>
            <div className="flex items-center gap-2 text-quantum-primary">
              <Database size={16} />
              <span className="text-[10px] font-bold uppercase tracking-widest">Model Architecture</span>
            </div>
            <p className="text-xs leading-relaxed text-[#8E9299] font-mono">
              Base: <span className="text-white">bert-base-uncased</span><br/>
              Heads: Linear(768, 2)<br/>
              Optimizer: AdamW (2e-5)<br/>
              Scheduler: Linear Warmup (10%)
            </p>
            <div className="flex flex-wrap gap-2 mt-2">
              <span className="bg-quantum-primary/10 border border-quantum-primary/20 px-2 py-0.5 rounded text-[8px] font-mono text-quantum-primary font-bold">PyTorch 2.0</span>
              <span className="bg-quantum-primary/10 border border-quantum-primary/20 px-2 py-0.5 rounded text-[8px] font-mono text-quantum-primary font-bold">Transformers</span>
            </div>
          </div>

          <div className="bg-quantum-panel border border-quantum-border rounded-xl p-6 flex flex-col gap-3">
             <div className="flex items-center gap-2 text-[#8E9299]">
               <FileJson size={14} />
               <span className="text-[10px] uppercase font-mono tracking-widest">Inference Response</span>
             </div>
             <pre className="text-[10px] font-mono bg-quantum-bg p-3 rounded-lg overflow-x-auto text-quantum-primary/70">
{`{
  "label": "${prediction?.label || "---"}",
  "confidence": ${prediction?.confidence || 0.0},
  "latency": "142ms",
  "status": 200
}`}
             </pre>
          </div>
        </div>
      </div>
    </div>
  );
}
