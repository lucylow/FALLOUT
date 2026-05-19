
import { KeyStatus } from "../types";

export interface QuantumGate {
  type: 'H' | 'X' | 'Z' | 'M' | 'ID';
  qubit: number;
  position: number;
}

export interface CircuitModel {
  qubits: number;
  gates: QuantumGate[];
}

/**
 * Generates a BB84 circuit model based on current key status
 */
export const generateBB84Model = (keyStatus: KeyStatus | null): CircuitModel => {
  if (!keyStatus) return { qubits: 4, gates: [] };

  const qubits = 4;
  const gates: QuantumGate[] = [];

  // Simulate Alice's Preparation
  for (let i = 0; i < qubits; i++) {
    // encode 0 or 1
    if (Math.random() > 0.5) gates.push({ type: 'X', qubit: i, position: 0 });
    // Pick basis
    if (Math.random() > 0.5) gates.push({ type: 'H', qubit: i, position: 1 });
  }

  // Simulate Bob's Measurement
  for (let i = 0; i < qubits; i++) {
    // Correct or random basis choice
    const correctBasis = Math.random() > keyStatus.qber;
    if (!correctBasis) {
      gates.push({ type: 'H', qubit: i, position: 2 });
    }
    gates.push({ type: 'M', qubit: i, position: 4 });
  }

  return { qubits, gates };
};
