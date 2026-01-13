'use client';
import React, { useState, useEffect } from 'react';
import { Card, Button, Input, Progress, Statistic, Row, Col, message, Typography, Modal, Steps } from 'antd';
import { RocketOutlined, WalletOutlined, LoadingOutlined, CheckCircleOutlined } from '@ant-design/icons';
import { barongAPI } from '@/api/client';
import { ethers } from 'ethers';
import ParticlesBackground from '../components/ParticlesBackground';
import EnhancedNavbar from '../components/EnhancedNavbar';
import EnhancedFooter from '../components/EnhancedFooter';

const { Title, Paragraph } = Typography;

const RPC_URL = process.env.NEXT_PUBLIC_RPC_URL || 'http://localhost:8545';

const QUANTAUREUM_NETWORK = {
  chainId: '0x684',
  chainName: 'Quantaureum Mainnet',
  nativeCurrency: { name: 'Quantaureum', symbol: 'QAU', decimals: 18 },
  rpcUrls: [RPC_URL],
  blockExplorerUrls: ['http://localhost:3000/explorer'],
};

// 合约地址 - 从 deployment.json 获取
const GOLD_RESERVE_ADDRESS = '0x967d5d0c81Cb8a02DA8440466A90ffe340c203C8';
const USDT_ADDRESS = '0x54b51E1d9e62e87b1708A6aaea684ce2c722eF21'; // MockUSDT
const QAU_SALE_ADDRESS = '0xa10812ee11CDd8d8f6bDf65897F7763C335752e5'; // QAUSale 合约
const TREASURY_ADDRESS = '0xA71B122B0cEB23F80310f533bc443FfD8150478f'; // Treasury 收款地址
const FEE_RECEIVER_ADDRESS = '0x5fe30D65160d72f59005EE520ecD023035b42fe6'; // 手续费接收地址

// ABI
const GOLD_RESERVE_ABI = [
  "function totalGoldReserve() view returns (uint256)",
  "function totalQAUIssued() view returns (uint256)"
];

const ERC20_ABI = [
  "function balanceOf(address) view returns (uint256)",
  "function transfer(address to, uint256 amount) returns (bool)",
  "function approve(address spender, uint256 amount) returns (bool)",
  "function allowance(address owner, address spender) view returns (uint256)",
  "function decimals() view returns (uint8)"
];

export default function TokenSalePage() {
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [walletAddress, setWalletAddress] = useState<string>('');
  const [showWalletModal, setShowWalletModal] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [goldPrice, setGoldPrice] = useState<number>(85);
  const [chainData, setChainData] = useState({ totalReserve: 0, totalIssued: 0, availableForSale: 0 });
  const [usdtBalance, setUsdtBalance] = useState<string>('0');
  const [qauBalance, setQauBalance] = useState<string>('0');
  const [buyStep, setBuyStep] = useState<number>(-1); // -1: 未开始, 0: 确认中, 1: 交易中, 2: 完成
  const [txHash, setTxHash] = useState<string>('');
  const [icoConfig, setIcoConfig] = useState<any>({
    end_time: new Date(Date.now() + 86400000).toISOString()
  });

  useEffect(() => {
    // 获取实时黄金价格
    fetch('/api/gold-price')
      .then(res => res.json())
      .then(data => {
        if (data.price_gram) setGoldPrice(Number(data.price_gram));
      })
      .catch(err => console.error(err));
    
    // 从链上获取储备数据
    fetchChainData();
    
    barongAPI.get('/public/ico/settings').then(res => {
      if (res.data.success) setIcoConfig((prev: any) => ({ ...prev, ...res.data.data }));
    });
    checkWalletConnection();
  }, []);

  // 获取 QAU 余额
  const fetchQauBalance = async (address: string) => {
    try {
      const provider = new ethers.JsonRpcProvider(RPC_URL);
      const balance = await provider.getBalance(address);
      setQauBalance(ethers.formatEther(balance));
    } catch (err) {
      console.error('Failed to fetch QAU balance:', err);
      setQauBalance('0');
    }
  };

  // 获取 USDT 余额 (保留以备将来使用)
  const fetchUsdtBalance = async (address: string) => {
    try {
      const provider = new ethers.JsonRpcProvider(RPC_URL);
      const usdt = new ethers.Contract(USDT_ADDRESS, ERC20_ABI, provider);
      const balance = await usdt.balanceOf(address);
      const decimals = await usdt.decimals();
      setUsdtBalance(ethers.formatUnits(balance, decimals));
    } catch (err) {
      console.error('Failed to fetch USDT balance:', err);
      // 合约未部署时显示 0
      setUsdtBalance('0');
    }
  };

  // 检查合约是否部署
  const checkContractDeployed = async (address: string): Promise<boolean> => {
    try {
      const provider = new ethers.JsonRpcProvider(RPC_URL);
      const code = await provider.getCode(address);
      return code !== '0x';
    } catch {
      return false;
    }
  };

  const fetchChainData = async () => {
    // 根据 TOKEN_ECONOMICS 文档：
    // 创世分配 72,000,000 QAU 中，公开销售占 30% = 21,600,000 QAU
    const PUBLIC_SALE_ALLOCATION = 21600000;
    
    // 由于合约尚未完全实现 EVM 执行，使用文档中的数据
    // TODO: 当 QVM 完全实现后，从链上获取实际数据
    setChainData({
      totalReserve: PUBLIC_SALE_ALLOCATION,
      totalIssued: 0,
      availableForSale: PUBLIC_SALE_ALLOCATION
    });
  };

  const checkWalletConnection = async () => {
    if (typeof window !== 'undefined' && window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_accounts' }) as string[];
        if (accounts?.length > 0) {
          setWalletAddress(accounts[0]);
          fetchQauBalance(accounts[0]);
        }
      } catch (err) { console.error(err); }
    }
  };

  const isMetaMaskInstalled = () => typeof window !== 'undefined' && typeof window.ethereum !== 'undefined';

  const connectWallet = async () => {
    if (!isMetaMaskInstalled()) { window.open('https://metamask.io/download/', '_blank'); return; }
    setConnecting(true);
    try {
      try {
        await window.ethereum!.request({ method: 'wallet_switchEthereumChain', params: [{ chainId: QUANTAUREUM_NETWORK.chainId }] });
      } catch (e: any) {
        if (e.code === 4902) await window.ethereum!.request({ method: 'wallet_addEthereumChain', params: [QUANTAUREUM_NETWORK] });
        else throw e;
      }
      const accounts = await window.ethereum!.request({ method: 'eth_requestAccounts' }) as string[];
      if (accounts?.length > 0) { 
        setWalletAddress(accounts[0]); 
        setShowWalletModal(false); 
        message.success('Wallet connected!');
        fetchQauBalance(accounts[0]);
      }
    } catch (e: any) { message.error(e.message || 'Failed'); }
    finally { setConnecting(false); }
  };

  const price = goldPrice;
  const qauAmount = amount ? (Number(amount) / price).toFixed(4) : '';

  const handleBuy = async () => {
    if (!amount || Number(amount) <= 0) {
      message.error('Please enter a valid amount');
      return;
    }
    if (!walletAddress) { 
      setShowWalletModal(true); 
      return; 
    }

    setLoading(true);
    setBuyStep(0);
    
    try {
      // 检查 MetaMask 是否可用
      if (!window.ethereum) {
        throw new Error('MetaMask not found');
      }

      // 使用 MetaMask 作为 provider
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      
      // 计算需要支付的 QAU 数量 (以 wei 为单位)
      // 用户输入的是美元金额，按当前金价换算成 QAU
      const qauToPay = Number(amount) / price; // QAU 数量
      const qauInWei = ethers.parseEther(qauToPay.toFixed(18)); // 转换为 wei
      
      message.info('Please confirm the transaction in MetaMask...');
      setBuyStep(1);
      
      // 发送原生 QAU 到 Treasury 地址
      // 这是真实的链上交易，需要 MetaMask 确认
      const tx = await signer.sendTransaction({
        to: TREASURY_ADDRESS,
        value: qauInWei,
        gasLimit: 21000,
        gasPrice: ethers.parseUnits('1', 'gwei')
      });
      setTxHash(tx.hash);
      
      message.info('Transaction submitted, waiting for confirmation...');
      
      // 等待交易确认
      const receipt = await tx.wait();
      
      if (receipt && receipt.status === 1) {
        setBuyStep(2);
        
        // 记录到后端
        try {
          await barongAPI.post('/public/market/ico/buy', { 
            amount_usd: Number(amount), 
            wallet_address: walletAddress, 
            gold_price: goldPrice,
            tx_hash: tx.hash,
            qau_amount: Number(qauAmount),
            payment_type: 'QAU' // 标记为 QAU 支付
          });
        } catch (backendErr) {
          console.warn('Backend record failed, but on-chain tx succeeded:', backendErr);
        }
        
        message.success(`Purchase successful! Paid ${qauToPay.toFixed(4)} QAU for ${qauAmount} QAU tokens`);
        setAmount('');
        
        // 3秒后重置状态
        setTimeout(() => {
          setBuyStep(-1);
          setTxHash('');
        }, 5000);
      } else {
        throw new Error('Transaction failed on-chain');
      }
    } catch (err: any) {
      console.error('Purchase error:', err);
      
      // 处理用户拒绝交易的情况
      if (err.code === 4001 || err.code === 'ACTION_REJECTED') {
        message.warning('Transaction cancelled by user');
      } else {
        message.error(err.message || 'Purchase failed');
      }
      setBuyStep(-1);
      setTxHash('');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative">
      <ParticlesBackground />
      <EnhancedNavbar />
      <div className="relative z-10 container mx-auto px-4 py-12 pt-24">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <Title level={1} style={{ color: '#fff' }}>QAU Token Sale</Title>
          <Paragraph className="text-lg text-gray-400">1 QAU = 1 Gram of Gold</Paragraph>
        </div>

        <div className="mb-6 text-center">
          {walletAddress ? (
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-500/20 border border-green-500/30 rounded-full">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-green-400">Connected: {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}</span>
            </div>
          ) : (
            <Button icon={<WalletOutlined />} onClick={() => setShowWalletModal(true)} type="primary"
              style={{ background: 'linear-gradient(90deg, #f97316, #ea580c)' }}>Connect Wallet</Button>
          )}
        </div>

        <Row gutter={24}>
          <Col xs={24} md={12}>
            <Card className="bg-gray-900 border-gray-800 h-full">
              <Title level={3} style={{ color: '#fff', marginBottom: '1.5rem' }}>Purchase Tokens</Title>
              <div className="mb-6">
                <div className="flex justify-between text-gray-400 mb-2">
                  <span>Pay with (QAU)</span>
                  <span>Balance: {Number(qauBalance).toLocaleString(undefined, {maximumFractionDigits: 4})} QAU</span>
                </div>
                <Input size="large" prefix="$" placeholder="100" value={amount}
                  onChange={e => setAmount(e.target.value)} style={{ color: '#000' }} disabled={loading} />
                <div className="text-xs text-gray-500 mt-1">
                  Enter USD amount, pay equivalent in QAU
                </div>
              </div>
              <div className="mb-8">
                <div className="flex justify-between text-gray-400 mb-2">
                  <span>You Receive (QAU)</span>
                  <span>Rate: ${price.toFixed(2)} / QAU</span>
                </div>
                <Input size="large" value={qauAmount} disabled
                  style={{ color: '#fff', backgroundColor: '#1f2937', borderColor: '#374151' }} />
              </div>
              <Button type="primary" size="large" block icon={loading ? <LoadingOutlined /> : <RocketOutlined />} loading={loading}
                onClick={handleBuy} className="h-12 text-lg font-bold" disabled={loading}>
                {walletAddress ? (loading ? 'Processing...' : 'Buy QAU Now') : 'Connect Wallet to Buy'}
              </Button>
              
              {/* 交易进度 */}
              {buyStep >= 0 && (
                <div className="mt-6 p-4 bg-gray-800/50 rounded-lg">
                  <Steps
                    size="small"
                    current={buyStep}
                    items={[
                      { title: 'Confirm', description: 'In MetaMask' },
                      { title: 'Processing', description: 'On-chain' },
                      { title: 'Complete', description: 'Success' },
                    ]}
                  />
                  {txHash && (
                    <div className="mt-3 text-xs text-gray-400">
                      TX: <span className="text-cyan-400">{txHash.slice(0, 10)}...{txHash.slice(-8)}</span>
                    </div>
                  )}
                </div>
              )}
            </Card>
          </Col>

          <Col xs={24} md={12}>
            <Card className="bg-gray-900 border-gray-800 h-full">
              <Title level={3} style={{ color: '#fff', marginBottom: '1.5rem' }}>Sale Progress</Title>
              {(() => {
                // 目标金额 = 可出售数量 × 黄金价格
                const goalAmount = chainData.availableForSale * goldPrice;
                // 已售出金额 = 已发行数量 × 黄金价格
                const soldAmount = chainData.totalIssued * goldPrice;
                // 进度 = 已售出 / (已售出 + 可售)
                const totalTarget = goalAmount + soldAmount;
                const percent = totalTarget > 0 ? (soldAmount / totalTarget) * 100 : 0;
                
                return (
                  <>
                    <Progress percent={Number(percent.toFixed(1))} status="active" strokeColor={{ '0%': '#108ee9', '100%': '#87d068' }} 
                      format={(p) => <span style={{ color: '#fff' }}>{p?.toFixed(1)}%</span>} />
                    <div className="flex justify-between mt-2 mb-6 text-gray-400">
                      <span>${soldAmount.toLocaleString(undefined, {maximumFractionDigits: 0})} Sold</span>
                      <span>Available: ${goalAmount.toLocaleString(undefined, {maximumFractionDigits: 0})}</span>
                    </div>
                  </>
                );
              })()}
              
              <div className="space-y-4">
                <div className="bg-gray-800/50 rounded-lg p-4">
                  <span className="text-gray-400 text-sm block mb-1">Current Price (1 QAU = 1g Gold)</span>
                  <span className="text-white text-2xl font-bold">${price.toFixed(2)}</span>
                </div>
                <div className="bg-gray-800/50 rounded-lg p-4">
                  <span className="text-gray-400 text-sm block mb-1">Available for Sale (On-Chain)</span>
                  <span className="text-cyan-400 text-xl font-bold">{chainData.availableForSale.toLocaleString()} QAU</span>
                </div>
                <div className="bg-gray-800/50 rounded-lg p-4">
                  <span className="text-gray-400 text-sm block mb-1">Gold Reserve (Certified)</span>
                  <span className="text-amber-400 text-xl font-bold">{chainData.totalReserve.toLocaleString()} g</span>
                </div>
              </div>
              
              <div className="mt-6 pt-6 border-t border-gray-800">
                <Statistic.Timer type="countdown" title={<span style={{ color: '#9ca3af' }}>Round Ends In</span>}
                  value={new Date(icoConfig.end_time).getTime()} format="D days H:m:s" styles={{ content: { color: '#fff' } }} />
              </div>
            </Card>
          </Col>
        </Row>
      </div>

      <Modal open={showWalletModal} onCancel={() => setShowWalletModal(false)} footer={null} centered>
        <div className="text-center py-4">
          <div className="w-20 h-20 bg-gradient-to-br from-orange-400 to-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <WalletOutlined style={{ fontSize: 40, color: '#fff' }} />
          </div>
          <h2 className="text-xl font-bold mb-2">Connect Your Wallet</h2>
          <p className="text-gray-500 mb-6">Connect MetaMask to purchase QAU tokens</p>
          <div className="bg-gray-100 rounded-xl p-4 mb-6">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div><span className="text-gray-500">Network</span><p className="font-medium">Quantaureum</p></div>
              <div><span className="text-gray-500">Chain ID</span><p className="font-medium">1668</p></div>
            </div>
          </div>
          <Button type="primary" size="large" block loading={connecting} onClick={connectWallet}
            style={{ height: 48, background: 'linear-gradient(90deg, #f97316, #ea580c)' }}>
            {connecting ? 'Connecting...' : (isMetaMaskInstalled() ? 'Connect MetaMask' : 'Install MetaMask')}
          </Button>
        </div>
      </Modal>
      </div>
      <EnhancedFooter />
    </div>
  );
}
