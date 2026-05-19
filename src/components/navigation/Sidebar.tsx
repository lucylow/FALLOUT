import React from "react";
import { 
  LayoutGrid, 
  Brain, 
  History, 
  Settings as SettingsIcon,
  ChevronLeft,
  ChevronRight,
  Shield,
  Zap,
  Cpu,
  CreditCard
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface SidebarProps {
  activeProject: string;
  onSelect: (id: any) => void;
  isCollapsed: boolean;
  onToggle: () => void;
}

const Sidebar = ({ activeProject, onSelect, isCollapsed, onToggle }: SidebarProps) => {
  const menuItems = [
    { id: "landing", label: "Overview", icon: LayoutGrid },
    { id: "agent", label: "Intelligence Core", icon: Brain },
    { id: "fallout", label: "Quantum Hub", icon: Shield },
    { id: "sentiment", label: "AI Insights", icon: Cpu },
    { id: "docs", label: "Blueprints", icon: History },
  ];

  const secondaryItems = [
    { id: "billing", label: "Billing & Plans", icon: CreditCard },
    { id: "settings", label: "Console Config", icon: SettingsIcon },
  ];

  return (
    <motion.aside 
      initial={false}
      animate={{ width: isCollapsed ? 80 : 256 }}
      className={`bg-quantum-panel border-r border-quantum-border flex flex-col relative z-50`}
    >
      <div className="p-6 border-b border-quantum-border flex items-center justify-between min-h-[70px]">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="w-8 h-8 shrink-0 bg-quantum-primary rounded-lg flex items-center justify-center text-black shadow-quantum">
            <Shield size={18} />
          </div>
          <AnimatePresence mode="wait">
            {!isCollapsed && (
              <motion.span 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="font-bold tracking-tighter text-xl uppercase text-white whitespace-nowrap"
              >
                Fallout
              </motion.span>
            )}
          </AnimatePresence>
        </div>
      </div>

      <nav className="flex-1 p-4 flex flex-col gap-1.5 overflow-x-hidden overflow-y-auto terminal-scroll">
        <div className={`px-3 py-4 transition-opacity ${isCollapsed ? "opacity-0" : "opacity-100"}`}>
          <span className="text-[10px] font-bold font-mono uppercase tracking-[0.2em] text-[#454545]">
            Core Systems
          </span>
        </div>
        
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onSelect(item.id)}
            className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-all group relative whitespace-nowrap overflow-hidden ${
              activeProject === item.id 
                ? "bg-quantum-primary/10 text-quantum-primary shadow-[inset_0_0_20px_rgba(0,255,156,0.05)]" 
                : "text-[#8E9299] hover:bg-quantum-border hover:text-white"
            }`}
          >
            <item.icon size={20} className={`shrink-0 transition-transform ${activeProject === item.id ? "scale-110" : "group-hover:scale-110"}`} />
            
            <AnimatePresence>
              {!isCollapsed && (
                <motion.span 
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  className="text-[13px] font-semibold"
                >
                  {item.label}
                </motion.span>
              )}
            </AnimatePresence>
            
            {activeProject === item.id && (
              <motion.div 
                layoutId="active-indicator"
                className="absolute left-0 w-1 h-6 bg-quantum-primary rounded-r-full" 
              />
            )}

            {isCollapsed && (
              <div className="absolute left-full ml-4 px-2.5 py-1.5 bg-quantum-panel border border-quantum-border rounded-lg text-[10px] font-bold uppercase tracking-widest text-white opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-200 z-50 whitespace-nowrap shadow-2xl translate-x-[-10px] group-hover:translate-x-0">
                {item.label}
              </div>
            )}
          </button>
        ))}

        <div className="mt-8">
           <div className={`px-3 py-4 transition-opacity ${isCollapsed ? "opacity-0" : "opacity-100"}`}>
            <span className="text-[10px] font-bold font-mono uppercase tracking-[0.2em] text-[#454545]">
              Console
            </span>
          </div>
          {secondaryItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onSelect(item.id)}
              className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all group relative overflow-hidden ${
                activeProject === item.id 
                  ? "bg-quantum-primary/10 text-quantum-primary shadow-[inset_0_0_20px_rgba(0,255,156,0.05)]" 
                  : "text-[#8E9299] hover:bg-quantum-border hover:text-white"
              }`}
            >
              <item.icon size={20} className={`shrink-0 transition-transform ${activeProject === item.id ? "scale-110" : "group-hover:scale-110"}`} />
              <AnimatePresence>
                {!isCollapsed && (
                  <motion.span 
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    className="text-[13px] font-semibold"
                  >
                    {item.label}
                  </motion.span>
                )}
              </AnimatePresence>
              
              {activeProject === item.id && (
                <motion.div 
                  layoutId="active-indicator-secondary"
                  className="absolute left-0 w-1 h-6 bg-quantum-primary rounded-r-full" 
                />
              )}

              {isCollapsed && (
                 <div className="absolute left-full ml-4 px-2.5 py-1.5 bg-quantum-panel border border-quantum-border rounded-lg text-[10px] font-bold uppercase tracking-widest text-white opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-200 z-50 whitespace-nowrap shadow-2xl translate-x-[-10px] group-hover:translate-x-0">
                  {item.label}
                </div>
              )}
            </button>
          ))}
        </div>
      </nav>

      <div className="p-4 border-t border-quantum-border">
        <button 
          onClick={onToggle}
          className="w-full flex items-center justify-center p-3 text-[#454545] hover:text-quantum-primary hover:bg-quantum-primary/5 rounded-xl transition-all"
        >
          {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </button>
      </div>
    </motion.aside>
  );
};

export default Sidebar;
