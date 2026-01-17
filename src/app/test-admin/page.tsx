'use client';

import React, { useState } from 'react';
import { barongAPI } from '@/api/client';

export default function TestAdminPage() {
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState('aurum51668@outlook.com');

  const runMigration = async () => {
    setLoading(true);
    try {
      const response = await barongAPI.post('/public/community/migrate-moderator-system');
      setResult(response.data);
    } catch (error: any) {
      setResult({ error: error.message, details: error.response?.data });
    } finally {
      setLoading(false);
    }
  };

  const addModerator = async () => {
    setLoading(true);
    try {
      // 首先尝试直接插入（绕过权限检查）
      const response = await barongAPI.post('/public/community/mod/moderators', {
        userId: userId,
        role: 'admin',
        currentUserId: 'system_admin', // 系统管理员
      });
      setResult(response.data);
    } catch (error: any) {
      setResult({ error: error.message, details: error.response?.data });
    } finally {
      setLoading(false);
    }
  };

  const checkModeratorStatus = async () => {
    setLoading(true);
    try {
      const response = await barongAPI.get(`/public/community/mod/moderators?currentUserId=${userId}`);
      setResult(response.data);
    } catch (error: any) {
      setResult({ error: error.message, details: error.response?.data });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">管理员测试工具</h1>

        <div className="space-y-6">
          {/* 数据库迁移 */}
          <div className="bg-gray-800 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">1. 运行数据库迁移</h2>
            <p className="text-gray-400 mb-4">
              创建版主系统所需的数据库表（moderators, mod_actions, user_bans）
            </p>
            <button
              onClick={runMigration}
              disabled={loading}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 rounded-lg"
            >
              {loading ? '执行中...' : '运行迁移'}
            </button>
          </div>

          {/* 添加版主 */}
          <div className="bg-gray-800 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">2. 添加版主权限</h2>
            <div className="mb-4">
              <label className="block text-sm mb-2">用户 ID (Email)</label>
              <input
                type="text"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                className="w-full px-4 py-2 bg-gray-700 rounded-lg"
                placeholder="aurum51668@outlook.com"
              />
            </div>
            <button
              onClick={addModerator}
              disabled={loading}
              className="px-6 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 rounded-lg"
            >
              {loading ? '添加中...' : '添加为管理员'}
            </button>
          </div>

          {/* 检查版主状态 */}
          <div className="bg-gray-800 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">3. 检查版主状态</h2>
            <button
              onClick={checkModeratorStatus}
              disabled={loading}
              className="px-6 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 rounded-lg"
            >
              {loading ? '检查中...' : '检查版主状态'}
            </button>
          </div>

          {/* 结果显示 */}
          {result && (
            <div className="bg-gray-800 p-6 rounded-lg">
              <h2 className="text-xl font-semibold mb-4">执行结果</h2>
              <pre className="bg-gray-900 p-4 rounded-lg overflow-auto text-sm">
                {JSON.stringify(result, null, 2)}
              </pre>
            </div>
          )}
        </div>

        <div className="mt-8 p-6 bg-yellow-900/20 border border-yellow-600 rounded-lg">
          <h3 className="text-lg font-semibold mb-2">⚠️ 注意事项</h3>
          <ul className="list-disc list-inside space-y-2 text-sm text-gray-300">
            <li>此页面仅用于测试和开发环境</li>
            <li>生产环境应该通过安全的管理后台操作</li>
            <li>确保数据库已正确配置 DATABASE_URL</li>
            <li>添加版主需要系统管理员权限</li>
          </ul>
        </div>

        <div className="mt-8 p-6 bg-blue-900/20 border border-blue-600 rounded-lg">
          <h3 className="text-lg font-semibold mb-2">📝 手动添加版主（SQL）</h3>
          <p className="text-sm text-gray-300 mb-2">如果 API 方式失败，可以直接在数据库执行：</p>
          <pre className="bg-gray-900 p-4 rounded-lg overflow-auto text-sm">
{`INSERT INTO moderators (user_id, role, appointed_by, appointed_at)
VALUES ('${userId}', 'admin', 'system', NOW())
ON CONFLICT (user_id) DO UPDATE 
SET role = 'admin', removed_at = NULL;`}
          </pre>
        </div>
      </div>
    </div>
  );
}
