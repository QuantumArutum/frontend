# 帖子详情页调试报告

## 测试时间
2026-01-17

## 问题描述
帖子详情页访问超时（60秒），用户无法查看帖子详情和评论。

---

## 测试结果

### ✅ 正常功能
1. **社区首页** - 加载正常，显示真实数据
2. **帖子列表** - 显示3个测试帖子
3. **用户登录** - 已登录用户 1317874966
4. **导航栏** - 所有链接正常

### ❌ 问题功能
1. **点击帖子链接** - 没有反应，页面不跳转
2. **直接访问帖子详情页** - 超时60秒后失败
3. **URL**: `https://www.quantaureum.com/community/posts/3`

---

## 已尝试的修复

### 修复 1: 移除 useAuth 依赖（提交 f297f50）
**问题**: 使用 `useAuth()` hook 可能导致服务器端渲染问题

**修复**:
- 移除 `useAuth()` hook
- 改用 localStorage 直接检查登录状态
- 与其他社区页面保持一致

**结果**: ❌ 问题仍然存在

---

### 修复 2: 合并 useEffect 和修复异步加载（提交 44e01be）
**问题**: 
- 两个独立的 useEffect 可能导致竞态条件
- `loadPostDetail` 和 `loadComments` 依赖 `userInfo` 状态
- `userInfo` 在第一个 useEffect 中异步设置

**修复**:
- 合并认证检查和数据加载到单个 useEffect
- 直接传递 `currentUserId` 给加载函数
- 修复评论点赞的回滚逻辑
- 防止竞态条件

**结果**: ⏳ 待测试（刚部署）

---

## 可能的根本原因

### 1. 服务器端渲染问题 🔴
**可能性**: 高

**症状**:
- 页面在服务器端尝试渲染
- localStorage 在服务器端不可用
- 导致渲染失败或超时

**证据**:
- 页面标记为 `'use client'`
- 但 Next.js 可能仍尝试服务器端渲染
- 超时时间正好是 60 秒（Vercel serverless 函数默认超时）

**可能的解决方案**:
```typescript
// 添加到页面顶部
export const dynamic = 'force-dynamic';
// 或
export const runtime = 'edge';
```

---

### 2. API 路由问题 🟡
**可能性**: 中

**症状**:
- post-detail 或 post-comments API 可能有问题
- 数据库查询可能超时

**需要检查**:
- 直接测试 API 端点
- 查看 Vercel 函数日志
- 检查数据库查询性能

**测试命令**:
```bash
curl "https://www.quantaureum.com/api/v2/barong/public/community/post-detail?postId=3"
```

---

### 3. 数据库连接问题 🟡
**可能性**: 中

**症状**:
- Neon PostgreSQL 连接超时
- 查询执行时间过长

**需要检查**:
- 数据库连接池配置
- 查询是否有索引
- 是否有死锁

---

### 4. Next.js 动态路由配置 🟢
**可能性**: 低

**症状**:
- `[postId]` 动态路由可能配置不正确

**已确认**:
- 文件路径正确: `src/app/community/posts/[postId]/page.tsx`
- 使用 `useParams()` 获取 postId
- 应该没有问题

---

## 下一步调试步骤

### 步骤 1: 等待部署完成
- 等待 Vercel 部署最新修复（44e01be）
- 预计时间: 2-3 分钟

### 步骤 2: 测试修复后的页面
```bash
# 使用浏览器访问
https://www.quantaureum.com/community/posts/3
```

### 步骤 3: 如果仍然超时，测试 API
```bash
# 测试帖子详情 API
curl "https://www.quantaureum.com/api/v2/barong/public/community/post-detail?postId=3"

# 测试评论 API
curl "https://www.quantaureum.com/api/v2/barong/public/community/post-comments?postId=3"
```

### 步骤 4: 查看 Vercel 日志
1. 访问 https://vercel.com/quantumarutum/frontend/deployments
2. 点击最新部署
3. 查看 Function Logs
4. 搜索错误信息

### 步骤 5: 如果 API 正常但页面超时
添加服务器端渲染配置：

```typescript
// src/app/community/posts/[postId]/page.tsx
// 在文件顶部添加
export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';
```

### 步骤 6: 如果仍然失败
考虑完全重构为纯客户端渲染：

```typescript
// 创建一个简单的加载页面
export default function PostDetailPage() {
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);
  
  if (!mounted) {
    return <div>Loading...</div>;
  }
  
  return <PostDetailContent />;
}
```

---

## 临时解决方案

如果无法快速修复，可以考虑：

### 方案 A: 禁用帖子详情页
- 暂时移除帖子链接
- 显示"功能开发中"提示
- 优先实现其他功能

### 方案 B: 简化帖子详情页
- 移除评论功能
- 只显示帖子内容
- 先让基本功能可用

### 方案 C: 使用模态框
- 在当前页面显示帖子详情
- 不跳转到新页面
- 避免路由问题

---

## 技术细节

### 当前页面配置
```typescript
'use client';  // 客户端组件

export default function PostDetailPage() {
  const params = useParams();
  const postId = params.postId as string;
  
  useEffect(() => {
    // 检查登录 + 加载数据
  }, [postId]);
}
```

### API 调用
```typescript
// 帖子详情
GET /api/v2/barong/public/community/post-detail?postId=3&currentUserId=xxx

// 评论列表
GET /api/v2/barong/public/community/post-comments?postId=3&currentUserId=xxx
```

### 数据库查询
```sql
-- 帖子详情
SELECT p.*, c.name as category_name, c.slug as category_slug
FROM posts p
LEFT JOIN categories c ON p.category_id = c.id
WHERE p.id = $1

-- 评论列表
SELECT pc.*, u.email
FROM post_comments pc
LEFT JOIN users u ON pc.user_id = u.uid
WHERE pc.post_id = $1
ORDER BY pc.created_at DESC
```

---

## 预期结果

### 如果修复成功
- ✅ 页面在 3 秒内加载
- ✅ 显示帖子内容
- ✅ 显示评论列表
- ✅ 点赞功能正常
- ✅ 评论功能正常

### 如果仍然失败
- 需要查看 Vercel 日志
- 可能需要添加服务器端渲染配置
- 可能需要重构页面结构

---

## 相关文件

### 前端
- `src/app/community/posts/[postId]/page.tsx` - 帖子详情页
- `src/components/community/CommunityNavbar.tsx` - 导航栏
- `src/api/client.ts` - API 客户端

### 后端 API
- `src/app/api/v2/barong/public/community/post-detail/route.ts`
- `src/app/api/v2/barong/public/community/post-comments/route.ts`
- `src/app/api/v2/barong/public/community/like-post/route.ts`
- `src/app/api/v2/barong/public/community/post-comment/route.ts`
- `src/app/api/v2/barong/public/community/like-comment/route.ts`

---

## 结论

帖子详情页的超时问题比预期复杂。已尝试两次修复但问题仍然存在。下一步需要：

1. ⏳ 等待最新修复部署
2. 🔍 测试 API 端点是否正常
3. 📋 查看 Vercel 函数日志
4. 🔧 根据日志信息进一步调试

如果问题持续存在，可能需要考虑添加服务器端渲染配置或完全重构页面结构。
