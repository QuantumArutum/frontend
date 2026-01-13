'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  TrendingUp, 
  CheckCircle, 
  ArrowRight,
  Plus,
  User,
  BarChart3,
  MessageSquare,
  Eye,
  Calendar,
  Zap,
  RefreshCw
} from 'lucide-react';
import ParticlesBackground from '../../components/ParticlesBackground';
import CommunityNavbar from '../../../components/community/CommunityNavbar';
import EnhancedFooter from '../../components/EnhancedFooter';
import { governanceService, Proposal, Delegate } from '../../../services/communityService';

interface GovernanceStats {
  totalStaked: number;
  activeVoters: number;
  passedProposals: number;
  participationRate: number;
}

export default function GovernancePage() {
  const [activeTab, setActiveTab] = useState<'proposals' | 'delegates' | 'create'>('proposals');
  const [loading, setLoading] = useState(true);
  const [voting, setVoting] = useState<string | null>(null);
  const [delegating, setDelegating] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const [stats, setStats] = useState<GovernanceStats>({
    totalStaked: 0, activeVoters: 0, passedProposals: 0, participationRate: 0
  });
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [delegates, setDelegates] = useState<Delegate[]>([]);

  const [proposalForm, setProposalForm] = useState({
    title: '', description: '', category: 'tech', tags: ''
  });

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [proposalsData, delegatesData, statsData] = await Promise.all([
        governanceService.getProposals(),
        governanceService.getDelegates(),
        governanceService.getStats()
      ]);
      setProposals(proposalsData);
      setDelegates(delegatesData);
      setStats(statsData);
    } catch (err) {
      console.error('Failed to load governance data:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleVote = async (proposalId: string, vote: 'for' | 'against') => {
    const userInfo = localStorage.getItem('user_info');
    if (!userInfo) {
      window.location.href = '/auth/login?redirect=/community/governance';
      return;
    }

    setVoting(proposalId);
    try {
      const user = JSON.parse(userInfo);
      const result = await governanceService.vote(proposalId, user.id, vote, 1000);
      if (result.success) {
        await loadData();
      } else {
        alert(result.error || '投票失败');
      }
    } catch (err) {
      console.error('Vote failed:', err);
    } finally {
      setVoting(null);
    }
  };

  const handleDelegate = async (delegateId: string) => {
    const userInfo = localStorage.getItem('user_info');
    if (!userInfo) {
      window.location.href = '/auth/login?redirect=/community/governance';
      return;
    }

    setDelegating(delegateId);
    try {
      const user = JSON.parse(userInfo);
      const result = await governanceService.delegateVotes(user.id, delegateId, 1000);
      if (result.success) {
        await loadData();
        alert('委托成功');
      } else {
        alert(result.error || '委托失败');
      }
    } catch (err) {
      console.error('Delegate failed:', err);
    } finally {
      setDelegating(null);
    }
  };

  const handleSubmitProposal = async (e: React.FormEvent) => {
    e.preventDefault();
    const userInfo = localStorage.getItem('user_info');
    if (!userInfo) {
      window.location.href = '/auth/login?redirect=/community/governance';
      return;
    }

    if (!proposalForm.title || !proposalForm.description) {
      alert('请填写完整的提案信息');
      return;
    }

    setSubmitting(true);
    try {
      const user = JSON.parse(userInfo);
      const result = await governanceService.createProposal({
        title: proposalForm.title,
        description: proposalForm.description,
        category: proposalForm.category,
        tags: proposalForm.tags.split(',').map((t: string) => t.trim()).filter(Boolean),
        userId: user.id
      });
      if (result.success) {
        setProposalForm({ title: '', description: '', category: 'tech', tags: '' });
        setActiveTab('proposals');
        await loadData();
        alert('提案提交成功');
      } else {
        alert(result.error || '提交失败');
      }
    } catch (err) {
      console.error('Submit proposal failed:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'from-green-500 to-emerald-500';
      case 'pending': return 'from-blue-500 to-cyan-500';
      case 'discussion': return 'from-yellow-500 to-orange-500';
      case 'passed': return 'from-green-500 to-emerald-500';
      case 'rejected': return 'from-red-500 to-pink-500';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return '投票中';
      case 'pending': return '即将开始';
      case 'discussion': return '讨论中';
      case 'passed': return '已通过';
      case 'rejected': return '已拒绝';
      default: return '未知';
    }
  };

  return (
    <div className="min-h-screen relative">
      <ParticlesBackground />
      <CommunityNavbar />
      <div className="relative z-10 container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
            <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent mb-4">
              社区治理
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              参与Quantaureum的去中心化治理，共同决定生态系统的未来发展方向
            </p>
          </motion.div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setActiveTab('create')}
            className="bg-gradient-to-r from-purple-500 to-cyan-500 text-white px-8 py-3 rounded-xl font-medium hover:from-purple-600 hover:to-cyan-600 transition-all flex items-center gap-2 mx-auto"
          >
            <Plus className="h-5 w-5" />
            创建治理提案
          </motion.button>
        </div>

        {/* 统计卡片 */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
            <div className="flex items-center justify-between mb-2">
              <Zap className="h-8 w-8 text-purple-400" />
              <TrendingUp className="h-5 w-5 text-green-400" />
            </div>
            <div className="text-3xl font-bold text-white mb-1">{stats.totalStaked.toLocaleString()}</div>
            <div className="text-gray-400">QAU质押总量</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
            <div className="flex items-center justify-between mb-2">
              <Users className="h-8 w-8 text-cyan-400" />
              <TrendingUp className="h-5 w-5 text-green-400" />
            </div>
            <div className="text-3xl font-bold text-white mb-1">{stats.activeVoters.toLocaleString()}</div>
            <div className="text-gray-400">活跃投票者</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
            <div className="flex items-center justify-between mb-2">
              <CheckCircle className="h-8 w-8 text-green-400" />
              <TrendingUp className="h-5 w-5 text-green-400" />
            </div>
            <div className="text-3xl font-bold text-white mb-1">{stats.passedProposals}</div>
            <div className="text-gray-400">已通过提案</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
            <div className="flex items-center justify-between mb-2">
              <BarChart3 className="h-8 w-8 text-yellow-400" />
              <TrendingUp className="h-5 w-5 text-green-400" />
            </div>
            <div className="text-3xl font-bold text-white mb-1">{stats.participationRate}%</div>
            <div className="text-gray-400">平均参与率</div>
          </div>
        </motion.div>

        {/* 标签页切换 */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex justify-center mb-8">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-2 border border-white/20">
            <div className="flex gap-2">
              {(['proposals', 'delegates', 'create'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-6 py-3 rounded-xl font-medium transition-all ${
                    activeTab === tab
                      ? 'bg-gradient-to-r from-purple-500 to-cyan-500 text-white'
                      : 'text-white hover:bg-white/10'
                  }`}
                >
                  {tab === 'proposals' ? '治理提案' : tab === 'delegates' ? '投票代表' : '创建提案'}
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        {loading && (
          <div className="text-center py-12">
            <RefreshCw className="w-8 h-8 text-purple-400 animate-spin mx-auto" />
            <p className="text-gray-400 mt-4">加载中...</p>
          </div>
        )}

        {/* 提案列表 */}
        {!loading && activeTab === 'proposals' && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            {proposals.map((proposal) => (
              <motion.div
                key={proposal.id}
                whileHover={{ scale: 1.01 }}
                className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:border-white/40 transition-all"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className={`px-3 py-1 bg-gradient-to-r ${getStatusColor(proposal.status)} text-white text-sm rounded-full font-medium`}>
                        {getStatusText(proposal.status)}
                      </span>
                      <span className="text-gray-400 text-sm">{proposal.category}</span>
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">{proposal.title}</h3>
                    <p className="text-gray-300 mb-4">{proposal.description}</p>
                    
                    <div className="flex items-center gap-4 text-sm text-gray-400">
                      <span className="flex items-center gap-1">
                        <User className="h-4 w-4" />
                        {proposal.proposer}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {proposal.endDate}
                      </span>
                      <span className="flex items-center gap-1">
                        <MessageSquare className="h-4 w-4" />
                        {proposal.discussionCount}
                      </span>
                      <span className="flex items-center gap-1">
                        <Eye className="h-4 w-4" />
                        {proposal.views}
                      </span>
                    </div>
                  </div>
                  
                  {proposal.status === 'active' && (
                    <div className="ml-6 text-right">
                      <div className="text-2xl font-bold text-white mb-1">
                        {((proposal.votes.for / proposal.totalVotes) * 100).toFixed(1)}%
                      </div>
                      <div className="text-sm text-gray-400">支持率</div>
                    </div>
                  )}
                </div>

                {proposal.status === 'active' && (
                  <div className="mb-4">
                    <div className="flex items-center justify-between text-sm mb-2">
                      <span className="text-gray-400">投票进度</span>
                      <span className="text-white">{proposal.totalVotes.toLocaleString()} / {proposal.quorum.toLocaleString()} QAU</span>
                    </div>
                    <div className="w-full bg-white/10 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full" 
                        style={{width: `${Math.min((proposal.totalVotes / proposal.quorum) * 100, 100)}%`}}
                      />
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-2 mb-4">
                  {proposal.tags.map((tag) => (
                    <span key={tag} className="bg-white/20 text-white px-2 py-1 rounded-full text-xs">
                      {tag}
                    </span>
                  ))}
                </div>

                {proposal.status === 'active' && (
                  <div className="grid grid-cols-3 gap-4 mb-4">
                    <div className="text-center">
                      <div className="text-lg font-bold text-green-400">{proposal.votes.for.toLocaleString()}</div>
                      <div className="text-sm text-gray-400">支持</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-red-400">{proposal.votes.against.toLocaleString()}</div>
                      <div className="text-sm text-gray-400">反对</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-gray-400">{proposal.votes.abstain.toLocaleString()}</div>
                      <div className="text-sm text-gray-400">弃权</div>
                    </div>
                  </div>
                )}

                <div className="flex gap-3">
                  {proposal.status === 'active' && (
                    <>
                      <button 
                        onClick={() => handleVote(proposal.id, 'for')}
                        disabled={voting === proposal.id}
                        className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 text-white py-2 rounded-lg font-medium hover:from-green-600 hover:to-emerald-600 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                      >
                        {voting === proposal.id && <RefreshCw className="w-4 h-4 animate-spin" />}
                        投票支持
                      </button>
                      <button 
                        onClick={() => handleVote(proposal.id, 'against')}
                        disabled={voting === proposal.id}
                        className="flex-1 bg-gradient-to-r from-red-500 to-pink-500 text-white py-2 rounded-lg font-medium hover:from-red-600 hover:to-pink-600 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                      >
                        {voting === proposal.id && <RefreshCw className="w-4 h-4 animate-spin" />}
                        投票反对
                      </button>
                    </>
                  )}
                  <button className="px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-all flex items-center gap-2">
                    查看详情
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* 投票代表 */}
        {!loading && activeTab === 'delegates' && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {delegates.map((delegate) => (
              <motion.div
                key={delegate.id}
                whileHover={{ scale: 1.02 }}
                className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:border-white/40 transition-all"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full flex items-center justify-center text-white font-bold text-xl">
                    {delegate.avatar}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">{delegate.name}</h3>
                    <p className="text-sm text-gray-400">{delegate.category}</p>
                  </div>
                </div>
                
                <p className="text-gray-300 text-sm mb-4">{delegate.description}</p>
                
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">委托票数</span>
                    <span className="text-white font-medium">{delegate.delegatedVotes.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">参与率</span>
                    <span className="text-white font-medium">{delegate.participationRate}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">关注者</span>
                    <span className="text-white font-medium">{delegate.followers.toLocaleString()}</span>
                  </div>
                </div>
                
                <button 
                  onClick={() => handleDelegate(delegate.id)}
                  disabled={delegating === delegate.id}
                  className="w-full mt-4 bg-gradient-to-r from-purple-500 to-cyan-500 text-white py-2 rounded-lg font-medium hover:from-purple-600 hover:to-cyan-600 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {delegating === delegate.id && <RefreshCw className="w-4 h-4 animate-spin" />}
                  {delegating === delegate.id ? '委托中...' : '委托投票权'}
                </button>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* 创建提案 */}
        {!loading && activeTab === 'create' && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl mx-auto">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
              <h2 className="text-2xl font-bold text-white mb-6">创建治理提案</h2>
              
              <form onSubmit={handleSubmitProposal} className="space-y-6">
                <div>
                  <label className="block text-white font-medium mb-2">提案标题</label>
                  <input
                    type="text"
                    placeholder="输入提案标题..."
                    value={proposalForm.title}
                    onChange={(e) => setProposalForm({ ...proposalForm, title: e.target.value })}
                    className="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500/50"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-white font-medium mb-2">提案分类</label>
                  <select 
                    value={proposalForm.category}
                    onChange={(e) => setProposalForm({ ...proposalForm, category: e.target.value })}
                    className="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-purple-500/50"
                  >
                    <option value="tech">技术升级</option>
                    <option value="economy">经济模型</option>
                    <option value="ecosystem">生态发展</option>
                    <option value="governance">社区治理</option>
                    <option value="security">安全改进</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-white font-medium mb-2">提案描述</label>
                  <textarea
                    placeholder="详细描述您的提案内容..."
                    rows={6}
                    value={proposalForm.description}
                    onChange={(e) => setProposalForm({ ...proposalForm, description: e.target.value })}
                    className="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500/50 resize-none"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-white font-medium mb-2">提案标签</label>
                  <input
                    type="text"
                    placeholder="输入标签，用逗号分隔..."
                    value={proposalForm.tags}
                    onChange={(e) => setProposalForm({ ...proposalForm, tags: e.target.value })}
                    className="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500/50"
                  />
                </div>
                
                <div className="bg-white/5 rounded-lg p-4">
                  <h3 className="text-white font-medium mb-2">提案要求</h3>
                  <ul className="text-gray-300 text-sm space-y-1">
                    <li>• 需要持有至少10,000 QAU</li>
                    <li>• 提案需要经过7天讨论期</li>
                    <li>• 投票需要达到100万QAU的法定人数</li>
                    <li>• 通过需要超过50%的支持率</li>
                  </ul>
                </div>
                
                <button 
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-gradient-to-r from-purple-500 to-cyan-500 text-white py-3 rounded-lg font-medium hover:from-purple-600 hover:to-cyan-600 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {submitting && <RefreshCw className="w-5 h-5 animate-spin" />}
                  {submitting ? '提交中...' : '提交提案'}
                </button>
              </form>
            </div>
          </motion.div>
        )}

        {/* 治理流程说明 */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mt-16">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-white mb-4">治理流程</h2>
            <p className="text-gray-300">了解Quantaureum的去中心化治理流程</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { icon: '1', title: '提案创建', desc: '持有10,000+ QAU的用户可以创建治理提案', color: 'from-purple-500 to-pink-500' },
              { icon: '2', title: '社区讨论', desc: '7天讨论期，社区成员可以提出意见和建议', color: 'from-blue-500 to-cyan-500' },
              { icon: '3', title: '投票表决', desc: '7天投票期，QAU持有者进行量子安全投票', color: 'from-green-500 to-emerald-500' },
              { icon: '4', title: '执行实施', desc: '通过提案进入48小时时间锁，然后自动执行', color: 'from-orange-500 to-red-500' }
            ].map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className={`w-16 h-16 mx-auto mb-4 bg-gradient-to-r ${step.color} rounded-full flex items-center justify-center text-white font-bold text-xl`}>
                  {step.icon}
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{step.title}</h3>
                <p className="text-gray-400 text-sm">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
      
      <EnhancedFooter />
    </div>
  );
}
