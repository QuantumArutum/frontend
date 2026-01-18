# Phase 14: 私信系统实现计划

**开始时间:** 2026年1月18日  
**预计时间:** 3-4 小时  
**优先级:** ⭐⭐⭐⭐ 重要

---

## 🎯 目标

实现完整的私信系统，让用户可以进行一对一的私密交流，提升社区互动性和用户粘性。

---

## 📋 功能清单

### 1. 私信发送

#### 1.1 发送私信
- [ ] 发送文本消息
- [ ] 发送图片
- [ ] 发送链接
- [ ] 消息验证
- [ ] 防止垃圾消息

#### 1.2 消息编辑
- [ ] 编辑已发送消息
- [ ] 删除消息
- [ ] 撤回消息（限时）
- [ ] 消息历史记录

### 2. 私信列表

#### 2.1 会话列表
- [ ] 显示所有会话
- [ ] 最新消息预览
- [ ] 未读消息数量
- [ ] 最后消息时间
- [ ] 会话排序

#### 2.2 会话管理
- [ ] 删除会话
- [ ] 归档会话
- [ ] 置顶会话
- [ ] 标记已读/未读
- [ ] 搜索会话

### 3. 消息详情

#### 3.1 消息显示
- [ ] 消息列表
- [ ] 消息时间
- [ ] 已读状态
- [ ] 消息分组
- [ ] 滚动加载

#### 3.2 消息交互
- [ ] 发送消息
- [ ] 实时更新
- [ ] 输入状态提示
- [ ] 消息通知

### 4. 已读状态

#### 4.1 已读标记
- [ ] 自动标记已读
- [ ] 显示已读状态
- [ ] 已读时间
- [ ] 已读回执

#### 4.2 未读管理
- [ ] 未读消息数量
- [ ] 未读消息提醒
- [ ] 标记全部已读
- [ ] 未读消息过滤

### 5. 消息通知

#### 5.1 实时通知
- [ ] 新消息通知
- [ ] 桌面通知
- [ ] 声音提醒
- [ ] 通知设置

#### 5.2 通知管理
- [ ] 通知开关
- [ ] 免打扰模式
- [ ] 通知过滤
- [ ] 通知历史

### 6. 隐私设置

#### 6.1 消息权限
- [ ] 谁可以发消息
- [ ] 黑名单管理
- [ ] 消息过滤
- [ ] 举报功能

#### 6.2 隐私保护
- [ ] 消息加密
- [ ] 阅后即焚
- [ ] 消息保存期限
- [ ] 数据导出

---

## 🗄️ 数据库设计

### 1. 私信表

```sql
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
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_dm_sender ON direct_messages(sender_id);
CREATE INDEX idx_dm_receiver ON direct_messages(receiver_id);
CREATE INDEX idx_dm_created ON direct_messages(created_at DESC);
CREATE INDEX idx_dm_read ON direct_messages(is_read);
```

### 2. 会话表

```sql
CREATE TABLE IF NOT EXISTS conversations (
  id SERIAL PRIMARY KEY,
  user1_id VARCHAR(50) NOT NULL,
  user2_id VARCHAR(50) NOT NULL,
  last_message_id INTEGER REFERENCES direct_messages(id),
  last_message_at TIMESTAMP,
  user1_unread_count INTEGER DEFAULT 0,
  user2_unread_count INTEGER DEFAULT 0,
  user1_archived BOOLEAN DEFAULT FALSE,
  user2_archived BOOLEAN DEFAULT FALSE,
  user1_pinned BOOLEAN DEFAULT FALSE,
  user2_pinned BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user1_id, user2_id)
);

CREATE INDEX idx_conv_user1 ON conversations(user1_id);
CREATE INDEX idx_conv_user2 ON conversations(user2_id);
CREATE INDEX idx_conv_last_message ON conversations(last_message_at DESC);
```

### 3. 消息通知表

```sql
CREATE TABLE IF NOT EXISTS message_notifications (
  id SERIAL PRIMARY KEY,
  user_id VARCHAR(50) NOT NULL,
  message_id INTEGER REFERENCES direct_messages(id) ON DELETE CASCADE,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_msg_notif_user ON message_notifications(user_id);
CREATE INDEX idx_msg_notif_read ON message_notifications(is_read);
```

### 4. 黑名单表

```sql
CREATE TABLE IF NOT EXISTS message_blacklist (
  id SERIAL PRIMARY KEY,
  user_id VARCHAR(50) NOT NULL,
  blocked_user_id VARCHAR(50) NOT NULL,
  reason TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, blocked_user_id)
);

CREATE INDEX idx_blacklist_user ON message_blacklist(user_id);
CREATE INDEX idx_blacklist_blocked ON message_blacklist(blocked_user_id);
```

---

## 🔧 API 设计

### 1. 发送消息 API

#### POST /api/v2/barong/public/community/messages/send
```typescript
{
  receiverId: string;
  content: string;
  messageType?: 'text' | 'image' | 'link';
}

// 响应
{
  success: boolean;
  data: {
    message: Message;
    conversation: Conversation;
  };
}
```

### 2. 获取会话列表 API

#### GET /api/v2/barong/public/community/messages/conversations
```typescript
{
  page?: number;
  limit?: number;
  archived?: boolean;
}

// 响应
{
  success: boolean;
  data: {
    conversations: Conversation[];
    total: number;
    unreadTotal: number;
  };
}
```

### 3. 获取会话消息 API

#### GET /api/v2/barong/public/community/messages/conversation/:userId
```typescript
{
  page?: number;
  limit?: number;
  before?: number; // message_id
}

// 响应
{
  success: boolean;
  data: {
    messages: Message[];
    hasMore: boolean;
  };
}
```

### 4. 标记已读 API

#### POST /api/v2/barong/public/community/messages/mark-read
```typescript
{
  conversationUserId: string;
  messageIds?: number[];
}

// 响应
{
  success: boolean;
  data: {
    markedCount: number;
  };
}
```

### 5. 删除消息 API

#### DELETE /api/v2/barong/public/community/messages/:messageId
```typescript
// 响应
{
  success: boolean;
  message: string;
}
```

### 6. 删除会话 API

#### DELETE /api/v2/barong/public/community/messages/conversation/:userId
```typescript
// 响应
{
  success: boolean;
  message: string;
}
```

### 7. 黑名单管理 API

#### POST /api/v2/barong/public/community/messages/block
```typescript
{
  blockedUserId: string;
  reason?: string;
}
```

#### DELETE /api/v2/barong/public/community/messages/block/:userId
```typescript
// 取消拉黑
```

#### GET /api/v2/barong/public/community/messages/blocked
```typescript
// 获取黑名单列表
```

---

## 🎨 前端组件设计

### 1. MessageList 组件

```typescript
// src/components/community/MessageList.tsx
interface MessageListProps {
  currentUserId: string;
  onConversationClick: (userId: string) => void;
}

// 功能：
// - 显示会话列表
// - 未读消息数量
// - 最新消息预览
// - 会话搜索
// - 会话操作（删除、归档、置顶）
```

### 2. MessageThread 组件

```typescript
// src/components/community/MessageThread.tsx
interface MessageThreadProps {
  currentUserId: string;
  otherUserId: string;
  onBack: () => void;
}

// 功能：
// - 显示消息列表
// - 发送消息
// - 滚动加载
// - 已读状态
// - 消息操作
```

### 3. MessageInput 组件

```typescript
// src/components/community/MessageInput.tsx
interface MessageInputProps {
  onSend: (content: string) => void;
  placeholder?: string;
  disabled?: boolean;
}

// 功能：
// - 文本输入
// - 图片上传
// - Emoji 选择
// - 发送按钮
// - 输入验证
```

### 4. MessageBubble 组件

```typescript
// src/components/community/MessageBubble.tsx
interface MessageBubbleProps {
  message: Message;
  isSender: boolean;
  showAvatar?: boolean;
}

// 功能：
// - 消息气泡
// - 发送者/接收者样式
// - 时间显示
// - 已读状态
// - 消息操作菜单
```

### 5. ConversationItem 组件

```typescript
// src/components/community/ConversationItem.tsx
interface ConversationItemProps {
  conversation: Conversation;
  onClick: () => void;
  onDelete: () => void;
}

// 功能：
// - 会话项显示
// - 用户头像
// - 最新消息
// - 未读数量
// - 时间显示
```

---

## 🔄 实现步骤

### Step 1: 数据库设计（30分钟）

1. 创建私信表
2. 创建会话表
3. 创建通知表
4. 创建黑名单表
5. 创建索引和触发器

### Step 2: 后端 API（90分钟）

1. 发送消息 API
2. 获取会话列表 API
3. 获取会话消息 API
4. 标记已读 API
5. 删除消息 API
6. 删除会话 API
7. 黑名单管理 API

### Step 3: 前端组件（60分钟）

1. MessageList 组件
2. MessageThread 组件
3. MessageInput 组件
4. MessageBubble 组件
5. ConversationItem 组件

### Step 4: 页面集成（30分钟）

1. 私信列表页面
2. 私信详情页面
3. 导航集成
4. 通知集成

### Step 5: 测试优化（30分钟）

1. 功能测试
2. 性能测试
3. UI/UX 优化
4. 错误处理

---

## ✅ 验收标准

### 功能验收

- [ ] 用户可以发送私信
- [ ] 用户可以查看会话列表
- [ ] 用户可以查看消息详情
- [ ] 消息已读状态正确
- [ ] 未读消息数量准确
- [ ] 可以删除消息和会话
- [ ] 黑名单功能正常
- [ ] 消息通知正常

### 性能验收

- [ ] 消息发送响应 < 500ms
- [ ] 会话列表加载 < 1s
- [ ] 消息列表滚动流畅
- [ ] 数据库查询优化

### UI/UX 验收

- [ ] 界面美观清晰
- [ ] 操作流畅自然
- [ ] 反馈及时明确
- [ ] 移动端适配良好

---

## 📊 预期效果

### 用户互动

- 用户可以私密交流
- 提升用户粘性
- 增强社区活跃度
- 促进用户关系

### 社区价值

- 完善社交功能
- 提升用户体验
- 增加使用时长
- 提高留存率

---

## 🎯 成功指标

| 指标 | 目标 | 测量方式 |
|------|------|---------|
| 功能完成度 | 100% | 功能清单 |
| API 响应时间 | < 500ms | 性能监控 |
| 消息发送成功率 | > 99% | 数据分析 |
| 代码质量 | 9/10 | 代码审查 |
| 用户满意度 | > 85% | 用户反馈 |

---

## 📅 时间表

| 阶段 | 时间 | 负责人 |
|------|------|--------|
| 数据库设计 | 30分钟 | Kiro AI |
| 后端 API | 90分钟 | Kiro AI |
| 前端组件 | 60分钟 | Kiro AI |
| 页面集成 | 30分钟 | Kiro AI |
| 测试优化 | 30分钟 | Kiro AI |
| **总计** | **4小时** | |

---

## 🚀 开始实施

准备好开始 Phase 14 的实施了吗？

**下一步:**
1. 创建数据库迁移脚本
2. 实现后端 API
3. 开发前端组件
4. 集成到页面
5. 测试和部署

让我们开始吧！🎉
