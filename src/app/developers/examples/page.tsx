'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FaCode, FaCopy, FaCheck, FaGithub, FaPlay, FaBook, FaRocket, FaWallet, FaExchangeAlt, FaFileContract, FaCoins } from 'react-icons/fa';
import EnhancedNavbar from '@/app/components/EnhancedNavbar';
import EnhancedFooter from '@/app/components/EnhancedFooter';
import ParticlesBackground from '@/app/components/ParticlesBackground';

const codeExamples = [
  {
    id: 'connect-wallet',
    category: '钱包',
    icon: FaWallet,
    title: '连接钱包',
    description: '使用 JavaScript SDK 连接 Quantaureum 钱包',
    language: 'javascript',
    code: `import { QuantaureumSDK } from '@quantaureum/sdk';

// 初始化 SDK
const sdk = new QuantaureumSDK({
  network: 'mainnet',
  rpcUrl: 'https://rpc.quantaureum.com'
});

// 连接钱包
async function connectWallet() {
  try {
    const wallet = await sdk.wallet.connect();
    console.log('钱包地址:', wallet.address);
    console.log('余额:', await wallet.getBalance());
    return wallet;
  } catch (error) {
    console.error('连接失败:', error);
  }
}

// 调用连接
connectWallet();`
  },
  {
    id: 'send-transaction',
    category: '交易',
    icon: FaExchangeAlt,
    title: '发送交易',
    description: '发送 QAU 代币到指定地址',
    language: 'javascript',
    code: `import { QuantaureumSDK, parseQAU } from '@quantaureum/sdk';

const sdk = new QuantaureumSDK({ network: 'mainnet' });

async function sendTransaction(to, amount) {
  const wallet = await sdk.wallet.connect();
  
  // 构建交易
  const tx = await wallet.sendTransaction({
    to: to,
    value: parseQAU(amount), // 转换为最小单位
    gasLimit: 21000
  });
  
  console.log('交易哈希:', tx.hash);
  
  // 等待确认
  const receipt = await tx.wait();
  console.log('交易已确认，区块:', receipt.blockNumber);
  
  return receipt;
}

// 发送 10 QAU
sendTransaction('0x742d35Cc6634C0532925a3b844Bc9e7595f...', '10');`
  },
  {
    id: 'deploy-contract',
    category: '智能合约',
    icon: FaFileContract,
    title: '部署智能合约',
    description: '部署一个简单的代币合约',
    language: 'solidity',
    code: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@quantaureum/contracts/token/QRC20.sol";
import "@quantaureum/contracts/security/QuantumSafe.sol";

contract MyToken is QRC20, QuantumSafe {
    constructor(
        string memory name,
        string memory symbol,
        uint256 initialSupply
    ) QRC20(name, symbol) {
        _mint(msg.sender, initialSupply * 10**decimals());
    }
    
    // 量子安全的转账函数
    function transfer(address to, uint256 amount) 
        public 
        override 
        quantumVerified 
        returns (bool) 
    {
        return super.transfer(to, amount);
    }
    
    // 铸造新代币（仅管理员）
    function mint(address to, uint256 amount) public onlyOwner {
        _mint(to, amount);
    }
}`
  },
  {
    id: 'interact-contract',
    category: '智能合约',
    icon: FaCode,
    title: '调用智能合约',
    description: '与已部署的智能合约交互',
    language: 'javascript',
    code: `import { QuantaureumSDK, Contract } from '@quantaureum/sdk';

const sdk = new QuantaureumSDK({ network: 'mainnet' });

// 合约 ABI
const tokenABI = [
  "function balanceOf(address) view returns (uint256)",
  "function transfer(address to, uint256 amount) returns (bool)",
  "function approve(address spender, uint256 amount) returns (bool)",
  "event Transfer(address indexed from, address indexed to, uint256 value)"
];

async function interactWithContract() {
  const wallet = await sdk.wallet.connect();
  
  // 创建合约实例
  const tokenContract = new Contract(
    '0x1234567890abcdef...', // 合约地址
    tokenABI,
    wallet
  );
  
  // 读取余额
  const balance = await tokenContract.balanceOf(wallet.address);
  console.log('代币余额:', balance.toString());
  
  // 转账代币
  const tx = await tokenContract.transfer(
    '0xRecipientAddress...',
    parseUnits('100', 18)
  );
  await tx.wait();
  
  // 监听事件
  tokenContract.on('Transfer', (from, to, value) => {
    console.log(\`转账: \${from} -> \${to}, 金额: \${value}\`);
  });
}

interactWithContract();`
  },
  {
    id: 'staking',
    category: 'DeFi',
    icon: FaCoins,
    title: '质押 QAU',
    description: '将 QAU 质押到验证节点获取收益',
    language: 'javascript',
    code: `import { QuantaureumSDK, parseQAU } from '@quantaureum/sdk';

const sdk = new QuantaureumSDK({ network: 'mainnet' });

async function stakeQAU(validatorAddress, amount) {
  const wallet = await sdk.wallet.connect();
  const staking = sdk.staking;
  
  // 检查验证者信息
  const validator = await staking.getValidator(validatorAddress);
  console.log('验证者:', validator.name);
  console.log('当前 APY:', validator.apy + '%');
  
  // 执行质押
  const tx = await staking.stake({
    validator: validatorAddress,
    amount: parseQAU(amount)
  });
  
  console.log('质押交易:', tx.hash);
  await tx.wait();
  
  // 查询质押信息
  const myStakes = await staking.getStakes(wallet.address);
  console.log('我的质押:', myStakes);
  
  return myStakes;
}

// 质押 1000 QAU
stakeQAU('0xValidatorAddress...', '1000');`
  },
  {
    id: 'quantum-signature',
    category: '量子安全',
    icon: FaRocket,
    title: '量子安全签名',
    description: '使用后量子密码算法签名消息',
    language: 'javascript',
    code: `import { QuantaureumSDK, QuantumCrypto } from '@quantaureum/sdk';

const sdk = new QuantaureumSDK({ network: 'mainnet' });

async function quantumSign() {
  const wallet = await sdk.wallet.connect();
  
  // 使用 CRYSTALS-Dilithium 签名
  const message = 'Hello, Quantum World!';
  
  const signature = await wallet.signMessage(message, {
    algorithm: 'dilithium3' // NIST Level 3
  });
  
  console.log('消息:', message);
  console.log('签名:', signature);
  
  // 验证签名
  const isValid = await QuantumCrypto.verify(
    message,
    signature,
    wallet.publicKey
  );
  
  console.log('签名有效:', isValid);
  
  // 获取签名详情
  const signatureInfo = QuantumCrypto.parseSignature(signature);
  console.log('算法:', signatureInfo.algorithm);
  console.log('安全级别:', signatureInfo.securityLevel);
  
  return { signature, isValid };
}

quantumSign();`
  }
];

const categories = ['全部', '钱包', '交易', '智能合约', 'DeFi', '量子安全'];

export default function DevelopersExamplesPage() {
  const [selectedCategory, setSelectedCategory] = useState('全部');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const filteredExamples = selectedCategory === '全部'
    ? codeExamples
    : codeExamples.filter(ex => ex.category === selectedCategory);

  const copyCode = (id: string, code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="min-h-screen relative">
      <ParticlesBackground />
      <EnhancedNavbar />
      <div className="relative z-10">
      {/* Hero Section */}
      <section className="pt-24 pb-16 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block px-4 py-2 bg-cyan-500/20 text-cyan-300 rounded-full text-sm mb-6">
              代码示例
            </span>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              快速上手
              <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent"> 代码示例 </span>
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
              复制粘贴即可运行的代码示例，帮助您快速集成 Quantaureum
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/developers/docs">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-6 py-3 bg-white/10 text-white rounded-xl font-semibold border border-white/20 flex items-center gap-2"
                >
                  <FaBook /> 完整文档
                </motion.button>
              </Link>
              <a href="https://github.com/quantaureum" target="_blank" rel="noopener noreferrer">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-6 py-3 bg-white/10 text-white rounded-xl font-semibold border border-white/20 flex items-center gap-2"
                >
                  <FaGithub /> GitHub
                </motion.button>
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Category Filter */}
      <section className="py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-wrap justify-center gap-3">
            {categories.map((category) => (
              <motion.button
                key={category}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  selectedCategory === category
                    ? 'bg-gradient-to-r from-cyan-600 to-purple-600 text-white'
                    : 'bg-white/10 text-gray-300 hover:bg-white/20'
                }`}
              >
                {category}
              </motion.button>
            ))}
          </div>
        </div>
      </section>

      {/* Code Examples */}
      <section className="py-8 px-4 pb-24">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {filteredExamples.map((example, index) => {
              const IconComponent = example.icon;
              return (
                <motion.div
                  key={example.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 overflow-hidden"
                >
                  {/* Header */}
                  <div className="p-6 border-b border-white/10">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-cyan-600/30 to-purple-600/30 flex items-center justify-center">
                          <IconComponent className="text-xl text-cyan-400" />
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-white">{example.title}</h3>
                          <p className="text-gray-400 text-sm">{example.description}</p>
                        </div>
                      </div>
                      <span className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-xs">
                        {example.category}
                      </span>
                    </div>
                  </div>

                  {/* Code Block */}
                  <div className="relative">
                    <div className="absolute top-3 right-3 flex gap-2">
                      <span className="px-2 py-1 bg-gray-800 text-gray-400 rounded text-xs">
                        {example.language}
                      </span>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => copyCode(example.id, example.code)}
                        className="p-2 bg-gray-800 hover:bg-gray-700 rounded text-gray-400 hover:text-white transition-colors"
                      >
                        {copiedId === example.id ? (
                          <FaCheck className="text-green-400" />
                        ) : (
                          <FaCopy />
                        )}
                      </motion.button>
                    </div>
                    <pre className="p-6 pt-12 overflow-x-auto text-sm">
                      <code className="text-gray-300 font-mono whitespace-pre">
                        {example.code}
                      </code>
                    </pre>
                  </div>

                  {/* Footer */}
                  <div className="p-4 border-t border-white/10 flex justify-between items-center">
                    <Link href="/developers/docs">
                      <span className="text-cyan-400 hover:text-cyan-300 text-sm flex items-center gap-1">
                        <FaBook /> 查看文档
                      </span>
                    </Link>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      className="px-4 py-2 bg-gradient-to-r from-cyan-600 to-purple-600 text-white rounded-lg text-sm font-medium flex items-center gap-2"
                    >
                      <FaPlay /> 在线运行
                    </motion.button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4 bg-black/30">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-cyan-600/20 to-purple-600/20 rounded-3xl border border-cyan-500/30 p-12"
          >
            <FaRocket className="text-5xl text-cyan-400 mx-auto mb-6" />
            <h2 className="text-3xl font-bold text-white mb-4">准备好开始构建了吗？</h2>
            <p className="text-gray-300 mb-8">查看完整文档，了解更多高级功能和最佳实践</p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/developers/docs">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  className="px-8 py-4 bg-gradient-to-r from-cyan-600 to-purple-600 text-white rounded-xl font-semibold"
                >
                  查看完整文档
                </motion.button>
              </Link>
              <Link href="/developers/sdk">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  className="px-8 py-4 bg-white/10 text-white rounded-xl font-semibold border border-white/20"
                >
                  下载 SDK
                </motion.button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
    <EnhancedFooter />
  </div>
  );
}
