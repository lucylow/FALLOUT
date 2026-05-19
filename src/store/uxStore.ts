import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface Suggestion {
  id: string;
  type: 'info' | 'warning' | 'critical';
  text: string;
  actionLabel?: string;
  onAction?: () => void;
}

interface UXState {
  hasCompletedOnboarding: boolean;
  isFirstRunWizardOpen: boolean;
  suggestions: Suggestion[];
  undoStack: any[];
  redoStack: any[];
  
  setHasCompletedOnboarding: (val: boolean) => void;
  setFirstRunWizardOpen: (val: boolean) => void;
  addSuggestion: (s: Suggestion) => void;
  removeSuggestion: (id: string) => void;
  pushToUndo: (state: any) => void;
  popUndo: () => any;
}

export const useUXStore = create<UXState>()(
  persist(
    (set, get) => ({
      hasCompletedOnboarding: false,
      isFirstRunWizardOpen: true,
      suggestions: [],
      undoStack: [],
      redoStack: [],

      setHasCompletedOnboarding: (val) => set({ hasCompletedOnboarding: val }),
      setFirstRunWizardOpen: (val) => set({ isFirstRunWizardOpen: val }),
      
      addSuggestion: (s) => set((state) => {
        // Prevent near-duplicate text in quick succession
        const isDuplicate = state.suggestions.some(existing => existing.text === s.text);
        if (isDuplicate) return state;
        return { 
          suggestions: [s, ...state.suggestions].slice(0, 5) 
        };
      }),
      
      removeSuggestion: (id) => set((state) => ({ 
        suggestions: state.suggestions.filter(s => s.id !== id) 
      })),

      pushToUndo: (state) => set((s) => ({ 
        undoStack: [state, ...s.undoStack].slice(0, 10) 
      })),
      
      popUndo: () => {
        const stack = get().undoStack;
        if (stack.length === 0) return null;
        const last = stack[0];
        set({ undoStack: stack.slice(1) });
        return last;
      }
    }),
    {
      name: 'fallout-ux-storage',
      partialize: (state) => ({ hasCompletedOnboarding: state.hasCompletedOnboarding }),
    }
  )
);
