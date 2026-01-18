import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuctionNotifications } from '../../hooks/useAuctionWebSocket';

interface NotificationProps {
  id: string;
  title: string;
  message: string;
  severity: 'info' | 'warning' | 'error' | 'success';
  timestamp: number;
  actionUrl?: string;
  onClose: (id: string) => void;
  onAction?: (url: string) => void;
}

const NotificationItem: React.FC<NotificationProps> = ({
  id,
  title,
  message,
  severity,
  timestamp,
  actionUrl,
  onClose,
  onAction,
}) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // 自动关闭通知（除了错误通知）
    if (severity !== 'error') {
      const timer = setTimeout(() => {
        setIsVisible(false);
        setTimeout(() => onClose(id), 300);
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [id, severity, onClose]);

  const getSeverityStyles = () => {
    switch (severity) {
      case 'success':
        return {
          bg: 'bg-green-500',
          border: 'border-green-400',
          icon: '✓',
          textColor: 'text-green-800',
        };
      case 'warning':
        return {
          bg: 'bg-yellow-500',
          border: 'border-yellow-400',
          icon: '⚠️',
          textColor: 'text-yellow-800',
        };
      case 'error':
        return {
          bg: 'bg-red-500',
          border: 'border-red-400',
          icon: '❌',
          textColor: 'text-red-800',
        };
      default:
        return {
          bg: 'bg-blue-500',
          border: 'border-blue-400',
          icon: 'ℹ️',
          textColor: 'text-blue-800',
        };
    }
  };

  const styles = getSeverityStyles();

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => onClose(id), 300);
  };

  const handleAction = () => {
    if (actionUrl && onAction) {
      onAction(actionUrl);
      handleClose();
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, x: 300, scale: 0.8 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: 300, scale: 0.8 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className={`relative bg-white rounded-lg shadow-lg border-l-4 ${styles.border} p-4 mb-3 max-w-sm`}
        >
          {/* 关闭按钮 */}
          <button
            onClick={handleClose}
            className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>

          {/* 通知内容 */}
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0">
              <span className="text-lg">{styles.icon}</span>
            </div>

            <div className="flex-1 min-w-0">
              <div className="font-semibold text-gray-900 text-sm mb-1">{title}</div>
              <div className="text-gray-700 text-sm leading-relaxed">{message}</div>

              {/* 时间戳 */}
              <div className="text-gray-500 text-xs mt-2">
                {new Date(timestamp).toLocaleTimeString()}
              </div>

              {/* 操作按钮 */}
              {actionUrl && (
                <button
                  onClick={handleAction}
                  className={`mt-2 px-3 py-1 text-xs font-medium rounded ${styles.bg} text-white hover:opacity-90 transition-opacity`}
                >
                  查看详情
                </button>
              )}
            </div>
          </div>

          {/* 进度条（自动关闭倒计时） */}
          {severity !== 'error' && (
            <motion.div
              className={`absolute bottom-0 left-0 h-1 ${styles.bg} rounded-bl-lg`}
              initial={{ width: '100%' }}
              animate={{ width: '0%' }}
              transition={{ duration: 5, ease: 'linear' }}
            />
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

interface RealtimeNotificationsProps {
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
  maxNotifications?: number;
  onNotificationAction?: (url: string) => void;
}

interface DisplayedNotification {
  id: string;
  title: string;
  message: string;
  severity: 'info' | 'warning' | 'error' | 'success';
  timestamp: number;
  actionUrl?: string;
}

const RealtimeNotifications: React.FC<RealtimeNotificationsProps> = ({
  position = 'top-right',
  maxNotifications = 5,
  onNotificationAction,
}) => {
  const { notifications, markAsRead, connected } = useAuctionNotifications();
  const [displayedNotifications, setDisplayedNotifications] = useState<DisplayedNotification[]>([]);

  useEffect(() => {
    // 限制显示的通知数量
    const limited = notifications.slice(0, maxNotifications).map((notification) => ({
      id: `${notification.timestamp || Date.now()}-${Math.random()}`,
      title: notification.data.title as string,
      message: notification.data.message as string,
      severity: notification.data.severity as 'info' | 'warning' | 'error' | 'success',
      timestamp: notification.timestamp || Date.now(),
      actionUrl: notification.data.actionUrl as string | undefined,
    }));

    setDisplayedNotifications(limited);
  }, [notifications, maxNotifications]);

  const handleCloseNotification = (id: string) => {
    setDisplayedNotifications((prev) => prev.filter((n) => n.id !== id));
    markAsRead();
  };

  const getPositionStyles = () => {
    switch (position) {
      case 'top-left':
        return 'top-4 left-4';
      case 'bottom-right':
        return 'bottom-4 right-4';
      case 'bottom-left':
        return 'bottom-4 left-4';
      default:
        return 'top-4 right-4';
    }
  };

  // 连接状态指示器
  const ConnectionIndicator = () => (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`fixed top-4 left-4 px-3 py-2 rounded-full text-xs font-medium ${
        connected
          ? 'bg-green-100 text-green-800 border border-green-200'
          : 'bg-red-100 text-red-800 border border-red-200'
      }`}
    >
      <div className="flex items-center space-x-2">
        <div className={`w-2 h-2 rounded-full ${connected ? 'bg-green-500' : 'bg-red-500'}`} />
        <span>{connected ? '实时连接' : '连接断开'}</span>
      </div>
    </motion.div>
  );

  return (
    <>
      {/* 连接状态指示器 */}
      <ConnectionIndicator />

      {/* 通知容器 */}
      <div className={`fixed ${getPositionStyles()} z-50 pointer-events-none`}>
        <div className="space-y-2 pointer-events-auto">
          <AnimatePresence>
            {displayedNotifications.map((notification) => (
              <NotificationItem
                key={notification.id}
                {...notification}
                onClose={handleCloseNotification}
                onAction={onNotificationAction}
              />
            ))}
          </AnimatePresence>
        </div>
      </div>
    </>
  );
};

export default RealtimeNotifications;
