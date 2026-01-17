-- ============================================
-- Phase 11 数据库修复脚本
-- 执行时间: 2026-01-18
-- 目的: 修复版主系统的数据库问题
-- ============================================

-- 1. 移除 user_bans 表的外键约束
-- 这样可以使用 email 作为用户标识，而不需要引用 users 表
ALTER TABLE user_bans DROP CONSTRAINT IF EXISTS user_bans_user_id_fkey;
ALTER TABLE user_bans DROP CONSTRAINT IF EXISTS user_bans_banned_by_fkey;

-- 2. 创建 forum_categories 表
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
);

-- 3. 插入默认论坛分类
INSERT INTO forum_categories (name, slug, description, icon, color, display_order) VALUES
('综合讨论', 'general', '社区讨论和公告', '💬', '#3b82f6', 1),
('技术交流', 'technology', '开发和技术话题', '💻', '#8b5cf6', 2),
('DeFi & 交易', 'trading', '去中心化金融讨论', '💰', '#10b981', 3),
('治理提案', 'governance', '社区治理和投票', '🏛️', '#f59e0b', 4)
ON CONFLICT (slug) DO NOTHING;

-- 4. 为 posts 表添加 category_id 字段（如果不存在）
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'posts' AND column_name = 'category_id'
  ) THEN
    ALTER TABLE posts ADD COLUMN category_id INTEGER REFERENCES forum_categories(id);
  END IF;
END $$;

-- 5. 更新现有帖子的分类（默认为综合讨论）
UPDATE posts 
SET category_id = (SELECT id FROM forum_categories WHERE slug = 'general' LIMIT 1)
WHERE category_id IS NULL;

-- 6. 创建索引以提高查询性能
CREATE INDEX IF NOT EXISTS idx_posts_category_id ON posts(category_id);
CREATE INDEX IF NOT EXISTS idx_forum_categories_slug ON forum_categories(slug);
CREATE INDEX IF NOT EXISTS idx_forum_categories_active ON forum_categories(is_active);

-- 7. 更新 moderators 表，确保管理员有所有权限
UPDATE moderators 
SET permissions = ARRAY[
  'pin_post', 'delete_post', 'lock_post', 'move_post', 'edit_post',
  'delete_comment', 'edit_comment',
  'mute_user', 'ban_user', 'view_user_history',
  'view_reports', 'handle_reports',
  'view_queue', 'review_content',
  'manage_moderators', 'view_logs'
]
WHERE role = 'admin';

-- 8. 验证数据
SELECT 'forum_categories 表记录数:' as info, COUNT(*) as count FROM forum_categories;
SELECT 'moderators 表记录数:' as info, COUNT(*) as count FROM moderators;
SELECT '管理员权限数:' as info, array_length(permissions, 1) as count FROM moderators WHERE role = 'admin' LIMIT 1;

-- 完成
SELECT '✅ 数据库修复完成！' as status;
