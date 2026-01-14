/**
 * PostgreSQL Database Connection using Neon Serverless
 */

import { neon } from '@neondatabase/serverless';

// Get database URL from environment
const DATABASE_URL = process.env.DATABASE_URL || process.env.POSTGRES_URL;

if (!DATABASE_URL) {
  console.warn('DATABASE_URL not configured, using demo mode');
}

// Create SQL query function
export const sql = DATABASE_URL ? neon(DATABASE_URL) : null;

// Initialize database tables
export async function initDatabase() {
  if (!sql) {
    console.log('Database not configured, skipping initialization');
    return;
  }

  try {
    // Users table
    await sql`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        uid VARCHAR(50) UNIQUE NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255),
        role VARCHAR(50) DEFAULT 'user',
        level INTEGER DEFAULT 1,
        status VARCHAR(50) DEFAULT 'active',
        is_verified BOOLEAN DEFAULT false,
        profile_data JSONB DEFAULT '{}',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    // Admin users table
    await sql`
      CREATE TABLE IF NOT EXISTS admin_users (
        id SERIAL PRIMARY KEY,
        uid VARCHAR(50) UNIQUE NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        role VARCHAR(50) DEFAULT 'admin',
        permissions TEXT[] DEFAULT '{}',
        last_login TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    // Posts table
    await sql`
      CREATE TABLE IF NOT EXISTS posts (
        id SERIAL PRIMARY KEY,
        title VARCHAR(500) NOT NULL,
        content TEXT,
        user_id VARCHAR(50) REFERENCES users(uid),
        category_id INTEGER,
        view_count INTEGER DEFAULT 0,
        like_count INTEGER DEFAULT 0,
        comment_count INTEGER DEFAULT 0,
        is_pinned BOOLEAN DEFAULT false,
        status VARCHAR(50) DEFAULT 'published',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    // Comments table
    await sql`
      CREATE TABLE IF NOT EXISTS comments (
        id SERIAL PRIMARY KEY,
        post_id INTEGER REFERENCES posts(id) ON DELETE CASCADE,
        user_id VARCHAR(50) REFERENCES users(uid),
        content TEXT NOT NULL,
        parent_id INTEGER REFERENCES comments(id),
        like_count INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    // Categories table
    await sql`
      CREATE TABLE IF NOT EXISTS categories (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        slug VARCHAR(100) UNIQUE NOT NULL,
        description TEXT,
        sort_order INTEGER DEFAULT 0,
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    // Staking pools table
    await sql`
      CREATE TABLE IF NOT EXISTS staking_pools (
        id SERIAL PRIMARY KEY,
        pool_id VARCHAR(100) UNIQUE NOT NULL,
        token_id VARCHAR(50) NOT NULL,
        name VARCHAR(100),
        apy DECIMAL(10,2) NOT NULL,
        duration_days INTEGER NOT NULL,
        min_stake DECIMAL(20,8) DEFAULT 0,
        max_stake DECIMAL(20,8),
        total_staked DECIMAL(20,8) DEFAULT 0,
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    // User stakes table
    await sql`
      CREATE TABLE IF NOT EXISTS user_stakes (
        id SERIAL PRIMARY KEY,
        user_id VARCHAR(50) REFERENCES users(uid),
        pool_id VARCHAR(100),
        amount DECIMAL(20,8) NOT NULL,
        start_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        end_date TIMESTAMP,
        status VARCHAR(50) DEFAULT 'active',
        rewards_earned DECIMAL(20,8) DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    // Token purchases (ICO) table
    await sql`
      CREATE TABLE IF NOT EXISTS token_purchases (
        id SERIAL PRIMARY KEY,
        buyer_address VARCHAR(100),
        user_id VARCHAR(50),
        amount_usd DECIMAL(20,2) NOT NULL,
        token_price DECIMAL(20,8) NOT NULL,
        tokens_total DECIMAL(20,8) NOT NULL,
        payment_method VARCHAR(50),
        tx_hash VARCHAR(100),
        status VARCHAR(50) DEFAULT 'pending',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    // System settings table
    await sql`
      CREATE TABLE IF NOT EXISTS system_settings (
        id SERIAL PRIMARY KEY,
        key VARCHAR(100) UNIQUE NOT NULL,
        value TEXT,
        type VARCHAR(50) DEFAULT 'string',
        description TEXT,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    // Banners table
    await sql`
      CREATE TABLE IF NOT EXISTS banners (
        id SERIAL PRIMARY KEY,
        title VARCHAR(200),
        image_url VARCHAR(500) NOT NULL,
        link_url VARCHAR(500),
        sort_order INTEGER DEFAULT 0,
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    // Pages table
    await sql`
      CREATE TABLE IF NOT EXISTS pages (
        id SERIAL PRIMARY KEY,
        slug VARCHAR(100) UNIQUE NOT NULL,
        title VARCHAR(200) NOT NULL,
        content TEXT,
        meta_title VARCHAR(200),
        meta_description TEXT,
        is_published BOOLEAN DEFAULT true,
        version INTEGER DEFAULT 1,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    // Menus table
    await sql`
      CREATE TABLE IF NOT EXISTS menus (
        id SERIAL PRIMARY KEY,
        label VARCHAR(100) NOT NULL,
        link VARCHAR(500) NOT NULL,
        parent_id INTEGER REFERENCES menus(id),
        sort_order INTEGER DEFAULT 0,
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    // Audit logs table
    await sql`
      CREATE TABLE IF NOT EXISTS audit_logs (
        id SERIAL PRIMARY KEY,
        admin_id VARCHAR(50),
        action VARCHAR(100) NOT NULL,
        target_type VARCHAR(100),
        target_id VARCHAR(100),
        old_value JSONB,
        new_value JSONB,
        ip_address VARCHAR(50),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    console.log('Database tables initialized successfully');
  } catch (error) {
    console.error('Failed to initialize database:', error);
    throw error;
  }
}

// Database query helpers
export const dbQuery = {
  // Users
  async getUsers(params: { page?: number; limit?: number; search?: string; status?: string }) {
    if (!sql) return { users: [], total: 0 };
    
    const { page = 1, limit = 20, search, status } = params;
    const offset = (page - 1) * limit;
    
    let users;
    let countResult;
    
    if (search) {
      users = await sql`
        SELECT * FROM users 
        WHERE email ILIKE ${'%' + search + '%'} OR uid ILIKE ${'%' + search + '%'}
        ORDER BY created_at DESC
        LIMIT ${limit} OFFSET ${offset}
      `;
      countResult = await sql`
        SELECT COUNT(*) as total FROM users 
        WHERE email ILIKE ${'%' + search + '%'} OR uid ILIKE ${'%' + search + '%'}
      `;
    } else if (status) {
      users = await sql`
        SELECT * FROM users WHERE status = ${status}
        ORDER BY created_at DESC
        LIMIT ${limit} OFFSET ${offset}
      `;
      countResult = await sql`SELECT COUNT(*) as total FROM users WHERE status = ${status}`;
    } else {
      users = await sql`
        SELECT * FROM users 
        ORDER BY created_at DESC
        LIMIT ${limit} OFFSET ${offset}
      `;
      countResult = await sql`SELECT COUNT(*) as total FROM users`;
    }
    
    return { users, total: parseInt(countResult[0]?.total || '0') };
  },

  async getUserByUid(uid: string) {
    if (!sql) return null;
    const result = await sql`SELECT * FROM users WHERE uid = ${uid}`;
    return result[0] || null;
  },

  async getUserByEmail(email: string) {
    if (!sql) return null;
    const result = await sql`SELECT * FROM users WHERE email = ${email}`;
    return result[0] || null;
  },

  async createUser(user: any) {
    if (!sql) return null;
    const result = await sql`
      INSERT INTO users (uid, email, password_hash, role, level, status, is_verified, profile_data)
      VALUES (${user.uid}, ${user.email}, ${user.password_hash}, ${user.role || 'user'}, 
              ${user.level || 1}, ${user.status || 'active'}, ${user.is_verified || false}, 
              ${JSON.stringify(user.profile_data || {})})
      RETURNING *
    `;
    return result[0];
  },

  async updateUser(uid: string, updates: any) {
    if (!sql) return null;
    const result = await sql`
      UPDATE users SET 
        role = COALESCE(${updates.role}, role),
        level = COALESCE(${updates.level}, level),
        status = COALESCE(${updates.status}, status),
        is_verified = COALESCE(${updates.is_verified}, is_verified),
        profile_data = COALESCE(${JSON.stringify(updates.profile_data)}, profile_data),
        updated_at = CURRENT_TIMESTAMP
      WHERE uid = ${uid}
      RETURNING *
    `;
    return result[0];
  },

  // Posts
  async getPosts(params: { page?: number; limit?: number; category_id?: number }) {
    if (!sql) return { posts: [], total: 0 };
    
    const { page = 1, limit = 10, category_id } = params;
    const offset = (page - 1) * limit;
    
    let posts;
    let countResult;
    
    if (category_id) {
      posts = await sql`
        SELECT p.*, u.email as author_email FROM posts p
        LEFT JOIN users u ON p.user_id = u.uid
        WHERE p.category_id = ${category_id}
        ORDER BY p.is_pinned DESC, p.created_at DESC
        LIMIT ${limit} OFFSET ${offset}
      `;
      countResult = await sql`SELECT COUNT(*) as total FROM posts WHERE category_id = ${category_id}`;
    } else {
      posts = await sql`
        SELECT p.*, u.email as author_email FROM posts p
        LEFT JOIN users u ON p.user_id = u.uid
        ORDER BY p.is_pinned DESC, p.created_at DESC
        LIMIT ${limit} OFFSET ${offset}
      `;
      countResult = await sql`SELECT COUNT(*) as total FROM posts`;
    }
    
    return { posts, total: parseInt(countResult[0]?.total || '0') };
  },

  async createPost(post: any) {
    if (!sql) return null;
    const result = await sql`
      INSERT INTO posts (title, content, user_id, category_id, is_pinned, status)
      VALUES (${post.title}, ${post.content}, ${post.user_id}, ${post.category_id}, 
              ${post.is_pinned || false}, ${post.status || 'published'})
      RETURNING *
    `;
    return result[0];
  },

  async updatePost(id: number, updates: any) {
    if (!sql) return null;
    const result = await sql`
      UPDATE posts SET 
        title = COALESCE(${updates.title}, title),
        content = COALESCE(${updates.content}, content),
        is_pinned = COALESCE(${updates.is_pinned}, is_pinned),
        status = COALESCE(${updates.status}, status),
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ${id}
      RETURNING *
    `;
    return result[0];
  },

  async deletePost(id: number) {
    if (!sql) return false;
    await sql`DELETE FROM posts WHERE id = ${id}`;
    return true;
  },

  // Categories
  async getCategories() {
    if (!sql) return [];
    return await sql`SELECT * FROM categories ORDER BY sort_order ASC`;
  },

  async createCategory(category: any) {
    if (!sql) return null;
    const result = await sql`
      INSERT INTO categories (name, slug, description, sort_order, is_active)
      VALUES (${category.name}, ${category.slug}, ${category.description}, 
              ${category.sort_order || 0}, ${category.is_active !== false})
      RETURNING *
    `;
    return result[0];
  },

  // Staking Pools
  async getStakingPools(onlyActive = false) {
    if (!sql) return [];
    if (onlyActive) {
      return await sql`SELECT * FROM staking_pools WHERE is_active = true ORDER BY created_at DESC`;
    }
    return await sql`SELECT * FROM staking_pools ORDER BY created_at DESC`;
  },

  async createStakingPool(pool: any) {
    if (!sql) return null;
    const result = await sql`
      INSERT INTO staking_pools (pool_id, token_id, name, apy, duration_days, min_stake, max_stake, is_active)
      VALUES (${pool.pool_id}, ${pool.token_id}, ${pool.name}, ${pool.apy}, ${pool.duration_days},
              ${pool.min_stake || 0}, ${pool.max_stake}, ${pool.is_active !== false})
      RETURNING *
    `;
    return result[0];
  },

  async updateStakingPool(poolId: string, updates: any) {
    if (!sql) return null;
    const result = await sql`
      UPDATE staking_pools SET 
        apy = COALESCE(${updates.apy}, apy),
        min_stake = COALESCE(${updates.min_stake}, min_stake),
        max_stake = COALESCE(${updates.max_stake}, max_stake),
        is_active = COALESCE(${updates.is_active}, is_active)
      WHERE pool_id = ${poolId}
      RETURNING *
    `;
    return result[0];
  },

  // System Settings
  async getSystemSettings() {
    if (!sql) return {};
    const settings = await sql`SELECT * FROM system_settings`;
    const result: Record<string, any> = {};
    settings.forEach((s: any) => {
      result[s.key] = { value: s.value, type: s.type };
    });
    return result;
  },

  async updateSystemSetting(key: string, value: string, type = 'string') {
    if (!sql) return null;
    const result = await sql`
      INSERT INTO system_settings (key, value, type, updated_at)
      VALUES (${key}, ${value}, ${type}, CURRENT_TIMESTAMP)
      ON CONFLICT (key) DO UPDATE SET value = ${value}, type = ${type}, updated_at = CURRENT_TIMESTAMP
      RETURNING *
    `;
    return result[0];
  },

  // Dashboard Stats
  async getDashboardStats() {
    if (!sql) return null;
    
    const [usersCount] = await sql`SELECT COUNT(*) as total FROM users`;
    const [activeUsers] = await sql`SELECT COUNT(*) as total FROM users WHERE status = 'active'`;
    const [postsCount] = await sql`SELECT COUNT(*) as total FROM posts`;
    const [commentsCount] = await sql`SELECT COUNT(*) as total FROM comments`;
    const [poolsCount] = await sql`SELECT COUNT(*) as total FROM staking_pools WHERE is_active = true`;
    const [stakesSum] = await sql`SELECT COALESCE(SUM(total_staked), 0) as total FROM staking_pools`;
    const [purchasesStats] = await sql`
      SELECT COUNT(*) as total_orders, 
             COALESCE(SUM(amount_usd), 0) as total_raised,
             COALESCE(SUM(tokens_total), 0) as total_tokens
      FROM token_purchases WHERE status = 'completed'
    `;
    
    // Recent data
    const recentUsers = await sql`SELECT uid as id, email, role, created_at FROM users ORDER BY created_at DESC LIMIT 5`;
    const recentPosts = await sql`
      SELECT p.id, p.title, p.created_at, u.email as author_email 
      FROM posts p LEFT JOIN users u ON p.user_id = u.uid 
      ORDER BY p.created_at DESC LIMIT 5
    `;
    const recentPurchases = await sql`
      SELECT id, buyer_address, amount_usd, tokens_total, status, created_at 
      FROM token_purchases ORDER BY created_at DESC LIMIT 5
    `;
    
    // Growth stats
    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
    const twoWeeksAgo = new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString();
    
    const [newUsersThisWeek] = await sql`SELECT COUNT(*) as total FROM users WHERE created_at > ${weekAgo}`;
    const [newUsersLastWeek] = await sql`
      SELECT COUNT(*) as total FROM users WHERE created_at > ${twoWeeksAgo} AND created_at <= ${weekAgo}
    `;
    const [newPostsThisWeek] = await sql`SELECT COUNT(*) as total FROM posts WHERE created_at > ${weekAgo}`;
    
    const thisWeek = parseInt(newUsersThisWeek.total);
    const lastWeek = parseInt(newUsersLastWeek.total);
    const growthPercent = lastWeek > 0 ? ((thisWeek - lastWeek) / lastWeek * 100).toFixed(1) : (thisWeek > 0 ? 100 : 0);
    
    return {
      overview: {
        total_users: parseInt(usersCount.total),
        active_users: parseInt(activeUsers.total),
        total_posts: parseInt(postsCount.total),
        total_comments: parseInt(commentsCount.total),
        total_staked: parseFloat(stakesSum.total),
        active_stakes: 0,
        staking_pools: parseInt(poolsCount.total),
      },
      ico: {
        total_raised: parseFloat(purchasesStats.total_raised),
        total_tokens_sold: parseFloat(purchasesStats.total_tokens),
        total_orders: parseInt(purchasesStats.total_orders),
      },
      growth: {
        new_users_this_week: thisWeek,
        new_users_last_week: lastWeek,
        user_growth_percent: parseFloat(String(growthPercent)),
        new_posts_this_week: parseInt(newPostsThisWeek.total),
      },
      recent: {
        users: recentUsers,
        posts: recentPosts,
        purchases: recentPurchases,
      },
      timestamp: new Date().toISOString(),
    };
  },

  // Audit Log
  async logAction(adminId: string, action: string, targetType: string, targetId: string, oldValue: any, newValue: any) {
    if (!sql) return;
    await sql`
      INSERT INTO audit_logs (admin_id, action, target_type, target_id, old_value, new_value)
      VALUES (${adminId}, ${action}, ${targetType}, ${targetId}, ${JSON.stringify(oldValue)}, ${JSON.stringify(newValue)})
    `;
  },

  // Admin Users
  async getAdminByEmail(email: string) {
    if (!sql) return null;
    const result = await sql`SELECT * FROM admin_users WHERE email = ${email}`;
    return result[0] || null;
  },

  async createAdminUser(admin: any) {
    if (!sql) return null;
    const result = await sql`
      INSERT INTO admin_users (uid, email, password_hash, role, permissions)
      VALUES (${admin.uid}, ${admin.email}, ${admin.password_hash}, ${admin.role || 'admin'}, ${admin.permissions || []})
      RETURNING *
    `;
    return result[0];
  },

  // Banners
  async getBanners(onlyActive = false) {
    if (!sql) return [];
    if (onlyActive) {
      return await sql`SELECT * FROM banners WHERE is_active = true ORDER BY sort_order ASC`;
    }
    return await sql`SELECT * FROM banners ORDER BY sort_order ASC`;
  },

  async createBanner(banner: any) {
    if (!sql) return null;
    const result = await sql`
      INSERT INTO banners (title, image_url, link_url, sort_order, is_active)
      VALUES (${banner.title}, ${banner.image_url}, ${banner.link_url}, ${banner.sort_order || 0}, ${banner.is_active !== false})
      RETURNING *
    `;
    return result[0];
  },

  // Pages
  async getPages() {
    if (!sql) return [];
    return await sql`SELECT * FROM pages ORDER BY created_at DESC`;
  },

  async getPageBySlug(slug: string) {
    if (!sql) return null;
    const result = await sql`SELECT * FROM pages WHERE slug = ${slug}`;
    return result[0] || null;
  },

  async createPage(page: any) {
    if (!sql) return null;
    const result = await sql`
      INSERT INTO pages (slug, title, content, meta_title, meta_description, is_published)
      VALUES (${page.slug}, ${page.title}, ${page.content}, ${page.meta_title}, ${page.meta_description}, ${page.is_published !== false})
      RETURNING *
    `;
    return result[0];
  },

  async updatePage(slug: string, updates: any) {
    if (!sql) return null;
    const result = await sql`
      UPDATE pages SET 
        title = COALESCE(${updates.title}, title),
        content = COALESCE(${updates.content}, content),
        meta_title = COALESCE(${updates.meta_title}, meta_title),
        meta_description = COALESCE(${updates.meta_description}, meta_description),
        is_published = COALESCE(${updates.is_published}, is_published),
        version = version + 1,
        updated_at = CURRENT_TIMESTAMP
      WHERE slug = ${slug}
      RETURNING *
    `;
    return result[0];
  },
};

export default { sql, initDatabase, dbQuery };
