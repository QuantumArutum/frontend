'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/Tabs';
import QuantumSecurityPanel from '@/app/components/QuantumSecurityPanel';
import { formatNumber, formatCurrency, formatPercentage } from '@/lib/utils';
import {
  Target,
  Users,
  Calendar,
  DollarSign,
  TrendingUp,
  Heart,
  Star,
  Clock,
  CheckCircle,
  AlertCircle,
  Rocket,
  Gift,
  Share2,
  Bookmark,
  Play,
  Image,
  MapPin,
  Award,
  MessageCircle,
  ThumbsUp,
  Eye,
  Filter,
  Search,
  ChevronDown,
  Plus,
  Edit,
  Settings,
  BarChart3,
  Download,
  Upload,
  Camera,
  Video,
  FileText,
  CreditCard,
  Shield,
  Globe,
  Zap,
} from 'lucide-react';

const CrowdfundingApp = () => {
  const [activeTab, setActiveTab] = useState('discover');
  const [selectedProject, setSelectedProject] = useState(null);
  const [showCreateProject, setShowCreateProject] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('trending');

  // 模拟项目数据
  const projects = [
    {
      id: 1,
      title: 'QuantumVR - 下一代虚拟现实体验',
      description: '革命性的量子计算驱动VR技术，为用户带来前所未有的沉浸式体验。',
      creator: '量子科技团队',
      creatorLocation: '深圳, 中国',
      creatorProjects: 3,
      creatorBackers: 1247,
      category: '科技',
      goal: 1000000,
      raised: 575000,
      backers: 8247,
      daysLeft: 20,
      image: '/api/placeholder/400/300',
      video: true,
      staffPick: true,
      featured: true,
      tags: ['VR', '量子计算', '科技', '创新'],
      rewards: [
        {
          amount: 50,
          title: '早鸟支持',
          description: '获得项目更新和感谢信',
          backers: 1250,
          delivery: '2024年8月',
        },
        {
          amount: 150,
          title: 'VR体验版',
          description: '获得VR设备体验版本',
          backers: 850,
          delivery: '2024年10月',
          limited: true,
        },
        {
          amount: 500,
          title: '完整版套装',
          description: '完整VR设备 + 专属内容',
          backers: 320,
          delivery: '2024年12月',
        },
        {
          amount: 1500,
          title: '创始人版',
          description: '限量版设备 + 终身更新',
          backers: 45,
          delivery: '2024年12月',
          limited: true,
        },
      ],
      story: '我们的团队致力于将量子计算技术与虚拟现实相结合，创造出前所未有的沉浸式体验...',
      risks: '技术开发风险、供应链风险、市场接受度风险',
      updates: [
        {
          date: '2024-01-15',
          title: '原型测试成功',
          content: '我们的第一个原型已经通过了所有测试...',
        },
        { date: '2024-01-10', title: '团队扩充', content: '我们很高兴宣布新的技术专家加入...' },
      ],
      comments: 234,
      likes: 1567,
      views: 45678,
      fundingType: 'all-or-nothing',
    },
    {
      id: 2,
      title: '智能环保水杯 - EcoSmart Cup',
      description: '集成IoT技术的智能水杯，实时监测水质并提醒用户保持健康饮水习惯。',
      creator: '绿色生活工作室',
      creatorLocation: '上海, 中国',
      creatorProjects: 1,
      creatorBackers: 456,
      category: '环保',
      goal: 200000,
      raised: 145000,
      backers: 2156,
      daysLeft: 35,
      image: '/api/placeholder/400/300',
      video: false,
      staffPick: false,
      featured: false,
      tags: ['环保', '智能', '健康', 'IoT'],
      rewards: [
        {
          amount: 80,
          title: '单个水杯',
          description: '获得一个智能环保水杯',
          backers: 890,
          delivery: '2024年9月',
        },
        {
          amount: 150,
          title: '家庭套装',
          description: '两个水杯 + 充电底座',
          backers: 567,
          delivery: '2024年9月',
        },
        {
          amount: 300,
          title: '企业版',
          description: '五个水杯 + 管理系统',
          backers: 123,
          delivery: '2024年10月',
        },
      ],
      story: '作为环保主义者，我们希望通过技术让每个人都能轻松地过上更环保的生活...',
      risks: '生产成本控制风险、技术集成风险',
      updates: [
        {
          date: '2024-01-12',
          title: '材料测试完成',
          content: '我们已经完成了所有环保材料的安全测试...',
        },
      ],
      comments: 89,
      likes: 456,
      views: 12345,
      fundingType: 'flexible',
    },
    {
      id: 3,
      title: '量子音乐合成器 - QuantumBeats',
      description: '利用量子算法生成独特音乐的革命性合成器，为音乐创作带来无限可能。',
      creator: '音频创新实验室',
      creatorLocation: '北京, 中国',
      creatorProjects: 2,
      creatorBackers: 789,
      category: '艺术',
      goal: 500000,
      raised: 320000,
      backers: 1876,
      daysLeft: 15,
      image: '/api/placeholder/400/300',
      video: true,
      staffPick: true,
      featured: false,
      tags: ['音乐', '量子', '艺术', '创新'],
      rewards: [
        {
          amount: 100,
          title: '数字版',
          description: '获得软件版本',
          backers: 650,
          delivery: '2024年8月',
        },
        {
          amount: 300,
          title: '硬件版',
          description: '物理合成器设备',
          backers: 420,
          delivery: '2024年11月',
        },
        {
          amount: 800,
          title: '专业版',
          description: '专业级设备 + 培训',
          backers: 156,
          delivery: '2024年12月',
        },
      ],
      story: '音乐是人类情感的表达，我们希望通过量子技术为音乐创作开辟新的可能性...',
      risks: '算法优化风险、硬件制造风险',
      updates: [
        {
          date: '2024-01-18',
          title: '算法突破',
          content: '我们在量子音乐算法方面取得了重大突破...',
        },
      ],
      comments: 156,
      likes: 892,
      views: 23456,
      fundingType: 'all-or-nothing',
    },
    {
      id: 4,
      title: '教育机器人 - EduBot Pro',
      description: '专为儿童设计的AI教育机器人，让学习变得更有趣和高效。',
      creator: '未来教育科技',
      creatorLocation: '广州, 中国',
      creatorProjects: 4,
      creatorBackers: 2134,
      category: '教育',
      goal: 800000,
      raised: 456000,
      backers: 3421,
      daysLeft: 42,
      image: '/api/placeholder/400/300',
      video: true,
      staffPick: false,
      featured: true,
      tags: ['教育', 'AI', '机器人', '儿童'],
      rewards: [
        {
          amount: 200,
          title: '基础版',
          description: '基础教育机器人',
          backers: 1200,
          delivery: '2024年10月',
        },
        {
          amount: 400,
          title: '进阶版',
          description: '增强功能版本',
          backers: 800,
          delivery: '2024年11月',
        },
        {
          amount: 800,
          title: '专业版',
          description: '全功能版 + 课程包',
          backers: 300,
          delivery: '2024年12月',
        },
      ],
      story: '我们相信每个孩子都有无限的潜能，通过AI技术我们希望为他们提供个性化的学习体验...',
      risks: 'AI算法训练风险、儿童安全认证风险',
      updates: [
        {
          date: '2024-01-20',
          title: '安全认证通过',
          content: '我们的产品已经通过了所有儿童安全认证...',
        },
      ],
      comments: 278,
      likes: 1234,
      views: 34567,
      fundingType: 'flexible',
    },
  ];

  // 我的项目数据
  const myProjects = [
    {
      id: 1,
      title: '量子音乐合成器 - QuantumBeats',
      status: '进行中',
      goal: 500000,
      raised: 320000,
      backers: 1876,
      daysLeft: 15,
      category: '艺术',
    },
  ];

  // 我的支持数据
  const myBackings = [
    {
      id: 1,
      projectTitle: 'QuantumVR - 下一代虚拟现实体验',
      amount: 800,
      reward: '完整版套装',
      date: '2024-01-10',
      status: '进行中',
    },
    {
      id: 2,
      projectTitle: '智能环保水杯 - EcoSmart Cup',
      amount: 150,
      reward: '家庭套装',
      date: '2024-01-05',
      status: '进行中',
    },
  ];

  const categories = [
    { id: 'all', name: '全部', count: 1247 },
    { id: 'tech', name: '科技', count: 456 },
    { id: 'art', name: '艺术', count: 234 },
    { id: 'education', name: '教育', count: 189 },
    { id: 'environment', name: '环保', count: 167 },
    { id: 'health', name: '健康', count: 134 },
    { id: 'games', name: '游戏', count: 67 },
  ];

  const sortOptions = [
    { id: 'trending', name: '热门趋势' },
    { id: 'newest', name: '最新发布' },
    { id: 'ending', name: '即将结束' },
    { id: 'funded', name: '筹资最多' },
    { id: 'backers', name: '支持者最多' },
  ];

  // 筛选和排序项目
  const filteredProjects = projects.filter((project) => {
    const matchesSearch =
      project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || project.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // 项目详情模态框
  const ProjectDetailModal = ({ project, onClose }) => {
    const [selectedReward, setSelectedReward] = useState(null);
    const [supportAmount, setSupportAmount] = useState('');
    const [activeDetailTab, setActiveDetailTab] = useState('story');

    const progressPercentage = (project.raised / project.goal) * 100;

    return (
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="bg-gradient-to-br from-slate-900/95 to-blue-900/95 backdrop-blur-xl border border-cyan-500/30 rounded-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6">
            {/* 头部 */}
            <div className="flex justify-between items-start mb-6">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h2 className="text-responsive-2xl font-bold text-white">{project.title}</h2>
                  {project.staffPick && (
                    <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white border-0">
                      <Award className="w-3 h-3 mr-1" />
                      员工推荐
                    </Badge>
                  )}
                  {project.featured && (
                    <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0">
                      <Star className="w-3 h-3 mr-1" />
                      特色项目
                    </Badge>
                  )}
                </div>
                <p className="text-cyan-200 text-responsive-base mb-4">{project.description}</p>

                {/* 创作者信息 */}
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full flex items-center justify-center">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-white font-medium">{project.creator}</p>
                    <div className="flex items-center gap-4 text-sm text-cyan-300">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {project.creatorLocation}
                      </span>
                      <span>{project.creatorProjects} 个项目</span>
                      <span>{formatNumber(project.creatorBackers)} 支持者</span>
                    </div>
                  </div>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="text-cyan-300 hover:text-white hover:bg-cyan-500/20"
              >
                ✕
              </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* 左侧内容 */}
              <div className="lg:col-span-2">
                {/* 项目图片/视频 */}
                <div className="relative mb-6">
                  <div className="aspect-video bg-gradient-to-br from-slate-800 to-blue-900 rounded-xl flex items-center justify-center">
                    {project.video ? (
                      <div className="text-center">
                        <Play className="w-16 h-16 text-cyan-400 mx-auto mb-2" />
                        <p className="text-cyan-200">项目视频</p>
                      </div>
                    ) : (
                      <div className="text-center">
                        <Image className="w-16 h-16 text-cyan-400 mx-auto mb-2" />
                        <p className="text-cyan-200">项目图片</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* 详情标签页 */}
                <Tabs value={activeDetailTab} onValueChange={setActiveDetailTab} className="w-full">
                  <TabsList className="grid w-full grid-cols-4 bg-slate-800/50 border border-cyan-500/30">
                    <TabsTrigger
                      value="story"
                      className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-500 data-[state=active]:to-blue-600 data-[state=active]:text-white"
                    >
                      项目故事
                    </TabsTrigger>
                    <TabsTrigger
                      value="updates"
                      className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-500 data-[state=active]:to-blue-600 data-[state=active]:text-white"
                    >
                      项目更新
                    </TabsTrigger>
                    <TabsTrigger
                      value="comments"
                      className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-500 data-[state=active]:to-blue-600 data-[state=active]:text-white"
                    >
                      评论
                    </TabsTrigger>
                    <TabsTrigger
                      value="risks"
                      className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-500 data-[state=active]:to-blue-600 data-[state=active]:text-white"
                    >
                      风险说明
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="story" className="mt-4">
                    <Card className="bg-slate-800/50 border-cyan-500/30">
                      <CardContent className="p-6">
                        <p className="text-cyan-100 leading-relaxed">{project.story}</p>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="updates" className="mt-4">
                    <div className="space-y-4">
                      {project.updates.map((update, index) => (
                        <Card key={index} className="bg-slate-800/50 border-cyan-500/30">
                          <CardContent className="p-6">
                            <div className="flex items-center gap-2 mb-2">
                              <Calendar className="w-4 h-4 text-cyan-400" />
                              <span className="text-sm text-cyan-300">{update.date}</span>
                            </div>
                            <h4 className="text-white font-medium mb-2">{update.title}</h4>
                            <p className="text-cyan-100">{update.content}</p>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </TabsContent>

                  <TabsContent value="comments" className="mt-4">
                    <Card className="bg-slate-800/50 border-cyan-500/30">
                      <CardContent className="p-6">
                        <div className="flex items-center gap-2 mb-4">
                          <MessageCircle className="w-5 h-5 text-cyan-400" />
                          <span className="text-white font-medium">
                            {formatNumber(project.comments)} 条评论
                          </span>
                        </div>
                        <p className="text-cyan-200">评论功能开发中...</p>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="risks" className="mt-4">
                    <Card className="bg-slate-800/50 border-cyan-500/30">
                      <CardContent className="p-6">
                        <div className="flex items-center gap-2 mb-4">
                          <AlertCircle className="w-5 h-5 text-yellow-400" />
                          <span className="text-white font-medium">风险与挑战</span>
                        </div>
                        <p className="text-cyan-100">{project.risks}</p>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
              </div>

              {/* 右侧支持区域 */}
              <div className="space-y-6">
                {/* 筹资进度 */}
                <Card className="bg-slate-800/50 border-cyan-500/30">
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-cyan-200 text-sm">筹资进度</span>
                          <span className="text-cyan-400 text-sm font-medium">
                            {formatPercentage(progressPercentage)}
                          </span>
                        </div>
                        <div className="w-full bg-slate-700 rounded-full h-3">
                          <div
                            className="bg-gradient-to-r from-cyan-500 to-blue-600 h-3 rounded-full transition-all duration-500"
                            style={{ width: `${Math.min(progressPercentage, 100)}%` }}
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-responsive-xl font-bold text-white truncate-number">
                            {formatCurrency(project.raised, 'QAU')}
                          </p>
                          <p className="text-cyan-300 text-sm">已筹资</p>
                        </div>
                        <div>
                          <p className="text-responsive-xl font-bold text-white truncate-number">
                            {formatCurrency(project.goal, 'QAU')}
                          </p>
                          <p className="text-cyan-300 text-sm">目标金额</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-responsive-lg font-bold text-white truncate-number">
                            {formatNumber(project.backers)}
                          </p>
                          <p className="text-cyan-300 text-sm">支持者</p>
                        </div>
                        <div>
                          <p className="text-responsive-lg font-bold text-white">
                            {project.daysLeft}
                          </p>
                          <p className="text-cyan-300 text-sm">天剩余</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 text-sm text-cyan-300">
                        <Shield className="w-4 h-4" />
                        <span>
                          {project.fundingType === 'all-or-nothing' ? '全额筹资' : '灵活筹资'}模式
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* 回报选择 */}
                <Card className="bg-slate-800/50 border-cyan-500/30">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <Gift className="w-5 h-5 text-cyan-400" />
                      选择回报
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {project.rewards.map((reward, index) => (
                      <div
                        key={index}
                        className={`p-4 rounded-lg border cursor-pointer transition-all ${
                          selectedReward === index
                            ? 'border-cyan-400 bg-cyan-500/10'
                            : 'border-slate-600 hover:border-cyan-500/50'
                        }`}
                        onClick={() => setSelectedReward(index)}
                      >
                        <div className="flex justify-between items-start mb-2">
                          <span className="text-responsive-lg font-bold text-white truncate-number">
                            {formatCurrency(reward.amount, 'QAU')}
                          </span>
                          {reward.limited && (
                            <Badge className="bg-red-500/20 text-red-400 border-red-500/30">
                              限量
                            </Badge>
                          )}
                        </div>
                        <h4 className="text-white font-medium mb-1">{reward.title}</h4>
                        <p className="text-cyan-200 text-sm mb-2">{reward.description}</p>
                        <div className="flex justify-between items-center text-xs text-cyan-300">
                          <span>{formatNumber(reward.backers)} 位支持者</span>
                          <span>预计交付: {reward.delivery}</span>
                        </div>
                      </div>
                    ))}

                    {/* 自定义金额 */}
                    <div className="p-4 rounded-lg border border-slate-600">
                      <h4 className="text-white font-medium mb-2">自定义支持金额</h4>
                      <Input
                        type="number"
                        placeholder="输入金额"
                        value={supportAmount}
                        onChange={(e) => setSupportAmount(e.target.value)}
                        className="bg-slate-700/50 border-slate-600 text-white"
                      />
                    </div>

                    <Button className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white">
                      立即支持
                    </Button>

                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 border-cyan-500/30 text-cyan-300 hover:bg-cyan-500/10"
                      >
                        <Heart className="w-4 h-4 mr-1" />
                        收藏
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 border-cyan-500/30 text-cyan-300 hover:bg-cyan-500/10"
                      >
                        <Share2 className="w-4 h-4 mr-1" />
                        分享
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* 项目统计 */}
                <Card className="bg-slate-800/50 border-cyan-500/30">
                  <CardContent className="p-6">
                    <h4 className="text-white font-medium mb-4">项目统计</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-cyan-300 text-sm flex items-center gap-1">
                          <Eye className="w-3 h-3" />
                          浏览量
                        </span>
                        <span className="text-white truncate-number">
                          {formatNumber(project.views)}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-cyan-300 text-sm flex items-center gap-1">
                          <ThumbsUp className="w-3 h-3" />
                          点赞数
                        </span>
                        <span className="text-white truncate-number">
                          {formatNumber(project.likes)}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-cyan-300 text-sm flex items-center gap-1">
                          <MessageCircle className="w-3 h-3" />
                          评论数
                        </span>
                        <span className="text-white truncate-number">
                          {formatNumber(project.comments)}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // 项目创建表单
  const CreateProjectForm = () => {
    const [projectData, setProjectData] = useState({
      title: '',
      description: '',
      category: '',
      goal: '',
      duration: '',
      fundingType: 'all-or-nothing',
    });

    return (
      <div className="max-w-4xl mx-auto">
        <Card className="bg-slate-800/50 border-cyan-500/30">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Rocket className="w-6 h-6 text-cyan-400" />
              发起新项目
            </CardTitle>
            <CardDescription className="text-cyan-200">
              将您的创意变为现实，获得社区支持
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* 基本信息 */}
            <div className="space-y-4">
              <h3 className="text-white font-medium">基本信息</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-cyan-300 text-sm mb-2 block">项目标题</label>
                  <Input
                    placeholder="输入项目标题"
                    value={projectData.title}
                    onChange={(e) => setProjectData({ ...projectData, title: e.target.value })}
                    className="bg-slate-700/50 border-slate-600 text-white"
                  />
                </div>
                <div>
                  <label className="text-cyan-300 text-sm mb-2 block">项目分类</label>
                  <select
                    className="w-full p-2 bg-slate-700/50 border border-slate-600 rounded-md text-white"
                    value={projectData.category}
                    onChange={(e) => setProjectData({ ...projectData, category: e.target.value })}
                  >
                    <option value="">选择分类</option>
                    <option value="tech">科技</option>
                    <option value="art">艺术</option>
                    <option value="education">教育</option>
                    <option value="environment">环保</option>
                    <option value="health">健康</option>
                    <option value="games">游戏</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="text-cyan-300 text-sm mb-2 block">项目描述</label>
                <textarea
                  placeholder="详细描述您的项目..."
                  value={projectData.description}
                  onChange={(e) => setProjectData({ ...projectData, description: e.target.value })}
                  className="w-full p-3 bg-slate-700/50 border border-slate-600 rounded-md text-white h-32 resize-none"
                />
              </div>
            </div>

            {/* 筹资设置 */}
            <div className="space-y-4">
              <h3 className="text-white font-medium">筹资设置</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-cyan-300 text-sm mb-2 block">筹资目标 (QAU)</label>
                  <Input
                    type="number"
                    placeholder="输入目标金额"
                    value={projectData.goal}
                    onChange={(e) => setProjectData({ ...projectData, goal: e.target.value })}
                    className="bg-slate-700/50 border-slate-600 text-white"
                  />
                </div>
                <div>
                  <label className="text-cyan-300 text-sm mb-2 block">筹资期限 (天)</label>
                  <Input
                    type="number"
                    placeholder="输入筹资天数"
                    value={projectData.duration}
                    onChange={(e) => setProjectData({ ...projectData, duration: e.target.value })}
                    className="bg-slate-700/50 border-slate-600 text-white"
                  />
                </div>
              </div>
              <div>
                <label className="text-cyan-300 text-sm mb-2 block">筹资模式</label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 text-white">
                    <input
                      type="radio"
                      name="fundingType"
                      value="all-or-nothing"
                      checked={projectData.fundingType === 'all-or-nothing'}
                      onChange={(e) =>
                        setProjectData({ ...projectData, fundingType: e.target.value })
                      }
                      className="text-cyan-500"
                    />
                    全额筹资 (All-or-Nothing)
                  </label>
                  <label className="flex items-center gap-2 text-white">
                    <input
                      type="radio"
                      name="fundingType"
                      value="flexible"
                      checked={projectData.fundingType === 'flexible'}
                      onChange={(e) =>
                        setProjectData({ ...projectData, fundingType: e.target.value })
                      }
                      className="text-cyan-500"
                    />
                    灵活筹资 (Keep-it-All)
                  </label>
                </div>
              </div>
            </div>

            {/* 媒体上传 */}
            <div className="space-y-4">
              <h3 className="text-white font-medium">媒体内容</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border-2 border-dashed border-slate-600 rounded-lg p-6 text-center">
                  <Camera className="w-8 h-8 text-cyan-400 mx-auto mb-2" />
                  <p className="text-cyan-300 text-sm">上传项目图片</p>
                  <p className="text-slate-400 text-xs">支持 JPG, PNG 格式</p>
                </div>
                <div className="border-2 border-dashed border-slate-600 rounded-lg p-6 text-center">
                  <Video className="w-8 h-8 text-cyan-400 mx-auto mb-2" />
                  <p className="text-cyan-300 text-sm">上传项目视频</p>
                  <p className="text-slate-400 text-xs">支持 MP4, MOV 格式</p>
                </div>
              </div>
            </div>

            {/* 操作按钮 */}
            <div className="flex gap-4 pt-6">
              <Button
                variant="outline"
                onClick={() => setShowCreateProject(false)}
                className="border-cyan-500/30 text-cyan-300 hover:bg-cyan-500/10"
              >
                取消
              </Button>
              <Button className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white">
                保存草稿
              </Button>
              <Button className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white">
                提交审核
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 relative overflow-hidden">
      {/* 量子背景效果 */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-20 left-20 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-2000" />
      </div>

      {/* 量子网格背景 */}
      <div className="absolute inset-0 opacity-10">
        <div
          className="w-full h-full"
          style={{
            backgroundImage: `
            linear-gradient(rgba(6, 182, 212, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(6, 182, 212, 0.1) 1px, transparent 1px)
          `,
            backgroundSize: '50px 50px',
          }}
        />
      </div>

      <div className="relative z-10 p-6">
        {/* 头部 */}
        <div className="max-w-7xl mx-auto mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-responsive-3xl font-bold text-white mb-2">量子众筹平台</h1>
              <p className="text-cyan-200">让创意获得支持，让梦想成为现实</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-responsive-lg font-bold text-white truncate-number">
                  {formatCurrency(5685000000, 'QAU')}
                </p>
                <p className="text-cyan-300 text-sm">总筹资额</p>
              </div>
              <div className="text-right">
                <p className="text-responsive-lg font-bold text-white truncate-number">
                  {formatNumber(19928)}
                </p>
                <p className="text-cyan-300 text-sm">支持者</p>
              </div>
              <div className="text-right">
                <p className="text-responsive-lg font-bold text-green-400">100%</p>
                <p className="text-cyan-300 text-sm">量子安全</p>
              </div>
            </div>
          </div>
        </div>

        {/* 量子安全面板 */}
        <div className="max-w-7xl mx-auto mb-8">
          <QuantumSecurityPanel />
        </div>

        {/* 主要内容 */}
        <div className="max-w-7xl mx-auto">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4 bg-slate-800/50 border border-cyan-500/30 mb-8">
              <TabsTrigger
                value="discover"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-500 data-[state=active]:to-blue-600 data-[state=active]:text-white"
              >
                <Search className="w-4 h-4 mr-2" />
                发现项目
              </TabsTrigger>
              <TabsTrigger
                value="create"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-500 data-[state=active]:to-blue-600 data-[state=active]:text-white"
              >
                <Plus className="w-4 h-4 mr-2" />
                发起项目
              </TabsTrigger>
              <TabsTrigger
                value="my-projects"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-500 data-[state=active]:to-blue-600 data-[state=active]:text-white"
              >
                <Settings className="w-4 h-4 mr-2" />
                我的项目
              </TabsTrigger>
              <TabsTrigger
                value="my-support"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-500 data-[state=active]:to-blue-600 data-[state=active]:text-white"
              >
                <Heart className="w-4 h-4 mr-2" />
                我的支持
              </TabsTrigger>
            </TabsList>

            {/* 发现项目 */}
            <TabsContent value="discover" className="space-y-6">
              {/* 搜索和筛选 */}
              <Card className="bg-slate-800/50 border-cyan-500/30">
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-cyan-400 w-4 h-4" />
                        <Input
                          placeholder="搜索项目..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="pl-10 bg-slate-700/50 border-slate-600 text-white"
                        />
                      </div>
                    </div>
                    <div className="flex gap-4">
                      <select
                        className="px-4 py-2 bg-slate-700/50 border border-slate-600 rounded-md text-white"
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                      >
                        {categories.map((category) => (
                          <option key={category.id} value={category.id}>
                            {category.name} ({category.count})
                          </option>
                        ))}
                      </select>
                      <select
                        className="px-4 py-2 bg-slate-700/50 border border-slate-600 rounded-md text-white"
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                      >
                        {sortOptions.map((option) => (
                          <option key={option.id} value={option.id}>
                            {option.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* 特色项目横幅 */}
              <Card className="bg-gradient-to-r from-purple-900/50 to-blue-900/50 border-purple-500/30">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                      <Star className="w-8 h-8 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-responsive-xl font-bold text-white mb-1">本周特色项目</h3>
                      <p className="text-purple-200">精选优质项目，获得更多曝光和支持</p>
                    </div>
                    <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white">
                      查看详情
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* 项目网格 */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProjects.map((project) => {
                  const progressPercentage = (project.raised / project.goal) * 100;

                  return (
                    <Card
                      key={project.id}
                      className="bg-slate-800/50 border-cyan-500/30 hover:border-cyan-400 transition-all duration-300 cursor-pointer group"
                      onClick={() => setSelectedProject(project)}
                    >
                      <CardContent className="p-0">
                        {/* 项目图片 */}
                        <div className="relative">
                          <div className="aspect-video bg-gradient-to-br from-slate-700 to-blue-800 rounded-t-lg flex items-center justify-center">
                            {project.video ? (
                              <Play className="w-12 h-12 text-cyan-400" />
                            ) : (
                              <Image className="w-12 h-12 text-cyan-400" />
                            )}
                          </div>

                          {/* 徽章 */}
                          <div className="absolute top-3 left-3 flex gap-2">
                            {project.staffPick && (
                              <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white border-0">
                                <Award className="w-3 h-3 mr-1" />
                                员工推荐
                              </Badge>
                            )}
                            {project.featured && (
                              <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0">
                                <Star className="w-3 h-3 mr-1" />
                                特色
                              </Badge>
                            )}
                          </div>

                          {/* 视频标识 */}
                          {project.video && (
                            <div className="absolute top-3 right-3">
                              <Badge className="bg-black/50 text-white border-0">
                                <Play className="w-3 h-3 mr-1" />
                                视频
                              </Badge>
                            </div>
                          )}
                        </div>

                        <div className="p-6">
                          {/* 项目标题和描述 */}
                          <div className="mb-4">
                            <h3 className="text-responsive-lg font-bold text-white mb-2 group-hover:text-cyan-400 transition-colors">
                              {project.title}
                            </h3>
                            <p className="text-cyan-200 text-sm line-clamp-2">
                              {project.description}
                            </p>
                          </div>

                          {/* 创作者信息 */}
                          <div className="flex items-center gap-2 mb-4">
                            <div className="w-8 h-8 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full flex items-center justify-center">
                              <Users className="w-4 h-4 text-white" />
                            </div>
                            <div>
                              <p className="text-white text-sm font-medium">{project.creator}</p>
                              <p className="text-cyan-300 text-xs">{project.creatorLocation}</p>
                            </div>
                          </div>

                          {/* 进度条 */}
                          <div className="mb-4">
                            <div className="flex justify-between items-center mb-2">
                              <span className="text-cyan-200 text-sm">进度</span>
                              <span className="text-cyan-400 text-sm font-medium">
                                {formatPercentage(progressPercentage)}
                              </span>
                            </div>
                            <div className="w-full bg-slate-700 rounded-full h-2">
                              <div
                                className="bg-gradient-to-r from-cyan-500 to-blue-600 h-2 rounded-full transition-all duration-500"
                                style={{ width: `${Math.min(progressPercentage, 100)}%` }}
                              />
                            </div>
                          </div>

                          {/* 统计信息 */}
                          <div className="grid grid-cols-3 gap-4 mb-4">
                            <div>
                              <p className="text-responsive-sm font-bold text-white truncate-number">
                                {formatCurrency(project.raised, 'QAU')}
                              </p>
                              <p className="text-cyan-300 text-xs">已筹资</p>
                            </div>
                            <div>
                              <p className="text-responsive-sm font-bold text-white truncate-number">
                                {formatNumber(project.backers)}
                              </p>
                              <p className="text-cyan-300 text-xs">支持者</p>
                            </div>
                            <div>
                              <p className="text-responsive-sm font-bold text-white">
                                {project.daysLeft}
                              </p>
                              <p className="text-cyan-300 text-xs">天剩余</p>
                            </div>
                          </div>

                          {/* 标签 */}
                          <div className="flex flex-wrap gap-1 mb-4">
                            {project.tags.slice(0, 3).map((tag, index) => (
                              <Badge
                                key={index}
                                variant="outline"
                                className="border-cyan-500/30 text-cyan-300 text-xs"
                              >
                                {tag}
                              </Badge>
                            ))}
                          </div>

                          {/* 操作按钮 */}
                          <div className="flex gap-2">
                            <Button
                              className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white"
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedProject(project);
                              }}
                            >
                              立即支持
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="border-cyan-500/30 text-cyan-300 hover:bg-cyan-500/10"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <Heart className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="border-cyan-500/30 text-cyan-300 hover:bg-cyan-500/10"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <Share2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </TabsContent>

            {/* 发起项目 */}
            <TabsContent value="create">
              <CreateProjectForm />
            </TabsContent>

            {/* 我的项目 */}
            <TabsContent value="my-projects" className="space-y-6">
              <Card className="bg-slate-800/50 border-cyan-500/30">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Settings className="w-5 h-5 text-cyan-400" />
                    我的项目管理
                  </CardTitle>
                  <CardDescription className="text-cyan-200">管理您发起的众筹项目</CardDescription>
                </CardHeader>
                <CardContent>
                  {myProjects.length > 0 ? (
                    <div className="space-y-4">
                      {myProjects.map((project) => (
                        <Card key={project.id} className="bg-slate-700/50 border-slate-600">
                          <CardContent className="p-6">
                            <div className="flex justify-between items-start mb-4">
                              <div>
                                <h3 className="text-white font-bold text-lg mb-1">
                                  {project.title}
                                </h3>
                                <Badge
                                  className={`${
                                    project.status === '进行中'
                                      ? 'bg-green-500/20 text-green-400 border-green-500/30'
                                      : 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
                                  }`}
                                >
                                  {project.status}
                                </Badge>
                              </div>
                              <div className="flex gap-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="border-cyan-500/30 text-cyan-300"
                                >
                                  <Edit className="w-4 h-4 mr-1" />
                                  编辑
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="border-cyan-500/30 text-cyan-300"
                                >
                                  <BarChart3 className="w-4 h-4 mr-1" />
                                  统计
                                </Button>
                              </div>
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                              <div>
                                <p className="text-responsive-lg font-bold text-white truncate-number">
                                  {formatCurrency(project.raised, 'QAU')}
                                </p>
                                <p className="text-cyan-300 text-sm">已筹资</p>
                              </div>
                              <div>
                                <p className="text-responsive-lg font-bold text-white truncate-number">
                                  {formatCurrency(project.goal, 'QAU')}
                                </p>
                                <p className="text-cyan-300 text-sm">目标</p>
                              </div>
                              <div>
                                <p className="text-responsive-lg font-bold text-white truncate-number">
                                  {formatNumber(project.backers)}
                                </p>
                                <p className="text-cyan-300 text-sm">支持者</p>
                              </div>
                              <div>
                                <p className="text-responsive-lg font-bold text-white">
                                  {project.daysLeft}
                                </p>
                                <p className="text-cyan-300 text-sm">天剩余</p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <Rocket className="w-16 h-16 text-cyan-400 mx-auto mb-4" />
                      <h3 className="text-white text-lg font-medium mb-2">还没有项目</h3>
                      <p className="text-cyan-200 mb-4">开始您的第一个众筹项目</p>
                      <Button
                        onClick={() => setActiveTab('create')}
                        className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white"
                      >
                        发起项目
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* 我的支持 */}
            <TabsContent value="my-support" className="space-y-6">
              <Card className="bg-slate-800/50 border-cyan-500/30">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Heart className="w-5 h-5 text-cyan-400" />
                    我的支持记录
                  </CardTitle>
                  <CardDescription className="text-cyan-200">查看您支持的所有项目</CardDescription>
                </CardHeader>
                <CardContent>
                  {myBackings.length > 0 ? (
                    <div className="space-y-4">
                      {myBackings.map((backing) => (
                        <Card key={backing.id} className="bg-slate-700/50 border-slate-600">
                          <CardContent className="p-6">
                            <div className="flex justify-between items-start mb-4">
                              <div>
                                <h3 className="text-white font-bold text-lg mb-1">
                                  {backing.projectTitle}
                                </h3>
                                <p className="text-cyan-200">回报: {backing.reward}</p>
                              </div>
                              <div className="text-right">
                                <p className="text-responsive-lg font-bold text-white truncate-number">
                                  {formatCurrency(backing.amount, 'QAU')}
                                </p>
                                <p className="text-cyan-300 text-sm">{backing.date}</p>
                              </div>
                            </div>

                            <div className="flex justify-between items-center">
                              <Badge
                                className={`${
                                  backing.status === '进行中'
                                    ? 'bg-green-500/20 text-green-400 border-green-500/30'
                                    : 'bg-blue-500/20 text-blue-400 border-blue-500/30'
                                }`}
                              >
                                {backing.status}
                              </Badge>
                              <Button
                                variant="outline"
                                size="sm"
                                className="border-cyan-500/30 text-cyan-300"
                              >
                                <Download className="w-4 h-4 mr-1" />
                                下载收据
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <Heart className="w-16 h-16 text-cyan-400 mx-auto mb-4" />
                      <h3 className="text-white text-lg font-medium mb-2">还没有支持记录</h3>
                      <p className="text-cyan-200 mb-4">发现并支持您感兴趣的项目</p>
                      <Button
                        onClick={() => setActiveTab('discover')}
                        className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white"
                      >
                        发现项目
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* 项目详情模态框 */}
      {selectedProject && (
        <ProjectDetailModal project={selectedProject} onClose={() => setSelectedProject(null)} />
      )}
    </div>
  );
};

export default CrowdfundingApp;
