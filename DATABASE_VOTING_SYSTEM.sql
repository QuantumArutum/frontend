-- Phase 12: 投票系统数据库迁移脚本
-- 创建时间: 2026-01-18
-- 说明: 扩展现有表以支持完整的投票系统

-- ============================================
-- 1. 扩展 posts 表
-- ============================================

-- 添加投票相关字段
ALTER TABLE posts 
  ADD COLUMN IF NOT EXISTS upvote_count INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS downvote_count INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS vote_score INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS hot_score DECIMAL(10,2) DEFAULT 0,
  ADD COLUMN IF NOT EXISTS controversy_score DECIMAL(5,2) DEFAULT 0,
  ADD COLUMN IF NOT EXISTS is_controversial BOOLEAN DEFAULT FALSE;

-- 创建投票相关索引
CREATE INDEX IF NOT EXISTS idx_posts_vote_score ON posts(vote_score DESC);
CREATE INDEX IF NOT EXISTS idx_posts_hot_score ON posts(hot_score DESC);
CREATE INDEX IF NOT EXISTS idx_posts_controversial ON posts(is_controversial, controversy_score DESC);
CREATE INDEX IF NOT EXISTS idx_posts_upvote_count ON posts(upvote_count DESC);

-- 迁移现有数据：将 like_count 转换为 upvote_count
UPDATE posts 
SET upvote_count = COALESCE(like_count, 0),
    vote_score = COALESCE(like_count, 0)
WHERE upvote_count = 0;

-- ============================================
-- 2. 扩展 comments 表
-- ============================================

-- 添加投票相关字段
ALTER TABLE comments 
  ADD COLUMN IF NOT EXISTS upvote_count INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS downvote_count INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS vote_score INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS controversy_score DECIMAL(5,2) DEFAULT 0;

-- 创建投票相关索引
CREATE INDEX IF NOT EXISTS idx_comments_vote_score ON comments(vote_score DESC);
CREATE INDEX IF NOT EXISTS idx_comments_upvote_count ON comments(upvote_count DESC);

-- 迁移现有数据：将 like_count 转换为 upvote_count
UPDATE comments 
SET upvote_count = COALESCE(like_count, 0),
    vote_score = COALESCE(like_count, 0)
WHERE upvote_count = 0;

-- ============================================
-- 3. 扩展 post_likes 表为 post_votes
-- ============================================

-- 检查表是否存在，如果不存在则创建
CREATE TABLE IF NOT EXISTS post_likes (
  id SERIAL PRIMARY KEY,
  post_id INTEGER NOT NULL,
  user_id VARCHAR(50) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(post_id, user_id)
);

-- 添加投票类型字段
ALTER TABLE post_likes 
  ADD COLUMN IF NOT EXISTS vote_type VARCHAR(10) DEFAULT 'upvote',
  ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;

-- 创建索引
CREATE INDEX IF NOT EXISTS idx_post_likes_type ON post_likes(vote_type);
CREATE INDEX IF NOT EXISTS idx_post_likes_user_post ON post_likes(user_id, post_id);
CREATE INDEX IF NOT EXISTS idx_post_likes_post ON post_likes(post_id);

-- 更新现有数据为 upvote
UPDATE post_likes SET vote_type = 'upvote' WHERE vote_type IS NULL OR vote_type = '';

-- ============================================
-- 4. 扩展 comment_likes 表为 comment_votes
-- ============================================

-- 检查表是否存在，如果不存在则创建
CREATE TABLE IF NOT EXISTS comment_likes (
  id SERIAL PRIMARY KEY,
  comment_id INTEGER NOT NULL,
  user_id VARCHAR(50) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(comment_id, user_id)
);

-- 添加投票类型字段
ALTER TABLE comment_likes 
  ADD COLUMN IF NOT EXISTS vote_type VARCHAR(10) DEFAULT 'upvote',
  ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;

-- 创建索引
CREATE INDEX IF NOT EXISTS idx_comment_likes_type ON comment_likes(vote_type);
CREATE INDEX IF NOT EXISTS idx_comment_likes_user_comment ON comment_likes(user_id, comment_id);
CREATE INDEX IF NOT EXISTS idx_comment_likes_comment ON comment_likes(comment_id);

-- 更新现有数据为 upvote
UPDATE comment_likes SET vote_type = 'upvote' WHERE vote_type IS NULL OR vote_type = '';

-- ============================================
-- 5. 创建投票历史表（可选，用于审计）
-- ============================================

CREATE TABLE IF NOT EXISTS vote_history (
  id SERIAL PRIMARY KEY,
  user_id VARCHAR(50) NOT NULL,
  target_type VARCHAR(20) NOT NULL,
  target_id INTEGER NOT NULL,
  old_vote VARCHAR(10),
  new_vote VARCHAR(10),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_vote_history_user ON vote_history(user_id);
CREATE INDEX IF NOT EXISTS idx_vote_history_target ON vote_history(target_type, target_id);
CREATE INDEX IF NOT EXISTS idx_vote_history_created ON vote_history(created_at DESC);

-- ============================================
-- 6. 创建热度更新函数
-- ============================================

-- 计算帖子热度分数的函数
CREATE OR REPLACE FUNCTION calculate_post_hot_score(
  p_upvotes INTEGER,
  p_downvotes INTEGER,
  p_created_at TIMESTAMP
) RETURNS DECIMAL(10,2) AS $$
DECLARE
  score INTEGER;
  order_val DECIMAL(10,2);
  sign_val INTEGER;
  seconds BIGINT;
  hours DECIMAL(10,2);
  time_decay DECIMAL(10,2);
BEGIN
  -- 计算净分数
  score := p_upvotes - p_downvotes;
  
  -- 计算数量级
  order_val := LOG(GREATEST(ABS(score), 1));
  
  -- 确定符号
  IF score > 0 THEN
    sign_val := 1;
  ELSIF score < 0 THEN
    sign_val := -1;
  ELSE
    sign_val := 0;
  END IF;
  
  -- 计算时间衰减
  seconds := EXTRACT(EPOCH FROM (NOW() - p_created_at));
  hours := seconds / 3600.0;
  time_decay := hours / 12.0;
  
  -- 返回热度分数
  RETURN sign_val * order_val - time_decay;
END;
$$ LANGUAGE plpgsql;

-- 计算争议分数的函数
CREATE OR REPLACE FUNCTION calculate_controversy_score(
  p_upvotes INTEGER,
  p_downvotes INTEGER
) RETURNS DECIMAL(5,2) AS $$
DECLARE
  total INTEGER;
  balance INTEGER;
  magnitude INTEGER;
BEGIN
  total := p_upvotes + p_downvotes;
  
  IF total = 0 THEN
    RETURN 0;
  END IF;
  
  balance := LEAST(p_upvotes, p_downvotes);
  magnitude := p_upvotes + p_downvotes;
  
  -- 争议分数 = 平衡度 × log(规模)
  RETURN (balance::DECIMAL / total::DECIMAL) * LOG(magnitude + 1);
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- 7. 更新现有帖子的热度和争议分数
-- ============================================

-- 更新所有帖子的热度分数
UPDATE posts 
SET hot_score = calculate_post_hot_score(upvote_count, downvote_count, created_at),
    controversy_score = calculate_controversy_score(upvote_count, downvote_count),
    is_controversial = (calculate_controversy_score(upvote_count, downvote_count) > 0.4)
WHERE hot_score = 0 OR controversy_score = 0;

-- 更新所有评论的争议分数
UPDATE comments 
SET controversy_score = calculate_controversy_score(upvote_count, downvote_count)
WHERE controversy_score = 0;

-- ============================================
-- 8. 创建触发器自动更新热度分数
-- ============================================

-- 创建触发器函数
CREATE OR REPLACE FUNCTION update_post_scores()
RETURNS TRIGGER AS $$
BEGIN
  -- 更新热度分数
  NEW.hot_score := calculate_post_hot_score(NEW.upvote_count, NEW.downvote_count, NEW.created_at);
  
  -- 更新争议分数
  NEW.controversy_score := calculate_controversy_score(NEW.upvote_count, NEW.downvote_count);
  
  -- 更新争议标记
  NEW.is_controversial := (NEW.controversy_score > 0.4);
  
  -- 更新净分数
  NEW.vote_score := NEW.upvote_count - NEW.downvote_count;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 创建触发器
DROP TRIGGER IF EXISTS trigger_update_post_scores ON posts;
CREATE TRIGGER trigger_update_post_scores
  BEFORE UPDATE OF upvote_count, downvote_count ON posts
  FOR EACH ROW
  EXECUTE FUNCTION update_post_scores();

-- 创建评论分数更新触发器函数
CREATE OR REPLACE FUNCTION update_comment_scores()
RETURNS TRIGGER AS $$
BEGIN
  -- 更新争议分数
  NEW.controversy_score := calculate_controversy_score(NEW.upvote_count, NEW.downvote_count);
  
  -- 更新净分数
  NEW.vote_score := NEW.upvote_count - NEW.downvote_count;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 创建触发器
DROP TRIGGER IF EXISTS trigger_update_comment_scores ON comments;
CREATE TRIGGER trigger_update_comment_scores
  BEFORE UPDATE OF upvote_count, downvote_count ON comments
  FOR EACH ROW
  EXECUTE FUNCTION update_comment_scores();

-- ============================================
-- 9. 创建视图方便查询
-- ============================================

-- 热门帖子视图
CREATE OR REPLACE VIEW hot_posts AS
SELECT 
  p.*,
  u.email as author_email,
  c.name as category_name
FROM posts p
LEFT JOIN users u ON p.user_id = u.uid
LEFT JOIN categories c ON p.category_id = c.id
WHERE p.status = 'published'
ORDER BY p.hot_score DESC, p.created_at DESC;

-- 争议帖子视图
CREATE OR REPLACE VIEW controversial_posts AS
SELECT 
  p.*,
  u.email as author_email,
  c.name as category_name
FROM posts p
LEFT JOIN users u ON p.user_id = u.uid
LEFT JOIN categories c ON p.category_id = c.id
WHERE p.is_controversial = TRUE
  AND p.status = 'published'
ORDER BY p.controversy_score DESC, p.created_at DESC;

-- 最佳帖子视图（高分且不争议）
CREATE OR REPLACE VIEW best_posts AS
SELECT 
  p.*,
  u.email as author_email,
  c.name as category_name
FROM posts p
LEFT JOIN users u ON p.user_id = u.uid
LEFT JOIN categories c ON p.category_id = c.id
WHERE p.vote_score > 0
  AND p.is_controversial = FALSE
  AND p.status = 'published'
ORDER BY p.vote_score DESC, p.created_at DESC;

-- ============================================
-- 10. 数据完整性检查
-- ============================================

-- 确保投票数不为负
ALTER TABLE posts ADD CONSTRAINT check_posts_upvote_count CHECK (upvote_count >= 0);
ALTER TABLE posts ADD CONSTRAINT check_posts_downvote_count CHECK (downvote_count >= 0);
ALTER TABLE comments ADD CONSTRAINT check_comments_upvote_count CHECK (upvote_count >= 0);
ALTER TABLE comments ADD CONSTRAINT check_comments_downvote_count CHECK (downvote_count >= 0);

-- ============================================
-- 完成
-- ============================================

-- 显示迁移统计
SELECT 
  'Posts' as table_name,
  COUNT(*) as total_records,
  SUM(upvote_count) as total_upvotes,
  SUM(downvote_count) as total_downvotes,
  COUNT(CASE WHEN is_controversial THEN 1 END) as controversial_count
FROM posts
UNION ALL
SELECT 
  'Comments' as table_name,
  COUNT(*) as total_records,
  SUM(upvote_count) as total_upvotes,
  SUM(downvote_count) as total_downvotes,
  0 as controversial_count
FROM comments;

-- 迁移完成提示
SELECT '✅ 投票系统数据库迁移完成！' as status;
