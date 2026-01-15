/**
 * Withdrawals Management API - Admin
 * GET /api/v2/peatio/admin/withdrawals - Get all withdrawals
 * PUT /api/v2/peatio/admin/withdrawals - Update withdrawal status
 */

import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '25');
    const status = searchParams.get('status');
    const currency = searchParams.get('currency');
    const riskLevel = searchParams.get('riskLevel');
    
    const db = await getDb();
    
    // Check if withdrawals table exists
    const tableExists = await db.get(
      "SELECT name FROM sqlite_master WHERE type='table' AND name='withdrawals'"
    );
    
    if (!tableExists) {
      // Create withdrawals table
      await db.exec(`
        CREATE TABLE IF NOT EXISTS withdrawals (
          id TEXT PRIMARY KEY,
          user_id TEXT NOT NULL,
          user_name TEXT,
          currency TEXT NOT NULL,
          amount REAL NOT NULL,
          fee REAL NOT NULL,
          net_amount REAL NOT NULL,
          to_address TEXT NOT NULL,
          tx_hash TEXT,
          status TEXT DEFAULT 'pending',
          network TEXT,
          usd_value REAL,
          risk_score INTEGER DEFAULT 0,
          requires_manual_review INTEGER DEFAULT 0,
          reviewed_by TEXT,
          reviewed_at DATETIME,
          reject_reason TEXT,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `);
      
      // Insert demo data
      const currencies = ['BTC', 'ETH', 'USDT', 'BNB', 'ADA', 'DOT'];
      const networks: Record<string, string> = {
        BTC: 'Bitcoin',
        ETH: 'Ethereum',
        USDT: 'TRC20',
        BNB: 'BSC',
        ADA: 'Cardano',
        DOT: 'Polkadot'
      };
      const users = ['john.doe', 'alice.smith', 'bob.wilson', 'carol.brown', 'david.jones'];
      const statuses = ['pending', 'approved', 'processing', 'completed', 'failed', 'cancelled'];
      
      for (let i = 0; i < 50; i++) {
        const curr = currencies[Math.floor(Math.random() * currencies.length)];
        const amount = parseFloat((Math.random() * 5 + 0.1).toFixed(6));
        const fee = amount * 0.002;
        const riskScore = Math.floor(Math.random() * 100);
        const requiresManualReview = riskScore > 70 || amount > 1 ? 1 : 0;
        const statusVal = statuses[Math.floor(Math.random() * statuses.length)];
        
        await db.run(`
          INSERT INTO withdrawals (id, user_id, user_name, currency, amount, fee, net_amount, to_address, tx_hash, status, network, usd_value, risk_score, requires_manual_review, created_at)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now', '-' || ? || ' hours'))
        `, [
          `WD${Date.now()}-${i}`,
          `user_${Math.floor(Math.random() * 1000)}`,
          users[Math.floor(Math.random() * users.length)],
          curr,
          amount,
          fee,
          amount - fee,
          `${curr.toLowerCase()}_${Math.random().toString(36).substring(7)}`,
          statusVal === 'completed' ? `0x${Math.random().toString(16).substring(2)}` : null,
          statusVal,
          networks[curr],
          amount * (Math.random() * 50000 + 1000),
          riskScore,
          requiresManualReview,
          Math.floor(Math.random() * 168)
        ]);
      }
    }
    
    // Build query
    let query = 'SELECT * FROM withdrawals WHERE 1=1';
    const params: any[] = [];
    
    if (status && status !== 'all') {
      query += ' AND status = ?';
      params.push(status);
    }
    
    if (currency && currency !== 'all') {
      query += ' AND currency = ?';
      params.push(currency);
    }
    
    if (riskLevel) {
      if (riskLevel === 'low') {
        query += ' AND risk_score <= 40';
      } else if (riskLevel === 'medium') {
        query += ' AND risk_score > 40 AND risk_score <= 70';
      } else if (riskLevel === 'high') {
        query += ' AND risk_score > 70';
      }
    }
    
    // Get total count
    const countResult = await db.get(
      query.replace('SELECT *', 'SELECT COUNT(*) as count'),
      params
    );
    
    // Add pagination
    query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
    params.push(limit, (page - 1) * limit);
    
    const withdrawals = await db.all(query, params);
    
    // Get statistics
    const stats = await db.get(`
      SELECT 
        COUNT(*) as total,
        SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending,
        SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) as completed,
        SUM(CASE WHEN status = 'completed' THEN usd_value ELSE 0 END) as total_value,
        SUM(CASE WHEN risk_score > 70 THEN 1 ELSE 0 END) as high_risk
      FROM withdrawals
    `);
    
    return NextResponse.json({
      withdrawals: withdrawals.map(w => ({
        id: w.id,
        userId: w.user_id,
        userName: w.user_name,
        currency: w.currency,
        amount: w.amount,
        fee: w.fee,
        netAmount: w.net_amount,
        toAddress: w.to_address,
        txHash: w.tx_hash,
        status: w.status,
        network: w.network,
        usdValue: w.usd_value,
        riskScore: w.risk_score,
        requiresManualReview: w.requires_manual_review === 1,
        reviewedBy: w.reviewed_by,
        reviewedAt: w.reviewed_at,
        rejectReason: w.reject_reason,
        timestamp: w.created_at
      })),
      pagination: {
        page,
        limit,
        total: countResult?.count || 0,
        totalPages: Math.ceil((countResult?.count || 0) / limit)
      },
      stats: {
        total: stats?.total || 0,
        pending: stats?.pending || 0,
        completed: stats?.completed || 0,
        totalValue: stats?.total_value || 0,
        highRisk: stats?.high_risk || 0
      }
    });
  } catch (error) {
    console.error('Withdrawals API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch withdrawals' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, action, rejectReason, reviewedBy } = body;
    
    if (!id || !action) {
      return NextResponse.json(
        { error: 'Withdrawal ID and action are required' },
        { status: 400 }
      );
    }
    
    const db = await getDb();
    
    let newStatus = '';
    if (action === 'approve') {
      newStatus = 'approved';
    } else if (action === 'reject') {
      newStatus = 'cancelled';
    } else if (action === 'process') {
      newStatus = 'processing';
    } else if (action === 'complete') {
      newStatus = 'completed';
    }
    
    await db.run(`
      UPDATE withdrawals 
      SET status = ?,
          reviewed_by = ?,
          reviewed_at = CURRENT_TIMESTAMP,
          reject_reason = ?
      WHERE id = ?
    `, [newStatus, reviewedBy || 'admin', rejectReason || null, id]);
    
    return NextResponse.json({
      success: true,
      message: `Withdrawal ${action}d successfully`
    });
  } catch (error) {
    console.error('Update withdrawal error:', error);
    return NextResponse.json(
      { error: 'Failed to update withdrawal' },
      { status: 500 }
    );
  }
}
