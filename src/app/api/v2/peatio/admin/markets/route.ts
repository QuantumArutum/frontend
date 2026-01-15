/**
 * Markets Management API - Admin
 * GET /api/v2/peatio/admin/markets - Get all markets
 * POST /api/v2/peatio/admin/markets - Create market
 * PUT /api/v2/peatio/admin/markets - Update market
 */

import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const db = await getDb();
    
    // Check if markets table exists
    const tableExists = await db.get(
      "SELECT name FROM sqlite_master WHERE type='table' AND name='markets'"
    );
    
    if (!tableExists) {
      // Create markets table
      await db.exec(`
        CREATE TABLE IF NOT EXISTS markets (
          id TEXT PRIMARY KEY,
          pair TEXT NOT NULL UNIQUE,
          base_asset TEXT NOT NULL,
          quote_asset TEXT NOT NULL,
          price REAL DEFAULT 0,
          change_24h REAL DEFAULT 0,
          volume_24h REAL DEFAULT 0,
          high_24h REAL DEFAULT 0,
          low_24h REAL DEFAULT 0,
          trading_fee REAL DEFAULT 0.1,
          min_order_size REAL DEFAULT 0.001,
          status TEXT DEFAULT 'active',
          is_active INTEGER DEFAULT 1,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `);
      
      // Insert default markets
      const defaultMarkets = [
        { base: 'BTC', quote: 'USDT', price: 43250.50, minOrder: 0.0001 },
        { base: 'ETH', quote: 'USDT', price: 2680.75, minOrder: 0.001 },
        { base: 'BNB', quote: 'USDT', price: 315.25, minOrder: 0.01 },
        { base: 'ADA', quote: 'USDT', price: 0.485, minOrder: 1 },
        { base: 'DOT', quote: 'USDT', price: 5.67, minOrder: 0.1 },
        { base: 'LINK', quote: 'USDT', price: 14.82, minOrder: 0.1 },
        { base: 'XRP', quote: 'USDT', price: 0.52, minOrder: 1 },
        { base: 'LTC', quote: 'USDT', price: 72.15, minOrder: 0.01 },
        { base: 'QAU', quote: 'USDT', price: 0.15, minOrder: 10 },
        { base: 'QAU', quote: 'BTC', price: 0.0000035, minOrder: 10 },
      ];
      
      for (const market of defaultMarkets) {
        const change = (Math.random() - 0.5) * 20;
        const high = market.price * (1 + Math.random() * 0.05);
        const low = market.price * (1 - Math.random() * 0.05);
        const volume = Math.random() * 10000000 + 100000;
        
        await db.run(`
          INSERT INTO markets (id, pair, base_asset, quote_asset, price, change_24h, volume_24h, high_24h, low_24h, trading_fee, min_order_size, status, is_active)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, [
          `market_${market.base}_${market.quote}`,
          `${market.base}/${market.quote}`,
          market.base,
          market.quote,
          market.price,
          change,
          volume,
          high,
          low,
          0.1,
          market.minOrder,
          'active',
          1
        ]);
      }
    }
    
    const markets = await db.all('SELECT * FROM markets ORDER BY volume_24h DESC');
    
    return NextResponse.json({
      markets: markets.map(m => ({
        id: m.id,
        pair: m.pair,
        baseAsset: m.base_asset,
        quoteAsset: m.quote_asset,
        price: m.price,
        change24h: m.change_24h,
        volume24h: m.volume_24h,
        high24h: m.high_24h,
        low24h: m.low_24h,
        tradingFee: m.trading_fee,
        minOrderSize: m.min_order_size,
        status: m.status,
        isActive: m.is_active === 1,
        createdAt: m.created_at,
        updatedAt: m.updated_at
      }))
    });
  } catch (error) {
    console.error('Markets API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch markets' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { baseAsset, quoteAsset, tradingFee, minOrderSize, status } = body;
    
    if (!baseAsset || !quoteAsset) {
      return NextResponse.json(
        { error: 'Base asset and quote asset are required' },
        { status: 400 }
      );
    }
    
    const db = await getDb();
    const pair = `${baseAsset}/${quoteAsset}`;
    const id = `market_${baseAsset}_${quoteAsset}`;
    
    // Check if market already exists
    const existing = await db.get('SELECT id FROM markets WHERE pair = ?', [pair]);
    if (existing) {
      return NextResponse.json(
        { error: 'Market already exists' },
        { status: 400 }
      );
    }
    
    await db.run(`
      INSERT INTO markets (id, pair, base_asset, quote_asset, trading_fee, min_order_size, status, is_active)
      VALUES (?, ?, ?, ?, ?, ?, ?, 1)
    `, [id, pair, baseAsset, quoteAsset, tradingFee || 0.1, minOrderSize || 0.001, status || 'active']);
    
    return NextResponse.json({
      success: true,
      message: 'Market created successfully',
      market: { id, pair, baseAsset, quoteAsset }
    });
  } catch (error) {
    console.error('Create market error:', error);
    return NextResponse.json(
      { error: 'Failed to create market' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, tradingFee, minOrderSize, status, isActive } = body;
    
    if (!id) {
      return NextResponse.json(
        { error: 'Market ID is required' },
        { status: 400 }
      );
    }
    
    const db = await getDb();
    
    await db.run(`
      UPDATE markets 
      SET trading_fee = COALESCE(?, trading_fee),
          min_order_size = COALESCE(?, min_order_size),
          status = COALESCE(?, status),
          is_active = COALESCE(?, is_active),
          updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `, [tradingFee, minOrderSize, status, isActive !== undefined ? (isActive ? 1 : 0) : null, id]);
    
    return NextResponse.json({
      success: true,
      message: 'Market updated successfully'
    });
  } catch (error) {
    console.error('Update market error:', error);
    return NextResponse.json(
      { error: 'Failed to update market' },
      { status: 500 }
    );
  }
}
