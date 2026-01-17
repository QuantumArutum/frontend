import { NextRequest, NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';

export async function POST(request: NextRequest) {
  try {
    const databaseUrl = process.env.DATABASE_URL;
    
    if (!databaseUrl) {
      return NextResponse.json({
        success: false,
        message: 'Database not configured'
      }, { status: 500 });
    }

    const sql = neon(databaseUrl);
    const results: any[] = [];

    // 1. 移除 user_bans 表的外键约束
    try {
      await sql`ALTER TABLE user_bans DROP CONSTRAINT IF EXISTS user_bans_user_id_fkey`;
      results.push({ step: 1, action: '移除 user_bans.user_id 外键约束', status: 'success' });
    } catch (error: any) {
      results.push({ step: 1, action: '移除 user_bans.user_id 外键约束', status: 'error', error: error.message });
    }

    try {
      await sql`ALTER TABLE user_bans DROP CONSTRAINT IF EXISTS user_bans_banned_by_fkey`;
      results.push({ step: 2, action: '移除 user_bans.banned_by 外键约束', status: 'success' });
    } catch (error: any) {
      results.push({ step: 2, action: '移除 user_bans.banned_by 外键约束', status: 'error', error: error.message });
    }

    // 2. 创建 forum_categories 表
    try {
      await sql`
        CREATE TABLE IF NOT EXISTS forum_categories (
          id SERIAL PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          slug VARCHAR(255) UNIQUE NOT NULL,
          description TEXT,
          icon VARCHAR(50),
          color VARCHAR(20),
          post_count INTEGER DEFAULT 0,
          display_order INTEGER DEFAULT 0,
          is_active BOOLEAN DEFAULT TRUE,
          created_at TIMESTAMP DEFAULT NOW(),
          updated_at TIMESTAMP DEFAULT NOW()
        )
      `;
      results.push({ step: 3, action: '创建 forum_categories 表', status: 'success' });
    } catch (error: any) {
      results.push({ step: 3, action: '创建 forum_categories 表', status: 'error', error: error.message });
    }

    // 3. 插入默认论坛分类
    try {
      const categories = await sql`
        INSERT INTO forum_categories (name, slug, description, icon, color, display_order) VALUES
        ('综合讨论', 'general', '社区讨论和公告', '💬', '#3b82f6', 1),
        ('技术交流', 'technology', '开发和技术话题', '💻', '#8b5cf6', 2),
        ('DeFi & 交易', 'trading', '去中心化金融讨论', '💰', '#10b981', 3),
        ('治理提案', 'governance', '社区治理和投票', '🏛️', '#f59e0b', 4)
        ON CONFLICT (slug) DO NOTHING
        RETURNING id
      `;
      results.push({ step: 4, action: '插入默认论坛分类', status: 'success', count: categories.length });
    } catch (error: any) {
      results.push({ step: 4, action: '插入默认论坛分类', status: 'error', error: error.message });
    }

    // 4. 为 posts 表添加 category_id 字段
    try {
      await sql`
        DO $$ 
        BEGIN
          IF NOT EXISTS (
            SELECT 1 FROM information_schema.columns 
            WHERE table_name = 'posts' AND column_name = 'category_id'
          ) THEN
            ALTER TABLE posts ADD COLUMN category_id INTEGER REFERENCES forum_categories(id);
          END IF;
        END $$
      `;
      results.push({ step: 5, action: '为 posts 表添加 category_id 字段', status: 'success' });
    } catch (error: any) {
      results.push({ step: 5, action: '为 posts 表添加 category_id 字段', status: 'error', error: error.message });
    }

    // 5. 更新现有帖子的分类
    try {
      const updated = await sql`
        UPDATE posts 
        SET category_id = (SELECT id FROM forum_categories WHERE slug = 'general' LIMIT 1)
        WHERE category_id IS NULL
      `;
      results.push({ step: 6, action: '更新现有帖子的分类', status: 'success', count: updated.length });
    } catch (error: any) {
      results.push({ step: 6, action: '更新现有帖子的分类', status: 'error', error: error.message });
    }

    // 6. 创建索引
    try {
      await sql`CREATE INDEX IF NOT EXISTS idx_posts_category_id ON posts(category_id)`;
      results.push({ step: 7, action: '创建 posts.category_id 索引', status: 'success' });
    } catch (error: any) {
      results.push({ step: 7, action: '创建 posts.category_id 索引', status: 'error', error: error.message });
    }

    try {
      await sql`CREATE INDEX IF NOT EXISTS idx_forum_categories_slug ON forum_categories(slug)`;
      results.push({ step: 8, action: '创建 forum_categories.slug 索引', status: 'success' });
    } catch (error: any) {
      results.push({ step: 8, action: '创建 forum_categories.slug 索引', status: 'error', error: error.message });
    }

    try {
      await sql`CREATE INDEX IF NOT EXISTS idx_forum_categories_active ON forum_categories(is_active)`;
      results.push({ step: 9, action: '创建 forum_categories.is_active 索引', status: 'success' });
    } catch (error: any) {
      results.push({ step: 9, action: '创建 forum_categories.is_active 索引', status: 'error', error: error.message });
    }

    // 7. 更新管理员权限
    try {
      await sql`
        UPDATE moderators 
        SET permissions = ARRAY[
          'pin_post', 'delete_post', 'lock_post', 'move_post', 'edit_post',
          'delete_comment', 'edit_comment',
          'mute_user', 'ban_user', 'view_user_history',
          'view_reports', 'handle_reports',
          'view_queue', 'review_content',
          'manage_moderators', 'view_logs'
        ]
        WHERE role = 'admin'
      `;
      results.push({ step: 10, action: '更新管理员权限', status: 'success' });
    } catch (error: any) {
      results.push({ step: 10, action: '更新管理员权限', status: 'error', error: error.message });
    }

    // 8. 验证数据
    const categoryCount = await sql`SELECT COUNT(*) as count FROM forum_categories`;
    const moderatorCount = await sql`SELECT COUNT(*) as count FROM moderators`;
    const adminPermissions = await sql`
      SELECT array_length(permissions, 1) as count 
      FROM moderators 
      WHERE role = 'admin' 
      LIMIT 1
    `;

    return NextResponse.json({
      success: true,
      message: '数据库修复完成',
      results,
      verification: {
        categoryCount: categoryCount[0]?.count || 0,
        moderatorCount: moderatorCount[0]?.count || 0,
        adminPermissionCount: adminPermissions[0]?.count || 0
      }
    });

  } catch (error: any) {
    console.error('Database fix error:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to fix database',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
