'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const router = useRouter();

  useEffect(() => {
    // 检查钱包连接状态
    const checkWalletConnection = () => {
      // 这里应该检查实际的钱包连接状态
      // 暂时使用localStorage来模拟
      const walletConnected = localStorage.getItem('walletConnected');
      
      if (walletConnected === 'true') {
        setIsAuthenticated(true);
      } else {
        // 如果没有连接钱包，重定向到钱包连接页面
        router.push('/wallet/connect');
      }
      
      setIsLoading(false);
    };

    checkWalletConnection();
  }, [router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-white text-xl">正在验证钱包连接...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // 重定向中，不显示内容
  }

  return <>{children}</>;
};

export default ProtectedRoute;

