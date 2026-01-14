/**
 * ICO Token Purchase API
 */

import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const { amount_usd, currency, wallet_address, gold_price } = await request.json();

    if (!wallet_address) {
      return NextResponse.json({ success: false, message: 'Wallet address required' }, { status: 400 });
    }

    if (!amount_usd || amount_usd <= 0) {
      return NextResponse.json({ success: false, message: 'Invalid amount' }, { status: 400 });
    }

    // Use provided gold price or default to 85 USD/gram
    const pricePerQau = gold_price || 85;
    const tokens = amount_usd / pricePerQau;

    const result = await db.createTokenPurchase({
      buyer_address: wallet_address,
      amount_usd,
      tokens_base: tokens,
      tokens_total: tokens,
      status: 'completed',
    });

    return NextResponse.json({
      success: true,
      message: 'Purchase successful',
      data: {
        order_id: result.data?.id,
        tokens: tokens.toFixed(6),
      },
    });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}
