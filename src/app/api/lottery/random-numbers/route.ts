/**
 * 彩票随机号码生成 API - 生产级安全实现
 * 使用加密安全的随机数生成器
 */

import { NextRequest, NextResponse } from 'next/server';
import { createSecureHandler, successResponse } from '@/lib/security/middleware';
import crypto from 'crypto';

// 使用加密安全的随机数生成
function secureRandomInt(min: number, max: number): number {
  const range = max - min + 1;
  const bytesNeeded = Math.ceil(Math.log2(range) / 8);
  const maxValid = Math.floor(256 ** bytesNeeded / range) * range - 1;
  
  let randomValue: number;
  do {
    const randomBytes = crypto.randomBytes(bytesNeeded);
    randomValue = 0;
    for (let i = 0; i < bytesNeeded; i++) {
      randomValue = (randomValue << 8) + randomBytes[i];
    }
  } while (randomValue > maxValid);
  
  return min + (randomValue % range);
}

export const POST = createSecureHandler(
  async (_request: NextRequest): Promise<NextResponse> => {
    // 使用加密安全的随机数生成前区号码
    const frontZone: number[] = [];
    while (frontZone.length < 5) {
      const num = secureRandomInt(1, 35);
      if (!frontZone.includes(num)) frontZone.push(num);
    }
    frontZone.sort((a, b) => a - b);

    // 使用加密安全的随机数生成后区号码
    const backZone: number[] = [];
    while (backZone.length < 2) {
      const num = secureRandomInt(1, 12);
      if (!backZone.includes(num)) backZone.push(num);
    }
    backZone.sort((a, b) => a - b);

    return successResponse({
      data: { 
        bets: [{
          front_zone: frontZone.map(n => n.toString().padStart(2, '0')),
          back_zone: backZone.map(n => n.toString().padStart(2, '0'))
        }]
      },
      timestamp: new Date().toISOString()
    });
  },
  { rateLimit: true, allowedMethods: ['POST'] }
);
