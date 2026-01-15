/**
 * Withdrawals Management API - Admin
 * GET /api/v2/peatio/admin/withdrawals - Get all withdrawals
 */

import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');
    const status = searchParams.get('status');
    const currency = searchParams.get('currency');
    
    // Demo withdrawals data
    const currencies = ['BTC', 'ETH', 'USDT', 'QAU', 'BNB'];
    const statuses = ['pending', 'approved', 'processing', 'completed', 'failed', 'cancelled'];
    const networks = ['ERC20', 'TRC20', 'BEP20', 'Native'];
    
    let withdrawals = [];
    for (let i = 0; i < 80; i++) {
      const curr = currencies[Math.floor(Math.random() * currencies.length)];
      const amount = parseFloat((Math.random() * 10 + 0.1).toFixed(6));
      const withdrawalStatus = statuses[Math.floor(Math.random() * statuses.length)];
      const riskScore = Math.floor(Math.random() * 100);
      
      withdrawals.push({
        id: `W${Date.now()}-${i}`,
        userId: `user_${Math.floor(Math.random() * 1000)}`,
        userName: `user${Math.floor(Math.random() * 100)}@example.com`,
        currency: curr,
        network: networks[Math.floor(Math.random() * networks.length)],
        amount,
        fee: parseFloat((amount * 0.001).toFixed(6)),
        address: `0x${Math.random().toString(16).substr(2, 40)}`,
        txid: withdrawalStatus === 'completed' ? `0x${Math.random().toString(16).substr(2, 64)}` : null,
        status: withdrawalStatus,
        riskScore,
        requiresManualReview: riskScore > 70,
        createdAt: new Date(Date.now() - Math.floor(Math.random() * 168) * 3600000).toISOString(),
        processedAt: withdrawalStatus === 'completed' ? new Date().toISOString() : null
      });
    }
    
    // Apply filters
    if (status && status !== 'all') {
      withdrawals = withdrawals.filter(w => w.status === status);
    }
    if (currency && currency !== 'all') {
      withdrawals = withdrawals.filter(w => w.currency === currency);
    }
    
    // Sort by createdAt
    withdrawals.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    
    const total = withdrawals.length;
    const paginatedWithdrawals = withdrawals.slice((page - 1) * limit, page * limit);
    
    // Calculate stats
    const stats = {
      totalWithdrawals: withdrawals.length,
      pendingWithdrawals: withdrawals.filter(w => w.status === 'pending').length,
      completedWithdrawals: withdrawals.filter(w => w.status === 'completed').length,
      totalValue: withdrawals.filter(w => w.status === 'completed').reduce((sum, w) => sum + w.amount, 0),
      highRiskCount: withdrawals.filter(w => w.riskScore > 70).length
    };
    
    return NextResponse.json({
      withdrawals: paginatedWithdrawals,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      },
      stats
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
    const { id, action, reason } = body;
    
    // In production, update database
    if (action === 'approve') {
      return NextResponse.json({
        success: true,
        message: `Withdrawal ${id} approved`
      });
    } else if (action === 'reject') {
      return NextResponse.json({
        success: true,
        message: `Withdrawal ${id} rejected: ${reason}`
      });
    }
    
    return NextResponse.json({
      success: false,
      message: 'Invalid action'
    }, { status: 400 });
  } catch (error) {
    console.error('Withdrawals PUT error:', error);
    return NextResponse.json(
      { error: 'Failed to update withdrawal' },
      { status: 500 }
    );
  }
}
