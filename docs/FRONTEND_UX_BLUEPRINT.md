# Improving the FALLOUT Frontend – A 10‑Page Implementation Guide

**Version:** 1.0.0
**Lead UI Architect:** FALLOUT Frontend Team
**Focus:** Next-Gen Dashboard, Real-Time UX, and Network Topology

---

## 1. Executive Summary – Frontend Modernisation Goals
The transition from static monitoring to autonomous action requires a frontend that is responsive, visual, and secure. This guide outlines the shift from a basic audit-log view to a real-time, interactive orchestration environment.

### Core Objectives:
*   **Zero-Latency Visuals:** Using WebSockets to push QBER spikes and key generations instantly.
*   **Geospatial Topology:** Visualizing drones, satellites, and ground stations as nodes in a graph.
*   **Actionable HITL:** Turning complex security requests into simple Approve/Deny interactions.
*   **Enterprise Resilience:** Role-based access control (RBAC) and dark-mode ready interfaces.

---

## 2. Backend API & WebSocket Requirements
To support a real-time frontend, the backend must transition from polling to an event-driven architecture.

### WebSocket Events (`/ws/dashboard`):
*   `KEY_GEN`: { sender_id, receiver_id, key_id, qber, timestamp }
*   `THREAT_LEVEL`: { node_id, level: "CRITICAL" | "WARNING" | "NORMAL", details }
*   `APPROVAL_PENDING`: { request_id, type, description, timeout }

---

## 3. Core Types & Network Graph Architecture
Using **ReactFlow** allows us to represent the quantum mesh network as a set of draggable nodes.

```typescript
export interface QuantumNode {
  id: string;
  type: 'drone' | 'satellite' | 'hub';
  position: { x: number, y: number };
  data: {
    label: string,
    qber: number,
    status: 'online' | 'offline' | 'compromised'
  }
}
```

---

## 4. Implementation: Real-Time WebSocket Hook
A custom hook for managing the state of the dashboard across the entire app.

```tsx
export function useQuantumSocket() {
  const [status, setStatus] = useState('connecting');
  const [lastEvent, setLastEvent] = useState(null);

  useEffect(() => {
    const ws = new WebSocket('ws://api.fallout.hub/ws/dashboard');
    ws.onmessage = (e) => {
        const msg = JSON.parse(e.data);
        setLastEvent(msg);
        // Trigger global state updates via Zustand/Redux
    };
    return () => ws.close();
  }, []);

  return { status, lastEvent };
}
```

---

## 5. Main Dashboard Layout & Grid
The UI is organized using a **Bento Grid** layout, prioritized by "Time-to-React".

| Component | Purpose | Priority |
|-----------|---------|----------|
| Threat Heatmap | Visualizing sensor spikes across the fleet | 1 (Critical) |
| Approval Panel | Human-in-the-loop task execution | 1 (Critical) |
| Network Mesh | Spatial view of the quantum links | 2 (Operational) |
| Audit Trail | Searchable history of all agent decisions | 3 (Archival) |

---

## 6. Human‑in‑the‑Loop Approval Panel
The interface must minimize "decision fatigue" while maximizing security.

```tsx
const ApprovalCard = ({ request }) => (
  <div className="bg-quantum-panel p-4 border-l-4 border-quantum-primary">
    <h3 className="font-bold">{request.title}</h3>
    <p className="text-xs text-gray-400">{request.description}</p>
    <div className="mt-4 flex gap-2">
      <button onClick={() => approve(request.id)} className="bg-emerald-500 px-4 py-2">APPROVE</button>
      <button onClick={() => deny(request.id)} className="bg-rose-500 px-4 py-2">DENY</button>
    </div>
  </div>
);
```

---

## 7. Performance & Offline Support
*   **Virtualization:** Using `react-window` for the audit log to handle 100,000+ entries.
*   **Service Workers:** Caching the dashboard shell for tactical edge deployment with intermittent connectivity.
*   **Optimistic UI:** Immediately updating the node status in the graph when a rekey is commanded.

---

## 8. Theme & Aesthetic: "Dark Horizon"
The FALLOUT design language uses high-contrast emerald on black to reduce eye strain in 24/7 operations centers.

```css
:root {
  --quantum-primary: #00FF9C;
  --quantum-bg: #0A0F14;
  --quantum-panel: #141B21;
}
```

---

## 9. Conclusion
A next-gen frontend for FALLOUT is not just an aesthetic upgrade—it is a functional necessity for orchestrating the future of quantum trust. By combining real-time data with interactive network visualization, we enable operators to stay ahead of quantum adversaries.

---
*End of Blueprint*
