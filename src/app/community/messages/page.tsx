'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowLeft, Search, MoreVertical } from 'lucide-react';
import { barongAPI } from '@/api/client';
import { message as antdMessage } from 'antd';
import ConversationItem from '@/components/community/ConversationItem';
import MessageBubble from '@/components/community/MessageBubble';
import MessageInput from '@/components/community/MessageInput';

export default function MessagesPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const selectedUserId = searchParams?.get('userId') || null;

  const [conversations, setConversations] = useState<any[]>([]);
  const [filteredConversations, setFilteredConversations] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string>('');
  const [totalUnread, setTotalUnread] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // 获取当前用户ID
    const userInfoStr = localStorage.getItem('user_info');
    if (userInfoStr) {
      const userInfo = JSON.parse(userInfoStr);
      setCurrentUserId(userInfo.id || userInfo.uid || userInfo.email);
    }
  }, []);

  useEffect(() => {
    if (currentUserId) {
      loadConversations();
    }
  }, [currentUserId]);

  useEffect(() => {
    if (currentUserId && selectedUserId) {
      loadMessages(selectedUserId);
      markAsRead(selectedUserId);
    }
  }, [currentUserId, selectedUserId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const loadConversations = async () => {
    try {
      setLoading(true);
      const response = await barongAPI.get('/public/community/messages/conversations', {
        params: { currentUserId, page: 1, limit: 50 },
      });

      if (response.data.success) {
        setConversations(response.data.data.conversations);
        setFilteredConversations(response.data.data.conversations);
        setTotalUnread(response.data.data.totalUnread);
      }
    } catch (error) {
      console.error('Error loading conversations:', error);
      antdMessage.error('加载会话列表失败');
    } finally {
      setLoading(false);
    }
  };

  const loadMessages = async (otherUserId: string) => {
    try {
      const response = await barongAPI.get(
        `/public/community/messages/conversation/${otherUserId}`,
        {
          params: { currentUserId, page: 1, limit: 50 },
        }
      );

      if (response.data.success) {
        setMessages(response.data.data.messages);
      }
    } catch (error) {
      console.error('Error loading messages:', error);
      antdMessage.error('加载消息失败');
    }
  };

  const markAsRead = async (otherUserId: string) => {
    try {
      await barongAPI.post('/public/community/messages/mark-read', {
        currentUserId,
        conversationUserId: otherUserId,
      });
      
      // 更新会话列表中的未读数
      setConversations(prev =>
        prev.map(conv =>
          conv.otherUserId === otherUserId
            ? { ...conv, unreadCount: 0 }
            : conv
        )
      );
      
      // 更新总未读数
      loadConversations();
    } catch (error) {
      console.error('Error marking as read:', error);
    }
  };

  const handleSendMessage = async (content: string) => {
    if (!selectedUserId) return;

    try {
      setSending(true);
      const response = await barongAPI.post('/public/community/messages/send', {
        currentUserId,
        receiverId: selectedUserId,
        content,
        messageType: 'text',
      });

      if (response.data.success) {
        const newMessage = response.data.data.message;
        setMessages(prev => [...prev, { ...newMessage, isSender: true }]);
        
        // 更新会话列表
        loadConversations();
        antdMessage.success('发送成功');
      }
    } catch (error: any) {
      console.error('Error sending message:', error);
      antdMessage.error(error.response?.data?.message || '发送失败');
    } finally {
      setSending(false);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (!query.trim()) {
      setFilteredConversations(conversations);
      return;
    }
    
    const filtered = conversations.filter(conv =>
      conv.otherUserName?.toLowerCase().includes(query.toLowerCase()) ||
      conv.lastMessage?.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredConversations(filtered);
  };

  const handleConversationClick = (userId: string) => {
    router.push(`/community/messages?userId=${userId}`);
  };

  if (!currentUserId) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-400 mb-4">请先登录</p>
          <button
            onClick={() => router.push('/auth/login')}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
          >
            去登录
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto h-screen flex">
        {/* 会话列表 */}
        <div className="w-80 border-r border-gray-700 flex flex-col">
          {/* 头部 */}
          <div className="p-4 border-b border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-xl font-bold">私信</h1>
              {totalUnread > 0 && (
                <span className="px-2 py-1 bg-blue-600 text-white text-xs rounded-full">
                  {totalUnread}
                </span>
              )}
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="搜索会话..."
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          {/* 会话列表 */}
          <div className="flex-1 overflow-y-auto">
            {loading ? (
              <div className="p-4 text-center text-gray-400">加载中...</div>
            ) : filteredConversations.length === 0 ? (
              <div className="p-4 text-center text-gray-400">
                {searchQuery ? '未找到匹配的会话' : '暂无会话'}
              </div>
            ) : (
              filteredConversations.map((conv) => (
                <ConversationItem
                  key={conv.id}
                  conversation={conv}
                  isActive={conv.otherUserId === selectedUserId}
                  onClick={() => handleConversationClick(conv.otherUserId)}
                />
              ))
            )}
          </div>
        </div>

        {/* 消息区域 */}
        <div className="flex-1 flex flex-col">
          {selectedUserId ? (
            <>
              {/* 消息头部 */}
              <div className="p-4 border-b border-gray-700 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold">
                    {selectedUserId.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h2 className="font-semibold">{selectedUserId}</h2>
                    <p className="text-xs text-gray-400">在线</p>
                  </div>
                </div>
                <button className="p-2 hover:bg-gray-800 rounded-lg transition-colors">
                  <MoreVertical className="w-5 h-5" />
                </button>
              </div>

              {/* 消息列表 */}
              <div className="flex-1 overflow-y-auto p-4">
                {messages.length === 0 ? (
                  <div className="text-center text-gray-400 mt-8">
                    暂无消息，开始聊天吧
                  </div>
                ) : (
                  messages.map((msg) => (
                    <MessageBubble key={msg.id} message={msg} />
                  ))
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* 输入框 */}
              <MessageInput
                onSend={handleSendMessage}
                disabled={sending}
              />
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-400">
              <div className="text-center">
                <p className="text-lg mb-2">选择一个会话开始聊天</p>
                <p className="text-sm">或者搜索用户发起新会话</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
