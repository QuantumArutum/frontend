'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/Card';
import { Button } from './ui/Button';
import { Badge } from './ui/Badge';
import { Alert, AlertDescription } from './ui/Alert';
import { Separator } from './ui/Separator';
import { 
  Wallet, 
  CheckCircle, 
  AlertTriangle, 
  ExternalLink,
  Copy,
  RefreshCw,
  Shield,
  Globe
} from 'lucide-react';

// 网络配置类型
interface NetworkConfig {
  name: string;
  currency: string;
  color: string;
}

// 钱包连接信息类型
interface WalletInfo {
  account: string;
  networkId: number | null;
  networkName: string;
}

// 组件属性类型
interface WalletConnectProps {
  onWalletConnected?: (info: WalletInfo) => void;
  onWalletDisconnected?: () => void;
}

// 定义 ethereum provider 类型
interface EthereumProvider {
  isMetaMask?: boolean;
  request: (args: { method: string; params?: unknown[] }) => Promise<unknown>;
  on: (event: string, handler: (...args: unknown[]) => void) => void;
  removeListener: (event: string, handler: (...args: unknown[]) => void) => void;
}

// 类型安全的 ethereum 访问
const getEthereum = (): EthereumProvider | undefined => {
  if (typeof window !== 'undefined' && 'ethereum' in window) {
    return window.ethereum as EthereumProvider;
  }
  return undefined;
};

const WalletConnect: React.FC<WalletConnectProps> = ({ 
  onWalletConnected, 
  onWalletDisconnected 
}) => {
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [account, setAccount] = useState<string>('');
  const [balance, setBalance] = useState<string>('');
  const [networkId, setNetworkId] = useState<number | null>(null);
  const [networkName, setNetworkName] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [isMetaMaskInstalled, setIsMetaMaskInstalled] = useState<boolean>(false);

  // 支持的网络配置
  const supportedNetworks: Record<number, NetworkConfig> = {
    1: { name: 'Ethereum Mainnet', currency: 'ETH', color: 'blue' },
    5: { name: 'Goerli Testnet', currency: 'ETH', color: 'orange' },
    137: { name: 'Polygon Mainnet', currency: 'MATIC', color: 'purple' },
    80001: { name: 'Polygon Mumbai', currency: 'MATIC', color: 'pink' },
    56: { name: 'BSC Mainnet', currency: 'BNB', color: 'yellow' },
    97: { name: 'BSC Testnet', currency: 'BNB', color: 'green' }
  };


  const updateWalletInfo = useCallback(async (address: string): Promise<void> => {
    const ethereum = getEthereum();
    if (!ethereum) return;
    
    try {
      // 获取网络信息
      const chainId = await ethereum.request({ method: 'eth_chainId' }) as string;
      const netId = parseInt(chainId, 16);
      setNetworkId(netId);
      setNetworkName(supportedNetworks[netId]?.name || 'Unknown Network');

      // 获取余额
      const balanceWei = await ethereum.request({
        method: 'eth_getBalance',
        params: [address, 'latest']
      }) as string;
      
      const balanceEth = parseFloat((parseInt(balanceWei, 16) / Math.pow(10, 18)).toString()).toFixed(4);
      setBalance(balanceEth);
    } catch (err) {
      console.error('更新钱包信息失败:', err);
    }
  }, [supportedNetworks]);

  const handleDisconnect = useCallback((): void => {
    setIsConnected(false);
    setAccount('');
    setBalance('');
    setNetworkId(null);
    setNetworkName('');
    setError('');
    
    if (onWalletDisconnected) {
      onWalletDisconnected();
    }
  }, [onWalletDisconnected]);

  const handleAccountsChanged = useCallback(async (accounts: unknown): Promise<void> => {
    const accountsArray = accounts as string[];
    if (accountsArray.length === 0) {
      handleDisconnect();
    } else {
      setAccount(accountsArray[0]);
      await updateWalletInfo(accountsArray[0]);
    }
  }, [handleDisconnect, updateWalletInfo]);

  const handleChainChanged = useCallback(async (chainId: unknown): Promise<void> => {
    const netId = parseInt(chainId as string, 16);
    setNetworkId(netId);
    setNetworkName(supportedNetworks[netId]?.name || 'Unknown Network');
    
    if (account) {
      await updateWalletInfo(account);
    }
  }, [account, supportedNetworks, updateWalletInfo]);

  const checkMetaMaskInstallation = useCallback((): void => {
    const ethereum = getEthereum();
    const installed = !!ethereum && ethereum.isMetaMask === true;
    setIsMetaMaskInstalled(installed);
  }, []);

  const checkConnection = useCallback(async (): Promise<void> => {
    const ethereum = getEthereum();
    if (!ethereum) return;

    try {
      const accounts = await ethereum.request({ method: 'eth_accounts' }) as string[];
      if (accounts.length > 0) {
        setAccount(accounts[0]);
        setIsConnected(true);
        await updateWalletInfo(accounts[0]);
      }
    } catch (err) {
      console.error('检查连接状态失败', err);
    }
  }, [updateWalletInfo]);

  useEffect(() => {
    checkMetaMaskInstallation();
    checkConnection();

    const setupEventListeners = (): void => {
      const ethereum = getEthereum();
      if (!ethereum) return;
      ethereum.on('accountsChanged', handleAccountsChanged);
      ethereum.on('chainChanged', handleChainChanged);
      ethereum.on('disconnect', handleDisconnect);
    };

    const removeEventListeners = (): void => {
      const ethereum = getEthereum();
      if (!ethereum) return;
      ethereum.removeListener('accountsChanged', handleAccountsChanged);
      ethereum.removeListener('chainChanged', handleChainChanged);
      ethereum.removeListener('disconnect', handleDisconnect);
    };

    setupEventListeners();
    return () => removeEventListeners();
  }, [checkMetaMaskInstallation, checkConnection, handleAccountsChanged, handleChainChanged, handleDisconnect]);

  const connectWallet = async (): Promise<void> => {
    if (!isMetaMaskInstalled) {
      setError('请先安装MetaMask钱包');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const ethereum = getEthereum();
      const accounts = await ethereum!.request({
        method: 'eth_requestAccounts'
      }) as string[];

      if (accounts.length > 0) {
        setAccount(accounts[0]);
        setIsConnected(true);
        await updateWalletInfo(accounts[0]);
        
        if (onWalletConnected) {
          onWalletConnected({
            account: accounts[0],
            networkId,
            networkName
          });
        }
      }
    } catch (err) {
      const error = err as { code?: number; message?: string };
      if (error.code === 4001) {
        setError('用户拒绝连接钱包');
      } else {
        setError('连接钱包失败: ' + (error.message || '未知错误'));
      }
    } finally {
      setIsLoading(false);
    }
  };

  const switchNetwork = async (targetNetworkId: number): Promise<void> => {
    const ethereum = getEthereum();
    if (!ethereum) return;

    try {
      await ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: `0x${targetNetworkId.toString(16)}` }],
      });
    } catch (err) {
      const error = err as { code?: number; message?: string };
      if (error.code === 4902) {
        await addNetwork(targetNetworkId);
      } else {
        setError('切换网络失败: ' + (error.message || '未知错误'));
      }
    }
  };

  const addNetwork = async (netId: number): Promise<void> => {
    const networkConfigs: Record<number, object> = {
      137: {
        chainId: '0x89',
        chainName: 'Polygon Mainnet',
        nativeCurrency: { name: 'MATIC', symbol: 'MATIC', decimals: 18 },
        rpcUrls: ['https://polygon-rpc.com/'],
        blockExplorerUrls: ['https://polygonscan.com/']
      },
      80001: {
        chainId: '0x13881',
        chainName: 'Polygon Mumbai',
        nativeCurrency: { name: 'MATIC', symbol: 'MATIC', decimals: 18 },
        rpcUrls: ['https://rpc-mumbai.maticvigil.com/'],
        blockExplorerUrls: ['https://mumbai.polygonscan.com/']
      }
    };

    const config = networkConfigs[netId];
    const ethereum = getEthereum();
    if (!config || !ethereum) return;

    try {
      await ethereum.request({
        method: 'wallet_addEthereumChain',
        params: [config],
      });
    } catch (err) {
      const error = err as { message?: string };
      setError('添加网络失败: ' + (error.message || '未知错误'));
    }
  };

  const copyAddress = (): void => {
    navigator.clipboard.writeText(account);
  };

  const formatAddress = (address: string): string => {
    if (!address) return '';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const isNetworkSupported = (netId: number | null): boolean => {
    return netId !== null && Object.prototype.hasOwnProperty.call(supportedNetworks, netId);
  };


  if (!isMetaMaskInstalled) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wallet className="h-5 w-5" />
            钱包连接
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              请先安装MetaMask钱包扩展程序
            </AlertDescription>
          </Alert>
          <Button 
            className="w-full mt-4" 
            onClick={() => window.open('https://metamask.io/', '_blank')}
          >
            <ExternalLink className="h-4 w-4 mr-2" />
            安装MetaMask
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wallet className="h-5 w-5" />
          钱包连接
          {isConnected && (
            <Badge variant="default" className="ml-auto">
              <CheckCircle className="h-3 w-3 mr-1" />
              已连接
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {!isConnected ? (
          <Button 
            onClick={connectWallet} 
            disabled={isLoading}
            className="w-full"
            size="lg"
          >
            {isLoading ? (
              <>
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                连接中...
              </>
            ) : (
              <>
                <Wallet className="h-4 w-4 mr-2" />
                连接MetaMask
              </>
            )}
          </Button>
        ) : (
          <div className="space-y-4">
            {/* 账户信息 */}
            <div className="p-4 bg-green-50 rounded-lg border border-green-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-green-900">钱包地址</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={copyAddress}
                  className="h-6 px-2"
                >
                  <Copy className="h-3 w-3" />
                </Button>
              </div>
              <div className="font-mono text-sm text-green-800">
                {formatAddress(account)}
              </div>
            </div>

            {/* 余额信息 */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 bg-blue-50 rounded-lg">
                <div className="text-sm text-blue-600 mb-1">余额</div>
                <div className="font-semibold text-blue-900">
                  {balance} {networkId ? supportedNetworks[networkId]?.currency || 'ETH' : 'ETH'}
                </div>
              </div>
              <div className="p-3 bg-purple-50 rounded-lg">
                <div className="text-sm text-purple-600 mb-1">网络</div>
                <Badge variant={isNetworkSupported(networkId) ? "default" : "destructive"}>
                  <Globe className="h-3 w-3 mr-1" />
                  {networkName}
                </Badge>
              </div>
            </div>

            {/* 网络切换 */}
            {!isNetworkSupported(networkId) && (
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  当前网络不受支持，请切换到支持的网络
                </AlertDescription>
              </Alert>
            )}

            <Separator />

            {/* 支持的网络列表 */}
            <div>
              <h4 className="text-sm font-medium mb-3">支持的网络</h4>
              <div className="grid grid-cols-2 gap-2">
                {Object.entries(supportedNetworks).map(([id, network]) => (
                  <Button
                    key={id}
                    variant={parseInt(id) === networkId ? "default" : "outline"}
                    size="sm"
                    onClick={() => switchNetwork(parseInt(id))}
                    className="justify-start"
                  >
                    <div className={`w-2 h-2 rounded-full bg-${network.color}-500 mr-2`} />
                    {network.name}
                  </Button>
                ))}
              </div>
            </div>

            <Separator />

            {/* 断开连接 */}
            <Button 
              variant="outline" 
              onClick={handleDisconnect}
              className="w-full"
            >
              断开连接
            </Button>
          </div>
        )}

        {/* 安全提示 */}
        <div className="text-xs text-gray-500 space-y-1">
          <div className="flex items-center gap-1">
            <Shield className="h-3 w-3" />
            <span>您的私钥安全存储在MetaMask中</span>
          </div>
          <p>• 我们不会存储您的私钥或助记词</p>
          <p>• 请确保只在官方网站使用钱包功能</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default WalletConnect;
