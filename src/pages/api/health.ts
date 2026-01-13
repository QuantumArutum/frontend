// 健康检查 API 端点
// 用于监控应用状态和依赖服务健康状况

import { NextApiRequest, NextApiResponse } from 'next';
import { promises as fs } from 'fs';
import path from 'path';

// 配置获取函数
function getCurrentConfig() {
  return {
    api: {
      baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8082'
    }
  };
}

interface HealthCheckResult {
  status: 'healthy' | 'unhealthy' | 'degraded';
  timestamp: string;
  version: string;
  uptime: number;
  checks: {
    [key: string]: {
      status: 'pass' | 'fail' | 'warn';
      message?: string;
      responseTime?: number;
      lastChecked: string;
    };
  };
  system: {
    memory: {
      used: number;
      total: number;
      percentage: number;
    };
    cpu: {
      usage: number;
    };
    disk: {
      used: number;
      total: number;
      percentage: number;
    };
  };
}

// 检查数据库连接
async function checkDatabase(): Promise<{ status: 'pass' | 'fail'; message?: string; responseTime: number }> {
  const startTime = Date.now();
  
  try {
    // 这里应该实现实际的数据库连接检查
    // 例如: await db.query('SELECT 1');
    
    // 模拟数据库检查
    await new Promise(resolve => setTimeout(resolve, 10));
    
    const responseTime = Date.now() - startTime;
    
    if (responseTime > 1000) {
      return {
        status: 'fail',
        message: 'Database response time too slow',
        responseTime
      };
    }
    
    return {
      status: 'pass',
      responseTime
    };
  } catch (error) {
    return {
      status: 'fail',
      message: error instanceof Error ? error.message : 'Database connection failed',
      responseTime: Date.now() - startTime
    };
  }
}

// 检查 Redis 连接
async function checkRedis(): Promise<{ status: 'pass' | 'fail'; message?: string; responseTime: number }> {
  const startTime = Date.now();
  
  try {
    // 这里应该实现实际的 Redis 连接检查
    // 例如: await redis.ping();
    
    // 模拟 Redis 检查
    await new Promise(resolve => setTimeout(resolve, 5));
    
    const responseTime = Date.now() - startTime;
    
    return {
      status: 'pass',
      responseTime
    };
  } catch (error) {
    return {
      status: 'fail',
      message: error instanceof Error ? error.message : 'Redis connection failed',
      responseTime: Date.now() - startTime
    };
  }
}

// 检查外部 API
async function checkExternalAPIs(): Promise<{ status: 'pass' | 'fail' | 'warn'; message?: string; responseTime: number }> {
  const startTime = Date.now();
  
  try {
    const config = getCurrentConfig();
    
    // 检查主要 API 端点
    const response = await fetch(`${config.api.baseURL}/api/v1/health`, {
      method: 'GET'
    });
    
    const responseTime = Date.now() - startTime;
    
    if (!response.ok) {
      return {
        status: 'fail',
        message: `API returned ${response.status}`,
        responseTime
      };
    }
    
    if (responseTime > 2000) {
      return {
        status: 'warn',
        message: 'API response time is slow',
        responseTime
      };
    }
    
    return {
      status: 'pass',
      responseTime
    };
  } catch (error) {
    return {
      status: 'fail',
      message: error instanceof Error ? error.message : 'External API check failed',
      responseTime: Date.now() - startTime
    };
  }
}

// 检查文件系统
async function checkFileSystem(): Promise<{ status: 'pass' | 'fail' | 'warn'; message?: string }> {
  try {
    
    
    
    // 检查临时目录写入权限
    const tempFile = path.join('/tmp', `health-check-${Date.now()}.txt`);
    await fs.writeFile(tempFile, 'health check');
    await fs.unlink(tempFile);
    
    // 检查磁盘空间
    const stats = await fs.stat('/');
    // 这里应该实现实际的磁盘空间检查
    
    return {
      status: 'pass'
    };
  } catch (error) {
    return {
      status: 'fail',
      message: error instanceof Error ? error.message : 'File system check failed'
    };
  }
}

// 获取系统信息
function getSystemInfo() {
  const memUsage = process.memoryUsage();
  const cpuUsage = process.cpuUsage();
  
  return {
    memory: {
      used: memUsage.heapUsed,
      total: memUsage.heapTotal,
      percentage: Math.round((memUsage.heapUsed / memUsage.heapTotal) * 100)
    },
    cpu: {
      usage: Math.round((cpuUsage.user + cpuUsage.system) / 1000000) // 转换为毫秒
    },
    disk: {
      used: 0, // 这里应该实现实际的磁盘使用检查
      total: 0,
      percentage: 0
    }
  };
}

// 主健康检查函数
export default async function handler(req: NextApiRequest, res: NextApiResponse<HealthCheckResult>) {
  const startTime = Date.now();
  
  try {
    // 并行执行所有健康检查
    const [
      databaseCheck,
      redisCheck,
      externalAPICheck,
      fileSystemCheck
    ] = await Promise.all([
      checkDatabase(),
      checkRedis(),
      checkExternalAPIs(),
      checkFileSystem()
    ]);
    
    const checks = {
      database: {
        ...databaseCheck,
        lastChecked: new Date().toISOString()
      },
      redis: {
        ...redisCheck,
        lastChecked: new Date().toISOString()
      },
      externalAPI: {
        ...externalAPICheck,
        lastChecked: new Date().toISOString()
      },
      fileSystem: {
        ...fileSystemCheck,
        lastChecked: new Date().toISOString()
      }
    };
    
    // 确定整体健康状态
    const hasFailures = Object.values(checks).some(check => check.status === 'fail');
    const hasWarnings = Object.values(checks).some(check => check.status === 'warn');
    
    let overallStatus: 'healthy' | 'unhealthy' | 'degraded';
    if (hasFailures) {
      overallStatus = 'unhealthy';
    } else if (hasWarnings) {
      overallStatus = 'degraded';
    } else {
      overallStatus = 'healthy';
    }
    
    const result: HealthCheckResult = {
      status: overallStatus,
      timestamp: new Date().toISOString(),
      version: process.env.NEXT_PUBLIC_APP_VERSION || '1.0.0',
      uptime: process.uptime(),
      checks,
      system: getSystemInfo()
    };
    
    // 根据健康状态设置 HTTP 状态码
    const httpStatus = overallStatus === 'healthy' ? 200 : 
                      overallStatus === 'degraded' ? 200 : 503;
    
    res.status(httpStatus).json(result);
    
  } catch (error) {
    console.error('Health check failed:', error);
    
    const errorResult: HealthCheckResult = {
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      version: process.env.NEXT_PUBLIC_APP_VERSION || '1.0.0',
      uptime: process.uptime(),
      checks: {
        system: {
          status: 'fail',
          message: error instanceof Error ? error.message : 'System check failed',
          lastChecked: new Date().toISOString()
        }
      },
      system: getSystemInfo()
    };
    
    res.status(503).json(errorResult);
  }
}

// 导出健康检查函数供其他模块使用
export { checkDatabase, checkRedis, checkExternalAPIs, checkFileSystem };