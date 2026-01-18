# Quantaureum Frontend 代码规范

**版本**: 1.0  
**最后更新**: 2026-01-18

---

## 📋 目录

1. [代码风格](#代码风格)
2. [TypeScript规范](#typescript规范)
3. [React规范](#react规范)
4. [文件组织](#文件组织)
5. [命名约定](#命名约定)
6. [注释规范](#注释规范)
7. [Git提交规范](#git提交规范)
8. [工具配置](#工具配置)

---

## 代码风格

### 基本规则

- **缩进**: 使用2个空格
- **引号**: 使用单引号 `'`（JSX中使用双引号 `"`）
- **分号**: 始终使用分号
- **行宽**: 最大100字符
- **尾随逗号**: ES5风格（对象和数组最后一项后加逗号）

### 示例

```typescript
// ✅ 好的
const user = {
  name: 'John',
  age: 30,
};

// ❌ 不好的
const user = {
  name: 'John',
  age: 30,
};
```

---

## TypeScript规范

### 类型定义

1. **避免使用 `any`**

   ```typescript
   // ❌ 不好的
   const data: any = fetchData();

   // ✅ 好的
   const data: User = fetchData();
   ```

2. **使用接口定义对象类型**

   ```typescript
   // ✅ 好的
   interface User {
     id: string;
     name: string;
     email: string;
   }
   ```

3. **使用类型别名定义联合类型**
   ```typescript
   // ✅ 好的
   type Status = 'pending' | 'approved' | 'rejected';
   ```

### 函数类型

```typescript
// ✅ 好的 - 明确的参数和返回类型
async function getUser(id: string): Promise<User> {
  // ...
}

// ✅ 好的 - 箭头函数
const getUser = async (id: string): Promise<User> => {
  // ...
};
```

### 可选参数

```typescript
// ✅ 好的 - 可选参数放在最后
function createUser(name: string, email: string, age?: number): User {
  // ...
}
```

---

## React规范

### 组件定义

1. **使用函数组件**

   ```typescript
   // ✅ 好的
   export function UserCard({ user }: { user: User }) {
     return <div>{user.name}</div>;
   }
   ```

2. **Props接口定义**

   ```typescript
   // ✅ 好的
   interface UserCardProps {
     user: User;
     onEdit?: () => void;
   }

   export function UserCard({ user, onEdit }: UserCardProps) {
     // ...
   }
   ```

### Hooks规范

1. **useEffect依赖**

   ```typescript
   // ✅ 好的 - 包含所有依赖
   const loadData = useCallback(async () => {
     // ...
   }, [page, limit]);

   useEffect(() => {
     loadData();
   }, [loadData]);
   ```

2. **自定义Hook命名**
   ```typescript
   // ✅ 好的 - 以use开头
   function useUserData(userId: string) {
     // ...
   }
   ```

### 条件渲染

```typescript
// ✅ 好的 - 使用&&
{isLoading && <Loading />}

// ✅ 好的 - 使用三元运算符
{user ? <UserCard user={user} /> : <EmptyState />}

// ❌ 不好的 - 使用if语句
if (user) {
  return <UserCard user={user} />;
} else {
  return <EmptyState />;
}
```

---

## 文件组织

### 目录结构

```
src/
├── app/                    # Next.js App Router页面
│   ├── api/               # API路由
│   ├── community/         # 社区功能页面
│   └── ...
├── components/            # 可复用组件
│   ├── ui/               # UI基础组件
│   └── ...
├── lib/                   # 工具函数和服务
│   ├── database.ts       # 数据库连接
│   ├── communityService.ts
│   └── ...
├── types/                 # TypeScript类型定义
│   └── community.ts
└── styles/               # 全局样式
```

### 文件命名

- **组件文件**: PascalCase - `UserCard.tsx`
- **工具文件**: camelCase - `formatDate.ts`
- **类型文件**: camelCase - `community.ts`
- **页面文件**: kebab-case - `user-profile/page.tsx`

---

## 命名约定

### 变量和函数

```typescript
// ✅ 好的 - camelCase
const userName = 'John';
function getUserById(id: string) {}

// ❌ 不好的 - snake_case
const user_name = 'John';
function get_user_by_id(id: string) {}
```

### 常量

```typescript
// ✅ 好的 - UPPER_SNAKE_CASE
const MAX_RETRY_COUNT = 3;
const API_BASE_URL = 'https://api.example.com';
```

### 组件

```typescript
// ✅ 好的 - PascalCase
function UserCard() {}
function PostList() {}

// ❌ 不好的 - camelCase
function userCard() {}
```

### 接口和类型

```typescript
// ✅ 好的 - PascalCase
interface User {}
type Status = 'active' | 'inactive';

// ❌ 不好的 - 前缀I
interface IUser {}
```

---

## 注释规范

### 函数注释

```typescript
/**
 * 获取用户信息
 * @param userId - 用户ID
 * @returns 用户对象
 * @throws {Error} 当用户不存在时抛出错误
 */
async function getUser(userId: string): Promise<User> {
  // ...
}
```

### 复杂逻辑注释

```typescript
// ✅ 好的 - 解释为什么这样做
// 使用useCallback避免不必要的重新渲染
const handleSubmit = useCallback(() => {
  // ...
}, [formData]);

// ❌ 不好的 - 重复代码内容
// 定义handleSubmit函数
const handleSubmit = () => {
  // ...
};
```

### TODO注释

```typescript
// TODO: 添加错误处理
// FIXME: 修复内存泄漏问题
// NOTE: 这个逻辑需要在v2.0中重构
```

---

## Git提交规范

### Commit Message格式

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Type类型

- `feat`: 新功能
- `fix`: 修复bug
- `docs`: 文档更新
- `style`: 代码格式（不影响代码运行）
- `refactor`: 重构
- `perf`: 性能优化
- `test`: 测试
- `chore`: 构建过程或辅助工具的变动

### 示例

```
feat(community): 添加帖子点赞功能

- 添加点赞API端点
- 实现前端点赞按钮
- 添加点赞数量显示

Closes #123
```

```
fix(api): 修复数据库连接错误处理

修复当数据库不可用时返回空数据的问题，
现在正确返回503错误状态码。

Fixes #456
```

---

## 工具配置

### 自动格式化

项目已配置Prettier和ESLint，代码会在提交时自动格式化。

**手动格式化**:

```bash
npm run format        # 格式化所有文件
npm run format:check  # 检查格式
npm run lint:fix      # 修复ESLint问题
```

### Pre-commit Hook

项目使用Husky和lint-staged，在每次提交前自动：

1. 运行ESLint检查并自动修复
2. 运行Prettier格式化
3. 只处理暂存的文件

### TypeScript检查

```bash
npm run type-check    # 运行TypeScript类型检查
```

---

## 最佳实践

### 错误处理

```typescript
// ✅ 好的 - 详细的错误日志
try {
  const data = await fetchData();
} catch (error) {
  const errorMessage = error instanceof Error ? error.message : 'Unknown error';
  console.error('[API] Error fetching data:', {
    message: errorMessage,
    stack: error instanceof Error ? error.stack : '',
    timestamp: new Date().toISOString(),
  });
  throw error;
}
```

### 异步操作

```typescript
// ✅ 好的 - 使用async/await
async function loadData() {
  try {
    const data = await fetchData();
    return data;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}

// ❌ 不好的 - 使用.then()链
function loadData() {
  return fetchData()
    .then((data) => data)
    .catch((error) => console.error(error));
}
```

### 性能优化

```typescript
// ✅ 好的 - 使用useMemo缓存计算结果
const expensiveValue = useMemo(() => {
  return computeExpensiveValue(data);
}, [data]);

// ✅ 好的 - 使用useCallback缓存函数
const handleClick = useCallback(() => {
  doSomething(value);
}, [value]);
```

---

## 代码审查清单

提交代码前，请确保：

- [ ] 代码已通过ESLint检查
- [ ] 代码已通过Prettier格式化
- [ ] 代码已通过TypeScript类型检查
- [ ] 所有函数都有明确的类型定义
- [ ] 没有使用`any`类型（除非必要）
- [ ] React Hook依赖数组正确
- [ ] 错误处理完整
- [ ] 有必要的注释
- [ ] Commit message符合规范
- [ ] 代码已在本地测试

---

## 参考资源

- [TypeScript官方文档](https://www.typescriptlang.org/docs/)
- [React官方文档](https://react.dev/)
- [Next.js官方文档](https://nextjs.org/docs)
- [Prettier配置](https://prettier.io/docs/en/configuration.html)
- [ESLint规则](https://eslint.org/docs/rules/)

---

**维护者**: Kiro AI Assistant  
**最后更新**: 2026-01-18
