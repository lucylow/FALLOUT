import React from "react";
import { Sun, Moon } from "lucide-react";

interface ThemeToggleProps {
  theme: "light" | "dark";
  onToggle: () => void;
}

const ThemeToggle = ({ theme, onToggle }: ThemeToggleProps) => {
  return (
    <button 
      onClick={onToggle}
      className="p-2 hover:bg-quantum-border rounded-lg transition-colors text-[#8E9299] hover:text-quantum-primary group"
      title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
    >
      {theme === "dark" ? (
        <Sun size={18} className="group-hover:rotate-45 transition-transform" />
      ) : (
        <Moon size={18} className="group-hover:-rotate-12 transition-transform" />
      )}
    </button>
  );
};

export default ThemeToggle;
