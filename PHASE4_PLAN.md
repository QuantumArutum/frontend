# 第四阶段实施计划 - 帖子详情与基础互动

## 📅 开始日期

2026-01-17

## 🎯 目标

实现帖子详情页、基础评论系统和点赞功能，让用户能够查看完整内容并进行基本互动

---

## 📋 任务清单

### 任务 1: 数据库表设计 ✅

#### 1.1 评论表 (post_comments)

```sql
CREATE TABLE IF NOT EXISTS post_comments (
  id SERIAL PRIMARY KEY,
  post_id INTEGER NOT NULL,
  user_id VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  parent_id INTEGER,  -- 用于多级回复（第四阶段先实现一级评论，parent_id 为 NULL）
  like_count INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  status VARCHAR(50) DEFAULT 'active',  -- active, deleted, hidden
  FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
  FOREIGN KEY (parent_id) REFERENCES post_comments(id) ON DELETE CASCADE
);
```

#### 1.2 点赞表 (post_likes)

```sql
CREATE TABLE IF NOT EXISTS post_likes (
  id SERIAL PRIMARY KEY,
  post_id INTEGER NOT NULL,
  user_id VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(post_id, user_id),
  FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE
);
```

#### 1.3 评论点赞表 (comment_likes)

```sql
CREATE TABLE IF NOT EXISTS comment_likes (
  id SERIAL PRIMARY KEY,
  comment_id INTEGER NOT NULL,
  user_id VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(comment_id, user_id),
  FOREIGN KEY (comment_id) REFERENCES post_comments(id) ON DELETE CASCADE
);
```

---

### 任务 2: API 端点实现

#### 2.1 获取帖子详情 API

- **路径**: `GET /api/v2/barong/public/community/post-detail`
- **参数**: `postId`
- **返回**:
  ```json
  {
    "success": true,
    "data": {
      "id": 1,
      "title": "帖子标题",
      "content": "帖子内容",
      "categoryId": 1,
      "categoryName": "分类名称",
      "categorySlug": "category-slug",
      "userId": "user_123",
      "userName": "用户名",
      "userAvatar": "A",
      "userRole": "member",
      "viewCount": 100,
      "likeCount": 10,
      "commentCount": 5,
      "isPinned": false,
      "isLiked": false,  -- 当前用户是否已点赞
      "createdAt": "2026-01-17T10:00:00Z",
      "updatedAt": "2026-01-17T10:00:00Z"
    }
  }
  ```

#### 2.2 获取评论列表 API

- **路径**: `GET /api/v2/barong/public/community/post-comments`
- **参数**: `postId`, `page`, `limit`
- **返回**:
  ```json
  {
    "success": true,
    "data": {
      "comments": [
        {
          "id": 1,
          "postId": 1,
          "userId": "user_123",
          "userName": "用户名",
          "userAvatar": "A",
          "userRole": "member",
          "content": "评论内容",
          "likeCount": 5,
          "isLiked": false,
          "createdAt": "2026-01-17T10:00:00Z"
        }
      ],
      "total": 10,
      "hasMore": true
    }
  }
  ```

#### 2.3 发表评论 API

- **路径**: `POST /api/v2/barong/public/community/post-comment`
- **参数**:
  ```json
  {
    "postId": 1,
    "currentUserId": "user_123",
    "content": "评论内容"
  }
  ```
- **返回**: 新创建的评论对象
- **需要认证**: ✅

#### 2.4 点赞帖子 API

- **路径**: `POST /api/v2/barong/public/community/like-post`
- **参数**:
  ```json
  {
    "postId": 1,
    "currentUserId": "user_123"
  }
  ```
- **返回**:
  ```json
  {
    "success": true,
    "data": {
      "isLiked": true,
      "likeCount": 11
    }
  }
  ```
- **需要认证**: ✅

#### 2.5 点赞评论 API

- **路径**: `POST /api/v2/barong/public/community/like-comment`
- **参数**:
  ```json
  {
    "commentId": 1,
    "currentUserId": "user_123"
  }
  ```
- **返回**:
  ```json
  {
    "success": true,
    "data": {
      "isLiked": true,
      "likeCount": 6
    }
  }
  ```
- **需要认证**: ✅

---

### 任务 3: 前端实现

#### 3.1 创建帖子详情页

- **路径**: `/community/posts/[postId]/page.tsx`
- **功能**：
  - 显示帖子完整内容
  - 显示作者信息（头像、用户名、角色）
  - 显示统计数据（浏览、点赞、评论数）
  - 点赞按钮（带动画效果）
  - 分享按钮
  - 编辑/删除按钮（仅作者可见）

#### 3.2 评论区组件

- **组件**: `CommentSection.tsx`
- **功能**：
  - 评论列表展示
  - 评论输入框（Markdown 支持）
  - 评论点赞
  - 评论排序（最新、最热）
  - 分页加载

#### 3.3 评论卡片组件

- **组件**: `CommentCard.tsx`
- **功能**：
  - 显示评论内容
  - 显示作者信息
  - 点赞按钮
  - 回复按钮（第四阶段暂不实现多级回复）
  - 时间显示

---

## 🔧 技术实现细节

### 浏览量统计

- 每次访问帖子详情页时，增加 `view_count`
- 使用防抖避免重复计数（同一用户 5 分钟内只计数一次）

### 点赞功能

- 点赞/取消点赞切换
- 乐观更新 UI（先更新界面，再调用 API）
- 点赞动画效果

### 评论功能

- 支持 Markdown 格式
- 实时字符计数（最多 1000 字符）
- 评论成功后自动刷新列表

### 认证处理

- 使用简化方案：前端传递 `currentUserId`
- 未登录用户可以查看但不能点赞/评论
- 显示登录提示

---

## 📊 实施步骤

### 步骤 1: 创建数据库表和 API（后端）

1. 创建 `post-detail` API
2. 创建 `post-comments` API
3. 创建 `post-comment` API（发表评论）
4. 创建 `like-post` API
5. 创建 `like-comment` API
6. 自动创建所需数据库表

### 步骤 2: 创建帖子详情页（前端）

1. 创建 `/community/posts/[postId]/page.tsx`
2. 实现帖子内容展示
3. 实现点赞功能
4. 实现浏览量统计

### 步骤 3: 实现评论系统（前端）

1. 创建 `CommentSection` 组件
2. 创建 `CommentCard` 组件
3. 实现评论列表
4. 实现发表评论
5. 实现评论点赞

### 步骤 4: 测试和优化

1. 测试所有功能
2. 优化加载性能
3. 添加错误处理
4. 优化 UI/UX

---

## 🎯 成功指标

### 功能完整性

- ✅ 用户可以查看帖子完整内容
- ✅ 用户可以点赞帖子
- ✅ 用户可以发表评论
- ✅ 用户可以点赞评论
- ✅ 浏览量正确统计

### 用户体验

- ✅ 页面加载快速
- ✅ 点赞动画流畅
- ✅ 评论发表响应快
- ✅ 错误提示清晰
- ✅ 移动端适配良好

---

## 📅 预计时间

- API 实现: 2-3 小时
- 前端实现: 3-4 小时
- 测试和调试: 1-2 小时

**总计**: 6-9 小时

---

## 🚀 开始实施

准备开始第四阶段的开发！

### 实施顺序：

1. 先创建所有 API 端点
2. 再创建帖子详情页
3. 最后实现评论系统
4. 测试并部署

---

## 📝 注意事项

1. **数据库表自动创建**：所有 API 首次调用时自动创建表
2. **错误处理**：统一的错误响应格式
3. **性能优化**：使用索引优化查询
4. **安全性**：防止 SQL 注入和 XSS 攻击
5. **用户体验**：加载状态、错误提示、成功反馈
