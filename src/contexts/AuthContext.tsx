'use client';

import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import authService from '../utils/auth';

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

// 错误类型定义
export interface AuthError {
  code: string;
  message: string;
}

// 认证状态类型
export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: AuthError | null;
}

// 登录凭证类型
export interface LoginCredentials {
  email: string;
  password: string;
}

// 注册数据类型
export interface RegisterData {
  username: string;
  email: string;
  password: string;
}

// 密码修改数据类型
export interface PasswordChangeData {
  currentPassword: string;
  newPassword: string;
}

// 操作结果类型
export interface AuthResult {
  success: boolean;
  error?: AuthError;
  user?: User;
  message?: string;
}

// 认证动作类型
type AuthActionType =
  | 'LOGIN_START'
  | 'LOGIN_SUCCESS'
  | 'LOGIN_FAILURE'
  | 'LOGOUT'
  | 'UPDATE_USER'
  | 'SET_LOADING'
  | 'CLEAR_ERROR';

// 认证动作
type AuthAction =
  | { type: 'LOGIN_START' }
  | { type: 'LOGIN_SUCCESS'; payload: { user: User } }
  | { type: 'LOGIN_FAILURE'; payload: { error: AuthError } }
  | { type: 'LOGOUT' }
  | { type: 'UPDATE_USER'; payload: { user: User } }
  | { type: 'SET_LOADING'; payload: { isLoading: boolean } }
  | { type: 'CLEAR_ERROR' };

// 认证上下文类型
export interface AuthContextType {
  // 状态
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: AuthError | null;

  // 方法
  login: (credentials: LoginCredentials) => Promise<AuthResult>;
  register: (userData: RegisterData) => Promise<AuthResult>;
  logout: () => void;
  updateUser: (profileData: Partial<User>) => Promise<AuthResult>;
  changePassword: (passwordData: PasswordChangeData) => Promise<AuthResult>;
  verifyEmail: (token: string) => Promise<AuthResult>;
  resendVerificationEmail: () => Promise<AuthResult>;
  forgotPassword: (email: string) => Promise<AuthResult>;
  resetPassword: (token: string, newPassword: string) => Promise<AuthResult>;
  clearError: () => void;
  hasPermission: (permission: string) => boolean;
  hasRole: (role: string) => boolean;
}

// 初始状态
const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,
};

// 认证状态reducer
function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case 'LOGIN_START':
      return {
        ...state,
        isLoading: true,
        error: null,
      };

    case 'LOGIN_SUCCESS':
      return {
        ...state,
        user: action.payload.user,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      };

    case 'LOGIN_FAILURE':
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: action.payload.error,
      };

    case 'LOGOUT':
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      };

    case 'UPDATE_USER':
      return {
        ...state,
        user: action.payload.user,
      };

    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload.isLoading,
      };

    case 'CLEAR_ERROR':
      return {
        ...state,
        error: null,
      };

    default:
      return state;
  }
}

// 创建认证上下文
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// AuthProvider Props
interface AuthProviderProps {
  children: ReactNode;
}

// 认证提供者组件
export function AuthProvider({ children }: AuthProviderProps): React.ReactElement {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // 初始化认证状态
  useEffect(() => {
    const initializeAuth = async (): Promise<void> => {
      try {
        dispatch({ type: 'SET_LOADING', payload: { isLoading: true } });

        // 检查本地存储的认证信息
        const user = authService.getCurrentUser();
        const isAuthenticated = authService.isAuthenticated();

        if (isAuthenticated && user) {
          // 验证token是否仍然有效
          if (!authService.isTokenExpired()) {
            dispatch({
              type: 'LOGIN_SUCCESS',
              payload: { user: user as User },
            });
          } else {
            // token过期，尝试刷新
            try {
              await authService.refreshAccessToken();
              dispatch({
                type: 'LOGIN_SUCCESS',
                payload: { user: user as User },
              });
            } catch {
              // 刷新失败，清除认证信息
              authService.logout();
              dispatch({ type: 'LOGOUT' });
            }
          }
        } else {
          dispatch({ type: 'LOGOUT' });
        }
      } catch (error) {
        console.error('初始化认证状态失败', error);
        dispatch({ type: 'LOGOUT' });
      } finally {
        dispatch({ type: 'SET_LOADING', payload: { isLoading: false } });
      }
    };

    initializeAuth();
  }, []);

  // 登录函数
  const login = async (credentials: LoginCredentials): Promise<AuthResult> => {
    try {
      dispatch({ type: 'LOGIN_START' });

      const result = await authService.login(credentials);

      if (result.success && result.user) {
        dispatch({
          type: 'LOGIN_SUCCESS',
          payload: { user: result.user as User },
        });
        return { success: true };
      } else {
        dispatch({
          type: 'LOGIN_FAILURE',
          payload: { error: result.error as AuthError },
        });
        return { success: false, error: result.error as AuthError };
      }
    } catch {
      const errorObj: AuthError = {
        code: 'LOGIN_ERROR',
        message: '登录过程中发生错误',
      };
      dispatch({
        type: 'LOGIN_FAILURE',
        payload: { error: errorObj },
      });
      return { success: false, error: errorObj };
    }
  };

  // 注册函数
  const register = async (userData: RegisterData): Promise<AuthResult> => {
    try {
      dispatch({ type: 'SET_LOADING', payload: { isLoading: true } });

      const result = await authService.register(userData);

      if (result.success) {
        // 注册成功后不自动登录，需要用户手动登录
        dispatch({ type: 'SET_LOADING', payload: { isLoading: false } });
        return { success: true, user: result.user as User };
      } else {
        dispatch({ type: 'SET_LOADING', payload: { isLoading: false } });
        return { success: false, error: result.error as AuthError };
      }
    } catch {
      dispatch({ type: 'SET_LOADING', payload: { isLoading: false } });
      return {
        success: false,
        error: {
          code: 'REGISTER_ERROR',
          message: '注册过程中发生错误',
        },
      };
    }
  };

  // 登出函数
  const logout = (): void => {
    authService.logout();
    dispatch({ type: 'LOGOUT' });
  };

  // 更新用户信息
  const updateUser = async (profileData: Partial<User>): Promise<AuthResult> => {
    try {
      const result = await authService.updateProfile(profileData);

      if (result.success && result.user) {
        dispatch({
          type: 'UPDATE_USER',
          payload: { user: result.user as User },
        });
        return { success: true };
      } else {
        return { success: false, error: result.error as AuthError };
      }
    } catch {
      return {
        success: false,
        error: {
          code: 'UPDATE_USER_ERROR',
          message: '更新用户信息时发生错误',
        },
      };
    }
  };

  // 修改密码
  const changePassword = async (passwordData: PasswordChangeData): Promise<AuthResult> => {
    try {
      const result = await authService.changePassword(passwordData);
      return result as AuthResult;
    } catch {
      return {
        success: false,
        error: {
          code: 'CHANGE_PASSWORD_ERROR',
          message: '修改密码时发生错误',
        },
      };
    }
  };

  // 验证邮箱
  const verifyEmail = async (token: string): Promise<AuthResult> => {
    try {
      const result = await authService.verifyEmail(token);

      if (result.success && state.user) {
        // 更新用户验证状态
        dispatch({
          type: 'UPDATE_USER',
          payload: {
            user: {
              ...state.user,
              isVerified: true,
            },
          },
        });
      }

      return result as AuthResult;
    } catch {
      return {
        success: false,
        error: {
          code: 'EMAIL_VERIFICATION_ERROR',
          message: '邮箱验证时发生错误',
        },
      };
    }
  };

  // 重发验证邮件
  const resendVerificationEmail = async (): Promise<AuthResult> => {
    try {
      return (await authService.resendVerificationEmail()) as AuthResult;
    } catch {
      return {
        success: false,
        error: {
          code: 'RESEND_EMAIL_ERROR',
          message: '重发验证邮件时发生错误',
        },
      };
    }
  };

  // 忘记密码
  const forgotPassword = async (email: string): Promise<AuthResult> => {
    try {
      return (await authService.forgotPassword(email)) as AuthResult;
    } catch {
      return {
        success: false,
        error: {
          code: 'FORGOT_PASSWORD_ERROR',
          message: '发送重置密码邮件时发生错误',
        },
      };
    }
  };

  // 重置密码
  const resetPassword = async (token: string, newPassword: string): Promise<AuthResult> => {
    try {
      return (await authService.resetPassword(token, newPassword)) as AuthResult;
    } catch {
      return {
        success: false,
        error: {
          code: 'RESET_PASSWORD_ERROR',
          message: '重置密码时发生错误',
        },
      };
    }
  };

  // 清除错误
  const clearError = (): void => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  // 检查权限
  const hasPermission = (permission: string): boolean => {
    return authService.hasPermission(permission);
  };

  // 检查角色
  const hasRole = (role: string): boolean => {
    return authService.hasRole(role);
  };

  // 上下文值
  const contextValue: AuthContextType = {
    // 状态
    user: state.user,
    isAuthenticated: state.isAuthenticated,
    isLoading: state.isLoading,
    error: state.error,

    // 方法
    login,
    register,
    logout,
    updateUser,
    changePassword,
    verifyEmail,
    resendVerificationEmail,
    forgotPassword,
    resetPassword,
    clearError,
    hasPermission,
    hasRole,
  };

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
}

// 使用认证上下文的Hook
export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth必须在AuthProvider内部使用');
  }

  return context;
}

// ProtectedRoute Props
interface ProtectedRouteProps {
  children: ReactNode;
  requiredRole?: string | null;
  requiredPermission?: string | null;
}

// 认证路由保护组件
export function ProtectedRoute({
  children,
  requiredRole = null,
  requiredPermission = null,
}: ProtectedRouteProps): React.ReactElement | null {
  const { isAuthenticated, isLoading, hasRole, hasPermission } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    // 重定向到登录页面
    if (typeof window !== 'undefined') {
      window.location.href = '/login';
    }
    return null;
  }

  // 检查角色权限
  if (requiredRole && !hasRole(requiredRole)) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">访问被拒绝</h2>
          <p className="text-gray-600">您没有访问此页面的权限</p>
        </div>
      </div>
    );
  }

  // 检查具体权限
  if (requiredPermission && !hasPermission(requiredPermission)) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">权限不足</h2>
          <p className="text-gray-600">您没有执行此操作的权限</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

export default AuthContext;
