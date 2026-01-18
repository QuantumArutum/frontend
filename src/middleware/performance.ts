/**
 * API性能监控中间件
 * 用于监控API响应时间和性能指标
 */

import { NextRequest, NextResponse } from 'next/server';

interface PerformanceMetrics {
  path: string;
  method: string;
  duration: number;
  status: number;
  timestamp: string;
}

// 内存中存储最近的性能指标（最多100条）
const recentMetrics: PerformanceMetrics[] = [];
const MAX_METRICS = 100;

/**
 * 记录性能指标
 */
export function recordMetric(metric: PerformanceMetrics): void {
  recentMetrics.push(metric);

  // 保持数组大小在限制内
  if (recentMetrics.length > MAX_METRICS) {
    recentMetrics.shift();
  }

  // 如果响应时间超过阈值，记录警告
  if (metric.duration > 1000) {
    console.warn(
      `[Performance] Slow API detected: ${metric.method} ${metric.path} - ${metric.duration}ms`
    );
  }
}

/**
 * 获取性能统计
 */
export function getPerformanceStats() {
  if (recentMetrics.length === 0) {
    return {
      count: 0,
      avgDuration: 0,
      minDuration: 0,
      maxDuration: 0,
      slowRequests: 0,
    };
  }

  const durations = recentMetrics.map((m) => m.duration);
  const slowRequests = recentMetrics.filter((m) => m.duration > 1000).length;

  return {
    count: recentMetrics.length,
    avgDuration: durations.reduce((a, b) => a + b, 0) / durations.length,
    minDuration: Math.min(...durations),
    maxDuration: Math.max(...durations),
    slowRequests,
    recentMetrics: recentMetrics.slice(-10), // 最近10条
  };
}

/**
 * 获取最慢的请求
 */
export function getSlowestRequests(limit: number = 10): PerformanceMetrics[] {
  return [...recentMetrics].sort((a, b) => b.duration - a.duration).slice(0, limit);
}

/**
 * 清除性能指标
 */
export function clearMetrics(): void {
  recentMetrics.length = 0;
}

/**
 * 性能监控装饰器
 * 用于包装API处理函数
 */
export function withPerformanceMonitoring(
  handler: (request: NextRequest) => Promise<NextResponse>,
  apiName: string
) {
  return async (request: NextRequest): Promise<NextResponse> => {
    const startTime = performance.now();
    const path = new URL(request.url).pathname;
    const method = request.method;

    try {
      const response = await handler(request);
      const duration = performance.now() - startTime;

      // 记录性能指标
      recordMetric({
        path: apiName || path,
        method,
        duration: Math.round(duration),
        status: response.status,
        timestamp: new Date().toISOString(),
      });

      // 添加性能头
      response.headers.set('X-Response-Time', `${Math.round(duration)}ms`);
      response.headers.set('X-API-Name', apiName || path);

      return response;
    } catch (error) {
      const duration = performance.now() - startTime;

      // 记录错误请求的性能指标
      recordMetric({
        path: apiName || path,
        method,
        duration: Math.round(duration),
        status: 500,
        timestamp: new Date().toISOString(),
      });

      throw error;
    }
  };
}

/**
 * 简单的性能监控包装器
 */
export async function measurePerformance<T>(name: string, fn: () => Promise<T>): Promise<T> {
  const startTime = performance.now();

  try {
    const result = await fn();
    const duration = performance.now() - startTime;

    if (duration > 500) {
      console.warn(`[Performance] ${name} took ${Math.round(duration)}ms`);
    }

    return result;
  } catch (error) {
    const duration = performance.now() - startTime;
    console.error(`[Performance] ${name} failed after ${Math.round(duration)}ms`);
    throw error;
  }
}
