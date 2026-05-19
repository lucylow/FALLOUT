/**
 * BB84 Quantum Key Distribution Simulation (TypeScript)
 * Simulates signal transmission, sifting, and error estimation.
 */

export interface QKDResult {
  success: boolean;
  key?: string;
  qber: number;
  rawKeyLength: number;
  siftedKeyLength: number;
  eveDetected: boolean;
  error?: string;
}

export enum Basis {
  Z = 0, // Computational (0/1)
  X = 1, // Hadamard (+/-)
}

export function simulateBB84(
  desiredLength: number = 32,
  evePresent: boolean = false,
  noiseProb: number = 0.01
): QKDResult {
  const QBER_THRESHOLD = 0.11; // 11% threshold for detection
  const MAX_ATTEMPTS = 5;
  let attempt = 0;
  let totalRawBits = desiredLength * 4; // Start with 4x desired length

  while (attempt < MAX_ATTEMPTS) {
    const aliceBits: number[] = [];
    const aliceBases: Basis[] = [];
    const bobBases: Basis[] = [];
    const bobMeasured: number[] = [];

    // 1. Preparation
    for (let i = 0; i < totalRawBits; i++) {
      aliceBits.push(Math.random() < 0.5 ? 0 : 1);
      aliceBases.push(Math.random() < 0.5 ? Basis.Z : Basis.X);
      bobBases.push(Math.random() < 0.5 ? Basis.Z : Basis.X);
    }

    // 2. Transmission & Potential Eavesdropping
    for (let i = 0; i < totalRawBits; i++) {
      let bitAtBob = aliceBits[i];
      let stateAtBobBasis = aliceBases[i];

      if (evePresent) {
        // Eve chooses a random basis to measure
        const eveBasis = Math.random() < 0.5 ? Basis.Z : Basis.X;
        
        // If Eve's basis matches Alice's, she gets the right bit and doesn't disturb state.
        // If it doesn't match (50% chance), she collapses it.
        if (eveBasis !== aliceBases[i]) {
          // Measurement in wrong basis collapses state
          bitAtBob = Math.random() < 0.5 ? 0 : 1;
          stateAtBobBasis = eveBasis; // Eve resends in her measured basis
        }
      }

      // Add random depolarizing noise
      if (Math.random() < noiseProb) {
        bitAtBob = Math.random() < 0.5 ? 0 : 1;
      }

      // Bob measures in his basis
      if (bobBases[i] === stateAtBobBasis) {
        bobMeasured.push(bitAtBob);
      } else {
        // Bob measures in a different basis from what arrived -> 50/50 result
        bobMeasured.push(Math.random() < 0.5 ? 0 : 1);
      }
    }

    // 3. Sifting
    const siftedAlice: number[] = [];
    const siftedBob: number[] = [];
    for (let i = 0; i < totalRawBits; i++) {
      if (aliceBases[i] === bobBases[i]) {
        siftedAlice.push(aliceBits[i]);
        siftedBob.push(bobMeasured[i]);
      }
    }

    // 4. Error Estimation
    if (siftedAlice.length === 0) {
      attempt++;
      totalRawBits *= 2;
      continue;
    }

    let mismatches = 0;
    for (let i = 0; i < siftedAlice.length; i++) {
      if (siftedAlice[i] !== siftedBob[i]) {
        mismatches++;
      }
    }

    const qber = mismatches / siftedAlice.length;

    if (qber > QBER_THRESHOLD) {
      return {
        success: false,
        qber,
        rawKeyLength: totalRawBits,
        siftedKeyLength: siftedAlice.length,
        eveDetected: true,
        error: `QBER exceeds threshold (${(qber * 100).toFixed(2)}%)`
      };
    }

    if (siftedAlice.length >= desiredLength) {
      const finalKey = siftedAlice.slice(0, desiredLength).join('');
      return {
        success: true,
        key: finalKey,
        qber,
        rawKeyLength: totalRawBits,
        siftedKeyLength: siftedAlice.length,
        eveDetected: false
      };
    }

    // Not enough bits, try again with more qubits
    totalRawBits = Math.floor(totalRawBits * 1.5);
    attempt++;
  }

  return {
    success: false,
    qber: 1,
    rawKeyLength: totalRawBits,
    siftedKeyLength: 0,
    eveDetected: false,
    error: "Failed to generate sufficient key length after multiple attempts"
  };
}
