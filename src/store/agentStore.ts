import { create } from 'zustand';
import { AgentStep, AgentMemoryEntry } from '../types';

interface AgentState {
  isOrchestrating: boolean;
  activeSteps: AgentStep[];
  memories: AgentMemoryEntry[];
  lastResponse: string | null;
  
  startOrchestration: (input: string) => Promise<void>;
  addStep: (step: AgentStep) => void;
  clearSteps: () => void;
  addMemory: (memory: AgentMemoryEntry) => void;
}

export const useAgentStore = create<AgentState>((set, get) => ({
  isOrchestrating: false,
  activeSteps: [],
  memories: [],
  lastResponse: null,

  addStep: (step) => set((state) => ({ 
    activeSteps: [...state.activeSteps, step] 
  })),

  clearSteps: () => set({ activeSteps: [], lastResponse: null }),

  addMemory: (memory) => set((state) => ({
    memories: [memory, ...state.memories].slice(0, 50)
  })),

  startOrchestration: async (input) => {
    set({ isOrchestrating: true, activeSteps: [], lastResponse: null });
    
    try {
      const response = await fetch('/api/agent/orchestrate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input })
      });
      
      const data = await response.json();
      
      // If we used streaming (SSE), we'd handle it differently. 
      // For now, we simulate the 'steps' coming in if the API returns them all at once
      if (data.steps) {
        for (const step of data.steps) {
          get().addStep(step);
          // Small delay for visual effect
          await new Promise(r => setTimeout(r, 600));
        }
      }
      
      if (data.memory) {
        get().addMemory(data.memory);
      }
      
      set({ lastResponse: data.finalResponse, isOrchestrating: false });
    } catch (error) {
      console.error('Orchestration error:', error);
      set({ isOrchestrating: false });
    }
  }
}));
