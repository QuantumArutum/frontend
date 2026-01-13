'use client';

import React, { useState, useEffect, useCallback, FormEvent } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/Card';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { Label } from './ui/label';
import { Switch } from './ui/switch';
import { Alert, AlertDescription } from './ui/Alert';
import { Badge } from './ui/Badge';
import { Separator } from './ui/Separator';
import { 
  Settings, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle, 
  XCircle,
  DollarSign,
  Timer,
  Target
} from 'lucide-react';

// 自动出价状态类型
interface AutoBidStatus {
  isActive: boolean;
  maxAmount: number;
  increment: number;
  totalBids: number;
}

// 组件属性类型
interface AutoBidProps {
  auctionId: string;
  currentPrice: number;
  minIncrement: number;
  onAutoBidSet?: (autoBid: AutoBidStatus) => void;
}

const AutoBid: React.FC<AutoBidProps> = ({ 
  auctionId, 
  currentPrice, 
  minIncrement, 
  onAutoBidSet 
}) => {
  const [isEnabled, setIsEnabled] = useState<boolean>(false);
  const [maxAmount, setMaxAmount] = useState<string>('');
  const [bidIncrement, setBidIncrement] = useState<number>(minIncrement || 1000);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const [autoBidStatus, setAutoBidStatus] = useState<AutoBidStatus | null>(null);


  // 获取当前自动出价设置
  const fetchAutoBidStatus = useCallback(async (): Promise<void> => {
    try {
      const response = await fetch(`/api/v1/auto-bids/${auctionId}`, {
        method: 'GET',
        credentials: 'include'
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success && data.data.autoBid) {
          const autoBid = data.data.autoBid;
          setAutoBidStatus(autoBid);
          setIsEnabled(autoBid.isActive);
          setMaxAmount(autoBid.maxAmount.toString());
          setBidIncrement(autoBid.increment || minIncrement);
        }
      }
    } catch (err) {
      console.error('获取自动出价状态失败', err);
    }
  }, [auctionId, minIncrement]);

  useEffect(() => {
    fetchAutoBidStatus();
  }, [fetchAutoBidStatus]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      // 验证输入
      const maxAmountNum = parseFloat(maxAmount);
      const bidIncrementNum = bidIncrement;

      if (!maxAmountNum || maxAmountNum <= currentPrice) {
        setError('最高出价必须大于当前价格');
        setIsLoading(false);
        return;
      }

      if (!bidIncrementNum || bidIncrementNum < minIncrement) {
        setError(`出价增量不能少于 ${minIncrement}`);
        setIsLoading(false);
        return;
      }

      const response = await fetch(`/api/v1/auto-bids/${auctionId}`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          maxAmount: maxAmountNum,
          increment: bidIncrementNum,
          isActive: isEnabled
        })
      });

      const data = await response.json();

      if (data.success) {
        setSuccess(isEnabled ? '自动出价已启用' : '自动出价已禁用');
        setAutoBidStatus(data.data.autoBid);
        if (onAutoBidSet) {
          onAutoBidSet(data.data.autoBid);
        }
      } else {
        setError(data.error?.message || '设置失败');
      }
    } catch {
      setError('网络错误，请重试');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = async (): Promise<void> => {
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch(`/api/v1/auto-bids/${auctionId}`, {
        method: 'DELETE',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();

      if (data.success) {
        setSuccess('自动出价已取消');
        setAutoBidStatus(null);
        setIsEnabled(false);
        setMaxAmount('');
        setBidIncrement(minIncrement);
      } else {
        setError(data.error?.message || '取消失败');
      }
    } catch {
      setError('网络错误，请重试');
    } finally {
      setIsLoading(false);
    }
  };

  const calculateNextBid = (): number | null => {
    if (!maxAmount) return null;
    const nextBid = currentPrice + bidIncrement;
    return nextBid <= parseFloat(maxAmount) ? nextBid : null;
  };

  const getRemainingBids = (): number => {
    if (!maxAmount) return 0;
    const remaining = Math.floor((parseFloat(maxAmount) - currentPrice) / bidIncrement);
    return Math.max(0, remaining);
  };


  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="h-5 w-5" />
          自动出价设置
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* 当前状态显示 */}
        {autoBidStatus && (
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-medium text-blue-900">当前自动出价状态</h4>
              <Badge variant={autoBidStatus.isActive ? "default" : "secondary"}>
                {autoBidStatus.isActive ? "已启用" : "已禁用"}
              </Badge>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <Target className="h-4 w-4 text-blue-600" />
                <span>最高出价: ¥{autoBidStatus.maxAmount.toLocaleString()}</span>
              </div>
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-blue-600" />
                <span>增量: ¥{autoBidStatus.increment.toLocaleString()}</span>
              </div>
              <div className="flex items-center gap-2">
                <Timer className="h-4 w-4 text-blue-600" />
                <span>已出价: {autoBidStatus.totalBids} 次</span>
              </div>
              <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-blue-600" />
                <span>剩余次数: {getRemainingBids()} 次</span>
              </div>
            </div>
          </div>
        )}

        {/* 错误和成功消息 */}
        {error && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {success && (
          <Alert>
            <CheckCircle className="h-4 w-4" />
            <AlertDescription>{success}</AlertDescription>
          </Alert>
        )}

        {/* 设置表单 */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* 启用开关 */}
          <div className="flex items-center justify-between">
            <Label htmlFor="auto-bid-enabled" className="text-base font-medium">
              启用自动出价
            </Label>
            <Switch
              id="auto-bid-enabled"
              checked={isEnabled}
              onCheckedChange={setIsEnabled}
            />
          </div>

          <Separator />

          {/* 最高出价金额 */}
          <div className="space-y-2">
            <Label htmlFor="max-amount">最高出价金额 (¥)</Label>
            <Input
              id="max-amount"
              type="number"
              value={maxAmount}
              onChange={(e) => setMaxAmount(e.target.value)}
              placeholder={`最低 ${(currentPrice + minIncrement).toLocaleString()}`}
              min={currentPrice + minIncrement}
              step={minIncrement}
              disabled={!isEnabled}
              required
            />
            <p className="text-sm text-gray-500">
              当前价格: ¥{currentPrice.toLocaleString()}
            </p>
          </div>

          {/* 出价增量 */}
          <div className="space-y-2">
            <Label htmlFor="bid-increment">出价增量 (¥)</Label>
            <Input
              id="bid-increment"
              type="number"
              value={bidIncrement}
              onChange={(e) => setBidIncrement(parseFloat(e.target.value))}
              min={minIncrement}
              step={minIncrement}
              disabled={!isEnabled}
              required
            />
            <p className="text-sm text-gray-500">
              最小增量: ¥{minIncrement.toLocaleString()}
            </p>
          </div>

          {/* 预览信息 */}
          {isEnabled && maxAmount && (
            <div className="p-3 bg-gray-50 rounded-lg">
              <h4 className="font-medium mb-2">出价预览</h4>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span>下次出价:</span>
                  <span className="font-medium">
                    {calculateNextBid() ? 
                      `¥${calculateNextBid()?.toLocaleString()}` : 
                      '已达到最高出价'
                    }
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>剩余出价次数:</span>
                  <span className="font-medium">{getRemainingBids()} 次</span>
                </div>
                <div className="flex justify-between">
                  <span>总预算:</span>
                  <span className="font-medium">¥{parseFloat(maxAmount).toLocaleString()}</span>
                </div>
              </div>
            </div>
          )}

          {/* 操作按钮 */}
          <div className="flex gap-3">
            <Button 
              type="submit" 
              disabled={isLoading || !isEnabled}
              className="flex-1"
            >
              {isLoading ? '设置中...' : '保存设置'}
            </Button>
            
            {autoBidStatus && (
              <Button 
                type="button"
                variant="outline"
                onClick={handleCancel}
                disabled={isLoading}
                className="flex items-center gap-2"
              >
                <XCircle className="h-4 w-4" />
                取消自动出价
              </Button>
            )}
          </div>
        </form>

        {/* 说明信息 */}
        <div className="text-xs text-gray-500 space-y-1">
          <p>• 自动出价将在其他用户出价时自动为您出价</p>
          <p>• 系统会按照设定的增量逐步提高出价</p>
          <p>• 出价不会超过您设定的最高金额</p>
          <p>• 您可以随时取消或修改自动出价设置</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default AutoBid;
