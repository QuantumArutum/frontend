import { NextResponse } from 'next/server';

export async function GET() {
  // 模拟量子系统状态数据
  const mockStatus = {
    status: 'operational',
    version: '1.0.0',
    uptime: Date.now() - Math.random() * 86400000, // 随机运行时间
    quantumSecurity: {
      level: 'NIST Level 3',
      algorithms: ['CRYSTALS-Dilithium', 'CRYSTALS-Kyber', 'SPHINCS+'],
      keyStrength: '256-bit',
      encryptionStatus: 'active',
    },
    systemHealth: {
      cpu: Math.floor(Math.random() * 30) + 10, // 10-40% CPU使用率
      memory: Math.floor(Math.random() * 40) + 30, // 30-70% 内存使用率
      disk: Math.floor(Math.random() * 20) + 15, // 15-35% 磁盘使用率
      network: 'stable',
    },
    security: {
      threatLevel: 'low',
      lastScan: new Date().toISOString(),
      vulnerabilities: 0,
      firewallStatus: 'active',
      intrusionDetection: 'active',
    },
    performance: {
      transactionsPerSecond: Math.floor(Math.random() * 500) + 1000, // 1000-1500 TPS
      averageResponseTime: Math.floor(Math.random() * 50) + 10, // 10-60ms
      errorRate: (Math.random() * 0.1).toFixed(3), // 0-0.1% 错误率
      availability: '99.9%',
    },
    lastUpdated: new Date().toISOString(),
  };

  return NextResponse.json(mockStatus);
}
