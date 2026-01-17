// JWT认证工具类 - 使用原生 fetch API

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8081';

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

// 令牌类型定义
export interface Tokens {
  accessToken: string;
  refreshToken: string;
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

// API响应类型
interface ApiResponse<T = unknown> {
  success: boolean;
  user?: User;
  tokens?: Tokens;
  error?: AuthError;
  message?: string;
  data?: T;
}


// 操作结果类型
export interface AuthResult {
  success: boolean;
  error?: AuthError;
  user?: User;
  message?: string;
}

class AuthService {
  private token: string | null = null;
  private refreshTokenValue: string | null = null;
  private user: User | null = null;

  constructor() {
    if (typeof window !== 'undefined') {
      this.token = localStorage.getItem('auth_token');
      this.refreshTokenValue = localStorage.getItem('refresh_token');
      const userInfoStr = localStorage.getItem('user_info');
      if (userInfoStr) {
        try {
          this.user = JSON.parse(userInfoStr);
        } catch (e) {
          console.error('Failed to parse user info from localStorage', e);
        }
      }
    }
  }

  // 通用请求方法
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...(this.token ? { Authorization: `Bearer ${this.token}` } : {}),
      ...options.headers,
    };

    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers,
      });

      const data = await response.json();

      // 处理 401 错误 - 尝试刷新 token
      if (response.status === 401 && this.refreshTokenValue) {
        const refreshed = await this.refreshAccessToken();
        if (refreshed) {
          // 重试原始请求
          const retryResponse = await fetch(`${API_BASE_URL}${endpoint}`, {
            ...options,
            headers: {
              ...headers,
              Authorization: `Bearer ${this.token}`,
            },
          });
          return await retryResponse.json();
        }
      }

      return data;
    } catch (error) {
      console.error('Request failed:', error);
      throw error;
    }
  }

  // 用户登录
  async login(credentials: LoginCredentials): Promise<AuthResult> {
    try {
      const response = await this.request<ApiResponse>('/api/v1/auth/login', {
        method: 'POST',
        body: JSON.stringify(credentials),
      });

      if (response.success && response.user && response.tokens) {
        const { user, tokens } = response;

        this.token = tokens.accessToken;
        this.refreshTokenValue = tokens.refreshToken;
        this.user = user;

        // 保存到 localStorage
        if (typeof window !== 'undefined') {
          localStorage.setItem('auth_token', tokens.accessToken);
          localStorage.setItem('refresh_token', tokens.refreshToken);
          localStorage.setItem('user_info', JSON.stringify(user));
        }

        return {
          success: true,
          user: this.user || undefined,
        };
      } else {
        return {
          success: false,
          error: response.error,
        };
      }
    } catch (error) {
      console.error('登录失败:', error);
      return {
        success: false,
        error: {
          code: 'LOGIN_FAILED',
          message: '登录失败',
        },
      };
    }
  }


  // 用户注册
  async register(userData: RegisterData): Promise<AuthResult> {
    try {
      const response = await this.request<ApiResponse>('/api/v1/auth/register', {
        method: 'POST',
        body: JSON.stringify(userData),
      });

      if (response.success) {
        return {
          success: true,
          user: response.user,
        };
      } else {
        return {
          success: false,
          error: response.error,
        };
      }
    } catch (error) {
      console.error('注册失败:', error);
      return {
        success: false,
        error: {
          code: 'REGISTER_FAILED',
          message: '注册失败',
        },
      };
    }
  }

  // 刷新访问令牌
  async refreshAccessToken(): Promise<string | null> {
    try {
      if (!this.refreshTokenValue) {
        throw new Error('没有刷新令牌');
      }

      const response = await fetch(`${API_BASE_URL}/api/v1/auth/refresh`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refreshToken: this.refreshTokenValue }),
      });

      const data: ApiResponse = await response.json();

      if (data.success && data.tokens) {
        const { tokens } = data;

        this.token = tokens.accessToken;
        this.refreshTokenValue = tokens.refreshToken;

        // 更新 localStorage
        if (typeof window !== 'undefined') {
          localStorage.setItem('auth_token', tokens.accessToken);
          localStorage.setItem('refresh_token', tokens.refreshToken);
        }

        return this.token;
      } else {
        throw new Error('刷新令牌失败');
      }
    } catch (error) {
      console.error('刷新令牌失败:', error);
      this.logout();
      throw error;
    }
  }

  // 用户登出
  logout(): void {
    this.token = null;
    this.refreshTokenValue = null;
    this.user = null;

    // 清除 localStorage
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('user_info');
    }
  }

  // 检查是否已登录
  isAuthenticated(): boolean {
    return !!this.token && !!this.user;
  }

  // 检查token是否过期
  isTokenExpired(): boolean {
    if (!this.token) return true;

    try {
      const payload = JSON.parse(atob(this.token.split('.')[1]));
      const currentTime = Date.now() / 1000;
      return payload.exp < currentTime;
    } catch {
      return true;
    }
  }

  // 获取当前用户信息
  getCurrentUser(): User | null {
    return this.user;
  }

  // 获取令牌
  getToken(): string | null {
    return this.token;
  }

  // 检查用户权限
  hasPermission(permission: string): boolean {
    if (!this.user) return false;

    // 管理员拥有所有权限
    if (this.user.role === 'admin') return true;

    // 检查具体权限
    const permissions = this.user.permissions || [];
    return permissions.includes(permission);
  }

  // 检查用户角色
  hasRole(role: string): boolean {
    if (!this.user) return false;
    return this.user.role === role;
  }


  // 更新用户信息
  async updateProfile(profileData: Partial<User>): Promise<AuthResult> {
    try {
      const response = await this.request<ApiResponse>('/api/v1/auth/profile', {
        method: 'PUT',
        body: JSON.stringify(profileData),
      });

      if (response.success && response.user) {
        this.user = { ...this.user, ...response.user } as User;

        // 更新 localStorage
        if (typeof window !== 'undefined') {
          localStorage.setItem('user_info', JSON.stringify(this.user));
        }

        return {
          success: true,
          user: this.user,
        };
      } else {
        return {
          success: false,
          error: response.error,
        };
      }
    } catch (error) {
      console.error('更新用户信息失败:', error);
      return {
        success: false,
        error: {
          code: 'UPDATE_PROFILE_FAILED',
          message: '更新失败',
        },
      };
    }
  }

  // 修改密码
  async changePassword(passwordData: PasswordChangeData): Promise<AuthResult> {
    try {
      const response = await this.request<ApiResponse>('/api/v1/auth/change-password', {
        method: 'POST',
        body: JSON.stringify(passwordData),
      });

      if (response.success) {
        return {
          success: true,
          message: '密码修改成功',
        };
      } else {
        return {
          success: false,
          error: response.error,
        };
      }
    } catch (error) {
      console.error('修改密码失败:', error);
      return {
        success: false,
        error: {
          code: 'CHANGE_PASSWORD_FAILED',
          message: '修改密码失败',
        },
      };
    }
  }

  // 验证邮箱
  async verifyEmail(token: string): Promise<AuthResult> {
    try {
      const response = await this.request<ApiResponse>('/api/v1/auth/verify-email', {
        method: 'POST',
        body: JSON.stringify({ token }),
      });

      if (response.success) {
        // 更新用户验证状态
        if (this.user) {
          this.user.isVerified = true;
        }

        return {
          success: true,
          message: '邮箱验证成功',
        };
      } else {
        return {
          success: false,
          error: response.error,
        };
      }
    } catch (error) {
      console.error('邮箱验证失败:', error);
      return {
        success: false,
        error: {
          code: 'EMAIL_VERIFICATION_FAILED',
          message: '邮箱验证失败',
        },
      };
    }
  }

  // 重发验证邮件
  async resendVerificationEmail(): Promise<AuthResult> {
    try {
      const response = await this.request<ApiResponse>('/api/v1/auth/resend-verification', {
        method: 'POST',
      });

      return {
        success: response.success,
        message: response.message || '验证邮件已发送',
      };
    } catch (error) {
      console.error('重发验证邮件失败:', error);
      return {
        success: false,
        error: {
          code: 'RESEND_EMAIL_FAILED',
          message: '发送失败',
        },
      };
    }
  }


  // 忘记密码
  async forgotPassword(email: string): Promise<AuthResult> {
    try {
      const response = await this.request<ApiResponse>('/api/v1/auth/forgot-password', {
        method: 'POST',
        body: JSON.stringify({ email }),
      });

      return {
        success: response.success,
        message: response.message || '重置密码邮件已发送',
      };
    } catch (error) {
      console.error('忘记密码失败:', error);
      return {
        success: false,
        error: {
          code: 'FORGOT_PASSWORD_FAILED',
          message: '发送失败',
        },
      };
    }
  }

  // 重置密码
  async resetPassword(token: string, newPassword: string): Promise<AuthResult> {
    try {
      const response = await this.request<ApiResponse>('/api/v1/auth/reset-password', {
        method: 'POST',
        body: JSON.stringify({ token, newPassword }),
      });

      return {
        success: response.success,
        message: response.message || '密码重置成功',
      };
    } catch (error) {
      console.error('重置密码失败:', error);
      return {
        success: false,
        error: {
          code: 'RESET_PASSWORD_FAILED',
          message: '重置失败',
        },
      };
    }
  }
}

// 创建单例实例
const authService = new AuthService();

export default authService;
