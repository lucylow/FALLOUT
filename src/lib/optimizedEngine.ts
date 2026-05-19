import { LRUCache } from 'lru-cache';

/**
 * High-Performance Quantum Simulation Engine (v4.0 Optimized)
 * Uses TypedArrays for sub-millisecond bit manipulations and LRU caching for pattern reuse.
 */

export interface OptimizedQKDResult {
  latencyMs: number;
  qber: number;
  key: string;
  cacheHit: boolean;
  timestamp: string;
}

// Caching layer (Mocking "Redis" at the edge)
const patternCache = new LRUCache<string, Uint8Array>({
  max: 500,
  ttl: 1000 * 60 * 5, // 5 minutes
});

/**
 * Fast BB84 implementation using TypedArrays.
 * Minimizes GC pressure by avoiding object allocation in hot loops.
 */
export function fastBB84(
  n_qubits: number = 1024, 
  noise_prob: number = 0.01, 
  eve_present: boolean = false
): OptimizedQKDResult {
  const start = performance.now();
  
  // 1. Memory Buffers (Pre-allocated for speed)
  const aliceBits = new Uint8Array(n_qubits);
  const aliceBases = new Uint8Array(n_qubits);
  const bobBases = new Uint8Array(n_qubits);
  const bobMeasured = new Uint8Array(n_qubits);

  // 2. Preparation & Transmission (Hot Loop)
  for (let i = 0; i < n_qubits; i++) {
    aliceBits[i] = Math.random() < 0.5 ? 0 : 1;
    aliceBases[i] = Math.random() < 0.5 ? 0 : 1;
    bobBases[i] = Math.random() < 0.5 ? 0 : 1;

    let qubit = aliceBits[i];

    // Eavesdropping disturbance
    if (eve_present) {
      const eveBasis = Math.random() < 0.5 ? 0 : 1;
      if (eveBasis !== aliceBases[i]) {
        if (Math.random() < 0.5) qubit = 1 - qubit;
      }
    }

    // Measurement logic
    if (bobBases[i] === aliceBases[i]) {
      bobMeasured[i] = qubit;
    } else {
      bobMeasured[i] = Math.random() < 0.5 ? 0 : 1;
    }

    // Noise injection
    if (Math.random() < noise_prob) {
      bobMeasured[i] = 1 - bobMeasured[i];
    }
  }

  // 3. Sifting (Highly optimized pairing)
  let mismatches = 0;
  let siftedCount = 0;
  let keyBuffer = "";

  for (let i = 0; i < n_qubits; i++) {
    if (aliceBases[i] === bobBases[i]) {
      if (aliceBits[i] !== bobMeasured[i]) {
        mismatches++;
      }
      if (siftedCount < 128) { // Extract 128-bit key
        keyBuffer += aliceBits[i];
      }
      siftedCount++;
    }
  }

  const qber = siftedCount > 0 ? mismatches / siftedCount : 1;
  const end = performance.now();

  return {
    latencyMs: end - start,
    qber,
    key: keyBuffer,
    cacheHit: false,
    timestamp: new Date().toISOString()
  };
}

/**
 * Predictive Basis Pattern Generator
 * Simulates "Edge" pattern pre-distribution.
 */
export function getOptimizedPattern(seed: string, length: number): Uint8Array {
  const cacheKey = `${seed}_${length}`;
  const existing = patternCache.get(cacheKey);
  if (existing) return existing;

  const pattern = new Uint8Array(length);
  for (let i = 0; i < length; i++) pattern[i] = Math.random() < 0.5 ? 0 : 1;
  patternCache.set(cacheKey, pattern);
  return pattern;
}
