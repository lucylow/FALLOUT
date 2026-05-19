import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type, FunctionDeclaration } from "@google/genai";
import { simulateBB84 } from "./src/lib/qkd";
import { fastBB84, getOptimizedPattern } from "./src/lib/optimizedEngine";
import msgpack from "msgpack-lite";
import { LRUCache } from "lru-cache";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import cookieParser from "cookie-parser";
import Stripe from "stripe";

// Initialization
const app = express();
const PORT = 3000;

// Stripe Initialization
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2025-01-27.acacia" as any
});

// In-memory Billing State
const billingState = {
  customers: [] as { stripeId: string; email: string; name: string }[],
  subscriptions: [] as { id: string; customerId: string; status: string; plan: string; currentPeriodEnd: string }[]
};

// Webhook endpoint (Public, but Stripe-verified)
app.post("/api/webhooks/stripe", express.raw({ type: "application/json" }), async (req, res) => {
  const sig = req.headers["stripe-signature"] as string;
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret!);
  } catch (err: any) {
    console.error(`[STRIPE_WEBHOOK_ERROR] ${err.message}`);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  switch (event.type) {
    case "customer.subscription.created":
    case "customer.subscription.updated": {
      const subscription = event.data.object as any;
      const subIndex = billingState.subscriptions.findIndex(s => s.id === subscription.id);
      const subData = {
        id: subscription.id,
        customerId: subscription.customer,
        status: subscription.status,
        plan: subscription.items.data[0].price.id,
        currentPeriodEnd: new Date(subscription.current_period_end * 1000).toISOString()
      };
      
      if (subIndex > -1) {
        billingState.subscriptions[subIndex] = subData;
      } else {
        billingState.subscriptions.push(subData);
      }
      break;
    }
    case "customer.subscription.deleted": {
      const subscription = event.data.object as any;
      const subIndex = billingState.subscriptions.findIndex(s => s.id === subscription.id);
      if (subIndex > -1) {
        billingState.subscriptions[subIndex].status = "canceled";
      }
      break;
    }
  }

  res.send();
});

app.use(express.json());
app.use(cookieParser());

const JWT_SECRET = process.env.JWT_SECRET || "quantum-fallback-secret-2026";

// Mock User Database (usually this would be in Firestore or similar)
const MOCK_USER = {
  id: "u1",
  email: "low.lucy@fallout.ai",
  passwordHash: bcrypt.hashSync("quantum2026", 10),
  name: "Lucy Low"
};

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY as string,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

// In-memory State
let currentKeyState = {
  keyId: "F0X-1A2B",
  keyValue: "9f8e...7c2",
  qber: 0.024,
  timestamp: new Date().toISOString(),
  status: "ACTIVE" // WAITING, ACTIVE, COMPROMISED
};

// Background Drift Simulation
let driftInterval: NodeJS.Timeout | null = null;
const startDrift = () => {
  if (driftInterval) clearInterval(driftInterval);
  driftInterval = setInterval(() => {
    // Slowly drift QBER up/down
    const drift = (Math.random() - 0.5) * 0.002;
    currentKeyState.qber = Math.max(0.012, Math.min(0.18, currentKeyState.qber + drift));
    
    // Status update based on QBER
    if (currentKeyState.qber > 0.12) {
      currentKeyState.status = "COMPROMISED";
    } else if (currentKeyState.qber < 0.08) {
      currentKeyState.status = "ACTIVE";
    }
  }, 4000);
};
startDrift();

interface AuditEntry {
  timestamp: string;
  threat: any;
  decision: string;
  reason: string;
  newKeyId?: string;
  qber?: number;
}
const auditLog: AuditEntry[] = [];

// --- Advanced Agent Global State ---
interface AgentMemoryEntry {
  id: string;
  content: string;
  relevance: string;
  timestamp: string;
}

let globalAgentMemory: AgentMemoryEntry[] = [
  { 
    id: "m0", 
    content: "BB84 protocol is currently using 512-bit key chunks for enterprise compliance.", 
    relevance: "PROTOCOL_SPEC", 
    timestamp: new Date().toISOString() 
  },
  {
    id: "m1",
    content: "Last system stress test indicated stability up to 12.4% QBER injection.",
    relevance: "STABILITY_LOG",
    timestamp: new Date().toISOString()
  }
];

// Low-Latency Cache (Mocking Redis)
const latencyCache = new LRUCache<string, any>({
  max: 1000,
  ttl: 1000 * 60 * 60 // 1 hour
});

const MULTI_AGENT_SYSTEM_PROMPT = `
You are the FALLOUT Intelligence Core, an advanced multi-agent orchestrator.
Composed of:
1. SUPERVISOR: Manages reasoning steps and final synthesis.
2. QUANTUM_PHYSICIST: Specializes in sub-atomic photon state analysis and QBER drift.
3. SECURITY_MODERATOR: Ensures all actions align with strict enterprise security policies.

When a user provides input, you MUST:
- Step through at least 3 distinct reasoning cycles.
- For each cycle, specify the agent speaking.
- Conclude with a 'finalResponse'.
- Suggest one 'memory' fragment to store (fact/insight).

Output EXCLUSIVELY a JSON object:
{
  "steps": [
    { "agent": "SUPERVISOR | QUANTUM_PHYSICIST | SECURITY_MODERATOR", "thought": "...", "action": "Optional" }
  ],
  "finalResponse": "Unified response",
  "memory": { "content": "Fact to store", "relevance": "Category" }
}
`;

// --- Sentiment Pipeline State (Simulated) ---
const sentimentMetrics = {
  accuracy: 0.924,
  f1: 0.912,
  loss: 0.184,
  epochs: 3,
  labels: ["NEGATIVE", "POSITIVE"]
};

const trainingLogs = [
  "Epoch 1/3 | Batch 0 | Loss: 0.7241",
  "Epoch 1/3 | Batch 50 | Loss: 0.5120",
  "Epoch 1/3 | Batch 100 | Loss: 0.3842",
  "Epoch 1/3 | Average loss: 0.3521",
  "Validation | Loss: 0.2841, Acc: 0.8842, F1: 0.8710",
  "Epoch 2/3 | Batch 0 | Loss: 0.2641",
  "Epoch 2/3 | Batch 50 | Loss: 0.2210",
  "Epoch 2/3 | Average loss: 0.2104",
  "Validation | Loss: 0.1942, Acc: 0.9120, F1: 0.9015",
  "Epoch 3/3 | Batch 0 | Loss: 0.1842",
  "Epoch 3/3 | Average loss: 0.1842",
  "Validation | Loss: 0.1842, Acc: 0.9240, F1: 0.9120",
  "Training complete. Best F1: 0.9120"
];

// Gemini Tool Definition
const requestNewQuantumKeyTool: FunctionDeclaration = {
  name: "request_new_quantum_key",
  description: "Request a new quantum key generation because a security threshold was hit or policy requires rotation.",
  parameters: {
    type: Type.OBJECT,
    properties: {
      threat_description: {
        type: Type.STRING,
        description: "The analysis of why a new key is needed (e.g., QBER too high, Eve detected, timer expired)."
      },
      current_qber: {
        type: Type.NUMBER,
        description: "The reported QBER value if applicable."
      }
    },
    required: ["threat_description", "current_qber"]
  }
};

const SYSTEM_INSTRUCTION = `
You are the FALLOUT Security Orchestrator, an AI agent managing an autonomous Quantum Key Distribution (QKD) system.
Your goal is to maintain a secure communication channel by rotating quantum keys based on threat signals.

Roles you inhabit:
1. INTEL ANALYST: Interpret raw telemetry signals (e.g., QBER_SPIKE, TIMER_EXPIRED, EVE_DETECTED).
2. POLICY KEEPER: Evaluate signals against Enterprise Policies:
   - REKEY if QBER > 0.08 (8%)
   - REKEY if TIMER_EXPIRED (automatic rotation)
   - REKEY if EVE_DETECTED (definite compromise)
3. ORCHESTRATOR: Call the tool 'request_new_quantum_key' ONLY if a rekey is warranted by policy.

Always provide your reasoning clearly. If no action is needed, conclude with "STATUS_SECURE: NO_ACTION_REQUIRED".
`;

// --- Authentication Middleware ---
const authenticateJWT = (req: any, res: any, next: any) => {
  const token = req.cookies.auth_token;
  if (!token) {
    return res.status(401).json({ error: "Authentication required" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(403).json({ error: "Invalid or expired token" });
  }
};

// --- Authentication Routes ---
app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;

  if (email === MOCK_USER.email && bcrypt.compareSync(password, MOCK_USER.passwordHash)) {
    const token = jwt.sign(
      { id: MOCK_USER.id, email: MOCK_USER.email, name: MOCK_USER.name },
      JWT_SECRET,
      { expiresIn: "24h" }
    );

    res.cookie("auth_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 24 * 60 * 60 * 1000 // 24 hours
    });

    return res.json({ 
      user: { id: MOCK_USER.id, email: MOCK_USER.email, name: MOCK_USER.name },
      token // also return token if client wants to store it elsewhere
    });
  }

  res.status(401).json({ error: "Invalid credentials" });
});

app.post("/api/logout", (req, res) => {
  res.clearCookie("auth_token");
  res.json({ message: "Logged out successfully" });
});

app.get("/api/me", authenticateJWT, (req: any, res) => {
  res.json({ user: req.user });
});

// API Routes
app.post("/api/threat", authenticateJWT, async (req, res) => {
  const { signal, value, nodeId } = req.body;
  console.log(`[THREAT] Received signal: ${signal} from ${nodeId}`);

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Telemetry Signal: ${signal}, Value: ${value || "N/A"}, Node: ${nodeId || "Main"}`,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        tools: [{ functionDeclarations: [requestNewQuantumKeyTool] }],
      }
    });

    const functionCalls = response.functionCalls;
    let decision = "NO_REKEY";
    let reason = response.text || "Analyzed as non-critical.";

    if (functionCalls && functionCalls.some(f => f.name === "request_new_quantum_key")) {
      const call = functionCalls.find(f => f.name === "request_new_quantum_key");
      const args: any = call?.args;
      reason = args.threat_description;
      decision = "REKEY";

      // Execute QKD Simulation
      const isEve = signal === "EVE_DETECTED";
      const qkdResponse = simulateBB84(32, isEve, 0.01);

      if (qkdResponse.success) {
        const newKeyId = Math.random().toString(36).substring(7).toUpperCase();
        currentKeyState = {
          keyId: newKeyId,
          keyValue: qkdResponse.key?.substring(0, 8) + "...",
          qber: qkdResponse.qber,
          timestamp: new Date().toISOString(),
          status: "ACTIVE"
        };
        
        auditLog.push({
          timestamp: currentKeyState.timestamp,
          threat: { signal, value },
          decision: "REKEY",
          reason,
          newKeyId,
          qber: qkdResponse.qber
        });
      } else {
        currentKeyState.status = "COMPROMISED";
        auditLog.push({
          timestamp: new Date().toISOString(),
          threat: { signal, value },
          decision: "REKEY_FAILED",
          reason: qkdResponse.error || "failed",
          qber: qkdResponse.qber
        });
      }
    } else {
      auditLog.push({
        timestamp: new Date().toISOString(),
        threat: { signal, value },
        decision: "NO_ACTION",
        reason
      });
    }

    res.json({ decision, reason, currentKeyState });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Orchestration failed" });
  }
});

app.get("/api/ai/suggestion", authenticateJWT, async (req, res) => {
  const { qber, threat } = req.query;
  
  try {
    const response = await ai.models.generateContent({
      model: "gemini-1.5-flash",
      contents: `You are the FALLOUT Intelligence Agent. Based on the current telemetry, provide a short (1-2 sentences), actionable security recommendation.
      Current QBER: ${qber || "2.4"}%
      Active Threats: ${threat || "NONE"}
      
      Output ONLY a JSON object: {"text": "...", "type": "info" | "warning" | "critical"}`,
    });

    const resultText = response.text || "{}";
    const result = JSON.parse(resultText.replace(/```json|```/g, ""));
    res.json(result);
  } catch (error) {
    res.json({ text: "Maintain current trust baseline. Monitor for basis shifts.", type: "info" });
  }
});

app.post("/api/agent/orchestrate", authenticateJWT, async (req, res) => {
  const { message } = req.body;
  
  try {
    const memoryContext = globalAgentMemory.map(m => `[${m.relevance}] ${m.content}`).join("\n");
    
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Context from Memory Bank:\n${memoryContext}\n\nUser Request: ${message}`,
      config: {
        systemInstruction: MULTI_AGENT_SYSTEM_PROMPT,
      }
    });

    const resultText = response.text || "{}";
    const result = JSON.parse(resultText.replace(/```json|```/g, ""));
    
    // Auto-save memory if suggested
    if (result.memory) {
      const newMemory = {
        id: "m" + Date.now(),
        content: result.memory.content,
        relevance: result.memory.relevance || "GENERAL",
        timestamp: new Date().toISOString()
      };
      globalAgentMemory.push(newMemory);
      result.memory = newMemory; // Return the enriched memory object
    }

    res.json(result);
  } catch (error) {
    console.error("[ORCHESTRATOR_ERROR]", error);
    res.status(500).json({ error: "Intelligence Core failure. Please check telemetry bindings." });
  }
});

app.get("/api/agent/memory", authenticateJWT, (req, res) => {
  res.json(globalAgentMemory.slice().reverse());
});

// --- Low-Latency Performance Routes ---
app.post("/api/quantum/fast-handshake", authenticateJWT, (req, res) => {
  const { n_qubits, noise, eve } = req.body;
  const result = fastBB84(n_qubits || 1024, noise || 0.01, eve || false);
  
  // Simulation of "Edge Caching"
  const cacheKey = `handshake_${n_qubits}_${noise}`;
  latencyCache.set(cacheKey, result);

  res.json(result);
});

app.get("/api/quantum/telemetry-optimized", authenticateJWT, (req, res) => {
  const stats = {
    avgLatency: 0.124, // ms
    throughputKeysPerSec: 15400,
    edgeCacheHitRate: 0.94,
    nodeStatus: "OPTIMIZED",
    protocolVersion: "Node-WASM-v4"
  };

  // If client accepts msgpack, we send it raw
  if (req.headers["accept"] === "application/x-msgpack") {
    res.setHeader("Content-Type", "application/x-msgpack");
    return res.send(msgpack.encode(stats));
  }
  
  res.json(stats);
});

app.get("/api/key/status", authenticateJWT, (req, res) => {
  res.json(currentKeyState);
});

app.get("/api/audit", authenticateJWT, (req, res) => {
  res.json(auditLog.slice().reverse().slice(0, 20));
});

// --- Sentiment Pipeline Routes ---
app.post("/api/sentiment/predict", authenticateJWT, async (req, res) => {
  const { text } = req.body;
  if (!text) return res.status(400).json({ error: "Text is required" });

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Perform sentiment analysis on this movie review. Classify it as POSITIVE or NEGATIVE and provide a confidence level between 0 and 1. Output ONLY a JSON object: {"label": "...", "confidence": ...}. 
      Review: "${text}"`,
    });

    const resultText = response.text || "{}";
    const result = JSON.parse(resultText.replace(/```json|```/g, ""));
    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Sentiment analysis failed" });
  }
});

app.get("/api/sentiment/metrics", authenticateJWT, (req, res) => {
  res.json(sentimentMetrics);
});

app.get("/api/sentiment/logs", authenticateJWT, (req, res) => {
  res.json(trainingLogs);
});

// --- Billing & Monetization Routes ---
app.post("/api/billing/create-checkout-session", authenticateJWT, async (req: any, res) => {
  const { priceId, email, name } = req.body;
  const user = req.user;

  try {
    // 1. Get or create customer
    let stripeCustomer;
    const existing = billingState.customers.find(c => c.email === email);
    
    if (existing) {
      stripeCustomer = await stripe.customers.retrieve(existing.stripeId);
    } else {
      stripeCustomer = await stripe.customers.create({
        email,
        name,
        metadata: { userId: user.id }
      });
      billingState.customers.push({ stripeId: stripeCustomer.id, email, name });
    }

    // 2. Create session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "subscription",
      customer: stripeCustomer.id,
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${req.headers.origin}/billing`,
      cancel_url: `${req.headers.origin}/billing`,
      allow_promotion_codes: true,
    });

    res.json({ url: session.url });
  } catch (error: any) {
    console.error("[STRIPE_CHECKOUT_ERROR]", error);
    res.status(500).json({ error: error.message || "Checkout failed" });
  }
});

app.post("/api/billing/create-portal-session", authenticateJWT, async (req: any, res) => {
  const { email } = req.body;
  const customer = billingState.customers.find(c => c.email === email);

  if (!customer) {
    return res.status(404).json({ error: "Customer not found in billing system" });
  }

  try {
    const session = await stripe.billingPortal.sessions.create({
      customer: customer.stripeId,
      return_url: `${req.headers.origin}/billing`,
    });
    res.json({ url: session.url });
  } catch (error: any) {
    res.status(500).json({ error: "Portal session failed" });
  }
});

app.get("/api/billing/subscriptions", authenticateJWT, (req: any, res) => {
  const user = req.user;
  const customer = billingState.customers.find(c => c.email === user.email);
  if (!customer) return res.json([]);
  
  const subs = billingState.subscriptions.filter(s => s.customerId === customer.stripeId);
  res.json(subs);
});

app.get("/api/docs/:id", authenticateJWT, async (req, res) => {
  const { id } = req.params;
  const fileMap: Record<string, string> = {
    "blueprint": "QUANTUM_AI_BLUEPRINT.md",
    "agent-plan": "AI_AGENT_ENTERPRISE_PLAN.md",
    "multi-agent": "MULTI_AGENT_BLUEPRINT.md",
    "routing": "ROUTING_BLUEPRINT.md",
    "orchestration": "ORCHESTRATION_BLUEPRINT.md",
    "qiskit": "QUANTUM_QISKIT_BLUEPRINT.md",
    "ai-models": "AI_MODELS_BLUEPRINT.md",
    "hitl": "HITL_BLUEPRINT.md",
    "quantum-trust": "QUANTUM_TRUST_BLUEPRINT.md",
    "low-latency": "LOW_LATENCY_QUANTUM_BLUEPRINT.md",
    "military-defence": "MILITARY_DEFENCE_BLUEPRINT.md",
    "frontend-ux": "FRONTEND_UX_BLUEPRINT.md",
    "ux-upgrade": "FRONTEND_UX_UPGRADE.md"
  };
  
  const fileName = fileMap[id];
  if (!fileName) return res.status(404).json({ error: "Document not found" });

  const blueprintPath = path.join(process.cwd(), "docs", fileName);
  try {
    const content = await import("fs/promises").then(fs => fs.readFile(blueprintPath, "utf-8"));
    res.json({ content });
  } catch (error) {
    res.status(500).json({ error: "Could not read document" });
  }
});

// Vite Middleware
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[FALLOUT] Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
