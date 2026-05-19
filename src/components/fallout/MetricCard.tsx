import React from "react";
import { motion } from "motion/react";

interface MetricCardProps {
  title: string;
  value: string;
  subValue?: string;
  icon: any;
  color?: "primary" | "danger" | "warning";
  loading?: boolean;
}

const MetricCard = ({ 
  title, 
  value, 
  subValue, 
  icon: Icon, 
  color = "primary",
  loading = false 
}: MetricCardProps) => {
  const colorMap = {
    primary: "text-quantum-primary",
    danger: "text-quantum-danger",
    warning: "text-amber-400"
  };

  const bgMap = {
    primary: "bg-quantum-primary/5",
    danger: "bg-quantum-danger/5",
    warning: "bg-amber-400/5"
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      className="bg-quantum-panel border border-quantum-border p-5 rounded-2xl relative overflow-hidden group transition-all duration-300 hover:shadow-2xl hover:border-quantum-border/80"
    >
      {loading && <div className="absolute inset-0 shimmer pointer-events-none" />}
      
      <div className={`absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-15 transition-all duration-500 text-white`}>
        <Icon size={64} strokeWidth={1} />
      </div>

      <div className="flex flex-col gap-2 relative z-10">
        <div className="flex items-center gap-2">
          <div className={`p-1.5 rounded-lg ${bgMap[color]} ${colorMap[color]}`}>
            <Icon size={14} />
          </div>
          <span className="text-[10px] font-bold font-mono uppercase tracking-[0.2em] text-[#8E9299]">
            {title}
          </span>
        </div>
        
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-bold tracking-tighter text-white tabular-nums">
            {value}
          </span>
          {subValue && (
            <span className="text-[11px] font-mono text-[#8E9299] opacity-80 decoration-quantum-primary/30">
              {subValue}
            </span>
          )}
        </div>
      </div>
      
      <div className={`absolute bottom-0 left-0 w-full h-[1px] ${colorMap[color]} opacity-0 group-hover:opacity-30 transition-opacity`} />
    </motion.div>
  );
};

export default MetricCard;
