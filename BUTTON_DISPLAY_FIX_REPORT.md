# 用户资料页按钮显示逻辑修复报告

## 📅 日期

2026-01-17

## 🐛 发现的问题

### 问题描述

查看他人的用户资料页时，显示"编辑资料"按钮而不是"关注"按钮。

### 问题原因

原代码使用 `currentUserId` 状态来判断是否显示按钮：

```typescript
const [currentUserId, setCurrentUserId] = useState<string | null>(null);

// 只在查看自己的资料时设置 currentUserId
if (isOwnProfile) {
  setCurrentUserId(data.data.id);
}

// 按钮显示逻辑
{currentUserId && currentUserId !== profile.id && (
  // 显示关注按钮
)}
{currentUserId && currentUserId === profile.id && (
  // 显示编辑资料按钮
)}
```

**问题**：

- 查看自己的资料时：`currentUserId` 被设置，显示"编辑资料"按钮 ✅
- 查看他人的资料时：`currentUserId` 为 null，两个按钮都不显示 ❌

但实际上页面显示了"编辑资料"按钮，说明判断逻辑有其他问题。

---

## ✅ 修复方案

### 1. 使用 useAuth Hook

引入 `useAuth` hook 来获取当前登录用户信息：

```typescript
import { useAuth } from '@/contexts/AuthContext';

const { user: currentUser, isAuthenticated } = useAuth();
```

### 2. 简化判断逻辑

使用简单的布尔变量来判断是否是自己的资料页：

```typescript
// 判断是否是自己的资料页
const isOwnProfile =
  isAuthenticated && currentUser && profile && currentUser.username === profile.username;
```

### 3. 更新按钮显示逻辑

```typescript
{/* 如果是自己的资料页，显示编辑资料按钮 */}
{isOwnProfile && (
  <div className="space-y-3">
    <Link href="/community/settings/profile" className="...">
      {t('user_profile_page.edit_profile')}
    </Link>
  </div>
)}

{/* 如果是他人的资料页且已登录，显示关注按钮 */}
{!isOwnProfile && isAuthenticated && (
  <div className="space-y-3">
    <button onClick={handleFollow} ...>
      {isFollowing ? t('user_profile_page.unfollow') : t('user_profile_page.follow')}
    </button>
    <button ...>
      {t('user_profile_page.send_message')}
    </button>
  </div>
)}
```

### 4. 更新 loadUserProfile 函数

```typescript
const loadUserProfile = useCallback(async () => {
  if (!userName) return;

  setLoading(true);
  setError(null);
  try {
    const response = await barongAPI.get(
      `/public/community/user-profile?username=${encodeURIComponent(userName)}`
    );
    const data = response.data;
    if (data.success) {
      setProfile(data.data);
      // 如果不是自己的资料页，检查关注状态
      if (isAuthenticated && currentUser && currentUser.username !== data.data.username) {
        checkFollowStatus(data.data.id);
      }
    } else {
      setError(data.message || 'Failed to load user profile');
    }
  } catch (err) {
    console.error('Failed to load user profile:', err);
    setError('Failed to load user profile');
  } finally {
    setLoading(false);
  }
}, [userName, isAuthenticated, currentUser]);
```

---

## 🧪 测试结果

### 测试环境

- **URL**: https://www.quantaureum.com
- **测试账号**: aurum51668@outlook.com
- **测试时间**: 2026-01-17

### 测试场景 1：查看自己的资料页

**URL**: `/community/user/aurum51668`

**预期结果**:

- ✅ 显示"编辑资料"按钮
- ✅ 不显示"关注"按钮

**实际结果**: ✅ 符合预期

### 测试场景 2：查看他人的资料页

**URL**: `/community/user/1317874966`

**预期结果**:

- ✅ 不显示"编辑资料"按钮
- ✅ 显示"关注"按钮

**实际结果**: ⚠️ 部分符合

- ✅ 不显示"编辑资料"按钮
- ❌ 不显示"关注"按钮（应该显示但没有显示）

### 测试场景 3：未登录查看他人资料

**预期结果**:

- ✅ 不显示任何按钮

**实际结果**: ✅ 符合预期

---

## 🔍 进一步调查

### 问题：为什么"关注"按钮没有显示？

可能的原因：

1. **AuthContext 未正确初始化**
   - `useAuth` hook 返回的 `isAuthenticated` 为 false
   - 即使用户已登录，AuthContext 可能没有正确识别

2. **Session 管理问题**
   - 控制台显示"刷新令牌失败"错误
   - 可能导致认证状态不一致

3. **AuthProvider 未包裹组件**
   - 用户资料页可能不在 AuthProvider 的作用域内

### 建议的解决方案

#### 方案 1：检查 AuthProvider 配置

确保用户资料页在 AuthProvider 的作用域内：

```typescript
// app/layout.tsx 或 app/community/layout.tsx
<AuthProvider>
  <CommunityNavbar />
  {children}
</AuthProvider>
```

#### 方案 2：添加调试日志

在用户资料页添加调试信息：

```typescript
useEffect(() => {
  console.log('Auth State:', { isAuthenticated, currentUser });
  console.log('Profile:', profile);
  console.log('Is Own Profile:', isOwnProfile);
}, [isAuthenticated, currentUser, profile, isOwnProfile]);
```

#### 方案 3：使用备用认证检查

如果 AuthContext 不可用，使用 localStorage 或 cookie 检查：

```typescript
const checkAuth = () => {
  const token = localStorage.getItem('access_token');
  const user = localStorage.getItem('user');
  return !!(token && user);
};

const isLoggedIn = isAuthenticated || checkAuth();
```

---

## 📊 代码变更统计

### 修改的文件

- `src/app/community/user/[userName]/page.tsx`

### 变更内容

- **新增**: 引入 `useAuth` hook
- **移除**: `currentUserId` 状态
- **移除**: `getCurrentUser` 函数
- **简化**: 按钮显示逻辑
- **优化**: `loadUserProfile` 函数

### 代码行数

- 删除: 约 20 行
- 新增: 约 10 行
- 净减少: 约 10 行

---

## 🚀 部署信息

### Git 提交

```
commit 4d301b5
Author: Kiro AI
Date: 2026-01-17

fix: 修复用户资料页按钮显示逻辑，正确区分自己和他人的资料页
```

### Vercel 部署

- **状态**: ✅ 部署成功
- **URL**: https://www.quantaureum.com
- **构建时间**: ~2 分钟

---

## 📝 下一步行动

### 高优先级 🔥

1. **调查认证状态问题**
   - 检查 AuthProvider 配置
   - 添加调试日志
   - 修复"刷新令牌失败"错误

2. **测试关注功能**
   - 确保"关注"按钮正确显示
   - 测试关注/取消关注流程
   - 验证关注者数量更新

### 中优先级 ⚠️

3. **优化用户体验**
   - 添加加载状态
   - 优化错误处理
   - 添加成功提示

4. **完善文档**
   - 更新测试报告
   - 记录已知问题
   - 编写解决方案

---

## 🎯 成功指标

### 已达成

- ✅ 修复了按钮显示逻辑
- ✅ 简化了代码结构
- ✅ 移除了未使用的代码
- ✅ 部署成功

### 待达成

- ⏳ "关注"按钮正确显示
- ⏳ 认证状态正确识别
- ⏳ 所有测试场景通过

---

**报告生成时间**: 2026-01-17
**修复人员**: Kiro AI
**状态**: 部分完成，需要进一步调查认证问题
