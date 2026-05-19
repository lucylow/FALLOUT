import React from "react";
import { Sparkles, X, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useUXStore } from "../../store/uxStore";

const AgentSuggestion = () => {
  const { suggestions, removeSuggestion } = useUXStore();

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 w-80">
      <AnimatePresence>
        {suggestions.map((s) => (
          <motion.div
            key={s.id}
            initial={{ opacity: 0, x: 50, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className={`bg-quantum-panel border-l-4 p-4 rounded-r-xl shadow-2xl relative overflow-hidden group ${
              s.type === 'critical' ? 'border-quantum-danger bg-quantum-danger/5' : 
              s.type === 'warning' ? 'border-yellow-500 bg-yellow-500/5' : 
              'border-quantum-primary bg-quantum-primary/5'
            }`}
          >
            <button 
              onClick={() => removeSuggestion(s.id)}
              className="absolute top-2 right-2 p-1 text-[#454545] hover:text-white transition-colors"
            >
              <X size={14} />
            </button>
            
            <div className="flex items-start gap-3">
              <div className={`p-2 rounded-lg ${
                s.type === 'critical' ? 'text-quantum-danger' : 
                s.type === 'warning' ? 'text-yellow-500' : 
                'text-quantum-primary'
              }`}>
                <Sparkles size={16} className="animate-pulse" />
              </div>
              <div className="flex flex-col gap-2">
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#8E9299]">Agent Recommendation</span>
                <p className="text-xs font-medium leading-relaxed pr-4">
                  {s.text}
                </p>
                {s.onAction && (
                  <button 
                    onClick={() => {
                      s.onAction?.();
                      removeSuggestion(s.id);
                    }}
                    className="flex items-center gap-2 text-[10px] font-bold text-quantum-primary uppercase tracking-tighter hover:gap-3 transition-all"
                  >
                    {s.actionLabel || "Execute Suggestion"}
                    <ChevronRight size={12} />
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default AgentSuggestion;
