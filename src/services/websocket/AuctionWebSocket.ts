import { BidRecord, AuctionItem } from '../../types/auction.types';

export interface WebSocketMessageData {
  auctionId?: string;
  [key: string]: unknown;
}

export interface WebSocketMessage {
  type:
    | 'bid_update'
    | 'auction_update'
    | 'price_change'
    | 'auction_end'
    | 'user_notification'
    | 'system_alert';
  data: WebSocketMessageData;
  timestamp: number;
  auctionId?: string;
}

export interface BidUpdateMessage {
  type: 'bid_update';
  data: {
    auctionId: string;
    newBid: BidRecord;
    currentPrice: number;
    totalBids: number;
  };
}

export interface AuctionUpdateMessage {
  type: 'auction_update';
  data: {
    auctionId: string;
    status: 'active' | 'ended' | 'paused';
    endTime?: string;
    currentPrice?: number;
  };
}

export interface PriceChangeMessage {
  type: 'price_change';
  data: {
    auctionId: string;
    oldPrice: number;
    newPrice: number;
    increment: number;
  };
}

export interface NotificationMessage {
  type: 'user_notification';
  timestamp?: number;
  data: {
    userId: string;
    title: string;
    message: string;
    severity: 'info' | 'warning' | 'error' | 'success';
    actionUrl?: string;
  };
}

export type AuctionWebSocketMessage =
  | BidUpdateMessage
  | AuctionUpdateMessage
  | PriceChangeMessage
  | NotificationMessage;

export class AuctionWebSocketClient {
  private ws: WebSocket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000;
  private heartbeatInterval: NodeJS.Timeout | null = null;
  private messageHandlers: Map<string, Set<(message: WebSocketMessage) => void>> = new Map();
  private connectionState: 'connecting' | 'connected' | 'disconnected' | 'error' = 'disconnected';
  private userId: string | null = null;

  constructor(private wsUrl: string = 'ws://localhost:8080/auction-ws') {
    this.setupEventHandlers();
  }

  // 连接WebSocket
  connect(userId?: string): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        this.userId = userId || null;
        this.connectionState = 'connecting';

        // 构建连接URL，包含用户ID
        const url = this.userId ? `${this.wsUrl}?userId=${this.userId}` : this.wsUrl;
        this.ws = new WebSocket(url);

        this.ws.onopen = () => {
          console.log('WebSocket连接已建立');
          this.connectionState = 'connected';
          this.reconnectAttempts = 0;
          this.startHeartbeat();
          resolve();
        };

        this.ws.onmessage = (event) => {
          try {
            const message: WebSocketMessage = JSON.parse(event.data);
            this.handleMessage(message);
          } catch (error) {
            console.error('解析WebSocket消息失败:', error);
          }
        };

        this.ws.onclose = (event) => {
          console.log('WebSocket连接已关闭', event.code, event.reason);
          this.connectionState = 'disconnected';
          this.stopHeartbeat();

          // 自动重连
          if (!event.wasClean && this.reconnectAttempts < this.maxReconnectAttempts) {
            this.scheduleReconnect();
          }
        };

        this.ws.onerror = (error) => {
          console.error('WebSocket错误:', error);
          this.connectionState = 'error';
          reject(error);
        };

        // 连接超时处理
        setTimeout(() => {
          if (this.connectionState === 'connecting') {
            this.ws?.close();
            reject(new Error('WebSocket连接超时'));
          }
        }, 10000);
      } catch (error) {
        this.connectionState = 'error';
        reject(error);
      }
    });
  }

  // 断开连接
  disconnect(): void {
    this.stopHeartbeat();
    if (this.ws) {
      this.ws.close(1000, '客户端主动断开');
      this.ws = null;
    }
    this.connectionState = 'disconnected';
  }

  // 发送消息
  send(message: Record<string, unknown>): boolean {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      try {
        this.ws.send(
          JSON.stringify({
            ...message,
            timestamp: Date.now(),
            userId: this.userId,
          })
        );
        return true;
      } catch (error) {
        console.error('发送WebSocket消息失败:', error);
        return false;
      }
    }
    console.warn('WebSocket未连接，无法发送消息');
    return false;
  }

  // 订阅特定类型的消息
  subscribe(messageType: string, handler: (message: WebSocketMessage) => void): () => void {
    if (!this.messageHandlers.has(messageType)) {
      this.messageHandlers.set(messageType, new Set());
    }
    this.messageHandlers.get(messageType)!.add(handler);

    // 返回取消订阅函数
    return () => {
      const handlers = this.messageHandlers.get(messageType);
      if (handlers) {
        handlers.delete(handler);
        if (handlers.size === 0) {
          this.messageHandlers.delete(messageType);
        }
      }
    };
  }

  // 订阅特定拍卖的更新
  subscribeToAuction(auctionId: string, handler: (message: WebSocketMessage) => void): () => void {
    // 发送订阅请求
    this.send({
      type: 'subscribe_auction',
      auctionId: auctionId,
    });

    return this.subscribe(`auction_${auctionId}`, handler);
  }

  // 取消订阅拍卖
  unsubscribeFromAuction(auctionId: string): void {
    this.send({
      type: 'unsubscribe_auction',
      auctionId: auctionId,
    });
    this.messageHandlers.delete(`auction_${auctionId}`);
  }

  // 发送出价
  sendBid(auctionId: string, amount: number): boolean {
    return this.send({
      type: 'place_bid',
      auctionId: auctionId,
      amount: amount,
    });
  }

  // 发送心跳
  sendHeartbeat(): boolean {
    return this.send({
      type: 'heartbeat',
    });
  }

  // 获取连接状态
  getConnectionState(): string {
    return this.connectionState;
  }

  // 是否已连接
  isConnected(): boolean {
    return this.connectionState === 'connected' && this.ws?.readyState === WebSocket.OPEN;
  }

  // 处理接收到的消息
  private handleMessage(message: WebSocketMessage): void {
    console.log('收到WebSocket消息:', message);

    // 通用消息处理器
    const generalHandlers = this.messageHandlers.get(message.type);
    if (generalHandlers) {
      generalHandlers.forEach((handler) => handler(message));
    }

    // 拍卖特定消息处理器
    if (message.auctionId) {
      const auctionHandlers = this.messageHandlers.get(`auction_${message.auctionId}`);
      if (auctionHandlers) {
        auctionHandlers.forEach((handler) => handler(message));
      }
    }
  }

  // 设置事件处理器
  private setupEventHandlers(): void {
    // 页面关闭时断开连接
    window.addEventListener('beforeunload', () => {
      this.disconnect();
    });

    // 网络状态变化处理
    window.addEventListener('online', () => {
      if (this.connectionState === 'disconnected') {
        this.connect(this.userId ?? undefined);
      }
    });

    window.addEventListener('offline', () => {
      this.disconnect();
    });
  }

  // 启动心跳
  private startHeartbeat(): void {
    this.heartbeatInterval = setInterval(() => {
      if (!this.sendHeartbeat()) {
        console.warn('心跳发送失败');
      }
    }, 30000); // 每30秒发送一次心跳
  }

  // 停止心跳
  private stopHeartbeat(): void {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
      this.heartbeatInterval = null;
    }
  }

  // 计划重连
  private scheduleReconnect(): void {
    this.reconnectAttempts++;
    const delay = this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1); // 指数退避

    console.log(`${delay}ms后尝试第${this.reconnectAttempts}次重连...`);

    setTimeout(() => {
      if (this.connectionState === 'disconnected') {
        this.connect(this.userId ?? undefined).catch((error) => {
          console.error('重连失败:', error);
        });
      }
    }, delay);
  }
}

// 创建全局WebSocket实例
export const auctionWebSocket = new AuctionWebSocketClient();

// 导出便捷方法
export const connectToAuctionWS = (userId?: string) => auctionWebSocket.connect(userId);
export const disconnectFromAuctionWS = () => auctionWebSocket.disconnect();
export const subscribeToAuctionUpdates = (
  auctionId: string,
  handler: (message: WebSocketMessage) => void
) => auctionWebSocket.subscribeToAuction(auctionId, handler);
export const sendBidViaWS = (auctionId: string, amount: number) =>
  auctionWebSocket.sendBid(auctionId, amount);
