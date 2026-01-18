'use client';

import React, { useState } from 'react';
import { Card } from './ui/Card';
import { Badge } from './ui/Badge';

// 用户类型定义
interface UserProfile {
  name: string;
  email: string;
  walletAddress: string;
  balance: string;
  level: string;
  joinDate: string;
}

const ProfilePage: React.FC = () => {
  const [user] = useState<UserProfile>({
    name: '量子用户',
    email: 'user@quantaureum.com',
    walletAddress: '0x1234...5678',
    balance: '1,234.56 QAU',
    level: '白银会员',
    joinDate: '2024-01-15',
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* 量子网格背景 */}
      <div className="absolute inset-0 opacity-20">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
            linear-gradient(rgba(0, 245, 255, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0, 245, 255, 0.1) 1px, transparent 1px)
          `,
            backgroundSize: '50px 50px',
          }}
        ></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* 页面标题 */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent mb-4">
              个人中心
            </h1>
            <p className="text-gray-300">管理您的量子账户信息</p>
          </div>

          {/* 用户信息卡片 */}
          <Card className="bg-white/10 backdrop-blur-md border-white/20 p-6 mb-6">
            <div className="flex items-center space-x-6 mb-6">
              <div className="w-20 h-20 bg-gradient-to-r from-cyan-400 to-purple-400 rounded-full flex items-center justify-center">
                <span className="text-2xl font-bold text-white">{user.name.charAt(0)}</span>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white mb-2">{user.name}</h2>
                <Badge className="bg-gradient-to-r from-cyan-500 to-purple-500 text-white">
                  {user.level}
                </Badge>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">邮箱地址</label>
                <div className="bg-white/5 border border-white/20 rounded-lg p-3">
                  <span className="text-white">{user.email}</span>
                </div>
              </div>

              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">钱包地址</label>
                <div className="bg-white/5 border border-white/20 rounded-lg p-3">
                  <span className="text-white font-mono">{user.walletAddress}</span>
                </div>
              </div>

              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">账户余额</label>
                <div className="bg-white/5 border border-white/20 rounded-lg p-3">
                  <span className="text-green-400 font-bold">{user.balance}</span>
                </div>
              </div>

              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">注册时间</label>
                <div className="bg-white/5 border border-white/20 rounded-lg p-3">
                  <span className="text-white">{user.joinDate}</span>
                </div>
              </div>
            </div>
          </Card>

          {/* 操作按钮 */}
          <div className="flex flex-wrap gap-4 justify-center">
            <button className="bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200">
              编辑资料
            </button>
            <button className="bg-white/10 hover:bg-white/20 border border-white/20 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200">
              安全设置
            </button>
            <button className="bg-white/10 hover:bg-white/20 border border-white/20 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200">
              交易记录
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
