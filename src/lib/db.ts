/**
 * Database Configuration for Vercel Deployment
 * 
 * This module provides database connectivity for the API routes.
 * For production, use Vercel Postgres or another cloud database.
 * 
 * Environment Variables Required:
 * - DATABASE_URL: PostgreSQL connection string (for Vercel Postgres)
 * - Or use DEMO_MODE=true for demo/development without database
 */

// Demo mode flag - set to true when no database is configured
const DEMO_MODE = process.env.DEMO_MODE === 'true' || !process.env.DATABASE_URL;

// In-memory storage for demo mode
const demoData = {
  users: new Map<string, any>(),
  settings: new Map<string, any>(),
  posts: new Map<string, any>(),
  comments: new Map<string, any>(),
  categories: new Map<string, any>(),
  stakingPools: new Map<string, any>(),
  userStakes: new Map<string, any>(),
  tokenPurchases: new Map<string, any>(),
  icoSettings: new Map<string, any>(),
  banners: new Map<string, any>(),
  pages: new Map<string, any>(),
  systemSettings: new Map<string, any>(),
  auditLogs: [] as any[],
};

// Initialize demo data
function initDemoData() {
  // Demo admin user
  demoData.users.set('admin_001', {
    id: 'admin_001',
    email: 'admin@quantaureum.com',
    role: 'admin',
    level: 3,
    is_active: true,
    is_verified: true,
    created_at: new Date().toISOString(),
  });

  // Demo regular users
  for (let i = 1; i <= 10; i++) {
    demoData.users.set(`user_${i}`, {
      id: `user_${i}`,
      email: `user${i}@example.com`,
      role: 'user',
      level: Math.floor(Math.random() * 3) + 1,
      is_active: Math.random() > 0.1,
      is_verified: Math.random() > 0.3,
      created_at: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
    });
  }

  // Demo categories
  const categories = [
    { id: 1, name: 'Announcements', slug: 'announcements', description: 'Official updates' },
    { id: 2, name: 'General Discussion', slug: 'general', description: 'General talk' },
    { id: 3, name: 'Technical Support', slug: 'support', description: 'Get help' },
    { id: 4, name: 'Trading Strategies', slug: 'trading', description: 'Trading tips' },
  ];
  categories.forEach(cat => demoData.categories.set(cat.id.toString(), cat));

  // Demo posts
  const posts = [
    { id: 'post_1', title: 'Welcome to Quantaureum!', content: 'Welcome message...', user_id: 'admin_001', category_id: 1, view_count: 150, like_count: 25, comment_count: 8, is_pinned: true, created_at: new Date().toISOString() },
    { id: 'post_2', title: 'QAU Token Sale Live', content: 'Token sale details...', user_id: 'admin_001', category_id: 1, view_count: 320, like_count: 45, comment_count: 12, is_pinned: false, created_at: new Date().toISOString() },
    { id: 'post_3', title: 'Bitcoin Analysis', content: 'Market analysis...', user_id: 'user_1', category_id: 4, view_count: 89, like_count: 12, comment_count: 5, is_pinned: false, created_at: new Date().toISOString() },
  ];
  posts.forEach(post => demoData.posts.set(post.id, post));

  // Demo staking pools
  const pools = [
    { id: 'pool_qau_30', token_id: 'QAU', apy: 12.0, duration_days: 30, min_stake: 100, total_staked: 50000, is_active: true },
    { id: 'pool_qau_90', token_id: 'QAU', apy: 25.0, duration_days: 90, min_stake: 500, total_staked: 150000, is_active: true },
    { id: 'pool_usdt_30', token_id: 'USDT', apy: 5.0, duration_days: 30, min_stake: 100, total_staked: 25000, is_active: true },
  ];
  pools.forEach(pool => demoData.stakingPools.set(pool.id, pool));

  // Demo ICO settings
  demoData.icoSettings.set('current_price', '85');
  demoData.icoSettings.set('stage_name', 'Public Round 1');
  demoData.icoSettings.set('goal_amount', '10000000');
  demoData.icoSettings.set('end_time', new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString());

  // Demo system settings
  demoData.systemSettings.set('site_name', { value: 'Quantaureum', type: 'string' });
  demoData.systemSettings.set('maintenance_mode', { value: false, type: 'boolean' });
  demoData.systemSettings.set('contact_email', { value: 'support@quantaureum.com', type: 'string' });
}

// Initialize on first import
initDemoData();

// Database interface
export interface DBResult<T> {
  success: boolean;
  data?: T;
  error?: string;
}

// Query functions for demo mode
export const db = {
  isDemoMode: () => DEMO_MODE,

  // Users
  getUsers: async (params: { page?: number; limit?: number; search?: string; state?: string }): Promise<DBResult<{ users: any[]; total: number }>> => {
    const { page = 1, limit = 20, search, state } = params;
    let users = Array.from(demoData.users.values());
    
    if (search) {
      users = users.filter(u => u.email.includes(search) || u.id.includes(search));
    }
    if (state === 'active') {
      users = users.filter(u => u.is_active);
    } else if (state === 'banned') {
      users = users.filter(u => !u.is_active);
    }
    
    const total = users.length;
    const start = (page - 1) * limit;
    users = users.slice(start, start + limit);
    
    return { success: true, data: { users, total } };
  },

  getUserById: async (id: string): Promise<DBResult<any>> => {
    const user = demoData.users.get(id);
    if (!user) return { success: false, error: 'User not found' };
    return { success: true, data: user };
  },

  updateUser: async (id: string, updates: any): Promise<DBResult<any>> => {
    const user = demoData.users.get(id);
    if (!user) return { success: false, error: 'User not found' };
    const updated = { ...user, ...updates, updated_at: new Date().toISOString() };
    demoData.users.set(id, updated);
    return { success: true, data: updated };
  },

  // Community
  getPosts: async (params: { page?: number; limit?: number; category?: string; search?: string }): Promise<DBResult<{ posts: any[]; total: number }>> => {
    const { page = 1, limit = 10, category, search } = params;
    let posts = Array.from(demoData.posts.values());
    
    if (category) {
      const cat = Array.from(demoData.categories.values()).find(c => c.slug === category);
      if (cat) posts = posts.filter(p => p.category_id === cat.id);
    }
    if (search) {
      posts = posts.filter(p => p.title.includes(search) || p.content.includes(search));
    }
    
    posts.sort((a, b) => (b.is_pinned ? 1 : 0) - (a.is_pinned ? 1 : 0));
    
    const total = posts.length;
    const start = (page - 1) * limit;
    posts = posts.slice(start, start + limit);
    
    return { success: true, data: { posts, total } };
  },

  getCategories: async (): Promise<DBResult<any[]>> => {
    return { success: true, data: Array.from(demoData.categories.values()) };
  },

  createPost: async (post: any): Promise<DBResult<any>> => {
    const id = 'post_' + Date.now();
    const newPost = { ...post, id, created_at: new Date().toISOString(), view_count: 0, like_count: 0, comment_count: 0 };
    demoData.posts.set(id, newPost);
    return { success: true, data: newPost };
  },

  deletePost: async (id: string): Promise<DBResult<void>> => {
    if (!demoData.posts.has(id)) return { success: false, error: 'Post not found' };
    demoData.posts.delete(id);
    return { success: true };
  },

  updatePost: async (id: string, updates: any): Promise<DBResult<any>> => {
    const post = demoData.posts.get(id);
    if (!post) return { success: false, error: 'Post not found' };
    const updated = { ...post, ...updates };
    demoData.posts.set(id, updated);
    return { success: true, data: updated };
  },

  // Staking
  getStakingPools: async (): Promise<DBResult<any[]>> => {
    return { success: true, data: Array.from(demoData.stakingPools.values()) };
  },

  createStakingPool: async (pool: any): Promise<DBResult<any>> => {
    const id = 'pool_' + pool.token_id.toLowerCase() + '_' + Date.now();
    const newPool = { ...pool, id, total_staked: 0, created_at: new Date().toISOString() };
    demoData.stakingPools.set(id, newPool);
    return { success: true, data: newPool };
  },

  updateStakingPool: async (id: string, updates: any): Promise<DBResult<any>> => {
    const pool = demoData.stakingPools.get(id);
    if (!pool) return { success: false, error: 'Pool not found' };
    const updated = { ...pool, ...updates };
    demoData.stakingPools.set(id, updated);
    return { success: true, data: updated };
  },

  // ICO
  getIcoSettings: async (): Promise<DBResult<Record<string, string>>> => {
    const settings: Record<string, string> = {};
    demoData.icoSettings.forEach((value, key) => {
      settings[key] = value;
    });
    return { success: true, data: settings };
  },

  updateIcoSettings: async (settings: Record<string, string>): Promise<DBResult<void>> => {
    Object.entries(settings).forEach(([key, value]) => {
      demoData.icoSettings.set(key, String(value));
    });
    return { success: true };
  },

  getIcoStats: async (): Promise<DBResult<any>> => {
    const purchases = Array.from(demoData.tokenPurchases.values());
    const completed = purchases.filter(p => p.status === 'completed');
    const totalRaised = completed.reduce((sum, p) => sum + (p.amount_usd || 0), 0);
    const totalTokens = completed.reduce((sum, p) => sum + (p.tokens_total || 0), 0);
    const goal = Number(demoData.icoSettings.get('goal_amount') || 10000000);
    
    return {
      success: true,
      data: {
        total_raised: totalRaised,
        total_tokens_sold: totalTokens,
        total_orders: completed.length,
        goal,
        percent: ((totalRaised / goal) * 100).toFixed(2),
      },
    };
  },

  // System Settings
  getSystemSettings: async (): Promise<DBResult<any>> => {
    const settings: Record<string, any> = {};
    demoData.systemSettings.forEach((value, key) => {
      settings[key] = value;
    });
    return { success: true, data: settings };
  },

  updateSystemSettings: async (settings: Record<string, any>): Promise<DBResult<void>> => {
    Object.entries(settings).forEach(([key, value]) => {
      demoData.systemSettings.set(key, value);
    });
    return { success: true };
  },

  // Dashboard Stats
  getDashboardStats: async (): Promise<DBResult<any>> => {
    const users = Array.from(demoData.users.values());
    const posts = Array.from(demoData.posts.values());
    const pools = Array.from(demoData.stakingPools.values());
    const purchases = Array.from(demoData.tokenPurchases.values());
    
    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    
    return {
      success: true,
      data: {
        overview: {
          total_users: users.length,
          active_users: users.filter(u => u.is_active).length,
          total_posts: posts.length,
          total_comments: Array.from(demoData.comments.values()).length,
          total_staked: pools.reduce((sum, p) => sum + (p.total_staked || 0), 0),
          active_stakes: 0,
          staking_pools: pools.filter(p => p.is_active).length,
        },
        ico: {
          total_raised: purchases.filter(p => p.status === 'completed').reduce((sum, p) => sum + (p.amount_usd || 0), 0),
          total_tokens_sold: purchases.filter(p => p.status === 'completed').reduce((sum, p) => sum + (p.tokens_total || 0), 0),
          total_orders: purchases.length,
        },
        growth: {
          new_users_this_week: users.filter(u => new Date(u.created_at) > weekAgo).length,
          new_users_last_week: 5,
          user_growth_percent: 20,
          new_posts_this_week: posts.filter(p => new Date(p.created_at) > weekAgo).length,
        },
        recent: {
          users: users.slice(0, 5),
          posts: posts.slice(0, 5),
          purchases: purchases.slice(0, 5),
        },
        timestamp: new Date().toISOString(),
      },
    };
  },

  // Audit Log
  logAdminAction: async (action: string, targetType: string, targetId: string, oldValue: any, newValue: any, adminId: string): Promise<void> => {
    demoData.auditLogs.push({
      id: 'log_' + Date.now(),
      admin_id: adminId,
      action,
      target_type: targetType,
      target_id: targetId,
      old_value: JSON.stringify(oldValue),
      new_value: JSON.stringify(newValue),
      created_at: new Date().toISOString(),
    });
  },
};

export default db;
