import React from "react";
import { Shield, Bell, Menu, Search } from "lucide-react";
import UserMenu from "./UserMenu";
import ThemeToggle from "./ThemeToggle";
import { useAuth } from "../../context/AuthContext";

interface TopBarProps {
  onMenuToggle: () => void;
  theme: "dark" | "light";
  onThemeToggle: () => void;
}

const TopBar = ({ onMenuToggle, theme, onThemeToggle }: TopBarProps) => {
  const { user } = useAuth();
  
  return (
    <header className="h-16 bg-quantum-panel/80 backdrop-blur-xl border-b border-quantum-border px-6 flex items-center justify-between sticky top-0 z-40">
      <div className="flex items-center gap-4">
        <button 
          onClick={onMenuToggle}
          className="lg:hidden p-2 text-[#8E9299] hover:text-white hover:bg-quantum-border rounded-lg transition-all"
        >
          <Menu size={20} />
        </button>
        
        <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-quantum-bg border border-quantum-border rounded-xl w-64 lg:w-96 group focus-within:border-quantum-primary/50 transition-all">
          <Search size={14} className="text-[#454545] group-focus-within:text-quantum-primary transition-colors" />
          <input 
            type="text" 
            placeholder="Search blueprints, logs, or signals..." 
            className="bg-transparent border-none outline-none text-xs w-full text-[#8E9299] focus:text-white"
          />
          <span className="text-[10px] font-mono text-[#454545] border border-quantum-border px-1.5 rounded">⌘K</span>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative group p-2 text-[#8E9299] hover:text-quantum-primary hover:bg-quantum-border rounded-lg transition-all cursor-pointer">
          <Bell size={18} />
          <div className="absolute top-2 right-2 w-2 h-2 bg-quantum-danger rounded-full border-2 border-quantum-panel shadow-[0_0_8px_rgba(244,63,94,0.5)]" />
        </div>
        
        <div className="w-px h-6 bg-quantum-border mx-2" />
        
        <ThemeToggle theme={theme} onToggle={onThemeToggle} />
        
        <UserMenu user={user || { name: "Operator", email: "unauthorized@fallout.ai" }} />
      </div>
    </header>
  );
};

export default TopBar;
