import { useHotkeys } from "react-hotkeys-hook";

const KeyboardShortcuts = ({ onNavigate }: { onNavigate: (path: any) => void }) => {
  // Navigation shortcuts
  useHotkeys('alt+h', () => onNavigate("landing"));
  useHotkeys('alt+q', () => onNavigate("fallout"));
  useHotkeys('alt+i', () => onNavigate("sentiment"));
  useHotkeys('alt+d', () => onNavigate("docs"));

  return null;
};

export default KeyboardShortcuts;
