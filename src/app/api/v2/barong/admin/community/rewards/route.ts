/**
 * Community Rewards & Gamification API
 * Handles points, levels, badges, and achievements
 */

import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';

// Demo data
const demoPointsConfig = [
  { id: 1, action: 'post_create', points: 10, daily_limit: 5, description: '发布帖子' },
  { id: 2, action: 'comment_create', points: 2, daily_limit: 20, description: '发表评论' },
  { id: 3, action: 'like_receive', points: 1, daily_limit: null, description: '获得点赞' },
  { id: 4, action: 'daily_login', points: 5, daily_limit: 1, description: '每日登录' },
];

const demoLevels = [
  { level: 1, name: '新手', min_points: 0, icon: '🌱', color: '#52c41a' },
  { level: 2, name: '活跃', min_points: 100, icon: '⭐', color: '#1890ff' },
  { level: 3, name: '达人', min_points: 500, icon: '🔥', color: '#fa8c16' },
  { level: 4, name: '专家', min_points: 2000, icon: '💎', color: '#722ed1' },
  { level: 5, name: '大师', min_points: 10000, icon: '👑', color: '#eb2f96' },
];

const demoBadges = [
  { id: 1, name: '先驱者', description: '首批注册用户', icon: '🏆', category: 'milestone', is_active: 1 },
  { id: 2, name: '话题王', description: '发布50篇帖子', icon: '📝', category: 'achievement', is_active: 1 },
  { id: 3, name: '人气王', description: '获得100个赞', icon: '❤️', category: 'social', is_active: 1 },
];

// GET - Get rewards data
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') || 'all';

    if (type === 'all') {
      return NextResponse.json({
        success: true,
        data: {
          points: demoPointsConfig,
          levels: demoLevels,
          badges: demoBadges,
        }
      });
    }

    if (type === 'points') {
      return NextResponse.json({ success: true, data: demoPointsConfig });
    }

    if (type === 'levels') {
      return NextResponse.json({ success: true, data: demoLevels });
    }

    if (type === 'badges') {
      return NextResponse.json({ success: true, data: demoBadges });
    }

    return NextResponse.json({ success: true, data: {} });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

// POST - Create badge or update config
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type } = body;

    if (type === 'badge') {
      const newBadge = { id: Date.now(), ...body };
      return NextResponse.json({ success: true, data: newBadge });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

// PUT - Update rewards config
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    return NextResponse.json({ success: true, data: body });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

// DELETE - Delete badge
export async function DELETE(request: NextRequest) {
  try {
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
