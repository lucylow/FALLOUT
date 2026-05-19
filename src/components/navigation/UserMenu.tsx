import React from "react";
import { User, LogOut, Settings as SettingsIcon, ChevronDown } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

interface UserMenuProps {
  user: { name: string; email: string; avatar?: string };
}

const UserMenu = ({ user }: UserMenuProps) => {
  const { logout } = useAuth();

  return (
    <div className="relative group">
      <button className="flex items-center gap-3 p-1.5 hover:bg-quantum-border rounded-xl transition-all border border-transparent hover:border-quantum-border/50">
        <div className="w-8 h-8 rounded-lg bg-quantum-primary/20 flex items-center justify-center text-quantum-primary font-bold text-xs">
          {user.name.split(' ').map(n => n[0]).join('')}
        </div>
        <div className="hidden md:flex flex-col items-start leading-tight">
          <span className="text-xs font-bold text-white">{user.name}</span>
          <span className="text-[10px] text-[#8E9299] font-mono">{user.email}</span>
        </div>
        <ChevronDown size={14} className="text-[#8E9299] group-hover:text-white transition-colors" />
      </button>

      <div className="absolute right-0 top-full mt-2 w-48 bg-quantum-panel border border-quantum-border rounded-xl shadow-2xl opacity-0 translate-y-2 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto transition-all z-50 overflow-hidden">
        <div className="p-2 border-b border-quantum-border bg-quantum-primary/5">
          <div className="flex flex-col px-3 py-2">
            <span className="text-xs font-bold text-white">Security Clearance</span>
            <span className="text-[10px] text-quantum-primary font-mono uppercase tracking-tighter">Level 5 Alpha</span>
          </div>
        </div>
        <div className="p-1">
          <button className="w-full flex items-center gap-3 px-3 py-2 text-xs text-[#8E9299] hover:text-white hover:bg-quantum-border rounded-lg transition-colors">
            <User size={14} />
            Profile Settings
          </button>
          <button className="w-full flex items-center gap-3 px-3 py-2 text-xs text-[#8E9299] hover:text-white hover:bg-quantum-border rounded-lg transition-colors">
            <SettingsIcon size={14} />
            Console Config
          </button>
          <div className="h-px bg-quantum-border my-1" />
          <button 
            onClick={logout}
            className="w-full flex items-center gap-3 px-3 py-2 text-xs text-quantum-danger hover:bg-quantum-danger/10 rounded-lg transition-colors"
          >
            <LogOut size={14} />
            De-authenticate
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserMenu;
