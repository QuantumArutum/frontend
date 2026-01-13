'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface Translations {
  [key: string]: {
    [key: string]: string;
  };
}

const translations: Translations = {
  zh: {
    // 导航和布局
    'nav.home': '首页',
    'nav.community': '社区',
    'nav.forum': '论坛',
    'nav.governance': '治理',
    'nav.ai-evolution': 'AI进化',
    'nav.wallet': '钱包',
    'nav.profile': '个人资料',
    'nav.settings': '设置',
    
    // 社区首页
    'community.title': '量子社区',
    'community.subtitle': '连接全球量子技术爱好者，共建去中心化未来',
    'community.welcome': '欢迎来到量子社区',
    'community.description': '加入全球量子技术爱好者的大家庭，共同探索区块链的未来',
    'community.stats.title': '社区数据',
    'community.stats.activeUsers': '活跃用户',
    'community.stats.totalPosts': '帖子总数',
    'community.stats.totalTopics': '讨论话题',
    'community.stats.dailyActive': '日活跃用户',
    'community.search.placeholder': '搜索帖子、用户或话题...',
    'community.createPost': '发布新帖',
    'community.forumCategories': '论坛分类',
    'community.hotTopics': '热门话题',
    'community.upcomingEvents': '即将举行的活动',
    'community.activeMembers': '活跃成员',
    'community.quickLinks': '快速链接',
    'community.joinNow': '立即加入',
    'community.explore': '探索更多',
    
    // 论坛分类
    'forum.general': '综合讨论',
    'forum.general.desc': '关于Quantaureum的一般性讨论和交流',
    'forum.technical': '技术交流',
    'forum.technical.desc': '技术问题讨论和解决方案分享',
    'forum.defi': 'DeFi讨论',
    'forum.defi.desc': 'DeFi协议、流动性挖矿和收益策略',
    'forum.trading': '交易讨论',
    'forum.trading.desc': '市场分析、交易策略和价格预测',
    'forum.governance': '社区治理',
    'forum.governance.desc': 'DAO治理、提案讨论和投票',
    'forum.events': '活动专区',
    'forum.events.desc': '线上线下活动信息发布和讨论',
    'forum.nft': 'NFT专区',
    'forum.nft.desc': 'NFT创作、交易和收藏讨论',
    'forum.education': '教育中心',
    'forum.education.desc': '量子技术和区块链学习资源',
    
    // 治理系统
    'governance.title': '社区治理',
    'governance.subtitle': '参与DAO治理，共建量子生态',
    'governance.totalStaked': '总质押量',
    'governance.activeVoters': '活跃投票者',
    'governance.passedProposals': '已通过提案',
    'governance.participationRate': '参与率',
    'governance.createProposal': '创建提案',
    'governance.viewProposals': '查看提案',
    'governance.voting': '投票中',
    'governance.upcoming': '即将开始',
    'governance.discussion': '讨论中',
    'governance.passed': '已通过',
    'governance.rejected': '已拒绝',
    'governance.expired': '已过期',
    'governance.proposal.title': '提案标题',
    'governance.proposal.description': '提案描述',
    'governance.proposal.category': '提案分类',
    'governance.proposal.duration': '投票时长',
    'governance.proposal.threshold': '通过阈值',
    'governance.vote.for': '支持',
    'governance.vote.against': '反对',
    'governance.vote.abstain': '弃权',
    'governance.vote.power': '投票权重',
    'governance.delegate': '委托投票',
    'governance.undelegate': '取消委托',
    
    // AI进化中心
    'ai.title': 'AI进化中心',
    'ai.subtitle': '见证量子AI代理的持续进化',
    'ai.activeAgents': '活跃AI代理',
    'ai.averageAccuracy': '平均准确率',
    'ai.unlockedAchievements': '解锁成就',
    'ai.totalExperience': '总经验值',
    'ai.level': '等级',
    'ai.experience': '经验值',
    'ai.accuracy': '准确率',
    'ai.efficiency': '效率',
    'ai.reliability': '可靠性',
    'ai.skills': '技能',
    'ai.achievements': '成就',
    'ai.lastActive': '最后活跃',
    'ai.online': '在线',
    'ai.offline': '离线',
    'ai.evolutionEvents': '进化事件',
    'ai.leaderboard': '排行榜',
    'ai.rank': '排名',
    'ai.agent': '代理',
    'ai.score': '分数',
    'ai.trend': '趋势',
    
    // Web3集成
    'web3.connectWallet': '连接钱包',
    'web3.disconnectWallet': '断开钱包',
    'web3.walletConnected': '钱包已连接',
    'web3.walletDisconnected': '钱包已断开',
    'web3.address': '地址',
    'web3.balance': '余额',
    'web3.network': '网络',
    'web3.switchNetwork': '切换网络',
    'web3.nftBadges': 'NFT徽章',
    'web3.achievements': '成就',
    'web3.staking': '质押',
    'web3.votingPower': '投票权重',
    'web3.reputation': '声望',
    'web3.level': '等级',
    'web3.experience': '经验',
    'web3.rarity.common': '普通',
    'web3.rarity.rare': '稀有',
    'web3.rarity.epic': '史诗',
    'web3.rarity.legendary': '传说',
    
    // 实时更新
    'realtime.notifications': '通知',
    'realtime.liveUpdates': '实时动态',
    'realtime.markAllRead': '全部已读',
    'realtime.noNotifications': '暂无通知',
    'realtime.noUpdates': '暂无更新',
    'realtime.connectionStatus': '连接状态',
    'realtime.connected': '已连接',
    'realtime.disconnected': '已断开',
    'realtime.reconnecting': '重新连接中',
    
    // 帖子相关
    'post.title': '标题',
    'post.content': '内容',
    'post.author': '作者',
    'post.createdAt': '发布时间',
    'post.updatedAt': '更新时间',
    'post.replies': '回复',
    'post.views': '浏览',
    'post.likes': '点赞',
    'post.share': '分享',
    'post.bookmark': '收藏',
    'post.report': '举报',
    'post.edit': '编辑',
    'post.delete': '删除',
    'post.reply': '回复',
    'post.writeReply': '写下你的回复...',
    'post.submitReply': '提交回复',
    
    // 用户相关
    'user.profile': '个人资料',
    'user.username': '用户名',
    'user.avatar': '头像',
    'user.bio': '个人简介',
    'user.joinDate': '加入时间',
    'user.postCount': '发帖数',
    'user.reputation': '声望',
    'user.followers': '粉丝',
    'user.following': '关注',
    'user.editProfile': '编辑资料',
    'user.follow': '关注',
    'user.unfollow': '取消关注',
    'user.message': '私信',
    
    // 搜索和筛选
    'search.title': '搜索',
    'search.placeholder': '搜索内容...',
    'search.results': '搜索结果',
    'search.noResults': '没有找到结果',
    'search.filters': '筛选',
    'search.sortBy': '排序方式',
    'search.sort.latest': '最新',
    'search.sort.oldest': '最旧',
    'search.sort.mostLiked': '最多点赞',
    'search.sort.mostReplied': '最多回复',
    
    // 通用操作
    'common.search': '搜索',
    'common.filter': '筛选',
    'common.create': '创建',
    'common.edit': '编辑',
    'common.delete': '删除',
    'common.save': '保存',
    'common.cancel': '取消',
    'common.confirm': '确认',
    'common.submit': '提交',
    'common.loading': '加载中...',
    'common.error': '出错了',
    'common.success': '成功',
    'common.retry': '重试',
    'common.close': '关闭',
    'common.next': '下一步',
    'common.previous': '上一步',
    'common.finish': '完成',
    
    // 时间和日期
    'time.justNow': '刚刚',
    'time.minutesAgo': '{count}分钟前',
    'time.hoursAgo': '{count}小时前',
    'time.daysAgo': '{count}天前',
    'time.weeksAgo': '{count}周前',
    'time.monthsAgo': '{count}个月前',
    'time.yearsAgo': '{count}年前',
    
    // 错误和提示
    'error.network': '网络连接错误',
    'error.server': '服务器错误',
    'error.permission': '权限不足',
    'error.notFound': '内容未找到',
    'error.validation': '输入验证错误',
    'error.unknown': '未知错误',
    'success.saved': '保存成功',
    'success.updated': '更新成功',
    'success.deleted': '删除成功',
    'success.submitted': '提交成功',
    'success.voted': '投票成功',
    'success.connected': '连接成功',
    'success.disconnected': '断开成功',
  },
  en: {
    // Navigation and Layout
    'nav.home': 'Home',
    'nav.community': 'Community',
    'nav.forum': 'Forum',
    'nav.governance': 'Governance',
    'nav.ai-evolution': 'AI Evolution',
    'nav.wallet': 'Wallet',
    'nav.profile': 'Profile',
    'nav.settings': 'Settings',
    
    // Community Home
    'community.title': 'Quantum Community',
    'community.subtitle': 'Connect global quantum enthusiasts, build decentralized future',
    'community.welcome': 'Welcome to Quantum Community',
    'community.description': 'Join the global family of quantum technology enthusiasts and explore the future of blockchain together',
    'community.stats.title': 'Community Stats',
    'community.stats.activeUsers': 'Active Users',
    'community.stats.totalPosts': 'Total Posts',
    'community.stats.totalTopics': 'Total Topics',
    'community.stats.dailyActive': 'Daily Active',
    'community.search.placeholder': 'Search posts, users or topics...',
    'community.createPost': 'Create Post',
    'community.forumCategories': 'Forum Categories',
    'community.hotTopics': 'Hot Topics',
    'community.upcomingEvents': 'Upcoming Events',
    'community.activeMembers': 'Active Members',
    'community.quickLinks': 'Quick Links',
    'community.joinNow': 'Join Now',
    'community.explore': 'Explore More',
    
    // Forum Categories
    'forum.general': 'General Discussion',
    'forum.general.desc': 'General discussions about Quantaureum',
    'forum.technical': 'Technical Exchange',
    'forum.technical.desc': 'Technical discussions and solutions',
    'forum.defi': 'DeFi Discussion',
    'forum.defi.desc': 'DeFi protocols, liquidity mining and yield strategies',
    'forum.trading': 'Trading Discussion',
    'forum.trading.desc': 'Market analysis, trading strategies and price predictions',
    'forum.governance': 'Community Governance',
    'forum.governance.desc': 'DAO governance, proposal discussions and voting',
    'forum.events': 'Events Zone',
    'forum.events.desc': 'Online and offline event information and discussions',
    'forum.nft': 'NFT Zone',
    'forum.nft.desc': 'NFT creation, trading and collection discussions',
    'forum.education': 'Education Center',
    'forum.education.desc': 'Quantum technology and blockchain learning resources',
    
    // Governance System
    'governance.title': 'Community Governance',
    'governance.subtitle': 'Participate in DAO governance, build quantum ecosystem',
    'governance.totalStaked': 'Total Staked',
    'governance.activeVoters': 'Active Voters',
    'governance.passedProposals': 'Passed Proposals',
    'governance.participationRate': 'Participation Rate',
    'governance.createProposal': 'Create Proposal',
    'governance.viewProposals': 'View Proposals',
    'governance.voting': 'Voting',
    'governance.upcoming': 'Upcoming',
    'governance.discussion': 'Discussion',
    'governance.passed': 'Passed',
    'governance.rejected': 'Rejected',
    'governance.expired': 'Expired',
    'governance.proposal.title': 'Proposal Title',
    'governance.proposal.description': 'Proposal Description',
    'governance.proposal.category': 'Proposal Category',
    'governance.proposal.duration': 'Voting Duration',
    'governance.proposal.threshold': 'Passing Threshold',
    'governance.vote.for': 'For',
    'governance.vote.against': 'Against',
    'governance.vote.abstain': 'Abstain',
    'governance.vote.power': 'Voting Power',
    'governance.delegate': 'Delegate Vote',
    'governance.undelegate': 'Undelegate',
    
    // AI Evolution Center
    'ai.title': 'AI Evolution Center',
    'ai.subtitle': 'Witness the continuous evolution of quantum AI agents',
    'ai.activeAgents': 'Active AI Agents',
    'ai.averageAccuracy': 'Average Accuracy',
    'ai.unlockedAchievements': 'Unlocked Achievements',
    'ai.totalExperience': 'Total Experience',
    'ai.level': 'Level',
    'ai.experience': 'Experience',
    'ai.accuracy': 'Accuracy',
    'ai.efficiency': 'Efficiency',
    'ai.reliability': 'Reliability',
    'ai.skills': 'Skills',
    'ai.achievements': 'Achievements',
    'ai.lastActive': 'Last Active',
    'ai.online': 'Online',
    'ai.offline': 'Offline',
    'ai.evolutionEvents': 'Evolution Events',
    'ai.leaderboard': 'Leaderboard',
    'ai.rank': 'Rank',
    'ai.agent': 'Agent',
    'ai.score': 'Score',
    'ai.trend': 'Trend',
    
    // Web3 Integration
    'web3.connectWallet': 'Connect Wallet',
    'web3.disconnectWallet': 'Disconnect Wallet',
    'web3.walletConnected': 'Wallet Connected',
    'web3.walletDisconnected': 'Wallet Disconnected',
    'web3.address': 'Address',
    'web3.balance': 'Balance',
    'web3.network': 'Network',
    'web3.switchNetwork': 'Switch Network',
    'web3.nftBadges': 'NFT Badges',
    'web3.achievements': 'Achievements',
    'web3.staking': 'Staking',
    'web3.votingPower': 'Voting Power',
    'web3.reputation': 'Reputation',
    'web3.level': 'Level',
    'web3.experience': 'Experience',
    'web3.rarity.common': 'Common',
    'web3.rarity.rare': 'Rare',
    'web3.rarity.epic': 'Epic',
    'web3.rarity.legendary': 'Legendary',
    
    // Real-time Updates
    'realtime.notifications': 'Notifications',
    'realtime.liveUpdates': 'Live Updates',
    'realtime.markAllRead': 'Mark All Read',
    'realtime.noNotifications': 'No notifications',
    'realtime.noUpdates': 'No updates',
    'realtime.connectionStatus': 'Connection Status',
    'realtime.connected': 'Connected',
    'realtime.disconnected': 'Disconnected',
    'realtime.reconnecting': 'Reconnecting',
    
    // Post Related
    'post.title': 'Title',
    'post.content': 'Content',
    'post.author': 'Author',
    'post.createdAt': 'Created At',
    'post.updatedAt': 'Updated At',
    'post.replies': 'Replies',
    'post.views': 'Views',
    'post.likes': 'Likes',
    'post.share': 'Share',
    'post.bookmark': 'Bookmark',
    'post.report': 'Report',
    'post.edit': 'Edit',
    'post.delete': 'Delete',
    'post.reply': 'Reply',
    'post.writeReply': 'Write your reply...',
    'post.submitReply': 'Submit Reply',
    
    // User Related
    'user.profile': 'Profile',
    'user.username': 'Username',
    'user.avatar': 'Avatar',
    'user.bio': 'Bio',
    'user.joinDate': 'Join Date',
    'user.postCount': 'Post Count',
    'user.reputation': 'Reputation',
    'user.followers': 'Followers',
    'user.following': 'Following',
    'user.editProfile': 'Edit Profile',
    'user.follow': 'Follow',
    'user.unfollow': 'Unfollow',
    'user.message': 'Message',
    
    // Search and Filter
    'search.title': 'Search',
    'search.placeholder': 'Search content...',
    'search.results': 'Search Results',
    'search.noResults': 'No results found',
    'search.filters': 'Filters',
    'search.sortBy': 'Sort By',
    'search.sort.latest': 'Latest',
    'search.sort.oldest': 'Oldest',
    'search.sort.mostLiked': 'Most Liked',
    'search.sort.mostReplied': 'Most Replied',
    
    // Common Actions
    'common.search': 'Search',
    'common.filter': 'Filter',
    'common.create': 'Create',
    'common.edit': 'Edit',
    'common.delete': 'Delete',
    'common.save': 'Save',
    'common.cancel': 'Cancel',
    'common.confirm': 'Confirm',
    'common.submit': 'Submit',
    'common.loading': 'Loading...',
    'common.error': 'Error',
    'common.success': 'Success',
    'common.retry': 'Retry',
    'common.close': 'Close',
    'common.next': 'Next',
    'common.previous': 'Previous',
    'common.finish': 'Finish',
    
    // Time and Date
    'time.justNow': 'Just now',
    'time.minutesAgo': '{count} minutes ago',
    'time.hoursAgo': '{count} hours ago',
    'time.daysAgo': '{count} days ago',
    'time.weeksAgo': '{count} weeks ago',
    'time.monthsAgo': '{count} months ago',
    'time.yearsAgo': '{count} years ago',
    
    // Errors and Messages
    'error.network': 'Network connection error',
    'error.server': 'Server error',
    'error.permission': 'Insufficient permissions',
    'error.notFound': 'Content not found',
    'error.validation': 'Input validation error',
    'error.unknown': 'Unknown error',
    'success.saved': 'Saved successfully',
    'success.updated': 'Updated successfully',
    'success.deleted': 'Deleted successfully',
    'success.submitted': 'Submitted successfully',
    'success.voted': 'Voted successfully',
    'success.connected': 'Connected successfully',
    'success.disconnected': 'Disconnected successfully',
  },
  ja: {
    // ナビゲーション
    'nav.home': 'ホーム',
    'nav.community': 'コミュニティ',
    'nav.forum': 'フォーラム',
    'nav.governance': 'ガバナンス',
    'nav.ai-evolution': 'AI進化',
    'nav.wallet': 'ウォレット',
    'nav.profile': 'プロフィール',
    'nav.settings': '設定',
    
    // コミュニティホーム
    'community.title': '量子コミュニティ',
    'community.subtitle': 'グローバルな量子技術愛好家とつながり、分散型の未来を構築',
    'community.welcome': '量子コミュニティへようこそ',
    'community.description': 'グローバルな量子技術愛好家のファミリーに参加し、ブロックチェーンの未来を一緒に探求しましょう',
    'community.stats.title': 'コミュニティ統計',
    'community.stats.activeUsers': 'アクティブユーザー',
    'community.stats.totalPosts': '総投稿数',
    'community.stats.totalTopics': '総トピック数',
    'community.stats.dailyActive': '日次アクティブ',
    'community.search.placeholder': '投稿、ユーザー、トピックを検索...',
    'community.createPost': '新規投稿',
    'community.forumCategories': 'フォーラムカテゴリ',
    'community.hotTopics': 'ホットトピック',
    'community.upcomingEvents': '今後のイベント',
    'community.activeMembers': 'アクティブメンバー',
    'community.quickLinks': 'クイックリンク',
    'community.joinNow': '今すぐ参加',
    'community.explore': '詳しく見る',
    
    // フォーラムカテゴリ
    'forum.general': '総合討論',
    'forum.general.desc': 'Quantaureumに関する一般的な討論と交流',
    'forum.technical': '技術交流',
    'forum.technical.desc': '技術的な問題の討論と解決策の共有',
    'forum.defi': 'DeFi討論',
    'forum.defi.desc': 'DeFiプロトコル、流動性マイニング、収益戦略',
    'forum.trading': '取引討論',
    'forum.trading.desc': '市場分析、取引戦略、価格予測',
    'forum.governance': 'コミュニティガバナンス',
    'forum.governance.desc': 'DAOガバナンス、提案討論、投票',
    'forum.events': 'イベントゾーン',
    'forum.events.desc': 'オンライン・オフラインイベント情報と討論',
    'forum.nft': 'NFTゾーン',
    'forum.nft.desc': 'NFT作成、取引、収集に関する討論',
    'forum.education': '教育センター',
    'forum.education.desc': '量子技術とブロックチェーン学習リソース',
    
    // ガバナンスシステム
    'governance.title': 'コミュニティガバナンス',
    'governance.subtitle': 'DAOガバナンスに参加し、量子エコシステムを構築',
    'governance.totalStaked': '総ステーク量',
    'governance.activeVoters': 'アクティブ投票者',
    'governance.passedProposals': '承認済み提案',
    'governance.participationRate': '参加率',
    'governance.createProposal': '提案作成',
    'governance.viewProposals': '提案を見る',
    'governance.voting': '投票中',
    'governance.upcoming': 'まもなく開始',
    'governance.discussion': '討論中',
    'governance.passed': '承認済み',
    'governance.rejected': '拒否済み',
    'governance.expired': '期限切れ',
    
    // AI進化センター
    'ai.title': 'AI進化センター',
    'ai.subtitle': '量子AIエージェントの継続的な進化を見届ける',
    'ai.activeAgents': 'アクティブAIエージェント',
    'ai.averageAccuracy': '平均正確率',
    'ai.unlockedAchievements': 'ロック解除実績',
    'ai.totalExperience': '総経験値',
    'ai.level': 'レベル',
    'ai.experience': '経験値',
    'ai.accuracy': '正確率',
    'ai.efficiency': '効率',
    'ai.reliability': '信頼性',
    
    // Web3統合
    'web3.connectWallet': 'ウォレット接続',
    'web3.disconnectWallet': 'ウォレット切断',
    'web3.walletConnected': 'ウォレット接続済み',
    'web3.walletDisconnected': 'ウォレット切断済み',
    
    // 共通
    'common.search': '検索',
    'common.create': '作成',
    'common.save': '保存',
    'common.cancel': 'キャンセル',
    'common.confirm': '確認',
    'common.loading': '読み込み中...',
    'common.error': 'エラー',
    'common.success': '成功',
  },
  ko: {
    // 네비게이션
    'nav.home': '홈',
    'nav.community': '커뮤니티',
    'nav.forum': '포럼',
    'nav.governance': '거버넌스',
    'nav.ai-evolution': 'AI 진화',
    
    // 커뮤니티 홈
    'community.title': '퀀텀 커뮤니티',
    'community.subtitle': '전 세계 양자 기술 애호가들과 연결하여 분산형 미래 구축',
    'community.welcome': '퀀텀 커뮤니티에 오신 것을 환영합니다',
    'community.description': '전 세계 양자 기술 애호가들의 가족에 참여하여 블록체인의 미래를 함께 탐험하세요',
    
    // 공통
    'common.search': '검색',
    'common.create': '생성',
    'common.save': '저장',
    'common.cancel': '취소',
    'common.confirm': '확인',
    'common.loading': '로딩 중...',
    'common.error': '오류',
    'common.success': '성공',
  }
};

interface LanguageContextType {
  language: string;
  setLanguage: (lang: string) => void;
  t: (key: string, params?: Record<string, string | number>) => string;
  languages: string[];
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState('zh');
  const languages = ['zh', 'en', 'fr', 'de', 'es', 'ja', 'ko', 'ru', 'ar', 'vi'];

  const t = (key: string, params?: Record<string, string | number>): string => {
    let translation = translations[language]?.[key] || translations['en'][key] || key;
    
    // 处理参数替换
    if (params) {
      Object.keys(params).forEach(param => {
        translation = translation.replace(`{${param}}`, String(params[param]));
      });
    }
    
    return translation;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, languages }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useTranslation() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useTranslation must be used within a LanguageProvider');
  }
  return context;
}

// 增强语言切换组件
export function EnhancedLanguageSwitcher() {
  const { language, setLanguage, languages } = useTranslation();
  
  const languageNames = {
    zh: '中文',
    en: 'English',
    ja: '日本語',
    ko: '한국어'
  };

  return (
    <div className="flex items-center gap-2 bg-white/10 rounded-lg p-1">
      {languages.map((lang) => (
        <button
          key={lang}
          onClick={() => setLanguage(lang)}
          className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
            language === lang
              ? 'bg-gradient-to-r from-purple-500 to-cyan-500 text-white shadow-lg'
              : 'text-gray-300 hover:text-white hover:bg-white/10'
          }`}
        >
          {languageNames[lang as keyof typeof languageNames]}
        </button>
      ))}
    </div>
  );
}

// 主题切换组件
export function EnhancedThemeSwitcher() {
  const [theme, setTheme] = useState<'light' | 'dark' | 'auto'>('auto');

  useEffect(() => {
    const root = document.documentElement;
    
    if (theme === 'auto') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      root.classList.toggle('dark', mediaQuery.matches);
      
      const handler = (e: MediaQueryListEvent) => {
        root.classList.toggle('dark', e.matches);
      };
      
      mediaQuery.addEventListener('change', handler);
      return () => mediaQuery.removeEventListener('change', handler);
    } else {
      root.classList.toggle('dark', theme === 'dark');
    }
  }, [theme]);

  const themes = [
    { value: 'light', label: '☀️', name: 'Light' },
    { value: 'dark', label: '🌙', name: 'Dark' },
    { value: 'auto', label: '🔄', name: 'Auto' }
  ];

  return (
    <div className="flex items-center gap-2 bg-white/10 rounded-lg p-1">
      {(themes as { value: 'light' | 'dark' | 'auto'; label: string; name: string }[]).map((t) => (
        <button
          key={t.value}
          onClick={() => setTheme(t.value)}
          className={`px-2 py-1.5 rounded-md text-sm transition-all ${
            theme === t.value
              ? 'bg-gradient-to-r from-purple-500 to-cyan-500 text-white shadow-lg'
              : 'text-gray-300 hover:text-white hover:bg-white/10'
          }`}
          title={t.name}
        >
          {t.label}
        </button>
      ))}
    </div>
  );
}

// 语言选择器下拉菜单
export function LanguageDropdown() {
  const { language, setLanguage, languages } = useTranslation();
  
  const [isOpen, setIsOpen] = useState(false);
  
  const languageNames = {
    zh: '中文',
    en: 'English',
    ja: '日本語',
    ko: '한국어'
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 bg-white/10 rounded-lg text-white hover:bg-white/20 transition-all"
      >
        <span>{languageNames[language as keyof typeof languageNames]}</span>
        <svg className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      
      {isOpen && (
        <div className="absolute top-full mt-2 w-full bg-gray-800 border border-gray-700 rounded-lg shadow-lg z-50">
          {languages.map((lang) => (
            <button
              key={lang}
              onClick={() => {
                setLanguage(lang);
                setIsOpen(false);
              }}
              className={`w-full px-4 py-2 text-left text-sm transition-colors ${
                language === lang
                  ? 'bg-purple-500 text-white'
                  : 'text-gray-300 hover:bg-gray-700'
              }`}
            >
              {languageNames[lang as keyof typeof languageNames]}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// 区域设置检测
export function useLocale() {
  const [locale, setLocale] = useState('zh-CN');
  
  useEffect(() => {
    const browserLocale = navigator.language || 'zh-CN';
    const detectedLocale = browserLocale.startsWith('zh') ? 'zh' :
                          browserLocale.startsWith('ja') ? 'ja' :
                          browserLocale.startsWith('ko') ? 'ko' : 'en';
    
    setLocale(detectedLocale);
  }, []);
  
  return locale;
}

// 日期格式化
export function useDateFormatter() {
  const { language } = useTranslation();
  
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat(language, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };
  
  const formatRelativeTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    
    if (minutes < 1) return translations[language]['time.justNow'];
    if (minutes < 60) return translations[language]['time.minutesAgo'].replace('{count}', minutes.toString());
    if (hours < 24) return translations[language]['time.hoursAgo'].replace('{count}', hours.toString());
    if (days < 7) return translations[language]['time.daysAgo'].replace('{count}', days.toString());
    
    return formatDate(date);
  };
  
  return { formatDate, formatRelativeTime };
}
