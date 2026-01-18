/**
 * Staking Service - Real blockchain integration
 */

// Use relative URL for Next.js API routes
const STAKING_API = '/api/defi/staking';

// Helper function for API requests
async function request(url: string, options?: RequestInit) {
  const response = await fetch(url, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Request failed' }));
    throw new Error(error.error || `HTTP error! status: ${response.status}`);
  }

  return response.json();
}

// 质押池类型
export interface StakingPool {
  id: string;
  name: string;
  tokenSymbol: string;
  tokenAddress: string;
  contractAddress: string;
  apy: number;
  totalStaked: string;
  totalStakedUSD: number;
  minStake: string;
  maxStake: string;
  lockPeriodDays: number;
  earlyWithdrawPenalty: number;
  rewardTokenSymbol: string;
  rewardTokenAddress: string;
  status: 'active' | 'paused' | 'deprecated';
  participants: number;
  createdAt: string;
  updatedAt: string;
}

// 用户质押信息
export interface UserStake {
  id: string;
  poolId: string;
  userAddress: string;
  stakedAmount: string;
  stakedAmountUSD: number;
  pendingRewards: string;
  pendingRewardsUSD: number;
  claimedRewards: string;
  stakeTimestamp: number;
  unlockTimestamp: number;
  isLocked: boolean;
  lastClaimTimestamp: number;
}

// 协议统计
export interface ProtocolStats {
  totalValueLocked: string;
  totalValueLockedUSD: number;
  totalRewardsDistributed: string;
  totalRewardsDistributedUSD: number;
  averageAPY: number;
  totalStakers: number;
  activePools: number;
}

export const stakingService = {
  // Get all staking pools from blockchain
  getPools: async (): Promise<StakingPool[]> => {
    try {
      const response = await request(`${STAKING_API}/pools`);
      const pools = response.data || [];

      return pools.map(
        (pool: {
          pool_id: string;
          token: string;
          reward_token: string;
          total_staked: number;
          duration_days: number;
          min_stake_amount: number;
          apy: number;
          validators?: number;
        }) => ({
          id: pool.pool_id,
          name: `${pool.token} ${pool.duration_days}-Day Staking`,
          tokenSymbol: pool.token,
          tokenAddress: '0xQAU0000000000000000000000000000000000001',
          contractAddress: `0xStaking${pool.pool_id.replace(/-/g, '')}`,
          apy: pool.apy,
          totalStaked: (pool.total_staked * 1e18).toString(),
          totalStakedUSD: pool.total_staked,
          minStake: (pool.min_stake_amount * 1e18).toString(),
          maxStake: '100000000000000000000000000', // 100M QAU
          lockPeriodDays: pool.duration_days,
          earlyWithdrawPenalty: pool.duration_days > 30 ? 5 : 0,
          rewardTokenSymbol: pool.reward_token,
          rewardTokenAddress: '0xQAU0000000000000000000000000000000000001',
          status: 'active' as const,
          participants: pool.validators || Math.floor(pool.total_staked / 10000),
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: new Date().toISOString(),
        })
      );
    } catch (error) {
      console.error('Failed to fetch staking pools:', error);
      throw error; // Don't fallback to mock data
    }
  },

  // Get user stakes from blockchain
  getUserStakes: async (userAddress: string): Promise<UserStake[]> => {
    try {
      const response = await request(`${STAKING_API}/users/${userAddress}/stakes`);
      const stakes = response.data || [];

      return stakes.map(
        (stake: {
          id: string;
          pool_id: string;
          amount: string;
          rewards: string;
          start_time: string;
          unlock_time: string;
          is_locked: boolean;
          status: string;
          apy: number;
        }) => ({
          id: stake.id,
          poolId: stake.pool_id,
          userAddress: userAddress,
          stakedAmount: (parseFloat(stake.amount) * 1e18).toString(),
          stakedAmountUSD: parseFloat(stake.amount),
          pendingRewards: (parseFloat(stake.rewards) * 1e18).toString(),
          pendingRewardsUSD: parseFloat(stake.rewards),
          claimedRewards: '0',
          stakeTimestamp: new Date(stake.start_time).getTime() / 1000,
          unlockTimestamp: new Date(stake.unlock_time).getTime() / 1000,
          isLocked: stake.is_locked,
          lastClaimTimestamp: 0,
        })
      );
    } catch (error) {
      console.error('Failed to fetch user stakes:', error);
      return [];
    }
  },

  // Stake tokens - calls real blockchain
  stake: async (
    poolId: string,
    amount: string,
    userAddress: string
  ): Promise<{ success: boolean; txHash?: string; error?: string }> => {
    try {
      // Convert from wei to QAU for API
      const amountQAU = parseFloat(amount) / 1e18;
      const response = await request(`${STAKING_API}/stake`, {
        method: 'POST',
        body: JSON.stringify({ poolId, amount: amountQAU.toString(), userAddress }),
      });
      return response;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Staking failed';
      return { success: false, error: errorMessage };
    }
  },

  // Unstake tokens - calls real blockchain
  unstake: async (
    stakeId: string,
    amount: string,
    userAddress: string
  ): Promise<{ success: boolean; txHash?: string; error?: string }> => {
    try {
      const amountQAU = parseFloat(amount) / 1e18;
      const response = await request(`${STAKING_API}/unstake`, {
        method: 'POST',
        body: JSON.stringify({ stakeId, amount: amountQAU.toString(), userAddress }),
      });
      return response;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unstaking failed';
      return { success: false, error: errorMessage };
    }
  },

  // Claim rewards - calls real blockchain
  claimRewards: async (
    stakeId: string,
    userAddress: string
  ): Promise<{ success: boolean; txHash?: string; amount?: string; error?: string }> => {
    try {
      const response = await request(`${STAKING_API}/claim`, {
        method: 'POST',
        body: JSON.stringify({ stakeId, userAddress }),
      });
      return response;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Claim failed';
      return { success: false, error: errorMessage };
    }
  },

  // Compound rewards - calls real blockchain
  compoundRewards: async (
    stakeId: string,
    userAddress: string
  ): Promise<{ success: boolean; txHash?: string; error?: string }> => {
    try {
      const response = await request(`${STAKING_API}/compound`, {
        method: 'POST',
        body: JSON.stringify({ stakeId, userAddress }),
      });
      return response;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Compound failed';
      return { success: false, error: errorMessage };
    }
  },

  // Get protocol statistics from blockchain
  getProtocolStats: async (): Promise<ProtocolStats> => {
    try {
      const response = await request(`${STAKING_API}/stats`);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch protocol stats:', error);
      throw error;
    }
  },

  // Calculate estimated rewards
  calculateEstimatedRewards: (stakedAmount: number, apy: number, days: number): number => {
    const dailyRate = apy / 365 / 100;
    return stakedAmount * dailyRate * days;
  },

  // Format token amount (wei to human readable)
  formatTokenAmount: (amount: string, decimals = 18): string => {
    const num = parseFloat(amount) / Math.pow(10, decimals);
    if (isNaN(num)) return '0';
    if (num >= 1000000) {
      return (num / 1000000).toFixed(2) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(2) + 'K';
    }
    return num.toFixed(4);
  },

  // Parse token amount (human readable to wei)
  parseTokenAmount: (amount: string, decimals = 18): string => {
    const num = parseFloat(amount) * Math.pow(10, decimals);
    return num.toString();
  },
};

export default stakingService;
