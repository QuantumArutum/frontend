/**
 * Database Configuration - Production Mode
 * 
 * This module provides database connectivity using the real PostgreSQL database.
 * All demo/mock data has been removed for production use.
 * 
 * Environment Variables Required:
 * - DATABASE_URL or POSTGRES_URL: PostgreSQL connection string
 */

import { sql, dbQuery, initDatabase } from './database';
import type { User, Post } from './communityService';

// Additional type definitions
interface AuditLog {
  id: number;
  action: string;
  admin_id?: string;
  details?: string;
  created_at: string;
}

interface FooterLink {
  id: number;
  title: string;
  url: string;
  order: number;
}

interface Domain {
  id: number;
  domain: string;
  is_active: boolean;
}

interface Deposit {
  id: number;
  user_id: string;
  amount: number;
  currency: string;
  status: string;
  created_at: string;
}

interface BlockchainNetwork {
  id: number;
  name: string;
  chain_id: number;
  rpc_url: string;
  is_active: boolean;
}

// Re-export database utilities
export { sql, dbQuery, initDatabase };

// Check if database is configured
const isDatabaseConfigured = !!sql;

if (!isDatabaseConfigured) {
  console.error('WARNING: DATABASE_URL not configured. Database operations will fail.');
}

// Database interface for backward compatibility
export interface DBResult<T> {
  success: boolean;
  data?: T;
  error?: string;
}

// Wrapper functions that use the real database
export const db = {
  isDemoMode: () => false, // Always production mode now

  // Users
  getUsers: async (params: { page?: number; limit?: number; search?: string; state?: string }): Promise<DBResult<{ users: User[]; total: number }>> => {
    try {
      const result = await dbQuery.getUsers(params);
      return { success: true, data: result };
    } catch (error) {
      console.error('Error getting users:', error);
      return { success: false, error: 'Database error', data: { users: [], total: 0 } };
    }
  },

  getUserById: async (id: string): Promise<DBResult<User>> => {
    try {
      const user = await dbQuery.getUserByUid(id);
      if (!user) return { success: false, error: 'User not found' };
      return { success: true, data: user };
    } catch (error) {
      console.error('Error getting user:', error);
      return { success: false, error: 'Database error' };
    }
  },

  updateUser: async (id: string, updates: Partial<User>): Promise<DBResult<User>> => {
    try {
      const user = await dbQuery.updateUser(id, updates);
      if (!user) return { success: false, error: 'User not found' };
      return { success: true, data: user };
    } catch (error) {
      console.error('Error updating user:', error);
      return { success: false, error: 'Database error' };
    }
  },

  // Community Posts
  getPosts: async (params: { page?: number; limit?: number; category?: string; search?: string }): Promise<DBResult<{ posts: Post[]; total: number }>> => {
    try {
      const result = await dbQuery.getPosts(params);
      return { success: true, data: result };
    } catch (error) {
      console.error('Error getting posts:', error);
      return { success: false, error: 'Database error', data: { posts: [], total: 0 } };
    }
  },

  getPostById: async (id: string): Promise<DBResult<Post>> => {
    try {
      if (!sql) return { success: false, error: 'Database not configured' };
      const result = await sql`SELECT p.*, u.email as author_email FROM posts p LEFT JOIN users u ON p.user_id = u.uid WHERE p.id = ${parseInt(id)} OR p.id::text = ${id}`;
      if (!result || result.length === 0) return { success: false, error: 'Post not found' };
      return { success: true, data: result[0] };
    } catch (error) {
      console.error('Error getting post:', error);
      return { success: false, error: 'Database error' };
    }
  },

  createPost: async (post: any): Promise<DBResult<any>> => {
    try {
      const result = await dbQuery.createPost(post);
      if (!result) return { success: false, error: 'Failed to create post' };
      return { success: true, data: result };
    } catch (error) {
      console.error('Error creating post:', error);
      return { success: false, error: 'Database error' };
    }
  },

  updatePost: async (id: string, updates: any): Promise<DBResult<any>> => {
    try {
      const result = await dbQuery.updatePost(parseInt(id), updates);
      if (!result) return { success: false, error: 'Post not found' };
      return { success: true, data: result };
    } catch (error) {
      console.error('Error updating post:', error);
      return { success: false, error: 'Database error' };
    }
  },

  deletePost: async (id: string): Promise<DBResult<void>> => {
    try {
      await dbQuery.deletePost(parseInt(id));
      return { success: true };
    } catch (error) {
      console.error('Error deleting post:', error);
      return { success: false, error: 'Database error' };
    }
  },

  togglePostPin: async (id: string): Promise<DBResult<any>> => {
    try {
      if (!sql) return { success: false, error: 'Database not configured' };
      const result = await sql`UPDATE posts SET is_pinned = NOT COALESCE(is_pinned, false) WHERE id = ${parseInt(id)} RETURNING *`;
      if (!result || result.length === 0) return { success: false, error: 'Post not found' };
      return { success: true, data: result[0] };
    } catch (error) {
      console.error('Error toggling post pin:', error);
      return { success: false, error: 'Database error' };
    }
  },

  togglePostLock: async (id: string): Promise<DBResult<any>> => {
    try {
      if (!sql) return { success: false, error: 'Database not configured' };
      const result = await sql`UPDATE posts SET is_locked = NOT COALESCE(is_locked, false) WHERE id = ${parseInt(id)} RETURNING *`;
      if (!result || result.length === 0) return { success: false, error: 'Post not found' };
      return { success: true, data: result[0] };
    } catch (error) {
      console.error('Error toggling post lock:', error);
      return { success: false, error: 'Database error' };
    }
  },

  togglePostLike: async (postId: string, userId: string): Promise<DBResult<{ liked: boolean; like_count: number }>> => {
    try {
      if (!sql) return { success: false, error: 'Database not configured' };
      // Check if already liked
      const existing = await sql`SELECT id FROM post_likes WHERE post_id = ${parseInt(postId)} AND user_id = ${userId}`;
      let liked: boolean;
      if (existing && existing.length > 0) {
        await sql`DELETE FROM post_likes WHERE post_id = ${parseInt(postId)} AND user_id = ${userId}`;
        liked = false;
      } else {
        await sql`INSERT INTO post_likes (post_id, user_id) VALUES (${parseInt(postId)}, ${userId})`;
        liked = true;
      }
      // Update like count
      const countResult = await sql`SELECT COUNT(*) as count FROM post_likes WHERE post_id = ${parseInt(postId)}`;
      const likeCount = parseInt(countResult[0]?.count || '0');
      await sql`UPDATE posts SET like_count = ${likeCount} WHERE id = ${parseInt(postId)}`;
      return { success: true, data: { liked, like_count: likeCount } };
    } catch (error) {
      console.error('Error toggling post like:', error);
      return { success: false, error: 'Database error' };
    }
  },

  // Categories
  getCategories: async (): Promise<DBResult<any[]>> => {
    try {
      const categories = await dbQuery.getCategories();
      return { success: true, data: categories };
    } catch (error) {
      console.error('Error getting categories:', error);
      return { success: false, error: 'Database error', data: [] };
    }
  },

  createCategory: async (category: any): Promise<DBResult<any>> => {
    try {
      const result = await dbQuery.createCategory(category);
      if (!result) return { success: false, error: 'Failed to create category' };
      return { success: true, data: result };
    } catch (error) {
      console.error('Error creating category:', error);
      return { success: false, error: 'Database error' };
    }
  },

  updateCategory: async (id: string, updates: any): Promise<DBResult<any>> => {
    try {
      if (!sql) return { success: false, error: 'Database not configured' };
      const result = await sql`
        UPDATE categories SET 
          name = COALESCE(${updates.name}, name),
          slug = COALESCE(${updates.slug}, slug),
          description = COALESCE(${updates.description}, description),
          sort_order = COALESCE(${updates.sort_order}, sort_order),
          is_active = COALESCE(${updates.is_active}, is_active)
        WHERE id = ${parseInt(id)} RETURNING *
      `;
      if (!result || result.length === 0) return { success: false, error: 'Category not found' };
      return { success: true, data: result[0] };
    } catch (error) {
      console.error('Error updating category:', error);
      return { success: false, error: 'Database error' };
    }
  },

  deleteCategory: async (id: string): Promise<DBResult<void>> => {
    try {
      if (!sql) return { success: false, error: 'Database not configured' };
      // Check if category has posts
      const posts = await sql`SELECT COUNT(*) as count FROM posts WHERE category_id = ${parseInt(id)}`;
      if (parseInt(posts[0]?.count || '0') > 0) {
        return { success: false, error: 'Cannot delete category with posts' };
      }
      await sql`DELETE FROM categories WHERE id = ${parseInt(id)}`;
      return { success: true };
    } catch (error) {
      console.error('Error deleting category:', error);
      return { success: false, error: 'Database error' };
    }
  },

  // Comments
  getPostComments: async (postId: string): Promise<DBResult<any[]>> => {
    try {
      if (!sql) return { success: false, error: 'Database not configured', data: [] };
      const comments = await sql`
        SELECT c.*, u.email as author_email 
        FROM comments c LEFT JOIN users u ON c.user_id = u.uid 
        WHERE c.post_id = ${parseInt(postId)} 
        ORDER BY c.created_at ASC
      `;
      return { success: true, data: comments };
    } catch (error) {
      console.error('Error getting comments:', error);
      return { success: false, error: 'Database error', data: [] };
    }
  },

  createComment: async (comment: any): Promise<DBResult<any>> => {
    try {
      if (!sql) return { success: false, error: 'Database not configured' };
      const result = await sql`
        INSERT INTO comments (post_id, user_id, content, parent_id)
        VALUES (${parseInt(comment.post_id)}, ${comment.user_id}, ${comment.content}, ${comment.parent_id || null})
        RETURNING *
      `;
      // Update post comment count
      await sql`UPDATE posts SET comment_count = comment_count + 1 WHERE id = ${parseInt(comment.post_id)}`;
      return { success: true, data: result[0] };
    } catch (error) {
      console.error('Error creating comment:', error);
      return { success: false, error: 'Database error' };
    }
  },

  deleteComment: async (id: string): Promise<DBResult<void>> => {
    try {
      if (!sql) return { success: false, error: 'Database not configured' };
      const comment = await sql`SELECT post_id FROM comments WHERE id = ${parseInt(id)}`;
      await sql`DELETE FROM comments WHERE id = ${parseInt(id)}`;
      if (comment && comment.length > 0) {
        await sql`UPDATE posts SET comment_count = GREATEST(comment_count - 1, 0) WHERE id = ${comment[0].post_id}`;
      }
      return { success: true };
    } catch (error) {
      console.error('Error deleting comment:', error);
      return { success: false, error: 'Database error' };
    }
  },

  // Staking Pools
  getStakingPools: async (): Promise<DBResult<any[]>> => {
    try {
      const pools = await dbQuery.getStakingPools();
      return { success: true, data: pools };
    } catch (error) {
      console.error('Error getting staking pools:', error);
      return { success: false, error: 'Database error', data: [] };
    }
  },

  createStakingPool: async (pool: any): Promise<DBResult<any>> => {
    try {
      const result = await dbQuery.createStakingPool(pool);
      if (!result) return { success: false, error: 'Failed to create pool' };
      return { success: true, data: result };
    } catch (error) {
      console.error('Error creating staking pool:', error);
      return { success: false, error: 'Database error' };
    }
  },

  updateStakingPool: async (id: string, updates: any): Promise<DBResult<any>> => {
    try {
      const result = await dbQuery.updateStakingPool(id, updates);
      if (!result) return { success: false, error: 'Pool not found' };
      return { success: true, data: result };
    } catch (error) {
      console.error('Error updating staking pool:', error);
      return { success: false, error: 'Database error' };
    }
  },

  deleteStakingPool: async (id: string): Promise<DBResult<void>> => {
    try {
      if (!sql) return { success: false, error: 'Database not configured' };
      await sql`DELETE FROM staking_pools WHERE pool_id = ${id}`;
      return { success: true };
    } catch (error) {
      console.error('Error deleting staking pool:', error);
      return { success: false, error: 'Database error' };
    }
  },

  getUserStakes: async (userId: string): Promise<DBResult<any[]>> => {
    try {
      if (!sql) return { success: false, error: 'Database not configured', data: [] };
      const stakes = await sql`
        SELECT s.*, p.name as pool_name, p.apy 
        FROM user_stakes s 
        LEFT JOIN staking_pools p ON s.pool_id = p.pool_id 
        WHERE s.user_id = ${userId}
        ORDER BY s.created_at DESC
      `;
      return { success: true, data: stakes || [] };
    } catch (error) {
      console.error('Error getting user stakes:', error);
      return { success: false, error: 'Database error', data: [] };
    }
  },

  createStake: async (stake: { user_id: string; pool_id: string; amount: number }): Promise<DBResult<any>> => {
    try {
      if (!sql) return { success: false, error: 'Database not configured' };
      const result = await sql`
        INSERT INTO user_stakes (user_id, pool_id, amount, status)
        VALUES (${stake.user_id}, ${stake.pool_id}, ${stake.amount}, 'active')
        RETURNING *
      `;
      return { success: true, data: result[0] };
    } catch (error) {
      console.error('Error creating stake:', error);
      return { success: false, error: 'Database error' };
    }
  },

  // ICO Settings
  getIcoSettings: async (): Promise<DBResult<Record<string, string>>> => {
    try {
      if (!sql) return { success: false, error: 'Database not configured', data: {} };
      const settings = await sql`SELECT * FROM system_settings WHERE key LIKE 'ico_%'`;
      const result: Record<string, string> = {};
      settings.forEach((s: any) => { result[s.key.replace('ico_', '')] = s.value; });
      return { success: true, data: result };
    } catch (error) {
      console.error('Error getting ICO settings:', error);
      return { success: false, error: 'Database error', data: {} };
    }
  },

  updateIcoSettings: async (settings: Record<string, string>): Promise<DBResult<void>> => {
    try {
      if (!sql) return { success: false, error: 'Database not configured' };
      for (const [key, value] of Object.entries(settings)) {
        await sql`
          INSERT INTO system_settings (key, value, type) VALUES (${'ico_' + key}, ${String(value)}, 'string')
          ON CONFLICT (key) DO UPDATE SET value = ${String(value)}, updated_at = CURRENT_TIMESTAMP
        `;
      }
      return { success: true };
    } catch (error) {
      console.error('Error updating ICO settings:', error);
      return { success: false, error: 'Database error' };
    }
  },

  getIcoStats: async (): Promise<DBResult<any>> => {
    try {
      if (!sql) return { success: false, error: 'Database not configured' };
      const [stats] = await sql`
        SELECT COUNT(*) as total_orders, 
               COALESCE(SUM(amount_usd), 0) as total_raised,
               COALESCE(SUM(tokens_total), 0) as total_tokens
        FROM token_purchases WHERE status = 'completed'
      `;
      const [goalSetting] = await sql`SELECT value FROM system_settings WHERE key = 'ico_goal_amount'`;
      const goal = parseFloat(goalSetting?.value || '10000000');
      const totalRaised = parseFloat(stats?.total_raised || '0');
      return {
        success: true,
        data: {
          total_raised: totalRaised,
          total_tokens_sold: parseFloat(stats?.total_tokens || '0'),
          total_orders: parseInt(stats?.total_orders || '0'),
          goal,
          percent: ((totalRaised / goal) * 100).toFixed(2),
        },
      };
    } catch (error) {
      console.error('Error getting ICO stats:', error);
      return { success: false, error: 'Database error' };
    }
  },

  createTokenPurchase: async (purchase: any): Promise<DBResult<any>> => {
    try {
      if (!sql) return { success: false, error: 'Database not configured' };
      const result = await sql`
        INSERT INTO token_purchases (buyer_address, amount_usd, tokens_base, tokens_total, status)
        VALUES (${purchase.buyer_address}, ${purchase.amount_usd}, ${purchase.tokens_base}, ${purchase.tokens_total}, ${purchase.status || 'pending'})
        RETURNING *
      `;
      return { success: true, data: result[0] };
    } catch (error) {
      console.error('Error creating token purchase:', error);
      return { success: false, error: 'Database error' };
    }
  },

  // System Settings
  getSystemSettings: async (): Promise<DBResult<any>> => {
    try {
      const settings = await dbQuery.getSystemSettings();
      return { success: true, data: settings };
    } catch (error) {
      console.error('Error getting system settings:', error);
      return { success: false, error: 'Database error', data: {} };
    }
  },

  updateSystemSettings: async (settings: Record<string, any>): Promise<DBResult<void>> => {
    try {
      if (!sql) return { success: false, error: 'Database not configured' };
      for (const [key, val] of Object.entries(settings)) {
        const value = typeof val === 'object' ? val.value : val;
        const type = typeof val === 'object' ? val.type : 'string';
        await dbQuery.updateSystemSetting(key, String(value), type);
      }
      return { success: true };
    } catch (error) {
      console.error('Error updating system settings:', error);
      return { success: false, error: 'Database error' };
    }
  },

  // Dashboard Stats
  getDashboardStats: async (): Promise<DBResult<any>> => {
    try {
      const stats = await dbQuery.getDashboardStats();
      return { success: true, data: stats };
    } catch (error) {
      console.error('Error getting dashboard stats:', error);
      return { success: false, error: 'Database error' };
    }
  },

  // Community Stats
  getCommunityStats: async (): Promise<DBResult<any>> => {
    try {
      if (!sql) return { success: false, error: 'Database not configured' };
      const [postsCount] = await sql`SELECT COUNT(*) as total FROM posts`;
      const [commentsCount] = await sql`SELECT COUNT(*) as total FROM comments`;
      const today = new Date().toISOString().split('T')[0];
      const [activeToday] = await sql`SELECT COUNT(DISTINCT user_id) as total FROM user_activity_logs WHERE DATE(created_at) = ${today}`;
      return {
        success: true,
        data: {
          totalPosts: parseInt(postsCount?.total || '0'),
          totalComments: parseInt(commentsCount?.total || '0'),
          activeToday: parseInt(activeToday?.total || '0'),
        },
      };
    } catch (error) {
      console.error('Error getting community stats:', error);
      return { success: false, error: 'Database error' };
    }
  },

  // Audit Log
  logAdminAction: async (action: string, targetType: string, targetId: string, oldValue: any, newValue: any, adminId: string): Promise<void> => {
    try {
      await dbQuery.logAction(adminId, action, targetType, targetId, oldValue, newValue);
    } catch (error) {
      console.error('Error logging admin action:', error);
    }
  },

  getAuditLogs: async (params: { page?: number; limit?: number; action?: string; admin_id?: string }): Promise<DBResult<{ logs: AuditLog[]; total: number }>> => {
    try {
      if (!sql) return { success: false, error: 'Database not configured', data: { logs: [], total: 0 } };
      const { page = 1, limit = 50, action, admin_id } = params;
      const offset = (page - 1) * limit;
      
      // Build query with optional filters
      let logs;
      let countResult;
      
      if (action && admin_id) {
        logs = await sql`SELECT * FROM audit_logs WHERE action = ${action} AND admin_id = ${admin_id} ORDER BY created_at DESC LIMIT ${limit} OFFSET ${offset}`;
        countResult = await sql`SELECT COUNT(*) as total FROM audit_logs WHERE action = ${action} AND admin_id = ${admin_id}`;
      } else if (action) {
        logs = await sql`SELECT * FROM audit_logs WHERE action = ${action} ORDER BY created_at DESC LIMIT ${limit} OFFSET ${offset}`;
        countResult = await sql`SELECT COUNT(*) as total FROM audit_logs WHERE action = ${action}`;
      } else if (admin_id) {
        logs = await sql`SELECT * FROM audit_logs WHERE admin_id = ${admin_id} ORDER BY created_at DESC LIMIT ${limit} OFFSET ${offset}`;
        countResult = await sql`SELECT COUNT(*) as total FROM audit_logs WHERE admin_id = ${admin_id}`;
      } else {
        logs = await sql`SELECT * FROM audit_logs ORDER BY created_at DESC LIMIT ${limit} OFFSET ${offset}`;
        countResult = await sql`SELECT COUNT(*) as total FROM audit_logs`;
      }
      
      return { success: true, data: { logs, total: parseInt(countResult[0]?.total || '0') } };
    } catch (error) {
      console.error('Error getting audit logs:', error);
      return { success: false, error: 'Database error', data: { logs: [], total: 0 } };
    }
  },

  // Banners
  getBanners: async (onlyActive = false): Promise<DBResult<any[]>> => {
    try {
      const banners = await dbQuery.getBanners(onlyActive);
      return { success: true, data: banners };
    } catch (error) {
      console.error('Error getting banners:', error);
      return { success: false, error: 'Database error', data: [] };
    }
  },

  createBanner: async (banner: any): Promise<DBResult<any>> => {
    try {
      const result = await dbQuery.createBanner(banner);
      if (!result) return { success: false, error: 'Failed to create banner' };
      return { success: true, data: result };
    } catch (error) {
      console.error('Error creating banner:', error);
      return { success: false, error: 'Database error' };
    }
  },

  updateBanner: async (id: string, updates: any): Promise<DBResult<any>> => {
    try {
      if (!sql) return { success: false, error: 'Database not configured' };
      const result = await sql`
        UPDATE banners SET 
          title = COALESCE(${updates.title}, title),
          image_url = COALESCE(${updates.image_url}, image_url),
          link_url = COALESCE(${updates.link_url}, link_url),
          sort_order = COALESCE(${updates.sort_order}, sort_order),
          is_active = COALESCE(${updates.is_active}, is_active)
        WHERE id = ${parseInt(id)} RETURNING *
      `;
      if (!result || result.length === 0) return { success: false, error: 'Banner not found' };
      return { success: true, data: result[0] };
    } catch (error) {
      console.error('Error updating banner:', error);
      return { success: false, error: 'Database error' };
    }
  },

  deleteBanner: async (id: string): Promise<DBResult<void>> => {
    try {
      if (!sql) return { success: false, error: 'Database not configured' };
      await sql`DELETE FROM banners WHERE id = ${parseInt(id)}`;
      return { success: true };
    } catch (error) {
      console.error('Error deleting banner:', error);
      return { success: false, error: 'Database error' };
    }
  },

  // Menus
  getMenus: async (onlyActive = false): Promise<DBResult<any[]>> => {
    try {
      if (!sql) return { success: false, error: 'Database not configured', data: [] };
      const menus = onlyActive 
        ? await sql`SELECT * FROM menus WHERE is_active = true ORDER BY sort_order ASC`
        : await sql`SELECT * FROM menus ORDER BY sort_order ASC`;
      return { success: true, data: menus };
    } catch (error) {
      console.error('Error getting menus:', error);
      return { success: false, error: 'Database error', data: [] };
    }
  },

  createMenu: async (menu: any): Promise<DBResult<any>> => {
    try {
      if (!sql) return { success: false, error: 'Database not configured' };
      const result = await sql`
        INSERT INTO menus (label, link, parent_id, sort_order, is_active)
        VALUES (${menu.label}, ${menu.link}, ${menu.parent_id || null}, ${menu.sort_order || 0}, ${menu.is_active !== false})
        RETURNING *
      `;
      return { success: true, data: result[0] };
    } catch (error) {
      console.error('Error creating menu:', error);
      return { success: false, error: 'Database error' };
    }
  },

  updateMenu: async (id: string, updates: any): Promise<DBResult<any>> => {
    try {
      if (!sql) return { success: false, error: 'Database not configured' };
      const result = await sql`
        UPDATE menus SET 
          label = COALESCE(${updates.label}, label),
          link = COALESCE(${updates.link}, link),
          sort_order = COALESCE(${updates.sort_order}, sort_order),
          is_active = COALESCE(${updates.is_active}, is_active)
        WHERE id = ${parseInt(id)} RETURNING *
      `;
      if (!result || result.length === 0) return { success: false, error: 'Menu not found' };
      return { success: true, data: result[0] };
    } catch (error) {
      console.error('Error updating menu:', error);
      return { success: false, error: 'Database error' };
    }
  },

  deleteMenu: async (id: string): Promise<DBResult<void>> => {
    try {
      if (!sql) return { success: false, error: 'Database not configured' };
      await sql`DELETE FROM menus WHERE id = ${parseInt(id)}`;
      return { success: true };
    } catch (error) {
      console.error('Error deleting menu:', error);
      return { success: false, error: 'Database error' };
    }
  },

  // Pages
  getPages: async (): Promise<DBResult<any[]>> => {
    try {
      const pages = await dbQuery.getPages();
      return { success: true, data: pages };
    } catch (error) {
      console.error('Error getting pages:', error);
      return { success: false, error: 'Database error', data: [] };
    }
  },

  getPageBySlug: async (slug: string, onlyPublished = false): Promise<DBResult<any>> => {
    try {
      if (!sql) return { success: false, error: 'Database not configured' };
      const result = onlyPublished
        ? await sql`SELECT * FROM pages WHERE slug = ${slug} AND is_published = true`
        : await sql`SELECT * FROM pages WHERE slug = ${slug}`;
      if (!result || result.length === 0) return { success: false, error: 'Page not found' };
      return { success: true, data: result[0] };
    } catch (error) {
      console.error('Error getting page:', error);
      return { success: false, error: 'Database error' };
    }
  },

  createPage: async (page: any): Promise<DBResult<any>> => {
    try {
      const result = await dbQuery.createPage(page);
      if (!result) return { success: false, error: 'Failed to create page' };
      return { success: true, data: result };
    } catch (error) {
      console.error('Error creating page:', error);
      return { success: false, error: 'Database error' };
    }
  },

  updatePage: async (slug: string, updates: any): Promise<DBResult<any>> => {
    try {
      if (!sql) return { success: false, error: 'Database not configured' };
      const result = await sql`
        UPDATE pages SET 
          title = COALESCE(${updates.title}, title),
          content = COALESCE(${updates.content}, content),
          meta_title = COALESCE(${updates.meta_title}, meta_title),
          meta_description = COALESCE(${updates.meta_description}, meta_description),
          is_published = COALESCE(${updates.is_published}, is_published),
          version = version + 1,
          updated_at = CURRENT_TIMESTAMP
        WHERE slug = ${slug} RETURNING *
      `;
      if (!result || result.length === 0) return { success: false, error: 'Page not found' };
      return { success: true, data: result[0] };
    } catch (error) {
      console.error('Error updating page:', error);
      return { success: false, error: 'Database error' };
    }
  },

  deletePage: async (slug: string): Promise<DBResult<void>> => {
    try {
      if (!sql) return { success: false, error: 'Database not configured' };
      await sql`DELETE FROM pages WHERE slug = ${slug}`;
      return { success: true };
    } catch (error) {
      console.error('Error deleting page:', error);
      return { success: false, error: 'Database error' };
    }
  },

  // Blockchain Networks
  getBlockchainNetworks: async (onlyActive = false): Promise<DBResult<any[]>> => {
    try {
      if (!sql) return { success: false, error: 'Database not configured', data: [] };
      const networks = onlyActive
        ? await sql`SELECT * FROM blockchain_networks WHERE is_active = true ORDER BY created_at DESC`
        : await sql`SELECT * FROM blockchain_networks ORDER BY created_at DESC`;
      return { success: true, data: networks || [] };
    } catch (error) {
      console.error('Error getting blockchain networks:', error);
      return { success: false, error: 'Database error', data: [] };
    }
  },

  createBlockchainNetwork: async (network: any): Promise<DBResult<any>> => {
    try {
      if (!sql) return { success: false, error: 'Database not configured' };
      const result = await sql`
        INSERT INTO blockchain_networks (name, chain_id, rpc_url, explorer_url, is_active)
        VALUES (${network.name}, ${network.chain_id}, ${network.rpc_url}, ${network.explorer_url || ''}, ${network.is_active !== false})
        RETURNING *
      `;
      return { success: true, data: result[0] };
    } catch (error) {
      console.error('Error creating blockchain network:', error);
      return { success: false, error: 'Database error' };
    }
  },

  updateBlockchainNetwork: async (id: string, updates: any): Promise<DBResult<any>> => {
    try {
      if (!sql) return { success: false, error: 'Database not configured' };
      const result = await sql`
        UPDATE blockchain_networks SET 
          name = COALESCE(${updates.name}, name),
          chain_id = COALESCE(${updates.chain_id}, chain_id),
          rpc_url = COALESCE(${updates.rpc_url}, rpc_url),
          explorer_url = COALESCE(${updates.explorer_url}, explorer_url),
          is_active = COALESCE(${updates.is_active}, is_active)
        WHERE id = ${parseInt(id)} RETURNING *
      `;
      if (!result || result.length === 0) return { success: false, error: 'Network not found' };
      return { success: true, data: result[0] };
    } catch (error) {
      console.error('Error updating blockchain network:', error);
      return { success: false, error: 'Database error' };
    }
  },

  updateBlockchainNetworks: async (networks: BlockchainNetwork[]): Promise<DBResult<void>> => {
    try {
      if (!sql) return { success: false, error: 'Database not configured' };
      for (const network of networks) {
        if (network.id) {
          await sql`
            UPDATE blockchain_networks SET 
              name = ${network.name}, chain_id = ${network.chain_id}, 
              rpc_url = ${network.rpc_url}, is_active = ${network.is_active}
            WHERE id = ${network.id}
          `;
        }
      }
      return { success: true };
    } catch (error) {
      console.error('Error updating blockchain networks:', error);
      return { success: false, error: 'Database error' };
    }
  },

  deleteBlockchainNetwork: async (id: string): Promise<DBResult<void>> => {
    try {
      if (!sql) return { success: false, error: 'Database not configured' };
      await sql`DELETE FROM blockchain_networks WHERE id = ${parseInt(id)}`;
      return { success: true };
    } catch (error) {
      console.error('Error deleting blockchain network:', error);
      return { success: false, error: 'Database error' };
    }
  },

  // Blockchain Contracts
  getBlockchainContracts: async (onlyActive = false): Promise<DBResult<any[]>> => {
    try {
      if (!sql) return { success: false, error: 'Database not configured', data: [] };
      const contracts = onlyActive
        ? await sql`SELECT * FROM blockchain_contracts WHERE is_deprecated = false ORDER BY created_at DESC`
        : await sql`SELECT * FROM blockchain_contracts ORDER BY created_at DESC`;
      return { success: true, data: contracts || [] };
    } catch (error) {
      console.error('Error getting blockchain contracts:', error);
      return { success: false, error: 'Database error', data: [] };
    }
  },

  createBlockchainContract: async (contract: any): Promise<DBResult<any>> => {
    try {
      if (!sql) return { success: false, error: 'Database not configured' };
      const result = await sql`
        INSERT INTO blockchain_contracts (name, address, network_id, contract_type, abi, is_deprecated)
        VALUES (${contract.name}, ${contract.address}, ${contract.network_id}, ${contract.contract_type}, ${contract.abi || '{}'}, false)
        RETURNING *
      `;
      return { success: true, data: result[0] };
    } catch (error) {
      console.error('Error creating blockchain contract:', error);
      return { success: false, error: 'Database error' };
    }
  },

  updateBlockchainContract: async (id: string, updates: any): Promise<DBResult<any>> => {
    try {
      if (!sql) return { success: false, error: 'Database not configured' };
      const result = await sql`
        UPDATE blockchain_contracts SET 
          name = COALESCE(${updates.name}, name),
          address = COALESCE(${updates.address}, address),
          is_deprecated = COALESCE(${updates.is_deprecated}, is_deprecated)
        WHERE id = ${parseInt(id)} RETURNING *
      `;
      if (!result || result.length === 0) return { success: false, error: 'Contract not found' };
      return { success: true, data: result[0] };
    } catch (error) {
      console.error('Error updating blockchain contract:', error);
      return { success: false, error: 'Database error' };
    }
  },

  deleteBlockchainContract: async (id: string): Promise<DBResult<void>> => {
    try {
      if (!sql) return { success: false, error: 'Database not configured' };
      await sql`DELETE FROM blockchain_contracts WHERE id = ${parseInt(id)}`;
      return { success: true };
    } catch (error) {
      console.error('Error deleting blockchain contract:', error);
      return { success: false, error: 'Database error' };
    }
  },

  // Blockchain Token
  getBlockchainToken: async (): Promise<DBResult<any>> => {
    try {
      if (!sql) return { success: false, error: 'Database not configured' };
      const result = await sql`SELECT * FROM blockchain_token LIMIT 1`;
      return { success: true, data: result?.[0] || null };
    } catch (error) {
      console.error('Error getting blockchain token:', error);
      return { success: false, error: 'Database error' };
    }
  },

  updateBlockchainToken: async (updates: any): Promise<DBResult<any>> => {
    try {
      if (!sql) return { success: false, error: 'Database not configured' };
      const existing = await sql`SELECT id FROM blockchain_token LIMIT 1`;
      let result;
      if (existing && existing.length > 0) {
        result = await sql`
          UPDATE blockchain_token SET 
            name = COALESCE(${updates.name}, name),
            symbol = COALESCE(${updates.symbol}, symbol),
            decimals = COALESCE(${updates.decimals}, decimals),
            total_supply = COALESCE(${updates.total_supply}, total_supply),
            updated_at = CURRENT_TIMESTAMP
          WHERE id = ${existing[0].id} RETURNING *
        `;
      } else {
        result = await sql`
          INSERT INTO blockchain_token (name, symbol, decimals, total_supply)
          VALUES (${updates.name || 'Quantaureum'}, ${updates.symbol || 'QAU'}, ${updates.decimals || 18}, ${updates.total_supply || '1000000000'})
          RETURNING *
        `;
      }
      return { success: true, data: result[0] };
    } catch (error) {
      console.error('Error updating blockchain token:', error);
      return { success: false, error: 'Database error' };
    }
  },

  // Launch Config
  getLaunchConfig: async (): Promise<DBResult<any>> => {
    try {
      if (!sql) return { success: false, error: 'Database not configured' };
      const result = await sql`SELECT * FROM launch_config LIMIT 1`;
      return { success: true, data: result?.[0] || { pre_launch_enabled: false, maintenance_mode: false } };
    } catch (error) {
      console.error('Error getting launch config:', error);
      return { success: false, error: 'Database error' };
    }
  },

  updateLaunchConfig: async (config: any): Promise<DBResult<any>> => {
    try {
      if (!sql) return { success: false, error: 'Database not configured' };
      const existing = await sql`SELECT id FROM launch_config LIMIT 1`;
      let result;
      if (existing && existing.length > 0) {
        result = await sql`
          UPDATE launch_config SET 
            launch_date = COALESCE(${config.launch_date}, launch_date),
            pre_launch_enabled = COALESCE(${config.pre_launch_enabled}, pre_launch_enabled),
            maintenance_mode = COALESCE(${config.maintenance_mode}, maintenance_mode),
            updated_at = CURRENT_TIMESTAMP
          WHERE id = ${existing[0].id} RETURNING *
        `;
      } else {
        result = await sql`
          INSERT INTO launch_config (launch_date, pre_launch_enabled, maintenance_mode)
          VALUES (${config.launch_date || null}, ${config.pre_launch_enabled || false}, ${config.maintenance_mode || false})
          RETURNING *
        `;
      }
      return { success: true, data: result[0] };
    } catch (error) {
      console.error('Error updating launch config:', error);
      return { success: false, error: 'Database error' };
    }
  },

  // Domains
  getDomains: async (): Promise<DBResult<any>> => {
    try {
      if (!sql) return { success: false, error: 'Database not configured' };
      const domains = await sql`SELECT * FROM domains ORDER BY created_at DESC`;
      const primary = domains?.find((d: any) => d.type === 'primary' && d.is_active);
      return { success: true, data: { domains: domains || [], primary, alternates: domains?.filter((d: any) => d.type !== 'primary') || [] } };
    } catch (error) {
      console.error('Error getting domains:', error);
      return { success: false, error: 'Database error' };
    }
  },

  createDomain: async (domain: any): Promise<DBResult<any>> => {
    try {
      if (!sql) return { success: false, error: 'Database not configured' };
      const result = await sql`
        INSERT INTO domains (domain, type, ssl_enabled, is_active)
        VALUES (${domain.domain}, ${domain.type || 'alternate'}, ${domain.ssl_enabled !== false}, ${domain.is_active !== false})
        RETURNING *
      `;
      return { success: true, data: result[0] };
    } catch (error) {
      console.error('Error creating domain:', error);
      return { success: false, error: 'Database error' };
    }
  },

  updateDomains: async (domains: Domain[]): Promise<DBResult<void>> => {
    try {
      if (!sql) return { success: false, error: 'Database not configured' };
      for (const d of domains) {
        if (d.id) {
          await sql`UPDATE domains SET domain = ${d.domain}, type = ${d.type}, ssl_enabled = ${d.ssl_enabled}, is_active = ${d.is_active} WHERE id = ${d.id}`;
        }
      }
      return { success: true };
    } catch (error) {
      console.error('Error updating domains:', error);
      return { success: false, error: 'Database error' };
    }
  },

  deleteDomain: async (id: string): Promise<DBResult<void>> => {
    try {
      if (!sql) return { success: false, error: 'Database not configured' };
      await sql`DELETE FROM domains WHERE id = ${parseInt(id)}`;
      return { success: true };
    } catch (error) {
      console.error('Error deleting domain:', error);
      return { success: false, error: 'Database error' };
    }
  },

  // Currencies
  getCurrencies: async (): Promise<DBResult<any[]>> => {
    try {
      if (!sql) return { success: false, error: 'Database not configured', data: [] };
      const currencies = await sql`SELECT * FROM currencies ORDER BY symbol ASC`;
      return { success: true, data: currencies || [] };
    } catch (error) {
      console.error('Error getting currencies:', error);
      return { success: false, error: 'Database error', data: [] };
    }
  },

  createCurrency: async (currency: any): Promise<DBResult<any>> => {
    try {
      if (!sql) return { success: false, error: 'Database not configured' };
      const result = await sql`
        INSERT INTO currencies (id, name, symbol, type, decimals, is_active)
        VALUES (${currency.id}, ${currency.name}, ${currency.symbol}, ${currency.type || 'token'}, ${currency.decimals || 18}, ${currency.is_active !== false})
        RETURNING *
      `;
      return { success: true, data: result[0] };
    } catch (error) {
      console.error('Error creating currency:', error);
      return { success: false, error: 'Database error' };
    }
  },

  updateCurrency: async (id: string, updates: any): Promise<DBResult<any>> => {
    try {
      if (!sql) return { success: false, error: 'Database not configured' };
      const result = await sql`
        UPDATE currencies SET 
          name = COALESCE(${updates.name}, name),
          symbol = COALESCE(${updates.symbol}, symbol),
          is_active = COALESCE(${updates.is_active}, is_active)
        WHERE id = ${id} RETURNING *
      `;
      if (!result || result.length === 0) return { success: false, error: 'Currency not found' };
      return { success: true, data: result[0] };
    } catch (error) {
      console.error('Error updating currency:', error);
      return { success: false, error: 'Database error' };
    }
  },

  // Deposits
  getDeposits: async (params: { page?: number; limit?: number }): Promise<DBResult<{ deposits: Deposit[]; total: number }>> => {
    try {
      if (!sql) return { success: false, error: 'Database not configured', data: { deposits: [], total: 0 } };
      const { page = 1, limit = 20 } = params;
      const offset = (page - 1) * limit;
      const deposits = await sql`SELECT * FROM deposits ORDER BY created_at DESC LIMIT ${limit} OFFSET ${offset}`;
      const [countResult] = await sql`SELECT COUNT(*) as total FROM deposits`;
      return { success: true, data: { deposits: deposits || [], total: parseInt(countResult?.total || '0') } };
    } catch (error) {
      console.error('Error getting deposits:', error);
      return { success: false, error: 'Database error', data: { deposits: [], total: 0 } };
    }
  },

  // Demo Modules (for backward compatibility, but returns empty in production)
  getDemoModules: async (onlyActive = false): Promise<DBResult<any[]>> => {
    try {
      if (!sql) return { success: false, error: 'Database not configured', data: [] };
      const modules = onlyActive
        ? await sql`SELECT * FROM demo_modules WHERE is_active = true`
        : await sql`SELECT * FROM demo_modules`;
      return { success: true, data: modules || [] };
    } catch (error) {
      console.error('Error getting demo modules:', error);
      return { success: false, error: 'Database error', data: [] };
    }
  },

  updateDemoModule: async (id: string, updates: any): Promise<DBResult<any>> => {
    try {
      if (!sql) return { success: false, error: 'Database not configured' };
      const result = await sql`
        UPDATE demo_modules SET is_active = COALESCE(${updates.is_active}, is_active)
        WHERE id = ${id} RETURNING *
      `;
      if (!result || result.length === 0) return { success: false, error: 'Module not found' };
      return { success: true, data: result[0] };
    } catch (error) {
      console.error('Error updating demo module:', error);
      return { success: false, error: 'Database error' };
    }
  },

  toggleAllDemoModules: async (isActive: boolean): Promise<DBResult<void>> => {
    try {
      if (!sql) return { success: false, error: 'Database not configured' };
      await sql`UPDATE demo_modules SET is_active = ${isActive}`;
      return { success: true };
    } catch (error) {
      console.error('Error toggling demo modules:', error);
      return { success: false, error: 'Database error' };
    }
  },

  // Footer Links
  getFooterLinks: async (onlyActive = false): Promise<DBResult<any[]>> => {
    try {
      if (!sql) return { success: false, error: 'Database not configured', data: [] };
      const links = onlyActive
        ? await sql`SELECT * FROM footer_links WHERE is_active = true ORDER BY sort_order ASC`
        : await sql`SELECT * FROM footer_links ORDER BY sort_order ASC`;
      return { success: true, data: links || [] };
    } catch (error) {
      console.error('Error getting footer links:', error);
      return { success: false, error: 'Database error', data: [] };
    }
  },

  createFooterLink: async (link: any): Promise<DBResult<any>> => {
    try {
      if (!sql) return { success: false, error: 'Database not configured' };
      const result = await sql`
        INSERT INTO footer_links (section, label, link, sort_order, is_active)
        VALUES (${link.section}, ${link.label}, ${link.link}, ${link.sort_order || 0}, ${link.is_active !== false})
        RETURNING *
      `;
      return { success: true, data: result[0] };
    } catch (error) {
      console.error('Error creating footer link:', error);
      return { success: false, error: 'Database error' };
    }
  },

  updateFooterLink: async (id: string, updates: any): Promise<DBResult<any>> => {
    try {
      if (!sql) return { success: false, error: 'Database not configured' };
      const result = await sql`
        UPDATE footer_links SET 
          section = COALESCE(${updates.section}, section),
          label = COALESCE(${updates.label}, label),
          link = COALESCE(${updates.link}, link),
          sort_order = COALESCE(${updates.sort_order}, sort_order),
          is_active = COALESCE(${updates.is_active}, is_active)
        WHERE id = ${parseInt(id)} RETURNING *
      `;
      if (!result || result.length === 0) return { success: false, error: 'Footer link not found' };
      return { success: true, data: result[0] };
    } catch (error) {
      console.error('Error updating footer link:', error);
      return { success: false, error: 'Database error' };
    }
  },

  updateFooterLinks: async (links: FooterLink[]): Promise<DBResult<void>> => {
    try {
      if (!sql) return { success: false, error: 'Database not configured' };
      for (const link of links) {
        if (link.id) {
          await sql`UPDATE footer_links SET label = ${link.label}, link = ${link.link}, sort_order = ${link.sort_order}, is_active = ${link.is_active} WHERE id = ${link.id}`;
        }
      }
      return { success: true };
    } catch (error) {
      console.error('Error updating footer links:', error);
      return { success: false, error: 'Database error' };
    }
  },

  deleteFooterLink: async (id: string): Promise<DBResult<void>> => {
    try {
      if (!sql) return { success: false, error: 'Database not configured' };
      await sql`DELETE FROM footer_links WHERE id = ${parseInt(id)}`;
      return { success: true };
    } catch (error) {
      console.error('Error deleting footer link:', error);
      return { success: false, error: 'Database error' };
    }
  },

  // Public System Settings
  getPublicSystemSettings: async (): Promise<DBResult<any>> => {
    try {
      if (!sql) return { success: false, error: 'Database not configured', data: {} };
      const publicKeys = ['site_name', 'site_logo', 'meta_title', 'meta_description', 'social_twitter', 'social_telegram', 'contact_email', 'maintenance_mode'];
      const settings = await sql`SELECT * FROM system_settings WHERE key = ANY(${publicKeys})`;
      const result: Record<string, any> = {};
      settings?.forEach((s: any) => { result[s.key] = s.value; });
      return { success: true, data: result };
    } catch (error) {
      console.error('Error getting public system settings:', error);
      return { success: false, error: 'Database error', data: {} };
    }
  },
};

export default db;
