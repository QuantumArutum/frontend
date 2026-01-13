'use client';

import { useEffect } from 'react';

const QuantumWalletPage = () => {
  useEffect(() => {
    // 检测是否安装了 MetaMask
    if (typeof window !== 'undefined' && (window as any).ethereum) {
      // 已安装，触发 MetaMask 扩展打开
      (window as any).ethereum.request({ method: 'eth_requestAccounts' });
    } else {
      // 未安装，提示用户
      alert('请先安装 MetaMask 钱包扩展程序。\n\nPlease install MetaMask wallet extension first.');
    }
    // 返回钱包页面
    window.location.href = '/wallet';
  }, []);

  return null;
};

export default QuantumWalletPage;
