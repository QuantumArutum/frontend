# Phase 13: 标签系统实现计划

**开始时间:** 2026年1月18日  
**预计时间:** 2-3 小时  
**优先级:** ⭐⭐⭐⭐ 重要

---

## 🎯 目标

实现完整的标签系统，帮助用户更好地组织和发现内容，提升内容的可发现性和社区的组织性。

---

## 📋 功能清单

### 1. 标签基础功能

#### 1.1 标签创建

- [ ] 发帖时添加标签
- [ ] 标签自动建议
- [ ] 标签验证（长度、格式）
- [ ] 标签去重
- [ ] 标签数量限制（每帖最多5个）

#### 1.2 标签显示

- [ ] 帖子标签显示
- [ ] 标签颜色编码
- [ ] 标签图标
- [ ] 标签点击跳转

### 2. 标签搜索

#### 2.1 按标签浏览

- [ ] 标签页面
- [ ] 按标签筛选帖子
- [ ] 标签帖子列表
- [ ] 标签帖子排序

#### 2.2 标签搜索

- [ ] 标签搜索框
- [ ] 标签自动完成
- [ ] 多标签组合搜索
- [ ] 标签搜索历史

### 3. 标签云

#### 3.1 标签云显示

- [ ] 热门标签云
- [ ] 标签大小按热度
- [ ] 标签颜色分类
- [ ] 标签云动画

#### 3.2 标签统计

- [ ] 标签使用次数
- [ ] 标签趋势
- [ ] 标签增长率
- [ ] 标签活跃度

### 4. 热门标签

#### 4.1 热门标签列表

- [ ] 今日热门标签
- [ ] 本周热门标签
- [ ] 本月热门标签
- [ ] 全部热门标签

#### 4.2 热门标签排序

- [ ] 按使用次数
- [ ] 按增长率
- [ ] 按活跃度
- [ ] 按时间范围

### 5. 标签订阅

#### 5.1 订阅功能

- [ ] 订阅标签
- [ ] 取消订阅
- [ ] 订阅列表
- [ ] 订阅通知

#### 5.2 订阅管理

- [ ] 查看订阅的标签
- [ ] 管理订阅
- [ ] 订阅推荐
- [ ] 订阅统计

### 6. 标签管理

#### 6.1 用户标签管理

- [ ] 查看自己使用的标签
- [ ] 标签使用统计
- [ ] 标签历史

#### 6.2 管理员标签管理

- [ ] 创建官方标签
- [ ] 编辑标签
- [ ] 合并标签
- [ ] 删除标签
- [ ] 标签别名

---

## 🗄️ 数据库设计

### 1. 标签表

```sql
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

CREATE INDEX idx_tags_name ON tags(name);
CREATE INDEX idx_tags_slug ON tags(slug);
CREATE INDEX idx_tags_usage_count ON tags(usage_count DESC);
CREATE INDEX idx_tags_official ON tags(is_official);
```

### 2. 帖子标签关联表

```sql
CREATE TABLE IF NOT EXISTS post_tags (
  id SERIAL PRIMARY KEY,
  post_id INTEGER NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  tag_id INTEGER NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(post_id, tag_id)
);

CREATE INDEX idx_post_tags_post ON post_tags(post_id);
CREATE INDEX idx_post_tags_tag ON post_tags(tag_id);
CREATE INDEX idx_post_tags_created ON post_tags(created_at DESC);
```

### 3. 用户标签订阅表

```sql
CREATE TABLE IF NOT EXISTS tag_subscriptions (
  id SERIAL PRIMARY KEY,
  user_id VARCHAR(50) NOT NULL,
  tag_id INTEGER NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
  notify_new_posts BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, tag_id)
);

CREATE INDEX idx_tag_subscriptions_user ON tag_subscriptions(user_id);
CREATE INDEX idx_tag_subscriptions_tag ON tag_subscriptions(tag_id);
```

### 4. 标签别名表

```sql
CREATE TABLE IF NOT EXISTS tag_aliases (
  id SERIAL PRIMARY KEY,
  alias VARCHAR(50) NOT NULL UNIQUE,
  tag_id INTEGER NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_tag_aliases_alias ON tag_aliases(alias);
CREATE INDEX idx_tag_aliases_tag ON tag_aliases(tag_id);
```

### 5. 标签统计表

```sql
CREATE TABLE IF NOT EXISTS tag_stats (
  id SERIAL PRIMARY KEY,
  tag_id INTEGER NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  post_count INTEGER DEFAULT 0,
  view_count INTEGER DEFAULT 0,
  subscriber_count INTEGER DEFAULT 0,
  UNIQUE(tag_id, date)
);

CREATE INDEX idx_tag_stats_tag ON tag_stats(tag_id);
CREATE INDEX idx_tag_stats_date ON tag_stats(date DESC);
```

---

## 🔧 API 设计

### 1. 标签 CRUD API

#### GET /api/v2/barong/public/community/tags

```typescript
// 获取标签列表
{
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: 'usage' | 'name' | 'created';
  official?: boolean;
}

// 响应
{
  success: boolean;
  data: {
    tags: Tag[];
    total: number;
    page: number;
    hasMore: boolean;
  };
}
```

#### GET /api/v2/barong/public/community/tags/:slug

```typescript
// 获取标签详情
// 响应
{
  success: boolean;
  data: {
    tag: Tag;
    postCount: number;
    subscriberCount: number;
    isSubscribed: boolean;
    relatedTags: Tag[];
  };
}
```

#### POST /api/v2/barong/public/community/tags

```typescript
// 创建标签（自动或手动）
{
  name: string;
  description?: string;
  color?: string;
}

// 响应
{
  success: boolean;
  data: Tag;
}
```

### 2. 帖子标签 API

#### POST /api/v2/barong/public/community/posts/:id/tags

```typescript
// 为帖子添加标签
{
  tags: string[]; // 标签名称数组
}

// 响应
{
  success: boolean;
  data: {
    tags: Tag[];
  };
}
```

#### DELETE /api/v2/barong/public/community/posts/:id/tags/:tagId

```typescript
// 移除帖子标签
// 响应
{
  success: boolean;
  message: string;
}
```

### 3. 标签搜索 API

#### GET /api/v2/barong/public/community/tags/search

```typescript
// 搜索标签
{
  query: string;
  limit?: number;
}

// 响应
{
  success: boolean;
  data: {
    tags: Tag[];
  };
}
```

#### GET /api/v2/barong/public/community/tags/:slug/posts

```typescript
// 获取标签下的帖子
{
  page?: number;
  limit?: number;
  sortBy?: 'hot' | 'new' | 'top';
  timeRange?: '1h' | '24h' | '7d' | '30d' | 'all';
}

// 响应
{
  success: boolean;
  data: {
    posts: Post[];
    total: number;
    page: number;
    hasMore: boolean;
  };
}
```

### 4. 热门标签 API

#### GET /api/v2/barong/public/community/tags/trending

```typescript
// 获取热门标签
{
  timeRange?: '1h' | '24h' | '7d' | '30d';
  limit?: number;
}

// 响应
{
  success: boolean;
  data: {
    tags: Tag[];
  };
}
```

### 5. 标签订阅 API

#### POST /api/v2/barong/public/community/tags/:slug/subscribe

```typescript
// 订阅标签
{
  notifyNewPosts?: boolean;
}

// 响应
{
  success: boolean;
  message: string;
}
```

#### DELETE /api/v2/barong/public/community/tags/:slug/subscribe

```typescript
// 取消订阅
// 响应
{
  success: boolean;
  message: string;
}
```

#### GET /api/v2/barong/public/community/users/:userId/tag-subscriptions

```typescript
// 获取用户订阅的标签
// 响应
{
  success: boolean;
  data: {
    tags: Tag[];
  };
}
```

---

## 🎨 前端组件设计

### 1. TagInput 组件

```typescript
// src/components/community/TagInput.tsx
interface TagInputProps {
  value: string[];
  onChange: (tags: string[]) => void;
  maxTags?: number;
  placeholder?: string;
  suggestions?: string[];
}

// 功能：
// - 输入标签
// - 自动建议
// - 标签验证
// - 标签删除
// - 最大数量限制
```

### 2. TagBadge 组件

```typescript
// src/components/community/TagBadge.tsx
interface TagBadgeProps {
  tag: Tag;
  size?: 'small' | 'medium' | 'large';
  clickable?: boolean;
  removable?: boolean;
  onRemove?: () => void;
  onClick?: () => void;
}

// 功能：
// - 显示标签
// - 颜色编码
// - 点击跳转
// - 删除按钮
```

### 3. TagCloud 组件

```typescript
// src/components/community/TagCloud.tsx
interface TagCloudProps {
  tags: Tag[];
  maxTags?: number;
  minSize?: number;
  maxSize?: number;
  onTagClick?: (tag: Tag) => void;
}

// 功能：
// - 标签云显示
// - 大小按热度
// - 颜色分类
// - 点击交互
```

### 4. TagList 组件

```typescript
// src/components/community/TagList.tsx
interface TagListProps {
  tags: Tag[];
  layout?: 'horizontal' | 'vertical' | 'grid';
  showStats?: boolean;
  showSubscribe?: boolean;
}

// 功能：
// - 标签列表
// - 多种布局
// - 显示统计
// - 订阅按钮
```

### 5. TagSubscribeButton 组件

```typescript
// src/components/community/TagSubscribeButton.tsx
interface TagSubscribeButtonProps {
  tagSlug: string;
  isSubscribed: boolean;
  onSubscribeChange?: (subscribed: boolean) => void;
}

// 功能：
// - 订阅/取消订阅
// - 状态显示
// - 加载状态
// - 错误处理
```

---

## 🔄 实现步骤

### Step 1: 数据库设计（30分钟）

1. 创建标签表
2. 创建关联表
3. 创建订阅表
4. 创建索引
5. 创建触发器

### Step 2: 后端 API（60分钟）

1. 标签 CRUD API
2. 帖子标签 API
3. 标签搜索 API
4. 热门标签 API
5. 标签订阅 API

### Step 3: 前端组件（45分钟）

1. TagInput 组件
2. TagBadge 组件
3. TagCloud 组件
4. TagList 组件
5. TagSubscribeButton 组件

### Step 4: 页面集成（30分钟）

1. 发帖页面集成
2. 帖子详情页集成
3. 标签页面创建
4. 侧边栏标签云

### Step 5: 测试优化（15分钟）

1. 功能测试
2. 性能测试
3. UI/UX 优化

---

## ✅ 验收标准

### 功能验收

- [ ] 用户可以为帖子添加标签
- [ ] 用户可以点击标签查看相关帖子
- [ ] 用户可以搜索标签
- [ ] 用户可以订阅标签
- [ ] 显示热门标签
- [ ] 显示标签云
- [ ] 标签统计正确
- [ ] 管理员可以管理标签

### 性能验收

- [ ] 标签搜索响应 < 300ms
- [ ] 标签页面加载 < 1s
- [ ] 标签云渲染流畅
- [ ] 数据库查询优化

### UI/UX 验收

- [ ] 标签输入体验良好
- [ ] 标签显示清晰
- [ ] 标签云美观
- [ ] 移动端适配良好

---

## 📊 预期效果

### 内容组织

- 帖子分类更清晰
- 内容更易发现
- 相关内容聚合

### 用户体验

- 查找内容更方便
- 订阅感兴趣的话题
- 发现新内容

### 社区活跃度

- 话题讨论更集中
- 用户参与度提升
- 内容质量提升

---

## 🎯 成功指标

| 指标           | 目标    | 测量方式 |
| -------------- | ------- | -------- |
| 标签功能完成度 | 100%    | 功能清单 |
| API 响应时间   | < 300ms | 性能监控 |
| 标签使用率     | > 60%   | 数据分析 |
| 代码质量       | 9/10    | 代码审查 |
| 用户满意度     | > 85%   | 用户反馈 |

---

## 📅 时间表

| 阶段       | 时间      | 负责人  |
| ---------- | --------- | ------- |
| 数据库设计 | 30分钟    | Kiro AI |
| 后端 API   | 60分钟    | Kiro AI |
| 前端组件   | 45分钟    | Kiro AI |
| 页面集成   | 30分钟    | Kiro AI |
| 测试优化   | 15分钟    | Kiro AI |
| **总计**   | **3小时** |         |

---

## 🚀 开始实施

准备好开始 Phase 13 的实施了吗？

**下一步:**

1. 创建数据库迁移脚本
2. 实现后端 API
3. 开发前端组件
4. 集成到页面
5. 测试和部署

让我们开始吧！🎉
