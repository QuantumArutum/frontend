# API 调试总结

## 问题描述
`forum-category-posts` API 持续返回 500 错误

## 已完成的调试步骤

### 1. 数据库连接测试 ✅
- 创建了 `/api/v2/barong/public/community/test-db` API
- 确认数据库连接正常
- 确认表结构：
  - `categories`: id, name, slug, description, sort_order, is_active, created_at
  - `posts`: id, title, content, user_id, category_id, view_count, like_count, comment_count, is_pinned, status, created_at, updated_at

### 2. 修复的问题
- ✅ 移除不存在的 `icon` 和 `color` 字段
- ✅ 移除不存在的 `is_locked` 字段
- ✅ 添加 `is_active` 字段检查
- ✅ 添加 `status = 'published'` 过滤
- ✅ 修复 SQL IN 子句语法

### 3. 当前代码状态
- 提交: bbcfdc0 - "fix: 修复SQL IN子句语法"
- 已推送到 GitHub
- Vercel 已部署

## 可能的问题

### 1. SQL 语法问题
`sql(postIds)` 可能不是正确的语法。应该尝试：
- 使用 `sql.array(postIds)`
- 或者使用 `sql.join(postIds.map(id => sql\`${id}\`), sql\`, \`)`
- 或者简化查询，不使用 IN 子句

### 2. 空结果处理
如果 `posts` 数组为空，后续的统计查询可能会出错

### 3. 数据类型问题
`post_id` 可能是数字类型，需要确保类型匹配

## 建议的解决方案

### 方案 1: 简化查询（推荐）
不查询评论和点赞统计，直接使用 posts 表中的 `comment_count` 和 `like_count` 字段

```typescript
const formattedPosts = posts.map((post: any) => ({
  id: post.id,
  title: post.title,
  author: post.author_email ? post.author_email.split('@')[0] : 'Unknown',
  authorAvatar: post.author_email ? post.author_email[0].toUpperCase() : 'U',
  content: post.content.substring(0, 200) + (post.content.length > 200 ? '...' : ''),
  replies: parseInt(post.comment_count || '0'),
  views: parseInt(post.view_count || '0'),
  likes: parseInt(post.like_count || '0'),
  createdAt: post.created_at,
  lastReply: null,
  lastReplyBy: null,
  isPinned: post.is_pinned || false,
  isLocked: false,
  tags: [],
}));
```

### 方案 2: 逐个查询
为每个帖子单独查询统计数据（性能较差，但更可靠）

### 方案 3: 使用 JOIN
在主查询中使用 LEFT JOIN 获取统计数据

## 下一步行动

1. 实施方案 1（最简单）
2. 测试 API
3. 如果成功，继续测试前端页面
4. 如果失败，查看 Vercel 日志获取详细错误信息

## 测试命令

```bash
# 测试数据库连接
curl https://www.quantaureum.com/api/v2/barong/public/community/test-db

# 测试分类帖子 API
curl https://www.quantaureum.com/api/v2/barong/public/community/forum-category-posts?category=announcements&sortBy=latest&limit=5
```

## Vercel 日志
需要在 Vercel 控制台查看详细的错误日志来确定具体问题
