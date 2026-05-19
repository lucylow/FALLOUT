import React, { useState } from "react";
import AppLayout from "./components/layout/AppLayout";
import FalloutDashboard from "./components/fallout/FalloutDashboard";
import SentimentDashboard from "./components/SentimentDashboard";
import BlueprintDoc from "./components/BlueprintDoc";
import AgentIntelligenceCenter from "./components/agent/AgentIntelligenceCenter";
import PricingPage from "./components/Billing/PricingPage";
import ManageSubscription from "./components/Billing/ManageSubscription";
import LandingPage from "./components/landing/LandingPage";
import LoginPage from "./components/LoginPage";
import { useFallout } from "./hooks/useFallout";
import { useAuth } from "./context/AuthContext";
import { Loader2 } from "lucide-react";

export default function App() {
  const [activeProject, setActiveProject] = useState<"fallout" | "sentiment" | "docs" | "landing" | "agent" | "billing">("landing");
  const { user, loading } = useAuth();
  
  // Use the dedicated hook for Fallout logic
  const { 
    keyStatus, 
    auditLog, 
    simValue, 
    setSimValue, 
    isInjecting, 
    injectThreat 
  } = useFallout(!!user);

  if (loading) {
    return (
      <div className="min-h-screen bg-quantum-bg flex items-center justify-center">
        <Loader2 className="text-quantum-primary animate-spin" size={48} />
      </div>
    );
  }

  if (!user) {
    return <LoginPage />;
  }

  if (activeProject === "landing") {
    return <LandingPage onEnterDashboard={() => setActiveProject("fallout")} />;
  }

  const breadcrumbs = [
    { 
      label: activeProject === "fallout" ? "Quantum Hub" : 
             activeProject === "sentiment" ? "AI Insights" : 
             activeProject === "agent" ? "Intelligence Core" :
             activeProject === "billing" ? "Monetization" :
             "Blueprints", 
      active: true 
    }
  ];

  return (
    <AppLayout 
      activeProject={activeProject} 
      setActiveProject={setActiveProject}
      breadcrumbs={breadcrumbs}
    >
      {activeProject === "fallout" && (
        <FalloutDashboard 
          keyStatus={keyStatus} 
          auditLog={auditLog} 
          simValue={simValue} 
          setSimValue={setSimValue} 
          isInjecting={isInjecting} 
          injectThreat={injectThreat} 
        />
      )}
      {activeProject === "sentiment" && <SentimentDashboard />}
      {activeProject === "agent" && <AgentIntelligenceCenter />}
      {activeProject === "billing" && (
        <div className="space-y-12">
          <PricingPage />
          <div className="border-t border-quantum-border pt-12">
            <ManageSubscription />
          </div>
        </div>
      )}
      {activeProject === "docs" && <BlueprintDoc />}
    </AppLayout>
  );
}

