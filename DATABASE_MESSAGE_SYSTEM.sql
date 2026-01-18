-- Phase 14: 私信系统数据库迁移脚本
-- 创建时间: 2026-01-18
-- 说明: 创建完整的私信系统数据库架构

-- ============================================
-- 1. 私信表
-- ============================================

CREATE TABLE IF NOT EXISTS direct_messages (
  id SERIAL PRIMARY KEY,
  sender_id VARCHAR(50) NOT NULL,
  receiver_id VARCHAR(50) NOT NULL,
  content TEXT NOT NULL,
  message_type VARCHAR(20) DEFAULT 'text', -- text, image, link
  is_read BOOLEAN DEFAULT FALSE,
  read_at TIMESTAMP,
  is_deleted_by_sender BOOLEAN DEFAULT FALSE,
  is_deleted_by_receiver BOOLEAN DEFAULT FALSE,
  is_edited BOOLEAN DEFAULT FALSE,
  edited_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 创建索引
CREATE INDEX IF NOT EXISTS idx_dm_sender ON direct_messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_dm_receiver ON direct_messages(receiver_id);
CREATE INDEX IF NOT EXISTS idx_dm_created ON direct_messages(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_dm_read ON direct_messages(is_read);
CREATE INDEX IF NOT EXISTS idx_dm_conversation ON direct_messages(sender_id, receiver_id, created_at DESC);

-- ============================================
-- 2. 会话表
-- ============================================

CREATE TABLE IF NOT EXISTS conversations (
  id SERIAL PRIMARY KEY,
  user1_id VARCHAR(50) NOT NULL,
  user2_id VARCHAR(50) NOT NULL,
  last_message_id INTEGER REFERENCES direct_messages(id) ON DELETE SET NULL,
  last_message_at TIMESTAMP,
  last_message_content TEXT,
  user1_unread_count INTEGER DEFAULT 0,
  user2_unread_count INTEGER DEFAULT 0,
  user1_archived BOOLEAN DEFAULT FALSE,
  user2_archived BOOLEAN DEFAULT FALSE,
  user1_pinned BOOLEAN DEFAULT FALSE,
  user2_pinned BOOLEAN DEFAULT FALSE,
  user1_deleted BOOLEAN DEFAULT FALSE,
  user2_deleted BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT unique_conversation UNIQUE(user1_id, user2_id),
  CONSTRAINT check_different_users CHECK (user1_id < user2_id)
);

-- 创建索引
CREATE INDEX IF NOT EXISTS idx_conv_user1 ON conversations(user1_id);
CREATE INDEX IF NOT EXISTS idx_conv_user2 ON conversations(user2_id);
CREATE INDEX IF NOT EXISTS idx_conv_last_message ON conversations(last_message_at DESC);
CREATE INDEX IF NOT EXISTS idx_conv_users ON conversations(user1_id, user2_id);

-- ============================================
-- 3. 消息通知表
-- ============================================

CREATE TABLE IF NOT EXISTS message_notifications (
  id SERIAL PRIMARY KEY,
  user_id VARCHAR(50) NOT NULL,
  message_id INTEGER REFERENCES direct_messages(id) ON DELETE CASCADE,
  sender_id VARCHAR(50) NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 创建索引
CREATE INDEX IF NOT EXISTS idx_msg_notif_user ON message_notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_msg_notif_read ON message_notifications(is_read);
CREATE INDEX IF NOT EXISTS idx_msg_notif_created ON message_notifications(created_at DESC);

-- ============================================
-- 4. 黑名单表
-- ============================================

CREATE TABLE IF NOT EXISTS message_blacklist (
  id SERIAL PRIMARY KEY,
  user_id VARCHAR(50) NOT NULL,
  blocked_user_id VARCHAR(50) NOT NULL,
  reason TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, blocked_user_id)
);

-- 创建索引
CREATE INDEX IF NOT EXISTS idx_blacklist_user ON message_blacklist(user_id);
CREATE INDEX IF NOT EXISTS idx_blacklist_blocked ON message_blacklist(blocked_user_id);

-- ============================================
-- 5. 创建触发器函数
-- ============================================

-- 更新会话的最后消息
CREATE OR REPLACE FUNCTION update_conversation_last_message()
RETURNS TRIGGER AS $$
DECLARE
  v_user1_id VARCHAR(50);
  v_user2_id VARCHAR(50);
  v_conversation_id INTEGER;
BEGIN
  -- 确定 user1 和 user2（user1 < user2）
  IF NEW.sender_id < NEW.receiver_id THEN
    v_user1_id := NEW.sender_id;
    v_user2_id := NEW.receiver_id;
  ELSE
    v_user1_id := NEW.receiver_id;
    v_user2_id := NEW.sender_id;
  END IF;

  -- 查找或创建会话
  INSERT INTO conversations (user1_id, user2_id, last_message_id, last_message_at, last_message_content)
  VALUES (v_user1_id, v_user2_id, NEW.id, NEW.created_at, NEW.content)
  ON CONFLICT (user1_id, user2_id) 
  DO UPDATE SET
    last_message_id = NEW.id,
    last_message_at = NEW.created_at,
    last_message_content = NEW.content,
    updated_at = CURRENT_TIMESTAMP
  RETURNING id INTO v_conversation_id;

  -- 更新未读数量
  IF NEW.sender_id = v_user1_id THEN
    UPDATE conversations 
    SET user2_unread_count = user2_unread_count + 1
    WHERE id = v_conversation_id;
  ELSE
    UPDATE conversations 
    SET user1_unread_count = user1_unread_count + 1
    WHERE id = v_conversation_id;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 创建触发器
DROP TRIGGER IF EXISTS trigger_update_conversation ON direct_messages;
CREATE TRIGGER trigger_update_conversation
  AFTER INSERT ON direct_messages
  FOR EACH ROW
  EXECUTE FUNCTION update_conversation_last_message();

-- 更新消息的 updated_at
CREATE OR REPLACE FUNCTION update_message_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 创建触发器
DROP TRIGGER IF EXISTS trigger_update_message_updated_at ON direct_messages;
CREATE TRIGGER trigger_update_message_updated_at
  BEFORE UPDATE ON direct_messages
  FOR EACH ROW
  EXECUTE FUNCTION update_message_updated_at();

-- 标记消息已读时更新未读数量
CREATE OR REPLACE FUNCTION update_unread_count_on_read()
RETURNS TRIGGER AS $$
DECLARE
  v_user1_id VARCHAR(50);
  v_user2_id VARCHAR(50);
BEGIN
  IF NEW.is_read = TRUE AND OLD.is_read = FALSE THEN
    -- 确定 user1 和 user2
    IF NEW.sender_id < NEW.receiver_id THEN
      v_user1_id := NEW.sender_id;
      v_user2_id := NEW.receiver_id;
    ELSE
      v_user1_id := NEW.receiver_id;
      v_user2_id := NEW.sender_id;
    END IF;

    -- 减少接收者的未读数量
    IF NEW.receiver_id = v_user1_id THEN
      UPDATE conversations 
      SET user1_unread_count = GREATEST(user1_unread_count - 1, 0)
      WHERE user1_id = v_user1_id AND user2_id = v_user2_id;
    ELSE
      UPDATE conversations 
      SET user2_unread_count = GREATEST(user2_unread_count - 1, 0)
      WHERE user1_id = v_user1_id AND user2_id = v_user2_id;
    END IF;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 创建触发器
DROP TRIGGER IF EXISTS trigger_update_unread_count ON direct_messages;
CREATE TRIGGER trigger_update_unread_count
  AFTER UPDATE OF is_read ON direct_messages
  FOR EACH ROW
  EXECUTE FUNCTION update_unread_count_on_read();

-- ============================================
-- 6. 创建视图
-- ============================================

-- 用户会话视图（包含对方用户信息）
CREATE OR REPLACE VIEW user_conversations AS
SELECT 
  c.id,
  c.user1_id,
  c.user2_id,
  c.last_message_id,
  c.last_message_at,
  c.last_message_content,
  c.user1_unread_count,
  c.user2_unread_count,
  c.user1_archived,
  c.user2_archived,
  c.user1_pinned,
  c.user2_pinned,
  c.created_at,
  c.updated_at
FROM conversations c;

-- ============================================
-- 7. 创建辅助函数
-- ============================================

-- 获取用户的会话列表
CREATE OR REPLACE FUNCTION get_user_conversations(
  p_user_id VARCHAR(50),
  p_limit INTEGER DEFAULT 20,
  p_offset INTEGER DEFAULT 0,
  p_archived BOOLEAN DEFAULT FALSE
) RETURNS TABLE (
  conversation_id INTEGER,
  other_user_id VARCHAR(50),
  last_message_content TEXT,
  last_message_at TIMESTAMP,
  unread_count INTEGER,
  is_pinned BOOLEAN,
  is_archived BOOLEAN
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    c.id as conversation_id,
    CASE 
      WHEN c.user1_id = p_user_id THEN c.user2_id
      ELSE c.user1_id
    END as other_user_id,
    c.last_message_content,
    c.last_message_at,
    CASE 
      WHEN c.user1_id = p_user_id THEN c.user1_unread_count
      ELSE c.user2_unread_count
    END as unread_count,
    CASE 
      WHEN c.user1_id = p_user_id THEN c.user1_pinned
      ELSE c.user2_pinned
    END as is_pinned,
    CASE 
      WHEN c.user1_id = p_user_id THEN c.user1_archived
      ELSE c.user2_archived
    END as is_archived
  FROM conversations c
  WHERE (c.user1_id = p_user_id OR c.user2_id = p_user_id)
    AND CASE 
      WHEN c.user1_id = p_user_id THEN c.user1_archived = p_archived AND c.user1_deleted = FALSE
      ELSE c.user2_archived = p_archived AND c.user2_deleted = FALSE
    END
  ORDER BY 
    is_pinned DESC,
    c.last_message_at DESC NULLS LAST
  LIMIT p_limit OFFSET p_offset;
END;
$$ LANGUAGE plpgsql;

-- 获取两个用户之间的消息
CREATE OR REPLACE FUNCTION get_conversation_messages(
  p_user1_id VARCHAR(50),
  p_user2_id VARCHAR(50),
  p_limit INTEGER DEFAULT 50,
  p_before_id INTEGER DEFAULT NULL
) RETURNS TABLE (
  id INTEGER,
  sender_id VARCHAR(50),
  receiver_id VARCHAR(50),
  content TEXT,
  message_type VARCHAR(20),
  is_read BOOLEAN,
  read_at TIMESTAMP,
  is_edited BOOLEAN,
  created_at TIMESTAMP
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    dm.id,
    dm.sender_id,
    dm.receiver_id,
    dm.content,
    dm.message_type,
    dm.is_read,
    dm.read_at,
    dm.is_edited,
    dm.created_at
  FROM direct_messages dm
  WHERE (
    (dm.sender_id = p_user1_id AND dm.receiver_id = p_user2_id AND dm.is_deleted_by_sender = FALSE)
    OR
    (dm.sender_id = p_user2_id AND dm.receiver_id = p_user1_id AND dm.is_deleted_by_receiver = FALSE)
  )
  AND (p_before_id IS NULL OR dm.id < p_before_id)
  ORDER BY dm.created_at DESC
  LIMIT p_limit;
END;
$$ LANGUAGE plpgsql;

-- 标记会话消息为已读
CREATE OR REPLACE FUNCTION mark_conversation_as_read(
  p_user_id VARCHAR(50),
  p_other_user_id VARCHAR(50)
) RETURNS INTEGER AS $$
DECLARE
  v_count INTEGER;
BEGIN
  UPDATE direct_messages
  SET is_read = TRUE, read_at = CURRENT_TIMESTAMP
  WHERE receiver_id = p_user_id 
    AND sender_id = p_other_user_id
    AND is_read = FALSE
    AND is_deleted_by_receiver = FALSE;
  
  GET DIAGNOSTICS v_count = ROW_COUNT;
  RETURN v_count;
END;
$$ LANGUAGE plpgsql;

-- 检查用户是否被拉黑
CREATE OR REPLACE FUNCTION is_user_blocked(
  p_user_id VARCHAR(50),
  p_other_user_id VARCHAR(50)
) RETURNS BOOLEAN AS $$
DECLARE
  v_blocked BOOLEAN;
BEGIN
  SELECT EXISTS(
    SELECT 1 FROM message_blacklist
    WHERE user_id = p_other_user_id AND blocked_user_id = p_user_id
  ) INTO v_blocked;
  
  RETURN v_blocked;
END;
$$ LANGUAGE plpgsql;

-- 获取用户未读消息总数
CREATE OR REPLACE FUNCTION get_user_unread_count(
  p_user_id VARCHAR(50)
) RETURNS INTEGER AS $$
DECLARE
  v_count INTEGER;
BEGIN
  SELECT COALESCE(SUM(
    CASE 
      WHEN c.user1_id = p_user_id THEN c.user1_unread_count
      ELSE c.user2_unread_count
    END
  ), 0)
  INTO v_count
  FROM conversations c
  WHERE (c.user1_id = p_user_id OR c.user2_id = p_user_id)
    AND CASE 
      WHEN c.user1_id = p_user_id THEN c.user1_deleted = FALSE
      ELSE c.user2_deleted = FALSE
    END;
  
  RETURN v_count;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- 8. 数据完整性约束
-- ============================================

-- 确保消息内容不为空
ALTER TABLE direct_messages ADD CONSTRAINT check_content_not_empty 
  CHECK (LENGTH(TRIM(content)) > 0);

-- 确保发送者和接收者不同
ALTER TABLE direct_messages ADD CONSTRAINT check_different_users_dm 
  CHECK (sender_id != receiver_id);

-- 确保消息类型有效
ALTER TABLE direct_messages ADD CONSTRAINT check_message_type 
  CHECK (message_type IN ('text', 'image', 'link'));

-- ============================================
-- 9. 性能优化
-- ============================================

-- 创建复合索引优化查询
CREATE INDEX IF NOT EXISTS idx_dm_conversation_unread 
  ON direct_messages(receiver_id, sender_id, is_read, created_at DESC)
  WHERE is_read = FALSE;

CREATE INDEX IF NOT EXISTS idx_conv_user_last_message 
  ON conversations(user1_id, user2_id, last_message_at DESC);

-- ============================================
-- 完成
-- ============================================

-- 显示迁移统计
SELECT 
  'Direct Messages' as table_name,
  COUNT(*) as total_records
FROM direct_messages
UNION ALL
SELECT 
  'Conversations' as table_name,
  COUNT(*) as total_records
FROM conversations
UNION ALL
SELECT 
  'Message Notifications' as table_name,
  COUNT(*) as total_records
FROM message_notifications
UNION ALL
SELECT 
  'Message Blacklist' as table_name,
  COUNT(*) as total_records
FROM message_blacklist;

-- 迁移完成提示
SELECT '✅ 私信系统数据库迁移完成！' as status;
