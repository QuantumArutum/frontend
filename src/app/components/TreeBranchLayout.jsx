'use client';

import React from 'react';
import { Card } from '../../components/ui/card';

const TreeBranchLayout = () => {
  const applications = [
    {
      id: 'trading',
      name: '量子交易所',
      description: '基于量子加密的安全交易平台',
      icon: '⚛️',
      status: 'active'
    },
    {
      id: 'wallet',
      name: '量子钱包',
      description: '量子安全的数字资产管理',
      icon: '💰',
      status: 'active'
    },
    {
      id: 'defi',
      name: 'DeFi协议',
      description: '去中心化金融服务平台',
      icon: '🏦',
      status: 'active'
    },
    {
      id: 'crowdfunding',
      name: '众筹平台',
      description: '基于区块链的众筹服务',
      icon: '🚀',
      status: 'active'
    },
    {
      id: 'lottery',
      name: '量子彩票',
      description: '公平透明的区块链彩票',
      icon: '🎲',
      status: 'active'
    },
    {
      id: 'sto',
      name: 'STO平台',
      description: '证券型代币发行平台',
      icon: '📈',
      status: 'active'
    },
    {
      id: 'token-sale',
      name: '代币销售',
      description: 'QAU代币公开发行平台',
      icon: '🪙',
      status: 'active'
    },
    {
      id: 'movies',
      name: '电影票务',
      description: '区块链电影票预订系统',
      icon: '🎬',
      status: 'active'
    },
    {
      id: 'concerts',
      name: '演唱会票务',
      description: '演唱会门票预订平台',
      icon: '🎵',
      status: 'active'
    },
    {
      id: 'flights',
      name: '机票预订',
      description: '全球机票预订服务',
      icon: '✈️',
      status: 'active'
    },
    {
      id: 'hotels',
      name: '酒店预订',
      description: '全球酒店预订平台',
      icon: '🏨',
      status: 'active'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* 量子网格背景 */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0" style={{
          backgroundImage: `
            linear-gradient(rgba(0, 245, 255, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0, 245, 255, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px'
        }}></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* 页面标题 */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent mb-4">
              Quantaureum 应用生态
            </h1>
            <p className="text-gray-300 text-lg">
              探索基于量子技术的下一代区块链应用，体验树状分布的创新布局
            </p>
          </div>

          {/* 树状布局 */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {applications.map((app, index) => (
              <Card 
                key={app.id}
                className="bg-white/10 backdrop-blur-md border-white/20 p-6 hover:bg-white/15 transition-all duration-300 cursor-pointer group"
                style={{
                  animationDelay: `${index * 100}ms`
                }}
              >
                <div className="text-center">
                  <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">
                    {app.icon}
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">
                    {app.name}
                  </h3>
                  <p className="text-gray-300 text-sm mb-4">
                    {app.description}
                  </p>
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <span className="text-green-400 text-sm">运行中</span>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* 连接线效果 */}
          <div className="mt-12 text-center">
            <div className="inline-block bg-white/10 backdrop-blur-md border border-white/20 rounded-lg p-6">
              <h3 className="text-xl font-bold text-white mb-2">
                🌐 量子互联生态
              </h3>
              <p className="text-gray-300">
                所有应用通过量子安全协议互联互通，构建完整的区块链生态系统
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TreeBranchLayout;

