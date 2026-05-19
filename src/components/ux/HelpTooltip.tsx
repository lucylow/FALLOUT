import React from "react";
import { Info } from "lucide-react";

interface HelpTooltipProps {
  content: string;
  children: React.ReactNode;
}

const HelpTooltip = ({ content, children }: HelpTooltipProps) => {
  return (
    <div className="group relative inline-flex items-center gap-1.5">
      {children}
      <div className="text-[#454545] hover:text-quantum-primary cursor-help transition-colors">
        <Info size={12} />
      </div>
      
      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-3 bg-quantum-panel border border-quantum-border rounded-xl shadow-xl opacity-0 translate-y-2 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto transition-all z-50">
        <div className="text-[10px] font-mono text-[#8E9299] uppercase tracking-widest mb-1">Context Help</div>
        <p className="text-[11px] leading-relaxed text-white/80">
          {content}
        </p>
        <div className="absolute top-full left-1/2 -translate-x-1/2 border-8 border-transparent border-t-quantum-border" />
      </div>
    </div>
  );
};

export default HelpTooltip;
