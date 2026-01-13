'use client';

import React, { useState, useEffect } from 'react';
import { Wallet, Send, Download, Shield, Key, Copy, RefreshCw, ExternalLink, ArrowLeft } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import '../../i18n';
import ParticlesBackground from '../components/ParticlesBackground';

const QuantumWalletPage = () => {
  const { t } = useTranslation();
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [balance, setBalance] = useState<string>('0');
  const [qauBalance, setQauBalance] = useState<string>('0');
  const [isLoading, setIsLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [chainId, setChainId] = useState<string>('');

  // Connect wallet and get data
  useEffect(() => {
    const connectAndFetch = async () => {
      if (typeof window !== 'undefined' && (window as any).ethereum) {
        try {
          // Request accounts
          const accounts = await (window as any).ethereum.request({ method: 'eth_requestAccounts' });
          if (accounts && accounts.length > 0) {
            setWalletAddress(accounts[0]);
            
            // Get chain ID
            const chainIdHex = await (window as any).ethereum.request({ method: 'eth_chainId' });
            setChainId(parseInt(chainIdHex, 16).toString());
            
            // Get ETH/native balance
            const balanceHex = await (window as any).ethereum.request({
              method: 'eth_getBalance',
              params: [accounts[0], 'latest']
            });
            const balanceWei = parseInt(balanceHex, 16);
            const balanceEth = (balanceWei / 1e18).toFixed(4);
            setBalance(balanceEth);
            
            // Try to get QAU token balance (if on Quantaureum network)
            try {
              // QAU token contract address - update this with your actual contract
              const qauTokenAddress = '0x0000000000000000000000000000000000000000'; // Placeholder
              const balanceOfData = '0x70a08231000000000000000000000000' + accounts[0].slice(2);
              
              const qauBalanceHex = await (window as any).ethereum.request({
                method: 'eth_call',
                params: [{
                  to: qauTokenAddress,
                  data: balanceOfData
                }, 'latest']
              });
              
              if (qauBalanceHex && qauBalanceHex !== '0x') {
                const qauBalanceWei = parseInt(qauBalanceHex, 16);
                setQauBalance((qauBalanceWei / 1e18).toFixed(4));
              }
            } catch (e) {
              // Token contract not available, use native balance as QAU
              setQauBalance(balanceEth);
            }
          }
        } catch (error) {
          console.error('Failed to connect wallet:', error);
        }
      }
      setIsLoading(false);
    };

    connectAndFetch();

    // Listen for account changes
    if (typeof window !== 'undefined' && (window as any).ethereum) {
      (window as any).ethereum.on('accountsChanged', (accounts: string[]) => {
        if (accounts.length > 0) {
          setWalletAddress(accounts[0]);
          window.location.reload();
        } else {
          setWalletAddress(null);
        }
      });

      (window as any).ethereum.on('chainChanged', () => {
        window.location.reload();
      });
    }
  }, []);

  const copyAddress = () => {
    if (walletAddress) {
      navigator.clipboard.writeText(walletAddress);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const refreshBalance = async () => {
    if (walletAddress && (window as any).ethereum) {
      setIsLoading(true);
      try {
        const balanceHex = await (window as any).ethereum.request({
          method: 'eth_getBalance',
          params: [walletAddress, 'latest']
        });
        const balanceWei = parseInt(balanceHex, 16);
        const balanceEth = (balanceWei / 1e18).toFixed(4);
        setBalance(balanceEth);
        setQauBalance(balanceEth);
      } catch (error) {
        console.error('Failed to refresh balance:', error);
      }
      setIsLoading(false);
    }
  };

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen relative flex items-center justify-center">
        <ParticlesBackground />
        <div className="relative z-10 text-center">
          <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-xl">Connecting to wallet...</p>
        </div>
      </div>
    );
  }

  if (!walletAddress) {
    return (
      <div className="min-h-screen relative flex items-center justify-center">
        <ParticlesBackground />
        <div className="relative z-10 text-center p-8 bg-white/10 backdrop-blur-md rounded-2xl border border-white/10 max-w-md">
          <Wallet className="w-16 h-16 text-purple-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-4">Wallet Not Connected</h2>
          <p className="text-gray-300 mb-6">Please connect your MetaMask wallet to continue.</p>
          <a
            href="/wallet"
            className="inline-flex items-center gap-2 px-6 py-3 bg-purple-500 hover:bg-purple-600 text-white rounded-xl transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Go to Connect Wallet
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative">
      <ParticlesBackground />
      <div className="relative z-10 p-4 md:p-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <a href="/wallet" className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                <ArrowLeft className="w-6 h-6 text-gray-400" />
              </a>
              <Wallet className="w-10 h-10 text-purple-400" />
              <h1 className="text-3xl md:text-4xl font-bold text-white">Quantum Wallet</h1>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-white/10 rounded-xl">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span className="text-gray-300 text-sm">Chain ID: {chainId}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Balance Card */}
            <div className="lg:col-span-2 bg-gradient-to-r from-purple-600 to-cyan-600 rounded-2xl p-6 md:p-8">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <p className="text-white/80 mb-2">Total Balance</p>
                  <h2 className="text-3xl md:text-4xl font-bold text-white">{qauBalance} QAU</h2>
                  <p className="text-white/60 mt-2">Native: {balance} ETH</p>
                </div>
                <button 
                  onClick={refreshBalance}
                  className="p-3 bg-white/20 hover:bg-white/30 rounded-xl transition-colors"
                >
                  <RefreshCw className={`w-6 h-6 text-white ${isLoading ? 'animate-spin' : ''}`} />
                </button>
              </div>
              <div className="flex flex-wrap gap-4">
                <button className="flex items-center gap-2 bg-white/20 hover:bg-white/30 text-white px-6 py-3 rounded-xl transition-colors">
                  <Send className="w-5 h-5" /> Send
                </button>
                <button className="flex items-center gap-2 bg-white/20 hover:bg-white/30 text-white px-6 py-3 rounded-xl transition-colors">
                  <Download className="w-5 h-5" /> Receive
                </button>
              </div>
            </div>

            {/* Security Status */}
            <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl p-6">
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <Shield className="w-5 h-5 text-green-400" /> Security Status
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Wallet Connected</span>
                  <span className="text-green-400">✓ Active</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Network</span>
                  <span className="text-cyan-400">{chainId === '1668' ? 'Quantaureum' : `Chain ${chainId}`}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Provider</span>
                  <span className="text-purple-400">MetaMask</span>
                </div>
              </div>
            </div>
          </div>

          {/* Wallet Address */}
          <div className="mt-6 bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl p-6">
            <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <Key className="w-5 h-5 text-purple-400" /> Wallet Address
            </h3>
            <div className="bg-gray-800/50 rounded-xl p-4">
              <div className="flex items-center justify-between gap-4">
                <code className="text-cyan-400 font-mono text-sm md:text-base break-all">{walletAddress}</code>
                <button 
                  onClick={copyAddress}
                  className="shrink-0 p-2 text-gray-400 hover:text-white transition-colors"
                >
                  {copied ? (
                    <span className="text-green-400 text-sm">Copied!</span>
                  ) : (
                    <Copy className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <a 
              href={`/explorer/address/${walletAddress}`}
              className="flex items-center justify-center gap-2 p-4 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/10 rounded-xl transition-colors"
            >
              <ExternalLink className="w-5 h-5 text-cyan-400" />
              <span className="text-white">View on Explorer</span>
            </a>
            <a 
              href="/defi"
              className="flex items-center justify-center gap-2 p-4 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/10 rounded-xl transition-colors"
            >
              <Wallet className="w-5 h-5 text-purple-400" />
              <span className="text-white">DeFi Dashboard</span>
            </a>
            <a 
              href="/token-sale"
              className="flex items-center justify-center gap-2 p-4 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/10 rounded-xl transition-colors"
            >
              <Shield className="w-5 h-5 text-amber-400" />
              <span className="text-white">Buy QAU Tokens</span>
            </a>
          </div>

          {/* Note */}
          <div className="mt-6 p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl">
            <p className="text-amber-400 text-sm text-center">
              💡 To use Quantaureum network, add it to MetaMask: Chain ID 1668, RPC URL will be available after mainnet launch.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuantumWalletPage;
