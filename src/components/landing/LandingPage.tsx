import React, { useState, useEffect, useRef } from "react";
import { 
  Zap, 
  ShieldCheck, 
  Brain, 
  ArrowRight, 
  Play, 
  Activity, 
  ShieldAlert,
  Search,
  Lock,
  Shield
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import QkdDemo from "./QkdDemo";

interface LandingPageProps {
  onEnterDashboard: () => void;
}

const LandingPage = ({ onEnterDashboard }: LandingPageProps) => {
  const [showDemo, setShowDemo] = useState(false);

  return (
    <div className="min-h-screen bg-quantum-bg text-white font-sans selection:bg-quantum-primary selection:text-black relative overflow-hidden">
      <div className="scanline opacity-20" />
      <div className="absolute inset-0 grid-bg opacity-[0.05] pointer-events-none" />

      {/* Hero Section */}
      <section className="relative pt-32 pb-32 px-6 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[800px] bg-[radial-gradient(circle_at_center,rgba(0,255,156,0.08)_0%,transparent_70%)] pointer-events-none" />
        
        <div className="max-w-6xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-quantum-primary/5 border border-quantum-primary/20 text-quantum-primary text-[10px] font-bold font-mono uppercase tracking-[0.2em] mb-12 shadow-[0_0_20px_rgba(0,255,156,0.1)]"
            >
              <Zap size={12} className="animate-pulse" />
              <span>Quantum Intelligence Suite v2.0</span>
            </motion.div>
            
            <h1 className="text-6xl md:text-8xl font-black tracking-tighter mb-8 leading-[0.95] lg:leading-[0.9] text-white">
              <span className="italic">SECURE</span> TODAY.<br />
              <span className="text-quantum-primary italic">RESILIENT</span> FOREVER.
            </h1>
            
            <p className="text-lg md:text-2xl text-[#8E9299] max-w-3xl mx-auto mb-16 leading-relaxed font-medium tracking-tight">
              Autonomous Quantum Key Orchestration for secure infrastructure. 
              Built on agentic reasoning and optical handshakes.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-5">
              <button 
                onClick={onEnterDashboard}
                className="w-full sm:w-auto px-10 py-5 bg-quantum-primary text-black font-black rounded-2xl hover:shadow-quantum transition-all duration-300 flex items-center justify-center gap-3 group relative overflow-hidden text-sm uppercase tracking-tighter italic"
              >
                <div className="absolute inset-0 shimmer opacity-0 group-hover:opacity-100 transition-opacity" />
                <span>Initialize Suite</span>
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </button>
              <button 
                onClick={() => {
                  setShowDemo(true);
                  document.getElementById('interactive-demo')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="w-full sm:w-auto px-10 py-5 bg-quantum-panel border border-quantum-border text-white font-bold rounded-2xl hover:border-quantum-primary/40 hover:bg-quantum-border transition-all duration-300 flex items-center justify-center gap-3 text-sm uppercase tracking-tighter italic"
              >
                <div className="w-8 h-8 bg-white/5 rounded-lg flex items-center justify-center text-quantum-primary">
                  <Play size={14} fill="currentColor" />
                </div>
                Live Protocol
              </button>
            </div>
          </motion.div>
        </div>

        {/* Floating Elements Animation */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <motion.div 
            animate={{ 
              y: [0, -20, 0],
              opacity: [0.1, 0.2, 0.1]
            }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-quantum-primary rounded-full blur-[150px]" 
          />
          <motion.div 
            animate={{ 
              y: [0, 20, 0],
              opacity: [0.05, 0.1, 0.05]
            }}
            transition={{ duration: 15, repeat: Infinity, ease: "easeInOut", delay: 2 }}
            className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-emerald-500 rounded-full blur-[150px]" 
          />
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-32 px-6 bg-quantum-panel/30 border-y border-quantum-border relative overflow-hidden backdrop-blur-3xl">
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
            <FeatureCard 
              icon={ShieldCheck} 
              title="Quantum Secrecy" 
              description="Information-theoretic security via continuous BB84 key distribution, resisting future computational exploits."
            />
            <FeatureCard 
              icon={Brain} 
              title="Agentic Reasoning" 
              description="Gemini-powered supervisor agents monitor QBER telemetry and trigger rekeys autonomously when threats emerge."
            />
            <FeatureCard 
              icon={Zap} 
              title="Ultra-Low Latency" 
              description="Proprietary LDPC post-processing and pipelining ensure <100ms handshakes across global optical networks."
            />
          </div>
        </div>
      </section>

      {/* Interactive Demo Section */}
      <section id="interactive-demo" className="py-32 px-4 bg-quantum-bg relative overflow-hidden">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-4 tracking-tight">Interactive Simulation</h2>
            <p className="text-[#8E9299] max-w-xl mx-auto">
              Inject threats into the quantum channel and watch the FALLOUT agent maintain the trust baseline.
            </p>
          </div>
          <QkdDemo />
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 border-t border-quantum-border bg-quantum-panel/30">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-quantum-primary rounded-lg flex items-center justify-center text-black">
              <Shield size={18} />
            </div>
            <span className="font-bold tracking-tight text-xl">FALLOUT</span>
          </div>
          <div className="flex gap-8 text-sm font-mono text-[#8E9299] uppercase tracking-wider">
            <a href="#" className="hover:text-quantum-primary transition-colors">Documentation</a>
            <a href="#" className="hover:text-quantum-primary transition-colors">Architecture</a>
            <a href="#" className="hover:text-quantum-primary transition-colors">Enterprise</a>
          </div>
          <div className="text-xs text-[#454545] font-mono">
            &copy; 2026 FALLOUT LABS. ALL QUANTUM RIGHTS RESERVED.
          </div>
        </div>
      </footer>
    </div>
  );
};

const FeatureCard = ({ icon: Icon, title, description }: any) => (
  <div className="bg-quantum-panel border border-quantum-border p-8 rounded-2xl group hover:border-quantum-primary/50 transition-all duration-300">
    <div className="w-12 h-12 bg-quantum-primary/10 rounded-xl flex items-center justify-center text-quantum-primary mb-6 group-hover:scale-110 transition-transform">
      <Icon size={24} />
    </div>
    <h3 className="text-xl font-bold mb-3">{title}</h3>
    <p className="text-[#8E9299] leading-relaxed font-light text-sm">
      {description}
    </p>
  </div>
);

export default LandingPage;
