# 手动数据库迁移 SQL

由于 `post_reports` 表不存在导致自动迁移失败，这里提供手动 SQL 脚本。

## 在 Vercel Postgres 控制台执行以下 SQL

### 1. 创建 moderators 表

```sql
CREATE TABLE IF NOT EXISTS moderators (
  id SERIAL PRIMARY KEY,
  user_id VARCHAR(255) NOT NULL UNIQUE,
  role VARCHAR(50) NOT NULL,
  category_id INTEGER,
  permissions JSONB,
  appointed_by VARCHAR(255),
  appointed_at TIMESTAMP DEFAULT NOW(),
  removed_at TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_moderators_user_id ON moderators(user_id);
CREATE INDEX IF NOT EXISTS idx_moderators_category_id ON moderators(category_id);
CREATE INDEX IF NOT EXISTS idx_moderators_role ON moderators(role);
```

### 2. 创建 mod_actions 表

```sql
CREATE TABLE IF NOT EXISTS mod_actions (
  id SERIAL PRIMARY KEY,
  moderator_id VARCHAR(255) NOT NULL,
  action_type VARCHAR(50) NOT NULL,
  target_type VARCHAR(50) NOT NULL,
  target_id VARCHAR(255) NOT NULL,
  reason TEXT,
  details JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_mod_actions_moderator ON mod_actions(moderator_id);
CREATE INDEX IF NOT EXISTS idx_mod_actions_type ON mod_actions(action_type);
CREATE INDEX IF NOT EXISTS idx_mod_actions_target ON mod_actions(target_type, target_id);
CREATE INDEX IF NOT EXISTS idx_mod_actions_created_at ON mod_actions(created_at);
```

### 3. 创建 user_bans 表

```sql
CREATE TABLE IF NOT EXISTS user_bans (
  id SERIAL PRIMARY KEY,
  user_id VARCHAR(255) NOT NULL,
  ban_type VARCHAR(50) NOT NULL,
  reason TEXT,
  banned_by VARCHAR(255) NOT NULL,
  banned_at TIMESTAMP DEFAULT NOW(),
  expires_at TIMESTAMP,
  is_active BOOLEAN DEFAULT TRUE
);

CREATE INDEX IF NOT EXISTS idx_user_bans_user_id ON user_bans(user_id);
CREATE INDEX IF NOT EXISTS idx_user_bans_is_active ON user_bans(is_active);
CREATE INDEX IF NOT EXISTS idx_user_bans_expires_at ON user_bans(expires_at);
```

### 4. 添加字段到 posts 表

```sql
ALTER TABLE posts 
ADD COLUMN IF NOT EXISTS is_pinned BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS pin_type VARCHAR(50),
ADD COLUMN IF NOT EXISTS pinned_at TIMESTAMP,
ADD COLUMN IF NOT EXISTS pinned_by VARCHAR(255),
ADD COLUMN IF NOT EXISTS is_locked BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS locked_by VARCHAR(255),
ADD COLUMN IF NOT EXISTS locked_at TIMESTAMP,
ADD COLUMN IF NOT EXISTS mod_note TEXT;

CREATE INDEX IF NOT EXISTS idx_posts_is_pinned ON posts(is_pinned);
CREATE INDEX IF NOT EXISTS idx_posts_is_locked ON posts(is_locked);
```

### 5. 添加测试管理员

```sql
INSERT INTO moderators (user_id, role, appointed_by, appointed_at)
VALUES ('aurum51668@outlook.com', 'admin', 'system', NOW())
ON CONFLICT (user_id) DO UPDATE 
SET role = 'admin', removed_at = NULL;
```

## 如何访问 Vercel Postgres 控制台

1. 访问 https://vercel.com/quantumarutums-projects/frontend/stores
2. 点击 `quantaureum_db` 数据库
3. 点击 "Query" 或 "Data" 标签
4. 在 SQL 编辑器中粘贴并执行上述 SQL

## 验证迁移

执行完成后，运行以下查询验证：

```sql
-- 检查表是否创建成功
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('moderators', 'mod_actions', 'user_bans');

-- 检查管理员是否添加成功
SELECT * FROM moderators WHERE user_id = 'aurum51668@outlook.com';

-- 检查 posts 表新字段
SELECT column_name FROM information_schema.columns 
WHERE table_name = 'posts' 
AND column_name IN ('is_pinned', 'is_locked', 'mod_note');
```
