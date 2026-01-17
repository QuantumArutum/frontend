# 第八阶段计划：通知触发逻辑

## 目标
实现完整的通知触发逻辑，让用户在互动时自动收到通知。

---

## 📋 需要实现的功能

### 1. 评论通知 🔔
**触发时机**: 用户发表评论时  
**通知对象**: 帖子作者  
**通知类型**: `comment`  
**通知内容**: "{用户名} 评论了你的帖子"

**实现位置**: 
- `src/app/api/v2/barong/public/community/post-comment/route.ts`

---

### 2. 点赞帖子通知 ❤️
**触发时机**: 用户点赞帖子时  
**通知对象**: 帖子作者  
**通知类型**: `like`  
**通知内容**: "{用户名} 赞了你的帖子"

**实现位置**: 
- `src/app/api/v2/barong/public/community/like-post/route.ts`

---

### 3. 点赞评论通知 ❤️
**触发时机**: 用户点赞评论时  
**通知对象**: 评论作者  
**通知类型**: `like`  
**通知内容**: "{用户名} 赞了你的评论"

**实现位置**: 
- `src/app/api/v2/barong/public/community/like-comment/route.ts`

---

### 4. 关注通知 👥
**触发时机**: 用户关注其他用户时  
**通知对象**: 被关注的用户  
**通知类型**: `follow`  
**通知内容**: "{用户名} 关注了你"

**实现位置**: 
- `src/app/api/v2/barong/public/community/follow/route.ts`

---

## 🔧 技术实现

### 数据库表结构
```sql
CREATE TABLE notifications (
  id SERIAL PRIMARY KEY,
  user_id VARCHAR(255) NOT NULL,        -- 接收通知的用户
  type VARCHAR(50) NOT NULL,            -- 通知类型: like, comment, follow, mention
  title VARCHAR(255) NOT NULL,          -- 通知标题
  content TEXT,                         -- 通知内容
  link VARCHAR(500),                    -- 跳转链接
  actor_id VARCHAR(255),                -- 触发通知的用户ID
  actor_name VARCHAR(255),              -- 触发通知的用户名
  is_read BOOLEAN DEFAULT FALSE,        -- 是否已读
  created_at TIMESTAMP DEFAULT NOW()    -- 创建时间
);
```

### 通知创建函数
```typescript
async function createNotification({
  userId: string,           // 接收者ID
  type: string,            // 通知类型
  title: string,           // 标题
  content: string,         // 内容
  link: string,            // 链接
  actorId: string,         // 触发者ID
  actorName: string        // 触发者名称
}) {
  await sql`
    INSERT INTO notifications (
      user_id, type, title, content, link, 
      actor_id, actor_name, is_read, created_at
    ) VALUES (
      ${userId}, ${type}, ${title}, ${content}, ${link},
      ${actorId}, ${actorName}, false, NOW()
    )
  `;
}
```

---

## 📝 实现步骤

### Step 1: 评论通知
1. 打开 `post-comment/route.ts`
2. 在评论创建成功后，获取帖子作者ID
3. 如果评论者不是帖子作者，创建通知
4. 测试评论功能

### Step 2: 点赞帖子通知
1. 打开 `like-post/route.ts`
2. 在点赞成功后，获取帖子作者ID
3. 如果点赞者不是帖子作者，创建通知
4. 测试点赞功能

### Step 3: 点赞评论通知
1. 打开 `like-comment/route.ts`
2. 在点赞成功后，获取评论作者ID
3. 如果点赞者不是评论作者，创建通知
4. 测试点赞评论功能

### Step 4: 关注通知
1. 打开 `follow/route.ts`
2. 在关注成功后，创建通知
3. 测试关注功能

### Step 5: 全面测试
1. 测试所有通知触发场景
2. 验证通知列表显示
3. 验证未读数量更新
4. 验证通知链接跳转

---

## ⚠️ 注意事项

### 1. 避免自我通知
- 用户评论自己的帖子 → 不创建通知
- 用户点赞自己的帖子/评论 → 不创建通知
- 用户关注自己 → 不创建通知（应该在前端阻止）

### 2. 错误处理
- 通知创建失败不应影响主要功能
- 使用 try-catch 包裹通知创建逻辑
- 记录错误日志但不返回错误

### 3. 性能考虑
- 通知创建应该是异步的
- 不阻塞主要功能的响应
- 考虑批量创建通知

---

## 🧪 测试计划

### 评论通知测试
- [ ] 用户A评论用户B的帖子 → 用户B收到通知
- [ ] 用户A评论自己的帖子 → 不创建通知
- [ ] 通知内容正确
- [ ] 通知链接正确
- [ ] 未读数量更新

### 点赞通知测试
- [ ] 用户A点赞用户B的帖子 → 用户B收到通知
- [ ] 用户A点赞自己的帖子 → 不创建通知
- [ ] 用户A点赞用户B的评论 → 用户B收到通知
- [ ] 用户A点赞自己的评论 → 不创建通知
- [ ] 取消点赞不创建通知

### 关注通知测试
- [ ] 用户A关注用户B → 用户B收到通知
- [ ] 取消关注不创建通知
- [ ] 通知内容正确

### 通知系统测试
- [ ] 通知列表正确显示
- [ ] 未读数量正确
- [ ] 标记已读功能正常
- [ ] 删除通知功能正常
- [ ] 通知链接跳转正确

---

## 📊 预期结果

### 用户体验
- ✅ 用户收到及时的互动通知
- ✅ 通知内容清晰明了
- ✅ 点击通知可以跳转到相关内容
- ✅ 未读通知数量实时更新

### 技术指标
- ✅ 通知创建成功率 > 99%
- ✅ 通知创建不影响主功能性能
- ✅ 通知列表加载时间 < 1秒
- ✅ 未读数量更新延迟 < 30秒

---

## 🚀 实施时间表

| 任务 | 预计时间 | 优先级 |
|------|----------|--------|
| 评论通知 | 20分钟 | 高 |
| 点赞帖子通知 | 15分钟 | 高 |
| 点赞评论通知 | 15分钟 | 中 |
| 关注通知 | 10分钟 | 中 |
| 测试和调试 | 30分钟 | 高 |
| **总计** | **1.5小时** | - |

---

## 📝 成功标准

1. ✅ 所有4种通知类型都能正常触发
2. ✅ 通知内容准确无误
3. ✅ 通知链接跳转正确
4. ✅ 未读数量实时更新
5. ✅ 不会创建自我通知
6. ✅ 通过所有测试用例

---

## 🎯 下一阶段预告

完成第八阶段后，可以考虑：

### 第九阶段：完善发帖功能
- Markdown 编辑器
- 图片上传
- 代码高亮
- 草稿保存
- 帖子编辑/删除

### 第十阶段：私信系统
- 私信 API
- 私信列表
- 会话管理
- 实时消息

---

让我们开始实现吧！🚀
