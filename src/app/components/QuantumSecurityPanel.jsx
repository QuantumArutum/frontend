'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/Tabs';
import {
  Shield,
  Key,
  Lock,
  Unlock,
  Eye,
  EyeOff,
  RefreshCw,
  CheckCircle,
  AlertTriangle,
  Zap,
  Settings,
  Monitor,
  Activity,
  Cpu,
} from 'lucide-react';
import { quantumService } from '@/services/quantumService';

const QuantumSecurityPanel = ({ onSecurityChange, showFullPanel = false }) => {
  const [securityStatus, setSecurityStatus] = useState({
    isEnabled: true,
    encryptionLevel: 'Quantum',
    keyRotationStatus: 'Active',
    lastKeyRotation: new Date(),
    activeConnections: 0,
    threatLevel: 'Low',
  });

  const [systemMetrics, setSystemMetrics] = useState({
    encryptionOperations: 0,
    decryptionOperations: 0,
    keyGenerations: 0,
    signatureVerifications: 0,
    quantumRandomGenerations: 0,
    averageResponseTime: 0,
  });

  const [supportedAlgorithms, setSupportedAlgorithms] = useState([]);
  const [selectedAlgorithm, setSelectedAlgorithm] = useState('AES-256-GCM');
  const [keyManagement, setKeyManagement] = useState({
    keys: [],
    selectedKey: null,
  });

  const [loading, setLoading] = useState(false);
  const [testResults, setTestResults] = useState(null);

  useEffect(() => {
    loadSystemStatus();
    loadSupportedAlgorithms();

    // 定期更新状态
    const interval = setInterval(loadSystemStatus, 30000);
    return () => clearInterval(interval);
  }, []);

  const loadSystemStatus = async () => {
    try {
      const status = await quantumService.system.getStatus();
      const metrics = await quantumService.system.getMetrics();

      setSecurityStatus((prev) => ({
        ...prev,
        ...status,
      }));

      setSystemMetrics((prev) => ({
        ...prev,
        ...metrics,
      }));
    } catch (error) {
      console.error('Failed to load system status:', error);
    }
  };

  const loadSupportedAlgorithms = async () => {
    try {
      const algorithms = await quantumService.system.getSupportedAlgorithms();
      setSupportedAlgorithms(algorithms);
    } catch (error) {
      console.error('Failed to load algorithms:', error);
      // 使用默认算法列表
      setSupportedAlgorithms([
        'AES-256-GCM',
        'ChaCha20-Poly1305',
        'Kyber',
        'Dilithium',
        'Falcon',
        'SPHINCS+',
        'NTRU',
      ]);
    }
  };

  const generateNewKey = async () => {
    setLoading(true);
    try {
      const keyPair = await quantumService.keyManager.generateKeyPair();
      const keyId = `key_${Date.now()}`;

      await quantumService.keyManager.storeKey(keyId, keyPair.privateKey);

      setKeyManagement((prev) => ({
        ...prev,
        keys: [
          ...prev.keys,
          {
            id: keyId,
            algorithm: selectedAlgorithm,
            createdAt: new Date(),
            status: 'Active',
          },
        ],
      }));

      if (onSecurityChange) {
        onSecurityChange({ type: 'keyGenerated', keyId, algorithm: selectedAlgorithm });
      }
    } catch (error) {
      console.error('Failed to generate key:', error);
    } finally {
      setLoading(false);
    }
  };

  const rotateKey = async (keyId) => {
    setLoading(true);
    try {
      const newKeyId = await quantumService.keyManager.rotateKey(keyId);

      setKeyManagement((prev) => ({
        ...prev,
        keys: prev.keys.map((key) =>
          key.id === keyId ? { ...key, status: 'Rotated', rotatedTo: newKeyId } : key
        ),
      }));

      if (onSecurityChange) {
        onSecurityChange({ type: 'keyRotated', oldKeyId: keyId, newKeyId });
      }
    } catch (error) {
      console.error('Failed to rotate key:', error);
    } finally {
      setLoading(false);
    }
  };

  const runSecurityTest = async () => {
    setLoading(true);
    try {
      const results = await quantumService.system.runSelfTest();
      setTestResults(results);
    } catch (error) {
      console.error('Failed to run security test:', error);
      setTestResults({ success: false, error: error.message });
    } finally {
      setLoading(false);
    }
  };

  const getSecurityLevelColor = (level) => {
    const colors = {
      Quantum: 'text-purple-400',
      'Post-Quantum': 'text-cyan-400',
      Classical: 'text-green-400',
      Basic: 'text-yellow-400',
    };
    return colors[level] || 'text-gray-400';
  };

  const getThreatLevelColor = (level) => {
    const colors = {
      Low: 'text-green-400',
      Medium: 'text-yellow-400',
      High: 'text-red-400',
      Critical: 'text-red-600',
    };
    return colors[level] || 'text-gray-400';
  };

  // 简化版面板（用于嵌入其他应用）
  if (!showFullPanel) {
    return (
      <Card className="bg-white/10 backdrop-blur-md border-white/20">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Shield className="w-5 h-5 text-purple-400" />
              <CardTitle className="text-white text-sm">量子安全</CardTitle>
            </div>
            <Badge
              className={`${getSecurityLevelColor(securityStatus.encryptionLevel)} bg-purple-500/20`}
            >
              {securityStatus.encryptionLevel}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="grid grid-cols-2 gap-4 text-xs">
            <div>
              <p className="text-gray-400">加密状态</p>
              <div className="flex items-center space-x-1">
                <CheckCircle className="w-3 h-3 text-green-400" />
                <span className="text-green-400">已启用</span>
              </div>
            </div>
            <div>
              <p className="text-gray-400">威胁等级</p>
              <span className={getThreatLevelColor(securityStatus.threatLevel)}>
                {securityStatus.threatLevel}
              </span>
            </div>
          </div>
          <Button
            size="sm"
            className="w-full mt-3 bg-purple-500 hover:bg-purple-600"
            onClick={() => window.open('/quantum-security', '_blank')}
          >
            <Settings className="w-3 h-3 mr-1" />
            安全设置
          </Button>
        </CardContent>
      </Card>
    );
  }

  // 完整版面板
  return (
    <div className="space-y-6">
      {/* 安全状态概览 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-white/10 backdrop-blur-md border-white/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-300">加密级别</p>
                <p
                  className={`text-xl font-bold ${getSecurityLevelColor(securityStatus.encryptionLevel)}`}
                >
                  {securityStatus.encryptionLevel}
                </p>
              </div>
              <Shield className="w-8 h-8 text-purple-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/10 backdrop-blur-md border-white/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-300">威胁等级</p>
                <p
                  className={`text-xl font-bold ${getThreatLevelColor(securityStatus.threatLevel)}`}
                >
                  {securityStatus.threatLevel}
                </p>
              </div>
              <AlertTriangle className="w-8 h-8 text-yellow-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/10 backdrop-blur-md border-white/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-300">活跃连接</p>
                <p className="text-xl font-bold text-cyan-400">
                  {securityStatus.activeConnections}
                </p>
              </div>
              <Activity className="w-8 h-8 text-cyan-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/10 backdrop-blur-md border-white/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-300">响应时间</p>
                <p className="text-xl font-bold text-green-400">
                  {systemMetrics.averageResponseTime}ms
                </p>
              </div>
              <Cpu className="w-8 h-8 text-green-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 bg-white/10 rounded-lg">
          <TabsTrigger value="overview">概览</TabsTrigger>
          <TabsTrigger value="keys">密钥管理</TabsTrigger>
          <TabsTrigger value="algorithms">算法配置</TabsTrigger>
          <TabsTrigger value="monitoring">监控</TabsTrigger>
        </TabsList>

        {/* 概览 */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-white/10 backdrop-blur-md border-white/20">
              <CardHeader>
                <CardTitle className="text-white">系统状态</CardTitle>
                <CardDescription className="text-gray-300">量子加密系统运行状态</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">量子加密</span>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    <span className="text-green-400">运行中</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">密钥轮换</span>
                  <div className="flex items-center space-x-2">
                    <RefreshCw className="w-4 h-4 text-cyan-400" />
                    <span className="text-cyan-400">{securityStatus.keyRotationStatus}</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">最后轮换</span>
                  <span className="text-gray-400">
                    {securityStatus.lastKeyRotation.toLocaleDateString()}
                  </span>
                </div>

                <Button
                  onClick={runSecurityTest}
                  disabled={loading}
                  className="w-full bg-purple-500 hover:bg-purple-600"
                >
                  {loading ? (
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Zap className="w-4 h-4 mr-2" />
                  )}
                  运行安全测试
                </Button>

                {testResults && (
                  <div
                    className={`p-3 rounded-lg ${testResults.success ? 'bg-green-500/20 border border-green-500/30' : 'bg-red-500/20 border border-red-500/30'}`}
                  >
                    <div className="flex items-center space-x-2">
                      {testResults.success ? (
                        <CheckCircle className="w-4 h-4 text-green-400" />
                      ) : (
                        <AlertTriangle className="w-4 h-4 text-red-400" />
                      )}
                      <span className={testResults.success ? 'text-green-400' : 'text-red-400'}>
                        {testResults.success ? '安全测试通过' : '安全测试失败'}
                      </span>
                    </div>
                    {testResults.error && (
                      <p className="text-red-300 text-sm mt-1">{testResults.error}</p>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="bg-white/10 backdrop-blur-md border-white/20">
              <CardHeader>
                <CardTitle className="text-white">操作统计</CardTitle>
                <CardDescription className="text-gray-300">量子加密操作统计</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-400">加密操作</p>
                    <p className="font-bold text-cyan-400">
                      {systemMetrics.encryptionOperations.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-400">解密操作</p>
                    <p className="font-bold text-purple-400">
                      {systemMetrics.decryptionOperations.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-400">密钥生成</p>
                    <p className="font-bold text-green-400">
                      {systemMetrics.keyGenerations.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-400">签名验证</p>
                    <p className="font-bold text-yellow-400">
                      {systemMetrics.signatureVerifications.toLocaleString()}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* 密钥管理 */}
        <TabsContent value="keys" className="space-y-6">
          <Card className="bg-white/10 backdrop-blur-md border-white/20">
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle className="text-white">密钥管理</CardTitle>
                  <CardDescription className="text-gray-300">管理量子加密密钥</CardDescription>
                </div>
                <Button
                  onClick={generateNewKey}
                  disabled={loading}
                  className="bg-cyan-500 hover:bg-cyan-600"
                >
                  <Key className="w-4 h-4 mr-2" />
                  生成新密钥
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {keyManagement.keys.length > 0 ? (
                <div className="space-y-4">
                  {keyManagement.keys.map((key) => (
                    <div key={key.id} className="bg-white/5 rounded-lg p-4 border border-white/10">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-bold text-white">{key.id}</p>
                          <p className="text-sm text-gray-400">
                            算法: {key.algorithm} | 创建时间: {key.createdAt.toLocaleString()}
                          </p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge
                            className={`${key.status === 'Active' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}
                          >
                            {key.status}
                          </Badge>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => rotateKey(key.id)}
                            disabled={loading || key.status !== 'Active'}
                          >
                            <RefreshCw className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Key className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-400">暂无密钥</p>
                  <p className="text-sm text-gray-500 mt-2">点击"生成新密钥"开始创建量子安全密钥</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* 算法配置 */}
        <TabsContent value="algorithms" className="space-y-6">
          <Card className="bg-white/10 backdrop-blur-md border-white/20">
            <CardHeader>
              <CardTitle className="text-white">支持的算法</CardTitle>
              <CardDescription className="text-gray-300">配置量子加密算法</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {supportedAlgorithms.map((algorithm) => (
                  <div
                    key={algorithm}
                    className={`p-4 rounded-lg border cursor-pointer transition-all duration-200 ${
                      selectedAlgorithm === algorithm
                        ? 'bg-purple-500/20 border-purple-500/50'
                        : 'bg-white/5 border-white/10 hover:bg-white/10'
                    }`}
                    onClick={() => setSelectedAlgorithm(algorithm)}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-white font-medium">{algorithm}</span>
                      {selectedAlgorithm === algorithm && (
                        <CheckCircle className="w-4 h-4 text-purple-400" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 监控 */}
        <TabsContent value="monitoring" className="space-y-6">
          <Card className="bg-white/10 backdrop-blur-md border-white/20">
            <CardHeader>
              <CardTitle className="text-white">实时监控</CardTitle>
              <CardDescription className="text-gray-300">量子加密系统实时监控</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-white font-medium mb-4">性能指标</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-400">平均响应时间</span>
                      <span className="text-cyan-400">{systemMetrics.averageResponseTime}ms</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">量子随机数生成</span>
                      <span className="text-purple-400">
                        {systemMetrics.quantumRandomGenerations}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">活跃连接数</span>
                      <span className="text-green-400">{securityStatus.activeConnections}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-white font-medium mb-4">安全状态</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-400">威胁检测</span>
                      <span className={getThreatLevelColor(securityStatus.threatLevel)}>
                        {securityStatus.threatLevel}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">密钥轮换</span>
                      <span className="text-cyan-400">{securityStatus.keyRotationStatus}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">加密级别</span>
                      <span className={getSecurityLevelColor(securityStatus.encryptionLevel)}>
                        {securityStatus.encryptionLevel}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default QuantumSecurityPanel;
