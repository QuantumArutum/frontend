'use client';

import React, { createContext, useState, useContext, useEffect, useMemo, ReactNode, ComponentType } from 'react';
import AuthService from '../../utils/auth';

// 用户类型定义
export interface User {
  id: string;
  username: string;
  email: string;
  role: string;
  permissions?: string[];
  isVerified?: boolean;
  avatar?: string;
  createdAt?: string;
  updatedAt?: string;
}

// 认证上下文类型
export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<AuthResult>;
  register: (username: string, email: string, password: string) => Promise<AuthResult>;
  logout: () => void;
  updateUser: (updatedData: Partial<User>) => void;
  getToken: () => string | null;
  checkAuth: () => boolean;
}

// 操作结果类型
export interface AuthResult {
  success: boolean;
  error?: {
    code: string;
    message: string;
  };
  user?: User;
}

// 创建认证上下文
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

// AuthProvider Props
interface AuthProviderProps {
  children: ReactNode;
}

// 认证提供者组件
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  // Use useMemo to ensure authService is stable across renders
  const authService = useMemo(() => AuthService, []);

  // 检查当前认证状态（基于 httpOnly cookie 通过后端 API）
  useEffect(() => {
    const checkAuthStatus = async (): Promise<void> => {
      try {
        const authenticated = authService.isAuthenticated();
        setIsAuthenticated(authenticated);
        if (authenticated) {
          const currentUser = authService.getCurrentUser();
          setUser(currentUser);
        }
      } catch (e) {
        console.error('Error checking auth status:', e);
        setIsAuthenticated(false);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    checkAuthStatus();
  }, [authService]);


  // 登录函数
  const login = async (email: string, password: string): Promise<AuthResult> => {
    const result = await authService.login({ email, password });
    if (result.success && result.user) {
      setUser(result.user);
      setIsAuthenticated(true);
    }
    return result;
  };

  // 注册函数
  const register = async (username: string, email: string, password: string): Promise<AuthResult> => {
    const result = await authService.register({ username, email, password });
    if (result.success && result.user) {
      setUser(result.user);
      setIsAuthenticated(true);
    }
    return result;
  };

  // 登出函数
  const logout = (): void => {
    authService.logout();
    setUser(null);
    setIsAuthenticated(false);
  };

  // 更新用户信息（仅更新内存中的用户对象）
  const updateUser = (updatedData: Partial<User>): void => {
    if (user) {
      const updatedUser = { ...user, ...updatedData };
      setUser(updatedUser);
    }
  };

  // 获取认证令牌（从 AuthService 内存中获取）
  const getToken = (): string | null => {
    return authService.getToken();
  };

  // 检查是否已认证（使用 AuthService）
  const checkAuth = (): boolean => {
    return authService.isAuthenticated();
  };

  const value: AuthContextType = {
    user,
    isAuthenticated,
    loading,
    login,
    register,
    logout,
    updateUser,
    getToken,
    checkAuth
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// 自定义Hook用于使用认证上下文
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// 高阶组件：保护需要认证的路由
export function withAuth<P extends object>(WrappedComponent: ComponentType<P>): React.FC<P> {
  const AuthenticatedComponent: React.FC<P> = (props) => {
    const { isAuthenticated, loading } = useAuth();
    
    if (loading) {
      return (
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          fontSize: '1.2rem',
          color: '#6c757d'
        }}>
          正在验证身份...
        </div>
      );
    }
    
    if (!isAuthenticated) {
      if (typeof window !== 'undefined') {
        window.location.href = '/zh-CN/auth/login';
      }
      return null;
    }
    
    return <WrappedComponent {...props} />;
  };
  
  return AuthenticatedComponent;
}

export default AuthContext;

