/**
 * Community Service - Production-grade community management
 * Handles all community-related database operations
 */

import { sql } from './database';

// ==================== TYPES ====================

export interface CommunityStats {
  totalPosts: number;
  totalComments: number;
  totalUsers: number;
  activeToday: number;
  totalReports: number;
  pendingReports: number;
  totalBans: number;
  activeBans: number;
  totalEvents: number;
  upcomingEvents: number;
  totalAnnouncements: number;
  activeAnnouncements: number;
  postsThisWeek: number;
  commentsThisWeek: number;
  newUsersThisWeek: number;
  topCategories: { name: string; count: number }[];
  engagementRate: number;
}

export interface Report {
  id: number;
  reporter_id: string;
  reporter_email?: string;
  reported_user_id: string;
  reported_user_email?: string;
  target_type: string;
  target_id: number;
  target_content?: string;
  reason: string;
  description: string;
  status: string;
  admin_notes: string;
  handled_by: string;
  handled_at: string;
  created_at: string;
}

export interface UserBan {
  id: number;
  user_id: string;
  user_email?: string;
  banned_by: string;
  reason: string;
  ban_type: string;
  expires_at: string;
  is_active: boolean;
  created_at: string;
}

export interface Announcement {
  id: number;
  title: string;
  content: string;
  type: string;
  is_pinned: boolean;
  is_active: boolean;
  start_date: string;
  end_date: string;
  created_by: string;
  created_at: string;
}

export interface CommunityEvent {
  id: number;
  title: string;
  description: string;
  event_type: string;
  start_time: string;
  end_time: string;
  location: string;
  max_participants: number;
  current_participants: number;
  reward_points: number;
  reward_tokens: number;
  status: string;
  image_url: string;
  created_by: string;
  created_at: string;
}

export interface UserReputation {
  id: number;
  user_id: string;
  user_email?: string;
  reputation_points: number;
  level: number;
  posts_count: number;
  comments_count: number;
  likes_received: number;
  likes_given: number;
  helpful_answers: number;
  badges?: UserBadge[];
}

export interface UserBadge {
  id: number;
  badge_type: string;
  badge_name: string;
  badge_icon: string;
  description: string;
  earned_at: string;
}

export interface ModerationLog {
  id: number;
  moderator_id: string;
  moderator_email?: string;
  action: string;
  target_type: string;
  target_id: number;
  reason: string;
  details: any;
  created_at: string;
}

export interface PostTag {
  id: number;
  name: string;
  slug: string;
  usage_count: number;
}

// ==================== COMMUNITY SERVICE ====================

export const communityService = {
  // ========== STATS ==========
  async getFullStats(): Promise<CommunityStats | null> {
    if (!sql) return null;

    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
    const today = new Date().toISOString().split('T')[0];

    const [postsCount] = await sql`SELECT COUNT(*) as total FROM posts`;
    const [commentsCount] = await sql`SELECT COUNT(*) as total FROM comments`;
    const [usersCount] = await sql`SELECT COUNT(*) as total FROM users`;
    const [activeToday] = await sql`SELECT COUNT(DISTINCT user_id) as total FROM user_activity_logs WHERE DATE(created_at) = ${today}`;
    const [reportsCount] = await sql`SELECT COUNT(*) as total FROM user_reports`;
    const [pendingReports] = await sql`SELECT COUNT(*) as total FROM user_reports WHERE status = 'pending'`;
    const [bansCo