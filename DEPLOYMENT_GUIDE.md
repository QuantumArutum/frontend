# 🚀 Quantaureum 社区论坛部署指南

**版本:** 1.0.0  
**更新时间:** 2026年1月18日  
**状态:** ✅ 可以部署

---

## 📋 部署前检查清单

### ✅ 代码准备

- [x] 所有功能已完成
- [x] 构建测试通过
- [x] 类型检查通过
- [x] 代码质量检查通过
- [x] 文档已完成

### ✅ 环境准备

- [ ] 数据库已创建
- [ ] 环境变量已配置
- [ ] 域名已准备
- [ ] SSL证书已配置
- [ ] CDN已配置（可选）

---

## 🗄️ 数据库部署

### 1. 创建数据库

**使用 Neon (推荐)**

1. 访问 [Neon Console](https://console.neon.tech)
2. 创建新项目
3. 创建数据库
4. 获取连接字符串

**连接字符串格式:**
```
postgresql://user:password@host/database?sslmode=require
```

### 2. 执行迁移脚本

**按顺序执行以下脚本:**

```bash
# 1. 基础表结构（如果还没有）
# 执行 DATABASE_FIXES.sql

# 2. 投票系统
psql $DATABASE_URL -f DATABASE_VOTING_SYSTEM.sql

# 3. 标签系统
psql $DATABASE_URL -f DATABASE_TAG_SYSTEM.sql

# 4. 私信系统
psql $DATABASE_URL -f DATABASE_MESSAGE_SYSTEM.sql
```

**或者在 Neon SQL Editor 中执行:**

1. 打开 Neon SQL Editor
2. 复制脚本内容
3. 点击 Run
4. 验证执行结果

### 3. 验证数据库

```sql
-- 检查表是否创建成功
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public'
ORDER BY table_name;

-- 检查触发器
SELECT trigger_name, event_object_table 
FROM information_schema.triggers
WHERE trigger_schema = 'public';

-- 检查函数
SELECT routine_name 
FROM information_schema.routines 
WHERE routine_schema = 'public'
AND routine_type = 'FUNCTION';
```

---

## ⚙️ 环境配置

### 1. 创建环境变量文件

**开发环境 (.env.local)**

```env
# 数据库
DATABASE_URL=postgresql://user:password@host/database?sslmode=require

# API配置
NEXT_PUBLIC_API_URL=http://localhost:3000

# 认证
JWT_SECRET=your-secret-key-here
NEXT_PUBLIC_JWT_SECRET=your-secret-key-here

# 文件上传
NEXT_PUBLIC_MAX_FILE_SIZE=5242880
NEXT_PUBLIC_UPLOAD_DIR=/uploads

# 其他配置
NODE_ENV=development
```

**生产环境 (.env.production)**

```env
# 数据库
DATABASE_URL=postgresql://user:password@host/database?sslmode=require

# API配置
NEXT_PUBLIC_API_URL=https://your-domain.com

# 认证
JWT_SECRET=your-production-secret-key
NEXT_PUBLIC_JWT_SECRET=your-production-secret-key

# 文件上传
NEXT_PUBLIC_MAX_FILE_SIZE=5242880
NEXT_PUBLIC_UPLOAD_DIR=/uploads

# CDN（可选）
NEXT_PUBLIC_CDN_URL=https://cdn.your-domain.com

# 其他配置
NODE_ENV=production
```

### 2. Vercel环境变量配置

1. 进入 Vercel 项目设置
2. 选择 Environment Variables
3. 添加以下变量:

| 变量名 | 值 | 环境 |
|--------|-----|------|
| DATABASE_URL | postgresql://... | Production |
| JWT_SECRET | your-secret | Production |
| NEXT_PUBLIC_API_URL | https://... | Production |

---

## 🏗️ 构建部署

### 方式1: Vercel部署（推荐）

**1. 安装Vercel CLI**

```bash
npm i -g vercel
```

**2. 登录Vercel**

```bash
vercel login
```

**3. 部署到生产环境**

```bash
# 首次部署
vercel --prod

# 后续部署
vercel --prod
```

**4. 配置域名**

1. 进入 Vercel 项目设置
2. 选择 Domains
3. 添加自定义域名
4. 配置DNS记录

### 方式2: 自托管部署

**1. 构建项目**

```bash
npm run build
```

**2. 启动服务**

```bash
# 使用PM2（推荐）
npm install -g pm2
pm2 start npm --name "quantaureum-forum" -- start

# 或直接启动
npm run start
```

**3. 配置Nginx反向代理**

```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

**4. 配置SSL证书**

```bash
# 使用Let's Encrypt
sudo certbot --nginx -d your-domain.com
```

---

## 🔍 部署验证

### 1. 健康检查

```bash
# 检查服务状态
curl https://your-domain.com/api/health

# 预期响应
{
  "status": "ok",
  "timestamp": "2026-01-18T..."
}
```

### 2. 功能测试

**基础功能:**
- [ ] 首页加载正常
- [ ] 用户注册/登录
- [ ] 浏览帖子列表
- [ ] 查看帖子详情
- [ ] 发表评论

**高级功能:**
- [ ] 创建帖子
- [ ] 编辑帖子
- [ ] 投票功能
- [ ] 标签功能
- [ ] 私信功能

### 3. 性能测试

```bash
# 使用lighthouse测试
npm install -g lighthouse
lighthouse https://your-domain.com --view

# 预期指标
# Performance: > 90
# Accessibility: > 90
# Best Practices: > 90
# SEO: > 90
```

---

## 📊 监控配置

### 1. 错误监控

**使用Sentry（推荐）**

```bash
npm install @sentry/nextjs
```

```javascript
// sentry.client.config.js
import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 1.0,
});
```

### 2. 性能监控

**使用Vercel Analytics**

```bash
npm install @vercel/analytics
```

```javascript
// app/layout.tsx
import { Analytics } from '@vercel/analytics/react';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
```

### 3. 日志监控

**配置日志收集**

```javascript
// lib/logger.ts
export const logger = {
  info: (message: string, meta?: any) => {
    console.log('[INFO]', message, meta);
    // 发送到日志服务
  },
  error: (message: string, error?: Error) => {
    console.error('[ERROR]', message, error);
    // 发送到日志服务
  },
};
```

---

## 🔧 优化配置

### 1. 缓存配置

**Redis缓存（可选）**

```bash
npm install redis
```

```javascript
// lib/redis.ts
import { createClient } from 'redis';

export const redis = createClient({
  url: process.env.REDIS_URL,
});

redis.connect();
```

### 2. CDN配置

**Cloudflare CDN**

1. 添加网站到Cloudflare
2. 配置DNS记录
3. 启用CDN
4. 配置缓存规则

### 3. 图片优化

**使用Next.js Image组件**

```javascript
import Image from 'next/image';

<Image
  src="/image.jpg"
  width={800}
  height={600}
  alt="Description"
  loading="lazy"
/>
```

---

## 🔐 安全配置

### 1. 环境变量安全

- ✅ 不要提交 .env 文件到Git
- ✅ 使用强密码和密钥
- ✅ 定期轮换密钥
- ✅ 限制环境变量访问权限

### 2. 数据库安全

- ✅ 使用SSL连接
- ✅ 限制数据库访问IP
- ✅ 定期备份数据
- ✅ 使用参数化查询

### 3. API安全

- ✅ 启用CORS限制
- ✅ 实施速率限制
- ✅ 验证所有输入
- ✅ 使用HTTPS

---

## 📦 备份策略

### 1. 数据库备份

**自动备份（Neon）**

Neon提供自动备份功能，无需额外配置。

**手动备份**

```bash
# 导出数据库
pg_dump $DATABASE_URL > backup_$(date +%Y%m%d).sql

# 恢复数据库
psql $DATABASE_URL < backup_20260118.sql
```

### 2. 代码备份

```bash
# Git备份
git push origin main

# 创建标签
git tag -a v1.0.0 -m "Release version 1.0.0"
git push origin v1.0.0
```

### 3. 文件备份

```bash
# 备份上传文件
tar -czf uploads_backup.tar.gz public/uploads/

# 上传到云存储
aws s3 cp uploads_backup.tar.gz s3://your-bucket/backups/
```

---

## 🚨 故障排查

### 常见问题

**1. 数据库连接失败**

```bash
# 检查连接字符串
echo $DATABASE_URL

# 测试连接
psql $DATABASE_URL -c "SELECT 1"
```

**2. 构建失败**

```bash
# 清理缓存
rm -rf .next node_modules
npm install
npm run build
```

**3. 页面404错误**

```bash
# 检查路由配置
# 确保文件路径正确
# 检查动态路由参数
```

**4. API响应慢**

```bash
# 检查数据库查询
# 添加索引
# 启用缓存
# 优化查询
```

---

## 📞 支持

### 获取帮助

- **文档:** [COMMUNITY_FORUM_FINAL_SUMMARY.md](./COMMUNITY_FORUM_FINAL_SUMMARY.md)
- **问题反馈:** GitHub Issues
- **邮箱:** support@quantaureum.com

### 紧急联系

- **技术支持:** tech@quantaureum.com
- **安全问题:** security@quantaureum.com

---

## ✅ 部署完成检查

部署完成后，请确认以下项目:

- [ ] 数据库迁移成功
- [ ] 环境变量配置正确
- [ ] 服务正常运行
- [ ] 域名解析正确
- [ ] SSL证书有效
- [ ] 所有功能正常
- [ ] 性能指标达标
- [ ] 监控已配置
- [ ] 备份已设置
- [ ] 文档已更新

---

**部署完成!** 🎉

您的Quantaureum社区论坛系统已成功部署！

**下一步:**
1. 测试所有功能
2. 配置监控告警
3. 设置定期备份
4. 优化性能
5. 收集用户反馈

---

**最后更新:** 2026年1月18日  
**版本:** 1.0.0  
**状态:** ✅ 可以部署
