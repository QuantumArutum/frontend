# Phase 12: 投票系统实现计划

**开始时间:** 2026年1月18日  
**预计时间:** 2-3 小时  
**优先级:** ⭐⭐⭐⭐ 重要

---

## 🎯 目标

实现完整的投票系统，包括赞同/反对功能、热度算法、争议标记等，提升内容质量和用户参与度。

---

## 📋 功能清单

### 1. 基础投票功能

#### 1.1 帖子投票 ✅ (已有点赞)
- [x] 点赞功能（已实现）
- [ ] 反对/踩功能（新增）
- [ ] 取消投票
- [ ] 投票状态显示
- [ ] 投票数统计

#### 1.2 评论投票 ✅ (已有点赞)
- [x] 点赞功能（已实现）
- [ ] 反对/踩功能（新增）
- [ ] 取消投票
- [ ] 投票状态显示
- [ ] 投票数统计

### 2. 投票显示

#### 2.1 投票数显示
- [ ] 净投票数（赞 - 踩）
- [ ] 赞同数单独显示
- [ ] 反对数单独显示
- [ ] 投票比例显示
- [ ] 投票趋势图标

#### 2.2 用户投票状态
- [ ] 已赞同高亮
- [ ] 已反对高亮
- [ ] 未投票状态
- [ ] 投票历史记录

### 3. 热度算法

#### 3.1 热度计算
- [ ] 基于投票的热度分数
- [ ] 时间衰减因子
- [ ] 评论数权重
- [ ] 浏览数权重
- [ ] 综合热度排序

#### 3.2 热度显示
- [ ] 热度分数显示
- [ ] 热门标记
- [ ] 上升趋势标记
- [ ] 热度排行榜

### 4. 争议内容标记

#### 4.1 争议检测
- [ ] 赞踩比例计算
- [ ] 争议阈值设定
- [ ] 争议标记显示
- [ ] 争议内容排序

#### 4.2 争议处理
- [ ] 争议内容提示
- [ ] 争议内容折叠（可选）
- [ ] 争议原因说明
- [ ] 版主审核标记

### 5. 投票限制

#### 5.1 防刷票机制
- [ ] 同一用户只能投一次
- [ ] 投票冷却时间
- [ ] IP 限制（可选）
- [ ] 异常投票检测

#### 5.2 权限控制
- [ ] 登录用户才能投票
- [ ] 新用户投票限制
- [ ] 被封禁用户无法投票
- [ ] 自己的内容无法投票

---

## 🗄️ 数据库设计

### 1. 扩展现有表

#### posts 表（已存在，需扩展）
```sql
ALTER TABLE posts ADD COLUMN IF NOT EXISTS upvote_count INTEGER DEFAULT 0;
ALTER TABLE posts ADD COLUMN IF NOT EXISTS downvote_count INTEGER DEFAULT 0;
ALTER TABLE posts ADD COLUMN IF NOT EXISTS vote_score INTEGER DEFAULT 0; -- upvote - downvote
ALTER TABLE posts ADD COLUMN IF NOT EXISTS hot_score DECIMAL(10,2) DEFAULT 0;
ALTER TABLE posts ADD COLUMN IF NOT EXISTS controversy_score DECIMAL(5,2) DEFAULT 0;
ALTER TABLE posts ADD COLUMN IF NOT EXISTS is_controversial BOOLEAN DEFAULT FALSE;

-- 更新索引
CREATE INDEX IF NOT EXISTS idx_posts_vote_score ON posts(vote_score DESC);
CREATE INDEX IF NOT EXISTS idx_posts_hot_score ON posts(hot_score DESC);
CREATE INDEX IF NOT EXISTS idx_posts_controversial ON posts(is_controversial, controversy_score DESC);
```

#### comments 表（已存在，需扩展）
```sql
ALTER TABLE comments ADD COLUMN IF NOT EXISTS upvote_count INTEGER DEFAULT 0;
ALTER TABLE comments ADD COLUMN IF NOT EXISTS downvote_count INTEGER DEFAULT 0;
ALTER TABLE comments ADD COLUMN IF NOT EXISTS vote_score INTEGER DEFAULT 0;
ALTER TABLE comments ADD COLUMN IF NOT EXISTS controversy_score DECIMAL(5,2) DEFAULT 0;

-- 更新索引
CREATE INDEX IF NOT EXISTS idx_comments_vote_score ON comments(vote_score DESC);
```

### 2. 扩展投票表

#### post_votes 表（扩展 post_likes）
```sql
-- 重命名现有表
ALTER TABLE post_likes RENAME TO post_votes;

-- 添加投票类型字段
ALTER TABLE post_votes ADD COLUMN IF NOT EXISTS vote_type VARCHAR(10) DEFAULT 'upvote'; -- 'upvote' or 'downvote'
ALTER TABLE post_votes ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;

-- 更新索引
CREATE INDEX IF NOT EXISTS idx_post_votes_type ON post_votes(vote_type);
CREATE INDEX IF NOT EXISTS idx_post_votes_user_post ON post_votes(user_id, post_id);
```

#### comment_votes 表（扩展 comment_likes）
```sql
-- 重命名现有表
ALTER TABLE comment_likes RENAME TO comment_votes;

-- 添加投票类型字段
ALTER TABLE comment_votes ADD COLUMN IF NOT EXISTS vote_type VARCHAR(10) DEFAULT 'upvote';
ALTER TABLE comment_votes ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;

-- 更新索引
CREATE INDEX IF NOT EXISTS idx_comment_votes_type ON comment_votes(vote_type);
CREATE INDEX IF NOT EXISTS idx_comment_votes_user_comment ON comment_votes(user_id, comment_id);
```

### 3. 投票历史表（可选）
```sql
CREATE TABLE IF NOT EXISTS vote_history (
  id SERIAL PRIMARY KEY,
  user_id VARCHAR(50) NOT NULL,
  target_type VARCHAR(20) NOT NULL, -- 'post' or 'comment'
  target_id INTEGER NOT NULL,
  old_vote VARCHAR(10), -- 'upvote', 'downvote', or NULL
  new_vote VARCHAR(10), -- 'upvote', 'downvote', or NULL
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_vote_history_user ON vote_history(user_id);
CREATE INDEX idx_vote_history_target ON vote_history(target_type, target_id);
```

---

## 🔧 API 设计

### 1. 帖子投票 API

#### POST /api/v2/barong/public/community/vote-post
```typescript
// 请求
{
  postId: number;
  voteType: 'upvote' | 'downvote' | 'remove'; // remove 表示取消投票
  currentUserId: string;
}

// 响应
{
  success: boolean;
  data: {
    upvoteCount: number;
    downvoteCount: number;
    voteScore: number;
    userVote: 'upvote' | 'downvote' | null;
    isControversial: boolean;
  };
}
```

### 2. 评论投票 API

#### POST /api/v2/barong/public/community/vote-comment
```typescript
// 请求
{
  commentId: number;
  voteType: 'upvote' | 'downvote' | 'remove';
  currentUserId: string;
}

// 响应
{
  success: boolean;
  data: {
    upvoteCount: number;
    downvoteCount: number;
    voteScore: number;
    userVote: 'upvote' | 'downvote' | null;
  };
}
```

### 3. 热门帖子 API

#### GET /api/v2/barong/public/community/hot-posts
```typescript
// 请求参数
{
  page?: number;
  limit?: number;
  timeRange?: '1h' | '6h' | '24h' | '7d' | '30d' | 'all';
  categoryId?: number;
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

### 4. 争议帖子 API

#### GET /api/v2/barong/public/community/controversial-posts
```typescript
// 请求参数
{
  page?: number;
  limit?: number;
  timeRange?: '1h' | '6h' | '24h' | '7d' | '30d' | 'all';
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

### 5. 用户投票历史 API

#### GET /api/v2/barong/public/community/user-votes
```typescript
// 请求参数
{
  userId: string;
  voteType?: 'upvote' | 'downvote';
  targetType?: 'post' | 'comment';
  page?: number;
  limit?: number;
}

// 响应
{
  success: boolean;
  data: {
    votes: Vote[];
    total: number;
    page: number;
    hasMore: boolean;
  };
}
```

---

## 🎨 前端组件设计

### 1. VoteButtons 组件

```typescript
// src/components/community/VoteButtons.tsx
interface VoteButtonsProps {
  targetId: number;
  targetType: 'post' | 'comment';
  upvoteCount: number;
  downvoteCount: number;
  userVote: 'upvote' | 'downvote' | null;
  isControversial?: boolean;
  onVoteChange?: (newVote: 'upvote' | 'downvote' | null) => void;
  size?: 'small' | 'medium' | 'large';
  layout?: 'vertical' | 'horizontal';
}

// 功能：
// - 显示赞同/反对按钮
// - 显示投票数
// - 高亮用户投票状态
// - 处理投票点击
// - 显示争议标记
```

### 2. HotScore 组件

```typescript
// src/components/community/HotScore.tsx
interface HotScoreProps {
  score: number;
  trend?: 'rising' | 'falling' | 'stable';
  showLabel?: boolean;
}

// 功能：
// - 显示热度分数
// - 显示趋势图标
// - 颜色编码（高/中/低）
```

### 3. ControversialBadge 组件

```typescript
// src/components/community/ControversialBadge.tsx
interface ControversialBadgeProps {
  controversyScore: number;
  upvoteCount: number;
  downvoteCount: number;
  showDetails?: boolean;
}

// 功能：
// - 显示争议标记
// - 显示赞踩比例
// - 提示信息
```

---

## 📐 热度算法设计

### Reddit 热度算法（参考）

```typescript
function calculateHotScore(
  upvotes: number,
  downvotes: number,
  createdAt: Date
): number {
  const score = upvotes - downvotes;
  const order = Math.log10(Math.max(Math.abs(score), 1));
  const sign = score > 0 ? 1 : score < 0 ? -1 : 0;
  
  const seconds = (Date.now() - createdAt.getTime()) / 1000;
  const hours = seconds / 3600;
  
  // 时间衰减：每12小时衰减一半
  const timeDecay = hours / 12;
  
  return sign * order - timeDecay;
}
```

### 争议分数算法

```typescript
function calculateControversyScore(
  upvotes: number,
  downvotes: number
): number {
  const total = upvotes + downvotes;
  if (total === 0) return 0;
  
  const balance = Math.min(upvotes, downvotes);
  const magnitude = upvotes + downvotes;
  
  // 争议分数：平衡度 × 规模
  return (balance / total) * Math.log10(magnitude + 1);
}

// 争议阈值
const CONTROVERSIAL_THRESHOLD = 0.4; // 40% 以上认为有争议
```

---

## 🔄 实现步骤

### Step 1: 数据库迁移（30分钟）

1. 创建数据库迁移脚本
2. 扩展 posts 和 comments 表
3. 重命名投票表
4. 创建索引
5. 迁移现有数据

### Step 2: 后端 API 实现（60分钟）

1. 实现帖子投票 API
2. 实现评论投票 API
3. 实现热门帖子 API
4. 实现争议帖子 API
5. 实现用户投票历史 API
6. 添加热度计算定时任务

### Step 3: 前端组件开发（45分钟）

1. 创建 VoteButtons 组件
2. 创建 HotScore 组件
3. 创建 ControversialBadge 组件
4. 集成到帖子列表
5. 集成到帖子详情
6. 集成到评论组件

### Step 4: 测试和优化（15分钟）

1. 功能测试
2. 性能测试
3. 边界情况测试
4. UI/UX 优化

---

## ✅ 验收标准

### 功能验收

- [ ] 用户可以对帖子投赞同票
- [ ] 用户可以对帖子投反对票
- [ ] 用户可以取消投票
- [ ] 用户可以对评论投票
- [ ] 投票数实时更新
- [ ] 热度分数正确计算
- [ ] 争议内容正确标记
- [ ] 热门帖子排序正确
- [ ] 投票历史正确记录

### 性能验收

- [ ] 投票响应时间 < 500ms
- [ ] 热度计算不影响页面加载
- [ ] 数据库查询优化
- [ ] 缓存策略有效

### UI/UX 验收

- [ ] 投票按钮易于点击
- [ ] 投票状态清晰显示
- [ ] 动画流畅自然
- [ ] 移动端适配良好
- [ ] 无障碍访问支持

---

## 📊 预期效果

### 用户参与度

- 投票互动增加 50%+
- 用户停留时间增加 30%+
- 内容质量提升

### 内容质量

- 优质内容更容易被发现
- 低质量内容自然沉底
- 争议内容得到标记

### 社区氛围

- 用户表达意见更方便
- 内容评价更客观
- 社区自治能力增强

---

## 🔮 后续优化

### Phase 12.1: 高级投票功能

- [ ] 投票权重（基于用户声誉）
- [ ] 投票理由（可选填写）
- [ ] 投票统计图表
- [ ] 投票趋势分析

### Phase 12.2: 反作弊系统

- [ ] 异常投票检测
- [ ] 刷票行为识别
- [ ] 自动封禁机制
- [ ] 投票审计日志

### Phase 12.3: 个性化推荐

- [ ] 基于投票的推荐
- [ ] 相似内容推荐
- [ ] 用户兴趣分析
- [ ] 个性化首页

---

## 📝 技术栈

- **后端:** Next.js API Routes, PostgreSQL
- **前端:** React, TypeScript, Tailwind CSS
- **状态管理:** React Hooks
- **动画:** Framer Motion
- **图标:** Lucide React

---

## 🎯 成功指标

| 指标 | 目标 | 测量方式 |
|------|------|---------|
| 投票功能完成度 | 100% | 功能清单完成率 |
| API 响应时间 | < 500ms | 性能监控 |
| 用户投票率 | > 30% | 数据分析 |
| 代码质量 | 9/10 | 代码审查 |
| 用户满意度 | > 85% | 用户反馈 |

---

## 📅 时间表

| 阶段 | 时间 | 负责人 |
|------|------|--------|
| 数据库迁移 | 30分钟 | Kiro AI |
| 后端 API | 60分钟 | Kiro AI |
| 前端组件 | 45分钟 | Kiro AI |
| 测试优化 | 15分钟 | Kiro AI |
| **总计** | **2.5小时** | |

---

## 🚀 开始实施

准备好开始 Phase 12 的实施了吗？

**下一步:**
1. 创建数据库迁移脚本
2. 实现后端 API
3. 开发前端组件
4. 测试和部署

让我们开始吧！🎉
