'use client';

import React, { useState } from 'react';
import { Wallet, Send, Download, Shield, Key, Copy, Eye, EyeOff } from 'lucide-react';

const QuantumWalletPage = () => {
  const [showPrivateKey, setShowPrivateKey] = useState(false);
  const [balance] = useState('1,234.56');

  return (
    <div className="min-h-screen relative p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Wallet className="w-10 h-10 text-purple-400" />
          <h1 className="text-4xl font-bold text-white">量子钱包</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 余额卡片 */}
          <div className="lg:col-span-2 bg-gradient-to-r from-purple-600 to-cyan-600 rounded-2xl p-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="text-white/80 mb-2">总余额</p>
                <h2 className="text-4xl font-bold text-white">{balance} QAU</h2>
                <p className="text-white/60 mt-2">≈ $12,345.60 USD</p>
              </div>
              <Shield className="w-16 h-16 text-white/30" />
            </div>
            <div className="flex gap-4">
              <button className="flex items-center gap-2 bg-white/20 hover:bg-white/30 text-white px-6 py-3 rounded-xl transition-colors">
                <Send className="w-5 h-5" /> 发送
              </button>
              <button className="flex items-center gap-2 bg-white/20 hover:bg-white/30 text-white px-6 py-3 rounded-xl transition-colors">
                <Download className="w-5 h-5" /> 接收
              </button>
            </div>
          </div>

          {/* 安全状态 */}
          <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl p-6">
            <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <Shield className="w-5 h-5 text-green-400" /> 安全状态
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-300">量子加密</span>
                <span className="text-green-400">已启用</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-300">双因素认证</span>
                <span className="text-green-400">已启用</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-300">备份状态</span>
                <span className="text-green-400">已备份</span>
              </div>
            </div>
          </div>
        </div>

        {/* 钱包地址 */}
        <div className="mt-6 bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl p-6">
          <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
            <Key className="w-5 h-5 text-purple-400" /> 钱包地址
          </h3>
          <div className="bg-gray-800/50 rounded-xl p-4">
            <div className="flex items-center justify-between">
              <code className="text-cyan-400 font-mono text-sm">0x742d35Cc6634C0532925a3b844Bc454e4438f44e</code>
              <button className="text-gray-400 hover:text-white transition-colors">
                <Copy className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* 私钥管理 */}
        <div className="mt-6 bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl p-6">
          <h3 className="text-xl font-semibold text-white mb-4">私钥管理</h3>
          <div className="bg-gray-800/50 rounded-xl p-4">
            <div className="flex items-center justify-between">
              <code className="text-gray-400 font-mono text-sm">
                {showPrivateKey ? '0x1234567890abcdef...' : '••••••••••••••••••••••••••••••••'}
              </code>
              <button onClick={() => setShowPrivateKey(!showPrivateKey)} className="text-gray-400 hover:text-white transition-colors">
                {showPrivateKey ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>
          <p className="text-yellow-400 text-sm mt-4">⚠️ 请勿向任何人透露您的私钥</p>
        </div>

        {/* 交易历史 */}
        <div className="mt-6 bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl p-6">
          <h3 className="text-xl font-semibold text-white mb-4">最近交易</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-800/50 rounded-xl">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-green-500/20 rounded-full flex items-center justify-center">
                  <Download className="w-5 h-5 text-green-400" />
                </div>
                <div>
                  <p className="text-white font-medium">接收</p>
                  <p className="text-gray-400 text-sm">来自 0x742d...f44e</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-green-400 font-medium">+100.00 QAU</p>
                <p className="text-gray-400 text-sm">2024-01-15</p>
              </div>
            </div>
            <div className="flex items-center justify-between p-4 bg-gray-800/50 rounded-xl">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-red-500/20 rounded-full flex items-center justify-center">
                  <Send className="w-5 h-5 text-red-400" />
                </div>
                <div>
                  <p className="text-white font-medium">发送</p>
                  <p className="text-gray-400 text-sm">发送至 0x123d...a1b2</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-red-400 font-medium">-50.00 QAU</p>
                <p className="text-gray-400 text-sm">2024-01-14</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuantumWalletPage;
