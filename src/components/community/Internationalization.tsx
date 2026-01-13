'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface Translations {
  [key: string]: {
    [key: string]: string;
  };
}

const translations: Translations = {
  zh: {
    // 导航
    'nav.community': '社区',
    'nav.forum': '论坛',
    'nav.governance': '治理',
    'nav.ai-evolution': 'AI进化',
    
    // 社区首页
    'community.title': '量子社区',
    'community.subtitle': '连接全球量子技术爱好者，共建去中心化未来',
    'community.activeUsers': '活跃用户',
    'community.totalPosts': '帖子总数',
    'community.totalTopics': '讨论话题',
    'community.dailyActive': '日活跃用户',
    'community.forumCategories': '论坛分类',
    'community.hotTopics': '热门话题',
    'community.upcomingEvents': '即将举行的活动',
    'community.quickLinks': '快速链接',
    
    // 论坛分类
    'forum.general': '综合讨论',
    'forum.technical': '技术交流',
    'forum.defi': 'DeFi讨论',
    'forum.trading': '交易讨论',
    'forum.governance': '社区治理',
    'forum.events': '活动专区',
    
    // 治理
    'governance.title': '社区治理',
    'governance.subtitle': '参与DAO治理，共建量子生态',
    'governance.totalStaked': '总质押量',
    'governance.activeVoters': '活跃投票者',
    'governance.passedProposals': '已通过提案',
    'governance.participationRate': '参与率',
    'governance.createProposal': '创建提案',
    'governance.voting': '投票中',
    'governance.upcoming': '即将开始',
    'governance.discussion': '讨论中',
    'governance.passed': '已通过',
    'governance.rejected': '已拒绝',
    
    // AI进化
    'ai.title': 'AI进化中心',
    'ai.subtitle': '见证量子AI代理的持续进化',
    'ai.activeAgents': '活跃AI代理',
    'ai.accuracy': '平均准确率',
    'ai.achievements': '解锁成就',
    'ai.experience': '总经验值',
    'ai.level': '等级',
    'ai.experiencePoints': '经验值',
    'ai.accuracyRate': '准确率',
    'ai.efficiency': '效率',
    'ai.reliability': '可靠性',
    
    // 通用
    'common.search': '搜索',
    'common.filter': '筛选',
    'common.create': '创建',
    'common.reply': '回复',
    'common.like': '点赞',
    'common.share': '分享',
    'common.follow': '关注',
    'common.connectWallet': '连接钱包',
    'common.disconnect': '断开连接',
    'common.loading': '加载中...',
    'common.error': '出错了',
    'common.success': '成功',
    'common.cancel': '取消',
    'common.confirm': '确认',
  },
  en: {
    // Navigation
    'nav.community': 'Community',
    'nav.forum': 'Forum',
    'nav.governance': 'Governance',
    'nav.ai-evolution': 'AI Evolution',
    
    // Community Home
    'community.title': 'Quantum Community',
    'community.subtitle': 'Connect global quantum enthusiasts, build decentralized future',
    'community.activeUsers': 'Active Users',
    'community.totalPosts': 'Total Posts',
    'community.totalTopics': 'Total Topics',
    'community.dailyActive': 'Daily Active',
    'community.forumCategories': 'Forum Categories',
    'community.hotTopics': 'Hot Topics',
    'community.upcomingEvents': 'Upcoming Events',
    'community.quickLinks': 'Quick Links',
    
    // Forum Categories
    'forum.general': 'General Discussion',
    'forum.technical': 'Technical Exchange',
    'forum.defi': 'DeFi Discussion',
    'forum.trading': 'Trading Discussion',
    'forum.governance': 'Community Governance',
    'forum.events': 'Events Zone',
    
    // Governance
    'governance.title': 'Community Governance',
    'governance.subtitle': 'Participate in DAO governance, build quantum ecosystem',
    'governance.totalStaked': 'Total Staked',
    'governance.activeVoters': 'Active Voters',
    'governance.passedProposals': 'Passed Proposals',
    'governance.participationRate': 'Participation Rate',
    'governance.createProposal': 'Create Proposal',
    'governance.voting': 'Voting',
    'governance.upcoming': 'Upcoming',
    'governance.discussion': 'Discussion',
    'governance.passed': 'Passed',
    'governance.rejected': 'Rejected',
    
    // AI Evolution
    'ai.title': 'AI Evolution Center',
    'ai.subtitle': 'Witness the continuous evolution of quantum AI agents',
    'ai.activeAgents': 'Active AI Agents',
    'ai.accuracy': 'Average Accuracy',
    'ai.achievements': 'Unlocked Achievements',
    'ai.experience': 'Total Experience',
    'ai.level': 'Level',
    'ai.experiencePoints': 'Experience',
    'ai.accuracyRate': 'Accuracy',
    'ai.efficiency': 'Efficiency',
    'ai.reliability': 'Reliability',
    
    // Common
    'common.search': 'Search',
    'common.filter': 'Filter',
    'common.create': 'Create',
    'common.reply': 'Reply',
    'common.like': 'Like',
    'common.share': 'Share',
    'common.follow': 'Follow',
    'common.connectWallet': 'Connect Wallet',
    'common.disconnect': 'Disconnect',
    'common.loading': 'Loading...',
    'common.error': 'Error',
    'common.success': 'Success',
    'common.cancel': 'Cancel',
    'common.confirm': 'Confirm',
  }
};

interface LanguageContextType {
  language: string;
  setLanguage: (lang: string) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState('zh');

  const t = (key: string): string => {
    return translations[language]?.[key] || translations['en'][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
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

// 语言切换组件
export function LanguageSwitcher() {
  const { language, setLanguage } = useTranslation();

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => setLanguage('zh')}
        className={`px-3 py-1 rounded text-sm transition-all ${
          language === 'zh' 
            ? 'bg-gradient-to-r from-purple-500 to-cyan-500 text-white' 
            : 'bg-white/10 text-gray-400 hover:text-white'
        }`}
      >
        中文
      </button>
      <button
        onClick={() => setLanguage('en')}
        className={`px-3 py-1 rounded text-sm transition-all ${
          language === 'en' 
            ? 'bg-gradient-to-r from-purple-500 to-cyan-500 text-white' 
            : 'bg-white/10 text-gray-400 hover:text-white'
        }`}
      >
        EN
      </button>
    </div>
  );
}

// 主题切换组件
export function ThemeSwitcher() {
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  return (
    <button
      onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
      className="p-2 rounded-lg bg-white/10 text-white hover:bg-white/20 transition-all"
    >
      {theme === 'light' ? '🌙' : '☀️'}
    </button>
  );
}
