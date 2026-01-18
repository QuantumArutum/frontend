-- ========================================
-- Quantaureum 社区论坛数据库性能优化
-- ========================================
-- 创建日期: 2026-01-18
-- 目的: 解决API超时问题，优化查询性能
-- ========================================

-- 1. Posts 表索引优化
-- ========================================

-- 创建状态索引（用于过滤已发布的帖子）
CREATE INDEX IF NOT EXISTS idx_posts_status ON posts(status) WHERE status = 'published';

-- 创建分类索引（用于按分类查询）
CREATE INDEX IF NOT EXISTS idx_posts_category_id ON posts(category_id);

-- 创建用户索引（用于查询用户的帖子）
CREATE INDEX IF NOT EXISTS idx_posts_user_id ON posts(user_id);

-- 创建时间索引（用于按时间排序）
CREATE INDEX IF NOT EXISTS idx_posts_created_at ON posts(created_at DESC);

-- 创建热度分数索引（用于热门帖子查询）
CREATE INDEX IF NOT EXISTS idx_posts_hot_score ON posts(hot_score DESC) WHERE status = 'published';

-- 创建投票分数索引（用于投票排序）
CREATE INDEX IF NOT EXISTS idx_posts_vote_score ON posts(vote_score DESC) WHERE status = 'published';

-- 创建复合索引（状态+创建时间）
CREATE INDEX IF NOT EXISTS idx_posts_status_created ON posts(status, created_at DESC);

-- 创建复合索引（状态+分类+创建时间）
CREATE INDEX IF NOT EXISTS idx_posts_status_category_created ON posts(status, category_id, created_at DESC);

-- 创建全文搜索索引（用于标题和内容搜索）
CREATE INDEX IF NOT EXISTS idx_posts_title_gin ON posts USING gin(to_tsvector('english', title));
CREATE INDEX IF NOT EXISTS idx_posts_content_gin ON posts USING gin(to_tsvector('english', content));


-- 2. Users 表索引优化
-- ========================================

-- 创建用户名索引（用于搜索和查询）
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);

-- 创建邮箱索引（用于登录和查询）
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- 创建UID索引（用于关联查询）
CREATE INDEX IF NOT EXISTS idx_users_uid ON users(uid);

-- 创建状态索引（用于过滤活跃用户）
CREATE INDEX IF NOT EXISTS idx_users_status ON users(status);


-- 3. Categories 表索引优化
-- ========================================

-- 创建slug索引（用于URL查询）
CREATE INDEX IF NOT EXISTS idx_categories_slug ON categories(slug);

-- 创建活跃状态索引
CREATE INDEX IF NOT EXISTS idx_categories_is_active ON categories(is_active) WHERE is_active = true;

-- 创建排序索引
CREATE INDEX IF NOT EXISTS idx_categories_sort_order ON categories(sort_order);


-- 4. Comments 表索引优化
-- ========================================

-- 创建帖子ID索引（用于查询帖子的评论）
CREATE INDEX IF NOT EXISTS idx_comments_post_id ON comments(post_id);

-- 创建用户ID索引（用于查询用户的评论）
CREATE INDEX IF NOT EXISTS idx_comments_user_id ON comments(user_id);

-- 创建父评论索引（用于嵌套评论）
CREATE INDEX IF NOT EXISTS idx_comments_parent_id ON comments(parent_id);

-- 创建时间索引（用于排序）
CREATE INDEX IF NOT EXISTS idx_comments_created_at ON comments(created_at DESC);

-- 创建复合索引（帖子+时间）
CREATE INDEX IF NOT EXISTS idx_comments_post_created ON comments(post_id, created_at DESC);


-- 5. Tags 表索引优化
-- ========================================

-- 创建标签名索引（用于搜索）
CREATE INDEX IF NOT EXISTS idx_tags_name ON tags(name);

-- 创建slug索引（用于URL查询）
CREATE INDEX IF NOT EXISTS idx_tags_slug ON tags(slug);

-- 创建使用次数索引（用于热门标签）
CREATE INDEX IF NOT EXISTS idx_tags_use_count ON tags(use_count DESC);

-- 创建全文搜索索引
CREATE INDEX IF NOT EXISTS idx_tags_name_gin ON tags USING gin(to_tsvector('english', name));


-- 6. Post_Tags 表索引优化
-- ========================================

-- 创建帖子ID索引
CREATE INDEX IF NOT EXISTS idx_post_tags_post_id ON post_tags(post_id);

-- 创建标签ID索引
CREATE INDEX IF NOT EXISTS idx_post_tags_tag_id ON post_tags(tag_id);

-- 创建复合唯一索引（防止重复）
CREATE UNIQUE INDEX IF NOT EXISTS idx_post_tags_unique ON post_tags(post_id, tag_id);


-- 7. Post_Likes 表索引优化
-- ========================================

-- 创建帖子ID索引
CREATE INDEX IF NOT EXISTS idx_post_likes_post_id ON post_likes(post_id);

-- 创建用户ID索引
CREATE INDEX IF NOT EXISTS idx_post_likes_user_id ON post_likes(user_id);

-- 创建复合唯一索引
CREATE UNIQUE INDEX IF NOT EXISTS idx_post_likes_unique ON post_likes(post_id, user_id);


-- 8. Comment_Likes 表索引优化
-- ========================================

-- 创建评论ID索引
CREATE INDEX IF NOT EXISTS idx_comment_likes_comment_id ON comment_likes(comment_id);

-- 创建用户ID索引
CREATE INDEX IF NOT EXISTS idx_comment_likes_user_id ON comment_likes(user_id);

-- 创建复合唯一索引
CREATE UNIQUE INDEX IF NOT EXISTS idx_comment_likes_unique ON comment_likes(comment_id, user_id);


-- 9. Conversations 表索引优化
-- ========================================

-- 创建参与者索引
CREATE INDEX IF NOT EXISTS idx_conversations_participant1 ON conversations(participant1_id);
CREATE INDEX IF NOT EXISTS idx_conversations_participant2 ON conversations(participant2_id);

-- 创建更新时间索引
CREATE INDEX IF NOT EXISTS idx_conversations_updated_at ON conversations(updated_at DESC);


-- 10. Private_Messages 表索引优化
-- ========================================

-- 创建会话ID索引
CREATE INDEX IF NOT EXISTS idx_private_messages_conversation_id ON private_messages(conversation_id);

-- 创建发送者索引
CREATE INDEX IF NOT EXISTS idx_private_messages_sender_id ON private_messages(sender_id);

-- 创建接收者索引
CREATE INDEX IF NOT EXISTS idx_private_messages_receiver_id ON private_messages(receiver_id);

-- 创建时间索引
CREATE INDEX IF NOT EXISTS idx_private_messages_created_at ON private_messages(created_at DESC);

-- 创建未读消息索引
CREATE INDEX IF NOT EXISTS idx_private_messages_unread ON private_messages(receiver_id, is_read) WHERE is_read = false;


-- ========================================
-- 数据库统计信息更新
-- ========================================

-- 更新所有表的统计信息以优化查询计划
ANALYZE posts;
ANALYZE users;
ANALYZE categories;
ANALYZE comments;
ANALYZE tags;
ANALYZE post_tags;
ANALYZE post_likes;
ANALYZE comment_likes;
ANALYZE conversations;
ANALYZE private_messages;


-- ========================================
-- 查询性能监控视图
-- ========================================

-- 创建慢查询监控视图
CREATE OR REPLACE VIEW slow_queries AS
SELECT 
  query,
  calls,
  total_time,
  mean_time,
  max_time
FROM pg_stat_statements
WHERE mean_time > 100
ORDER BY mean_time DESC
LIMIT 20;


-- ========================================
-- 表大小监控视图
-- ========================================

CREATE OR REPLACE VIEW table_sizes AS
SELECT 
  schemaname,
  tablename,
  pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size,
  pg_total_relation_size(schemaname||'.'||tablename) AS size_bytes
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY size_bytes DESC;


-- ========================================
-- 索引使用情况监控视图
-- ========================================

CREATE OR REPLACE VIEW index_usage AS
SELECT 
  schemaname,
  tablename,
  indexname,
  idx_scan as index_scans,
  idx_tup_read as tuples_read,
  idx_tup_fetch as tuples_fetched
FROM pg_stat_user_indexes
ORDER BY idx_scan DESC;


-- ========================================
-- 完成提示
-- ========================================

-- 执行以下命令查看优化结果：
-- SELECT * FROM slow_queries;
-- SELECT * FROM table_sizes;
-- SELECT * FROM index_usage;

-- 注意事项：
-- 1. 索引会占用额外的存储空间
-- 2. 索引会略微降低写入性能
-- 3. 定期运行 VACUUM ANALYZE 以保持性能
-- 4. 监控索引使用情况，删除未使用的索引

COMMIT;
