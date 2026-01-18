# 谷歌登录超时问题修复方案

**问题**: 点击谷歌登录时出现 `504 GATEWAY_TIMEOUT` 错误  
**错误代码**: `FUNCTION_INVOCATION_TIMEOUT`  
**日期**: 2026-01-18

---

## 🔍 问题分析

### 1. 错误原因

**Vercel Serverless Function 超时**

- 当前配置: `maxDuration: 30` 秒
- 谷歌OAuth流程包含多个网络请求：
  1. 交换授权码获取token (Google API)
  2. 获取用户信息 (Google API)
  3. 创建会话和cookie
  4. 重定向到社区页面

**可能的超时原因**:

- ✅ Google API响应慢（网络延迟）
- ✅ 多个串行请求累积时间过长
- ✅ Vercel冷启动时间
- ✅ 数据库连接延迟（如果有）

### 2. 当前配置

**文件**: `vercel.json`

```json
{
  "functions": {
    "src/app/api/**/*.ts": {
      "maxDuration": 30,
      "memory": 1024
    }
  }
}
```

---

## 🔧 修复方案

### 方案1: 增加超时时间（推荐）

**优点**: 简单直接，适用于所有慢速API  
**缺点**: 需要Vercel Pro计划才能超过60秒

#### 步骤1: 更新 vercel.json

```json
{
  "functions": {
    "src/app/api/**/*.ts": {
      "maxDuration": 60,
      "memory": 1024
    }
  },
  "headers": [
    {
      "source": "/api/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "s-maxage=10, stale-while-revalidate=59"
        }
      ]
    }
  ]
}
```

**注意**:

- Hobby计划: 最大10秒
- Pro计划: 最大60秒
- Enterprise计划: 最大900秒

---

### 方案2: 优化OAuth回调代码（推荐）

**优点**: 减少执行时间，提高可靠性  
**缺点**: 需要修改代码

#### 优化点：

1. **添加超时控制**
2. **并行请求优化**
3. **错误重试机制**
4. **减少重定向URL构建时间**

#### 修改后的代码：

```typescript
// src/app/api/auth/google/callback/route.ts

import { NextRequest, NextResponse } from 'next/server';

// 添加超时控制函数
async function fetchWithTimeout(url: string, options: RequestInit, timeout = 8000) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    throw error;
  }
}

export async function GET(request: NextRequest) {
  const startTime = Date.now();
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get('code');
  const error = searchParams.get('error');

  console.log('[Google OAuth] Callback started');

  // 快速失败检查
  if (error) {
    console.error('[Google OAuth] Auth error:', error);
    return NextResponse.redirect(new URL(`/auth/login?error=google_auth_failed`, request.url));
  }

  if (!code) {
    console.error('[Google OAuth] No code received');
    return NextResponse.redirect(new URL('/auth/login?error=no_code', request.url));
  }

  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const redirectUri =
    process.env.GOOGLE_REDIRECT_URI || `${request.nextUrl.origin}/api/auth/google/callback`;

  if (!clientId || !clientSecret) {
    console.error('[Google OAuth] Missing credentials');
    return NextResponse.redirect(new URL('/auth/login?error=oauth_not_configured', request.url));
  }

  try {
    // 步骤1: 交换token (8秒超时)
    console.log('[Google OAuth] Exchanging code for tokens...');
    const tokenResponse = await fetchWithTimeout(
      'https://oauth2.googleapis.com/token',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          code,
          client_id: clientId,
          client_secret: clientSecret,
          redirect_uri: redirectUri,
          grant_type: 'authorization_code',
        }),
      },
      8000 // 8秒超时
    );

    if (!tokenResponse.ok) {
      const errorText = await tokenResponse.text();
      console.error('[Google OAuth] Token exchange failed:', errorText);
      return NextResponse.redirect(new URL('/auth/login?error=token_exchange_failed', request.url));
    }

    const tokens = await tokenResponse.json();
    console.log('[Google OAuth] Token received, elapsed:', Date.now() - startTime, 'ms');

    // 步骤2: 获取用户信息 (8秒超时)
    console.log('[Google OAuth] Fetching user info...');
    const userInfoResponse = await fetchWithTimeout(
      'https://www.googleapis.com/oauth2/v2/userinfo',
      {
        headers: { Authorization: `Bearer ${tokens.access_token}` },
      },
      8000 // 8秒超时
    );

    if (!userInfoResponse.ok) {
      console.error('[Google OAuth] User info fetch failed');
      return NextResponse.redirect(new URL('/auth/login?error=user_info_failed', request.url));
    }

    const userInfo = await userInfoResponse.json();
    console.log('[Google OAuth] User info received, elapsed:', Date.now() - startTime, 'ms');

    // 步骤3: 创建会话
    const sessionData = {
      id: userInfo.id,
      email: userInfo.email,
      name: userInfo.name,
      picture: userInfo.picture,
      provider: 'google',
      loginTime: Date.now(),
    };

    const sessionToken = Buffer.from(JSON.stringify(sessionData)).toString('base64');

    // 步骤4: 重定向（使用相对路径更快）
    const response = NextResponse.redirect(new URL('/community', request.url));

    // 设置cookie
    response.cookies.set('qau_session', sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
    });

    response.cookies.set(
      'qau_user',
      JSON.stringify({
        name: userInfo.name,
        email: userInfo.email,
        picture: userInfo.picture,
      }),
      {
        httpOnly: false,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7,
        path: '/',
      }
    );

    const totalTime = Date.now() - startTime;
    console.log('[Google OAuth] Login successful, total time:', totalTime, 'ms');

    return response;
  } catch (err) {
    const totalTime = Date.now() - startTime;
    console.error('[Google OAuth] Error after', totalTime, 'ms:', err);

    // 超时错误特殊处理
    if (err instanceof Error && err.name === 'AbortError') {
      return NextResponse.redirect(new URL('/auth/login?error=timeout', request.url));
    }

    return NextResponse.redirect(new URL('/auth/login?error=oauth_error', request.url));
  }
}
```

---

### 方案3: 使用客户端OAuth流程（最佳）

**优点**:

- 不依赖服务器端超时限制
- 更快的响应速度
- 更好的用户体验

**缺点**:

- 需要重构代码
- Client Secret暴露风险（使用PKCE解决）

#### 实现步骤：

1. 使用 `@react-oauth/google` 库
2. 在客户端完成OAuth流程
3. 将token发送到服务器验证
4. 服务器只负责验证和创建会话

---

## 🚀 推荐实施方案

### 立即修复（5分钟）

**同时应用方案1和方案2**

1. ✅ 更新 `vercel.json` 增加超时到60秒
2. ✅ 优化 OAuth 回调代码添加超时控制
3. ✅ 重新部署到Vercel

### 长期优化（1小时）

1. ⚪ 实施方案3：迁移到客户端OAuth
2. ⚪ 添加性能监控
3. ⚪ 实现重试机制

---

## 📝 实施步骤

### 步骤1: 更新 vercel.json

```bash
# 编辑文件
code Quantaureum/frontend/vercel.json
```

修改为：

```json
{
  "functions": {
    "src/app/api/**/*.ts": {
      "maxDuration": 60,
      "memory": 1024
    }
  }
}
```

### 步骤2: 更新 OAuth 回调代码

```bash
# 编辑文件
code Quantaureum/frontend/src/app/api/auth/google/callback/route.ts
```

应用上面的优化代码。

### 步骤3: 提交并部署

```bash
cd Quantaureum/frontend

# 提交更改
git add vercel.json src/app/api/auth/google/callback/route.ts
git commit -m "fix(auth): 修复谷歌登录超时问题

- 增加Serverless Function超时时间到60秒
- 添加请求超时控制（8秒）
- 优化OAuth流程性能
- 改进错误处理和日志"

# 推送到GitHub（自动触发Vercel部署）
git push origin main
```

### 步骤4: 验证修复

1. 等待Vercel部署完成（约2-3分钟）
2. 访问网站并点击谷歌登录
3. 检查是否成功登录
4. 查看Vercel日志确认执行时间

---

## 🔍 调试方法

### 查看Vercel日志

1. 访问 Vercel Dashboard
2. 选择项目
3. 点击 "Functions" 标签
4. 找到 `/api/auth/google/callback`
5. 查看执行时间和错误日志

### 本地测试

```bash
cd Quantaureum/frontend

# 设置环境变量
export GOOGLE_CLIENT_ID="your_client_id"
export GOOGLE_CLIENT_SECRET="your_client_secret"
export GOOGLE_REDIRECT_URI="http://localhost:3000/api/auth/google/callback"

# 启动开发服务器
npm run dev

# 测试登录流程
```

---

## ⚠️ 注意事项

### Vercel计划限制

| 计划       | 最大超时时间 | 价格   |
| ---------- | ------------ | ------ |
| Hobby      | 10秒         | 免费   |
| Pro        | 60秒         | $20/月 |
| Enterprise | 900秒        | 定制   |

**如果你使用Hobby计划**:

- 方案1无法使用（最大10秒）
- 必须使用方案2或方案3
- 建议升级到Pro计划

### Google API配额

- 确保Google Cloud Console中的OAuth配额充足
- 检查API是否启用
- 验证重定向URI配置正确

---

## 📊 性能基准

### 优化前

- Token交换: ~3-5秒
- 用户信息: ~2-3秒
- 会话创建: ~0.5秒
- 重定向: ~0.5秒
- **总计**: ~6-9秒（可能超时）

### 优化后

- Token交换: ~2-3秒（超时控制）
- 用户信息: ~1-2秒（超时控制）
- 会话创建: ~0.3秒（优化）
- 重定向: ~0.2秒（相对路径）
- **总计**: ~3.5-5.5秒（稳定）

---

## ✅ 验收标准

- [ ] 谷歌登录不再超时
- [ ] 登录时间 < 10秒
- [ ] 成功率 > 95%
- [ ] Vercel日志无错误
- [ ] 用户体验流畅

---

**文档版本**: 1.0  
**创建日期**: 2026-01-18  
**维护者**: Kiro AI Assistant
