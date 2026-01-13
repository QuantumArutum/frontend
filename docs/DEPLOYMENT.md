# Quantaureum 部署指南

## 🎯 环境配置

### 开发环境 (Development)
- **用途**: 本地开发和测试
- **API**: 使用模拟API (`/api/mock/*`)
- **区块链**: 本地Ganache或Hardhat网络
- **配置文件**: `.env.development`

```bash
npm run dev
```

### 测试网环境 (Testnet)
- **用途**: 集成测试和预发布验证
- **API**: 连接测试网API服务器
- **区块链**: Quantaureum测试网
- **配置文件**: `.env.testnet`

```bash
NETWORK_ENV=testnet npm run build
NETWORK_ENV=testnet npm start
```

### 生产环境 (Production)
- **用途**: 正式发布
- **API**: 连接主网API服务器
- **区块链**: Quantaureum主网
- **配置文件**: `.env.production`

```bash
NETWORK_ENV=mainnet npm run build
NETWORK_ENV=mainnet npm start
```

## 🔧 API切换机制

### 自动切换逻辑
```typescript
// 开发环境: 使用模拟API
if (NODE_ENV === 'development' && USE_MOCK_API === 'true') {
  API_URL = '/api/mock/defi'  // 模拟数据
}

// 测试网环境: 使用测试网API
if (NETWORK_ENV === 'testnet') {
  API_URL = 'https://testnet-api.quantaureum.com/defi'
}

// 生产环境: 使用主网API
if (NETWORK_ENV === 'mainnet') {
  API_URL = 'https://api.quantaureum.com/defi'
}
```

### 手动切换
如果需要在开发环境中测试真实API:
```bash
USE_MOCK_API=false npm run dev
```

## 🚀 区块链集成步骤

### 1. 部署智能合约
```bash
# 部署到测试网
npx hardhat deploy --network testnet

# 部署到主网
npx hardhat deploy --network mainnet
```

### 2. 更新合约地址
在相应的环境配置文件中更新合约地址:
```env
CONTRACT_QAU_TOKEN=0x实际部署的合约地址
CONTRACT_DEFI_ROUTER=0x实际部署的合约地址
```

### 3. 启动后端服务
```bash
# 启动量子安全API服务
cd quantum-backend
npm start

# 启动DeFi API服务  
cd defi-backend
npm start
```

### 4. 更新前端配置
```env
USE_MOCK_API=false
QUANTUM_API_URL=http://your-quantum-api-server:8083/api/quantum
DEFI_API_URL=http://your-defi-api-server:5003/api/defi
```

## 📋 检查清单

### 开发环境 ✅
- [ ] 模拟API正常工作
- [ ] 所有页面可以访问
- [ ] 多语言功能正常
- [ ] 响应式设计正确

### 测试网部署 🧪
- [ ] 智能合约已部署到测试网
- [ ] 后端API服务已启动
- [ ] 前端连接到测试网API
- [ ] 钱包连接功能正常
- [ ] 交易功能测试通过

### 生产环境部署 🚀
- [ ] 智能合约已部署到主网
- [ ] 安全审计已完成
- [ ] 后端API服务高可用部署
- [ ] CDN和缓存配置
- [ ] 监控和日志系统
- [ ] 备份和恢复方案

## 🔒 安全注意事项

1. **私钥管理**: 生产环境私钥必须安全存储
2. **API密钥**: 使用环境变量，不要硬编码
3. **HTTPS**: 生产环境必须使用HTTPS
4. **CORS**: 正确配置跨域访问策略
5. **速率限制**: API需要实现速率限制
6. **输入验证**: 所有用户输入必须验证

## 🔄 回滚策略

如果生产环境出现问题，可以快速回滚到模拟API:
```bash
# 紧急回滚到模拟API
USE_MOCK_API=true npm run build
```

## 📞 技术支持

- **开发团队**: dev@quantaureum.com
- **运维团队**: ops@quantaureum.com
- **安全团队**: security@quantaureum.com
