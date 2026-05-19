# ☢️ FALLOUT – Foundation for Adaptive, Low‑Latency Optical Quantum Trust

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Python 3.10+](https://img.shields.io/badge/python-3.10+-blue.svg)](https://www.python.org/downloads/)
[![Qiskit](https://img.shields.io/badge/Qiskit-1.0+-purple.svg)](https://qiskit.org/)
[![Gemini AI](https://img.shields.io/badge/Gemini_AI-2.0_Pro-cyan.svg)](https://ai.google.dev/)

**FALLOUT** is an autonomous quantum key orchestration system that combines **Gemini AI agents** with **Qiskit‑powered BB84 quantum key distribution (QKD)**. It delivers real‑time, trust‑aware encryption key management for mission‑critical environments – from enterprise data centers to military drone swarms.

![FALLOUT Banner](https://via.placeholder.com/800x200?text=FALLOUT+-+Quantum+Trust+for+Autonomous+Systems)

---

## 📖 Table of Contents

- [Overview](#-overview)
- [Architecture](#-architecture)
- [Key Features](#-key-features)
- [Diagrams](#-diagrams)
  - [System Architecture](#system-architecture)
  - [BB84 Quantum Key Exchange](#bb84-quantum-key-exchange)
  - [Gemini Agent Decision Flow](#gemini-agent-decision-flow)
- [Installation](#-installation)
- [Quick Start](#-quick-start)
- [Modules](#-modules)
- [Military & Enterprise Extensions](#-military--enterprise-extensions)
- [API Reference](#-api-reference)
- [Testing](#-testing)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🧠 Overview

FALLOUT solves a critical problem: **how to generate, distribute, and refresh quantum‑secure encryption keys automatically**, without human intervention, while adapting to real‑time threats (eavesdropping, jamming, high error rates).

It combines three breakthrough technologies:

1. **Quantum Layer** – BB84 QKD simulation using Qiskit Aer (or real IBM Quantum hardware).
2. **AI Orchestration** – Gemini agents that monitor threat signals, apply security policies, and trigger rekey operations.
3. **Low‑Latency Optimisations** – Asynchronous pipelining, GPU acceleration, lightweight LDPC error correction, and pre‑computed basis patterns.

The result: a **zero‑touch key management system** that responds to threats in under 2 seconds, ideal for defence, finance, and critical infrastructure.

---

## 🏗 Architecture

FALLOUT follows a **sandwich architecture**:

```
┌─────────────────────────────────────────────────────────────────┐
│                     USER / OPERATOR DASHBOARD                    │
│                    (Streamlit – real‑time status)                │
└───────────────────────────────┬─────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                   GEMINI ORCHESTRATOR LAYER                      │
│  ┌────────────┐  ┌────────────┐  ┌────────────────────────┐    │
│  │Intel Analyst│  │Policy Keeper│  │ Orchestrator Agent    │    │
│  │ (analyses   │  │ (checks     │  │ (calls Qiskit tool)   │    │
│  │  threats)   │  │  rules)     │  │                        │    │
│  └────────────┘  └────────────┘  └────────────────────────┘    │
└───────────────────────────────┬─────────────────────────────────┘
                                │ (function call)
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                    QISKIT QUANTUM ENGINE                         │
│  • BB84 protocol simulation (Aer / real hardware)               │
│  • Error correction (Cascade / LDPC)                            │
│  • Privacy amplification (Toeplitz FFT hashing)                 │
│  • GPU acceleration (qiskit‑aer‑gpu)                            │
└───────────────────────────────┬─────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                      FASTAPI MIDDLEWARE                          │
│   • REST endpoints: /api/threat, /api/key/status, /api/audit    │
│   • In‑memory state & audit log                                 │
│   • Asynchronous approval webhooks (human‑in‑the‑loop)          │
└─────────────────────────────────────────────────────────────────┘
```

All components communicate via HTTP or async messaging, making FALLOUT modular and deployable on edge devices (NVIDIA Jetson, Raspberry Pi) or cloud VMs.

---

## ✨ Key Features

| Feature | Description |
|---------|-------------|
| **Autonomous Rekeying** | Gemini agents decide when to generate fresh quantum keys based on QBER, timer, or eavesdropper detection. |
| **Low‑Latency QKD** | < 100 ms end‑to‑end key generation for 128‑bit keys (simulated). |
| **Military‑Grade Security** | HMAC‑SHA256 authentication, zeroisation, revocation authority, anti‑GPS‑spoofing. |
| **Multi‑Agent Support** | Swarm coordination, MANET key relay, satellite‑ground QKD. |
| **Human‑in‑the‑Loop** | Optional approval dashboard for high‑risk actions. |
| **GPU Acceleration** | 5‑10x speedup on NVIDIA GPUs (via `qiskit‑aer‑gpu`). |
| **Real Hardware Ready** | Works with IBM Quantum backends (free tier). |

---

## 📐 Diagrams

### System Architecture (Detailed)

```ascii
         ┌─────────────┐          ┌──────────────────┐
         │   Threat    │          │   Gemini API     │
         │   Source    │─────────►│  (Agent prompt)  │
         │ (simulator) │          └────────┬─────────┘
         └─────────────┘                   │
                                           │ function call
                                           ▼
┌────────────────────┐            ┌────────────────────┐
│  Streamlit         │◄───────────│  FastAPI Server    │
│  Dashboard         │   REST     │  (main.py)         │
│  - key status      │            │  - /api/threat     │
│  - QBER timeline   │            │  - /api/key/status │
│  - audit log       │            │  - /api/audit      │
└────────────────────┘            └─────────┬──────────┘
                                             │
                                             │ calls
                                             ▼
                                    ┌────────────────────┐
                                    │  bb84_engine.py    │
                                    │  - get_quantum_key │
                                    │  - Qiskit Aer sim  │
                                    └────────────────────┘
```

### BB84 Quantum Key Exchange (Protocol Flow)

```ascii
Alice (sender)                              Bob (receiver)
     │                                           │
     │  1. Choose random bits & bases            │
     │  2. Prepare qubits                        │
     │─────────────────────────────────────────►│
     │                                           │ 3. Measure in random bases
     │  4. Publish bases (classical)             │
     │◄─────────────────────────────────────────│
     │                                           │
     │  5. Sift matching bases                   │
     │  6. Compute QBER on subset                │
     │                                           │
     │  7. Error correction (Cascade / LDPC)     │
     │◄─────────────────────────────────────────►│
     │                                           │
     │  8. Privacy amplification (hashing)       │
     │                                           │
     │  9. Shared secret key                     │
     │◄═════════════════════════════════════════►│
```

### Gemini Agent Decision Flow (ReAct Loop)

```ascii
  ┌─────────────────────────────────────────────────────────┐
  │  User / system sends threat: "QBER_SPIKE: 0.12"         │
  └─────────────────────────────┬───────────────────────────┘
                                ▼
  ┌─────────────────────────────────────────────────────────┐
  │  Gemini Intel Analyst Agent                             │
  │  "Interpretation: Quantum channel error rate is 12%."   │
  └─────────────────────────────┬───────────────────────────┘
                                ▼
  ┌─────────────────────────────────────────────────────────┐
  │  Gemini Policy Keeper Agent                             │
  │  "Policy: Rekey if QBER > 8%. 12% > 8% → REKEY."        │
  └─────────────────────────────┬───────────────────────────┘
                                ▼
  ┌─────────────────────────────────────────────────────────┐
  │  Gemini Orchestrator Agent calls tool:                  │
  │  request_new_quantum_key(threat="QBER spike", qber=0.12)│
  └─────────────────────────────┬───────────────────────────┘
                                ▼
  ┌─────────────────────────────────────────────────────────┐
  │  Qiskit BB84 engine runs → returns new key & QBER       │
  └─────────────────────────────┬───────────────────────────┘
                                ▼
  ┌─────────────────────────────────────────────────────────┐
  │  Dashboard updates: new Key ID, audit log entry.        │
  └─────────────────────────────────────────────────────────┘
```

---

## ⚙️ Installation

### Prerequisites
- Python 3.10 or higher
- pip (Python package manager)
- (Optional) NVIDIA GPU with CUDA for `qiskit-aer-gpu`

### Clone the repository
```bash
git clone https://github.com/your-org/fallout.git
cd fallout
```

### Set up virtual environment
```bash
python -m venv venv
source venv/bin/activate   # Linux/Mac
venv\Scripts\activate      # Windows
```

### Install dependencies
```bash
pip install -r requirements.txt
```

### Set environment variables
Create a `.env` file:
```ini
GEMINI_API_KEY=your_google_ai_studio_key
IBM_QUANTUM_TOKEN=optional_for_real_hardware
```

### Verify installation
```bash
python -c "from qiskit import QuantumCircuit; print('Qiskit OK')"
```

---

## 🚀 Quick Start

### 1. Run the low‑latency QKD demo
```bash
python examples/run_low_latency_demo.py
```
Expected output:
```
[INFO] Generating 128‑bit quantum key...
[INFO] BB84 simulation completed. QBER: 0.023
[INFO] Final key: a7f3e9c2... (masked)
[INFO] Time taken: 0.42 seconds
```

### 2. Launch the full agent dashboard
```bash
# Terminal 1: FastAPI backend
uvicorn main:app --reload --port 8000

# Terminal 2: Streamlit dashboard
streamlit run dashboard.py
```
Open http://localhost:8501 to see the live dashboard. Use the sidebar to inject threats (QBER spike, timer expired, Eve detected) and watch the Gemini agent rekey automatically.

### 3. Run the military drone swarm simulation
```bash
python examples/drone_swarm_sim.py --num-drones 5 --duration 30
```
This simulates 5 drones exchanging quantum keys every 5 seconds, with a jamming event at t=15s.

---

## 📦 Modules

| Module | Path | Description |
|--------|------|-------------|
| **BB84 Engine** | `bb84_engine.py` | Qiskit‑based BB84 with eavesdropper, noise, and decoy states. |
| **Gemini Orchestrator** | `gemini_orchestrator.py` | Three‑agent system (Intel, Policy, Orchestrator) with function calling. |
| **FastAPI Server** | `main.py` | REST endpoints for threat injection, key status, audit log. |
| **Streamlit Dashboard** | `dashboard.py` | Real‑time visualisation of QBER, key ID, audit trail. |
| **Low‑Latency Optimisations** | `async_qkd.py`, `fast_ldpc.py`, `fast_hashing.py` | Asynchronous pipelining, GPU support, LDPC, Toeplitz hashing. |
| **Military Extensions** | `drone_swarm.py`, `tactical_manet.py`, `satellite_qkd.py` | Swarm coordination, MANET, anti‑jamming, GPS anti‑spoofing. |
| **Human‑in‑the‑Loop** | `approval_service.py` | Pending approval requests with Slack / email integration. |

---

## 🎖 Military & Enterprise Extensions

FALLOUT can be tailored for high‑assurance environments:

- **Drone Swarm Coordination** – Quantum keys distributed among UAVs with automatic rekeying under jamming.
- **Tactical MANET** – Mobile ad‑hoc network with quantum trust scores and key relay.
- **Satellite‑to‑Ground QKD** – LEO satellite passes with atmospheric turbulence compensation.
- **Cryptographic Agility** – Instant key revocation via central authority; zeroisation on tamper.
- **GPS Anti‑Spoofing** – Quantum random nonces for navigation message authentication.

See the [`military_fallout/`](./military_fallout) directory for complete implementations.

---

## 📡 API Reference

### `POST /api/threat`
Inject a threat signal. The Gemini agent will decide whether to rekey.

**Request body:**
```json
{
  "signal": "QBER_SPIKE",
  "value": 0.12,
  "node_id": "drone-05"
}
```

**Response:**
```json
{
  "decision": "REKEY",
  "reason": "QBER 0.12 exceeds threshold 0.08",
  "new_key_id": "a1b2c3d4",
  "qber": 0.12
}
```

### `GET /api/key/status`
Returns current key information.

### `GET /api/audit?limit=50`
Returns the last `limit` audit log entries.

---

## 🧪 Testing

Run all unit tests:
```bash
pytest tests/
```

Run specific module tests:
```bash
pytest tests/test_bb84.py -v
pytest tests/test_gemini_orchestrator.py -v
```

For military extensions:
```bash
pytest military_fallout/tests/
```

---

## 🤝 Contributing

We welcome contributions! Please read [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines. Areas that need help:
- Real‑time FPGA integration for QKD
- Additional error correction algorithms
- More realistic optical channel models
- Kubernetes Helm charts for deployment

---

## 📄 License

FALLOUT is released under the **MIT License**. See [LICENSE](LICENSE) for details.

**Disclaimer:** The quantum simulations and cryptography in this repository are for research and demonstration purposes only. For production military or financial systems, use certified hardware and consult relevant security standards.

---

## 🌟 Acknowledgements

- Qiskit team for the open‑source quantum SDK.
- Google Gemini for AI reasoning and function calling.
- Contributors from the lablab.ai “Transforming Enterprise Through AI” hackathon.

---

**Star ⭐ this repository if you find FALLOUT useful for your quantum‑trust projects!**
