import { useState, useEffect, useRef } from "react";
import { KeyStatus, AuditEntry } from "../types";

export function useFallout(isAuthenticated: boolean) {
  const [keyStatus, setKeyStatus] = useState<KeyStatus | null>(null);
  const [auditLog, setAuditLog] = useState<AuditEntry[]>([]);
  const [simValue, setSimValue] = useState(0.02);
  const [isInjecting, setIsInjecting] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) return;

    fetch("/api/key/status")
      .then((res) => res.json())
      .then((data) => setKeyStatus(data));

    fetch("/api/audit")
      .then((res) => res.json())
      .then((data) => setAuditLog(data));

    const interval = setInterval(() => {
      fetch("/api/key/status")
        .then((res) => res.json())
        .then((data) => setKeyStatus(data));
      
      fetch("/api/audit")
        .then((res) => res.json())
        .then((data) => setAuditLog(data));
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const injectThreat = async (signal: string) => {
    setIsInjecting(true);
    try {
      const res = await fetch("/api/threat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ signal, value: simValue }),
      });
      const data = await res.json();
      
      // Update local state immediately for UX responsiveness
      setKeyStatus(prev => prev ? { ...prev, qber: data.qber, keyId: data.new_key_id || prev.keyId } : null);
      
      setTimeout(() => {
        setIsInjecting(false);
      }, 1500);
    } catch (error) {
      console.error("Threat injection failed", error);
      setIsInjecting(false);
    }
  };

  return {
    keyStatus,
    auditLog,
    simValue,
    setSimValue,
    isInjecting,
    injectThreat
  };
}
