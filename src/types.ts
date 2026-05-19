export interface KeyStatus {
  keyId: string;
  keyValue: string;
  qber: number;
  timestamp: string;
  status: "WAITING" | "ACTIVE" | "COMPROMISED";
}

export interface AuditEntry {
  timestamp: string;
  threat: { signal: string; value?: number };
  decision: string;
  reason: string;
  newKeyId?: string;
  qber?: number;
}

export interface ThreatSignal {
  id: string;
  label: string;
  icon: any;
  hasValue?: boolean;
}

export interface AgentStep {
  agent: string;
  thought: string;
  action?: string;
  timestamp: string;
}

export interface AgentReasoning {
  sessionId: string;
  steps: AgentStep[];
  finalResponse: string;
}

export interface AgentMemoryEntry {
  id: string;
  content: string;
  relevance: string;
  timestamp: string;
}
