import { useEffect, useState } from "react";
import { useUXStore } from "../store/uxStore";
import { useAuth } from "../context/AuthContext";

export const useUXOrchestrator = (activeProject: string, keyStatus: any) => {
  const { addSuggestion } = useUXStore();
  const { user } = useAuth();
  const [isFetching, setIsFetching] = useState(false);

  useEffect(() => {
    if (user && activeProject === 'fallout' && keyStatus?.qber > 0.05 && !isFetching) {
      const fetchSuggestion = async () => {
        setIsFetching(true);
        try {
          const res = await fetch(`/api/ai/suggestion?qber=${(keyStatus.qber * 100).toFixed(2)}`);
          const data = await res.json();
          addSuggestion({
            id: `ai-suggest-${Date.now()}`,
            type: data.type || 'info',
            text: data.text,
            actionLabel: data.type === 'critical' ? 'Execute Rekey' : 'Acknowledge',
            onAction: () => console.log("Suggestion acknowledged")
          });
        } catch (e) {
          console.error("Failed to fetch AI suggestion", e);
        } finally {
          // Debounce fetching
          setTimeout(() => setIsFetching(false), 30000); 
        }
      };
      fetchSuggestion();
    }
  }, [activeProject, keyStatus?.qber]);

  return null;
};
