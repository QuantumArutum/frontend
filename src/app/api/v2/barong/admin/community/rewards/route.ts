/**
 * Community Rewards & Gamification API
 * Production-grade implementation using communityService
 */

import { NextRequest, NextResponse } from 'next/server';
import { communityService } from '@/lib/communityService';

// Static config data (can be moved to database later)
const pointsConfig = [
  { id: 1, action: 'post_create', points: 10, daily_limit: 5, description: '发布帖子' },
  { id: 2, action: 'comment_create', points: 5, daily_limit: 20, description: '发表评论' },
  { id: 3, action: 'like_receive', points: 1, daily_limit: null, description: '获得点赞' },
  { id: 4, action: 'daily_login', points: 5, daily_limit: 1, description: '每日登录' },
  { id: 5, action: 'best_answer', points: 25, daily_limit: null, description: '最佳答案' },
];

const levelsConfig = [
  { level: 1, name: '新手', min_points: 0, icon: '🌱', color: '#52c41a' },
  { level: 2, name: '活跃', min_points: 100, icon: '⭐', color: '#1890ff' },
  { level: 3, name: '达人', min_points: 500, icon: '🔥', color: '#fa8c16' },
  { level: 4, name: '专家', min_points: 2000, icon: '💎', color: '#722ed1' },
  { level: 5, name: '大师', min_points: 10000, icon: '👑', color: '#eb2f96' },
];

// GET - Get rewards data
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') || 'all';
    const userId = searchParams.get('user_id');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');

    if (type === 'all') {
      const reputations = await communityService.getUserReputations(1, 10);
      return NextResponse.json({
        success: true,
        data: {
          points: pointsConfig,
          levels: levelsConfig,
          topUsers: reputations.users,
        }
      });
    }

    if (type === 'points') {
      return NextResponse.json({ success: true, data: pointsConfig });
    }

    if (type === 'levels') {
      return NextResponse.json({ success: true, data: levelsConfig });
    }

    if (type === 'badges' && userId) {
      const badges = await communityService.getUserBadges(userId);
      return NextResponse.json({ success: true, data: badges });
    }

    if (type === 'leaderboard') {
      const result = await communityService.getUserReputations(page, limit);
      return NextResponse.json({
        success: true,
        data: {
          users: result.users,
          total: result.total,
        }
      });
    }

    if (type === 'user' && userId) {
      const reputation = await communityService.getUserReputation(userId);
      return NextResponse.json({ success: true, data: reputation });
    }

    return NextResponse.json({ success: true, data: {} });
  } catch (error: any) {
    console.error('Rewards GET error:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

// POST - Award badge or update points
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, action } = body;

    if (type === 'badge' || action === 'award_badge') {
      const { user_id, badge_type, badge_name, badge_icon, description } = body;
      const badge = await communityService.awardBadge(user_id, badge_type, badge_name, badge_icon, description);
      return NextResponse.json({ success: true, data: badge });
    }

    if (type === 'points' || action === 'add_points') {
      const { user_id, points, reason } = body;
      const success = await communityService.updateUserReputation(user_id, points, reason);
      return NextResponse.json({ success });
    }

    return NextResponse.json({ success: false, message: 'Invalid type' }, { status: 400 });
  } catch (error: any) {
    console.error('Rewards POST error:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
