import { NextResponse } from 'next/server';

export async function GET() {
  // 模拟支持的量子算法列表
  const mockAlgorithms = {
    postQuantumSignatures: [
      {
        name: 'CRYSTALS-Dilithium',
        version: '3.1',
        securityLevel: 'NIST Level 3',
        keySize: '1952 bytes',
        signatureSize: '3293 bytes',
        status: 'active',
        description: 'Lattice-based digital signature scheme',
        performance: {
          keyGeneration: '0.5ms',
          signing: '1.2ms',
          verification: '0.8ms'
        }
      },
      {
        name: 'SPHINCS+',
        version: '3.0',
        securityLevel: 'NIST Level 5',
        keySize: '64 bytes',
        signatureSize: '49856 bytes',
        status: 'active',
        description: 'Hash-based signature scheme',
        performance: {
          keyGeneration: '2.1ms',
          signing: '45.3ms',
          verification: '1.5ms'
        }
      },
      {
        name: 'FALCON',
        version: '1.2',
        securityLevel: 'NIST Level 1',
        keySize: '897 bytes',
        signatureSize: '690 bytes',
        status: 'experimental',
        description: 'Lattice-based compact signature',
        performance: {
          keyGeneration: '1.8ms',
          signing: '2.5ms',
          verification: '1.1ms'
        }
      }
    ],
    postQuantumEncryption: [
      {
        name: 'CRYSTALS-Kyber',
        version: '3.0',
        securityLevel: 'NIST Level 3',
        keySize: '1568 bytes',
        ciphertextSize: '1568 bytes',
        status: 'active',
        description: 'Lattice-based key encapsulation mechanism',
        performance: {
          keyGeneration: '0.3ms',
          encapsulation: '0.4ms',
          decapsulation: '0.6ms'
        }
      },
      {
        name: 'SABER',
        version: '2.0',
        securityLevel: 'NIST Level 3',
        keySize: '1568 bytes',
        ciphertextSize: '1568 bytes',
        status: 'experimental',
        description: 'Module lattice-based KEM',
        performance: {
          keyGeneration: '0.4ms',
          encapsulation: '0.5ms',
          decapsulation: '0.7ms'
        }
      }
    ],
    hashFunctions: [
      {
        name: 'SHA-3',
        version: '1.0',
        outputSize: '256 bits',
        status: 'active',
        description: 'Keccak-based cryptographic hash function',
        performance: {
          throughput: '150 MB/s'
        }
      },
      {
        name: 'BLAKE3',
        version: '1.0',
        outputSize: '256 bits',
        status: 'active',
        description: 'High-performance cryptographic hash function',
        performance: {
          throughput: '300 MB/s'
        }
      }
    ],
    quantumRandom: [
      {
        name: 'Quantum RNG',
        version: '1.0',
        source: 'Quantum vacuum fluctuations',
        status: 'active',
        description: 'True quantum random number generator',
        performance: {
          rate: '1 Mbps',
          entropy: '1.0 bits/bit'
        }
      }
    ],
    metadata: {
      totalAlgorithms: 7,
      activeAlgorithms: 5,
      experimentalAlgorithms: 2,
      lastUpdated: new Date().toISOString(),
      complianceStandards: ['NIST Post-Quantum', 'FIPS 140-2', 'Common Criteria']
    }
  };

  return NextResponse.json(mockAlgorithms);
}
