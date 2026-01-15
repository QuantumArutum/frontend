/**
 * Trading Management API - Admin
 * GET /api/v2/peatio/admin/trading - Get all trades
 */

import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');
    const status = searchParams.get('status');
    const type = searchParams.get('type');
    const pair = searchParams.get('pair');
    
    const db = await getDb();
    
    // Check if trades table exists, if not create demo data
    const tableExists = await db.get(
      "SELECT name FROM sqlite_master WHERE type='table' AND name='trades'"
    );
    
    if (!tableExists) {
      // Create trades table
      await db.exec(`
        CREATE TABLE IF NOT EXISTS trades (
          id TEXT PRIMARY KEY,
          pair TEXT NOT NULL,
          type TEXT NOT NULL,
          amount REAL NOT NULL,
          price REAL NOT NULL,
          total REAL NOT NULL,
          fee REAL NOT NULL,
          status TEXT DEFAULT 'completed',
          user_id TEXT,
          user_name TEXT,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `);
      
      // Insert demo data
      const pairs = ['BTC/USDT', 'ETH/USDT', 'BNB/USDT', 'ADA/USDT', 'DOT/USDT'];
      const users = ['user001', 'user002', 'user003', 'trader001', 'whale001'];
      const statuses = ['completed', 'pending', 'cancelled'];
      
      for (let i = 0; i < 100; i++) {
        const pairName = pairs[Math.floor(Math.random() * pairs.length)];
        const tradeType = Math.random() > 0.5 ? 'buy' : 'sell';
        const amount = parseFloat((Math.random() * 10 + 0.1).toFixed(6));
        const price = parseFloat((Math.random() * 50000 + 1000).toFixed(2));
        const total = parseFloat((amount * price).toFixed(2));
        const fee = parseFloat((total * 0.001).toFixed(2));
        
        await db.run(`
          INSERT INTO trades (id, pair, type, amount, price, total, fee, status, user_id, user_name, created_at)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now', '-' || ? || ' hours'))
        `, [
          `T${Date.now()}-${i}`,
          pairName,
          tradeType,
          amount,
          price,
          total,
          fee,
          statuses[Math.floor(Math.random() * statuses.length)],
          `user_${Math.floor(Math.random() * 1000)}`,
          users[Math.floor(Math.random() * users.length)],
          Math.floor(Math.random() * 168)
        ]);
      }
    }
    
    // Build query
    let query = 'SELECT * FROM trades WHERE 1=1';
    const params: any[] = [];
    
    if (status && status !== 'all') {
      query += ' AND status = ?';
      params.push(status);
    }
    
    if (type && type !== 'all') {
      query += ' AND type = ?';
      params.push(type);
    }
    
    if (pair) {
      query += ' AND pair LIKE ?';
      params.push(`%${pair}%`);
    }
    
    // Get total count
    const countResult = await db.get(
      query.replace('SELECT *', 'SELECT COUNT(*) as count'),
      params
    );
    
    // Add pagination
    query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
    params.push(limit, (page - 1) * limit);
    
    const trades = await db.all(query, params);
    
    // Get statistics
    const stats = await db.get(`
      SELECT 
        COUNT(*) as total_trades,
        SUM(CASE WHEN status = 'completed' THEN total ELSE 0 END) as total_volume,
        SUM(CASE WHEN status = 'completed' THEN fee ELSE 0 END) as total_fees,
        SUM(CASE WHEN type = 'buy' THEN 1 ELSE 0 END) as buy_count,
        SUM(CASE WHEN type = 'sell' THEN 1 ELSE 0 END) as sell_count
      FROM trades
      WHERE created_at >= datetime('now', '-24 hours')
    `);
    
    return NextResponse.json({
      trades: trades.map(t => ({
        id: t.id,
        pair: t.pair,
        type: t.type,
        amount: t.amount,
        price: t.price,
        total: t.total,
        fee: t.fee,
        status: t.status,
        user: t.user_name,
        userId: t.user_id,
        timestamp: t.created_at
      })),
      pagination: {
        page,
        limit,
        total: countResult?.count || 0,
        totalPages: Math.ceil((countResult?.count || 0) / limit)
      },
      stats: {
        totalTrades: stats?.total_trades || 0,
        totalVolume: stats?.total_volume || 0,
        totalFees: stats?.total_fees || 0,
        buyCount: stats?.buy_count || 0,
        sellCount: stats?.sell_count || 0
      }
    });
  } catch (error) {
    console.error('Trading API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch trades' },
      { status: 500 }
    );
  }
}
