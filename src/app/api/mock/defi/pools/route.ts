import { NextResponse } from 'next/server';

// 仅在开发环境使用的模拟DeFi流动性池API
export async function GET() {
  // 检查是否应该使用模拟API
  if (process.env.NODE_ENV === 'production' && process.env.USE_MOCK_API !== 'true') {
    return NextResponse.json({ error: 'Mock API not available in production' }, { status: 404 });
  }

  // 模拟流动性池数据
  const mockLiquidityPools = [
    {
      pool_id: 'QAU-USDT',
      token_a: 'QAU',
      token_b: 'USDT',
      reserve_a: 1250000,
      reserve_b: 2500000,
      total_liquidity: 3750000,
      fee_rate: 0.003,
      price: 2.0,
      apy: 15.6,
    },
    {
      pool_id: 'QAU-ETH',
      token_a: 'QAU',
      token_b: 'ETH',
      reserve_a: 800000,
      reserve_b: 400,
      total_liquidity: 1600000,
      fee_rate: 0.003,
      price: 0.0005,
      apy: 22.3,
    },
    {
      pool_id: 'QAU-BTC',
      token_a: 'QAU',
      token_b: 'BTC',
      reserve_a: 500000,
      reserve_b: 12.5,
      total_liquidity: 1000000,
      fee_rate: 0.005,
      price: 0.000025,
      apy: 18.9,
    },
    {
      pool_id: 'USDT-ETH',
      token_a: 'USDT',
      token_b: 'ETH',
      reserve_a: 2000000,
      reserve_b: 800,
      total_liquidity: 4000000,
      fee_rate: 0.003,
      price: 0.0004,
      apy: 12.4,
    },
    {
      pool_id: 'QAU-USDC',
      token_a: 'QAU',
      token_b: 'USDC',
      reserve_a: 750000,
      reserve_b: 1500000,
      total_liquidity: 2250000,
      fee_rate: 0.003,
      price: 2.0,
      apy: 14.2,
    },
  ];

  return NextResponse.json({
    success: true,
    data: mockLiquidityPools,
    timestamp: new Date().toISOString(),
    total_pools: mockLiquidityPools.length,
    total_tvl: mockLiquidityPools.reduce((sum, pool) => sum + pool.total_liquidity, 0),
    _note:
      'This is mock data for development. In production, this will be replaced with real blockchain data.',
  });
}
