/**
 * Community Service - Production-grade community management
 */

import { sql } from './database';

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

export const communityService = {
  async getFullStats(): Promise<CommunityStats | null> {
    if (!sql) return null;
    try {
      const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
      const today = new Date().toISOString().split('T')[0];
      const [postsCount] = await sql`SELECT COUNT(*) as total FROM posts`;
      const [commentsCount] = await sql`SELECT COUNT(*) as total FROM comments`;
      const [usersCount] = await sql`SELECT COUNT(*) as total FROM users`;
      const [activeTodayCount] = await sql`SELECT COUNT(DISTINCT user_id) as total FROM user_activity_logs WHERE DATE(created_at) = ${today}`;
      const [reportsCount] = await sql`SELECT COUNT(*) as total FROM user_reports`;
      const [pendingReportsCount] = await sql`SELECT COUNT(*) as total FROM user_reports WHERE status = 'pending'`;
      const [bansCount] = await sql`SELECT COUNT(*) as total FROM user_bans`;
      const [activeBansCount] = await sql`SELECT COUNT(*) as total FROM user_bans WHERE is_active = true AND (expires_at IS NULL OR expires_at > NOW())`;
      const [eventsCount] = await sql`SELECT COUNT(*) as total FROM community_events`;
      const [upcomingEventsCount] = await sql`SELECT COUNT(*) as total FROM community_events WHERE status = 'upcoming' AND start_time > NOW()`;
      const [announcementsCount] = await sql`SELECT COUNT(*) as total FROM community_announcements`;
      const [activeAnnouncementsCount] = await sql`SELECT COUNT(*) as total FROM community_announcements WHERE is_active = true`;
      const [postsThisWeekCount] = await sql`SELECT COUNT(*) as total FROM posts WHERE created_at > ${weekAgo}`;
      const [commentsThisWeekCount] = await sql`SELECT COUNT(*) as total FROM comments WHERE created_at > ${weekAgo}`;
      const [newUsersThisWeekCount] = await sql`SELECT COUNT(*) as total FROM users WHERE created_at > ${weekAgo}`;
      const topCategories = await sql`SELECT c.name, COUNT(p.id) as count FROM categories c LEFT JOIN posts p ON c.id = p.category_id GROUP BY c.id, c.name ORDER BY count DESC LIMIT 5`;
      const totalPosts = Number(postsCount?.total || 0);
      const totalComments = Number(commentsCount?.total || 0);
      const totalUsers = Number(usersCount?.total || 0);
      const engagementRate = totalUsers > 0 ? ((totalPosts + totalComments) / totalUsers) * 100 : 0;
      return {
        totalPosts, totalComments, totalUsers,
        activeToday: Number(activeTodayCount?.total || 0),
        totalReports: Number(reportsCount?.total || 0),
        pendingReports: Number(pendingReportsCount?.total || 0),
        totalBans: Number(bansCount?.total || 0),
        activeBans: Number(activeBansCount?.total || 0),
        totalEvents: Number(eventsCount?.total || 0),
        upcomingEvents: Number(upcomingEventsCount?.total || 0),
        totalAnnouncements: Number(announcementsCount?.total || 0),
        activeAnnouncements: Number(activeAnnouncementsCount?.total || 0),
        postsThisWeek: Number(postsThisWeekCount?.total || 0),
        commentsThisWeek: Number(commentsThisWeekCount?.total || 0),
        newUsersThisWeek: Number(newUsersThisWeekCount?.total || 0),
        topCategories: topCategories.map((c: any) => ({ name: c.name, count: Number(c.count) })),
        engagementRate: Math.round(engagementRate * 100) / 100
      };
    } catch (error) {
      console.error('Error getting community stats:', error);
      return null;
    }
  },

  async getReports(status?: string, page = 1, limit = 20): Promise<{ reports: Report[]; total: number }> {
    if (!sql) return { reports: [], total: 0 };
    try {
      const offset = (page - 1) * limit;
      let reports: Report[];
      let countResult: any[];
      if (status && status !== 'all') {
        reports = await sql`SELECT r.*, u1.email as reporter_email, u2.email as reported_user_email FROM user_reports r LEFT JOIN users u1 ON r.reporter_id = u1.uid LEFT JOIN users u2 ON r.reported_user_id = u2.uid WHERE r.status = ${status} ORDER BY r.created_at DESC LIMIT ${limit} OFFSET ${offset}` as Report[];
        countResult = await sql`SELECT COUNT(*) as total FROM user_reports WHERE status = ${status}`;
      } else {
        reports = await sql`SELECT r.*, u1.email as reporter_email, u2.email as reported_user_email FROM user_reports r LEFT JOIN users u1 ON r.reporter_id = u1.uid LEFT JOIN users u2 ON r.reported_user_id = u2.uid ORDER BY r.created_at DESC LIMIT ${limit} OFFSET ${offset}` as Report[];
        countResult = await sql`SELECT COUNT(*) as total FROM user_reports`;
      }
      return { reports, total: Number(countResult[0]?.total || 0) };
    } catch (error) {
      console.error('Error getting reports:', error);
      return { reports: [], total: 0 };
    }
  },

  async updateReportStatus(id: number, status: string, adminNotes: string, handledBy: string): Promise<boolean> {
    if (!sql) return false;
    try {
      await sql`UPDATE user_reports SET status = ${status}, admin_notes = ${adminNotes}, handled_by = ${handledBy}, handled_at = NOW() WHERE id = ${id}`;
      return true;
    } catch (error) {
      console.error('Error updating report:', error);
      return false;
    }
  },

  async getBans(active?: boolean, page = 1, limit = 20): Promise<{ bans: UserBan[]; total: number }> {
    if (!sql) return { bans: [], total: 0 };
    try {
      const offset = (page - 1) * limit;
      let bans: UserBan[];
      let countResult: any[];
      if (active !== undefined) {
        bans = await sql`SELECT b.*, u.email as user_email FROM user_bans b LEFT JOIN users u ON b.user_id = u.uid WHERE b.is_active = ${active} ORDER BY b.created_at DESC LIMIT ${limit} OFFSET ${offset}` as UserBan[];
        countResult = await sql`SELECT COUNT(*) as total FROM user_bans WHERE is_active = ${active}`;
      } else {
        bans = await sql`SELECT b.*, u.email as user_email FROM user_bans b LEFT JOIN users u ON b.user_id = u.uid ORDER BY b.created_at DESC LIMIT ${limit} OFFSET ${offset}` as UserBan[];
        countResult = await sql`SELECT COUNT(*) as total FROM user_bans`;
      }
      return { bans, total: Number(countResult[0]?.total || 0) };
    } catch (error) {
      console.error('Error getting bans:', error);
      return { bans: [], total: 0 };
    }
  },

  async createBan(userId: string, bannedBy: string, reason: string, banType: string, expiresAt?: string): Promise<boolean> {
    if (!sql) return false;
    try {
      await sql`INSERT INTO user_bans (user_id, banned_by, reason, ban_type, expires_at, is_active) VALUES (${userId}, ${bannedBy}, ${reason}, ${banType}, ${expiresAt || null}, true)`;
      return true;
    } catch (error) {
      console.error('Error creating ban:', error);
      return false;
    }
  },

  async revokeBan(id: number): Promise<boolean> {
    if (!sql) return false;
    try {
      await sql`UPDATE user_bans SET is_active = false WHERE id = ${id}`;
      return true;
    } catch (error) {
      console.error('Error revoking ban:', error);
      return false;
    }
  },

  async getAnnouncements(active?: boolean, page = 1, limit = 20): Promise<{ announcements: Announcement[]; total: number }> {
    if (!sql) return { announcements: [], total: 0 };
    try {
      const offset = (page - 1) * limit;
      let announcements: Announcement[];
      let countResult: any[];
      if (active !== undefined) {
        announcements = await sql`SELECT * FROM community_announcements WHERE is_active = ${active} ORDER BY is_pinned DESC, created_at DESC LIMIT ${limit} OFFSET ${offset}` as Announcement[];
        countResult = await sql`SELECT COUNT(*) as total FROM community_announcements WHERE is_active = ${active}`;
      } else {
        announcements = await sql`SELECT * FROM community_announcements ORDER BY is_pinned DESC, created_at DESC LIMIT ${limit} OFFSET ${offset}` as Announcement[];
        countResult = await sql`SELECT COUNT(*) as total FROM community_announcements`;
      }
      return { announcements, total: Number(countResult[0]?.total || 0) };
    } catch (error) {
      console.error('Error getting announcements:', error);
      return { announcements: [], total: 0 };
    }
  },

  async createAnnouncement(data: Partial<Announcement>): Promise<boolean> {
    if (!sql) return false;
    try {
      await sql`INSERT INTO community_announcements (title, content, type, is_pinned, is_active, start_date, end_date, created_by) VALUES (${data.title}, ${data.content}, ${data.type || 'info'}, ${data.is_pinned || false}, ${data.is_active !== false}, ${data.start_date || null}, ${data.end_date || null}, ${data.created_by})`;
      return true;
    } catch (error) {
      console.error('Error creating announcement:', error);
      return false;
    }
  },

  async updateAnnouncement(id: number, data: Partial<Announcement>): Promise<boolean> {
    if (!sql) return false;
    try {
      await sql`UPDATE community_announcements SET title = COALESCE(${data.title}, title), content = COALESCE(${data.content}, content), type = COALESCE(${data.type}, type), is_pinned = COALESCE(${data.is_pinned}, is_pinned), is_active = COALESCE(${data.is_active}, is_active) WHERE id = ${id}`;
      return true;
    } catch (error) {
      console.error('Error updating announcement:', error);
      return false;
    }
  },

  async deleteAnnouncement(id: number): Promise<boolean> {
    if (!sql) return false;
    try {
      await sql`DELETE FROM community_announcements WHERE id = ${id}`;
      return true;
    } catch (error) {
      console.error('Error deleting announcement:', error);
      return false;
    }
  },

  async getEvents(status?: string, page = 1, limit = 20): Promise<{ events: CommunityEvent[]; total: number }> {
    if (!sql) return { events: [], total: 0 };
    try {
      const offset = (page - 1) * limit;
      let events: CommunityEvent[];
      let countResult: any[];
      if (status && status !== 'all') {
        events = await sql`SELECT * FROM community_events WHERE status = ${status} ORDER BY start_time DESC LIMIT ${limit} OFFSET ${offset}` as CommunityEvent[];
        countResult = await sql`SELECT COUNT(*) as total FROM community_events WHERE status = ${status}`;
      } else {
        events = await sql`SELECT * FROM community_events ORDER BY start_time DESC LIMIT ${limit} OFFSET ${offset}` as CommunityEvent[];
        countResult = await sql`SELECT COUNT(*) as total FROM community_events`;
      }
      return { events, total: Number(countResult[0]?.total || 0) };
    } catch (error) {
      console.error('Error getting events:', error);
      return { events: [], total: 0 };
    }
  },

  async createEvent(data: Partial<CommunityEvent>): Promise<boolean> {
    if (!sql) return false;
    try {
      await sql`INSERT INTO community_events (title, description, event_type, start_time, end_time, location, max_participants, reward_points, reward_tokens, status, image_url, created_by) VALUES (${data.title}, ${data.description}, ${data.event_type || 'general'}, ${data.start_time}, ${data.end_time}, ${data.location || ''}, ${data.max_participants || 0}, ${data.reward_points || 0}, ${data.reward_tokens || 0}, ${data.status || 'upcoming'}, ${data.image_url || ''}, ${data.created_by})`;
      return true;
    } catch (error) {
      console.error('Error creating event:', error);
      return false;
    }
  },

  async updateEvent(id: number, data: Partial<CommunityEvent>): Promise<boolean> {
    if (!sql) return false;
    try {
      await sql`UPDATE community_events SET title = COALESCE(${data.title}, title), description = COALESCE(${data.description}, description), status = COALESCE(${data.status}, status) WHERE id = ${id}`;
      return true;
    } catch (error) {
      console.error('Error updating event:', error);
      return false;
    }
  },

  async deleteEvent(id: number): Promise<boolean> {
    if (!sql) return false;
    try {
      await sql`DELETE FROM community_events WHERE id = ${id}`;
      return true;
    } catch (error) {
      console.error('Error deleting event:', error);
      return false;
    }
  },

  async getUserReputations(page = 1, limit = 20): Promise<{ users: UserReputation[]; total: number }> {
    if (!sql) return { users: [], total: 0 };
    try {
      const offset = (page - 1) * limit;
      const users = await sql`SELECT ur.*, u.email as user_email FROM user_reputation ur LEFT JOIN users u ON ur.user_id = u.uid ORDER BY ur.reputation_points DESC LIMIT ${limit} OFFSET ${offset}` as UserReputation[];
      const [countResult] = await sql`SELECT COUNT(*) as total FROM user_reputation`;
      return { users, total: Number(countResult?.total || 0) };
    } catch (error) {
      console.error('Error getting user reputations:', error);
      return { users: [], total: 0 };
    }
  },

  async updateUserReputation(userId: string, points: number, reason: string): Promise<boolean> {
    if (!sql) return false;
    try {
      await sql`UPDATE user_reputation SET reputation_points = reputation_points + ${points} WHERE user_id = ${userId}`;
      return true;
    } catch (error) {
      console.error('Error updating reputation:', error);
      return false;
    }
  },

  async getModerationLogs(page = 1, limit = 50): Promise<{ logs: ModerationLog[]; total: number }> {
    if (!sql) return { logs: [], total: 0 };
    try {
      const offset = (page - 1) * limit;
      const logs = await sql`SELECT ml.*, u.email as moderator_email FROM moderation_logs ml LEFT JOIN users u ON ml.moderator_id = u.uid ORDER BY ml.created_at DESC LIMIT ${limit} OFFSET ${offset}` as ModerationLog[];
      const [countResult] = await sql`SELECT COUNT(*) as total FROM moderation_logs`;
      return { logs, total: Number(countResult?.total || 0) };
    } catch (error) {
      console.error('Error getting moderation logs:', error);
      return { logs: [], total: 0 };
    }
  },

  async createModerationLog(moderatorId: string, action: string, targetType: string, targetId: number, reason: string, details?: any): Promise<boolean> {
    if (!sql) return false;
    try {
      await sql`INSERT INTO moderation_logs (moderator_id, action, target_type, target_id, reason, details) VALUES (${moderatorId}, ${action}, ${targetType}, ${targetId}, ${reason}, ${JSON.stringify(details || {})})`;
      return true;
    } catch (error) {
      console.error('Error creating moderation log:', error);
      return false;
    }
  },

  async getTags(): Promise<PostTag[]> {
    if (!sql) return [];
    try {
      const tags = await sql`SELECT * FROM post_tags ORDER BY usage_count DESC` as PostTag[];
      return tags;
    } catch (error) {
      console.error('Error getting tags:', error);
      return [];
    }
  },

  async createTag(name: string, slug: string): Promise<boolean> {
    if (!sql) return false;
    try {
      await sql`INSERT INTO post_tags (name, slug, usage_count) VALUES (${name}, ${slug}, 0) ON CONFLICT (slug) DO NOTHING`;
      return true;
    } catch (error) {
      console.error('Error creating tag:', error);
      return false;
    }
  },

  async deleteTag(id: number): Promise<boolean> {
    if (!sql) return false;
    try {
      await sql`DELETE FROM post_tags WHERE id = ${id}`;
      return true;
    } catch (error) {
      console.error('Error deleting tag:', error);
      return false;
    }
  }
};
