# 数据库索引验证和应用指南

**任务**: 任务1.1 - 验证并应用数据库索引  
**日期**: 2026-01-18  
**状态**: 待执行

---

## 📋 前置条件

- ✅ VPN 已连接
- ✅ 有 Vercel 账号访问权限
- ✅ 数据库优化 SQL 文件已准备：`DATABASE_PERFORMANCE_OPTIMIZATION.sql`

---

## 🔍 步骤1: 访问 Vercel Dashboard

1. 打开浏览器，访问：https://vercel.com/dashboard
2. 登录你的 Vercel 账号
3. 找到 Quantaureum Frontend 项目
4. 点击项目进入项目详情页

---

## 🗄️ 步骤2: 进入数据库控制台

1. 在项目页面，点击顶部导航栏的 **"Storage"** 标签
2. 找到 Postgres 数据库实例
3. 点击数据库名称进入数据库详情页
4. 点击 **"Query"** 或 **"Data"** 标签进入 SQL 查询界面

---

## ✅ 步骤3: 验证现有索引

在 SQL 查询界面中，执行以下验证查询：

```sql
-- 检查所有以 idx_ 开头的索引
SELECT
    schemaname,
    tablename,
    indexname,
    indexdef
FROM pg_indexes
WHERE schemaname = 'public'
AND indexname LIKE 'idx_%'
ORDER BY tablename, indexname;
```

### 预期结果

如果索引已存在，你应该看到至少 **40+ 个索引**，包括：

#### Posts 表索引（8个）

- `idx_posts_status`
- `idx_posts_category_id`
- `idx_posts_user_id`
- `idx_posts_created_at`
- `idx_posts_hot_score`
- `idx_posts_vote_score`
- `idx_posts_status_created`
- `idx_posts_status_category_created`

#### Users 表索引（4个）

- `idx_users_username`
- `idx_users_email`
- `idx_users_uid`
- `idx_users_status`

#### Categories 表索引（3个）

- `idx_categories_slug`
- `idx_categories_is_active`
- `idx_categories_sort_order`

#### Comments 表索引（5个）

- `idx_comments_post_id`
- `idx_comments_user_id`
- `idx_comments_parent_id`
- `idx_comments_created_at`
- `idx_comments_post_created`

#### Tags 表索引（4个）

- `idx_tags_name`
- `idx_tags_slug`
- `idx_tags_use_count`
- `idx_tags_name_gin`

#### 其他表索引

- Post_Tags: 3个索引
- Post_Likes: 3个索引
- Comment_Likes: 3个索引
- Conversations: 3个索引
- Private_Messages: 5个索引

---

## 🚀 步骤4: 应用索引（如果不存在）

### 选项A: 通过 Vercel Dashboard 执行

如果验证查询返回的索引少于预期，需要执行优化 SQL：

1. 打开 `DATABASE_PERFORMANCE_OPTIMIZATION.sql` 文件
2. 复制整个文件内容
3. 在 Vercel 数据库查询界面粘贴
4. 点击 **"Run"** 或 **"Execute"** 按钮执行

**注意**：

- SQL 执行可能需要 1-2 分钟
- 使用 `IF NOT EXISTS` 确保不会重复创建
- 所有操作都是幂等的，可以安全重复执行

### 选项B: 通过本地连接执行

如果 Vercel Dashboard 不支持直接执行 SQL，可以使用本地工具：

```bash
# 1. 从 Vercel 获取数据库连接字符串
# 在 Vercel Dashboard > Storage > Postgres > .env.local 中找到 DATABASE_URL

# 2. 使用 psql 连接
psql "你的数据库连接字符串"

# 3. 执行 SQL 文件
\i DATABASE_PERFORMANCE_OPTIMIZATION.sql

# 4. 退出
\q
```

或使用 Node.js 脚本：

```bash
# 在 frontend 目录下执行
node scripts/apply-database-indexes.js
```

---

## 🔄 步骤5: 再次验证索引

执行完 SQL 后，再次运行验证查询：

```sql
SELECT
    schemaname,
    tablename,
    indexname
FROM pg_indexes
WHERE schemaname = 'public'
AND indexname LIKE 'idx_%'
ORDER BY tablename, indexname;
```

### 验证清单

- [ ] 总索引数量 >= 40
- [ ] posts 表有 8+ 个索引
- [ ] users 表有 4 个索引
- [ ] categories 表有 3 个索引
- [ ] comments 表有 5 个索引
- [ ] tags 表有 4 个索引
- [ ] 其他关联表都有相应索引

---

## 📊 步骤6: 检查索引使用情况

执行以下查询查看索引是否被使用：

```sql
-- 查看索引使用统计
SELECT * FROM index_usage ORDER BY index_scans DESC LIMIT 20;

-- 查看表大小
SELECT * FROM table_sizes;

-- 查看慢查询
SELECT * FROM slow_queries;
```

---

## 🧪 步骤7: 性能测试

### 测试查询性能

执行以下测试查询，对比优化前后的性能：

```sql
-- 测试1: 查询已发布的帖子（应该使用 idx_posts_status）
EXPLAIN ANALYZE
SELECT * FROM posts
WHERE status = 'published'
ORDER BY created_at DESC
LIMIT 20;

-- 测试2: 按分类查询帖子（应该使用 idx_posts_status_category_created）
EXPLAIN ANALYZE
SELECT * FROM posts
WHERE status = 'published'
AND category_id = 1
ORDER BY created_at DESC
LIMIT 20;

-- 测试3: 查询热门帖子（应该使用 idx_posts_hot_score）
EXPLAIN ANALYZE
SELECT * FROM posts
WHERE status = 'published'
ORDER BY hot_score DESC
LIMIT 20;

-- 测试4: 查询帖子的评论（应该使用 idx_comments_post_created）
EXPLAIN ANALYZE
SELECT * FROM comments
WHERE post_id = 1
ORDER BY created_at ASC;
```

### 性能指标

优化后，查询时间应该：

- 简单查询：< 10ms
- 复杂查询：< 50ms
- 全文搜索：< 100ms

---

## 📝 步骤8: 创建验证报告

创建一个验证报告文档，记录：

1. **索引验证结果**
   - 总索引数量
   - 各表索引列表
   - 截图证明

2. **性能测试结果**
   - 测试查询的执行时间
   - EXPLAIN ANALYZE 输出
   - 优化前后对比

3. **问题记录**
   - 遇到的任何问题
   - 解决方案
   - 注意事项

---

## 🎯 完成标准

- [x] 已登录 Vercel Dashboard
- [ ] 已进入数据库控制台
- [ ] 已执行验证查询
- [ ] 索引数量 >= 40
- [ ] 所有关键表都有索引
- [ ] 性能测试通过
- [ ] 创建验证报告
- [ ] 更新路线图状态

---

## 🚨 常见问题

### Q1: 无法访问 Vercel Dashboard

**A**: 确保 VPN 已连接，清除浏览器缓存后重试

### Q2: 数据库查询界面找不到

**A**: 在 Storage 标签下，点击数据库名称，然后找到 "Query" 或 "Data" 标签

### Q3: SQL 执行超时

**A**: 索引创建可能需要时间，可以分批执行，每次执行一个表的索引

### Q4: 索引已存在错误

**A**: SQL 使用了 `IF NOT EXISTS`，不会报错。如果报错，说明语法不兼容，需要调整

### Q5: 如何删除错误的索引

**A**: 使用 `DROP INDEX IF EXISTS index_name;`

---

## 📚 参考资料

- [Vercel Postgres 文档](https://vercel.com/docs/storage/vercel-postgres)
- [PostgreSQL 索引文档](https://www.postgresql.org/docs/current/indexes.html)
- [PostgreSQL 性能优化](https://www.postgresql.org/docs/current/performance-tips.html)

---

## 🔗 相关文件

- `DATABASE_PERFORMANCE_OPTIMIZATION.sql` - 索引创建 SQL
- `CRITICAL_FIXES_ROADMAP.md` - 任务路线图
- `.env.local` - 数据库连接配置（本地）

---

**下一步**: 完成验证后，更新 `CRITICAL_FIXES_ROADMAP.md` 中任务1.1的状态为 ✅
