'use client';

import React, { useState, useEffect } from 'react';
import { Wallet, Send, Download, Shield, Key, Copy, RefreshCw, ExternalLink, ArrowLeft } from 'lucide-react';
import ParticlesBackground from '../components/ParticlesBackground';

const QuantumWalletPage = () => {
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [balance, setBalance] = useState<string>('0');
  const [isLoading, setIsLoading] = useState(true);
  const [isConnecting, setIsConnecting] = useState(false);
  const [copied, setCopied] = useState(false);
  const [chainId, setChainId] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  const loadWalletData = async (address: string) => {
    const ethereum = (window as any).ethereum;
    
    // Get chain ID
    const chainIdHex = await ethereum.request({ method: 'eth_chainId' });
    setChainId(parseInt(chainIdHex, 16).toString());

    // Get balance
    const balanceHex = await ethereum.request({
      method: 'eth_getBalance',
      params: [address, 'latest']
    });
    const balanceWei = parseInt(balanceHex, 16);
    setBalance((balanceWei / 1e18).toFixed(4));
  };

  const connectWallet = async () => {
    if (typeof window === 'undefined' || !(window as any).ethereum) {
      window.open('https://metamask.io/download/', '_blank');
      return;
    }

    setIsConnecting(true);
    setError(null);
    
    try {
      const ethereum = (window as any).ethereum;
      // Request connection - this will prompt MetaMask
      const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
      
      if (accounts && accounts.length > 0) {
        const address = accounts[0];
        setWalletAddress(address);
        await loadWalletData(address);
      }
    } catch (err: any) {
      console.error('Connection error:', err);
      if (err.code === 4001) {
        setError('Connection rejected by user');
      } else {
        setError('Failed to connect wallet');
      }
    } finally {
      setIsConnecting(false);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    let isMounted = true;
    
    const init = async () => {
      // Check if MetaMask is installed
      if (typeof window === 'undefined' || !(window as any).ethereum) {
        if (isMounted) {
          setError('MetaMask not installed');
          setIsLoading(false);
        }
        return;
      }

      try {
        const ethereum = (window as any).ethereum;
        
        // First check if already connected
        const accounts = await ethereum.request({ method: 'eth_accounts' });
        
        if (!isMounted) return;
        
        if (accounts && accounts.length > 0) {
          // Already connected, load data
          const address = accounts[0];
          setWalletAddress(address);
          await loadWalletData(address);
          setIsLoading(false);
        } else {
          // Not connected, auto-request connection
          await connectWallet();
        }
      } catch (err) {
        console.error('Error:', err);
        if (isMounted) {
          setError('Failed to load wallet data');
          setIsLoading(false);
        }
      }
    };

    // Small delay to ensure page is ready
    const timer = setTimeout(init, 300);
    
    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
  }, []);

  const copyAddress = () => {
    if (walletAddress) {
      navigator.clipboard.writeText(walletAddress);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const refreshBalance = async () => {
    if (!walletAddress) return;
    
    try {
      const balanceHex = await (window as any).ethereum.request({
        method: 'eth_getBalance',
        params: [walletAddress, 'latest']
      });
      setBalance((parseInt(balanceHex, 16) / 1e18).toFixed(4));
    } catch (err) {
      console.error('Refresh failed:', err);
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen relative flex items-center justify-center">
        <ParticlesBackground />
        <div className="relative z-10 text-center">
          <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-xl">Loading wallet...</p>
        </div>
      </div>
    );
  }

  // Error or not connected state
  if (error || !walletAddress) {
    return (
      <div className="min-h-screen relative flex items-center justify-center">
        <ParticlesBackground />
        <div className="relative z-10 text-center p-8 bg-white/10 backdrop-blur-md rounded-2xl border border-white/10 max-w-md">
          <Wallet className="w-16 h-16 text-purple-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-4">
            {error === 'MetaMask not installed' ? 'MetaMask Required' : 
             error === 'Connection rejected by user' ? 'Connection Rejected' : 'Connect Your Wallet'}
          </h2>
          <p className="text-gray-300 mb-6">
            {error === 'MetaMask not installed' 
              ? 'Please install MetaMask to use this feature.'
              : error === 'Connection rejected by user'
              ? 'You rejected the connection request. Click below to try again.'
              : 'Connect your MetaMask wallet to view your balance and transactions.'}
          </p>
          <button
            onClick={connectWallet}
            disabled={isConnecting}
            className="inline-flex items-center gap-2 px-6 py-3 bg-purple-500 hover:bg-purple-600 disabled:bg-purple-500/50 text-white rounded-xl transition-colors"
          >
            {isConnecting ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Connecting...
              </>
            ) : (
              <>
                <Wallet className="w-5 h-5" />
                {error === 'MetaMask not installed' ? 'Install MetaMask' : 'Connect Wallet'}
              </>
            )}
          </button>
        </div>
      </div>
    );
  }

  // Connected state - show wallet
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
              <span className="text-gray-300 text-sm">Chain: {chainId}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Balance Card */}
            <div className="lg:col-span-2 bg-gradient-to-r from-purple-600 to-cyan-600 rounded-2xl p-6 md:p-8">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <p className="text-white/80 mb-2">Total Balance</p>
                  <h2 className="text-3xl md:text-4xl font-bold text-white">{balance} QAU</h2>
                </div>
                <button 
                  onClick={refreshBalance}
                  className="p-3 bg-white/20 hover:bg-white/30 rounded-xl transition-colors"
                  title="Refresh balance"
                >
                  <RefreshCw className="w-6 h-6 text-white" />
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

            {/* Status Card */}
            <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl p-6">
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <Shield className="w-5 h-5 text-green-400" /> Status
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Connected</span>
                  <span className="text-green-400">✓ Yes</span>
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

          {/* Address Card */}
          <div className="mt-6 bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl p-6">
            <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <Key className="w-5 h-5 text-purple-400" /> Your Address
            </h3>
            <div className="bg-gray-800/50 rounded-xl p-4">
              <div className="flex items-center justify-between gap-4">
                <code className="text-cyan-400 font-mono text-sm md:text-base break-all">{walletAddress}</code>
                <button 
                  onClick={copyAddress}
                  className="shrink-0 p-2 text-gray-400 hover:text-white transition-colors"
                >
                  {copied ? <span className="text-green-400 text-sm">Copied!</span> : <Copy className="w-5 h-5" />}
                </button>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <a 
              href={`/explorer/address/${walletAddress}`}
              className="flex items-center justify-center gap-2 p-4 bg-white/10 hover:bg-white/20 rounded-xl transition-colors"
            >
              <ExternalLink className="w-5 h-5 text-cyan-400" />
              <span className="text-white">View on Explorer</span>
            </a>
            <a 
              href="/defi"
              className="flex items-center justify-center gap-2 p-4 bg-white/10 hover:bg-white/20 rounded-xl transition-colors"
            >
              <Wallet className="w-5 h-5 text-purple-400" />
              <span className="text-white">DeFi</span>
            </a>
            <a 
              href="/token-sale"
              className="flex items-center justify-center gap-2 p-4 bg-white/10 hover:bg-white/20 rounded-xl transition-colors"
            >
              <Shield className="w-5 h-5 text-amber-400" />
              <span className="text-white">Buy QAU</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuantumWalletPage;
