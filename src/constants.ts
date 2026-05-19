import { RefreshCcw, Activity, ShieldAlert } from "lucide-react";
import { ThreatSignal } from "./types";

export const THREAT_SIGNALS: ThreatSignal[] = [
  { id: "TIMER_EXPIRED", label: "Policy Rotation (Timer)", icon: RefreshCcw },
  { id: "QBER_SPIKE", label: "Simulate QBER Spike", icon: Activity, hasValue: true },
  { id: "EVE_DETECTED", label: "Intrusion Detected (Eve)", icon: ShieldAlert },
];
