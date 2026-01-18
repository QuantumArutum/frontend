/**
 * 性能监控API
 * 用于查看API性能统计和慢查询
 */

import { NextRequest, NextResponse } from 'next/server';
import { getPerformanceStats, getSlowestRequests, clearMetrics } from '@/middleware/performance';

// 设置运行时配置
export const maxDuration = 10;

/**
 * GET /api/v2/barong/admin/performance
 * 获取性能统计信息
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action') || 'stats';

    if (action === 'stats') {
      // 获取性能统计
      const stats = getPerformanceStats();

      return NextResponse.json({
        success: true,
        data: {
          ...stats,
          avgDuration: Math.round(stats.avgDuration),
          minDuration: Math.round(stats.minDuration),
          maxDuration: Math.round(stats.maxDuration),
        },
      });
    } else if (action === 'slowest') {
      // 获取最慢的请求
      const limit = Math.min(parseInt(searchParams.get('limit') || '10'), 50);
      const slowest = getSlowestRequests(limit);

      return NextResponse.json({
        success: true,
        data: slowest,
      });
    } else {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid action',
          message: '无效的操作类型',
        },
        { status: 400 }
      );
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';

    console.error('[performance] Error fetching performance stats:', {
      message: errorMessage,
      timestamp: new Date().toISOString(),
    });

    return NextResponse.json(
      {
        success: false,
        error: errorMessage,
        message: '获取性能统计失败',
      },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/v2/barong/admin/performance
 * 清除性能指标
 */
export async function DELETE() {
  try {
    clearMetrics();

    return NextResponse.json({
      success: true,
      message: '性能指标已清除',
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';

    console.error('[performance] Error clearing metrics:', {
      message: errorMessage,
      timestamp: new Date().toISOString(),
    });

    return NextResponse.json(
      {
        success: false,
        error: errorMessage,
        message: '清除性能指标失败',
      },
      { status: 500 }
    );
  }
}
