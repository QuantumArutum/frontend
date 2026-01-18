# 第三阶段优化计划 - 用户资料编辑功能

## 📅 开始日期

2026-01-17

## 🎯 目标

实现完整的用户资料编辑功能，让用户可以自定义个人信息

---

## 📋 任务清单

### 任务 1: 数据库表设计 ✅

创建 `user_profiles` 表：

```sql
CREATE TABLE user_profiles (
  user_id VARCHAR(255) PRIMARY KEY,
  display_name VARCHAR(100),
  bio TEXT,
  location VARCHAR(100),
  website VARCHAR(255),
  avatar_url VARCHAR(500),
  social_links JSONB,  -- { twitter, github, linkedin, etc. }
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(uid) ON DELETE CASCADE
);
```

### 任务 2: API 端点实现

#### 2.1 更新用户资料 API

- **路径**: `PUT /api/v2/barong/public/community/profile`
- **参数**:
  ```json
  {
    "displayName": "string",
    "bio": "string",
    "location": "string",
    "website": "string",
    "socialLinks": {
      "twitter": "string",
      "github": "string",
      "linkedin": "string"
    }
  }
  ```
- **返回**: 更新后的完整资料
- **需要认证**: ✅

#### 2.2 获取用户资料 API（扩展）

- 更新现有的 `user-profile` API
- 添加 `user_profiles` 表的数据
- 合并 users 表和 user_profiles 表的数据

### 任务 3: 前端实现

#### 3.1 创建资料编辑页面

- **路径**: `/community/settings/profile`
- **表单字段**：
  - 显示名称（可选，默认使用 email 前缀）
  - 个人简介（多行文本）
  - 位置（文本输入）
  - 网站（URL 输入）
  - 社交链接：
    - Twitter 用户名
    - GitHub 用户名
    - LinkedIn 用户名

#### 3.2 更新用户资料页

- 显示完整的用户资料（包括 user_profiles 数据）
- 显示社交链接图标
- "编辑资料"按钮链接到编辑页面

---

## 🔧 技术实现细节

### 认证处理

- 使用简化方案：前端传递 currentUserId
- 验证 currentUserId 与要编辑的用户 ID 是否匹配
- 返回 401 如果不匹配

### 数据验证

- 显示名称：最多 100 字符
- 个人简介：最多 500 字符
- 位置：最多 100 字符
- 网站：必须是有效的 URL
- 社交链接：只保存用户名部分

### 错误处理

统一的错误响应格式：

```json
{
  "success": false,
  "message": "错误信息"
}
```

---

## 📊 实施步骤

### 步骤 1: 创建更新资料 API

1. 创建 `PUT /api/v2/barong/public/community/profile` 端点
2. 实现数据验证
3. 自动创建 user_profiles 表（如果不存在）
4. 插入或更新用户资料

### 步骤 2: 更新获取资料 API

1. 修改 `user-profile` API
2. 左连接 user_profiles 表
3. 合并返回数据

### 步骤 3: 创建资料编辑页面

1. 创建 `/community/settings/profile` 页面
2. 实现表单组件
3. 添加表单验证
4. 实现保存功能

### 步骤 4: 更新用户资料页

1. 显示完整的用户资料
2. 添加社交链接图标
3. 测试所有功能

---

## 🎯 成功指标

### 功能完整性

- ✅ 用户可以编辑所有资料字段
- ✅ 资料保存成功
- ✅ 资料页正确显示更新后的信息
- ✅ 社交链接可点击跳转

### 用户体验

- ✅ 表单验证友好
- ✅ 保存响应快速
- ✅ 错误提示清晰
- ✅ 页面布局美观

---

## 📅 预计时间

- API 实现: 1-2 小时
- 前端实现: 2-3 小时
- 测试和调试: 1 小时

**总计**: 4-6 小时

---

## 🚀 开始实施

准备开始第三阶段的开发！
