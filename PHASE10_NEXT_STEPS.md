# 第十阶段 - 下一步行动

## 当前状态

- ✅ 后端 API 已创建（嵌套评论、回复、获取子评论）
- ✅ 数据库迁移脚本已准备
- ⏳ 需要运行数据库迁移
- ⏳ 需要实现前端组件

---

## 立即执行的步骤

### Step 1: 运行数据库迁移 ⚡

**操作**: 调用迁移 API

```bash
# 方法1: 使用 curl
curl -X POST https://www.quantaureum.com/api/v2/barong/public/community/migrate-comments

# 方法2: 使用浏览器
# 访问: https://www.quantaureum.com/api/v2/barong/public/community/migrate-comments
```

**预期结果**:

```json
{
  "success": true,
  "message": "Database migration completed successfully"
}
```

---

### Step 2: 实现核心前端组件

#### 2.1 CommentItem 组件（单个评论）

**文件**: `src/components/community/CommentItem.tsx`

**功能**:

- 显示评论内容
- 显示用户信息
- 点赞按钮
- 回复按钮
- 编辑/删除按钮（仅作者）
- 显示回复数量
- 展开/折叠子评论

#### 2.2 ReplyForm 组件（回复表单）

**文件**: `src/components/community/ReplyForm.tsx`

**功能**:

- 回复输入框
- 提交按钮
- 取消按钮
- 字数统计
- @提及支持（后续）

#### 2.3 CommentTree 组件（评论树）

**文件**: `src/components/community/CommentTree.tsx`

**功能**:

- 递归渲染评论树
- 懒加载子评论
- 嵌套层级显示
- 排序功能

#### 2.4 CommentSort 组件（排序选择器）

**文件**: `src/components/community/CommentSort.tsx`

**功能**:

- 排序选项（最新、最早、最热、最佳）
- 切换排序方式
- 更新评论列表

---

### Step 3: 集成到帖子详情页

**文件**: `src/app/community/posts/page.tsx`

**修改**:

1. 导入新组件
2. 替换现有评论列表
3. 添加排序功能
4. 添加回复功能

---

## 实现优先级

### 🔴 高优先级（必须实现）

1. ✅ 数据库迁移
2. ⏳ CommentItem 组件
3. ⏳ ReplyForm 组件
4. ⏳ CommentTree 组件
5. ⏳ 集成到帖子详情页

### 🟡 中优先级（重要但可延后）

6. ⏳ CommentSort 组件
7. ⏳ 评论编辑功能
8. ⏳ 评论删除功能

### 🟢 低优先级（可选功能）

9. ⏳ @提及功能
10. ⏳ 评论折叠功能
11. ⏳ 评论举报功能

---

## 预计时间

| 任务             | 预计时间    | 状态 |
| ---------------- | ----------- | ---- |
| 数据库迁移       | 5分钟       | ⏳   |
| CommentItem 组件 | 30分钟      | ⏳   |
| ReplyForm 组件   | 20分钟      | ⏳   |
| CommentTree 组件 | 40分钟      | ⏳   |
| 集成到帖子详情页 | 20分钟      | ⏳   |
| 测试和调试       | 30分钟      | ⏳   |
| **总计**         | **2-3小时** | -    |

---

## 建议

由于第十阶段功能较多，建议采用**分阶段实现**的策略：

### 阶段 10.1：基础嵌套评论（当前）

- ✅ 数据库迁移
- ✅ 回复评论 API
- ⏳ 前端组件
- ⏳ 基础测试

### 阶段 10.2：评论管理

- 评论编辑
- 评论删除
- 评论排序

### 阶段 10.3：高级功能

- @提及用户
- 评论折叠
- 评论举报

---

## 用户反馈

在实现每个阶段后，建议：

1. 部署到生产环境
2. 让用户测试
3. 收集反馈
4. 根据反馈调整优先级

---

## 下一步行动

**立即执行**:

1. 运行数据库迁移
2. 实现 CommentItem 组件
3. 实现 ReplyForm 组件
4. 测试基础回复功能

**等待用户确认后继续**:

- 是否继续实现完整的嵌套评论功能？
- 还是先测试基础功能再继续？
