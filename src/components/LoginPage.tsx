import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Shield, Lock, Cpu, Sparkles, Loader2 } from "lucide-react";
import { motion } from "motion/react";

const LoginPage = () => {
  const [email, setEmail] = useState("low.lucy@fallout.ai");
  const [password, setPassword] = useState("quantum2026");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(email, password);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-quantum-bg flex items-center justify-center p-6 relative overflow-hidden font-sans">
      <div className="scanline" />
      <div className="absolute inset-0 grid-bg opacity-20 pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(0,255,156,0.08),transparent_70%)] pointer-events-none" />
      
      {/* Decorative noise/particles simulated */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')] bg-repeat" />

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="w-full max-w-md relative z-10"
      >
        <div className="text-center mb-10">
          <motion.div 
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200 }}
            className="w-20 h-20 bg-quantum-primary/10 border border-quantum-primary/30 rounded-[2rem] flex items-center justify-center text-quantum-primary mx-auto mb-8 shadow-quantum animate-pulse"
          >
            <Shield size={38} strokeWidth={1.5} />
          </motion.div>
          <h1 className="text-4xl font-black tracking-tighter text-white mb-2 uppercase italic">Fallout</h1>
          <p className="text-[10px] font-bold font-mono uppercase tracking-[0.4em] text-[#8E9299] opacity-60">Autonomous Quantum Hub</p>
        </div>

        <div className="bg-quantum-panel/90 backdrop-blur-xl border border-quantum-border rounded-[2rem] p-10 shadow-2xl relative overflow-hidden glass">
          <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-right from-transparent via-quantum-primary to-transparent opacity-50" />
          
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-3">
              <label className="text-[10px] font-bold font-mono uppercase tracking-[0.2em] text-[#454545] block ml-1">Operator Signature</label>
              <div className="relative group">
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-quantum-bg/50 border border-quantum-border rounded-2xl px-12 py-4 text-sm focus:border-quantum-primary/50 outline-none transition-all placeholder:text-[#454545] font-mono group-hover:border-quantum-border/80"
                  placeholder="name@fallout.ai"
                  required
                />
                <Cpu size={16} className="absolute left-5 top-1/2 -translate-y-1/2 text-[#454545] group-focus-within:text-quantum-primary transition-colors" />
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-bold font-mono uppercase tracking-[0.2em] text-[#454545] block ml-1">Security Keyphrase</label>
              <div className="relative group">
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-quantum-bg/50 border border-quantum-border rounded-2xl px-12 py-4 text-sm focus:border-quantum-primary/50 outline-none transition-all placeholder:text-[#454545] font-mono group-hover:border-quantum-border/80"
                  placeholder="••••••••"
                  required
                />
                <Lock size={16} className="absolute left-5 top-1/2 -translate-y-1/2 text-[#454545] group-focus-within:text-quantum-primary transition-colors" />
              </div>
            </div>

            {error && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-4 bg-quantum-danger/5 border border-quantum-danger/10 rounded-2xl text-quantum-danger text-[11px] text-center font-bold tracking-tight"
              >
                ACCESS_DENIED: {error}
              </motion.div>
            )}

            <div className="space-y-3">
              <button 
                type="submit"
                disabled={loading}
                className="w-full bg-quantum-primary text-black font-black py-4 rounded-2xl flex items-center justify-center gap-3 hover:shadow-quantum transition-all group disabled:opacity-50 relative overflow-hidden"
              >
                <div className="absolute inset-0 shimmer opacity-0 group-hover:opacity-100 transition-opacity" />
                {loading ? (
                  <Loader2 size={18} className="animate-spin" />
                ) : (
                  <>
                    <Sparkles size={18} />
                    <span className="tracking-tighter italic uppercase text-sm">Initialize Core</span>
                  </>
                )}
              </button>

              <button 
                type="button"
                onClick={() => login("low.lucy@fallout.ai", "quantum2026")}
                disabled={loading}
                className="w-full bg-transparent border border-quantum-border text-[#454545] hover:text-[#8E9299] hover:border-quantum-border/80 font-mono text-[9px] uppercase tracking-[0.3em] py-2 rounded-xl transition-all"
              >
                [ FAST_DEMO_BYPASS ]
              </button>
            </div>
          </form>
        </div>

        <div className="mt-12 flex flex-col items-center gap-4">
          <p className="text-center text-[9px] font-bold font-mono text-[#454545] uppercase tracking-[0.5em] opacity-40">
            Quantum Trust established 1984
          </p>
          <div className="flex gap-4">
             <div className="w-1.5 h-1.5 rounded-full bg-quantum-primary/20" />
             <div className="w-1.5 h-1.5 rounded-full bg-quantum-primary/40 animate-pulse" />
             <div className="w-1.5 h-1.5 rounded-full bg-quantum-primary/20" />
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginPage;
