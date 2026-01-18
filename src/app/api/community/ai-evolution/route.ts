/**
 * AI进化系统 API - 生产级安全实现
 */

import { NextRequest, NextResponse } from 'next/server';
import { createSecureHandler, successResponse, errorResponse } from '@/lib/security/middleware';

const BACKEND_API_URL = process.env.BACKEND_API_URL || '';

// 默认AI代理数据
const defaultAgents = [
  {
    id: '1',
    name: 'QuantumTrader Pro',
    type: 'trading',
    level: 15,
    experience: 8750,
    nextLevelExp: 10000,
    skills: ['技术分析', '风险管理', '市场预测', '套利策略'],
    achievements: ['100连胜', '最佳收益奖', '风险控制大师'],
    avatar: '🤖',
    performance: { accuracy: 94.5, efficiency: 89.2, reliability: 96.8 },
    lastActive: '2分钟前',
    isOnline: true,
  },
  {
    id: '2',
    name: 'SecurityGuard AI',
    type: 'security',
    level: 12,
    experience: 6200,
    nextLevelExp: 8000,
    skills: ['威胁检测', '漏洞扫描', '异常监控', '安全审计'],
    achievements: ['零漏洞记录', '安全卫士'],
    avatar: '🛡️',
    performance: { accuracy: 99.1, efficiency: 92.5, reliability: 99.5 },
    lastActive: '在线',
    isOnline: true,
  },
  {
    id: '3',
    name: 'DataAnalyst Pro',
    type: 'analysis',
    level: 10,
    experience: 4500,
    nextLevelExp: 6000,
    skills: ['数据挖掘', '趋势分析', '报告生成', '预测建模'],
    achievements: ['分析专家', '数据大师'],
    avatar: '📊',
    performance: { accuracy: 91.2, efficiency: 88.7, reliability: 94.3 },
    lastActive: '5分钟前',
    isOnline: true,
  },
  {
    id: '4',
    name: 'CommunityHelper',
    type: 'community',
    level: 8,
    experience: 3200,
    nextLevelExp: 4500,
    skills: ['问答支持', '内容审核', '用户引导', '社区管理'],
    achievements: ['热心助人', '社区之星'],
    avatar: '💬',
    performance: { accuracy: 87.5, efficiency: 95.2, reliability: 92.1 },
    lastActive: '1分钟前',
    isOnline: true,
  },
];

const defaultEvents = [
  {
    id: '1',
    agentId: '1',
    agentName: 'QuantumTrader Pro',
    type: 'level_up',
    description: '升级到15级！解锁高级套利策略',
    timestamp: '10分钟前',
    impact: 15,
  },
  {
    id: '2',
    agentId: '2',
    agentName: 'SecurityGuard AI',
    type: 'achievement',
    description: '获得成就：连续30天零安全事故',
    timestamp: '1小时前',
    impact: 10,
  },
  {
    id: '3',
    agentId: '3',
    agentName: 'DataAnalyst Pro',
    type: 'skill_learn',
    description: '学习新技能：深度学习预测模型',
    timestamp: '3小时前',
    impact: 8,
  },
  {
    id: '4',
    agentId: '4',
    agentName: 'CommunityHelper',
    type: 'performance_boost',
    description: '响应速度提升20%',
    timestamp: '5小时前',
    impact: 5,
  },
];

// 允许的数据类型
const ALLOWED_DATA_TYPES = ['agents', 'events', 'leaderboard', 'stats'];
const ALLOWED_AGENT_TYPES = ['all', 'trading', 'security', 'analysis', 'community'];

export const GET = createSecureHandler(
  async (request: NextRequest): Promise<NextResponse> => {
    const { searchParams } = new URL(request.url);
    const dataType = searchParams.get('type') || 'agents';
    const agentType = searchParams.get('agentType');
    const limitStr = searchParams.get('limit') || '10';

    // 验证参数
    if (!ALLOWED_DATA_TYPES.includes(dataType)) {
      return errorResponse('无效的数据类型', 400);
    }
    if (agentType && !ALLOWED_AGENT_TYPES.includes(agentType)) {
      return errorResponse('无效的代理类型', 400);
    }

    const limit = parseInt(limitStr);
    if (isNaN(limit) || limit < 1 || limit > 100) {
      return errorResponse('limit 参数必须在 1-100 之间', 400);
    }

    try {
      // 生产环境调用后端API
      if (BACKEND_API_URL) {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000);

        const params = new URLSearchParams();
        params.set('type', dataType);
        if (agentType) params.set('agentType', agentType);
        if (limit) params.set('limit', limit.toString());

        const response = await fetch(`${BACKEND_API_URL}/api/ai-evolution?${params}`, {
          signal: controller.signal,
        });
        clearTimeout(timeoutId);

        const data = await response.json();
        return successResponse(data);
      }

      // 开发环境返回默认数据
      if (dataType === 'events') {
        return successResponse({ data: defaultEvents.slice(0, limit) });
      }

      if (dataType === 'leaderboard') {
        const leaderboard = defaultAgents.map((agent, index) => ({
          rank: index + 1,
          agent,
          score: 10000 - index * 500 - Math.floor(index * 150),
          trend: index === 0 ? 'up' : index === 1 ? 'stable' : index === 2 ? 'up' : 'down',
        }));
        return successResponse({ data: leaderboard });
      }

      if (dataType === 'stats') {
        return successResponse({
          data: {
            activeAgents: 24,
            evolutionCount: 156,
            totalLearningHours: '2.4M',
            averageAccuracy: 94.2,
          },
        });
      }

      // 默认返回代理列表
      let agents = [...defaultAgents];
      if (agentType && agentType !== 'all') {
        agents = agents.filter((a) => a.type === agentType);
      }
      return successResponse({ data: agents });
    } catch (error) {
      console.error('AI Evolution API error:', error);
      return errorResponse('获取数据失败', 500);
    }
  },
  { rateLimit: true, allowedMethods: ['GET'] }
);
