# Google OAuth 配置指南

## 步骤 1: 创建 Google Cloud 项目

1. 访问 [Google Cloud Console](https://console.cloud.google.com/)
2. 创建新项目或选择现有项目
3. 在导航菜单中选择 "API 和服务" > "凭据"

## 步骤 2: 配置 OAuth 同意屏幕

1. 点击 "配置同意屏幕"
2. 选择用户类型（外部/内部）
3. 填写应用信息：
   - 应用名称: Quantaureum
   - 用户支持电子邮件: 您的邮箱
   - 应用首页: http://localhost:3000
   - 授权域名: localhost（开发环境）
4. 添加范围：`openid`, `email`, `profile`
5. 保存并继续

## 步骤 3: 创建 OAuth 2.0 客户端 ID

1. 在"凭据"页面，点击 "创建凭据" > "OAuth 客户端 ID"
2. 应用类型: Web 应用
3. 名称: Quantaureum Web Client
4. 已获授权的重定向 URI:
   - 开发环境: `http://localhost:3000/api/auth/google/callback`
   - 生产环境: `https://yourdomain.com/api/auth/google/callback`
5. 点击"创建"
6. **复制客户端 ID 和客户端密钥**

## 步骤 4: 配置环境变量

创建或更新 `D:\V2\Quantaureum\frontend\.env.local` 文件：

```bash
# Google OAuth
GOOGLE_CLIENT_ID=你的客户端ID.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=你的客户端密钥
GOOGLE_REDIRECT_URI=http://localhost:3000/api/auth/google/callback

# App URL
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Backend (可选)
BACKEND_API_URL=http://localhost:8080
```

## 步骤 5: 重启开发服务器

```bash
# 停止当前服务器 (Ctrl+C)
# 重新启动
npm run dev
```

## 步骤 6: 测试

1. 访问 http://localhost:3000/auth/login
2. 点击 "使用 Google 登录"
3. 应该会重定向到真实的 Google 授权页面
4. 授权后自动跳转回应用

## 生产环境配置

在 `.env.production` 中：

```bash
GOOGLE_CLIENT_ID=生产环境客户端ID
GOOGLE_CLIENT_SECRET=生产环境客户端密钥
GOOGLE_REDIRECT_URI=https://yourdomain.com/api/auth/google/callback
NEXT_PUBLIC_APP_URL=https://yourdomain.com
BACKEND_API_URL=https://api.yourdomain.com
```

## 安全注意事项

1. **永远不要提交 `.env.local` 到版本控制**
2. 客户端密钥应该保密
3. 在生产环境使用 HTTPS
4. 定期轮换密钥

## 故障排除

### 错误：redirect_uri_mismatch
- 确保 Google Console 中的重定向 URI 与代码中完全一致
- 包括协议（http/https）和端口号

### 错误：invalid_client
- 检查客户端 ID 和密钥是否正确
- 确保没有多余的空格

### 错误：access_denied
- 用户取消了授权
- 检查 OAuth 同意屏幕配置
