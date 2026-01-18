/**
 * Trading Management API - Admin
 * GET /api/v2/peatio/admin/trading - Get all trades
 */

import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');
    const status = searchParams.get('status');
    const type = searchParams.get('type');
    const pair = searchParams.get('pair');

    // Generate demo trading data
    const pairs = ['BTC/USDT', 'ETH/USDT', 'BNB/USDT', 'QAU/USDT', 'DOT/USDT'];
    const users = ['user001', 'user002', 'user003', 'trader001', 'whale001'];
    const statuses = ['completed', 'pending', 'cancelled'];

    let trades = [];
    for (let i = 0; i < 100; i++) {
      const pairName = pairs[Math.floor(Math.random() * pairs.length)];
      const tradeType = Math.random() > 0.5 ? 'buy' : 'sell';
      const amount = parseFloat((Math.random() * 10 + 0.1).toFixed(6));
      const price = parseFloat((Math.random() * 50000 + 1000).toFixed(2));
      const total = parseFloat((amount * price).toFixed(2));
      const fee = parseFloat((total * 0.001).toFixed(2));
      const tradeStatus = statuses[Math.floor(Math.random() * statuses.length)];

      trades.push({
        id: `T${Date.now()}-${i}`,
        pair: pairName,
        type: tradeType,
        amount,
        price,
        total,
        fee,
        status: tradeStatus,
        user: users[Math.floor(Math.random() * users.length)],
        userId: `user_${Math.floor(Math.random() * 1000)}`,
        timestamp: new Date(Date.now() - Math.floor(Math.random() * 168) * 3600000).toISOString(),
      });
    }

    // Apply filters
    if (status && status !== 'all') {
      trades = trades.filter((t) => t.status === status);
    }
    if (type && type !== 'all') {
      trades = trades.filter((t) => t.type === type);
    }
    if (pair) {
      trades = trades.filter((t) => t.pair.toLowerCase().includes(pair.toLowerCase()));
    }

    // Sort by timestamp
    trades.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    const total = trades.length;
    const paginatedTrades = trades.slice((page - 1) * limit, page * limit);

    // Calculate stats
    const completedTrades = trades.filter((t) => t.status === 'completed');
    const stats = {
      totalTrades: completedTrades.length,
      totalVolume: completedTrades.reduce((sum, t) => sum + t.total, 0),
      totalFees: completedTrades.reduce((sum, t) => sum + t.fee, 0),
      buyCount: trades.filter((t) => t.type === 'buy').length,
      sellCount: trades.filter((t) => t.type === 'sell').length,
    };

    return NextResponse.json({
      trades: paginatedTrades,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
      stats,
    });
  } catch (error) {
    console.error('Trading API error:', error);
    return NextResponse.json({ error: 'Failed to fetch trades' }, { status: 500 });
  }
}
