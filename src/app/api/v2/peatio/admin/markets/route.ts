/**
 * Markets Management API - Admin
 * GET /api/v2/peatio/admin/markets - Get all markets/trading pairs
 */

import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');
    const status = searchParams.get('status');
    
    // Demo markets data
    const allMarkets = [
      { id: 'btcusdt', base: 'BTC', quote: 'USDT', name: 'BTC/USDT', price: 67500.00, change24h: 2.5, volume24h: 125000000, high24h: 68200, low24h: 66800, status: 'active', makerFee: 0.001, takerFee: 0.001 },
      { id: 'ethusdt', base: 'ETH', quote: 'USDT', name: 'ETH/USDT', price: 3450.00, change24h: 1.8, volume24h: 85000000, high24h: 3520, low24h: 3380, status: 'active', makerFee: 0.001, takerFee: 0.001 },
      { id: 'qauusdt', base: 'QAU', quote: 'USDT', name: 'QAU/USDT', price: 0.85, change24h: 5.2, volume24h: 2500000, high24h: 0.88, low24h: 0.80, status: 'active', makerFee: 0.0005, takerFee: 0.001 },
      { id: 'bnbusdt', base: 'BNB', quote: 'USDT', name: 'BNB/USDT', price: 580.00, change24h: -0.5, volume24h: 45000000, high24h: 590, low24h: 575, status: 'active', makerFee: 0.001, takerFee: 0.001 },
      { id: 'adausdt', base: 'ADA', quote: 'USDT', name: 'ADA/USDT', price: 0.45, change24h: 3.2, volume24h: 15000000, high24h: 0.47, low24h: 0.43, status: 'active', makerFee: 0.001, takerFee: 0.001 },
      { id: 'dotusdt', base: 'DOT', quote: 'USDT', name: 'DOT/USDT', price: 7.20, change24h: -1.2, volume24h: 8000000, high24h: 7.50, low24h: 7.10, status: 'active', makerFee: 0.001, takerFee: 0.001 },
      { id: 'solusdt', base: 'SOL', quote: 'USDT', name: 'SOL/USDT', price: 145.00, change24h: 4.5, volume24h: 35000000, high24h: 148, low24h: 138, status: 'active', makerFee: 0.001, takerFee: 0.001 },
      { id: 'xrpusdt', base: 'XRP', quote: 'USDT', name: 'XRP/USDT', price: 0.52, change24h: 0.8, volume24h: 12000000, high24h: 0.54, low24h: 0.50, status: 'suspended', makerFee: 0.001, takerFee: 0.001 },
      { id: 'linkusdt', base: 'LINK', quote: 'USDT', name: 'LINK/USDT', price: 14.50, change24h: 2.1, volume24h: 6000000, high24h: 15.00, low24h: 14.00, status: 'active', makerFee: 0.001, takerFee: 0.001 },
      { id: 'avaxusdt', base: 'AVAX', quote: 'USDT', name: 'AVAX/USDT', price: 35.00, change24h: -2.3, volume24h: 9000000, high24h: 36.50, low24h: 34.00, status: 'maintenance', makerFee: 0.001, takerFee: 0.001 },
    ];
    
    // Apply filters
    let markets = [...allMarkets];
    if (status && status !== 'all') {
      markets = markets.filter(m => m.status === status);
    }
    
    const total = markets.length;
    const paginatedMarkets = markets.slice((page - 1) * limit, page * limit);
    
    return NextResponse.json({
      markets: paginatedMarkets,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      },
      stats: {
        totalMarkets: allMarkets.length,
        activeMarkets: allMarkets.filter(m => m.status === 'active').length,
        suspendedMarkets: allMarkets.filter(m => m.status === 'suspended').length,
        maintenanceMarkets: allMarkets.filter(m => m.status === 'maintenance').length,
        totalVolume24h: allMarkets.reduce((sum, m) => sum + m.volume24h, 0)
      }
    });
  } catch (error) {
    console.error('Markets API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch markets' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, status } = body;
    
    // In production, update database
    return NextResponse.json({
      success: true,
      message: `Market ${id} status updated to ${status}`
    });
  } catch (error) {
    console.error('Markets PUT error:', error);
    return NextResponse.json(
      { error: 'Failed to update market' },
      { status: 500 }
    );
  }
}
