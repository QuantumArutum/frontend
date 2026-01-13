'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Search, TrendingUp, Clock, Users, DollarSign, Star, Heart, Share2, Eye, Calendar, Award, Shield, Zap, Plus } from 'lucide-react';
import { PageLayout } from '@/components/ui/PageLayout';
import { Card, CardHeader, CardContent, StatCard } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { Tabs } from '@/components/ui/Tabs';
import { Badge } from '@/components/ui/Badge';

interface Project {
  id: string;
  project_id?: string;
  title: string;
  subtitle: string;
  category: string;
  images: string[];
  featured: boolean;
  quantum_security: boolean;
  creator: {
    name: string;
    avatar: string;
    verified: boolean;
    location?: string;
  };
  funding: {
    goal: number;
    current: number;
    backers: number;
    end_date: string;
    progress: number;
    raised_amount: number;
    backers_count: number;
    days_left: number;
  };
  stats: {
    views: number;
    likes: number;
    shares: number;
  };
}

const categories = [
  { id: '', name: '全部', icon: '🌟' },
  { id: 'technology', name: '科技', icon: '💻' },
  { id: 'design', name: '设计', icon: '🎨' },
  { id: 'games', name: '游戏', icon: '🎮' },
  { id: 'music', name: '音乐', icon: '🎵' },
  { id: 'film', name: '影视', icon: '🎬' },
  { id: 'food', name: '美食', icon: '🍽️' },
  { id: 'fashion', name: '时尚', icon: '👗' },
  { id: 'health', name: '健康', icon: '🏥' }
];

const CrowdfundingPage = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [sortBy, setSortBy] = useState('trending');
  const [showSupportModal, setShowSupportModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [supportAmount, setSupportAmount] = useState('100');
  const [stats, setStats] = useState<{
    total_projects: number;
    active_projects: number;
    total_raised: number;
    total_backers: number;
  } | null>(null);

  const fetchProjects = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        category: selectedCategory,
        sort_by: sortBy,
        limit: '12'
      });
      
      const response = await fetch(`/api/crowdfunding/projects?${params}`);
      const data = await response.json();
      
      if (data.success && data.data?.projects) {
        setProjects(data.data.projects);
      } else {
        setProjects([]);
      }
    } catch (error) {
      console.error('获取众筹项目失败:', error);
    } finally {
      setLoading(false);
    }
  }, [selectedCategory, sortBy]);

  const fetchStats = useCallback(async () => {
    try {
      const response = await fetch('/api/crowdfunding/stats');
      const data = await response.json();
      if (data.success) {
        setStats(data.data);
      }
    } catch (error) {
      console.error('获取统计数据失败:', error);
    }
  }, []);

  useEffect(() => {
    fetchProjects();
    fetchStats();
  }, [fetchProjects, fetchStats]);

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      fetchProjects();
      return;
    }
    try {
      setLoading(true);
      const params = new URLSearchParams({ q: searchQuery, category: selectedCategory });
      const response = await fetch(`/api/crowdfunding/search?${params}`);
      const data = await response.json();
      if (data.success && data.data?.results) {
        setProjects(data.data.results);
      } else {
        setProjects([]);
      }
    } catch (error) {
      console.error('搜索失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number): string => {
    if (amount >= 1e6) return (amount / 1e6).toFixed(1) + 'M QAU';
    if (amount >= 1e3) return (amount / 1e3).toFixed(1) + 'K QAU';
    return amount.toFixed(0) + ' QAU';
  };

  const ProjectCard = ({ project }: { project: Project }) => (
    <Card hover className="overflow-hidden">
      {/* 项目图片 */}
      <div className="relative h-40 bg-gradient-to-br from-blue-600 to-purple-600">
        {project.featured && (
          <Badge variant="warning" className="absolute top-3 left-3 flex items-center gap-1">
            <Star className="w-3 h-3" /> 精选
          </Badge>
        )}
        <div className="absolute top-3 right-3 bg-black/40 backdrop-blur-sm text-white px-2 py-1 rounded-full text-xs">
          {project.funding?.days_left || 0} 天剩余
        </div>
        {project.quantum_security && (
          <div className="absolute bottom-3 right-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white p-2 rounded-full">
            <Shield className="w-4 h-4" />
          </div>
        )}
      </div>

      <CardContent className="p-4">
        {/* 分类标签 */}
        <div className="flex items-center gap-2 mb-2">
          <Badge variant="default">
            {categories.find(cat => cat.id === project.category)?.name || '其他'}
          </Badge>
          {project.quantum_security && (
            <Badge variant="info" className="flex items-center gap-1">
              <Zap className="w-3 h-3" /> 量子安全
            </Badge>
          )}
        </div>

        {/* 项目标题 */}
        <h3 className="text-lg font-bold text-white mb-1 line-clamp-1">{project.title}</h3>
        <p className="text-gray-400 text-sm mb-3 line-clamp-2">{project.subtitle}</p>

        {/* 创作者信息 */}
        <div className="flex items-center gap-2 mb-3">
          <div className="w-6 h-6 rounded-full bg-gradient-to-r from-blue-500 to-purple-500" />
          <span className="text-sm text-gray-300">{project.creator?.name || '匿名'}</span>
          {project.creator?.verified && <Award className="w-4 h-4 text-blue-400" />}
        </div>

        {/* 筹资进度 */}
        <div className="mb-3">
          <div className="flex justify-between items-center mb-1">
            <span className="text-sm text-gray-400">筹资进度</span>
            <span className="text-sm font-medium text-green-400">{(project.funding?.progress || 0).toFixed(1)}%</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full transition-all"
              style={{ width: `${Math.min(project.funding?.progress || 0, 100)}%` }}
            />
          </div>
        </div>

        {/* 统计 */}
        <div className="grid grid-cols-3 gap-2 text-center mb-3">
          <div>
            <div className="text-sm font-bold text-white">{formatCurrency(project.funding?.raised_amount || 0)}</div>
            <div className="text-xs text-gray-500">已筹集</div>
          </div>
          <div>
            <div className="text-sm font-bold text-white flex items-center justify-center gap-1">
              <Users className="w-3 h-3" /> {project.funding?.backers_count || 0}
            </div>
            <div className="text-xs text-gray-500">支持者</div>
          </div>
          <div>
            <div className="text-sm font-bold text-white flex items-center justify-center gap-1">
              <Clock className="w-3 h-3" /> {project.funding?.days_left || 0}
            </div>
            <div className="text-xs text-gray-500">天剩余</div>
          </div>
        </div>

        {/* 操作按钮 */}
        <div className="flex gap-2">
          <Button
            variant="primary"
            className="flex-1"
            onClick={() => {
              setSelectedProject(project);
              setShowSupportModal(true);
            }}
          >
            <Heart className="w-4 h-4 mr-1" /> 支持
          </Button>
          <Button variant="ghost" size="sm">
            <Share2 className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm">
            <Eye className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  const sortTabs = [
    { id: 'trending', label: '热门推荐', icon: <TrendingUp className="w-4 h-4" /> },
    { id: 'newest', label: '最新发布', icon: <Clock className="w-4 h-4" /> },
    { id: 'ending_soon', label: '即将结束', icon: <Calendar className="w-4 h-4" /> },
    { id: 'most_funded', label: '筹资最多', icon: <DollarSign className="w-4 h-4" /> },
  ];

  return (
    <PageLayout
      title="众筹平台"
      subtitle="支持创新项目，共创美好未来"
      icon={Heart}
      headerContent={
        <Button variant="primary" onClick={() => setShowCreateModal(true)}>
          <Plus className="w-4 h-4 mr-2" /> 发起众筹
        </Button>
      }
    >
      {/* 统计卡片 */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <StatCard title="总项目数" value={stats.total_projects.toLocaleString()} icon={TrendingUp} color="blue" />
          <StatCard title="活跃项目" value={stats.active_projects.toLocaleString()} icon={Clock} color="green" />
          <StatCard title="总筹资额" value={`${(stats.total_raised / 1e6).toFixed(1)}M`} icon={DollarSign} color="purple" />
          <StatCard title="支持者总数" value={stats.total_backers.toLocaleString()} icon={Users} color="orange" />
        </div>
      )}

      {/* 搜索和筛选 */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            {/* 搜索框 */}
            <div className="flex-1 flex gap-2">
              <Input
                placeholder="搜索创新项目..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                icon={<Search className="w-4 h-4" />}
                className="flex-1"
              />
              <Button variant="primary" onClick={handleSearch}>搜索</Button>
            </div>
          </div>

          {/* 分类筛选 */}
          <div className="flex flex-wrap gap-2 mt-4">
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? 'primary' : 'ghost'}
                size="sm"
                onClick={() => setSelectedCategory(category.id)}
              >
                <span className="mr-1">{category.icon}</span> {category.name}
              </Button>
            ))}
          </div>

          {/* 排序 */}
          <div className="mt-4">
            <Tabs
              tabs={sortTabs}
              activeTab={sortBy}
              onChange={setSortBy}
            />
          </div>
        </CardContent>
      </Card>

      {/* 项目列表 */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, index) => (
            <Card key={index} className="animate-pulse">
              <div className="h-40 bg-gray-700" />
              <CardContent className="p-4">
                <div className="h-4 bg-gray-700 rounded mb-2" />
                <div className="h-6 bg-gray-700 rounded mb-2" />
                <div className="h-4 bg-gray-700 rounded mb-4" />
                <div className="h-2 bg-gray-700 rounded mb-4" />
                <div className="grid grid-cols-3 gap-4">
                  <div className="h-8 bg-gray-700 rounded" />
                  <div className="h-8 bg-gray-700 rounded" />
                  <div className="h-8 bg-gray-700 rounded" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : projects.length > 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {projects.map((project, index) => (
            <motion.div
              key={project.project_id || project.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <ProjectCard project={project} />
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <Card className="text-center py-16">
          <CardContent>
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-white mb-2">未找到相关项目</h3>
            <p className="text-gray-400 mb-6">尝试调整搜索条件或浏览其他分类</p>
            <Button
              variant="primary"
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('');
                setSortBy('trending');
              }}
            >
              查看全部项目
            </Button>
          </CardContent>
        </Card>
      )}

      {/* 支持项目模态框 */}
      <Modal
        isOpen={showSupportModal}
        onClose={() => setShowSupportModal(false)}
        title="支持项目"
      >
        {selectedProject && (
          <div>
            <p className="text-gray-400 mb-4">{selectedProject.title}</p>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-300 mb-2">支持金额 (QAU)</label>
              <div className="flex gap-2 mb-3">
                {['50', '100', '500', '1000'].map(amount => (
                  <Button
                    key={amount}
                    variant={supportAmount === amount ? 'primary' : 'outline'}
                    size="sm"
                    onClick={() => setSupportAmount(amount)}
                  >
                    {amount}
                  </Button>
                ))}
              </div>
              <Input
                type="number"
                value={supportAmount}
                onChange={(e) => setSupportAmount(e.target.value)}
                placeholder="输入自定义金额"
              />
            </div>

            <div className="flex gap-3">
              <Button variant="ghost" className="flex-1" onClick={() => setShowSupportModal(false)}>
                取消
              </Button>
              <Button
                variant="primary"
                className="flex-1"
                onClick={() => {
                  alert(`成功支持 ${supportAmount} QAU！\n项目: ${selectedProject.title}\n\n（演示功能，实际支付需连接钱包）`);
                  setShowSupportModal(false);
                }}
              >
                确认支持
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* 发起众筹模态框 */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="发起众筹项目"
        size="lg"
      >
        <div className="space-y-4">
          <Input label="项目名称" placeholder="输入项目名称" />
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">项目分类</label>
            <select className="w-full bg-gray-700 text-white px-4 py-3 rounded-xl border border-gray-600 focus:border-blue-500 focus:outline-none">
              {categories.filter(c => c.id).map(cat => (
                <option key={cat.id} value={cat.id}>{cat.icon} {cat.name}</option>
              ))}
            </select>
          </div>
          
          <Input label="目标金额 (QAU)" type="number" placeholder="10000" />
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">项目描述</label>
            <textarea
              rows={4}
              className="w-full bg-gray-700 text-white px-4 py-3 rounded-xl border border-gray-600 focus:border-blue-500 focus:outline-none"
              placeholder="详细描述您的项目..."
            />
          </div>
          
          <Input label="众筹截止日期" type="date" />

          <div className="flex gap-3 pt-4">
            <Button variant="ghost" className="flex-1" onClick={() => setShowCreateModal(false)}>
              取消
            </Button>
            <Button
              variant="primary"
              className="flex-1"
              onClick={() => {
                alert('项目创建成功！\n\n（演示功能，实际创建需连接钱包并支付手续费）');
                setShowCreateModal(false);
              }}
            >
              提交项目
            </Button>
          </div>
        </div>
      </Modal>
    </PageLayout>
  );
};

export default CrowdfundingPage;

