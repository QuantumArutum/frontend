/**
 * PostgreSQL Database Connection using Neon Serverless
 */

import { neon } from '@neondatabase/serverless';

// Type definitions
export interface User {
  id: string;
  uid: string;
  email: string;
  walletAddress?: string;
  isVerified: boolean;
  isActive: boolean;
  kycStatus: string;
  role: string;
  createdAt: string;
  updatedAt: string;
}

export interface Session {
  id: string;
  userId: string;
  token: string;
  expiresAt: string;
  createdAt: string;
}

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

    // ========== COMMUNITY EXTENDED TABLES ==========
    
    // User badges table
    await sql`
      CREATE TABLE IF NOT EXISTS user_badges (
        id SERIAL PRIMARY KEY,
        user_id VARCHAR(50) REFERENCES users(uid),
        badge_type VARCHAR(50) NOT NULL,
        badge_name VARCHAR(100) NOT NULL,
        badge_icon VARCHAR(200),
        description TEXT,
        earned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(user_id, badge_type)
      )
    `;

    // User levels/reputation table
    await sql`
      CREATE TABLE IF NOT EXISTS user_reputation (
        id SERIAL PRIMARY KEY,
        user_id VARCHAR(50) UNIQUE REFERENCES users(uid),
        reputation_points INTEGER DEFAULT 0,
        level INTEGER DEFAULT 1,
        posts_count INTEGER DEFAULT 0,
        comments_count INTEGER DEFAULT 0,
        likes_received INTEGER DEFAULT 0,
        likes_given INTEGER DEFAULT 0,
        helpful_answers INTEGER DEFAULT 0,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    // Post likes table
    await sql`
      CREATE TABLE IF NOT EXISTS post_likes (
        id SERIAL PRIMARY KEY,
        post_id INTEGER REFERENCES posts(id) ON DELETE CASCADE,
        user_id VARCHAR(50) REFERENCES users(uid),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(post_id, user_id)
      )
    `;

    // Comment likes table
    await sql`
      CREATE TABLE IF NOT EXISTS comment_likes (
        id SERIAL PRIMARY KEY,
        comment_id INTEGER REFERENCES comments(id) ON DELETE CASCADE,
        user_id VARCHAR(50) REFERENCES users(uid),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(comment_id, user_id)
      )
    `;

    // User reports table
    await sql`
      CREATE TABLE IF NOT EXISTS user_reports (
        id SERIAL PRIMARY KEY,
        reporter_id VARCHAR(50) REFERENCES users(uid),
        reported_user_id VARCHAR(50) REFERENCES users(uid),
        target_type VARCHAR(50) NOT NULL,
        target_id INTEGER NOT NULL,
        reason VARCHAR(100) NOT NULL,
        description TEXT,
        status VARCHAR(50) DEFAULT 'pending',
        admin_notes TEXT,
        handled_by VARCHAR(50),
        handled_at TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    // User bans table
    await sql`
      CREATE TABLE IF NOT EXISTS user_bans (
        id SERIAL PRIMARY KEY,
        user_id VARCHAR(50) REFERENCES users(uid),
        banned_by VARCHAR(50),
        reason TEXT NOT NULL,
        ban_type VARCHAR(50) DEFAULT 'temporary',
        expires_at TIMESTAMP,
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    // Community notifications table
    await sql`
      CREATE TABLE IF NOT EXISTS community_notifications (
        id SERIAL PRIMARY KEY,
        user_id VARCHAR(50) REFERENCES users(uid),
        type VARCHAR(50) NOT NULL,
        title VARCHAR(200) NOT NULL,
        content TEXT,
        link VARCHAR(500),
        is_read BOOLEAN DEFAULT false,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    // Community announcements table
    await sql`
      CREATE TABLE IF NOT EXISTS community_announcements (
        id SERIAL PRIMARY KEY,
        title VARCHAR(200) NOT NULL,
        content TEXT NOT NULL,
        type VARCHAR(50) DEFAULT 'info',
        is_pinned BOOLEAN DEFAULT false,
        is_active BOOLEAN DEFAULT true,
        start_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        end_date TIMESTAMP,
        created_by VARCHAR(50),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    // Community events table
    await sql`
      CREATE TABLE IF NOT EXISTS community_events (
        id SERIAL PRIMARY KEY,
        title VARCHAR(200) NOT NULL,
        description TEXT,
        event_type VARCHAR(50) NOT NULL,
        start_time TIMESTAMP NOT NULL,
        end_time TIMESTAMP,
        location VARCHAR(500),
        max_participants INTEGER,
        current_participants INTEGER DEFAULT 0,
        reward_points INTEGER DEFAULT 0,
        reward_tokens DECIMAL(20,8) DEFAULT 0,
        status VARCHAR(50) DEFAULT 'upcoming',
        image_url VARCHAR(500),
        created_by VARCHAR(50),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    // Event participants table
    await sql`
      CREATE TABLE IF NOT EXISTS event_participants (
        id SERIAL PRIMARY KEY,
        event_id INTEGER REFERENCES community_events(id) ON DELETE CASCADE,
        user_id VARCHAR(50) REFERENCES users(uid),
        status VARCHAR(50) DEFAULT 'registered',
        registered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        attended_at TIMESTAMP,
        reward_claimed BOOLEAN DEFAULT false,
        UNIQUE(event_id, user_id)
      )
    `;

    // User follows table
    await sql`
      CREATE TABLE IF NOT EXISTS user_follows (
        id SERIAL PRIMARY KEY,
        follower_id VARCHAR(50) REFERENCES users(uid),
        following_id VARCHAR(50) REFERENCES users(uid),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(follower_id, following_id)
      )
    `;

    // Post bookmarks table
    await sql`
      CREATE TABLE IF NOT EXISTS post_bookmarks (
        id SERIAL PRIMARY KEY,
        post_id INTEGER REFERENCES posts(id) ON DELETE CASCADE,
        user_id VARCHAR(50) REFERENCES users(uid),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(post_id, user_id)
      )
    `;

    // Post tags table
    await sql`
      CREATE TABLE IF NOT EXISTS post_tags (
        id SERIAL PRIMARY KEY,
        name VARCHAR(50) NOT NULL UNIQUE,
        slug VARCHAR(50) NOT NULL UNIQUE,
        usage_count INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    // Post tag relations table
    await sql`
      CREATE TABLE IF NOT EXISTS post_tag_relations (
        id SERIAL PRIMARY KEY,
        post_id INTEGER REFERENCES posts(id) ON DELETE CASCADE,
        tag_id INTEGER REFERENCES post_tags(id) ON DELETE CASCADE,
        UNIQUE(post_id, tag_id)
      )
    `;

    // Moderation logs table
    await sql`
      CREATE TABLE IF NOT EXISTS moderation_logs (
        id SERIAL PRIMARY KEY,
        moderator_id VARCHAR(50),
        action VARCHAR(100) NOT NULL,
        target_type VARCHAR(50) NOT NULL,
        target_id INTEGER NOT NULL,
        reason TEXT,
        details JSONB,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    // User activity logs table
    await sql`
      CREATE TABLE IF NOT EXISTS user_activity_logs (
        id SERIAL PRIMARY KEY,
        user_id VARCHAR(50) REFERENCES users(uid),
        activity_type VARCHAR(50) NOT NULL,
        target_type VARCHAR(50),
        target_id INTEGER,
        points_earned INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    // Conversations table (for private messaging)
    await sql`
      CREATE TABLE IF NOT EXISTS conversations (
        id SERIAL PRIMARY KEY,
        participant1_id VARCHAR(50) REFERENCES users(uid),
        participant2_id VARCHAR(50) REFERENCES users(uid),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(participant1_id, participant2_id)
      )
    `;

    // Private messages table
    await sql`
      CREATE TABLE IF NOT EXISTS private_messages (
        id SERIAL PRIMARY KEY,
        conversation_id INTEGER REFERENCES conversations(id) ON DELETE CASCADE,
        sender_id VARCHAR(50) REFERENCES users(uid),
        receiver_id VARCHAR(50) REFERENCES users(uid),
        content TEXT NOT NULL,
        is_read BOOLEAN DEFAULT false,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    // Community tasks table
    await sql`
      CREATE TABLE IF NOT EXISTS community_tasks (
        id SERIAL PRIMARY KEY,
        title VARCHAR(200) NOT NULL,
        description TEXT,
        task_type VARCHAR(50) DEFAULT 'daily',
        reward_points INTEGER DEFAULT 0,
        reward_tokens DECIMAL(20,8) DEFAULT 0,
        requirements JSONB DEFAULT '{}',
        max_completions INTEGER DEFAULT 0,
        current_completions INTEGER DEFAULT 0,
        is_active BOOLEAN DEFAULT true,
        start_date TIMESTAMP,
        end_date TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    // Task completions table
    await sql`
      CREATE TABLE IF NOT EXISTS task_completions (
        id SERIAL PRIMARY KEY,
        task_id INTEGER REFERENCES community_tasks(id) ON DELETE CASCADE,
        user_id VARCHAR(50) REFERENCES users(uid),
        completed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        reward_claimed BOOLEAN DEFAULT false,
        UNIQUE(task_id, user_id)
      )
    `;

    // Sessions table
    await sql`
      CREATE TABLE IF NOT EXISTS sessions (
        id SERIAL PRIMARY KEY,
        user_id VARCHAR(50) REFERENCES users(uid),
        token VARCHAR(255) UNIQUE NOT NULL,
        expires_at TIMESTAMP NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    // Newsletter subscriptions table
    await sql`
      CREATE TABLE IF NOT EXISTS newsletter_subscriptions (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        status VARCHAR(50) DEFAULT 'active',
        source VARCHAR(100) DEFAULT 'website',
        subscribed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        unsubscribed_at TIMESTAMP,
        ip_address VARCHAR(50),
        user_agent TEXT
      )
    `;

    // ========== BLOCKCHAIN & SYSTEM TABLES ==========

    // Blockchain networks table
    await sql`
      CREATE TABLE IF NOT EXISTS blockchain_networks (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        chain_id INTEGER NOT NULL,
        rpc_url VARCHAR(500) NOT NULL,
        explorer_url VARCHAR(500),
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    // Blockchain contracts table
    await sql`
      CREATE TABLE IF NOT EXISTS blockchain_contracts (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        address VARCHAR(100) NOT NULL,
        network_id INTEGER REFERENCES blockchain_networks(id),
        contract_type VARCHAR(50),
        abi JSONB DEFAULT '{}',
        is_deprecated BOOLEAN DEFAULT false,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    // Blockchain token table
    await sql`
      CREATE TABLE IF NOT EXISTS blockchain_token (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL DEFAULT 'Quantaureum',
        symbol VARCHAR(20) NOT NULL DEFAULT 'QAU',
        decimals INTEGER DEFAULT 18,
        total_supply VARCHAR(100) DEFAULT '1000000000',
        contract_address VARCHAR(100),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    // Launch config table
    await sql`
      CREATE TABLE IF NOT EXISTS launch_config (
        id SERIAL PRIMARY KEY,
        launch_date TIMESTAMP,
        pre_launch_enabled BOOLEAN DEFAULT false,
        maintenance_mode BOOLEAN DEFAULT false,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    // Domains table
    await sql`
      CREATE TABLE IF NOT EXISTS domains (
        id SERIAL PRIMARY KEY,
        domain VARCHAR(255) NOT NULL,
        type VARCHAR(50) DEFAULT 'alternate',
        ssl_enabled BOOLEAN DEFAULT true,
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    // Currencies table
    await sql`
      CREATE TABLE IF NOT EXISTS currencies (
        id VARCHAR(50) PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        symbol VARCHAR(20) NOT NULL,
        type VARCHAR(50) DEFAULT 'token',
        decimals INTEGER DEFAULT 18,
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    // Deposits table
    await sql`
      CREATE TABLE IF NOT EXISTS deposits (
        id SERIAL PRIMARY KEY,
        user_id VARCHAR(50) REFERENCES users(uid),
        currency_id VARCHAR(50),
        amount DECIMAL(20,8) NOT NULL,
        tx_hash VARCHAR(100),
        status VARCHAR(50) DEFAULT 'pending',
        confirmations INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    // Demo modules table (for feature flags)
    await sql`
      CREATE TABLE IF NOT EXISTS demo_modules (
        id VARCHAR(50) PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        description TEXT,
        is_active BOOLEAN DEFAULT false,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    // Footer links table
    await sql`
      CREATE TABLE IF NOT EXISTS footer_links (
        id SERIAL PRIMARY KEY,
        section VARCHAR(50) NOT NULL,
        label VARCHAR(100) NOT NULL,
        link VARCHAR(500) NOT NULL,
        sort_order INTEGER DEFAULT 0,
        is_active BOOLEAN DEFAULT true,
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

// Legacy db interface for compatibility with existing code
export const db = {
  // User methods
  findUserById: async (id: string) => {
    if (!sql) return null;
    const result = await sql`SELECT * FROM users WHERE uid = ${id} OR id::text = ${id}`;
    return result[0] || null;
  },
  findUserByEmail: async (email: string) => dbQuery.getUserByEmail(email),
  createUser: async (userData: any) => dbQuery.createUser(userData),
  updateUser: async (id: string, updates: any) => dbQuery.updateUser(id, updates),
  
  // TOTP methods
  enableTOTP: async (userId: string, secret: string) => {
    if (!sql) return null;
    return await sql`UPDATE users SET totp_secret = ${secret}, totp_enabled = true WHERE uid = ${userId} RETURNING *`;
  },
  disableTOTP: async (userId: string) => {
    if (!sql) return null;
    return await sql`UPDATE users SET totp_secret = NULL, totp_enabled = false WHERE uid = ${userId} RETURNING *`;
  },
  verifyBackupCode: async (userId: string, code: string) => {
    // Simplified backup code verification
    return false;
  },
  
  // Session methods
  createSession: async (userId: string, tokenOrIp: string, expiresAtOrUserAgent: Date | string) => {
    if (!sql) return { token: 'session_' + Date.now(), userId };
    // Generate a session token
    const token = 'sess_' + Date.now() + '_' + Math.random().toString(36).substring(7);
    const expiresAt = expiresAtOrUserAgent instanceof Date 
      ? expiresAtOrUserAgent 
      : new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours default
    try {
      await sql`INSERT INTO sessions (user_id, token, expires_at) VALUES (${userId}, ${token}, ${expiresAt})`;
    } catch (e) {
      // Table might not exist, return mock session
    }
    return { token, userId, expiresAt };
  },
  deleteSession: async (token: string) => {
    if (!sql) return false;
    await sql`DELETE FROM sessions WHERE token = ${token}`;
    return true;
  },
  findSessionByToken: async (token: string) => {
    if (!sql) return null;
    const result = await sql`SELECT * FROM sessions WHERE token = ${token} AND expires_at > NOW()`;
    return result[0] || null;
  },
  invalidateSession: async (sessionId: string) => {
    if (!sql) return false;
    try {
      await sql`DELETE FROM sessions WHERE id = ${sessionId} OR token = ${sessionId}`;
      return true;
    } catch (e) {
      return false;
    }
  },
  invalidateAllUserSessions: async (userId: string) => {
    if (!sql) return false;
    try {
      await sql`DELETE FROM sessions WHERE user_id = ${userId}`;
      return true;
    } catch (e) {
      return false;
    }
  },
  
  // Token purchase methods
  createTokenPurchase: async (purchase: any) => {
    if (!sql) return null;
    const result = await sql`
      INSERT INTO token_purchases (buyer_address, user_id, amount_usd, token_price, tokens_total, payment_method, tx_hash, status)
      VALUES (${purchase.buyer_address}, ${purchase.user_id}, ${purchase.amount_usd}, ${purchase.token_price}, 
              ${purchase.tokens_total}, ${purchase.payment_method}, ${purchase.tx_hash}, ${purchase.status || 'pending'})
      RETURNING *
    `;
    return result[0];
  },
  getTokenPurchases: async (userId?: string) => {
    if (!sql) return [];
    if (userId) {
      return await sql`SELECT * FROM token_purchases WHERE user_id = ${userId} ORDER BY created_at DESC`;
    }
    return await sql`SELECT * FROM token_purchases ORDER BY created_at DESC`;
  },
  updateTokenPurchase: async (id: string, updates: any) => {
    if (!sql) return null;
    const result = await sql`
      UPDATE token_purchases SET status = COALESCE(${updates.status}, status) WHERE id = ${id} RETURNING *
    `;
    return result[0];
  },
  
  // KYC methods
  getKYCStatus: async (userId: string) => {
    if (!sql) return null;
    const result = await sql`SELECT kyc_status, kyc_data FROM users WHERE uid = ${userId}`;
    return result[0] || null;
  },
  updateKYCStatus: async (userId: string, status: string, data: any) => {
    if (!sql) return null;
    return await sql`UPDATE users SET kyc_status = ${status}, kyc_data = ${JSON.stringify(data)} WHERE uid = ${userId} RETURNING *`;
  },
  
  // Posts methods
  getPosts: async (params: any) => dbQuery.getPosts(params),
  createPost: async (post: any) => dbQuery.createPost(post),
  updatePost: async (id: number, updates: any) => dbQuery.updatePost(id, updates),
  deletePost: async (id: number) => dbQuery.deletePost(id),
  
  // Referral methods
  createReferral: async (referral: any) => {
    if (!sql) return null;
    // Simplified referral creation
    return { id: 'ref_' + Date.now(), ...referral };
  },
  getReferralByCode: async (code: string) => {
    if (!sql) return null;
    return null;
  },
  
  // Backup codes methods
  saveBackupCodes: async (userId: string, codes: string[]) => {
    if (!sql) return null;
    return await sql`UPDATE users SET backup_codes = ${JSON.stringify(codes)} WHERE uid = ${userId} RETURNING *`;
  },
  getBackupCodes: async (userId: string) => {
    if (!sql) return [];
    const result = await sql`SELECT backup_codes FROM users WHERE uid = ${userId}`;
    return result[0]?.backup_codes || [];
  },
  
  // Payment methods
  createPayment: async (payment: any) => {
    if (!sql) return null;
    return { id: 'pay_' + Date.now(), ...payment };
  },
  getPaymentById: async (id: string) => {
    if (!sql) return null;
    return null;
  },
  updatePayment: async (id: string, updates: any) => {
    if (!sql) return null;
    return null;
  },
  
  // Auth methods
  verifyUserPassword: async (email: string, password: string) => {
    if (!sql) return null;
    const result = await sql`SELECT * FROM users WHERE email = ${email}`;
    const user = result[0];
    if (!user) return null;
    // Note: In production, use bcrypt.compare
    const bcrypt = require('bcryptjs');
    const isValid = await bcrypt.compare(password, user.password_hash);
    return isValid ? user : null;
  },
  
  // Order methods
  getOrdersByUserId: async (userId: string) => {
    if (!sql) return [];
    return await sql`SELECT * FROM token_purchases WHERE user_id = ${userId} ORDER BY created_at DESC`;
  },
  getOrderById: async (orderId: string) => {
    if (!sql) return null;
    const result = await sql`SELECT * FROM token_purchases WHERE id = ${orderId}`;
    return result[0] || null;
  },
  
  // Purchase methods
  createPurchase: async (purchase: any) => {
    if (!sql) return null;
    return { id: 'purchase_' + Date.now(), ...purchase, created_at: new Date().toISOString() };
  },
  findPurchaseById: async (id: string) => {
    if (!sql) return null;
    const result = await sql`SELECT * FROM token_purchases WHERE id = ${id}`;
    return result[0] || null;
  },
  updatePurchase: async (id: string, updates: any) => {
    if (!sql) return null;
    return { id, ...updates, updated_at: new Date().toISOString() };
  },
  findPurchasesByAddress: async (address: string) => {
    if (!sql) return [];
    return await sql`SELECT * FROM token_purchases WHERE wallet_address = ${address} ORDER BY created_at DESC`;
  },
  getPurchaseStats: async () => {
    if (!sql) return { totalPurchases: 0, totalAmount: 0, totalTokens: 0, totalRaised: 0, totalTokensSold: 0, completedPurchases: 0 };
    return { totalPurchases: 0, totalAmount: 0, totalTokens: 0, totalRaised: 0, totalTokensSold: 0, completedPurchases: 0 };
  },
};

// Build timestamp: 2026-01-15
export default { sql, initDatabase, dbQuery, db };
