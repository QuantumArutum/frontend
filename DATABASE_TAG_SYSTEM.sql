-- Phase 13: 标签系统数据库迁移脚本
-- 创建时间: 2026-01-18
-- 说明: 创建完整的标签系统数据库架构

-- ============================================
-- 1. 标签表
-- ============================================

CREATE TABLE IF NOT EXISTS tags (
  id SERIAL PRIMARY KEY,
  name VARCHAR(50) NOT NULL UNIQUE,
  slug VARCHAR(50) NOT NULL UNIQUE,
  description TEXT,
  color VARCHAR(20) DEFAULT '#3b82f6',
  icon VARCHAR(50),
  usage_count INTEGER DEFAULT 0,
  is_official BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 创建索引
CREATE INDEX IF NOT EXISTS idx_tags_name ON tags(name);
CREATE INDEX IF NOT EXISTS idx_tags_slug ON tags(slug);
CREATE INDEX IF NOT EXISTS idx_tags_usage_count ON tags(usage_count DESC);
CREATE INDEX IF NOT EXISTS idx_tags_official ON tags(is_official);
CREATE INDEX IF NOT EXISTS idx_tags_active ON tags(is_active);
CREATE INDEX IF NOT EXISTS idx_tags_created ON tags(created_at DESC);

-- ============================================
-- 2. 帖子标签关联表
-- ============================================

CREATE TABLE IF NOT EXISTS post_tags (
  id SERIAL PRIMARY KEY,
  post_id INTEGER NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  tag_id INTEGER NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(post_id, tag_id)
);

-- 创建索引
CREATE INDEX IF NOT EXISTS idx_post_tags_post ON post_tags(post_id);
CREATE INDEX IF NOT EXISTS idx_post_tags_tag ON post_tags(tag_id);
CREATE INDEX IF NOT EXISTS idx_post_tags_created ON post_tags(created_at DESC);

-- ============================================
-- 3. 用户标签订阅表
-- ============================================

CREATE TABLE IF NOT EXISTS tag_subscriptions (
  id SERIAL PRIMARY KEY,
  user_id VARCHAR(50) NOT NULL,
  tag_id INTEGER NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
  notify_new_posts BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, tag_id)
);

-- 创建索引
CREATE INDEX IF NOT EXISTS idx_tag_subscriptions_user ON tag_subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_tag_subscriptions_tag ON tag_subscriptions(tag_id);

-- ============================================
-- 4. 标签别名表
-- ============================================

CREATE TABLE IF NOT EXISTS tag_aliases (
  id SERIAL PRIMARY KEY,
  alias VARCHAR(50) NOT NULL UNIQUE,
  tag_id INTEGER NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 创建索引
CREATE INDEX IF NOT EXISTS idx_tag_aliases_alias ON tag_aliases(alias);
CREATE INDEX IF NOT EXISTS idx_tag_aliases_tag ON tag_aliases(tag_id);

-- ============================================
-- 5. 标签统计表
-- ============================================

CREATE TABLE IF NOT EXISTS tag_stats (
  id SERIAL PRIMARY KEY,
  tag_id INTEGER NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  post_count INTEGER DEFAULT 0,
  view_count INTEGER DEFAULT 0,
  subscriber_count INTEGER DEFAULT 0,
  UNIQUE(tag_id, date)
);

-- 创建索引
CREATE INDEX IF NOT EXISTS idx_tag_stats_tag ON tag_stats(tag_id);
CREATE INDEX IF NOT EXISTS idx_tag_stats_date ON tag_stats(date DESC);

-- ============================================
-- 6. 创建触发器函数
-- ============================================

-- 更新标签使用次数的触发器函数
CREATE OR REPLACE FUNCTION update_tag_usage_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE tags SET usage_count = usage_count + 1 WHERE id = NEW.tag_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE tags SET usage_count = GREATEST(usage_count - 1, 0) WHERE id = OLD.tag_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- 创建触发器
DROP TRIGGER IF EXISTS trigger_update_tag_usage_count ON post_tags;
CREATE TRIGGER trigger_update_tag_usage_count
  AFTER INSERT OR DELETE ON post_tags
  FOR EACH ROW
  EXECUTE FUNCTION update_tag_usage_count();

-- 更新标签的 updated_at 字段
CREATE OR REPLACE FUNCTION update_tag_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 创建触发器
DROP TRIGGER IF EXISTS trigger_update_tag_updated_at ON tags;
CREATE TRIGGER trigger_update_tag_updated_at
  BEFORE UPDATE ON tags
  FOR EACH ROW
  EXECUTE FUNCTION update_tag_updated_at();

-- ============================================
-- 7. 创建视图
-- ============================================

-- 热门标签视图
CREATE OR REPLACE VIEW trending_tags AS
SELECT 
  t.*,
  COUNT(DISTINCT pt.post_id) as recent_post_count,
  COUNT(DISTINCT ts.user_id) as subscriber_count
FROM tags t
LEFT JOIN post_tags pt ON t.id = pt.tag_id 
  AND pt.created_at >= NOW() - INTERVAL '7 days'
LEFT JOIN tag_subscriptions ts ON t.id = ts.tag_id
WHERE t.is_active = TRUE
GROUP BY t.id
ORDER BY recent_post_count DESC, t.usage_count DESC
LIMIT 50;

-- 官方标签视图
CREATE OR REPLACE VIEW official_tags AS
SELECT * FROM tags
WHERE is_official = TRUE AND is_active = TRUE
ORDER BY usage_count DESC;

-- 标签详情视图（包含统计信息）
CREATE OR REPLACE VIEW tag_details AS
SELECT 
  t.*,
  COUNT(DISTINCT pt.post_id) as total_posts,
  COUNT(DISTINCT ts.user_id) as total_subscribers,
  MAX(pt.created_at) as last_used_at
FROM tags t
LEFT JOIN post_tags pt ON t.id = pt.tag_id
LEFT JOIN tag_subscriptions ts ON t.id = ts.tag_id
WHERE t.is_active = TRUE
GROUP BY t.id;

-- ============================================
-- 8. 插入默认标签
-- ============================================

-- 插入一些常用的官方标签
INSERT INTO tags (name, slug, description, color, icon, is_official) VALUES
('公告', 'announcement', '官方公告和重要通知', '#ef4444', '📢', TRUE),
('教程', 'tutorial', '教程和指南', '#3b82f6', '📚', TRUE),
('问答', 'question', '问题和答疑', '#10b981', '❓', TRUE),
('讨论', 'discussion', '一般讨论', '#8b5cf6', '💬', TRUE),
('分享', 'share', '分享和展示', '#f59e0b', '🎁', TRUE),
('反馈', 'feedback', '反馈和建议', '#ec4899', '💡', TRUE),
('技术', 'tech', '技术相关', '#06b6d4', '💻', TRUE),
('新闻', 'news', '新闻和资讯', '#f97316', '📰', TRUE)
ON CONFLICT (name) DO NOTHING;

-- ============================================
-- 9. 创建辅助函数
-- ============================================

-- 获取或创建标签的函数
CREATE OR REPLACE FUNCTION get_or_create_tag(
  p_name VARCHAR(50),
  p_color VARCHAR(20) DEFAULT '#3b82f6'
) RETURNS INTEGER AS $$
DECLARE
  v_tag_id INTEGER;
  v_slug VARCHAR(50);
BEGIN
  -- 生成 slug（简单版本，实际应该更复杂）
  v_slug := LOWER(REGEXP_REPLACE(p_name, '[^a-zA-Z0-9\u4e00-\u9fa5]', '-', 'g'));
  v_slug := REGEXP_REPLACE(v_slug, '-+', '-', 'g');
  v_slug := TRIM(BOTH '-' FROM v_slug);
  
  -- 尝试获取现有标签
  SELECT id INTO v_tag_id FROM tags WHERE name = p_name;
  
  -- 如果不存在则创建
  IF v_tag_id IS NULL THEN
    INSERT INTO tags (name, slug, color)
    VALUES (p_name, v_slug, p_color)
    RETURNING id INTO v_tag_id;
  END IF;
  
  RETURN v_tag_id;
END;
$$ LANGUAGE plpgsql;

-- 为帖子添加标签的函数
CREATE OR REPLACE FUNCTION add_tags_to_post(
  p_post_id INTEGER,
  p_tag_names TEXT[]
) RETURNS INTEGER AS $$
DECLARE
  v_tag_name TEXT;
  v_tag_id INTEGER;
  v_count INTEGER := 0;
BEGIN
  -- 遍历标签名称
  FOREACH v_tag_name IN ARRAY p_tag_names
  LOOP
    -- 获取或创建标签
    v_tag_id := get_or_create_tag(v_tag_name);
    
    -- 添加关联（如果不存在）
    INSERT INTO post_tags (post_id, tag_id)
    VALUES (p_post_id, v_tag_id)
    ON CONFLICT (post_id, tag_id) DO NOTHING;
    
    v_count := v_count + 1;
  END LOOP;
  
  RETURN v_count;
END;
$$ LANGUAGE plpgsql;

-- 搜索标签的函数
CREATE OR REPLACE FUNCTION search_tags(
  p_query TEXT,
  p_limit INTEGER DEFAULT 10
) RETURNS TABLE (
  id INTEGER,
  name VARCHAR(50),
  slug VARCHAR(50),
  description TEXT,
  color VARCHAR(20),
  usage_count INTEGER,
  is_official BOOLEAN
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    t.id,
    t.name,
    t.slug,
    t.description,
    t.color,
    t.usage_count,
    t.is_official
  FROM tags t
  WHERE t.is_active = TRUE
    AND (
      t.name ILIKE '%' || p_query || '%'
      OR t.description ILIKE '%' || p_query || '%'
      OR EXISTS (
        SELECT 1 FROM tag_aliases ta
        WHERE ta.tag_id = t.id
        AND ta.alias ILIKE '%' || p_query || '%'
      )
    )
  ORDER BY 
    CASE WHEN t.name ILIKE p_query || '%' THEN 1 ELSE 2 END,
    t.usage_count DESC
  LIMIT p_limit;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- 10. 数据完整性约束
-- ============================================

-- 确保标签名称不为空且长度合适
ALTER TABLE tags ADD CONSTRAINT check_tag_name_length 
  CHECK (LENGTH(name) >= 1 AND LENGTH(name) <= 50);

-- 确保 slug 不为空
ALTER TABLE tags ADD CONSTRAINT check_tag_slug_not_empty 
  CHECK (LENGTH(slug) >= 1);

-- 确保使用次数不为负
ALTER TABLE tags ADD CONSTRAINT check_tag_usage_count 
  CHECK (usage_count >= 0);

-- ============================================
-- 11. 迁移现有数据（如果需要）
-- ============================================

-- 如果 posts 表有 tags 字段（JSON 或文本），可以迁移数据
-- 这里假设没有，跳过

-- ============================================
-- 完成
-- ============================================

-- 显示迁移统计
SELECT 
  'Tags' as table_name,
  COUNT(*) as total_records
FROM tags
UNION ALL
SELECT 
  'Post Tags' as table_name,
  COUNT(*) as total_records
FROM post_tags
UNION ALL
SELECT 
  'Tag Subscriptions' as table_name,
  COUNT(*) as total_records
FROM tag_subscriptions;

-- 显示默认标签
SELECT 
  name,
  slug,
  color,
  icon,
  is_official
FROM tags
WHERE is_official = TRUE
ORDER BY name;

-- 迁移完成提示
SELECT '✅ 标签系统数据库迁移完成！' as status;
