/**
 * Wallets Management API - Admin
 * GET /api/v2/peatio/admin/wallets - Get wallet overview
 */

import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const db = await getDb();
    
    // Check if wallets table exists
    const tableExists = await db.get(
      "SELECT name FROM sqlite_master WHERE type='table' AND name='admin_wallets'"
    );
    
    if (!tableExists) {
      // Create wallets table
      await db.exec(`
        CREATE TABLE IF NOT EXISTS admin_wallets (
          id TEXT PRIMARY KEY,
          currency TEXT NOT NULL UNIQUE,
          symbol TEXT NOT NULL,
          total_balance REAL DEFAULT 0,
          available_balance REAL DEFAULT 0,
          frozen_balance REAL DEFAULT 0,
          hot_wallet_balance REAL DEFAULT 0,
          cold_wallet_balance REAL DEFAULT 0,
          usd_value REAL DEFAULT 0,
          price REAL DEFAULT 0,
          change_24h REAL DEFAULT 0,
          status TEXT DEFAULT 'normal',
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `);
      
      // Insert default wallet data
      const currencies = [
        { currency: 'Bitcoin', symbol: 'BTC', price: 43250.50 },
        { currency: 'Ethereum', symbol: 'ETH', price: 2680.75 },
        { currency: 'Binance Coin', symbol: 'BNB', price: 315.25 },
        { currency: 'Cardano', symbol: 'ADA', price: 0.485 },
        { currency: 'Polkadot', symbol: 'DOT', price: 5.67 },
        { currency: 'Chainlink', symbol: 'LINK', price: 14.82 },
        { currency: 'Tether', symbol: 'USDT', price: 1.00 },
        { currency: 'USD Coin', symbol: 'USDC', price: 1.00 },
        { currency: 'Quantaureum', symbol: 'QAU', price: 0.15 },
      ];
      
      for (const curr of currencies) {
        const totalBalance = Math.random() * 10000 + 1000;
        const frozenBalance = totalBalance * (Math.random() * 0.1);
        const availableBalance = totalBalance - frozenBalance;
        const hotWalletRatio = Math.random() * 0.3 + 0.1;
        const hotWalletBalance = totalBalance * hotWalletRatio;
        const coldWalletBalance = totalBalance - hotWalletBalance;
        
        await db.run(`
          INSERT INTO admin_wallets (id, currency, symbol, total_balance, available_balance, frozen_balance, hot_wallet_balance, cold_wallet_balance, usd_value, price, change_24h, status)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, [
          `wallet_${curr.symbol}`,
          curr.currency,
          curr.symbol,
          totalBalance,
          availableBalance,
          frozenBalance,
          hotWalletBalance,
          coldWalletBalance,
          totalBalance * curr.price,
          curr.price,
          (Math.random() - 0.5) * 20,
          Math.random() > 0.1 ? 'normal' : 'maintenance'
        ]);
      }
    }
    
    const wallets = await db.all('SELECT * FROM admin_wallets ORDER BY usd_value DESC');
    
    // Calculate totals
    const totals = wallets.reduce((acc, w) => ({
      totalUsdValue: acc.totalUsdValue + (w.usd_value || 0),
      hotWalletTotal: acc.hotWalletTotal + (w.hot_wallet_balance * w.price || 0),
      coldWalletTotal: acc.coldWalletTotal + (w.cold_wallet_balance * w.price || 0),
      frozenTotal: acc.frozenTotal + (w.frozen_balance * w.price || 0)
    }), { totalUsdValue: 0, hotWalletTotal: 0, coldWalletTotal: 0, frozenTotal: 0 });
    
    return NextResponse.json({
      wallets: wallets.map(w => ({
        currency: w.currency,
        symbol: w.symbol,
        totalBalance: w.total_balance,
        availableBalance: w.available_balance,
        frozenBalance: w.frozen_balance,
        hotWalletBalance: w.hot_wallet_balance,
        coldWalletBalance: w.cold_wallet_balance,
        usdValue: w.usd_value,
        price: w.price,
        change24h: w.change_24h,
        status: w.status
      })),
      totals: {
        totalUsdValue: totals.totalUsdValue,
        hotWalletTotal: totals.hotWalletTotal,
        coldWalletTotal: totals.coldWalletTotal,
        frozenTotal: totals.frozenTotal
      }
    });
  } catch (error) {
    console.error('Wallets API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch wallets' },
      { status: 500 }
    );
  }
}
