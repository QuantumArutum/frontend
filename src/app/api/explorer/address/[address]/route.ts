import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ address: string }> }
) {
  const { address } = await params;
  
  // 基于地址生成一致的数据
  const addrNum = parseInt(address.slice(2, 10), 16) || 1;
  
  const addressInfo = {
    address,
    balance: '0x' + (BigInt(1000e18) * BigInt((addrNum % 100) + 1)).toString(16),
    balanceUSD: (addrNum % 100 + 1) * 1000,
    transactionCount: (addrNum % 500) + 10,
    isContract: (addrNum % 10) === 0, // 10%的地址是合约
  };

  return NextResponse.json(addressInfo);
}
