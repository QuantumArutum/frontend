/**
 * 服务端认证辅助函数
 * 用于在 API 路由中获取当前登录用户
 */

import { cookies } from 'next/headers';

export interface CurrentUser {
  uid: string;
  email: string;
  username: string;
}

/**
 * 从 cookies 中获取当前登录用户信息
 * 返回用户信息或 null（如果未登录）
 */
export async function getCurrentUser(): Promise<CurrentUser | null> {
  try {
    const cookieStore = cookies();
    
    // 尝试从 cookie 中获取用户信息
    // 注意：这里假设用户信息存储在 cookie 中
    // 如果使用 JWT，需要解析 token
    const userInfoCookie = cookieStore.get('user_info');
    
    if (userInfoCookie && userInfoCookie.value) {
      try {
        const userInfo = JSON.parse(userInfoCookie.value);
        return {
          uid: userInfo.id || userInfo.uid,
          email: userInfo.email,
          username: userInfo.username
        };
      } catch (e) {
        console.error('Failed to parse user_info cookie:', e);
      }
    }

    // 尝试从 localStorage 获取（通过 header 传递）
    // 这是备用方案，因为 API 路由无法直接访问 localStorage
    return null;
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
}

/**
 * 检查用户是否已登录
 */
export async function isAuthenticated(): Promise<boolean> {
  const user = await getCurrentUser();
  return user !== null;
}
