import { NextResponse } from 'next/server';

const BACKEND_API_URL = process.env.BACKEND_API_URL || '';

// 默认活动数据（开发环境）
const defaultEvents = [
  {
    id: '1',
    title: 'Quantaureum技术分享会',
    description: '深入了解后量子密码学和AI进化系统的最新技术进展',
    type: 'online',
    date: '12月5日',
    time: '北京时间 20:00-22:00',
    location: '在线直播',
    participants: 1234,
    status: 'upcoming',
    organizer: 'Quantaureum Foundation',
  },
  {
    id: '2',
    title: '北京开发者聚会',
    description: '与北京地区的开发者面对面交流，分享开发经验和最佳实践',
    type: 'offline',
    date: '1月5日',
    time: '14:00-18:00',
    location: '北京中关村创业大街',
    participants: 89,
    maxParticipants: 100,
    status: 'upcoming',
    organizer: 'QAU Beijing Community',
  },
  {
    id: '3',
    title: '全球量子区块链黑客松',
    description: '48小时编程马拉松，构建创新的量子安全区块链应用',
    type: 'hackathon',
    date: '2月20-22日',
    time: '48小时',
    location: '全球在线',
    participants: 456,
    prize: '100万QAU',
    status: 'upcoming',
    organizer: 'Quantaureum Foundation',
  },
  {
    id: '4',
    title: 'DeFi安全工作坊',
    description: '学习如何在量子安全环境下构建DeFi应用',
    type: 'workshop',
    date: '3月10日',
    time: '10:00-17:00',
    location: '上海浦东',
    participants: 45,
    maxParticipants: 60,
    status: 'upcoming',
    organizer: 'QAU Shanghai',
  },
  {
    id: '5',
    title: 'Quantaureum主网启动庆典',
    description: '庆祝Quantaureum主网正式上线，全球社区成员共同见证历史时刻',
    type: 'online',
    date: '11月15日',
    time: '全天',
    location: '全球在线',
    participants: 5000,
    status: 'past',
    organizer: 'Quantaureum Foundation',
  },
];

// 用户报名记录
const registrations: Record<string, string[]> = {};

// GET - 获取活动列表
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const status = searchParams.get('status');
  const type = searchParams.get('type');

  try {
    // 生产环境调用后端API
    if (BACKEND_API_URL) {
      const params = new URLSearchParams();
      if (status) params.set('status', status);
      if (type) params.set('type', type);
      const response = await fetch(`${BACKEND_API_URL}/api/events?${params}`);
      const data = await response.json();
      return NextResponse.json({ success: true, data });
    }

    // 开发环境返回默认数据
    let events = [...defaultEvents];
    if (status) {
      events = events.filter((e) => e.status === status);
    }
    if (type) {
      events = events.filter((e) => e.type === type);
    }
    return NextResponse.json({ success: true, data: events });
  } catch (error) {
    console.error('Events API error:', error);
    return NextResponse.json({ success: false, message: '获取活动失败' }, { status: 500 });
  }
}

// POST - 报名活动
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { eventId, userId } = body;

    if (!eventId || !userId) {
      return NextResponse.json({ success: false, message: '缺少必要参数' }, { status: 400 });
    }

    // 生产环境调用后端API
    if (BACKEND_API_URL) {
      const response = await fetch(`${BACKEND_API_URL}/api/events/${eventId}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId }),
      });
      const data = await response.json();
      return NextResponse.json(data);
    }

    // 开发环境模拟报名
    const event = defaultEvents.find((e) => e.id === eventId);
    if (!event) {
      return NextResponse.json({ success: false, message: '活动不存在' }, { status: 404 });
    }

    if (event.status === 'past') {
      return NextResponse.json({ success: false, message: '活动已结束' }, { status: 400 });
    }

    if (!registrations[eventId]) {
      registrations[eventId] = [];
    }

    if (registrations[eventId].includes(userId)) {
      return NextResponse.json({ success: false, message: '您已报名此活动' }, { status: 400 });
    }

    if (event.maxParticipants && event.participants >= event.maxParticipants) {
      return NextResponse.json({ success: false, message: '活动名额已满' }, { status: 400 });
    }

    registrations[eventId].push(userId);
    event.participants++;

    return NextResponse.json({
      success: true,
      message: '报名成功',
      data: { eventId, userId, participants: event.participants },
    });
  } catch (error) {
    console.error('Event registration error:', error);
    return NextResponse.json({ success: false, message: '报名失败' }, { status: 500 });
  }
}

// DELETE - 取消报名
export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const eventId = searchParams.get('eventId');
  const userId = searchParams.get('userId');

  if (!eventId || !userId) {
    return NextResponse.json({ success: false, message: '缺少必要参数' }, { status: 400 });
  }

  try {
    // 生产环境调用后端API
    if (BACKEND_API_URL) {
      const response = await fetch(
        `${BACKEND_API_URL}/api/events/${eventId}/register?userId=${userId}`,
        {
          method: 'DELETE',
        }
      );
      const data = await response.json();
      return NextResponse.json(data);
    }

    // 开发环境模拟取消
    if (registrations[eventId]) {
      const index = registrations[eventId].indexOf(userId);
      if (index > -1) {
        registrations[eventId].splice(index, 1);
        const event = defaultEvents.find((e) => e.id === eventId);
        if (event) event.participants--;
      }
    }

    return NextResponse.json({ success: true, message: '取消报名成功' });
  } catch (error) {
    console.error('Cancel registration error:', error);
    return NextResponse.json({ success: false, message: '取消失败' }, { status: 500 });
  }
}
