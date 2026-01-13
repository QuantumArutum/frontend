import { NextResponse } from 'next/server';

const BACKEND_API_URL = process.env.BACKEND_API_URL || '';

// 默认提案数据（开发环境）
const defaultProposals = [
  { id: '1', title: '升级量子安全算法至CRYSTALS-Dilithium v3.1', description: '提议将当前使用的CRYSTALS-Dilithium算法升级到最新的v3.1版本，以提高签名效率和安全性。', status: 'active', proposer: 'QuantumCore团队', proposerAvatar: 'QC', category: '技术升级', votes: { for: 969685, against: 264882, abstain: 0 }, totalVotes: 1234567, quorum: 2000000, endDate: '2024-12-27', tags: ['技术升级', '量子安全'], discussionCount: 234, views: 5678, createdAt: new Date(Date.now() - 604800000).toISOString() },
  { id: '2', title: '设立开发者生态基金', description: '提议从财库中拨出500万QAU设立开发者生态基金，用于资助优秀的DApp开发项目和技术创新。', status: 'pending', proposer: 'EcoFund DAO', proposerAvatar: 'EF', category: '生态发展', votes: { for: 0, against: 0, abstain: 0 }, totalVotes: 0, quorum: 2000000, endDate: '2024-12-30', tags: ['生态基金', '开发者激励'], discussionCount: 156, views: 3421, createdAt: new Date(Date.now() - 259200000).toISOString() },
  { id: '3', title: '调整网络手续费结构', description: '提议调整当前的网络手续费结构，降低基础交易费用50%。', status: 'discussion', proposer: '用户体验委员会', proposerAvatar: 'UX', category: '经济模型', votes: { for: 0, against: 0, abstain: 0 }, totalVotes: 0, quorum: 2000000, endDate: '待定', tags: ['手续费', '经济模型'], discussionCount: 89, views: 2156, createdAt: new Date(Date.now() - 172800000).toISOString() },
  { id: '4', title: '增加质押奖励年化率', description: '提议将当前质押奖励年化率从8%提升至12%。', status: 'passed', proposer: '经济委员会', proposerAvatar: 'EC', category: '经济模型', votes: { for: 1789456, against: 234567, abstain: 123456 }, totalVotes: 2147479, quorum: 2000000, endDate: '2024-12-15', tags: ['质押奖励', '经济激励'], discussionCount: 345, views: 8901, createdAt: new Date(Date.now() - 864000000).toISOString() }
];

const defaultDelegates = [
  { id: '1', name: 'QuantumFoundation', avatar: 'QF', description: '官方基金会，专注于量子区块链技术发展和生态建设', delegatedVotes: 1234567, participationRate: 98.5, followers: 2345, category: '官方机构' },
  { id: '2', name: 'CryptoDev联盟', avatar: 'CD', description: '开发者组织，致力于推动DApp生态发展和技术创新', delegatedVotes: 987654, participationRate: 95.2, followers: 1876, category: '开发者社区' },
  { id: '3', name: 'QuantumSecurity', avatar: 'QS', description: '安全专家团队，专注于量子安全和密码学研究', delegatedVotes: 756432, participationRate: 97.8, followers: 1543, category: '安全专家' }
];

// GET - 获取提案列表或代表列表
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type') || 'proposals';
  const status = searchParams.get('status');

  try {
    // 生产环境调用后端API
    if (BACKEND_API_URL) {
      const response = await fetch(`${BACKEND_API_URL}/api/governance/${type}${status ? `?status=${status}` : ''}`);
      const data = await response.json();
      return NextResponse.json({ success: true, data });
    }

    // 开发环境返回默认数据
    if (type === 'delegates') {
      return NextResponse.json({ success: true, data: defaultDelegates });
    }

    let proposals = [...defaultProposals];
    if (status) {
      proposals = proposals.filter(p => p.status === status);
    }
    return NextResponse.json({ success: true, data: proposals });
  } catch (error) {
    console.error('Governance API error:', error);
    return NextResponse.json({ success: false, message: '获取数据失败' }, { status: 500 });
  }
}


// POST - 创建提案或投票
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action, proposalId, userId, vote, votingPower, title, description, category, tags, delegateId, amount } = body;

    // 生产环境调用后端API
    if (BACKEND_API_URL) {
      const response = await fetch(`${BACKEND_API_URL}/api/governance/${action}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      const data = await response.json();
      return NextResponse.json(data);
    }

    // 开发环境模拟操作
    if (action === 'vote') {
      if (!proposalId || !userId || !vote) {
        return NextResponse.json({ success: false, message: '缺少必要参数' }, { status: 400 });
      }
      // 模拟投票成功
      return NextResponse.json({ 
        success: true, 
        message: '投票成功',
        data: { proposalId, vote, votingPower: votingPower || 1000 }
      });
    }

    if (action === 'create') {
      if (!title || !description || !userId) {
        return NextResponse.json({ success: false, message: '缺少必要参数' }, { status: 400 });
      }
      const newProposal = {
        id: `proposal_${Date.now()}`,
        title,
        description,
        status: 'discussion',
        proposer: userId,
        proposerAvatar: userId.substring(0, 2).toUpperCase(),
        category: category || '社区治理',
        votes: { for: 0, against: 0, abstain: 0 },
        totalVotes: 0,
        quorum: 2000000,
        endDate: '待定',
        tags: tags || [],
        discussionCount: 0,
        views: 0,
        createdAt: new Date().toISOString()
      };
      return NextResponse.json({ success: true, data: newProposal, message: '提案创建成功' });
    }

    if (action === 'delegate') {
      if (!userId || !delegateId) {
        return NextResponse.json({ success: false, message: '缺少必要参数' }, { status: 400 });
      }
      return NextResponse.json({ 
        success: true, 
        message: '委托成功',
        data: { delegateId, amount: amount || 1000 }
      });
    }

    return NextResponse.json({ success: false, message: '未知操作' }, { status: 400 });
  } catch (error) {
    console.error('Governance POST error:', error);
    return NextResponse.json({ success: false, message: '操作失败' }, { status: 500 });
  }
}
