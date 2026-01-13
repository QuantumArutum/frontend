/**
 * 代币销售订单API
 * 
 * 查询用户购买订单
 */

import { NextRequest, NextResponse } from 'next/server';
import { successResponse, errorResponse } from '@/lib/security/middleware';
import { SecurityLogger, SecurityEventType, getClientIP, getUserAgent } from '@/lib/security';
import { db } from '@/lib/database';

// GET: 查询订单列表
export async function GET(request: NextRequest): Promise<NextResponse> {
  const ip = getClientIP(request);
  const userAgent = getUserAgent(request);

  try {
    const { searchParams } = new URL(request.url);
    const address = searchParams.get('address');
    const orderId = searchParams.get('orderId');
    const status = searchParams.get('status');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = Math.min(parseInt(searchParams.get('limit') || '20'), 100);

    // 查询单个订单
    if (orderId) {
      const order = await db.findPurchaseById(orderId);
      if (!order) {
        return errorResponse('订单不存在', 404);
      }
      
      return successResponse({
        order: {
          id: order.id,
          buyerAddress: order.buyerAddress,
          amountUSD: order.amountUSD,
          tokensBase: order.tokensBase,
          tokensBonus: order.tokensBonus,
          tokensTotal: order.tokensTotal,
          paymentMethod: order.paymentMethod,
          paymentStatus: order.paymentStatus,
          status: order.status,
          txHash: order.txHash,
          createdAt: order.createdAt,
          completedAt: order.completedAt,
        },
        payment: null,
      });
    }

    // 查询地址的所有订单
    if (!address) {
      return errorResponse('请提供钱包地址或订单ID', 400);
    }

    // 验证地址格式
    if (!/^0x[a-fA-F0-9]{40}$/.test(address)) {
      return errorResponse('无效的钱包地址', 400);
    }

    const orders = await db.findPurchasesByAddress(address);
    
    // 过滤状态
    let filteredOrders = orders;
    if (status) {
      filteredOrders = orders.filter(o => o.status === status);
    }

    // 分页
    const total = filteredOrders.length;
    const startIndex = (page - 1) * limit;
    const paginatedOrders = filteredOrders
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(startIndex, startIndex + limit);

    // 计算统计
    const stats = {
      totalOrders: orders.length,
      completedOrders: orders.filter(o => o.status === 'completed').length,
      pendingOrders: orders.filter(o => o.status === 'pending').length,
      totalSpent: orders.filter(o => o.status === 'completed').reduce((sum, o) => sum + o.amountUSD, 0),
      totalTokens: orders.filter(o => o.status === 'completed').reduce((sum, o) => sum + o.tokensTotal, 0),
    };

    return successResponse({
      orders: paginatedOrders.map(o => ({
        id: o.id,
        amountUSD: o.amountUSD,
        tokensTotal: o.tokensTotal,
        paymentMethod: o.paymentMethod,
        paymentStatus: o.paymentStatus,
        status: o.status,
        txHash: o.txHash,
        createdAt: o.createdAt,
      })),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
      stats,
    });

  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : '未知错误';
    SecurityLogger.log(
      SecurityEventType.SUSPICIOUS_ACTIVITY,
      'error',
      { error: message, endpoint: '/api/token-sale/orders' },
      undefined,
      ip,
      userAgent
    );
    return errorResponse('查询订单失败: ' + message, 500);
  }
}
