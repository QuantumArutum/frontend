'use client';

import React, { ReactNode } from 'react';
import QuantumBackground from '../common/QuantumBackground';

interface CommunityLayoutProps {
  children: ReactNode;
  backgroundIntensity?: 'light' | 'medium' | 'heavy';
  interactive?: boolean;
  className?: string;
}

const CommunityLayout: React.FC<CommunityLayoutProps> = ({
  children,
  backgroundIntensity = 'medium',
  interactive = true,
  className = '',
}) => {
  return (
    <div className={`min-h-screen relative overflow-hidden ${className}`}>
      {/* 量子渐变背景 */}
      <div
        className="absolute inset-0 w-full h-full"
        style={{
          background: `
            radial-gradient(circle at 20% 80%, rgba(120, 119, 198, 0.3) 0%, transparent 50%),
            radial-gradient(circle at 80% 20%, rgba(255, 119, 198, 0.3) 0%, transparent 50%),
            radial-gradient(circle at 40% 40%, rgba(120, 219, 255, 0.2) 0%, transparent 50%),
            linear-gradient(135deg, #1e1b4b 0%, #312e81 25%, #1e3a8a 50%, #1e40af 75%, #1d4ed8 100%)
          `,
          zIndex: -2,
        }}
      />

      {/* 动态粒子背景 */}
      <QuantumBackground
        id="community-particles"
        intensity={backgroundIntensity}
        interactive={interactive}
      />

      {/* 内容区域 */}
      <div className="relative z-10 w-full h-full">{children}</div>

      {/* 额外的装饰性元素 */}
      <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 1 }}>
        {/* 浮动的量子光点 */}
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-purple-400 rounded-full opacity-60 animate-pulse"></div>
        <div className="absolute top-3/4 right-1/4 w-1 h-1 bg-cyan-400 rounded-full opacity-80 animate-ping"></div>
        <div className="absolute top-1/2 left-3/4 w-1.5 h-1.5 bg-pink-400 rounded-full opacity-70 animate-pulse"></div>
        <div className="absolute top-1/3 right-1/3 w-1 h-1 bg-blue-400 rounded-full opacity-60 animate-ping"></div>

        {/* 量子波纹效果 */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <div
            className="w-96 h-96 border border-purple-500/20 rounded-full animate-ping"
            style={{ animationDuration: '4s' }}
          ></div>
          <div
            className="absolute inset-0 w-96 h-96 border border-cyan-500/20 rounded-full animate-ping"
            style={{ animationDuration: '6s', animationDelay: '2s' }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default CommunityLayout;
