# 第九阶段计划：完善发帖功能

## 目标

实现完整的发帖功能，包括 Markdown 编辑器、图片上传、代码高亮、草稿保存、帖子编辑和删除。

---

## 📋 需要实现的功能

### 1. Markdown 编辑器 📝

**功能描述**: 集成 Markdown 编辑器，支持实时预览

**技术选型**:

- **react-markdown-editor-lite** - 轻量级 Markdown 编辑器
- **react-simplemde-editor** - 简单易用的 Markdown 编辑器
- **@uiw/react-md-editor** - 功能完整的 Markdown 编辑器（推荐）

**功能特性**:

- ✅ 实时预览
- ✅ 工具栏（加粗、斜体、链接、图片等）
- ✅ 快捷键支持
- ✅ 全屏模式
- ✅ 语法高亮

**实现位置**:

- `src/app/community/create-post/page.tsx` - 创建帖子页面
- `src/components/community/MarkdownEditor.tsx` - Markdown 编辑器组件

---

### 2. 图片上传 🖼️

**功能描述**: 支持图片上传和预览

**技术方案**:

- **方案A**: 上传到云存储（AWS S3、Cloudflare R2、阿里云OSS）
- **方案B**: 上传到服务器本地存储
- **方案C**: 使用图床服务（imgur、sm.ms）

**推荐方案**: Cloudflare R2（免费额度大，速度快）

**功能特性**:

- ✅ 拖拽上传
- ✅ 粘贴上传
- ✅ 图片预览
- ✅ 图片压缩
- ✅ 格式限制（jpg、png、gif、webp）
- ✅ 大小限制（5MB）
- ✅ 上传进度显示

**实现位置**:

- `src/app/api/v2/barong/public/community/upload-image/route.ts` - 图片上传 API
- `src/components/community/ImageUploader.tsx` - 图片上传组件

---

### 3. 代码高亮 💻

**功能描述**: 支持代码块语法高亮

**技术选型**:

- **highlight.js** - 经典的代码高亮库
- **prism.js** - 轻量级代码高亮库
- **react-syntax-highlighter** - React 代码高亮组件（推荐）

**支持语言**:

- JavaScript/TypeScript
- Python
- Go
- Rust
- Solidity
- SQL
- Shell
- 等常用语言

**实现位置**:

- `src/components/community/CodeBlock.tsx` - 代码块组件
- `src/lib/markdown.ts` - Markdown 渲染配置

---

### 4. 草稿自动保存 💾

**功能描述**: 自动保存草稿，防止内容丢失

**技术方案**:

- **LocalStorage**: 保存到浏览器本地存储
- **数据库**: 保存到服务器数据库

**推荐方案**: LocalStorage + 数据库（双重保险）

**功能特性**:

- ✅ 自动保存（每30秒）
- ✅ 手动保存
- ✅ 草稿列表
- ✅ 恢复草稿
- ✅ 删除草稿
- ✅ 草稿过期清理（7天）

**实现位置**:

- `src/hooks/useDraftSave.ts` - 草稿保存 Hook
- `src/app/api/v2/barong/public/community/drafts/route.ts` - 草稿 API

---

### 5. 内容预览 👁️

**功能描述**: 实时预览 Markdown 渲染效果

**功能特性**:

- ✅ 实时预览
- ✅ 分屏显示（编辑器 + 预览）
- ✅ 全屏预览
- ✅ 移动端适配

**实现位置**:

- `src/components/community/MarkdownPreview.tsx` - 预览组件

---

### 6. 帖子编辑 ✏️

**功能描述**: 编辑已发布的帖子

**功能特性**:

- ✅ 只能编辑自己的帖子
- ✅ 编辑历史记录（可选）
- ✅ 编辑时间显示
- ✅ 编辑原因说明（可选）

**实现位置**:

- `src/app/community/posts/edit/page.tsx` - 编辑帖子页面
- `src/app/api/v2/barong/public/community/edit-post/route.ts` - 编辑帖子 API

---

### 7. 帖子删除 🗑️

**功能描述**: 删除已发布的帖子

**功能特性**:

- ✅ 只能删除自己的帖子
- ✅ 软删除（标记为已删除，不真正删除）
- ✅ 删除确认对话框
- ✅ 删除原因说明（可选）

**实现位置**:

- `src/app/api/v2/barong/public/community/delete-post/route.ts` - 删除帖子 API

---

### 8. 表单验证 ✅

**功能描述**: 验证帖子内容

**验证规则**:

- ✅ 标题：1-200 字符
- ✅ 内容：10-50000 字符
- ✅ 分类：必选
- ✅ 标签：0-5 个（可选）

**实现位置**:

- `src/lib/validation.ts` - 验证函数

---

## 🔧 技术实现

### 数据库表结构

#### posts 表（已存在，需要添加字段）

```sql
ALTER TABLE posts ADD COLUMN IF NOT EXISTS is_draft BOOLEAN DEFAULT FALSE;
ALTER TABLE posts ADD COLUMN IF NOT EXISTS edited_at TIMESTAMP;
ALTER TABLE posts ADD COLUMN IF NOT EXISTS edit_reason TEXT;
ALTER TABLE posts ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP;
ALTER TABLE posts ADD COLUMN IF NOT EXISTS delete_reason TEXT;
```

#### drafts 表（新建）

```sql
CREATE TABLE IF NOT EXISTS drafts (
  id SERIAL PRIMARY KEY,
  user_id VARCHAR(255) NOT NULL,
  title VARCHAR(200),
  content TEXT,
  category_id INTEGER,
  tags JSONB,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_drafts_user_id ON drafts(user_id);
CREATE INDEX idx_drafts_updated_at ON drafts(updated_at);
```

#### post_images 表（新建）

```sql
CREATE TABLE IF NOT EXISTS post_images (
  id SERIAL PRIMARY KEY,
  post_id INTEGER,
  user_id VARCHAR(255) NOT NULL,
  image_url TEXT NOT NULL,
  image_key TEXT NOT NULL,
  file_size INTEGER,
  mime_type VARCHAR(50),
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_post_images_post_id ON post_images(post_id);
CREATE INDEX idx_post_images_user_id ON post_images(user_id);
```

---

### API 端点

#### 1. 创建帖子 API（增强）

```typescript
POST /api/v2/barong/public/community/create-post

Request:
{
  title: string,
  content: string,
  categoryId: number,
  tags?: string[],
  isDraft?: boolean,
  images?: string[]
}

Response:
{
  success: boolean,
  message: string,
  data: {
    postId: number,
    isDraft: boolean
  }
}
```

#### 2. 编辑帖子 API

```typescript
PUT /api/v2/barong/public/community/edit-post

Request:
{
  postId: number,
  title: string,
  content: string,
  categoryId: number,
  tags?: string[],
  editReason?: string
}

Response:
{
  success: boolean,
  message: string
}
```

#### 3. 删除帖子 API

```typescript
DELETE /api/v2/barong/public/community/delete-post?postId={id}

Request Query:
- postId: number
- deleteReason?: string

Response:
{
  success: boolean,
  message: string
}
```

#### 4. 图片上传 API

```typescript
POST /api/v2/barong/public/community/upload-image

Request:
- FormData with image file

Response:
{
  success: boolean,
  message: string,
  data: {
    imageUrl: string,
    imageKey: string
  }
}
```

#### 5. 草稿 API

```typescript
// 保存草稿
POST /api/v2/barong/public/community/drafts

// 获取草稿列表
GET /api/v2/barong/public/community/drafts?userId={id}

// 获取单个草稿
GET /api/v2/barong/public/community/drafts/{id}

// 删除草稿
DELETE /api/v2/barong/public/community/drafts/{id}
```

---

## 📝 实现步骤

### Step 1: 安装依赖包

```bash
npm install @uiw/react-md-editor
npm install react-syntax-highlighter
npm install @types/react-syntax-highlighter
npm install react-dropzone
```

### Step 2: 创建 Markdown 编辑器组件

1. 创建 `MarkdownEditor.tsx`
2. 集成 @uiw/react-md-editor
3. 添加工具栏自定义
4. 添加图片上传按钮

### Step 3: 创建图片上传组件

1. 创建 `ImageUploader.tsx`
2. 实现拖拽上传
3. 实现粘贴上传
4. 添加图片预览
5. 添加上传进度

### Step 4: 实现图片上传 API

1. 创建 `upload-image/route.ts`
2. 配置 Cloudflare R2（或其他存储）
3. 实现图片上传逻辑
4. 添加图片压缩
5. 添加格式和大小验证

### Step 5: 实现草稿保存功能

1. 创建 `useDraftSave.ts` Hook
2. 实现 LocalStorage 保存
3. 创建草稿 API
4. 实现自动保存（30秒）
5. 实现草稿恢复

### Step 6: 增强创建帖子页面

1. 更新 `create-post/page.tsx`
2. 集成 Markdown 编辑器
3. 添加图片上传
4. 添加草稿保存
5. 添加表单验证
6. 添加预览功能

### Step 7: 实现帖子编辑功能

1. 创建 `posts/edit/page.tsx`
2. 创建编辑帖子 API
3. 添加权限验证（只能编辑自己的帖子）
4. 添加编辑历史记录（可选）

### Step 8: 实现帖子删除功能

1. 创建删除帖子 API
2. 添加删除按钮到帖子详情页
3. 添加删除确认对话框
4. 实现软删除

### Step 9: 添加代码高亮

1. 创建 `CodeBlock.tsx`
2. 配置 react-syntax-highlighter
3. 添加语言选择
4. 添加复制代码按钮

### Step 10: 测试和优化

1. 测试所有功能
2. 优化性能
3. 修复 bug
4. 添加加载状态
5. 添加错误处理

---

## 🧪 测试计划

### Markdown 编辑器测试

- [ ] 基本 Markdown 语法渲染
- [ ] 工具栏功能
- [ ] 快捷键
- [ ] 全屏模式
- [ ] 实时预览

### 图片上传测试

- [ ] 拖拽上传
- [ ] 粘贴上传
- [ ] 点击上传
- [ ] 图片预览
- [ ] 格式验证
- [ ] 大小验证
- [ ] 上传进度
- [ ] 错误处理

### 草稿保存测试

- [ ] 自动保存
- [ ] 手动保存
- [ ] 草稿列表
- [ ] 恢复草稿
- [ ] 删除草稿
- [ ] LocalStorage 保存
- [ ] 数据库保存

### 帖子编辑测试

- [ ] 编辑自己的帖子
- [ ] 无法编辑他人的帖子
- [ ] 编辑时间显示
- [ ] 编辑原因（可选）

### 帖子删除测试

- [ ] 删除自己的帖子
- [ ] 无法删除他人的帖子
- [ ] 删除确认对话框
- [ ] 软删除验证

### 代码高亮测试

- [ ] JavaScript 高亮
- [ ] Python 高亮
- [ ] Go 高亮
- [ ] Solidity 高亮
- [ ] 复制代码功能

---

## ⚠️ 注意事项

### 1. 图片存储

- 选择合适的存储方案（推荐 Cloudflare R2）
- 配置 CORS
- 设置访问权限
- 考虑 CDN 加速

### 2. 安全性

- 验证用户权限
- 防止 XSS 攻击（Markdown 内容过滤）
- 图片格式验证
- 文件大小限制
- 防止恶意上传

### 3. 性能优化

- 图片压缩
- 懒加载
- 代码分割
- 缓存策略

### 4. 用户体验

- 加载状态提示
- 错误提示
- 成功提示
- 草稿自动保存提示
- 离开页面确认（有未保存内容时）

---

## 📊 预期结果

### 用户体验

- ✅ 用户可以使用 Markdown 格式化内容
- ✅ 用户可以上传图片丰富帖子
- ✅ 用户可以保存草稿避免内容丢失
- ✅ 用户可以编辑和删除自己的帖子
- ✅ 用户可以实时预览帖子效果
- ✅ 用户可以使用代码高亮展示代码

### 技术指标

- ✅ 图片上传成功率 > 99%
- ✅ 草稿保存成功率 > 99%
- ✅ 编辑器加载时间 < 1秒
- ✅ 图片上传时间 < 3秒（5MB）
- ✅ 草稿自动保存延迟 < 30秒

---

## 🚀 实施时间表

| 任务                | 预计时间    | 优先级 |
| ------------------- | ----------- | ------ |
| 安装依赖和配置      | 15分钟      | 高     |
| Markdown 编辑器组件 | 45分钟      | 高     |
| 图片上传功能        | 60分钟      | 高     |
| 草稿保存功能        | 45分钟      | 高     |
| 帖子编辑功能        | 30分钟      | 高     |
| 帖子删除功能        | 20分钟      | 高     |
| 代码高亮            | 20分钟      | 中     |
| 测试和调试          | 45分钟      | 高     |
| **总计**            | **3-4小时** | -      |

---

## 📝 成功标准

1. ✅ Markdown 编辑器正常工作
2. ✅ 图片上传功能正常
3. ✅ 草稿自动保存正常
4. ✅ 帖子编辑功能正常
5. ✅ 帖子删除功能正常
6. ✅ 代码高亮正常显示
7. ✅ 所有测试用例通过
8. ✅ 无明显性能问题
9. ✅ 用户体验流畅

---

## 🎯 下一阶段预告

完成第九阶段后，将进入：

### 第十阶段：评论系统增强

- 嵌套评论（回复评论）
- @提及用户
- 评论编辑/删除
- 评论排序
- 评论折叠

---

让我们开始实现吧！🚀
