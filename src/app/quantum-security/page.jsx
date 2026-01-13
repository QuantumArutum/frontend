'use client';

import React from 'react';
import QuantumSecurityPanel from '@/app/components/QuantumSecurityPanel';

export default function QuantumSecurityPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white p-4">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent mb-4">
            量子安全管理中心
          </h1>
          <p className="text-gray-300 text-lg">
            管理和监控整个量子区块链生态系统的安全状态
          </p>
        </div>

        {/* Full Quantum Security Panel */}
        <QuantumSecurityPanel 
          onSecurityChange={(event) => {
            console.log('Global security event:', event);
            // 处理全局安全事件
            switch (event.type) {
              case 'keyGenerated':
                console.log('New key generated:', event.keyId);
                break;
              case 'keyRotated':
                console.log('Key rotated:', event.oldKeyId, '->', event.newKeyId);
                break;
              case 'securityLevelChanged':
                console.log('Security level changed:', event.newLevel);
                break;
              default:
                console.log('Unknown security event:', event);
            }
          }}
          showFullPanel={true}
        />
      </div>
    </div>
  );
}

