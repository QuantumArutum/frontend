'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MessageSquare,
  X,
  Send,
  User,
  Circle,
  MoreVertical,
  Smile,
  Paperclip,
  Search,
  Bell,
  Settings,
} from 'lucide-react';

interface ChatMessage {
  id: string;
  userId: string;
  username: string;
  avatar: string;
  content: string;
  timestamp: Date;
  isOwn: boolean;
  isOnline: boolean;
  reactions: { emoji: string; count: number; users: string[] }[];
}

interface ChatRoom {
  id: string;
  name: string;
  type: 'public' | 'private' | 'group';
  lastMessage: string;
  lastActivity: Date;
  unreadCount: number;
  participants: number;
  avatar?: string;
}

const mockMessages: ChatMessage[] = [
  {
    id: '1',
    userId: 'user1',
    username: 'CryptoExpert',
    avatar: '🧙‍♂️',
    content: '大家好！今天量子钱包的更新太棒了！',
    timestamp: new Date(Date.now() - 5 * 60 * 1000),
    isOwn: false,
    isOnline: true,
    reactions: [{ emoji: '👍', count: 3, users: ['user2', 'user3', 'user4'] }],
  },
  {
    id: '2',
    userId: 'user2',
    username: 'QuantumDev',
    avatar: '👨‍💻',
    content: '确实，多链支持功能终于上线了！',
    timestamp: new Date(Date.now() - 3 * 60 * 1000),
    isOwn: false,
    isOnline: true,
    reactions: [],
  },
  {
    id: '3',
    userId: 'current',
    username: 'You',
    avatar: '😊',
    content: '我已经开始测试了，体验很不错！',
    timestamp: new Date(Date.now() - 1 * 60 * 1000),
    isOwn: true,
    isOnline: true,
    reactions: [{ emoji: '❤️', count: 2, users: ['user1', 'user2'] }],
  },
];

const mockRooms: ChatRoom[] = [
  {
    id: '1',
    name: '量子技术讨论',
    type: 'public',
    lastMessage: '新功能真的很实用！',
    lastActivity: new Date(Date.now() - 2 * 60 * 1000),
    unreadCount: 3,
    participants: 1250,
    avatar: '💬',
  },
  {
    id: '2',
    name: 'DeFi策略分享',
    type: 'public',
    lastMessage: '年化收益达到15%！',
    lastActivity: new Date(Date.now() - 15 * 60 * 1000),
    unreadCount: 0,
    participants: 890,
    avatar: '📊',
  },
  {
    id: '3',
    name: '官方公告',
    type: 'public',
    lastMessage: '系统维护通知',
    lastActivity: new Date(Date.now() - 1 * 60 * 60 * 1000),
    unreadCount: 1,
    participants: 5000,
    avatar: '📢',
  },
];

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeRoom, setActiveRoom] = useState<string>('1');
  const [messages, setMessages] = useState<ChatMessage[]>(mockMessages);
  const [newMessage, setNewMessage] = useState('');
  const [rooms] = useState<ChatRoom[]>(mockRooms);
  const [searchQuery, setSearchQuery] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = () => {
    if (newMessage.trim()) {
      const message: ChatMessage = {
        id: Date.now().toString(),
        userId: 'current',
        username: 'You',
        avatar: '😊',
        content: newMessage,
        timestamp: new Date(),
        isOwn: true,
        isOnline: true,
        reactions: [],
      };
      setMessages([...messages, message]);
      setNewMessage('');
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('zh-CN', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <>
      {/* 聊天按钮 */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full shadow-lg flex items-center justify-center text-white z-50"
      >
        <MessageSquare className="h-6 w-6" />
        {rooms.reduce((acc, room) => acc + room.unreadCount, 0) > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            {rooms.reduce((acc, room) => acc + room.unreadCount, 0)}
          </span>
        )}
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 100 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 100 }}
            className="fixed bottom-20 right-6 w-96 h-[600px] bg-gray-900/95 backdrop-blur-sm rounded-2xl shadow-2xl border border-white/20 z-50 flex flex-col"
          >
            {/* 头部 */}
            <div className="flex items-center justify-between p-4 border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full flex items-center justify-center text-white font-bold">
                  {rooms.find((r) => r.id === activeRoom)?.avatar || '💬'}
                </div>
                <div>
                  <h3 className="text-white font-semibold">
                    {rooms.find((r) => r.id === activeRoom)?.name || '聊天室'}
                  </h3>
                  <p className="text-xs text-gray-400">
                    {rooms.find((r) => r.id === activeRoom)?.participants || 0} 人在线
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button className="text-gray-400 hover:text-white transition-colors">
                  <Search className="h-4 w-4" />
                </button>
                <button className="text-gray-400 hover:text-white transition-colors">
                  <Bell className="h-4 w-4" />
                </button>
                <button className="text-gray-400 hover:text-white transition-colors">
                  <Settings className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* 聊天室列表 */}
            <div className="flex-1 flex">
              {/* 左侧房间列表 */}
              <div className="w-1/3 border-r border-white/10 overflow-y-auto">
                <div className="p-2">
                  <input
                    type="text"
                    placeholder="搜索聊天室..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full px-3 py-2 bg-white/10 rounded-lg text-white text-sm placeholder-gray-400 focus:outline-none focus:bg-white/20"
                  />
                </div>
                {rooms
                  .filter((room) => room.name.toLowerCase().includes(searchQuery.toLowerCase()))
                  .map((room) => (
                    <motion.div
                      key={room.id}
                      whileHover={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
                      onClick={() => setActiveRoom(room.id)}
                      className={`p-3 cursor-pointer border-b border-white/5 ${
                        activeRoom === room.id ? 'bg-white/10' : ''
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                          {room.avatar}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <h4 className="text-white text-sm font-medium truncate">{room.name}</h4>
                            {room.unreadCount > 0 && (
                              <span className="bg-red-500 text-white text-xs rounded-full px-2 py-1">
                                {room.unreadCount}
                              </span>
                            )}
                          </div>
                          <p className="text-gray-400 text-xs truncate">{room.lastMessage}</p>
                          <p className="text-gray-500 text-xs">
                            {room.participants} 人 · {formatTime(room.lastActivity)}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
              </div>

              {/* 右侧消息区域 */}
              <div className="flex-1 flex flex-col">
                {/* 消息列表 */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {messages.map((message) => (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex gap-3 ${message.isOwn ? 'justify-end' : ''}`}
                    >
                      {!message.isOwn && (
                        <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full flex items-center justify-center text-white text-sm flex-shrink-0">
                          {message.avatar}
                        </div>
                      )}
                      <div className={`max-w-[70%] ${message.isOwn ? 'order-first' : ''}`}>
                        {!message.isOwn && (
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-white text-sm font-medium">
                              {message.username}
                            </span>
                            {message.isOnline && (
                              <Circle className="h-2 w-2 text-green-400 fill-current" />
                            )}
                          </div>
                        )}
                        <div
                          className={`px-4 py-2 rounded-2xl ${
                            message.isOwn
                              ? 'bg-gradient-to-r from-purple-500 to-cyan-500 text-white'
                              : 'bg-white/10 text-white'
                          }`}
                        >
                          <p className="text-sm">{message.content}</p>
                          {message.reactions.length > 0 && (
                            <div className="flex gap-1 mt-2">
                              {message.reactions.map((reaction, idx) => (
                                <span
                                  key={idx}
                                  className="text-xs bg-white/20 px-2 py-1 rounded-full"
                                >
                                  {reaction.emoji} {reaction.count}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                        <p className="text-xs text-gray-400 mt-1">
                          {formatTime(message.timestamp)}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>

                {/* 输入区域 */}
                <div className="p-4 border-t border-white/10">
                  <div className="flex items-center gap-2">
                    <button className="text-gray-400 hover:text-white transition-colors">
                      <Paperclip className="h-5 w-5" />
                    </button>
                    <button className="text-gray-400 hover:text-white transition-colors">
                      <Smile className="h-5 w-5" />
                    </button>
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                      placeholder="输入消息..."
                      className="flex-1 px-4 py-2 bg-white/10 rounded-full text-white placeholder-gray-400 focus:outline-none focus:bg-white/20"
                    />
                    <button
                      onClick={sendMessage}
                      disabled={!newMessage.trim()}
                      className="p-2 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full text-white hover:from-purple-600 hover:to-cyan-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Send className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
