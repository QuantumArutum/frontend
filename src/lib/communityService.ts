/**
 * Community Service - Production-grade community management
 * Full PostgreSQL implementation for Quantaureum Exchange
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

export interface Post {
  id: number;
  title: string;
  content: string;
  user_id: string;
  author_email?: string;
  category_id: number;
  category_name?: string;
  view_count: number;
  like_count: number;
  comment_count: number;
  is_pinned: boolean;
  is_locked: boolean;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface Comment {
  id: number;
  post_id: number;
  user_id: string;
  author_email?: string;
  content: string;
  parent_id: number | null;
  like_count: number;
  is_best_answer: boolean;
  status: string;
  created_at: string;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  description: string;
  icon?: string;
  color?: string;
  post_count: number;
  sort_order: number;
  is_active: boolean;
  created_at: string;
}

export interface Report {
  id: number;
  reporter_id: string;
  reporter_email?: string;
  reported_user_id: string;
  reported_user_email?: string;
  target_type: string;
  target_id: number;
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
  user_id: string;
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

export interface PrivateMessage {
  id: number;
  sender_id: string;
  sender_email?: string;
  receiver_id: string;
  receiver_email?: string;
  subject: string;
  content: string;
  is_read: boolean;
  created_at: string;
}

export interface CommunityTask {
  id: number;
  title: string;
  description: string;
  task_type: string;
  reward_points: number;
  reward_tokens: number;
  requirements: any;
  max_completions: number;
  current_completions: number;
  is_active: boolean;
  start_date: string;
  end_date: string;
  created_at: string;
}

export interface Notification {
  id: number;
  user_id: string;
  type: string;
  title: string;
  content: string;
  link: string;
  is_read: boolean;
  created_at: string;
}

export interface Activity {
  id: number;
  user_id: string;
  activity_type: string;
  target_type?: string;
  target_id?: number;
  description: string;
  created_at: string;
}

export interface ModAction {
  id: number;
  moderator_id: string;
  action: string;
  target_type: string;
  target_id: number;
  reason?: string;
  status: string;
  created_at: string;
}

export interface User {
  uid: string;
  email: string;
  username?: string;
  reputation_points?: number;
  level?: number;
  created_at?: string;
}

// ==================== COMMUNITY SERVICE ====================

export const communityService = {
  // ========== STATS ==========
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

      const topCategories = await sql`
        SELECT c.name, COUNT(p.id) as count 
        FROM categories c LEFT JOIN posts p ON c.id = p.category_id 
        GROUP BY c.id, c.name ORDER BY count DESC LIMIT 5
      `;

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

  // ========== POSTS ==========
  async getPosts(params: { page?: number; limit?: number; category_id?: number; user_id?: string; status?: string; search?: string }): Promise<{ posts: Post[]; total: number }> {
    if (!sql) return { posts: [], total: 0 };
    try {
      const { page = 1, limit = 20, category_id, user_id, status, search } = params;
      const offset = (page - 1) * limit;

      let whereConditions: string[] = [];
      if (category_id) whereConditions.push(`p.category_id = ${category_id}`);
      if (user_id) whereConditions.push(`p.user_id = '${user_id}'`);
      if (status && status !== 'all') whereConditions.push(`p.status = '${status}'`);
      if (search) whereConditions.push(`(p.title ILIKE '%${search}%' OR p.content ILIKE '%${search}%')`);

      const posts = await sql`
        SELECT p.*, u.email as author_email, c.name as category_name
        FROM posts p LEFT JOIN users u ON p.user_id = u.uid LEFT JOIN categories c ON p.category_id = c.id
        ${whereConditions.length > 0 ? sql`WHERE ${sql.unsafe(whereConditions.join(' AND '))}` : sql``}
        ORDER BY p.is_pinned DESC, p.created_at DESC LIMIT ${limit} OFFSET ${offset}
      ` as Post[];

      const [countResult] = await sql`
        SELECT COUNT(*) as total FROM posts p
        ${whereConditions.length > 0 ? sql`WHERE ${sql.unsafe(whereConditions.join(' AND '))}` : sql``}
      `;

      return { posts, total: Number(countResult?.total || 0) };
    } catch (error) {
      console.error('Error getting posts:', error);
      return { posts: [], total: 0 };
    }
  },

  async getPostById(id: number): Promise<Post | null> {
    if (!sql) return null;
    try {
      const [post] = await sql`
        SELECT p.*, u.email as author_email, c.name as category_name
        FROM posts p LEFT JOIN users u ON p.user_id = u.uid LEFT JOIN categories c ON p.category_id = c.id
        WHERE p.id = ${id}
      ` as Post[];
      if (post) await sql`UPDATE posts SET view_count = view_count + 1 WHERE id = ${id}`;
      return post || null;
    } catch (error) {
      console.error('Error getting post:', error);
      return null;
    }
  },

  async createPost(data: Partial<Post>): Promise<Post | null> {
    if (!sql) return null;
    try {
      const [post] = await sql`
        INSERT INTO posts (title, content, user_id, category_id, is_pinned, status)
        VALUES (${data.title}, ${data.content}, ${data.user_id}, ${data.category_id || null}, ${data.is_pinned || false}, ${data.status || 'published'})
        RETURNING *
      ` as Post[];
      if (post) {
        await sql`INSERT INTO user_reputation (user_id, posts_count, reputation_points) VALUES (${data.user_id}, 1, 10)
          ON CONFLICT (user_id) DO UPDATE SET posts_count = user_reputation.posts_count + 1, reputation_points = user_reputation.reputation_points + 10`;
        await this.logActivity(data.user_id!, 'create_post', 'post', post.id, 10);
      }
      return post || null;
    } catch (error) {
      console.error('Error creating post:', error);
      return null;
    }
  },

  async updatePost(id: number, data: Partial<Post>): Promise<Post | null> {
    if (!sql) return null;
    try {
      const [post] = await sql`
        UPDATE posts SET title = COALESCE(${data.title}, title), content = COALESCE(${data.content}, content),
          category_id = COALESCE(${data.category_id}, category_id), is_pinned = COALESCE(${data.is_pinned}, is_pinned),
          status = COALESCE(${data.status}, status), updated_at = NOW()
        WHERE id = ${id} RETURNING *
      ` as Post[];
      return post || null;
    } catch (error) {
      console.error('Error updating post:', error);
      return null;
    }
  },

  async deletePost(id: number): Promise<boolean> {
    if (!sql) return false;
    try {
      await sql`DELETE FROM posts WHERE id = ${id}`;
      return true;
    } catch (error) {
      console.error('Error deleting post:', error);
      return false;
    }
  },

  async togglePostPin(id: number): Promise<boolean> {
    if (!sql) return false;
    try {
      await sql`UPDATE posts SET is_pinned = NOT is_pinned WHERE id = ${id}`;
      return true;
    } catch (error) {
      console.error('Error toggling post pin:', error);
      return false;
    }
  },

  async togglePostLock(id: number): Promise<boolean> {
    if (!sql) return false;
    try {
      await sql`UPDATE posts SET is_locked = NOT COALESCE(is_locked, false) WHERE id = ${id}`;
      return true;
    } catch (error) {
      console.error('Error toggling post lock:', error);
      return false;
    }
  },

  async likePost(postId: number, userId: string): Promise<boolean> {
    if (!sql) return false;
    try {
      await sql`INSERT INTO post_likes (post_id, user_id) VALUES (${postId}, ${userId}) ON CONFLICT (post_id, user_id) DO NOTHING`;
      await sql`UPDATE posts SET like_count = (SELECT COUNT(*) FROM post_likes WHERE post_id = ${postId}) WHERE id = ${postId}`;
      await this.logActivity(userId, 'like_post', 'post', postId, 1);
      return true;
    } catch (error) {
      console.error('Error liking post:', error);
      return false;
    }
  },

  async unlikePost(postId: number, userId: string): Promise<boolean> {
    if (!sql) return false;
    try {
      await sql`DELETE FROM post_likes WHERE post_id = ${postId} AND user_id = ${userId}`;
      await sql`UPDATE posts SET like_count = (SELECT COUNT(*) FROM post_likes WHERE post_id = ${postId}) WHERE id = ${postId}`;
      return true;
    } catch (error) {
      console.error('Error unliking post:', error);
      return false;
    }
  },

  async bookmarkPost(postId: number, userId: string): Promise<boolean> {
    if (!sql) return false;
    try {
      await sql`INSERT INTO post_bookmarks (post_id, user_id) VALUES (${postId}, ${userId}) ON CONFLICT (post_id, user_id) DO NOTHING`;
      return true;
    } catch (error) {
      console.error('Error bookmarking post:', error);
      return false;
    }
  },

  async unbookmarkPost(postId: number, userId: string): Promise<boolean> {
    if (!sql) return false;
    try {
      await sql`DELETE FROM post_bookmarks WHERE post_id = ${postId} AND user_id = ${userId}`;
      return true;
    } catch (error) {
      console.error('Error unbookmarking post:', error);
      return false;
    }
  },

  // ========== COMMENTS ==========
  async getComments(params: { post_id?: number; user_id?: string; status?: string; page?: number; limit?: number }): Promise<{ comments: Comment[]; total: number }> {
    if (!sql) return { comments: [], total: 0 };
    try {
      const { post_id, user_id, page = 1, limit = 50 } = params;
      const offset = (page - 1) * limit;
      let comments: Comment[];
      let countResult: { total: number }[];

      if (post_id) {
        comments = await sql`SELECT c.*, u.email as author_email FROM comments c LEFT JOIN users u ON c.user_id = u.uid
          WHERE c.post_id = ${post_id} ORDER BY c.created_at ASC LIMIT ${limit} OFFSET ${offset}` as Comment[];
        countResult = await sql`SELECT COUNT(*) as total FROM comments WHERE post_id = ${post_id}`;
      } else if (user_id) {
        comments = await sql`SELECT c.*, u.email as author_email FROM comments c LEFT JOIN users u ON c.user_id = u.uid
          WHERE c.user_id = ${user_id} ORDER BY c.created_at DESC LIMIT ${limit} OFFSET ${offset}` as Comment[];
        countResult = await sql`SELECT COUNT(*) as total FROM comments WHERE user_id = ${user_id}`;
      } else {
        comments = await sql`SELECT c.*, u.email as author_email FROM comments c LEFT JOIN users u ON c.user_id = u.uid
          ORDER BY c.created_at DESC LIMIT ${limit} OFFSET ${offset}` as Comment[];
        countResult = await sql`SELECT COUNT(*) as total FROM comments`;
      }
      return { comments, total: Number(countResult[0]?.total || 0) };
    } catch (error) {
      console.error('Error getting comments:', error);
      return { comments: [], total: 0 };
    }
  },

  async createComment(data: { post_id: number; user_id: string; content: string; parent_id?: number }): Promise<Comment | null> {
    if (!sql) return null;
    try {
      const [comment] = await sql`INSERT INTO comments (post_id, user_id, content, parent_id)
        VALUES (${data.post_id}, ${data.user_id}, ${data.content}, ${data.parent_id || null}) RETURNING *` as Comment[];
      if (comment) {
        await sql`UPDATE posts SET comment_count = comment_count + 1 WHERE id = ${data.post_id}`;
        await sql`INSERT INTO user_reputation (user_id, comments_count, reputation_points) VALUES (${data.user_id}, 1, 5)
          ON CONFLICT (user_id) DO UPDATE SET comments_count = user_reputation.comments_count + 1, reputation_points = user_reputation.reputation_points + 5`;
        await this.logActivity(data.user_id, 'create_comment', 'comment', comment.id, 5);
      }
      return comment || null;
    } catch (error) {
      console.error('Error creating comment:', error);
      return null;
    }
  },

  async updateComment(id: number, content: string): Promise<Comment | null> {
    if (!sql) return null;
    try {
      const [comment] = await sql`UPDATE comments SET content = ${content} WHERE id = ${id} RETURNING *` as Comment[];
      return comment || null;
    } catch (error) {
      console.error('Error updating comment:', error);
      return null;
    }
  },

  async deleteComment(id: number): Promise<boolean> {
    if (!sql) return false;
    try {
      const [comment] = await sql`SELECT post_id FROM comments WHERE id = ${id}`;
      await sql`DELETE FROM comments WHERE id = ${id}`;
      if (comment) await sql`UPDATE posts SET comment_count = GREATEST(comment_count - 1, 0) WHERE id = ${comment.post_id}`;
      return true;
    } catch (error) {
      console.error('Error deleting comment:', error);
      return false;
    }
  },

  async likeComment(commentId: number, userId: string): Promise<boolean> {
    if (!sql) return false;
    try {
      await sql`INSERT INTO comment_likes (comment_id, user_id) VALUES (${commentId}, ${userId}) ON CONFLICT (comment_id, user_id) DO NOTHING`;
      await sql`UPDATE comments SET like_count = (SELECT COUNT(*) FROM comment_likes WHERE comment_id = ${commentId}) WHERE id = ${commentId}`;
      return true;
    } catch (error) {
      console.error('Error liking comment:', error);
      return false;
    }
  },

  async markBestAnswer(commentId: number, postId: number): Promise<boolean> {
    if (!sql) return false;
    try {
      await sql`UPDATE comments SET is_best_answer = false WHERE post_id = ${postId}`;
      await sql`UPDATE comments SET is_best_answer = true WHERE id = ${commentId}`;
      const [comment] = await sql`SELECT user_id FROM comments WHERE id = ${commentId}`;
      if (comment) {
        await sql`UPDATE user_reputation SET helpful_answers = helpful_answers + 1, reputation_points = reputation_points + 25 WHERE user_id = ${comment.user_id}`;
      }
      return true;
    } catch (error) {
      console.error('Error marking best answer:', error);
      return false;
    }
  },

  // ========== CATEGORIES ==========
  async getCategories(): Promise<Category[]> {
    if (!sql) return [];
    try {
      const categories = await sql`SELECT c.*, (SELECT COUNT(*) FROM posts WHERE category_id = c.id) as post_count
        FROM categories c WHERE c.is_active = true ORDER BY c.sort_order ASC` as Category[];
      return categories;
    } catch (error) {
      console.error('Error getting categories:', error);
      return [];
    }
  },

  async getAllCategories(): Promise<Category[]> {
    if (!sql) return [];
    try {
      const categories = await sql`SELECT c.*, (SELECT COUNT(*) FROM posts WHERE category_id = c.id) as post_count
        FROM categories c ORDER BY c.sort_order ASC` as Category[];
      return categories;
    } catch (error) {
      console.error('Error getting all categories:', error);
      return [];
    }
  },

  async createCategory(data: Partial<Category>): Promise<Category | null> {
    if (!sql) return null;
    try {
      const [category] = await sql`INSERT INTO categories (name, slug, description, icon, color, sort_order, is_active)
        VALUES (${data.name}, ${data.slug}, ${data.description || ''}, ${data.icon || ''}, ${data.color || '#1890ff'}, ${data.sort_order || 0}, ${data.is_active !== false})
        RETURNING *` as Category[];
      return category || null;
    } catch (error) {
      console.error('Error creating category:', error);
      return null;
    }
  },

  async updateCategory(id: number, data: Partial<Category>): Promise<Category | null> {
    if (!sql) return null;
    try {
      const [category] = await sql`UPDATE categories SET name = COALESCE(${data.name}, name), slug = COALESCE(${data.slug}, slug),
        description = COALESCE(${data.description}, description), icon = COALESCE(${data.icon}, icon), color = COALESCE(${data.color}, color),
        sort_order = COALESCE(${data.sort_order}, sort_order), is_active = COALESCE(${data.is_active}, is_active)
        WHERE id = ${id} RETURNING *` as Category[];
      return category || null;
    } catch (error) {
      console.error('Error updating category:', error);
      return null;
    }
  },

  async deleteCategory(id: number): Promise<boolean> {
    if (!sql) return false;
    try {
      await sql`UPDATE posts SET category_id = NULL WHERE category_id = ${id}`;
      await sql`DELETE FROM categories WHERE id = ${id}`;
      return true;
    } catch (error) {
      console.error('Error deleting category:', error);
      return false;
    }
  },

  // ========== TAGS ==========
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

  async createTag(name: string, slug: string): Promise<PostTag | null> {
    if (!sql) return null;
    try {
      const [tag] = await sql`INSERT INTO post_tags (name, slug, usage_count) VALUES (${name}, ${slug}, 0)
        ON CONFLICT (slug) DO UPDATE SET name = ${name} RETURNING *` as PostTag[];
      return tag || null;
    } catch (error) {
      console.error('Error creating tag:', error);
      return null;
    }
  },

  async deleteTag(id: number): Promise<boolean> {
    if (!sql) return false;
    try {
      await sql`DELETE FROM post_tag_relations WHERE tag_id = ${id}`;
      await sql`DELETE FROM post_tags WHERE id = ${id}`;
      return true;
    } catch (error) {
      console.error('Error deleting tag:', error);
      return false;
    }
  },

  async addTagToPost(postId: number, tagId: number): Promise<boolean> {
    if (!sql) return false;
    try {
      await sql`INSERT INTO post_tag_relations (post_id, tag_id) VALUES (${postId}, ${tagId}) ON CONFLICT (post_id, tag_id) DO NOTHING`;
      await sql`UPDATE post_tags SET usage_count = usage_count + 1 WHERE id = ${tagId}`;
      return true;
    } catch (error) {
      console.error('Error adding tag to post:', error);
      return false;
    }
  },

  async getPostTags(postId: number): Promise<PostTag[]> {
    if (!sql) return [];
    try {
      const tags = await sql`SELECT t.* FROM post_tags t INNER JOIN post_tag_relations ptr ON t.id = ptr.tag_id WHERE ptr.post_id = ${postId}` as PostTag[];
      return tags;
    } catch (error) {
      console.error('Error getting post tags:', error);
      return [];
    }
  },

  // ========== REPORTS ==========
  async getReports(status?: string, page = 1, limit = 20): Promise<{ reports: Report[]; total: number }> {
    if (!sql) return { reports: [], total: 0 };
    try {
      const offset = (page - 1) * limit;
      let reports: Report[];
      let countResult: { total: number }[];

      if (status && status !== 'all') {
        reports = await sql`SELECT r.*, u1.email as reporter_email, u2.email as reported_user_email
          FROM user_reports r LEFT JOIN users u1 ON r.reporter_id = u1.uid LEFT JOIN users u2 ON r.reported_user_id = u2.uid
          WHERE r.status = ${status} ORDER BY r.created_at DESC LIMIT ${limit} OFFSET ${offset}` as Report[];
        countResult = await sql`SELECT COUNT(*) as total FROM user_reports WHERE status = ${status}`;
      } else {
        reports = await sql`SELECT r.*, u1.email as reporter_email, u2.email as reported_user_email
          FROM user_reports r LEFT JOIN users u1 ON r.reporter_id = u1.uid LEFT JOIN users u2 ON r.reported_user_id = u2.uid
          ORDER BY r.created_at DESC LIMIT ${limit} OFFSET ${offset}` as Report[];
        countResult = await sql`SELECT COUNT(*) as total FROM user_reports`;
      }
      return { reports, total: Number(countResult[0]?.total || 0) };
    } catch (error) {
      console.error('Error getting reports:', error);
      return { reports: [], total: 0 };
    }
  },

  async createReport(data: { reporter_id: string; reported_user_id: string; target_type: string; target_id: number; reason: string; description?: string }): Promise<Report | null> {
    if (!sql) return null;
    try {
      const [report] = await sql`INSERT INTO user_reports (reporter_id, reported_user_id, target_type, target_id, reason, description, status)
        VALUES (${data.reporter_id}, ${data.reported_user_id}, ${data.target_type}, ${data.target_id}, ${data.reason}, ${data.description || ''}, 'pending')
        RETURNING *` as Report[];
      return report || null;
    } catch (error) {
      console.error('Error creating report:', error);
      return null;
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

  // ========== BANS ==========
  async getBans(active?: boolean, page = 1, limit = 20): Promise<{ bans: UserBan[]; total: number }> {
    if (!sql) return { bans: [], total: 0 };
    try {
      const offset = (page - 1) * limit;
      let bans: UserBan[];
      let countResult: { total: number }[];

      if (active !== undefined) {
        bans = await sql`SELECT b.*, u.email as user_email FROM user_bans b LEFT JOIN users u ON b.user_id = u.uid
          WHERE b.is_active = ${active} ORDER BY b.created_at DESC LIMIT ${limit} OFFSET ${offset}` as UserBan[];
        countResult = await sql`SELECT COUNT(*) as total FROM user_bans WHERE is_active = ${active}`;
      } else {
        bans = await sql`SELECT b.*, u.email as user_email FROM user_bans b LEFT JOIN users u ON b.user_id = u.uid
          ORDER BY b.created_at DESC LIMIT ${limit} OFFSET ${offset}` as UserBan[];
        countResult = await sql`SELECT COUNT(*) as total FROM user_bans`;
      }
      return { bans, total: Number(countResult[0]?.total || 0) };
    } catch (error) {
      console.error('Error getting bans:', error);
      return { bans: [], total: 0 };
    }
  },

  async createBan(userId: string, bannedBy: string, reason: string, banType: string, expiresAt?: string): Promise<UserBan | null> {
    if (!sql) return null;
    try {
      const [ban] = await sql`INSERT INTO user_bans (user_id, banned_by, reason, ban_type, expires_at, is_active)
        VALUES (${userId}, ${bannedBy}, ${reason}, ${banType}, ${expiresAt || null}, true) RETURNING *` as UserBan[];
      await sql`UPDATE users SET status = 'banned' WHERE uid = ${userId}`;
      return ban || null;
    } catch (error) {
      console.error('Error creating ban:', error);
      return null;
    }
  },

  async revokeBan(id: number): Promise<boolean> {
    if (!sql) return false;
    try {
      const [ban] = await sql`SELECT user_id FROM user_bans WHERE id = ${id}`;
      await sql`UPDATE user_bans SET is_active = false WHERE id = ${id}`;
      if (ban) await sql`UPDATE users SET status = 'active' WHERE uid = ${ban.user_id}`;
      return true;
    } catch (error) {
      console.error('Error revoking ban:', error);
      return false;
    }
  },

  async isUserBanned(userId: string): Promise<boolean> {
    if (!sql) return false;
    try {
      const [ban] = await sql`SELECT id FROM user_bans WHERE user_id = ${userId} AND is_active = true AND (expires_at IS NULL OR expires_at > NOW()) LIMIT 1`;
      return !!ban;
    } catch (error) {
      console.error('Error checking ban status:', error);
      return false;
    }
  },

  // ========== ANNOUNCEMENTS ==========
  async getAnnouncements(active?: boolean, page = 1, limit = 20): Promise<{ announcements: Announcement[]; total: number }> {
    if (!sql) return { announcements: [], total: 0 };
    try {
      const offset = (page - 1) * limit;
      let announcements: Announcement[];
      let countResult: { total: number }[];

      if (active !== undefined) {
        announcements = await sql`SELECT * FROM community_announcements WHERE is_active = ${active}
          ORDER BY is_pinned DESC, created_at DESC LIMIT ${limit} OFFSET ${offset}` as Announcement[];
        countResult = await sql`SELECT COUNT(*) as total FROM community_announcements WHERE is_active = ${active}`;
      } else {
        announcements = await sql`SELECT * FROM community_announcements ORDER BY is_pinned DESC, created_at DESC
          LIMIT ${limit} OFFSET ${offset}` as Announcement[];
        countResult = await sql`SELECT COUNT(*) as total FROM community_announcements`;
      }
      return { announcements, total: Number(countResult[0]?.total || 0) };
    } catch (error) {
      console.error('Error getting announcements:', error);
      return { announcements: [], total: 0 };
    }
  },

  async createAnnouncement(data: Partial<Announcement>): Promise<Announcement | null> {
    if (!sql) return null;
    try {
      const [announcement] = await sql`INSERT INTO community_announcements (title, content, type, is_pinned, is_active, start_date, end_date, created_by)
        VALUES (${data.title}, ${data.content}, ${data.type || 'info'}, ${data.is_pinned || false}, ${data.is_active !== false}, ${data.start_date || null}, ${data.end_date || null}, ${data.created_by})
        RETURNING *` as Announcement[];
      return announcement || null;
    } catch (error) {
      console.error('Error creating announcement:', error);
      return null;
    }
  },

  async updateAnnouncement(id: number, data: Partial<Announcement>): Promise<Announcement | null> {
    if (!sql) return null;
    try {
      const [announcement] = await sql`UPDATE community_announcements SET title = COALESCE(${data.title}, title),
        content = COALESCE(${data.content}, content), type = COALESCE(${data.type}, type), is_pinned = COALESCE(${data.is_pinned}, is_pinned),
        is_active = COALESCE(${data.is_active}, is_active), start_date = COALESCE(${data.start_date}, start_date), end_date = COALESCE(${data.end_date}, end_date)
        WHERE id = ${id} RETURNING *` as Announcement[];
      return announcement || null;
    } catch (error) {
      console.error('Error updating announcement:', error);
      return null;
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

  // ========== EVENTS ==========
  async getEvents(status?: string, page = 1, limit = 20): Promise<{ events: CommunityEvent[]; total: number }> {
    if (!sql) return { events: [], total: 0 };
    try {
      const offset = (page - 1) * limit;
      let events: CommunityEvent[];
      let countResult: { total: number }[];

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

  async createEvent(data: Partial<CommunityEvent>): Promise<CommunityEvent | null> {
    if (!sql) return null;
    try {
      const [event] = await sql`INSERT INTO community_events (title, description, event_type, start_time, end_time, location, max_participants, reward_points, reward_tokens, status, image_url, created_by)
        VALUES (${data.title}, ${data.description}, ${data.event_type || 'general'}, ${data.start_time}, ${data.end_time}, ${data.location || ''}, ${data.max_participants || 0}, ${data.reward_points || 0}, ${data.reward_tokens || 0}, ${data.status || 'upcoming'}, ${data.image_url || ''}, ${data.created_by})
        RETURNING *` as CommunityEvent[];
      return event || null;
    } catch (error) {
      console.error('Error creating event:', error);
      return null;
    }
  },

  async updateEvent(id: number, data: Partial<CommunityEvent>): Promise<CommunityEvent | null> {
    if (!sql) return null;
    try {
      const [event] = await sql`UPDATE community_events SET title = COALESCE(${data.title}, title), description = COALESCE(${data.description}, description),
        event_type = COALESCE(${data.event_type}, event_type), start_time = COALESCE(${data.start_time}, start_time), end_time = COALESCE(${data.end_time}, end_time),
        location = COALESCE(${data.location}, location), max_participants = COALESCE(${data.max_participants}, max_participants),
        reward_points = COALESCE(${data.reward_points}, reward_points), reward_tokens = COALESCE(${data.reward_tokens}, reward_tokens),
        status = COALESCE(${data.status}, status), image_url = COALESCE(${data.image_url}, image_url)
        WHERE id = ${id} RETURNING *` as CommunityEvent[];
      return event || null;
    } catch (error) {
      console.error('Error updating event:', error);
      return null;
    }
  },

  async deleteEvent(id: number): Promise<boolean> {
    if (!sql) return false;
    try {
      await sql`DELETE FROM event_participants WHERE event_id = ${id}`;
      await sql`DELETE FROM community_events WHERE id = ${id}`;
      return true;
    } catch (error) {
      console.error('Error deleting event:', error);
      return false;
    }
  },

  async registerForEvent(eventId: number, userId: string): Promise<boolean> {
    if (!sql) return false;
    try {
      const [event] = await sql`SELECT max_participants, current_participants FROM community_events WHERE id = ${eventId}`;
      if (event && event.max_participants > 0 && event.current_participants >= event.max_participants) return false;
      await sql`INSERT INTO event_participants (event_id, user_id, status) VALUES (${eventId}, ${userId}, 'registered') ON CONFLICT (event_id, user_id) DO NOTHING`;
      await sql`UPDATE community_events SET current_participants = current_participants + 1 WHERE id = ${eventId}`;
      return true;
    } catch (error) {
      console.error('Error registering for event:', error);
      return false;
    }
  },

  async unregisterFromEvent(eventId: number, userId: string): Promise<boolean> {
    if (!sql) return false;
    try {
      await sql`DELETE FROM event_participants WHERE event_id = ${eventId} AND user_id = ${userId}`;
      await sql`UPDATE community_events SET current_participants = GREATEST(current_participants - 1, 0) WHERE id = ${eventId}`;
      return true;
    } catch (error) {
      console.error('Error unregistering from event:', error);
      return false;
    }
  },

  async markEventAttendance(eventId: number, userId: string): Promise<boolean> {
    if (!sql) return false;
    try {
      await sql`UPDATE event_participants SET status = 'attended', attended_at = NOW() WHERE event_id = ${eventId} AND user_id = ${userId}`;
      return true;
    } catch (error) {
      console.error('Error marking attendance:', error);
      return false;
    }
  },

  async claimEventReward(eventId: number, userId: string): Promise<boolean> {
    if (!sql) return false;
    try {
      const [participant] = await sql`SELECT ep.*, ce.reward_points, ce.reward_tokens FROM event_participants ep
        JOIN community_events ce ON ep.event_id = ce.id
        WHERE ep.event_id = ${eventId} AND ep.user_id = ${userId} AND ep.status = 'attended' AND ep.reward_claimed = false`;
      if (!participant) return false;
      await sql`UPDATE event_participants SET reward_claimed = true WHERE event_id = ${eventId} AND user_id = ${userId}`;
      await sql`UPDATE user_reputation SET reputation_points = reputation_points + ${participant.reward_points} WHERE user_id = ${userId}`;
      return true;
    } catch (error) {
      console.error('Error claiming event reward:', error);
      return false;
    }
  },

  // ========== USER REPUTATION & BADGES ==========
  async getUserReputations(page = 1, limit = 20): Promise<{ users: UserReputation[]; total: number }> {
    if (!sql) return { users: [], total: 0 };
    try {
      const offset = (page - 1) * limit;
      const users = await sql`SELECT ur.*, u.email as user_email FROM user_reputation ur LEFT JOIN users u ON ur.user_id = u.uid
        ORDER BY ur.reputation_points DESC LIMIT ${limit} OFFSET ${offset}` as UserReputation[];
      const [countResult] = await sql`SELECT COUNT(*) as total FROM user_reputation`;
      return { users, total: Number(countResult?.total || 0) };
    } catch (error) {
      console.error('Error getting user reputations:', error);
      return { users: [], total: 0 };
    }
  },

  async getUserReputation(userId: string): Promise<UserReputation | null> {
    if (!sql) return null;
    try {
      const [reputation] = await sql`SELECT ur.*, u.email as user_email FROM user_reputation ur LEFT JOIN users u ON ur.user_id = u.uid
        WHERE ur.user_id = ${userId}` as UserReputation[];
      if (reputation) {
        const badges = await sql`SELECT * FROM user_badges WHERE user_id = ${userId} ORDER BY earned_at DESC` as UserBadge[];
        reputation.badges = badges;
      }
      return reputation || null;
    } catch (error) {
      console.error('Error getting user reputation:', error);
      return null;
    }
  },

  async updateUserReputation(userId: string, points: number, reason: string): Promise<boolean> {
    if (!sql) return false;
    try {
      await sql`INSERT INTO user_reputation (user_id, reputation_points) VALUES (${userId}, ${points})
        ON CONFLICT (user_id) DO UPDATE SET reputation_points = user_reputation.reputation_points + ${points}`;
      const [rep] = await sql`SELECT reputation_points FROM user_reputation WHERE user_id = ${userId}`;
      if (rep) {
        const newLevel = Math.floor(rep.reputation_points / 100) + 1;
        await sql`UPDATE user_reputation SET level = ${newLevel} WHERE user_id = ${userId}`;
      }
      return true;
    } catch (error) {
      console.error('Error updating reputation:', error);
      return false;
    }
  },

  async awardBadge(userId: string, badgeType: string, badgeName: string, badgeIcon: string, description: string): Promise<UserBadge | null> {
    if (!sql) return null;
    try {
      const [badge] = await sql`INSERT INTO user_badges (user_id, badge_type, badge_name, badge_icon, description)
        VALUES (${userId}, ${badgeType}, ${badgeName}, ${badgeIcon}, ${description})
        ON CONFLICT (user_id, badge_type) DO NOTHING RETURNING *` as UserBadge[];
      return badge || null;
    } catch (error) {
      console.error('Error awarding badge:', error);
      return null;
    }
  },

  async getUserBadges(userId: string): Promise<UserBadge[]> {
    if (!sql) return [];
    try {
      const badges = await sql`SELECT * FROM user_badges WHERE user_id = ${userId} ORDER BY earned_at DESC` as UserBadge[];
      return badges;
    } catch (error) {
      console.error('Error getting user badges:', error);
      return [];
    }
  },

  // ========== USER FOLLOWS ==========
  async followUser(followerId: string, followingId: string): Promise<boolean> {
    if (!sql) return false;
    try {
      await sql`INSERT INTO user_follows (follower_id, following_id) VALUES (${followerId}, ${followingId}) ON CONFLICT (follower_id, following_id) DO NOTHING`;
      return true;
    } catch (error) {
      console.error('Error following user:', error);
      return false;
    }
  },

  async unfollowUser(followerId: string, followingId: string): Promise<boolean> {
    if (!sql) return false;
    try {
      await sql`DELETE FROM user_follows WHERE follower_id = ${followerId} AND following_id = ${followingId}`;
      return true;
    } catch (error) {
      console.error('Error unfollowing user:', error);
      return false;
    }
  },

  async getFollowers(userId: string, page = 1, limit = 20): Promise<{ users: User[]; total: number }> {
    if (!sql) return { users: [], total: 0 };
    try {
      const offset = (page - 1) * limit;
      const users = await sql`SELECT u.uid, u.email, ur.reputation_points, ur.level FROM user_follows uf
        JOIN users u ON uf.follower_id = u.uid LEFT JOIN user_reputation ur ON u.uid = ur.user_id
        WHERE uf.following_id = ${userId} ORDER BY uf.created_at DESC LIMIT ${limit} OFFSET ${offset}`;
      const [countResult] = await sql`SELECT COUNT(*) as total FROM user_follows WHERE following_id = ${userId}`;
      return { users, total: Number(countResult?.total || 0) };
    } catch (error) {
      console.error('Error getting followers:', error);
      return { users: [], total: 0 };
    }
  },

  async getFollowing(userId: string, page = 1, limit = 20): Promise<{ users: User[]; total: number }> {
    if (!sql) return { users: [], total: 0 };
    try {
      const offset = (page - 1) * limit;
      const users = await sql`SELECT u.uid, u.email, ur.reputation_points, ur.level FROM user_follows uf
        JOIN users u ON uf.following_id = u.uid LEFT JOIN user_reputation ur ON u.uid = ur.user_id
        WHERE uf.follower_id = ${userId} ORDER BY uf.created_at DESC LIMIT ${limit} OFFSET ${offset}`;
      const [countResult] = await sql`SELECT COUNT(*) as total FROM user_follows WHERE follower_id = ${userId}`;
      return { users, total: Number(countResult?.total || 0) };
    } catch (error) {
      console.error('Error getting following:', error);
      return { users: [], total: 0 };
    }
  },

  async isFollowing(followerId: string, followingId: string): Promise<boolean> {
    if (!sql) return false;
    try {
      const [result] = await sql`SELECT id FROM user_follows WHERE follower_id = ${followerId} AND following_id = ${followingId}`;
      return !!result;
    } catch (error) {
      console.error('Error checking follow status:', error);
      return false;
    }
  },

  // ========== MODERATION LOGS ==========
  async getModerationLogs(page = 1, limit = 50): Promise<{ logs: ModerationLog[]; total: number }> {
    if (!sql) return { logs: [], total: 0 };
    try {
      const offset = (page - 1) * limit;
      const logs = await sql`SELECT ml.*, u.email as moderator_email FROM moderation_logs ml LEFT JOIN users u ON ml.moderator_id = u.uid
        ORDER BY ml.created_at DESC LIMIT ${limit} OFFSET ${offset}` as ModerationLog[];
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
      await sql`INSERT INTO moderation_logs (moderator_id, action, target_type, target_id, reason, details)
        VALUES (${moderatorId}, ${action}, ${targetType}, ${targetId}, ${reason}, ${JSON.stringify(details || {})})`;
      return true;
    } catch (error) {
      console.error('Error creating moderation log:', error);
      return false;
    }
  },

  // ========== PRIVATE MESSAGES ==========
  async getMessages(userId: string, type: 'inbox' | 'sent' = 'inbox', page = 1, limit = 20): Promise<{ messages: PrivateMessage[]; total: number }> {
    if (!sql) return { messages: [], total: 0 };
    try {
      const offset = (page - 1) * limit;
      let messages: PrivateMessage[];
      let countResult: { total: number }[];

      if (type === 'inbox') {
        messages = await sql`SELECT pm.*, u.email as sender_email FROM private_messages pm LEFT JOIN users u ON pm.sender_id = u.uid
          WHERE pm.receiver_id = ${userId} ORDER BY pm.created_at DESC LIMIT ${limit} OFFSET ${offset}` as PrivateMessage[];
        countResult = await sql`SELECT COUNT(*) as total FROM private_messages WHERE receiver_id = ${userId}`;
      } else {
        messages = await sql`SELECT pm.*, u.email as receiver_email FROM private_messages pm LEFT JOIN users u ON pm.receiver_id = u.uid
          WHERE pm.sender_id = ${userId} ORDER BY pm.created_at DESC LIMIT ${limit} OFFSET ${offset}` as PrivateMessage[];
        countResult = await sql`SELECT COUNT(*) as total FROM private_messages WHERE sender_id = ${userId}`;
      }
      return { messages, total: Number(countResult[0]?.total || 0) };
    } catch (error) {
      console.error('Error getting messages:', error);
      return { messages: [], total: 0 };
    }
  },

  async sendMessage(senderId: string, receiverId: string, subject: string, content: string): Promise<PrivateMessage | null> {
    if (!sql) return null;
    try {
      const [message] = await sql`INSERT INTO private_messages (sender_id, receiver_id, subject, content)
        VALUES (${senderId}, ${receiverId}, ${subject}, ${content}) RETURNING *` as PrivateMessage[];
      if (message) await this.createNotification(receiverId, 'message', '新私信', `您收到来自用户的新私信`, `/messages`);
      return message || null;
    } catch (error) {
      console.error('Error sending message:', error);
      return null;
    }
  },

  async markMessageRead(messageId: number): Promise<boolean> {
    if (!sql) return false;
    try {
      await sql`UPDATE private_messages SET is_read = true WHERE id = ${messageId}`;
      return true;
    } catch (error) {
      console.error('Error marking message read:', error);
      return false;
    }
  },

  async deleteMessage(messageId: number): Promise<boolean> {
    if (!sql) return false;
    try {
      await sql`DELETE FROM private_messages WHERE id = ${messageId}`;
      return true;
    } catch (error) {
      console.error('Error deleting message:', error);
      return false;
    }
  },

  async getUnreadMessageCount(userId: string): Promise<number> {
    if (!sql) return 0;
    try {
      const [result] = await sql`SELECT COUNT(*) as total FROM private_messages WHERE receiver_id = ${userId} AND is_read = false`;
      return Number(result?.total || 0);
    } catch (error) {
      console.error('Error getting unread count:', error);
      return 0;
    }
  },

  // ========== NOTIFICATIONS ==========
  async getNotifications(userId: string, page = 1, limit = 20): Promise<{ notifications: Notification[]; total: number }> {
    if (!sql) return { notifications: [], total: 0 };
    try {
      const offset = (page - 1) * limit;
      const notifications = await sql`SELECT * FROM community_notifications WHERE user_id = ${userId}
        ORDER BY created_at DESC LIMIT ${limit} OFFSET ${offset}` as Notification[];
      const [countResult] = await sql`SELECT COUNT(*) as total FROM community_notifications WHERE user_id = ${userId}`;
      return { notifications, total: Number(countResult?.total || 0) };
    } catch (error) {
      console.error('Error getting notifications:', error);
      return { notifications: [], total: 0 };
    }
  },

  async createNotification(userId: string, type: string, title: string, content: string, link?: string): Promise<boolean> {
    if (!sql) return false;
    try {
      await sql`INSERT INTO community_notifications (user_id, type, title, content, link) VALUES (${userId}, ${type}, ${title}, ${content}, ${link || ''})`;
      return true;
    } catch (error) {
      console.error('Error creating notification:', error);
      return false;
    }
  },

  async markNotificationRead(notificationId: number): Promise<boolean> {
    if (!sql) return false;
    try {
      await sql`UPDATE community_notifications SET is_read = true WHERE id = ${notificationId}`;
      return true;
    } catch (error) {
      console.error('Error marking notification read:', error);
      return false;
    }
  },

  async markAllNotificationsRead(userId: string): Promise<boolean> {
    if (!sql) return false;
    try {
      await sql`UPDATE community_notifications SET is_read = true WHERE user_id = ${userId}`;
      return true;
    } catch (error) {
      console.error('Error marking all notifications read:', error);
      return false;
    }
  },

  async getUnreadNotificationCount(userId: string): Promise<number> {
    if (!sql) return 0;
    try {
      const [result] = await sql`SELECT COUNT(*) as total FROM community_notifications WHERE user_id = ${userId} AND is_read = false`;
      return Number(result?.total || 0);
    } catch (error) {
      console.error('Error getting unread notification count:', error);
      return 0;
    }
  },

  // ========== TASKS ==========
  async getTasks(active?: boolean, page = 1, limit = 20): Promise<{ tasks: CommunityTask[]; total: number }> {
    if (!sql) return { tasks: [], total: 0 };
    try {
      const offset = (page - 1) * limit;
      let tasks: CommunityTask[];
      let countResult: { total: number }[];

      if (active !== undefined) {
        tasks = await sql`SELECT * FROM community_tasks WHERE is_active = ${active} ORDER BY created_at DESC LIMIT ${limit} OFFSET ${offset}` as CommunityTask[];
        countResult = await sql`SELECT COUNT(*) as total FROM community_tasks WHERE is_active = ${active}`;
      } else {
        tasks = await sql`SELECT * FROM community_tasks ORDER BY created_at DESC LIMIT ${limit} OFFSET ${offset}` as CommunityTask[];
        countResult = await sql`SELECT COUNT(*) as total FROM community_tasks`;
      }
      return { tasks, total: Number(countResult[0]?.total || 0) };
    } catch (error) {
      console.error('Error getting tasks:', error);
      return { tasks: [], total: 0 };
    }
  },

  async createTask(data: Partial<CommunityTask>): Promise<CommunityTask | null> {
    if (!sql) return null;
    try {
      const [task] = await sql`INSERT INTO community_tasks (title, description, task_type, reward_points, reward_tokens, requirements, max_completions, is_active, start_date, end_date)
        VALUES (${data.title}, ${data.description}, ${data.task_type || 'daily'}, ${data.reward_points || 0}, ${data.reward_tokens || 0}, ${JSON.stringify(data.requirements || {})}, ${data.max_completions || 0}, ${data.is_active !== false}, ${data.start_date || null}, ${data.end_date || null})
        RETURNING *` as CommunityTask[];
      return task || null;
    } catch (error) {
      console.error('Error creating task:', error);
      return null;
    }
  },

  async updateTask(id: number, data: Partial<CommunityTask>): Promise<CommunityTask | null> {
    if (!sql) return null;
    try {
      const [task] = await sql`UPDATE community_tasks SET title = COALESCE(${data.title}, title), description = COALESCE(${data.description}, description),
        task_type = COALESCE(${data.task_type}, task_type), reward_points = COALESCE(${data.reward_points}, reward_points),
        reward_tokens = COALESCE(${data.reward_tokens}, reward_tokens), max_completions = COALESCE(${data.max_completions}, max_completions),
        is_active = COALESCE(${data.is_active}, is_active) WHERE id = ${id} RETURNING *` as CommunityTask[];
      return task || null;
    } catch (error) {
      console.error('Error updating task:', error);
      return null;
    }
  },

  async deleteTask(id: number): Promise<boolean> {
    if (!sql) return false;
    try {
      await sql`DELETE FROM task_completions WHERE task_id = ${id}`;
      await sql`DELETE FROM community_tasks WHERE id = ${id}`;
      return true;
    } catch (error) {
      console.error('Error deleting task:', error);
      return false;
    }
  },

  async completeTask(taskId: number, userId: string): Promise<boolean> {
    if (!sql) return false;
    try {
      const [task] = await sql`SELECT * FROM community_tasks WHERE id = ${taskId} AND is_active = true`;
      if (!task) return false;
      if (task.max_completions > 0 && task.current_completions >= task.max_completions) return false;

      await sql`INSERT INTO task_completions (task_id, user_id) VALUES (${taskId}, ${userId}) ON CONFLICT (task_id, user_id) DO NOTHING`;
      await sql`UPDATE community_tasks SET current_completions = current_completions + 1 WHERE id = ${taskId}`;
      await sql`INSERT INTO user_reputation (user_id, reputation_points) VALUES (${userId}, ${task.reward_points})
        ON CONFLICT (user_id) DO UPDATE SET reputation_points = user_reputation.reputation_points + ${task.reward_points}`;
      await this.logActivity(userId, 'complete_task', 'task', taskId, task.reward_points);
      return true;
    } catch (error) {
      console.error('Error completing task:', error);
      return false;
    }
  },

  // ========== ACTIVITY LOGGING ==========
  async logActivity(userId: string, activityType: string, targetType: string, targetId: number, pointsEarned: number = 0): Promise<boolean> {
    if (!sql) return false;
    try {
      await sql`INSERT INTO user_activity_logs (user_id, activity_type, target_type, target_id, points_earned)
        VALUES (${userId}, ${activityType}, ${targetType}, ${targetId}, ${pointsEarned})`;
      return true;
    } catch (error) {
      console.error('Error logging activity:', error);
      return false;
    }
  },

  async getUserActivities(userId: string, page = 1, limit = 50): Promise<{ activities: Activity[]; total: number }> {
    if (!sql) return { activities: [], total: 0 };
    try {
      const offset = (page - 1) * limit;
      const activities = await sql`SELECT * FROM user_activity_logs WHERE user_id = ${userId} ORDER BY created_at DESC LIMIT ${limit} OFFSET ${offset}`;
      const [countResult] = await sql`SELECT COUNT(*) as total FROM user_activity_logs WHERE user_id = ${userId}`;
      return { activities, total: Number(countResult?.total || 0) };
    } catch (error) {
      console.error('Error getting user activities:', error);
      return { activities: [], total: 0 };
    }
  },

  async getRecentActivities(page = 1, limit = 50): Promise<{ activities: Activity[]; total: number }> {
    if (!sql) return { activities: [], total: 0 };
    try {
      const offset = (page - 1) * limit;
      const activities = await sql`SELECT al.*, u.email as user_email FROM user_activity_logs al
        LEFT JOIN users u ON al.user_id = u.uid ORDER BY al.created_at DESC LIMIT ${limit} OFFSET ${offset}`;
      const [countResult] = await sql`SELECT COUNT(*) as total FROM user_activity_logs`;
      return { activities, total: Number(countResult?.total || 0) };
    } catch (error) {
      console.error('Error getting recent activities:', error);
      return { activities: [], total: 0 };
    }
  },

  // ========== ANALYTICS ==========
  async getAnalytics(days: number = 30): Promise<any> {
    if (!sql) return null;
    try {
      const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();

      const dailyPosts = await sql`SELECT DATE(created_at) as date, COUNT(*) as count FROM posts
        WHERE created_at > ${startDate} GROUP BY DATE(created_at) ORDER BY date`;
      const dailyComments = await sql`SELECT DATE(created_at) as date, COUNT(*) as count FROM comments
        WHERE created_at > ${startDate} GROUP BY DATE(created_at) ORDER BY date`;
      const dailyUsers = await sql`SELECT DATE(created_at) as date, COUNT(*) as count FROM users
        WHERE created_at > ${startDate} GROUP BY DATE(created_at) ORDER BY date`;
      const dailyActivities = await sql`SELECT DATE(created_at) as date, COUNT(*) as count FROM user_activity_logs
        WHERE created_at > ${startDate} GROUP BY DATE(created_at) ORDER BY date`;

      const topPosters = await sql`SELECT u.uid, u.email, COUNT(p.id) as post_count FROM users u
        LEFT JOIN posts p ON u.uid = p.user_id WHERE p.created_at > ${startDate}
        GROUP BY u.uid, u.email ORDER BY post_count DESC LIMIT 10`;
      const topCommenters = await sql`SELECT u.uid, u.email, COUNT(c.id) as comment_count FROM users u
        LEFT JOIN comments c ON u.uid = c.user_id WHERE c.created_at > ${startDate}
        GROUP BY u.uid, u.email ORDER BY comment_count DESC LIMIT 10`;
      const categoryStats = await sql`SELECT c.name, COUNT(p.id) as post_count FROM categories c
        LEFT JOIN posts p ON c.id = p.category_id WHERE p.created_at > ${startDate}
        GROUP BY c.id, c.name ORDER BY post_count DESC`;

      const [totalStats] = await sql`SELECT
        (SELECT COUNT(*) FROM posts WHERE created_at > ${startDate}) as new_posts,
        (SELECT COUNT(*) FROM comments WHERE created_at > ${startDate}) as new_comments,
        (SELECT COUNT(*) FROM users WHERE created_at > ${startDate}) as new_users,
        (SELECT COUNT(*) FROM user_activity_logs WHERE created_at > ${startDate}) as total_activities`;

      return {
        period: { days, startDate },
        totals: {
          newPosts: Number(totalStats?.new_posts || 0),
          newComments: Number(totalStats?.new_comments || 0),
          newUsers: Number(totalStats?.new_users || 0),
          totalActivities: Number(totalStats?.total_activities || 0)
        },
        daily: { posts: dailyPosts, comments: dailyComments, users: dailyUsers, activities: dailyActivities },
        leaderboards: { topPosters, topCommenters },
        categoryStats
      };
    } catch (error) {
      console.error('Error getting analytics:', error);
      return null;
    }
  },

  // ========== SEARCH ==========
  async search(query: string, type?: string, page = 1, limit = 20): Promise<any> {
    if (!sql) return { results: [], total: 0 };
    try {
      const offset = (page - 1) * limit;
      const searchTerm = `%${query}%`;

      if (type === 'posts' || !type) {
        const posts = await sql`SELECT p.*, u.email as author_email, 'post' as result_type FROM posts p
          LEFT JOIN users u ON p.user_id = u.uid
          WHERE p.title ILIKE ${searchTerm} OR p.content ILIKE ${searchTerm}
          ORDER BY p.created_at DESC LIMIT ${limit} OFFSET ${offset}`;
        const [countResult] = await sql`SELECT COUNT(*) as total FROM posts WHERE title ILIKE ${searchTerm} OR content ILIKE ${searchTerm}`;
        if (type === 'posts') return { results: posts, total: Number(countResult?.total || 0) };
      }

      if (type === 'users' || !type) {
        const users = await sql`SELECT u.uid, u.email, ur.reputation_points, ur.level, 'user' as result_type FROM users u
          LEFT JOIN user_reputation ur ON u.uid = ur.user_id
          WHERE u.email ILIKE ${searchTerm} OR u.uid ILIKE ${searchTerm}
          ORDER BY ur.reputation_points DESC NULLS LAST LIMIT ${limit} OFFSET ${offset}`;
        const [countResult] = await sql`SELECT COUNT(*) as total FROM users WHERE email ILIKE ${searchTerm} OR uid ILIKE ${searchTerm}`;
        if (type === 'users') return { results: users, total: Number(countResult?.total || 0) };
      }

      // Combined search
      const posts = await sql`SELECT p.id, p.title, p.created_at, 'post' as result_type FROM posts p
        WHERE p.title ILIKE ${searchTerm} OR p.content ILIKE ${searchTerm} LIMIT 10`;
      const users = await sql`SELECT u.uid as id, u.email as title, u.created_at, 'user' as result_type FROM users u
        WHERE u.email ILIKE ${searchTerm} LIMIT 10`;

      return { results: [...posts, ...users], total: posts.length + users.length };
    } catch (error) {
      console.error('Error searching:', error);
      return { results: [], total: 0 };
    }
  },

  // ========== COMMUNITY USERS (for admin) ==========
  async getCommunityUsers(params: { page?: number; limit?: number; search?: string; status?: string }): Promise<{ users: User[]; total: number }> {
    if (!sql) return { users: [], total: 0 };
    try {
      const { page = 1, limit = 20, search, status } = params;
      const offset = (page - 1) * limit;

      let whereConditions: string[] = [];
      if (search) whereConditions.push(`(u.email ILIKE '%${search}%' OR u.uid ILIKE '%${search}%')`);
      if (status && status !== 'all') whereConditions.push(`u.status = '${status}'`);

      const users = await sql`
        SELECT u.uid, u.email, u.status, u.created_at, ur.reputation_points, ur.level, ur.posts_count, ur.comments_count,
          (SELECT COUNT(*) FROM user_bans WHERE user_id = u.uid AND is_active = true) as active_bans
        FROM users u LEFT JOIN user_reputation ur ON u.uid = ur.user_id
        ${whereConditions.length > 0 ? sql`WHERE ${sql.unsafe(whereConditions.join(' AND '))}` : sql``}
        ORDER BY u.created_at DESC LIMIT ${limit} OFFSET ${offset}
      `;

      const [countResult] = await sql`SELECT COUNT(*) as total FROM users u
        ${whereConditions.length > 0 ? sql`WHERE ${sql.unsafe(whereConditions.join(' AND '))}` : sql``}`;

      return { users, total: Number(countResult?.total || 0) };
    } catch (error) {
      console.error('Error getting community users:', error);
      return { users: [], total: 0 };
    }
  },

  // ========== ADMIN MESSAGES (for admin panel) ==========
  async getAllMessages(params: { page?: number; limit?: number; search?: string }): Promise<{ messages: PrivateMessage[]; total: number }> {
    if (!sql) return { messages: [], total: 0 };
    try {
      const { page = 1, limit = 20, search } = params;
      const offset = (page - 1) * limit;

      let messages: PrivateMessage[];
      let countResult: { total: number }[];

      if (search) {
        messages = await sql`SELECT pm.*, u1.email as sender_email, u2.email as receiver_email
          FROM private_messages pm LEFT JOIN users u1 ON pm.sender_id = u1.uid LEFT JOIN users u2 ON pm.receiver_id = u2.uid
          WHERE pm.subject ILIKE ${'%' + search + '%'} OR pm.content ILIKE ${'%' + search + '%'}
          ORDER BY pm.created_at DESC LIMIT ${limit} OFFSET ${offset}` as PrivateMessage[];
        countResult = await sql`SELECT COUNT(*) as total FROM private_messages WHERE subject ILIKE ${'%' + search + '%'} OR content ILIKE ${'%' + search + '%'}`;
      } else {
        messages = await sql`SELECT pm.*, u1.email as sender_email, u2.email as receiver_email
          FROM private_messages pm LEFT JOIN users u1 ON pm.sender_id = u1.uid LEFT JOIN users u2 ON pm.receiver_id = u2.uid
          ORDER BY pm.created_at DESC LIMIT ${limit} OFFSET ${offset}` as PrivateMessage[];
        countResult = await sql`SELECT COUNT(*) as total FROM private_messages`;
      }

      return { messages, total: Number(countResult[0]?.total || 0) };
    } catch (error) {
      console.error('Error getting all messages:', error);
      return { messages: [], total: 0 };
    }
  },

  // ========== MODERATION QUEUE ==========
  async getModerationQueue(page = 1, limit = 50): Promise<{ queue: ModAction[]; pending: number; approved: number; rejected: number }> {
    if (!sql) return { queue: [], pending: 0, approved: 0, rejected: 0 };
    try {
      const offset = (page - 1) * limit;
      
      // Try to get from moderation_queue table, fallback to empty if not exists
      try {
        const queue = await sql`
          SELECT mq.*, u.email as author_email 
          FROM moderation_queue mq 
          LEFT JOIN users u ON mq.author_id = u.uid
          ORDER BY mq.created_at DESC 
          LIMIT ${limit} OFFSET ${offset}
        `;
        
        const [pendingCount] = await sql`SELECT COUNT(*) as total FROM moderation_queue WHERE status = 'pending'`;
        const [approvedCount] = await sql`SELECT COUNT(*) as total FROM moderation_queue WHERE status = 'approved'`;
        const [rejectedCount] = await sql`SELECT COUNT(*) as total FROM moderation_queue WHERE status = 'rejected'`;
        
        return {
          queue: queue || [],
          pending: Number(pendingCount?.total || 0),
          approved: Number(approvedCount?.total || 0),
          rejected: Number(rejectedCount?.total || 0)
        };
      } catch {
        // Table doesn't exist, return empty
        return { queue: [], pending: 0, approved: 0, rejected: 0 };
      }
    } catch (error) {
      console.error('Error getting moderation queue:', error);
      return { queue: [], pending: 0, approved: 0, rejected: 0 };
    }
  },

  async updateModerationQueueItem(id: string, status: string, reviewedBy: string, reviewNote?: string): Promise<boolean> {
    if (!sql) return false;
    try {
      await sql`
        UPDATE moderation_queue 
        SET status = ${status}, reviewed_by = ${reviewedBy}, review_note = ${reviewNote || ''}, reviewed_at = NOW()
        WHERE id = ${id}
      `;
      return true;
    } catch (error) {
      console.error('Error updating moderation queue item:', error);
      return false;
    }
  },

  // ========== SENSITIVE WORDS ==========
  async getSensitiveWords(): Promise<any[]> {
    if (!sql) return [];
    try {
      try {
        const words = await sql`SELECT * FROM sensitive_words WHERE is_active = true ORDER BY created_at DESC`;
        return words || [];
      } catch {
        // Table doesn't exist, return empty
        return [];
      }
    } catch (error) {
      console.error('Error getting sensitive words:', error);
      return [];
    }
  },

  async addSensitiveWord(word: string, level: string, category: string): Promise<boolean> {
    if (!sql) return false;
    try {
      await sql`
        INSERT INTO sensitive_words (word, level, category, is_active, created_at)
        VALUES (${word}, ${level}, ${category}, true, NOW())
        ON CONFLICT (word) DO UPDATE SET level = ${level}, category = ${category}
      `;
      return true;
    } catch (error) {
      console.error('Error adding sensitive word:', error);
      return false;
    }
  },

  async deleteSensitiveWord(id: number): Promise<boolean> {
    if (!sql) return false;
    try {
      await sql`DELETE FROM sensitive_words WHERE id = ${id}`;
      return true;
    } catch (error) {
      console.error('Error deleting sensitive word:', error);
      return false;
    }
  }
};

export default communityService;
