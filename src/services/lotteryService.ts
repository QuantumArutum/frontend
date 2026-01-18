import { request } from '../utils/request';

const BASE_URL = 'http://localhost:8081/api/lottery'; // 彩票服务端口

export const lotteryService = {
  // 获取当前彩票
  getCurrentLottery: async () => {
    // 暂时返回模拟数据
    return {
      ID: 'lottery_001',
      Name: '量子大乐透',
      Description: '基于量子随机数的公平彩票系统',
      StartTime: new Date(Date.now() - 24 * 60 * 60 * 1000),
      EndTime: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000),
      DrawTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      Status: 0, // STATUS_PENDING
      TicketPrice: 200000000, // 2 QAU
      PrizePool: 50000000000000, // 500,000 QAU
      NumberRange: 35,
      NumberCount: 5,
      BonusRange: 12,
      BonusCount: 2,
    };
  },

  // 列出所有彩票
  listLotteries: async () => {
    return request(`${BASE_URL}/lotteries`);
  },

  // 获取彩票详情
  getLottery: async (lotteryID: string) => {
    return request(`${BASE_URL}/lottery/${lotteryID}`);
  },

  // 购买彩票
  buyTicket: async (ticketData: {
    lotteryID: string;
    owner: string;
    numbers: number[];
    price: number;
  }) => {
    // 暂时返回模拟数据
    return {
      ID: `ticket_${Date.now()}`,
      LotteryID: ticketData.lotteryID,
      Owner: ticketData.owner,
      Numbers: ticketData.numbers,
      PurchaseTime: new Date(),
      Price: ticketData.price,
      Status: 0,
    };
  },

  // 获取用户票据
  getUserTickets: async (_userID: string) => {
    // 暂时返回模拟数据
    return [];
  },

  // 获取开奖历史
  getLotteryHistory: async (_limit = 10) => {
    // 暂时返回模拟数据
    return [
      {
        ID: 'lottery_history_001',
        Name: '量子大乐透 第2024001期',
        DrawTime: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        WinningNumbers: [7, 14, 21, 28, 35],
        BonusNumbers: [3, 9],
        PrizePool: 45000000000000,
        Winners: 3,
      },
      {
        ID: 'lottery_history_002',
        Name: '量子大乐透 第2024002期',
        DrawTime: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
        WinningNumbers: [2, 11, 19, 26, 33],
        BonusNumbers: [5, 11],
        PrizePool: 38000000000000,
        Winners: 1,
      },
    ];
  },

  // 检查中奖情况
  checkWinning: async (_ticketID: string) => {
    // 暂时返回模拟数据
    return {
      isWinner: false,
      matchCount: 0,
      prize: 0,
    };
  },

  // 获取彩票统计
  getLotteryStats: async () => {
    // 暂时返回模拟数据
    return {
      totalPrizePool: 50000000000000,
      totalTicketsSold: 25000,
      totalWinners: 156,
      averagePrize: 320512820512,
    };
  },
};
