import { useEffect, useState, useCallback, useRef } from 'react';
import { 
  auctionWebSocket, 
  WebSocketMessage, 
  BidUpdateMessage, 
  AuctionUpdateMessage,
  PriceChangeMessage,
  NotificationMessage
} from '../services/websocket/AuctionWebSocket';
import { BidRecord } from '../types/auction.types';

export interface UseAuctionWebSocketOptions {
  userId?: string;
  autoConnect?: boolean;
  onConnectionChange?: (connected: boolean) => void;
  onError?: (error: Error) => void;
}

export interface AuctionWebSocketState {
  connected: boolean;
  connecting: boolean;
  error: string | null;
  lastMessage: WebSocketMessage | null;
}

export function useAuctionWebSocket(options: UseAuctionWebSocketOptions = {}) {
  const { userId, autoConnect = true, onConnectionChange, onError } = options;
  
  const [state, setState] = useState<AuctionWebSocketState>({
    connected: false,
    connecting: false,
    error: null,
    lastMessage: null
  });

  const unsubscribeRefs = useRef<Set<() => void>>(new Set());

  // 连接WebSocket
  const connect = useCallback(async () => {
    if (state.connected || state.connecting) return;

    setState(prev => ({ ...prev, connecting: true, error: null }));

    try {
      await auctionWebSocket.connect(userId);
      setState(prev => ({ ...prev, connected: true, connecting: false }));
      onConnectionChange?.(true);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '连接失败';
      setState(prev => ({ ...prev, connected: false, connecting: false, error: errorMessage }));
      onConnectionChange?.(false);
      onError?.(error instanceof Error ? error : new Error(errorMessage));
    }
  }, [userId, state.connected, state.connecting, onConnectionChange, onError]);

  // 断开连接
  const disconnect = useCallback(() => {
    // 清理所有订阅
    unsubscribeRefs.current.forEach(unsubscribe => unsubscribe());
    unsubscribeRefs.current.clear();

    auctionWebSocket.disconnect();
    setState(prev => ({ ...prev, connected: false, connecting: false }));
    onConnectionChange?.(false);
  }, [onConnectionChange]);

  // 发送消息
  const sendMessage = useCallback((message: Record<string, unknown>) => {
    return auctionWebSocket.send(message);
  }, []);

  // 发送出价
  const sendBid = useCallback((auctionId: string, amount: number) => {
    return auctionWebSocket.sendBid(auctionId, amount);
  }, []);

  // 订阅消息
  const subscribe = useCallback((messageType: string, handler: (message: WebSocketMessage) => void) => {
    const unsubscribe = auctionWebSocket.subscribe(messageType, (message) => {
      setState(prev => ({ ...prev, lastMessage: message }));
      handler(message);
    });
    
    unsubscribeRefs.current.add(unsubscribe);
    return unsubscribe;
  }, []);

  // 订阅拍卖更新
  const subscribeToAuction = useCallback((auctionId: string, handler: (message: WebSocketMessage) => void) => {
    const unsubscribe = auctionWebSocket.subscribeToAuction(auctionId, (message) => {
      setState(prev => ({ ...prev, lastMessage: message }));
      handler(message);
    });
    
    unsubscribeRefs.current.add(unsubscribe);
    return unsubscribe;
  }, []);

  // 取消订阅拍卖
  const unsubscribeFromAuction = useCallback((auctionId: string) => {
    auctionWebSocket.unsubscribeFromAuction(auctionId);
  }, []);

  // 自动连接
  useEffect(() => {
    if (autoConnect) {
      connect();
    }

    return () => {
      if (autoConnect) {
        disconnect();
      }
    };
  }, [autoConnect, connect, disconnect]);

  return {
    ...state,
    connect,
    disconnect,
    sendMessage,
    sendBid,
    subscribe,
    subscribeToAuction,
    unsubscribeFromAuction
  };
}

// 专门用于拍卖详情页面的Hook
export function useAuctionDetails(auctionId: string) {
  const [currentPrice, setCurrentPrice] = useState<number>(0);
  const [totalBids, setTotalBids] = useState<number>(0);
  const [latestBid, setLatestBid] = useState<BidRecord | null>(null);
  const [auctionStatus, setAuctionStatus] = useState<'active' | 'ended' | 'paused'>('active');
  const [notifications, setNotifications] = useState<NotificationMessage[]>([]);

  const { connected, subscribeToAuction, unsubscribeFromAuction } = useAuctionWebSocket();

  useEffect(() => {
    if (!connected || !auctionId) return;

    const unsubscribe = subscribeToAuction(auctionId, (message) => {
      switch (message.type) {
        case 'bid_update':
          const bidUpdate = message as unknown as BidUpdateMessage;
          setCurrentPrice(bidUpdate.data.currentPrice);
          setTotalBids(bidUpdate.data.totalBids);
          setLatestBid(bidUpdate.data.newBid);
          break;

        case 'auction_update':
          const auctionUpdate = message as unknown as AuctionUpdateMessage;
          setAuctionStatus(auctionUpdate.data.status);
          if (auctionUpdate.data.currentPrice) {
            setCurrentPrice(auctionUpdate.data.currentPrice);
          }
          break;

        case 'price_change':
          const priceChange = message as unknown as PriceChangeMessage;
          setCurrentPrice(priceChange.data.newPrice);
          break;

        case 'user_notification':
          const notification = message as unknown as NotificationMessage;
          setNotifications(prev => [notification, ...prev.slice(0, 9)]); // 保留最新10条
          break;
      }
    });

    return () => {
      unsubscribe();
      unsubscribeFromAuction(auctionId);
    };
  }, [connected, auctionId, subscribeToAuction, unsubscribeFromAuction]);

  const clearNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  return {
    currentPrice,
    totalBids,
    latestBid,
    auctionStatus,
    notifications,
    clearNotifications,
    connected
  };
}

// 用于拍卖列表的Hook
export function useAuctionList() {
  const [priceUpdates, setPriceUpdates] = useState<Map<string, number>>(new Map());
  const [statusUpdates, setStatusUpdates] = useState<Map<string, string>>(new Map());
  const [newAuctions, setNewAuctions] = useState<string[]>([]);

  const { connected, subscribe } = useAuctionWebSocket();

  useEffect(() => {
    if (!connected) return;

    const unsubscribeBidUpdate = subscribe('bid_update', (message) => {
      const bidUpdate = message as unknown as BidUpdateMessage;
      setPriceUpdates(prev => new Map(prev.set(bidUpdate.data.auctionId, bidUpdate.data.currentPrice)));
    });

    const unsubscribeAuctionUpdate = subscribe('auction_update', (message) => {
      const auctionUpdate = message as unknown as AuctionUpdateMessage;
      setStatusUpdates(prev => new Map(prev.set(auctionUpdate.data.auctionId, auctionUpdate.data.status)));
    });

    const unsubscribeSystemAlert = subscribe('system_alert', (message) => {
      if (message.data.type === 'new_auction' && message.data.auctionId) {
        setNewAuctions(prev => [message.data.auctionId as string, ...prev.slice(0, 4)]); // 保留最新5条
      }
    });

    return () => {
      unsubscribeBidUpdate();
      unsubscribeAuctionUpdate();
      unsubscribeSystemAlert();
    };
  }, [connected, subscribe]);

  const clearPriceUpdate = useCallback((auctionId: string) => {
    setPriceUpdates(prev => {
      const newMap = new Map(prev);
      newMap.delete(auctionId);
      return newMap;
    });
  }, []);

  const clearStatusUpdate = useCallback((auctionId: string) => {
    setStatusUpdates(prev => {
      const newMap = new Map(prev);
      newMap.delete(auctionId);
      return newMap;
    });
  }, []);

  const clearNewAuction = useCallback((auctionId: string) => {
    setNewAuctions(prev => prev.filter(id => id !== auctionId));
  }, []);

  return {
    priceUpdates,
    statusUpdates,
    newAuctions,
    clearPriceUpdate,
    clearStatusUpdate,
    clearNewAuction,
    connected
  };
}

// 用于通知的Hook
export function useAuctionNotifications() {
  const [notifications, setNotifications] = useState<NotificationMessage[]>([]);
  const [unreadCount, setUnreadCount] = useState<number>(0);

  const { connected, subscribe } = useAuctionWebSocket();

  useEffect(() => {
    if (!connected) return;

    const unsubscribe = subscribe('user_notification', (message) => {
      const notification = message as NotificationMessage;
      setNotifications(prev => [notification, ...prev]);
      setUnreadCount(prev => prev + 1);
    });

    return unsubscribe;
  }, [connected, subscribe]);

  const markAsRead = useCallback((notificationId?: string) => {
    if (notificationId) {
      // 标记特定通知为已读
      setNotifications(prev => 
        prev.map(n => n.data.userId === notificationId ? { ...n, read: true } : n)
      );
    } else {
      // 标记所有通知为已读
      setUnreadCount(0);
    }
  }, []);

  const clearNotifications = useCallback(() => {
    setNotifications([]);
    setUnreadCount(0);
  }, []);

  return {
    notifications,
    unreadCount,
    markAsRead,
    clearNotifications,
    connected
  };
}
