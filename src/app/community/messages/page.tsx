'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { MessageSquare, Send, Search, MoreVertical, Plus, X, UserPlus } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import '../../../i18n';
import ParticlesBackground from '../../components/ParticlesBackground';
import CommunityNavbar from '../../../components/community/CommunityNavbar';
import EnhancedFooter from '../../components/EnhancedFooter';
import { messagesService, Message, Conversation } from '../../../services/communityService';

interface UserInfo {
  id: string;
  email: string;
  name: string;
  avatar?: string;
}

interface UserSearchResult {
  uid: string;
  email: string;
  name?: string;
}

export default function MessagesPage() {
  const router = useRouter();
  const { t, i18n } = useTranslation();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showNewConversation, setShowNewConversation] = useState(false);
  const [userSearchQuery, setUserSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<UserSearchResult[]>([]);
  const [searchingUsers, setSearchingUsers] = useState(false);
  const [directMessageContent, setDirectMessageContent] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    const userInfoStr = localStorage.getItem('user_info');

    if (!token || !userInfoStr) {
      router.push('/auth/login?redirect=/community/messages');
      return;
    }

    try {
      const user = JSON.parse(userInfoStr);
      setUserInfo(user);
      loadConversations(user.id);
    } catch {
      router.push('/auth/login?redirect=/community/messages');
    }
  }, [router]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const loadConversations = async (userId: string) => {
    setLoading(true);
    try {
      const data = await messagesService.getConversations(userId);
      setConversations(data);
    } catch (err) {
      console.error('Failed to load conversations:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadMessages = async (conversationId: string) => {
    if (!userInfo) return;
    try {
      const data = await messagesService.getMessages(userInfo.id, conversationId);
      setMessages(data);
    } catch (err) {
      console.error('Failed to load messages:', err);
    }
  };

  const selectConversation = (conversation: Conversation) => {
    setSelectedConversation(conversation);
    loadMessages(conversation.id);
  };

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedConversation || !userInfo) return;

    setSending(true);
    const otherUserId = selectedConversation.participants.find(p => p !== userInfo.id);

    try {
      const result = await messagesService.sendMessage({
        senderId: userInfo.id,
        senderName: userInfo.name,
        receiverId: otherUserId || '',
        content: newMessage
      });

      if (result.success && result.message) {
        setMessages(prev => [...prev, result.message!]);
        setNewMessage('');
      } else {
        const newMsg: Message = {
          id: `msg_${Date.now()}`,
          conversationId: selectedConversation.id,
          senderId: userInfo.id,
          senderName: userInfo.name,
          receiverId: otherUserId || '',
          content: newMessage,
          isRead: false,
          createdAt: new Date().toISOString()
        };
        setMessages(prev => [...prev, newMsg]);
        setNewMessage('');
      }
    } catch (err) {
      console.error('Failed to send message:', err);
    } finally {
      setSending(false);
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return t('messages_page.time.just_now');
    if (minutes < 60) return t('messages_page.time.minutes_ago', { count: minutes });
    if (hours < 24) return t('messages_page.time.hours_ago', { count: hours });
    if (days < 7) return t('messages_page.time.days_ago', { count: days });
    return date.toLocaleDateString(i18n.language === 'zh' ? 'zh-CN' : 'en-US');
  };

  const getOtherParticipant = (conversation: Conversation) => {
    const otherUserId = conversation.participants.find(p => p !== userInfo?.id);
    return conversation.participantInfo[otherUserId || ''];
  };

  const filteredConversations = conversations.filter(c => {
    const other = getOtherParticipant(c);
    return other?.name.toLowerCase().includes(searchQuery.toLowerCase());
  });

  // 搜索用户
  const searchUsers = async (query: string) => {
    if (!query.trim() || query.length < 2) {
      setSearchResults([]);
      return;
    }
    setSearchingUsers(true);
    try {
      const response = await fetch(`/api/community/users/search?q=${encodeURIComponent(query)}`);
      const data = await response.json();
      if (data.success && data.data?.users) {
        // 过滤掉当前用户
        const filtered = data.data.users.filter((u: UserSearchResult) => u.uid !== userInfo?.id);
        setSearchResults(filtered);
      } else {
        setSearchResults([]);
      }
    } catch (err) {
      console.error('Failed to search users:', err);
      setSearchResults([]);
    } finally {
      setSearchingUsers(false);
    }
  };

  // 发起新会话
  const startNewConversation = async (targetUser: UserSearchResult) => {
    if (!userInfo || !directMessageContent.trim()) return;
    
    setSending(true);
    try {
      const result = await messagesService.sendMessage({
        senderId: userInfo.id,
        senderName: userInfo.name || userInfo.email,
        receiverId: targetUser.uid,
        content: directMessageContent
      });

      if (result.success) {
        // 重新加载会话列表
        await loadConversations(userInfo.id);
        setShowNewConversation(false);
        setUserSearchQuery('');
        setSearchResults([]);
        setDirectMessageContent('');
      }
    } catch (err) {
      console.error('Failed to start conversation:', err);
    } finally {
      setSending(false);
    }
  };

  // 用户搜索防抖
  useEffect(() => {
    const timer = setTimeout(() => {
      if (userSearchQuery) {
        searchUsers(userSearchQuery);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [userSearchQuery]);

  return (
    <div className="min-h-screen relative">
      <ParticlesBackground />
      <CommunityNavbar />
      <div className="relative z-10">
      
      <div className="h-[calc(100vh-120px)] flex flex-col">
        <div className="flex-1 flex overflow-hidden max-w-6xl mx-auto w-full">
          {/* Conversations List */}
          <div className="w-80 border-r border-white/10 flex flex-col bg-black/10">
            <div className="p-4">
              <div className="flex items-center gap-2 mb-3">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder={t('messages_page.search_placeholder')}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
                  />
                </div>
                <button
                  onClick={() => setShowNewConversation(true)}
                  className="p-2 bg-gradient-to-r from-purple-500 to-cyan-500 text-white rounded-lg hover:from-purple-600 hover:to-cyan-600 transition-all"
                  title={t('messages_page.new_conversation') || '新建会话'}
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto">
              {loading ? (
                <div className="text-center py-8">
                  <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
                </div>
              ) : filteredConversations.length === 0 ? (
                <div className="text-center py-8 text-gray-400">{t('messages_page.no_conversations')}</div>
              ) : (
                filteredConversations.map(conversation => {
                  const other = getOtherParticipant(conversation);
                  return (
                    <div
                      key={conversation.id}
                      onClick={() => selectConversation(conversation)}
                      className={`p-4 border-b border-white/10 cursor-pointer hover:bg-white/5 transition-colors ${
                        selectedConversation?.id === conversation.id ? 'bg-white/10' : ''
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-500 to-cyan-500 flex items-center justify-center text-white font-bold">
                          {other?.avatar || other?.name?.[0] || 'U'}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <span className="text-white font-medium truncate">{other?.name}</span>
                            {conversation.lastMessage && (
                              <span className="text-xs text-gray-400">{formatTime(conversation.lastMessage.createdAt)}</span>
                            )}
                          </div>
                          {conversation.lastMessage && (
                            <p className="text-sm text-gray-400 truncate">
                              {conversation.lastMessage.senderId === userInfo?.id ? t('messages_page.time.you') : ''}
                              {conversation.lastMessage.content}
                            </p>
                          )}
                        </div>
                        {conversation.unreadCount > 0 && (
                          <div className="w-5 h-5 bg-purple-500 rounded-full flex items-center justify-center text-white text-xs">
                            {conversation.unreadCount}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Chat Area */}
          <div className="flex-1 flex flex-col bg-black/5">
            {selectedConversation ? (
              <>
                <div className="p-4 border-b border-white/10 bg-black/10">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-cyan-500 flex items-center justify-center text-white font-bold">
                        {getOtherParticipant(selectedConversation)?.avatar || getOtherParticipant(selectedConversation)?.name?.[0] || 'U'}
                      </div>
                      <span className="text-white font-medium">{getOtherParticipant(selectedConversation)?.name}</span>
                    </div>
                    <button className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors">
                      <MoreVertical className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {messages.map(message => (
                    <div key={message.id} className={`flex ${message.senderId === userInfo?.id ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[70%] p-3 rounded-2xl ${
                        message.senderId === userInfo?.id
                          ? 'bg-gradient-to-r from-purple-500 to-cyan-500 text-white'
                          : 'bg-white/10 text-white'
                      }`}>
                        <p>{message.content}</p>
                        <p className={`text-xs mt-1 ${message.senderId === userInfo?.id ? 'text-white/70' : 'text-gray-400'}`}>
                          {formatTime(message.createdAt)}
                        </p>
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>

                <form onSubmit={sendMessage} className="p-4 border-t border-white/10 bg-black/10">
                  <div className="flex gap-3">
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder={t('messages_page.message_placeholder')}
                      className="flex-1 px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
                    />
                    <button
                      type="submit"
                      disabled={sending || !newMessage.trim()}
                      className="px-6 py-3 bg-gradient-to-r from-purple-500 to-cyan-500 text-white rounded-lg hover:from-purple-600 hover:to-cyan-600 transition-all disabled:opacity-50"
                    >
                      <Send className="w-5 h-5" />
                    </button>
                  </div>
                </form>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <MessageSquare className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-400">{t('messages_page.select_conversation')}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      </div>
      
      {/* 新建会话模态框 */}
      {showNewConversation && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-gray-900 border border-white/20 rounded-2xl p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <UserPlus className="w-5 h-5" />
                {t('messages_page.new_conversation') || '新建会话'}
              </h3>
              <button
                onClick={() => {
                  setShowNewConversation(false);
                  setUserSearchQuery('');
                  setSearchResults([]);
                  setDirectMessageContent('');
                }}
                className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-2">
                  {t('messages_page.search_user') || '搜索用户（输入邮箱）'}
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder={t('messages_page.enter_email') || '输入用户邮箱...'}
                    value={userSearchQuery}
                    onChange={(e) => setUserSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>
              
              {/* 搜索结果 */}
              {searchingUsers && (
                <div className="text-center py-4">
                  <div className="w-6 h-6 border-2 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
                </div>
              )}
              
              {!searchingUsers && searchResults.length > 0 && (
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {searchResults.map(user => (
                    <div
                      key={user.uid}
                      className="p-3 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-cyan-500 flex items-center justify-center text-white font-bold">
                          {user.email?.[0]?.toUpperCase() || 'U'}
                        </div>
                        <div className="flex-1">
                          <p className="text-white font-medium">{user.name || user.email}</p>
                          <p className="text-sm text-gray-400">{user.email}</p>
                        </div>
                      </div>
                      
                      {/* 消息输入 */}
                      <div className="mt-3">
                        <textarea
                          placeholder={t('messages_page.type_message') || '输入消息...'}
                          value={directMessageContent}
                          onChange={(e) => setDirectMessageContent(e.target.value)}
                          className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 resize-none"
                          rows={2}
                        />
                        <button
                          onClick={() => startNewConversation(user)}
                          disabled={sending || !directMessageContent.trim()}
                          className="mt-2 w-full py-2 bg-gradient-to-r from-purple-500 to-cyan-500 text-white rounded-lg hover:from-purple-600 hover:to-cyan-600 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                          <Send className="w-4 h-4" />
                          {sending ? (t('messages_page.sending') || '发送中...') : (t('messages_page.send') || '发送')}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              
              {!searchingUsers && userSearchQuery.length >= 2 && searchResults.length === 0 && (
                <p className="text-center text-gray-400 py-4">
                  {t('messages_page.no_users_found') || '未找到用户'}
                </p>
              )}
              
              {userSearchQuery.length < 2 && (
                <p className="text-center text-gray-400 py-4 text-sm">
                  {t('messages_page.search_hint') || '请输入至少2个字符搜索用户'}
                </p>
              )}
            </div>
          </div>
        </div>
      )}
      
      <EnhancedFooter />
    </div>
  );
}

