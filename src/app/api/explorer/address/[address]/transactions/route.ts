import { NextRequest, NextResponse } from 'next/server';

const BLOCKCHAIN_RPC_URL = process.env.BLOCKCHAIN_RPC_URL || 'http://localhost:8545';

async function makeRPCCall(method: string, params: unknown[] = []) {
  try {
    const response = await fetch(BLOCKCHAIN_RPC_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ jsonrpc: '2.0', method, params, id: 1 }),
      signal: AbortSignal.timeout(10000),
    });
    if (!response.ok) throw new Error(`RPC failed: ${response.status}`);
    const result = await response.json();
    if (result.error) throw new Error(result.error.message);
    return result.result;
  } catch (error) {
    console.error(`RPC ${method} failed:`, error);
    return null;
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ address: string }> }
) {
  const { address } = await params;
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '20');

  try {
    // 获取最新区块高度
    const latestBlock = await makeRPCCall('eth_blockNumber', []);
    if (!latestBlock) {
      return NextResponse.json([]);
    }

    const latestHeight = parseInt(latestBlock, 16);
    const transactions: unknown[] = [];
    const normalizedAddress = address.toLowerCase();

    // 从最新区块向前搜索交易
    const blocksToSearch = Math.min(100, latestHeight); // 搜索最近100个区块

    for (let i = 0; i < blocksToSearch && transactions.length < limit * page; i++) {
      const blockNum = latestHeight - i;
      const block = await makeRPCCall('qau_getBlockByNumber', [`0x${blockNum.toString(16)}`, true]);

      if (block?.transactions) {
        for (const tx of block.transactions) {
          const txFrom = (tx.from || '').toLowerCase();
          const txTo = (tx.to || '').toLowerCase();

          if (txFrom === normalizedAddress || txTo === normalizedAddress) {
            transactions.push({
              hash: tx.hash,
              blockNumber: tx.blockNumber,
              blockHash: tx.blockHash,
              from: tx.from,
              to: tx.to,
              value: tx.value,
              gas: tx.gas,
              gasPrice: tx.gasPrice,
              gasUsed: tx.gasUsed || tx.gas,
              nonce: tx.nonce,
              input: tx.input,
              transactionIndex: tx.transactionIndex,
              timestamp: block.timestamp,
              status: 'success',
              type: txFrom === normalizedAddress ? 'send' : 'receive',
            });
          }
        }
      }
    }

    // 分页
    const start = (page - 1) * limit;
    const paginatedTxs = transactions.slice(start, start + limit);

    return NextResponse.json(paginatedTxs);
  } catch (error) {
    console.error('Failed to get address transactions:', error);
    return NextResponse.json([]);
  }
}
