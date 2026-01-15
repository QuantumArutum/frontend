/**
 * Community Analytics API
 * Provides detailed analytics and reporting for community operations
 */

import { NextRequest, NextResponse } from 'next/server';
import getDb from '@/lib/db';

// GET - Analytics data
export async function GET(request: NextRequest) {
  try {
    const db = getDb();
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') || 'overview';
    const period = searchParams.get('period') || '30'; // days

    if (type === 'overview') {
      // Basic stats
      const posts = db.prepare(`SELECT COUNT(*) as count FROM community_posts`).get() as any;
      const comments = db.prepare(`SELECT COUNT(*) as count FROM community_comments`).get() as any;
      const users = db.prepare(`SELECT COUNT(*) as count FROM users`).get() as any;
      
      // Today's activity
      const today = new Date().toISOString().split('T')[0];
      const todayPosts = db.prepare(`SELECT COUNT(*) as count FROM community_posts WHERE DATE(created_at) = ?`).get(today) as any;
      const todayComments = db.prepare(`SELECT COUNT(*) as count FROM community_comments WHERE DATE(created_at) = ?`).get(today) as any;
      
      // Active users (posted or commented in last 7 days)
      const activeUsers = db.prepare(`
        SELECT COUNT(DISTINCT user_id) as count FROM (
          SELECT user_id FROM community_posts WHERE created_at >= datetime('now', '-7 days')
          UNION
          SELECT user_id FROM community_comments WHERE created_at >= datetime('now', '-7 days')
        )
      `).get() as any;

      // Growth comparison
      const lastWeekPosts = db.prepare(`
        SELECT COUNT(*) as count FROM community_posts 
        WHERE created_at >= datetime('now', '-14 days') AND created_at < datetime('now', '-7 days')
      `).get() as any;
      const thisWeekPosts = db.prepare(`
        SELECT COUNT(*) as count FROM community_posts WHERE created_at >= datetime('now', '-7 days')
      `).get() as any;

      return NextResponse.json({
        success: true,
        data: {
          totals: {
            posts: posts.count,
            comments: comments.count,
            users: users.count,
            activeUsers: activeUsers.count
          },
          today: {
            posts: todayPosts.count,
            comments: todayComments.count
          },
          growth: {
            postsThisWeek: thisWeekPosts.count,
            postsLastWeek: lastWeekPosts.count,
            growthRate: lastWeekPosts.count > 0 
              ? Math.round((thisWeekPosts.count - lastWeekPosts.count) / lastWeekPosts.count * 100) 
              : 100
          }
        }
      });
    }

    if (type === 'trends') {
      // Daily activity for the period
      const days = parseInt(period);
      const dailyPosts = db.prepare(`
        SELECT DATE(created_at) as date, COUNT(*) as count 
        FROM community_posts 
        WHERE created_at >= datetime('now', '-${days} days')
        GROUP BY DATE(created_at)
        ORDER BY date
      `).all();

      const dailyComments = db.prepare(`
        SELECT DATE(created_at) as date, COUNT(*) as count 
        FROM community_comments 
        WHERE created_at >= datetime('now', '-${days} days')
        GROUP BY DATE(created_at)
        ORDER BY date
      `).all();

      const dailyUsers = db.prepare(`
        SELECT DATE(created_at) as date, COUNT(*) as count 
        FROM users 
        WHERE created_at >= datetime('now', '-${days} days')
        GROUP BY DATE(created_at)
        ORDER BY date
      `).all();

      return NextResponse.json({
        success: true,
        data: { dailyPosts, dailyComments, dailyUsers }
      });
    }

    if (type === 'top_content') {
      // Top posts by engagement
      const topPosts = db.prepare(`
        SELECT id, title, view_count, like_count, comment_count,
          (view_count + like_count * 5 + comment_count * 10) as engagement_score
        FROM community_posts
        ORDER BY engagement_score DESC
        LIMIT 10
      `).all();

      // Most active categories
      const topCategories = db.prepare(`
        SELECT c.name, c.slug, COUNT(p.id) as post_count,
          SUM(p.view_count) as total_views,
          SUM(p.comment_count) as total_comments
        FROM community_categories c
        LEFT JOIN community_posts p ON c.id = p.category_id
        GROUP BY c.id
        ORDER BY post_count DESC
      `).all();

      return NextResponse.json({
        success: true,
        data: { topPosts, topCategories }
      });
    }

    if (type === 'top_users') {
      // Most active posters
      const topPosters = db.prepare(`
        SELECT user_id, user_email, COUNT(*) as post_count
        FROM community_posts
        GROUP BY user_id
        ORDER BY post_count DESC
        LIMIT 10
      `).all();

      // Most active commenters
      const topCommenters = db.prepare(`
        SELECT user_id, COUNT(*) as comment_count
        FROM community_comments
        GROUP BY user_id
        ORDER BY comment_count DESC
        LIMIT 10
      `).all();

      // Users with most likes received
      const topLiked = db.prepare(`
        SELECT user_id, user_email, SUM(like_count) as total_likes
        FROM community_posts
        GROUP BY user_id
        ORDER BY total_likes DESC
        LIMIT 10
      `).all();

      return NextResponse.json({
        success: true,
        data: { topPosters, topCommenters, topLiked }
      });
    }

    if (type === 'engagement') {
      // Engagement metrics
      const avgViews = db.prepare(`SELECT AVG(view_count) as avg FROM community_posts`).get() as any;
      const avgLikes = db.prepare(`SELECT AVG(like_count) as avg FROM community_posts`).get() as any;
      const avgComments = db.prepare(`SELECT AVG(comment_count) as avg FROM community_posts`).get() as any;

      // Posts with no engagement
      const noEngagement = db.prepare(`
        SELECT COUNT(*) as count FROM community_posts 
        WHERE view_count = 0 AND like_count = 0 AND comment_count = 0
      `).get() as any;

      // Engagement by hour (when users are most active)
      const hourlyActivity = db.prepare(`
        SELECT strftime('%H', created_at) as hour, COUNT(*) as count
        FROM community_posts
        GROUP BY hour
        ORDER BY hour
      `).all();

      return NextResponse.json({
        success: true,
        data: {
          averages: {
            views: Math.round(avgViews.avg || 0),
            likes: Math.round(avgLikes.avg || 0),
            comments: Math.round(avgComments.avg || 0)
          },
          noEngagementPosts: noEngagement.count,
          hourlyActivity
        }
      });
    }

    if (type === 'moderation') {
      // Moderation stats
      let moderationStats = { pending: 0, approved: 0, rejected: 0 };
      let reportStats = { pending: 0, resolved: 0, dismissed: 0 };
      let restrictionStats = { active_bans: 0, active_mutes: 0, total_warnings: 0 };

      try {
        const modStats = db.prepare(`
          SELECT status, COUNT(*) as count FROM moderation_queue GROUP BY status
        `).all() as any[];
        modStats.forEach((s: any) => { moderationStats[s.status as keyof typeof moderationStats] = s.count; });
      } catch {}

      try {
        const repStats = db.prepare(`
          SELECT status, COUNT(*) as count FROM community_reports GROUP BY status
        `).all() as any[];
        repStats.forEach((s: any) => { 
          if (s.status === 'pending') reportStats.pending = s.count;
          if (s.status === 'resolved') reportStats.resolved = s.count;
          if (s.status === 'dismissed') reportStats.dismissed = s.count;
        });
      } catch {}

      try {
        const resStats = db.prepare(`
          SELECT 
            SUM(CASE WHEN type = 'ban' AND is_active = 1 THEN 1 ELSE 0 END) as active_bans,
            SUM(CASE WHEN type = 'mute' AND is_active = 1 THEN 1 ELSE 0 END) as active_mutes,
            SUM(CASE WHEN type = 'warning' THEN 1 ELSE 0 END) as total_warnings
          FROM community_user_restrictions
        `).get() as any;
        if (resStats) restrictionStats = resStats;
      } catch {}

      return NextResponse.json({
        success: true,
        data: { moderationStats, reportStats, restrictionStats }
      });
    }

    return NextResponse.json({ success: false, message: 'Invalid type' }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
