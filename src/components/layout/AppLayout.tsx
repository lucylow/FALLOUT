import React, { useState } from "react";
import Sidebar from "../navigation/Sidebar";
import TopBar from "../navigation/TopBar";
import Breadcrumbs from "../navigation/Breadcrumbs";
import KeyboardShortcuts from "../navigation/KeyboardShortcuts";
import CommandPalette from "../ux/CommandPalette";
import OnboardingTour from "../ux/OnboardingTour";
import AgentSuggestion from "../ux/AgentSuggestion";
import { useUXStore } from "../../store/uxStore";
import { useHotkeys } from "react-hotkeys-hook";

interface AppLayoutProps {
  children: React.ReactNode;
  activeProject: "fallout" | "sentiment" | "docs" | "landing" | "agent" | "billing";
  setActiveProject: (id: any) => void;
  breadcrumbs: { label: string; active?: boolean }[];
}

const AppLayout = ({ children, activeProject, setActiveProject, breadcrumbs }: AppLayoutProps) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  
  const { hasCompletedOnboarding, setHasCompletedOnboarding } = useUXStore();

  // Command palette hotkey
  useHotkeys('mod+k', (e) => {
    e.preventDefault();
    setIsCommandPaletteOpen(prev => !prev);
  });

  useHotkeys('esc', () => {
    setIsCommandPaletteOpen(false);
  }, { enabled: isCommandPaletteOpen });

  const handleNavigate = (id: any) => {
    setActiveProject(id);
    setIsCommandPaletteOpen(false);
  };

  return (
    <div className={`min-h-screen flex bg-quantum-bg text-white font-sans transition-colors duration-300 ${theme === 'light' ? 'theme-light' : 'theme-dark'}`}>
      {!hasCompletedOnboarding && activeProject !== 'landing' && (
        <OnboardingTour onComplete={() => setHasCompletedOnboarding(true)} />
      )}
      
      <CommandPalette 
        isOpen={isCommandPaletteOpen} 
        onClose={() => setIsCommandPaletteOpen(false)}
        onNavigate={handleNavigate}
      />
      
      <AgentSuggestion />
      <KeyboardShortcuts onNavigate={setActiveProject} />
      
      <Sidebar 
        activeProject={activeProject} 
        onSelect={setActiveProject} 
        isCollapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
      />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopBar 
          onMenuToggle={() => setSidebarCollapsed(!sidebarCollapsed)} 
          theme={theme} 
          onThemeToggle={() => setTheme(theme === 'dark' ? 'light' : 'dark')} 
        />
        
        <main className="flex-1 overflow-y-auto overflow-x-hidden p-6 md:p-10 relative">
          <div className="scanline" />
          <div className="absolute top-0 left-0 w-full h-96 bg-[radial-gradient(circle_at_50%_0%,rgba(0,255,156,0.05),transparent_70%)] pointer-events-none" />
          
          <div className="max-w-7xl mx-auto relative z-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <Breadcrumbs items={breadcrumbs} />
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
