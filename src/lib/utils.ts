import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

// className 合并工具函数
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// 数字格式化工具函数
export const formatNumber = (num: number): string => {
  if (typeof num !== 'number' || isNaN(num)) return '0';
  
  if (num >= 1e15) return (num / 1e15).toFixed(1) + 'P';
  if (num >= 1e12) return (num / 1e12).toFixed(1) + 'T';
  if (num >= 1e9) return (num / 1e9).toFixed(1) + 'B';
  if (num >= 1e6) return (num / 1e6).toFixed(1) + 'M';
  if (num >= 1e3) return (num / 1e3).toFixed(1) + 'K';
  
  return num.toLocaleString();
};

// 格式化货币数量
export const formatCurrency = (amount: number, currency: string = 'QAU'): string => {
  const formatted = formatNumber(amount);
  return `${formatted} ${currency}`;
};

// 格式化百分比
export const formatPercentage = (value: number, decimals: number = 2): string => {
  if (typeof value !== 'number' || isNaN(value)) return '0%';
  return `${value.toFixed(decimals)}%`;
};

// 格式化日期
export const formatDate = (date: string | Date | null | undefined): string => {
  if (!date) return '';
  const d = new Date(date);
  return d.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });
};

// 格式化时间
export const formatDateTime = (date: string | Date | null | undefined): string => {
  if (!date) return '';
  const d = new Date(date);
  return d.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  });
};


// 计算剩余天数
export const getDaysLeft = (endDate: string | Date | null | undefined): number => {
  if (!endDate) return 0;
  const now = new Date();
  const end = new Date(endDate);
  const diffTime = end.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return Math.max(0, diffDays);
};

// 计算进度百分比
export const getProgress = (current: number, goal: number): number => {
  if (!goal || goal === 0) return 0;
  return Math.min((current / goal) * 100, 100);
};

// 状态文本映射
export const getStatusText = (status: number): string => {
  const statusMap: Record<number, string> = {
    0: "草稿",
    1: "审核中", 
    2: "进行中",
    3: "筹资成功",
    4: "项目完成",
    5: "已取消",
    6: "筹资失败"
  };
  return statusMap[status] || "未知";
};

// 状态颜色映射
export const getStatusColor = (status: number): string => {
  const colorMap: Record<number, string> = {
    0: "gray",
    1: "yellow",
    2: "blue", 
    3: "green",
    4: "green",
    5: "red",
    6: "red"
  };
  return colorMap[status] || "gray";
};

// 生成随机ID
export const generateId = (): string => {
  return Math.random().toString(36).substr(2, 9);
};

// 防抖函数
export const debounce = <T extends (...args: unknown[]) => unknown>(func: T, wait: number): ((...args: Parameters<T>) => void) => {
  let timeout: ReturnType<typeof setTimeout> | undefined;
  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

// 节流函数
export const throttle = <T extends (...args: unknown[]) => unknown>(func: T, limit: number): ((...args: Parameters<T>) => void) => {
  let inThrottle: boolean;
  return function(this: unknown, ...args: Parameters<T>) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};

// 复制到剪贴板
export const copyToClipboard = async (text: string): Promise<boolean> => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (err) {
    console.error('Failed to copy: ', err);
    return false;
  }
};

// 验证邮箱格式
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// 验证钱包地址格式
export const isValidWalletAddress = (address: string): boolean => {
  const addressRegex = /^0x[a-fA-F0-9]{40}$/;
  return addressRegex.test(address);
};

// 截断文本
export const truncateText = (text: string | null | undefined, maxLength: number = 50): string => {
  if (!text || text.length <= maxLength) return text || '';
  return text.substring(0, maxLength) + '...';
};

// 获取文件大小格式化
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// 颜色工具
export const hexToRgba = (hex: string, alpha: number = 1): string => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

// 深度合并对象
export const deepMerge = <T extends Record<string, unknown>>(target: T, source: Partial<T>): T => {
  const output = Object.assign({}, target);
  if (isObject(target) && isObject(source)) {
    Object.keys(source).forEach(key => {
      const sourceValue = source[key as keyof typeof source];
      const targetValue = target[key as keyof typeof target];
      if (isObject(sourceValue)) {
        if (!(key in target))
          Object.assign(output, { [key]: sourceValue });
        else
          (output as Record<string, unknown>)[key] = deepMerge(targetValue as Record<string, unknown>, sourceValue as Record<string, unknown>);
      } else {
        Object.assign(output, { [key]: sourceValue });
      }
    });
  }
  return output;
};

const isObject = (item: unknown): item is Record<string, unknown> => {
  return item !== null && typeof item === 'object' && !Array.isArray(item);
};


// 本地存储工具
export const storage = {
  set: <T>(key: string, value: T): void => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  },
  get: <T>(key: string, defaultValue: T | null = null): T | null => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) as T : defaultValue;
    } catch (error) {
      console.error('Error reading from localStorage:', error);
      return defaultValue;
    }
  },
  remove: (key: string): void => {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error('Error removing from localStorage:', error);
    }
  },
  clear: (): void => {
    try {
      localStorage.clear();
    } catch (error) {
      console.error('Error clearing localStorage:', error);
    }
  }
};

// URL 参数工具
export const urlParams = {
  get: (param: string): string | null => {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
  },
  set: (param: string, value: string): void => {
    const url = new URL(window.location.href);
    url.searchParams.set(param, value);
    window.history.pushState({}, '', url.toString());
  },
  remove: (param: string): void => {
    const url = new URL(window.location.href);
    url.searchParams.delete(param);
    window.history.pushState({}, '', url.toString());
  }
};

// 扩展 Navigator 接口以支持连接类型
interface NetworkInformation {
  effectiveType?: string;
}

declare global {
  interface Navigator {
    connection?: NetworkInformation;
    mozConnection?: NetworkInformation;
    webkitConnection?: NetworkInformation;
  }
}

// 设备检测
export const device = {
  isMobile: (): boolean => /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent),
  isTablet: (): boolean => /iPad|Android/i.test(navigator.userAgent) && window.innerWidth >= 768,
  isDesktop: (): boolean => !device.isMobile() && !device.isTablet(),
  getViewportSize: (): { width: number; height: number } => ({
    width: window.innerWidth,
    height: window.innerHeight
  })
};

// 网络状态检测
export const network = {
  isOnline: (): boolean => navigator.onLine,
  getConnectionType: (): string => {
    const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    return connection?.effectiveType || 'unknown';
  }
};
