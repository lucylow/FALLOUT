import React, { useState } from "react";
import { Sparkles, Shield, Lock, MousePointer2, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface OnboardingProps {
  onComplete: () => void;
}

const OnboardingTour = ({ onComplete }: OnboardingProps) => {
  const [step, setStep] = useState(0);

  const steps = [
    {
      title: "Welcome to FALLOUT",
      description: "Initialize your quantum-secure infrastructure. We've optimized your dashboard for sub-millisecond trust orchestration.",
      icon: Shield
    },
    {
      title: "Real-time Telemetry",
      description: "Monitor QBER (Quantum Bit Error Rate). If the signal spikes above 8%, FALLOUT will suggest an immediate autonomous rekey.",
      icon: Lock
    },
    {
      title: "Agentic Verification",
      description: "The Gemini Agent handles the heavy sifting. Use the Command Palette (⌘K) to quickly navigate blueprints and logs.",
      icon: Sparkles
    }
  ];

  const nextStep = () => {
    if (step < steps.length - 1) {
      setStep(step + 1);
    } else {
      onComplete();
    }
  };

  const currentStep = steps[step];

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-quantum-bg/90 backdrop-blur-md overflow-hidden">
      {/* Background visual flair */}
      <div className="absolute inset-0 pointer-events-none opacity-10">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] border border-quantum-primary rounded-full animate-ping [animation-duration:4s]" />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="w-full max-w-lg bg-quantum-panel border border-quantum-border rounded-3xl p-10 shadow-3xl text-center relative overflow-hidden"
      >
        <button 
          onClick={onComplete}
          className="absolute top-4 right-6 text-[10px] font-mono text-[#454545] hover:text-quantum-primary transition-colors uppercase tracking-widest"
        >
          Skip Tour
        </button>
        <div className="absolute top-0 left-0 w-full h-1 bg-quantum-border">
          <motion.div 
            className="h-full bg-quantum-primary shadow-[0_0_10px_#00FF9C]"
            initial={{ width: 0 }}
            animate={{ width: `${((step + 1) / steps.length) * 100}%` }}
          />
        </div>

        <div className="w-20 h-20 mx-auto bg-quantum-primary/10 rounded-2xl flex items-center justify-center text-quantum-primary mb-8">
          <currentStep.icon size={40} className="animate-in zoom-in duration-500" />
        </div>

        <h2 className="text-3xl font-bold tracking-tight mb-4">{currentStep.title}</h2>
        <p className="text-[#8E9299] leading-relaxed mb-10 px-4">
          {currentStep.description}
        </p>

        <div className="flex items-center justify-between">
          <div className="flex gap-1.5">
            {steps.map((_, i) => (
              <div 
                key={i} 
                className={`w-1.5 h-1.5 rounded-full transition-all ${i === step ? "bg-quantum-primary w-4" : "bg-[#454545]"}`} 
              />
            ))}
          </div>
          
          <button
            onClick={nextStep}
            className="px-8 py-3 bg-quantum-primary text-black font-bold rounded-xl flex items-center gap-2 hover:shadow-[0_0_20px_rgba(0,255,156,0.3)] transition-all group"
          >
            {step === steps.length - 1 ? "Initialize Terminal" : "Next Protocol"}
            <CheckCircle2 size={18} className="group-hover:scale-110 transition-transform" />
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default OnboardingTour;
