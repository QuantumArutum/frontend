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
  menus: new Map<string, any>(),
  footerLinks: new Map<string, any>(),
  domains: new Map<string, any>(),
  launchConfig: null as any,
  blockchainNetworks: new Map<string, any>(),
  blockchainContracts: new Map<string, any>(),
  blockchainToken: null as any,
  demoModules: new Map<string, any>(),
  currencies: new Map<string, any>(),
  deposits: new Map<string, any>(),
  postLikes: new Map<string, Set<string>>(),
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

  // Demo banners
  demoData.banners.set('ban_1', { id: 'ban_1', title: 'Welcome to Quantaureum', image_url: '/images/banner1.jpg', link_url: '/token-sale', sort_order: 1, is_active: true });
  demoData.banners.set('ban_2', { id: 'ban_2', title: 'QAU Token Sale', image_url: '/images/banner2.jpg', link_url: '/token-sale', sort_order: 2, is_active: true });

  // Demo menus
  demoData.menus.set('nav_1', { id: 'nav_1', label: 'Home', link: '/', sort_order: 1, is_active: true });
  demoData.menus.set('nav_2', { id: 'nav_2', label: 'Token Sale', link: '/token-sale', sort_order: 2, is_active: true });
  demoData.menus.set('nav_3', { id: 'nav_3', label: 'Staking', link: '/staking', sort_order: 3, is_active: true });

  // Demo footer links
  demoData.footerLinks.set('footer_1', { id: 'footer_1', section: 'about', label: 'About Us', link: '/about', sort_order: 1, is_active: true });
  demoData.footerLinks.set('footer_2', { id: 'footer_2', section: 'about', label: 'Contact', link: '/contact', sort_order: 2, is_active: true });

  // Demo pages
  demoData.pages.set('about', { id: 'page_1', slug: 'about', title: 'About Us', content: 'About Quantaureum...', is_published: true });
  demoData.pages.set('terms', { id: 'page_2', slug: 'terms', title: 'Terms of Service', content: 'Terms...', is_published: true });

  // Demo domains
  demoData.domains.set('domain_1', { id: 'domain_1', domain: 'quantaureum.com', type: 'primary', ssl_enabled: true, is_active: true });

  // Demo launch config
  demoData.launchConfig = { id: 'launch_1', launch_date: null, pre_launch_enabled: false, maintenance_mode: false };

  // Demo blockchain networks
  demoData.blockchainNetworks.set('network_1', { id: 'network_1', name: 'Quantaureum Mainnet', chain_id: 7777, rpc_url: 'https://rpc.quantaureum.com', is_active: true });

  // Demo blockchain token
  demoData.blockchainToken = { id: 'token_qau', name: 'Quantaureum', symbol: 'QAU', decimals: 18, total_supply: '1000000000' };

  // Demo modules
  demoData.demoModules.set('demo_flights', { id: 'demo_flights', name: 'Flight Booking', slug: 'flights', is_active: true, show_demo_badge: true });
  demoData.demoModules.set('demo_hotels', { id: 'demo_hotels', name: 'Hotel Booking', slug: 'hotels', is_active: true, show_demo_badge: true });

  // Demo currencies
  demoData.currencies.set('qau', { id: 'qau', name: 'Quantaureum', symbol: 'QAU', type: 'coin' });
  demoData.currencies.set('usdt', { id: 'usdt', name: 'Tether', symbol: 'USDT', type: 'token' });

  // Demo comments
  demoData.comments.set('cmt_1', { id: 'cmt_1', post_id: 'post_1', user_id: 'user_1', content: 'Great post!', created_at: new Date().toISOString() });
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

  // Comments
  getPostComments: async (postId: string): Promise<DBResult<any[]>> => {
    const comments = Array.from(demoData.comments.values()).filter(c => c.post_id === postId);
    return { success: true, data: comments };
  },

  createComment: async (comment: any): Promise<DBResult<any>> => {
    const id = 'cmt_' + Date.now();
    const newComment = { ...comment, id, created_at: new Date().toISOString() };
    demoData.comments.set(id, newComment);
    // Update post comment count
    const post = demoData.posts.get(comment.post_id);
    if (post) {
      post.comment_count = (post.comment_count || 0) + 1;
    }
    return { success: true, data: newComment };
  },

  deleteComment: async (id: string): Promise<DBResult<void>> => {
    const comment = demoData.comments.get(id);
    if (!comment) return { success: false, error: 'Comment not found' };
    demoData.comments.delete(id);
    const post = demoData.posts.get(comment.post_id);
    if (post) post.comment_count = Math.max(0, (post.comment_count || 0) - 1);
    return { success: true };
  },

  // Categories
  createCategory: async (category: any): Promise<DBResult<any>> => {
    const id = Date.now().toString();
    const newCat = { ...category, id };
    demoData.categories.set(id, newCat);
    return { success: true, data: newCat };
  },

  updateCategory: async (id: string, updates: any): Promise<DBResult<any>> => {
    const cat = demoData.categories.get(id);
    if (!cat) return { success: false, error: 'Category not found' };
    const updated = { ...cat, ...updates };
    demoData.categories.set(id, updated);
    return { success: true, data: updated };
  },

  deleteCategory: async (id: string): Promise<DBResult<void>> => {
    const posts = Array.from(demoData.posts.values()).filter(p => p.category_id === parseInt(id));
    if (posts.length > 0) return { success: false, error: 'Cannot delete category with posts' };
    demoData.categories.delete(id);
    return { success: true };
  },

  getCommunityStats: async (): Promise<DBResult<any>> => {
    return {
      success: true,
      data: {
        totalPosts: demoData.posts.size,
        totalComments: demoData.comments.size,
        activeToday: 5,
      },
    };
  },

  // Banners
  getBanners: async (onlyActive = false): Promise<DBResult<any[]>> => {
    let banners = Array.from(demoData.banners.values());
    if (onlyActive) banners = banners.filter(b => b.is_active);
    return { success: true, data: banners.sort((a, b) => a.sort_order - b.sort_order) };
  },

  createBanner: async (banner: any): Promise<DBResult<any>> => {
    const id = 'ban_' + Date.now();
    const newBanner = { ...banner, id, is_active: true };
    demoData.banners.set(id, newBanner);
    return { success: true, data: newBanner };
  },

  updateBanner: async (id: string, updates: any): Promise<DBResult<any>> => {
    const banner = demoData.banners.get(id);
    if (!banner) return { success: false, error: 'Banner not found' };
    const updated = { ...banner, ...updates };
    demoData.banners.set(id, updated);
    return { success: true, data: updated };
  },

  deleteBanner: async (id: string): Promise<DBResult<void>> => {
    if (!demoData.banners.has(id)) return { success: false, error: 'Banner not found' };
    demoData.banners.delete(id);
    return { success: true };
  },

  // Menus
  getMenus: async (onlyActive = false): Promise<DBResult<any[]>> => {
    let menus = Array.from(demoData.menus.values());
    if (onlyActive) menus = menus.filter(m => m.is_active);
    return { success: true, data: menus.sort((a, b) => a.sort_order - b.sort_order) };
  },

  createMenu: async (menu: any): Promise<DBResult<any>> => {
    const id = 'nav_' + Date.now();
    const newMenu = { ...menu, id, is_active: true };
    demoData.menus.set(id, newMenu);
    return { success: true, data: newMenu };
  },

  updateMenu: async (id: string, updates: any): Promise<DBResult<any>> => {
    const menu = demoData.menus.get(id);
    if (!menu) return { success: false, error: 'Menu not found' };
    const updated = { ...menu, ...updates };
    demoData.menus.set(id, updated);
    return { success: true, data: updated };
  },

  deleteMenu: async (id: string): Promise<DBResult<void>> => {
    if (!demoData.menus.has(id)) return { success: false, error: 'Menu not found' };
    demoData.menus.delete(id);
    return { success: true };
  },

  // Footer Links
  getFooterLinks: async (onlyActive = false): Promise<DBResult<any[]>> => {
    let links = Array.from(demoData.footerLinks.values());
    if (onlyActive) links = links.filter(l => l.is_active);
    return { success: true, data: links.sort((a, b) => a.sort_order - b.sort_order) };
  },

  createFooterLink: async (link: any): Promise<DBResult<any>> => {
    const id = 'footer_' + Date.now();
    const newLink = { ...link, id, is_active: true };
    demoData.footerLinks.set(id, newLink);
    return { success: true, data: newLink };
  },

  updateFooterLink: async (id: string, updates: any): Promise<DBResult<any>> => {
    const link = demoData.footerLinks.get(id);
    if (!link) return { success: false, error: 'Footer link not found' };
    const updated = { ...link, ...updates };
    demoData.footerLinks.set(id, updated);
    return { success: true, data: updated };
  },

  updateFooterLinks: async (links: any[]): Promise<DBResult<void>> => {
    links.forEach(link => {
      if (link.id && demoData.footerLinks.has(link.id)) {
        demoData.footerLinks.set(link.id, { ...demoData.footerLinks.get(link.id), ...link });
      }
    });
    return { success: true };
  },

  deleteFooterLink: async (id: string): Promise<DBResult<void>> => {
    if (!demoData.footerLinks.has(id)) return { success: false, error: 'Footer link not found' };
    demoData.footerLinks.delete(id);
    return { success: true };
  },

  // Pages
  getPages: async (): Promise<DBResult<any[]>> => {
    return { success: true, data: Array.from(demoData.pages.values()) };
  },

  getPageBySlug: async (slug: string, onlyPublished = false): Promise<DBResult<any>> => {
    const page = demoData.pages.get(slug);
    if (!page) return { success: false, error: 'Page not found' };
    if (onlyPublished && !page.is_published) return { success: false, error: 'Page not found' };
    return { success: true, data: page };
  },

  createPage: async (page: any): Promise<DBResult<any>> => {
    if (demoData.pages.has(page.slug)) return { success: false, error: 'Page with this slug already exists' };
    const id = 'page_' + Date.now();
    const newPage = { ...page, id, is_published: true, version: 1, created_at: new Date().toISOString() };
    demoData.pages.set(page.slug, newPage);
    return { success: true, data: newPage };
  },

  updatePage: async (slug: string, updates: any): Promise<DBResult<any>> => {
    const page = demoData.pages.get(slug);
    if (!page) return { success: false, error: 'Page not found' };
    const updated = { ...page, ...updates, version: (page.version || 1) + 1, updated_at: new Date().toISOString() };
    demoData.pages.set(slug, updated);
    return { success: true, data: updated };
  },

  deletePage: async (slug: string): Promise<DBResult<void>> => {
    if (!demoData.pages.has(slug)) return { success: false, error: 'Page not found' };
    demoData.pages.delete(slug);
    return { success: true };
  },

  // Domains
  getDomains: async (): Promise<DBResult<any>> => {
    const domains = Array.from(demoData.domains.values());
    const primary = domains.find(d => d.type === 'primary' && d.is_active);
    return { success: true, data: { domains, primary, alternates: domains.filter(d => d.type !== 'primary') } };
  },

  createDomain: async (domain: any): Promise<DBResult<any>> => {
    const id = 'domain_' + Date.now();
    const newDomain = { ...domain, id, is_active: true };
    demoData.domains.set(id, newDomain);
    return { success: true, data: newDomain };
  },

  updateDomains: async (domains: any[]): Promise<DBResult<void>> => {
    domains.forEach(d => {
      if (d.id) demoData.domains.set(d.id, d);
    });
    return { success: true };
  },

  deleteDomain: async (id: string): Promise<DBResult<void>> => {
    if (!demoData.domains.has(id)) return { success: false, error: 'Domain not found' };
    demoData.domains.delete(id);
    return { success: true };
  },

  // Launch Config
  getLaunchConfig: async (): Promise<DBResult<any>> => {
    return { success: true, data: demoData.launchConfig || { pre_launch_enabled: false, maintenance_mode: false } };
  },

  updateLaunchConfig: async (config: any): Promise<DBResult<any>> => {
    demoData.launchConfig = { ...demoData.launchConfig, ...config, updated_at: new Date().toISOString() };
    return { success: true, data: demoData.launchConfig };
  },

  // Public System Settings
  getPublicSystemSettings: async (): Promise<DBResult<any>> => {
    const publicKeys = ['site_name', 'site_logo', 'meta_title', 'meta_description', 'social_twitter', 'social_telegram', 'contact_email', 'maintenance_mode'];
    const settings: Record<string, any> = {};
    publicKeys.forEach(key => {
      const val = demoData.systemSettings.get(key);
      if (val) settings[key] = val.value;
    });
    return { success: true, data: settings };
  },

  // Blockchain Networks
  getBlockchainNetworks: async (onlyActive = false): Promise<DBResult<any[]>> => {
    let networks = Array.from(demoData.blockchainNetworks.values());
    if (onlyActive) networks = networks.filter(n => n.is_active);
    return { success: true, data: networks };
  },

  createBlockchainNetwork: async (network: any): Promise<DBResult<any>> => {
    const id = 'network_' + Date.now();
    const newNetwork = { ...network, id, is_active: true };
    demoData.blockchainNetworks.set(id, newNetwork);
    return { success: true, data: newNetwork };
  },

  updateBlockchainNetwork: async (id: string, updates: any): Promise<DBResult<any>> => {
    const network = demoData.blockchainNetworks.get(id);
    if (!network) return { success: false, error: 'Network not found' };
    const updated = { ...network, ...updates };
    demoData.blockchainNetworks.set(id, updated);
    return { success: true, data: updated };
  },

  updateBlockchainNetworks: async (networks: any[]): Promise<DBResult<void>> => {
    networks.forEach(n => {
      if (n.id) demoData.blockchainNetworks.set(n.id, n);
    });
    return { success: true };
  },

  deleteBlockchainNetwork: async (id: string): Promise<DBResult<void>> => {
    if (!demoData.blockchainNetworks.has(id)) return { success: false, error: 'Network not found' };
    demoData.blockchainNetworks.delete(id);
    return { success: true };
  },

  // Blockchain Contracts
  getBlockchainContracts: async (onlyActive = false): Promise<DBResult<any[]>> => {
    let contracts = Array.from(demoData.blockchainContracts.values());
    if (onlyActive) contracts = contracts.filter(c => !c.is_deprecated);
    return { success: true, data: contracts };
  },

  createBlockchainContract: async (contract: any): Promise<DBResult<any>> => {
    const id = 'contract_' + Date.now();
    const newContract = { ...contract, id };
    demoData.blockchainContracts.set(id, newContract);
    return { success: true, data: newContract };
  },

  updateBlockchainContract: async (id: string, updates: any): Promise<DBResult<any>> => {
    const contract = demoData.blockchainContracts.get(id);
    if (!contract) return { success: false, error: 'Contract not found' };
    const updated = { ...contract, ...updates };
    demoData.blockchainContracts.set(id, updated);
    return { success: true, data: updated };
  },

  deleteBlockchainContract: async (id: string): Promise<DBResult<void>> => {
    if (!demoData.blockchainContracts.has(id)) return { success: false, error: 'Contract not found' };
    demoData.blockchainContracts.delete(id);
    return { success: true };
  },

  // Blockchain Token
  getBlockchainToken: async (): Promise<DBResult<any>> => {
    return { success: true, data: demoData.blockchainToken };
  },

  updateBlockchainToken: async (updates: any): Promise<DBResult<any>> => {
    demoData.blockchainToken = { ...demoData.blockchainToken, ...updates, updated_at: new Date().toISOString() };
    return { success: true, data: demoData.blockchainToken };
  },

  // Demo Modules
  getDemoModules: async (onlyActive = false): Promise<DBResult<any[]>> => {
    let modules = Array.from(demoData.demoModules.values());
    if (onlyActive) modules = modules.filter(m => m.is_active);
    return { success: true, data: modules };
  },

  updateDemoModule: async (id: string, updates: any): Promise<DBResult<any>> => {
    const module = demoData.demoModules.get(id);
    if (!module) return { success: false, error: 'Module not found' };
    const updated = { ...module, ...updates };
    demoData.demoModules.set(id, updated);
    return { success: true, data: updated };
  },

  toggleAllDemoModules: async (isActive: boolean): Promise<DBResult<void>> => {
    demoData.demoModules.forEach((module, id) => {
      demoData.demoModules.set(id, { ...module, is_active: isActive });
    });
    return { success: true };
  },

  // Currencies
  getCurrencies: async (): Promise<DBResult<any[]>> => {
    return { success: true, data: Array.from(demoData.currencies.values()) };
  },

  createCurrency: async (currency: any): Promise<DBResult<any>> => {
    demoData.currencies.set(currency.id.toLowerCase(), currency);
    return { success: true, data: currency };
  },

  updateCurrency: async (id: string, updates: any): Promise<DBResult<any>> => {
    const currency = demoData.currencies.get(id);
    if (!currency) return { success: false, error: 'Currency not found' };
    const updated = { ...currency, ...updates };
    demoData.currencies.set(id, updated);
    return { success: true, data: updated };
  },

  // Deposits
  getDeposits: async (params: { page?: number; limit?: number }): Promise<DBResult<{ deposits: any[]; total: number }>> => {
    const { page = 1, limit = 10 } = params;
    const deposits = Array.from(demoData.deposits.values());
    const total = deposits.length;
    const start = (page - 1) * limit;
    return { success: true, data: { deposits: deposits.slice(start, start + limit), total } };
  },

  // Audit Logs
  getAuditLogs: async (params: { page?: number; limit?: number; action?: string; admin_id?: string }): Promise<DBResult<{ logs: any[]; total: number }>> => {
    const { page = 1, limit = 50, action, admin_id } = params;
    let logs = [...demoData.auditLogs];
    if (action) logs = logs.filter(l => l.action === action);
    if (admin_id) logs = logs.filter(l => l.admin_id === admin_id);
    logs.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    const total = logs.length;
    const start = (page - 1) * limit;
    return { success: true, data: { logs: logs.slice(start, start + limit), total } };
  },

  // Token Purchases
  createTokenPurchase: async (purchase: any): Promise<DBResult<any>> => {
    const id = 'ord_' + Date.now();
    const newPurchase = { ...purchase, id, created_at: new Date().toISOString() };
    demoData.tokenPurchases.set(id, newPurchase);
    return { success: true, data: newPurchase };
  },

  // User Stakes
  getUserStakes: async (userId: string): Promise<DBResult<any[]>> => {
    const stakes = Array.from(demoData.userStakes.values()).filter(s => s.user_id === userId);
    return { success: true, data: stakes };
  },

  createStake: async (stake: any): Promise<DBResult<any>> => {
    const pool = demoData.stakingPools.get(stake.pool_id);
    if (!pool) return { success: false, error: 'Pool not found' };
    if (stake.amount < pool.min_stake) return { success: false, error: `Minimum stake is ${pool.min_stake}` };
    
    const id = 'stake_' + Date.now();
    const unlockDate = new Date(Date.now() + pool.duration_days * 24 * 60 * 60 * 1000);
    const newStake = { ...stake, id, start_date: new Date().toISOString(), unlock_date: unlockDate.toISOString(), status: 'active' };
    demoData.userStakes.set(id, newStake);
    pool.total_staked = (pool.total_staked || 0) + stake.amount;
    return { success: true, data: newStake };
  },

  deleteStakingPool: async (id: string): Promise<DBResult<void>> => {
    if (!demoData.stakingPools.has(id)) return { success: false, error: 'Pool not found' };
    demoData.stakingPools.delete(id);
    return { success: true };
  },

  // Post operations
  getPostById: async (id: string): Promise<DBResult<any>> => {
    const post = demoData.posts.get(id);
    if (!post) return { success: false, error: 'Post not found' };
    return { success: true, data: post };
  },

  togglePostLike: async (postId: string, userId: string): Promise<DBResult<{ liked: boolean; like_count: number }>> => {
    const post = demoData.posts.get(postId);
    if (!post) return { success: false, error: 'Post not found' };
    
    if (!demoData.postLikes.has(postId)) {
      demoData.postLikes.set(postId, new Set());
    }
    const likes = demoData.postLikes.get(postId)!;
    
    let liked: boolean;
    if (likes.has(userId)) {
      likes.delete(userId);
      post.like_count = Math.max(0, (post.like_count || 0) - 1);
      liked = false;
    } else {
      likes.add(userId);
      post.like_count = (post.like_count || 0) + 1;
      liked = true;
    }
    
    return { success: true, data: { liked, like_count: post.like_count } };
  },
};

export default db;
