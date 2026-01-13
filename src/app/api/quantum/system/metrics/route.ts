import { NextResponse } from 'next/server';

export async function GET() {
  // 模拟系统性能指标数据
  const mockMetrics = {
    timestamp: new Date().toISOString(),
    system: {
      cpu: {
        usage: Math.floor(Math.random() * 30) + 15, // 15-45%
        cores: 8,
        temperature: Math.floor(Math.random() * 20) + 45 // 45-65°C
      },
      memory: {
        total: 32768, // 32GB
        used: Math.floor(Math.random() * 10240) + 8192, // 8-18GB
        free: 0, // 计算得出
        cached: Math.floor(Math.random() * 4096) + 2048 // 2-6GB
      },
      disk: {
        total: 1024000, // 1TB
        used: Math.floor(Math.random() * 204800) + 102400, // 100-300GB
        free: 0, // 计算得出
        iops: Math.floor(Math.random() * 5000) + 1000 // 1000-6000 IOPS
      },
      network: {
        bytesIn: Math.floor(Math.random() * 1000000) + 500000,
        bytesOut: Math.floor(Math.random() * 800000) + 400000,
        packetsIn: Math.floor(Math.random() * 10000) + 5000,
        packetsOut: Math.floor(Math.random() * 8000) + 4000,
        errors: Math.floor(Math.random() * 5)
      }
    },
    quantum: {
      keyGeneration: {
        rate: Math.floor(Math.random() * 100) + 50, // 50-150 keys/sec
        success: 99.9,
        failures: Math.floor(Math.random() * 3)
      },
      encryption: {
        operations: Math.floor(Math.random() * 10000) + 5000,
        averageTime: Math.floor(Math.random() * 10) + 5, // 5-15ms
        throughput: Math.floor(Math.random() * 500) + 200 // 200-700 MB/s
      },
      algorithms: {
        dilithium: {
          operations: Math.floor(Math.random() * 1000) + 500,
          averageTime: Math.floor(Math.random() * 5) + 2 // 2-7ms
        },
        kyber: {
          operations: Math.floor(Math.random() * 1500) + 800,
          averageTime: Math.floor(Math.random() * 3) + 1 // 1-4ms
        },
        sphincs: {
          operations: Math.floor(Math.random() * 800) + 300,
          averageTime: Math.floor(Math.random() * 8) + 5 // 5-13ms
        }
      }
    },
    blockchain: {
      blockHeight: Math.floor(Math.random() * 1000) + 100000,
      transactionPool: Math.floor(Math.random() * 500) + 100,
      peerCount: Math.floor(Math.random() * 20) + 15,
      syncStatus: 'synced',
      lastBlockTime: new Date(Date.now() - Math.random() * 30000).toISOString()
    },
    security: {
      activeConnections: Math.floor(Math.random() * 100) + 50,
      blockedAttempts: Math.floor(Math.random() * 10),
      securityLevel: 'high',
      lastThreatDetection: new Date(Date.now() - Math.random() * 3600000).toISOString()
    }
  };

  // 计算派生值
  mockMetrics.system.memory.free = mockMetrics.system.memory.total - mockMetrics.system.memory.used;
  mockMetrics.system.disk.free = mockMetrics.system.disk.total - mockMetrics.system.disk.used;

  return NextResponse.json(mockMetrics);
}
