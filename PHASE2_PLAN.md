# 第二阶段优化计划 - 用户功能

## 📅 开始日期

2026-01-17

## 🎯 目标

实现用户社交功能，包括关注/粉丝、资料编辑、活动历史等

---

## 📋 任务清单

### 任务 1: 关注/粉丝功能 🔥

#### 1.1 数据库表设计

创建 `user_follows` 表：

```sql
CREATE TABLE user_follows (
  id SERIAL PRIMARY KEY,
  follower_id VARCHAR(255) NOT NULL,  -- 关注者的 uid
  following_id VARCHAR(255) NOT NULL, -- 被关注者的 uid
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(follower_id, following_id),
  FOREIGN KEY (follower_id) REFERENCES users(uid) ON DELETE CASCADE,
  FOREIGN KEY (following_id) REFERENCES users(uid) ON DELETE CASCADE
);

CREATE INDEX idx_user_follows_follower ON user_follows(follower_id);
CREATE INDEX idx_user_follows_following ON user_follows(following_id);
```

#### 1.2 API 端点

**1.2.1 关注用户**

- 路径: `POST /api/v2/barong/public/community/follow`
- 参数: `{ userId: string }`
- 返回: `{ success: boolean, message: string }`
- 需要认证: ✅

**1.2.2 取消关注**

- 路径: `DELETE /api/v2/barong/public/community/follow`
- 参数: `{ userId: string }`
- 返回: `{ success: boolean, message: string }`
- 需要认证: ✅

**1.2.3 获取关注列表**

- 路径: `GET /api/v2/barong/public/community/following?userId={userId}&limit={limit}&offset={offset}`
- 返回: 用户关注的人列表
- 需要认证: ❌

**1.2.4 获取粉丝列表**

- 路径: `GET /api/v2/barong/public/community/followers?userId={userId}&limit={limit}&offset={offset}`
- 返回: 关注该用户的人列表
- 需要认证: ❌

**1.2.5 检查关注状态**

- 路径: `GET /api/v2/barong/public/community/is-following?userId={userId}`
- 返回: `{ isFollowing: boolean }`
- 需要认证: ✅

#### 1.3 前端更新

**1.3.1 用户资料页**

- 更新关注/取消关注按钮功能
- 显示真实的关注者和关注中数量
- 添加关注者列表弹窗
- 添加关注中列表弹窗

**1.3.2 成员列表页**

- 添加关注按钮
- 显示关注状态

---

### 任务 2: 用户资料编辑功能 ⚠️

#### 2.1 数据库表设计

创建 `user_profiles` 表：

```sql
CREATE TABLE user_profiles (
  user_id VARCHAR(255) PRIMARY KEY,
  display_name VARCHAR(100),
  bio TEXT,
  location VARCHAR(100),
  website VARCHAR(255),
  avatar_url VARCHAR(500),
  cover_image_url VARCHAR(500),
  social_links JSONB,  -- { twitter, github, linkedin, etc. }
  preferences JSONB,   -- 用户偏好设置
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(uid) ON DELETE CASCADE
);
```

#### 2.2 API 端点

**2.2.1 获取用户资料（扩展）**

- 更新现有的 `user-profile` API
- 添加 `user_profiles` 表的数据

**2.2.2 更新用户资料**

- 路径: `PUT /api/v2/barong/public/community/profile`
- 参数: `{ displayName, bio, location, website, socialLinks }`
- 返回: 更新后的资料
- 需要认证: ✅

**2.2.3 上传头像**

- 路径: `POST /api/v2/barong/public/community/upload-avatar`
- 参数: FormData with image file
- 返回: `{ avatarUrl: string }`
- 需要认证: ✅

#### 2.3 前端更新

**2.3.1 创建资料编辑页面**

- 路径: `/community/settings/profile`
- 表单字段：
  - 显示名称
  - 个人简介
  - 位置
  - 网站
  - 社交链接（Twitter, GitHub, LinkedIn）
  - 头像上传

**2.3.2 更新用户资料页**

- 显示完整的用户资料
- 添加"编辑资料"按钮（仅自己可见）

---

### 任务 3: 用户活动历史 📝

#### 3.1 API 端点

**3.1.1 获取用户活动历史**

- 路径: `GET /api/v2/barong/public/community/user-activity?userId={userId}&type={type}&limit={limit}&offset={offset}`
- 参数:
  - `type`: all | posts | comments | likes
  - `limit`: 默认 20
  - `offset`: 默认 0
- 返回: 活动列表（帖子、评论、点赞）

**3.1.2 获取用户评论历史**

- 路径: `GET /api/v2/barong/public/community/user-comments?userId={userId}&limit={limit}&offset={offset}`
- 返回: 用户的所有评论

**3.1.3 获取用户点赞历史**

- 路径: `GET /api/v2/barong/public/community/user-likes?userId={userId}&limit={limit}&offset={offset}`
- 返回: 用户点赞的帖子列表

#### 3.2 前端更新

**3.2.1 用户资料页添加标签页**

- 帖子（已有）
- 评论
- 点赞
- 活动

---

### 任务 4: 用户通知功能 🔔

#### 4.1 数据库表设计

创建 `notifications` 表（如果不存在）：

```sql
CREATE TABLE notifications (
  id SERIAL PRIMARY KEY,
  user_id VARCHAR(255) NOT NULL,
  type VARCHAR(50) NOT NULL,  -- follow, like, comment, mention, reply
  actor_id VARCHAR(255),       -- 触发通知的用户
  target_type VARCHAR(50),     -- post, comment, user
  target_id INTEGER,
  content TEXT,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(uid) ON DELETE CASCADE
);

CREATE INDEX idx_notifications_user_read ON notifications(user_id, is_read);
CREATE INDEX idx_notifications_created ON notifications(created_at DESC);
```

#### 4.2 API 端点

**4.2.1 创建通知（内部使用）**

- 当用户被关注时创建通知
- 当帖子被点赞时创建通知
- 当帖子被评论时创建通知

**4.2.2 更新现有通知 API**

- 确保返回真实的关注通知

---

## 🔧 技术实现细节

### 认证处理

所有需要认证的 API 都需要：

1. 检查 session cookie
2. 验证用户身份
3. 返回 401 如果未认证

### 错误处理

统一的错误响应格式：

```json
{
  "success": false,
  "message": "错误信息",
  "code": "ERROR_CODE"
}
```

### 性能优化

1. 使用数据库索引
2. 实现分页
3. 考虑添加缓存（Redis）

---

## 📊 优先级排序

### 高优先级 🔥

1. 关注/粉丝功能（用户最需要的社交功能）
2. 用户资料编辑（完善用户信息）

### 中优先级 ⚠️

3. 用户活动历史（增强用户体验）
4. 通知功能优化（提升互动性）

### 低优先级 📝

5. 头像上传（可以先使用默认头像）
6. 社交链接（非核心功能）

---

## 🎯 成功指标

### 功能完整性

- ✅ 所有 API 返回真实数据
- ✅ 前端页面正常显示
- ✅ 无 TypeScript 错误
- ✅ 无运行时错误

### 用户体验

- ✅ 关注/取消关注响应快速
- ✅ 资料编辑保存成功
- ✅ 活动历史加载流畅
- ✅ 通知实时更新

### 性能指标

- API 响应时间 < 500ms
- 页面加载时间 < 2s
- 无明显卡顿

---

## 📅 预计时间

- 任务 1（关注/粉丝）: 4-6 小时
- 任务 2（资料编辑）: 3-4 小时
- 任务 3（活动历史）: 2-3 小时
- 任务 4（通知优化）: 1-2 小时

**总计**: 10-15 小时（1-2 天）

---

## 🚀 开始实施

### 第一步：关注/粉丝功能

1. 创建数据库表
2. 实现关注/取消关注 API
3. 实现关注列表 API
4. 更新前端用户资料页
5. 测试功能

准备好开始了吗？
