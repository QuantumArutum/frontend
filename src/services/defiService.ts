import { request } from "../utils/request";

const BASE_URL = "http://localhost:8082/api/defi"; // DeFi服务端口

// 类型定义
interface FarmingPool {
  ID: string;
  Name: string;
  StakedToken: string;
  RewardToken: string;
  TotalStaked: number;
  APR: number;
  RewardPerBlock: number;
  UserStaked: number;
  PendingRewards: number;
}

interface LendingPool {
  ID: string;
  AssetID: string;
  AssetName: string;
  TotalSupply: number;
  TotalBorrows: number;
  SupplyAPY: number;
  BorrowAPY: number;
  UtilizationRate: number;
  LiquidationThreshold: number;
}

interface LiquidityPool {
  ID: string;
  Name: string;
  AssetA: string;
  AssetB: string;
  ReserveA: number;
  ReserveB: number;
  TotalLiquidity: number;
  APY: number;
  Volume24h: number;
  Fees24h: number;
}

interface ProtocolStats {
  totalValueLocked: number;
  volume24h: number;
  averageAPY: number;
  activeUsers: number;
}

interface TransactionResponse {
  success: boolean;
  txHash?: string;
}

interface UserPosition {
  id: string;
  type: string;
  amount: number;
  value: number;
}

interface UserStats {
  totalValue: number;
  totalEarnings: number;
  positions: number;
}

export const defiService = {
  // 流动性挖矿相关
  farming: {
    // 获取所有挖矿池
    getFarmingPools: async (): Promise<FarmingPool[]> => {
      // 暂时返回模拟数据
      return [
        {
          ID: "farm_qau_usdt",
          Name: "QAU-USDT LP",
          StakedToken: "QAU-USDT LP",
          RewardToken: "QAU",
          TotalStaked: 5000000000000000,
          APR: 0.234,
          RewardPerBlock: 1000000000,
          UserStaked: 0,
          PendingRewards: 0
        }
      ];
    },

    // 质押代币
    stake: async (poolID: string, amount: number): Promise<TransactionResponse> => {
      return request(`${BASE_URL}/farming/stake`, {
        method: 'POST',
        body: JSON.stringify({ poolID, amount })
      });
    },

    // 解除质押
    unstake: async (poolID: string, amount: number): Promise<TransactionResponse> => {
      return request(`${BASE_URL}/farming/unstake`, {
        method: 'POST',
        body: JSON.stringify({ poolID, amount })
      });
    },

    // 领取奖励
    claimRewards: async (poolID: string): Promise<TransactionResponse> => {
      return request(`${BASE_URL}/farming/claim`, {
        method: 'POST',
        body: JSON.stringify({ poolID })
      });
    }
  },

  // 借贷协议相关
  lending: {
    // 获取所有借贷池
    getLendingPools: async (): Promise<LendingPool[]> => {
      // 暂时返回模拟数据
      return [
        {
          ID: "lending_qau",
          AssetID: "QAU",
          AssetName: "Quantum Aurum",
          TotalSupply: 10000000000000000,
          TotalBorrows: 6500000000000000,
          SupplyAPY: 0.045,
          BorrowAPY: 0.078,
          UtilizationRate: 0.65,
          LiquidationThreshold: 0.75
        }
      ];
    },

    // 存款
    supply: async (assetID: string, amount: number): Promise<TransactionResponse> => {
      return request(`${BASE_URL}/lending/supply`, {
        method: 'POST',
        body: JSON.stringify({ assetID, amount })
      });
    },

    // 提取
    withdraw: async (assetID: string, amount: number): Promise<TransactionResponse> => {
      return request(`${BASE_URL}/lending/withdraw`, {
        method: 'POST',
        body: JSON.stringify({ assetID, amount })
      });
    },

    // 借款
    borrow: async (assetID: string, amount: number): Promise<TransactionResponse> => {
      return request(`${BASE_URL}/lending/borrow`, {
        method: 'POST',
        body: JSON.stringify({ assetID, amount })
      });
    },

    // 还款
    repay: async (assetID: string, amount: number): Promise<TransactionResponse> => {
      return request(`${BASE_URL}/lending/repay`, {
        method: 'POST',
        body: JSON.stringify({ assetID, amount })
      });
    }
  },


  // 流动性池相关
  liquidity: {
    // 获取所有流动性池
    getLiquidityPools: async (): Promise<LiquidityPool[]> => {
      // 暂时返回模拟数据
      return [
        {
          ID: "pool_qau_usdt",
          Name: "QAU/USDT",
          AssetA: "QAU",
          AssetB: "USDT",
          ReserveA: 1000000000000000,
          ReserveB: 50000000000000000,
          TotalLiquidity: 7071067811865476,
          APY: 0.125,
          Volume24h: 5000000000000000,
          Fees24h: 15000000000000
        }
      ];
    },

    // 添加流动性
    addLiquidity: async (poolID: string, amountA: number, amountB: number): Promise<TransactionResponse> => {
      return request(`${BASE_URL}/liquidity/add`, {
        method: 'POST',
        body: JSON.stringify({ poolID, amountA, amountB })
      });
    },

    // 移除流动性
    removeLiquidity: async (poolID: string, liquidity: number): Promise<TransactionResponse> => {
      return request(`${BASE_URL}/liquidity/remove`, {
        method: 'POST',
        body: JSON.stringify({ poolID, liquidity })
      });
    },

    // 交换代币
    swap: async (poolID: string, tokenIn: string, amountIn: number, tokenOut: string, minAmountOut: number): Promise<TransactionResponse> => {
      return request(`${BASE_URL}/liquidity/swap`, {
        method: 'POST',
        body: JSON.stringify({ poolID, tokenIn, amountIn, tokenOut, minAmountOut })
      });
    }
  },

  // 用户仓位相关
  positions: {
    // 获取用户所有仓位
    getUserPositions: async (userID: string): Promise<UserPosition[]> => {
      return request(`${BASE_URL}/positions/${userID}`);
    },

    // 获取用户借贷仓位
    getUserLendingPositions: async (userID: string): Promise<UserPosition[]> => {
      return request(`${BASE_URL}/positions/lending/${userID}`);
    },

    // 获取用户流动性仓位
    getUserLiquidityPositions: async (userID: string): Promise<UserPosition[]> => {
      return request(`${BASE_URL}/positions/liquidity/${userID}`);
    },

    // 获取用户挖矿仓位
    getUserFarmingPositions: async (userID: string): Promise<UserPosition[]> => {
      return request(`${BASE_URL}/positions/farming/${userID}`);
    }
  },

  // 统计数据
  stats: {
    // 获取协议总体统计
    getProtocolStats: async (): Promise<ProtocolStats> => {
      // 暂时返回模拟数据
      return {
        totalValueLocked: 12500000000000000,
        volume24h: 2800000000000000,
        averageAPY: 0.156,
        activeUsers: 8924
      };
    },

    // 获取用户统计
    getUserStats: async (userID: string): Promise<UserStats> => {
      return request(`${BASE_URL}/stats/user/${userID}`);
    }
  }
};
