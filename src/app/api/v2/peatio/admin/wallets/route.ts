/**
 * Wallets Management API - Admin
 * GET /api/v2/peatio/admin/wallets - Get wallet overview
 */

import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // Demo wallet data
    const wallets = [
      {
        id: 'btc_hot',
        currency: 'BTC',
        name: 'Bitcoin Hot Wallet',
        type: 'hot',
        balance: 125.5,
        usdValue: 8471250,
        address: '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa',
        status: 'active',
        lastActivity: new Date().toISOString(),
      },
      {
        id: 'btc_cold',
        currency: 'BTC',
        name: 'Bitcoin Cold Wallet',
        type: 'cold',
        balance: 850.0,
        usdValue: 57375000,
        address: '3J98t1WpEZ73CNmQviecrnyiWrnqRhWNLy',
        status: 'active',
        lastActivity: new Date(Date.now() - 86400000).toISOString(),
      },
      {
        id: 'eth_hot',
        currency: 'ETH',
        name: 'Ethereum Hot Wallet',
        type: 'hot',
        balance: 2500.0,
        usdValue: 8625000,
        address: '0x742d35Cc6634C0532925a3b844Bc9e7595f',
        status: 'active',
        lastActivity: new Date().toISOString(),
      },
      {
        id: 'eth_cold',
        currency: 'ETH',
        name: 'Ethereum Cold Wallet',
        type: 'cold',
        balance: 15000.0,
        usdValue: 51750000,
        address: '0x8ba1f109551bD432803012645Ac136ddd64DBA72',
        status: 'active',
        lastActivity: new Date(Date.now() - 172800000).toISOString(),
      },
      {
        id: 'usdt_hot',
        currency: 'USDT',
        name: 'USDT Hot Wallet',
        type: 'hot',
        balance: 5000000.0,
        usdValue: 5000000,
        address: 'TN3W4H6rK2ce4vX9YnFQHwKENnHjoxb3m9',
        status: 'active',
        lastActivity: new Date().toISOString(),
      },
      {
        id: 'qau_hot',
        currency: 'QAU',
        name: 'QAU Hot Wallet',
        type: 'hot',
        balance: 50000000.0,
        usdValue: 42500000,
        address: '0xQAU742d35Cc6634C0532925a3b844Bc9e7595f',
        status: 'active',
        lastActivity: new Date().toISOString(),
      },
      {
        id: 'qau_cold',
        currency: 'QAU',
        name: 'QAU Cold Wallet',
        type: 'cold',
        balance: 200000000.0,
        usdValue: 170000000,
        address: '0xQAU8ba1f109551bD432803012645Ac136ddd64DBA72',
        status: 'active',
        lastActivity: new Date(Date.now() - 259200000).toISOString(),
      },
    ];

    // Calculate totals
    const hotWallets = wallets.filter((w) => w.type === 'hot');
    const coldWallets = wallets.filter((w) => w.type === 'cold');

    const stats = {
      totalAssetValue: wallets.reduce((sum, w) => sum + w.usdValue, 0),
      hotWalletAssets: hotWallets.reduce((sum, w) => sum + w.usdValue, 0),
      coldWalletAssets: coldWallets.reduce((sum, w) => sum + w.usdValue, 0),
      totalWallets: wallets.length,
      hotWalletCount: hotWallets.length,
      coldWalletCount: coldWallets.length,
      hotWalletPercent: (
        (hotWallets.reduce((sum, w) => sum + w.usdValue, 0) /
          wallets.reduce((sum, w) => sum + w.usdValue, 0)) *
        100
      ).toFixed(2),
    };

    return NextResponse.json({
      wallets,
      stats,
    });
  } catch (error) {
    console.error('Wallets API error:', error);
    return NextResponse.json({ error: 'Failed to fetch wallets' }, { status: 500 });
  }
}
