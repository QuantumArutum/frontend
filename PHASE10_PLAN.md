# 第十阶段计划：评论系统增强

## 目标
实现完整的评论系统，包括嵌套评论、@提及、评论编辑/删除、评论排序和评论折叠。

---

## 📋 需要实现的功能

### 1. 嵌套评论（回复评论）🔗
**功能描述**: 支持回复评论，形成评论树结构

**功能特性**:
- ✅ 回复按钮
- ✅ 嵌套层级显示（最多3层）
- ✅ 回复目标显示（@用户名）
- ✅ 展开/折叠子评论
- ✅ 查看全部回复

**实现位置**:
- `src/components/community/CommentTree.tsx` - 评论树组件
- `src/app/api/v2/barong/public/community/reply-comment/route.ts` - 回复评论 API

---

### 2. @提及用户 👤
**功能描述**: 在评论中 @提及其他用户

**功能特性**:
- ✅ 输入 @ 触发用户搜索
- ✅ 用户列表下拉选择
- ✅ @用户名高亮显示
- ✅ 点击 @用户名跳转到用户资料
- ✅ 被 @用户收到通知

**实现位置**:
- `src/components/community/MentionInput.tsx` - @提及输入组件
- `src/app/api/v2/barong/public/community/search-users/route.ts` - 用户搜索 API

---

### 3. 评论编辑 ✏️
**功能描述**: 编辑已发表的评论

**功能特性**:
- ✅ 只能编辑自己的评论
- ✅ 编辑时间显示
- ✅ 编辑标记（已编辑）
- ✅ 编辑历史（可选）

**实现位置**:
- `src/app/api/v2/barong/public/community/edit-comment/route.ts` - 编辑评论 API

---

### 4. 评论删除 🗑️
**功能描述**: 删除已发表的评论

**功能特性**:
- ✅ 只能删除自己的评论
- ✅ 软删除（保留"评论已删除"占位）
- ✅ 删除确认对话框
- ✅ 子评论处理（保留或一起删除）

**实现位置**:
- `src/app/api/v2/barong/public/community/delete-comment/route.ts` - 删除评论 API

---

### 5. 评论排序 📊
**功能描述**: 多种评论排序方式

**排序选项**:
- ✅ 最新（按时间倒序）
- ✅ 最早（按时间正序）
- ✅ 最热（按点赞数倒序）
- ✅ 最佳（综合算法）

**实现位置**:
- `src/components/community/CommentSort.tsx` - 排序组件

---

### 6. 评论折叠 📦
**功能描述**: 折叠长评论和低分评论

**折叠规则**:
- ✅ 超过500字的评论自动折叠
- ✅ 点赞数为负的评论自动折叠
- ✅ 手动折叠/展开
- ✅ 折叠子评论树

**实现位置**:
- `src/components/community/CollapsibleComment.tsx` - 可折叠评论组件

---

### 7. 评论举报 🚩
**功能描述**: 举报不当评论

**举报类型**:
- ✅ 垃圾信息
- ✅ 骚扰辱骂
- ✅ 虚假信息
- ✅ 违规内容
- ✅ 其他（需说明）

**实现位置**:
- `src/app/api/v2/barong/public/community/report-comment/route.ts` - 举报评论 API

---

### 8. 评论加载优化 ⚡
**功能描述**: 优化评论加载性能

**优化方案**:
- ✅ 分页加载（每页20条）
- ✅ 懒加载子评论
- ✅ 虚拟滚动（长列表）
- ✅ 缓存已加载评论

**实现位置**:
- `src/hooks/useCommentPagination.ts` - 评论分页 Hook

---

## 🔧 技术实现

### 数据库表结构

#### post_comments 表（已存在，需要添加字段）
```sql
ALTER TABLE post_comments ADD COLUMN IF NOT EXISTS parent_id INTEGER;
ALTER TABLE post_comments ADD COLUMN IF NOT EXISTS reply_to_user_id VARCHAR(255);
ALTER TABLE post_comments ADD COLUMN IF NOT EXISTS reply_to_user_name VARCHAR(255);
ALTER TABLE post_comments ADD COLUMN IF NOT EXISTS edited_at TIMESTAMP;
ALTER TABLE post_comments ADD COLUMN IF NOT EXISTS is_edited BOOLEAN DEFAULT FALSE;
ALTER TABLE post_comments ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP;
ALTER TABLE post_comments ADD COLUMN IF NOT EXISTS is_deleted BOOLEAN DEFAULT FALSE;
ALTER TABLE post_comments ADD COLUMN IF NOT EXISTS depth INTEGER DEFAULT 0;

CREATE INDEX idx_comments_parent_id ON post_comments(parent_id);
CREATE INDEX idx_comments_reply_to_user ON post_comments(reply_to_user_id);
```

#### comment_mentions 表（新建）
```sql
CREATE TABLE IF NOT EXISTS comment_mentions (
  id SERIAL PRIMARY KEY,
  comment_id INTEGER NOT NULL,
  mentioned_user_id VARCHAR(255) NOT NULL,
  mentioned_user_name VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_mentions_comment_id ON comment_mentions(comment_id);
CREATE INDEX idx_mentions_user_id ON comment_mentions(mentioned_user_id);
```

#### comment_reports 表（新建）
```sql
CREATE TABLE IF NOT EXISTS comment_reports (
  id SERIAL PRIMARY KEY,
  comment_id INTEGER NOT NULL,
  reporter_id VARCHAR(255) NOT NULL,
  report_type VARCHAR(50) NOT NULL,
  report_reason TEXT,
  status VARCHAR(50) DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT NOW(),
  handled_at TIMESTAMP,
  handled_by VARCHAR(255)
);

CREATE INDEX idx_reports_comment_id ON comment_reports(comment_id);
CREATE INDEX idx_reports_status ON comment_reports(status);
```

---

### API 端点

#### 1. 回复评论 API
```typescript
POST /api/v2/barong/public/community/reply-comment

Request:
{
  postId: number,
  parentId: number,
  replyToUserId: string,
  replyToUserName: string,
  content: string,
  mentions?: string[] // 被@的用户ID列表
}

Response:
{
  success: boolean,
  message: string,
  data: {
    comment: Comment
  }
}
```

#### 2. 获取评论树 API（增强）
```typescript
GET /api/v2/barong/public/community/post-comments?postId={id}&sort={sort}&page={page}

Request Query:
- postId: number
- sort: 'newest' | 'oldest' | 'hot' | 'best'
- page: number
- limit: number

Response:
{
  success: boolean,
  data: {
    comments: Comment[], // 顶级评论
    total: number,
    hasMore: boolean
  }
}
```

#### 3. 获取子评论 API
```typescript
GET /api/v2/barong/public/community/comment-replies?commentId={id}

Request Query:
- commentId: number

Response:
{
  success: boolean,
  data: {
    replies: Comment[]
  }
}
```

#### 4. 编辑评论 API
```typescript
PUT /api/v2/barong/public/community/edit-comment

Request:
{
  commentId: number,
  content: string
}

Response:
{
  success: boolean,
  message: string
}
```

#### 5. 删除评论 API
```typescript
DELETE /api/v2/barong/public/community/delete-comment?commentId={id}

Request Query:
- commentId: number

Response:
{
  success: boolean,
  message: string
}
```

#### 6. 用户搜索 API
```typescript
GET /api/v2/barong/public/community/search-users?q={query}&limit={limit}

Request Query:
- q: string (搜索关键词)
- limit: number (默认10)

Response:
{
  success: boolean,
  data: {
    users: Array<{
      userId: string,
      userName: string,
      avatar: string
    }>
  }
}
```

#### 7. 举报评论 API
```typescript
POST /api/v2/barong/public/community/report-comment

Request:
{
  commentId: number,
  reportType: string,
  reportReason?: string
}

Response:
{
  success: boolean,
  message: string
}
```

---

## 📝 实现步骤

### Step 1: 数据库迁移
1. 添加 parent_id 等字段到 post_comments 表
2. 创建 comment_mentions 表
3. 创建 comment_reports 表
4. 创建索引

### Step 2: 实现嵌套评论
1. 创建回复评论 API
2. 创建 CommentTree 组件
3. 实现评论树渲染
4. 添加回复按钮
5. 实现展开/折叠子评论

### Step 3: 实现 @提及功能
1. 创建用户搜索 API
2. 创建 MentionInput 组件
3. 实现 @ 触发用户搜索
4. 实现用户选择
5. 实现 @用户名高亮
6. 创建 @提及通知

### Step 4: 实现评论编辑
1. 创建编辑评论 API
2. 添加编辑按钮
3. 实现编辑表单
4. 添加编辑标记
5. 更新评论显示

### Step 5: 实现评论删除
1. 创建删除评论 API
2. 添加删除按钮
3. 实现删除确认对话框
4. 实现软删除
5. 处理子评论

### Step 6: 实现评论排序
1. 创建 CommentSort 组件
2. 实现排序逻辑
3. 更新评论列表 API
4. 添加排序选项 UI

### Step 7: 实现评论折叠
1. 创建 CollapsibleComment 组件
2. 实现自动折叠逻辑
3. 添加展开/折叠按钮
4. 实现折叠动画

### Step 8: 实现评论举报
1. 创建举报评论 API
2. 添加举报按钮
3. 实现举报表单
4. 创建举报通知

### Step 9: 优化评论加载
1. 实现分页加载
2. 实现懒加载子评论
3. 添加加载状态
4. 优化性能

### Step 10: 测试和优化
1. 测试所有功能
2. 修复 bug
3. 优化性能
4. 改进 UI/UX

---

## 🧪 测试计划

### 嵌套评论测试
- [ ] 回复顶级评论
- [ ] 回复子评论
- [ ] 嵌套层级显示（最多3层）
- [ ] 展开/折叠子评论
- [ ] 查看全部回复

### @提及测试
- [ ] 输入 @ 触发搜索
- [ ] 用户列表显示
- [ ] 选择用户
- [ ] @用户名高亮
- [ ] 点击跳转
- [ ] @通知创建

### 评论编辑测试
- [ ] 编辑自己的评论
- [ ] 无法编辑他人评论
- [ ] 编辑标记显示
- [ ] 编辑时间显示

### 评论删除测试
- [ ] 删除自己的评论
- [ ] 无法删除他人评论
- [ ] 删除确认对话框
- [ ] 软删除验证
- [ ] 子评论处理

### 评论排序测试
- [ ] 最新排序
- [ ] 最早排序
- [ ] 最热排序
- [ ] 最佳排序

### 评论折叠测试
- [ ] 长评论自动折叠
- [ ] 低分评论自动折叠
- [ ] 手动折叠/展开
- [ ] 折叠子评论树

### 评论举报测试
- [ ] 举报评论
- [ ] 举报类型选择
- [ ] 举报原因填写
- [ ] 举报成功提示

---

## ⚠️ 注意事项

### 1. 嵌套层级限制
- 最多3层嵌套，避免过深
- 超过3层的回复显示为同级
- 提供"查看全部回复"功能

### 2. 性能优化
- 懒加载子评论
- 虚拟滚动长列表
- 缓存已加载评论
- 分页加载

### 3. 用户体验
- 加载状态提示
- 错误提示
- 成功提示
- 平滑动画

### 4. 安全性
- 验证用户权限
- 防止 XSS 攻击
- 防止恶意举报
- 限制评论频率

---

## 📊 预期结果

### 用户体验
- ✅ 用户可以回复评论形成讨论
- ✅ 用户可以 @提及其他用户
- ✅ 用户可以编辑和删除自己的评论
- ✅ 用户可以按不同方式排序评论
- ✅ 长评论和低分评论自动折叠
- ✅ 用户可以举报不当评论

### 技术指标
- ✅ 评论加载时间 < 1秒
- ✅ 评论树渲染流畅（60fps）
- ✅ @提及搜索响应 < 300ms
- ✅ 评论编辑/删除成功率 > 99%

---

## 🚀 实施时间表

| 任务 | 预计时间 | 优先级 |
|------|----------|--------|
| 数据库迁移 | 15分钟 | 高 |
| 嵌套评论功能 | 60分钟 | 高 |
| @提及功能 | 45分钟 | 高 |
| 评论编辑功能 | 30分钟 | 高 |
| 评论删除功能 | 20分钟 | 高 |
| 评论排序功能 | 20分钟 | 中 |
| 评论折叠功能 | 30分钟 | 中 |
| 评论举报功能 | 20分钟 | 低 |
| 测试和调试 | 40分钟 | 高 |
| **总计** | **3-4小时** | - |

---

## 📝 成功标准

1. ✅ 嵌套评论正常工作
2. ✅ @提及功能正常
3. ✅ 评论编辑功能正常
4. ✅ 评论删除功能正常
5. ✅ 评论排序正常
6. ✅ 评论折叠正常
7. ✅ 评论举报正常
8. ✅ 所有测试用例通过
9. ✅ 无明显性能问题

---

## 🎯 下一阶段预告

完成第十阶段后，将进入：

### 第十一阶段：版主系统
- 版主角色管理
- 版主权限（置顶、删除、锁定）
- 用户禁言/封禁
- 内容审核队列

---

让我们继续优化评论系统！🚀
