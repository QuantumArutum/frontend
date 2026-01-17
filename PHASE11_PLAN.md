# 第十一阶段计划：版主系统

## 目标
实现完整的版主系统，包括版主角色管理、版主权限、用户管理、内容审核等功能。

---

## 📋 需要实现的功能

### 1. 版主角色管理 👑
**功能描述**: 管理版主角色和权限

**角色类型**:
- ✅ 超级管理员（Super Admin）- 全部权限
- ✅ 管理员（Admin）- 大部分权限
- ✅ 版主（Moderator）- 分类版主权限
- ✅ 普通用户（User）- 基础权限

**实现位置**:
- `src/app/api/v2/barong/public/community/moderators/route.ts` - 版主管理 API

---

### 2. 版主权限系统 🔐
**功能描述**: 定义和管理版主权限

**权限列表**:
- ✅ 置顶帖子（pin_post）
- ✅ 删除帖子（delete_post）
- ✅ 锁定帖子（lock_post）
- ✅ 移动帖子（move_post）
- ✅ 编辑帖子（edit_post）
- ✅ 删除评论（delete_comment）
- ✅ 禁言用户（mute_user）
- ✅ 封禁用户（ban_user）
- ✅ 查看举报（view_reports）
- ✅ 处理举报（handle_reports）
- ✅ 查看日志（view_logs）
- ✅ 管理版主（manage_moderators）

**实现位置**:
- `src/lib/permissions.ts` - 权限定义和检查

---

### 3. 帖子管理功能 📌
**功能描述**: 版主管理帖子的功能

**功能特性**:
- ✅ 置顶帖子（全局置顶/分类置顶）
- ✅ 取消置顶
- ✅ 锁定帖子（禁止评论）
- ✅ 解锁帖子
- ✅ 删除帖子（版主删除）
- ✅ 恢复帖子
- ✅ 移动帖子到其他分类
- ✅ 编辑帖子标题/内容
- ✅ 添加版主标签

**实现位置**:
- `src/app/api/v2/barong/public/community/mod/pin-post/route.ts` - 置顶帖子
- `src/app/api/v2/barong/public/community/mod/lock-post/route.ts` - 锁定帖子
- `src/app/api/v2/barong/public/community/mod/move-post/route.ts` - 移动帖子

---

### 4. 用户管理功能 👥
**功能描述**: 版主管理用户的功能

**功能特性**:
- ✅ 禁言用户（临时/永久）
- ✅ 解除禁言
- ✅ 封禁用户（临时/永久）
- ✅ 解除封禁
- ✅ 查看用户历史
- ✅ 查看用户举报记录
- ✅ 添加用户备注

**实现位置**:
- `src/app/api/v2/barong/public/community/mod/mute-user/route.ts` - 禁言用户
- `src/app/api/v2/barong/public/community/mod/ban-user/route.ts` - 封禁用户

---

### 5. 内容审核队列 📋
**功能描述**: 审核待处理的内容

**审核类型**:
- ✅ 举报的帖子
- ✅ 举报的评论
- ✅ 新用户的帖子（可选）
- ✅ 包含敏感词的内容

**审核操作**:
- ✅ 批准
- ✅ 拒绝
- ✅ 删除
- ✅ 标记为垃圾信息
- ✅ 忽略

**实现位置**:
- `src/app/community/mod/queue/page.tsx` - 审核队列页面
- `src/app/api/v2/barong/public/community/mod/review-queue/route.ts` - 审核队列 API

---

### 6. 举报处理系统 🚩
**功能描述**: 处理用户举报

**举报类型**:
- ✅ 垃圾信息
- ✅ 骚扰辱骂
- ✅ 虚假信息
- ✅ 违规内容
- ✅ 其他

**处理操作**:
- ✅ 查看举报详情
- ✅ 标记为已处理
- ✅ 采取行动（删除/禁言/封禁）
- ✅ 驳回举报
- ✅ 添加处理备注

**实现位置**:
- `src/app/community/mod/reports/page.tsx` - 举报列表页面
- `src/app/api/v2/barong/public/community/mod/handle-report/route.ts` - 处理举报 API

---

### 7. 版主日志系统 📝
**功能描述**: 记录版主操作日志

**日志类型**:
- ✅ 帖子操作（置顶、删除、锁定、移动）
- ✅ 评论操作（删除）
- ✅ 用户操作（禁言、封禁）
- ✅ 举报处理
- ✅ 权限变更

**日志内容**:
- ✅ 操作时间
- ✅ 操作者
- ✅ 操作类型
- ✅ 操作对象
- ✅ 操作原因
- ✅ 操作结果

**实现位置**:
- `src/app/community/mod/logs/page.tsx` - 日志页面
- `src/app/api/v2/barong/public/community/mod/logs/route.ts` - 日志 API

---

### 8. 版主工具栏 🛠️
**功能描述**: 版主专用工具栏

**工具栏功能**:
- ✅ 快速操作按钮
- ✅ 待处理数量提示
- ✅ 快捷键支持
- ✅ 批量操作

**实现位置**:
- `src/components/community/ModToolbar.tsx` - 版主工具栏组件

---

## 🔧 技术实现

### 数据库表结构

#### moderators 表（新建）
```sql
CREATE TABLE IF NOT EXISTS moderators (
  id SERIAL PRIMARY KEY,
  user_id VARCHAR(255) NOT NULL UNIQUE,
  role VARCHAR(50) NOT NULL, -- 'super_admin', 'admin', 'moderator'
  category_id INTEGER, -- NULL 表示全局版主
  permissions JSONB, -- 权限列表
  appointed_by VARCHAR(255),
  appointed_at TIMESTAMP DEFAULT NOW(),
  removed_at TIMESTAMP
);

CREATE INDEX idx_moderators_user_id ON moderators(user_id);
CREATE INDEX idx_moderators_category_id ON moderators(category_id);
CREATE INDEX idx_moderators_role ON moderators(role);
```

#### mod_actions 表（新建）
```sql
CREATE TABLE IF NOT EXISTS mod_actions (
  id SERIAL PRIMARY KEY,
  moderator_id VARCHAR(255) NOT NULL,
  action_type VARCHAR(50) NOT NULL,
  target_type VARCHAR(50) NOT NULL, -- 'post', 'comment', 'user'
  target_id VARCHAR(255) NOT NULL,
  reason TEXT,
  details JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_mod_actions_moderator ON mod_actions(moderator_id);
CREATE INDEX idx_mod_actions_type ON mod_actions(action_type);
CREATE INDEX idx_mod_actions_target ON mod_actions(target_type, target_id);
CREATE INDEX idx_mod_actions_created_at ON mod_actions(created_at);
```

#### user_bans 表（新建）
```sql
CREATE TABLE IF NOT EXISTS user_bans (
  id SERIAL PRIMARY KEY,
  user_id VARCHAR(255) NOT NULL,
  ban_type VARCHAR(50) NOT NULL, -- 'mute', 'ban'
  reason TEXT,
  banned_by VARCHAR(255) NOT NULL,
  banned_at TIMESTAMP DEFAULT NOW(),
  expires_at TIMESTAMP, -- NULL 表示永久
  is_active BOOLEAN DEFAULT TRUE
);

CREATE INDEX idx_user_bans_user_id ON user_bans(user_id);
CREATE INDEX idx_user_bans_is_active ON user_bans(is_active);
CREATE INDEX idx_user_bans_expires_at ON user_bans(expires_at);
```

#### posts 表（添加字段）
```sql
ALTER TABLE posts ADD COLUMN IF NOT EXISTS is_pinned BOOLEAN DEFAULT FALSE;
ALTER TABLE posts ADD COLUMN IF NOT EXISTS pin_type VARCHAR(50); -- 'global', 'category'
ALTER TABLE posts ADD COLUMN IF NOT EXISTS is_locked BOOLEAN DEFAULT FALSE;
ALTER TABLE posts ADD COLUMN IF NOT EXISTS locked_by VARCHAR(255);
ALTER TABLE posts ADD COLUMN IF NOT EXISTS locked_at TIMESTAMP;
ALTER TABLE posts ADD COLUMN IF NOT EXISTS mod_note TEXT;
```

---

### API 端点

#### 1. 版主管理 API
```typescript
// 获取版主列表
GET /api/v2/barong/public/community/moderators

// 添加版主
POST /api/v2/barong/public/community/moderators
{
  userId: string,
  role: 'admin' | 'moderator',
  categoryId?: number,
  permissions: string[]
}

// 移除版主
DELETE /api/v2/barong/public/community/moderators/{userId}

// 更新版主权限
PUT /api/v2/barong/public/community/moderators/{userId}
{
  permissions: string[]
}
```

#### 2. 帖子管理 API
```typescript
// 置顶帖子
POST /api/v2/barong/public/community/mod/pin-post
{
  postId: number,
  pinType: 'global' | 'category',
  reason?: string
}

// 锁定帖子
POST /api/v2/barong/public/community/mod/lock-post
{
  postId: number,
  reason?: string
}

// 移动帖子
POST /api/v2/barong/public/community/mod/move-post
{
  postId: number,
  categoryId: number,
  reason?: string
}
```

#### 3. 用户管理 API
```typescript
// 禁言用户
POST /api/v2/barong/public/community/mod/mute-user
{
  userId: string,
  duration?: number, // 分钟，NULL 表示永久
  reason: string
}

// 封禁用户
POST /api/v2/barong/public/community/mod/ban-user
{
  userId: string,
  duration?: number, // 分钟，NULL 表示永久
  reason: string
}

// 解除禁言/封禁
DELETE /api/v2/barong/public/community/mod/unban-user/{userId}
```

#### 4. 审核队列 API
```typescript
// 获取审核队列
GET /api/v2/barong/public/community/mod/review-queue?type={type}&page={page}

// 处理审核项
POST /api/v2/barong/public/community/mod/review-item
{
  itemId: number,
  itemType: 'post' | 'comment',
  action: 'approve' | 'reject' | 'delete' | 'spam',
  reason?: string
}
```

#### 5. 举报处理 API
```typescript
// 获取举报列表
GET /api/v2/barong/public/community/mod/reports?status={status}&page={page}

// 处理举报
POST /api/v2/barong/public/community/mod/handle-report
{
  reportId: number,
  action: 'delete' | 'mute' | 'ban' | 'dismiss',
  reason?: string
}
```

#### 6. 版主日志 API
```typescript
// 获取版主日志
GET /api/v2/barong/public/community/mod/logs?moderatorId={id}&actionType={type}&page={page}
```

---

## 📝 实现步骤

### Step 1: 数据库迁移
1. 创建 moderators 表
2. 创建 mod_actions 表
3. 创建 user_bans 表
4. 添加字段到 posts 表
5. 创建索引

### Step 2: 实现权限系统
1. 创建权限定义文件
2. 实现权限检查函数
3. 创建权限中间件
4. 集成到 API 路由

### Step 3: 实现版主管理
1. 创建版主管理 API
2. 创建版主管理页面
3. 实现添加/移除版主
4. 实现权限配置

### Step 4: 实现帖子管理
1. 创建置顶帖子 API
2. 创建锁定帖子 API
3. 创建移动帖子 API
4. 添加版主操作按钮到帖子详情页

### Step 5: 实现用户管理
1. 创建禁言用户 API
2. 创建封禁用户 API
3. 创建用户管理页面
4. 实现用户历史查看

### Step 6: 实现审核队列
1. 创建审核队列 API
2. 创建审核队列页面
3. 实现审核操作
4. 添加审核通知

### Step 7: 实现举报处理
1. 创建举报处理 API
2. 创建举报列表页面
3. 实现举报处理操作
4. 添加处理日志

### Step 8: 实现版主日志
1. 创建日志记录函数
2. 创建日志 API
3. 创建日志页面
4. 实现日志过滤和搜索

### Step 9: 实现版主工具栏
1. 创建版主工具栏组件
2. 添加快速操作按钮
3. 实现待处理数量提示
4. 添加快捷键支持

### Step 10: 测试和优化
1. 测试所有功能
2. 测试权限系统
3. 修复 bug
4. 优化性能

---

## 🧪 测试计划

### 权限系统测试
- [ ] 超级管理员权限
- [ ] 管理员权限
- [ ] 版主权限
- [ ] 普通用户权限
- [ ] 权限检查

### 帖子管理测试
- [ ] 置顶帖子
- [ ] 取消置顶
- [ ] 锁定帖子
- [ ] 解锁帖子
- [ ] 移动帖子
- [ ] 删除帖子

### 用户管理测试
- [ ] 禁言用户
- [ ] 解除禁言
- [ ] 封禁用户
- [ ] 解除封禁
- [ ] 查看用户历史

### 审核队列测试
- [ ] 查看审核队列
- [ ] 批准内容
- [ ] 拒绝内容
- [ ] 删除内容
- [ ] 标记垃圾信息

### 举报处理测试
- [ ] 查看举报列表
- [ ] 处理举报
- [ ] 驳回举报
- [ ] 添加处理备注

### 版主日志测试
- [ ] 查看日志
- [ ] 过滤日志
- [ ] 搜索日志
- [ ] 导出日志

---

## ⚠️ 注意事项

### 1. 权限安全
- 严格验证版主权限
- 防止权限提升攻击
- 记录所有敏感操作
- 定期审计权限

### 2. 操作日志
- 记录所有版主操作
- 包含详细信息
- 不可删除或修改
- 定期备份

### 3. 用户体验
- 清晰的操作提示
- 确认对话框
- 操作结果反馈
- 撤销功能（部分操作）

### 4. 性能优化
- 缓存权限信息
- 批量操作支持
- 分页加载
- 索引优化

---

## 📊 预期结果

### 版主功能
- ✅ 版主可以管理帖子和评论
- ✅ 版主可以管理用户
- ✅ 版主可以处理举报
- ✅ 版主可以查看审核队列
- ✅ 版主可以查看操作日志

### 技术指标
- ✅ 权限检查时间 < 10ms
- ✅ 版主操作响应时间 < 500ms
- ✅ 日志记录成功率 > 99.9%
- ✅ 审核队列加载时间 < 1秒

---

## 🚀 实施时间表

| 任务 | 预计时间 | 优先级 |
|------|----------|--------|
| 数据库迁移 | 20分钟 | 高 |
| 权限系统 | 45分钟 | 高 |
| 版主管理 | 30分钟 | 高 |
| 帖子管理 | 45分钟 | 高 |
| 用户管理 | 45分钟 | 高 |
| 审核队列 | 40分钟 | 中 |
| 举报处理 | 30分钟 | 中 |
| 版主日志 | 30分钟 | 中 |
| 版主工具栏 | 20分钟 | 低 |
| 测试和调试 | 45分钟 | 高 |
| **总计** | **4-5小时** | - |

---

## 📝 成功标准

1. ✅ 权限系统正常工作
2. ✅ 版主管理功能正常
3. ✅ 帖子管理功能正常
4. ✅ 用户管理功能正常
5. ✅ 审核队列正常
6. ✅ 举报处理正常
7. ✅ 版主日志正常
8. ✅ 所有测试用例通过
9. ✅ 无安全漏洞

---

## 🎯 下一阶段预告

完成第十一阶段后，将进入：

### 第十二阶段：投票系统
- 踩/反对功能
- 投票数显示
- 热度算法
- 争议帖子标记

---

让我们构建强大的版主系统！🚀
