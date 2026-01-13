'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/Card';
import { Button } from './ui/Button';
import { Badge } from './ui/Badge';
import { Alert, AlertDescription } from './ui/Alert';
import { Progress } from './ui/progress';
import { Separator } from './ui/Separator';
import { 
  CreditCard, 
  Shield, 
  CheckCircle, 
  AlertTriangle, 
  Clock,
  DollarSign,
  Loader2,
  ExternalLink
} from 'lucide-react';

// 支付类型
type PaymentType = 'deposit' | 'final_payment' | 'buy_now';

// 支付数据类型
interface PaymentData {
  baseAmount: number;
  platformFee: number;
  totalAmount: number;
  currency: string;
}

// 支付完成回调数据
interface PaymentCompleteData {
  txHash: string;
  amount: number;
  type: PaymentType;
}

// 组件属性类型
interface PaymentFlowProps {
  auctionId: string;
  paymentType: PaymentType;
  amount: number;
  walletAddress: string;
  onPaymentComplete?: (data: PaymentCompleteData) => void;
  onPaymentCancel?: () => void;
}

// 步骤类型
interface Step {
  id: number;
  title: string;
  description: string;
}

// 支付类型配置
interface PaymentTypeConfig {
  title: string;
  description: string;
  color: string;
}

// 使用类型断言访问 ethereum，避免重复声明 Window 接口
// ethereum 属性已在其他文件中声明


const PaymentFlow: React.FC<PaymentFlowProps> = ({ 
  auctionId, 
  paymentType,
  amount, 
  walletAddress,
  onPaymentComplete,
  onPaymentCancel 
}) => {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [txHash, setTxHash] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [paymentData, setPaymentData] = useState<PaymentData | null>(null);

  const steps: Step[] = [
    { id: 1, title: '确认支付', description: '确认支付金额和详情' },
    { id: 2, title: '钱包授权', description: '在钱包中确认交易' },
    { id: 3, title: '交易确认', description: '等待区块链确认' },
    { id: 4, title: '支付完成', description: '支付成功完成' }
  ];

  const paymentTypes: Record<PaymentType, PaymentTypeConfig> = {
    deposit: { 
      title: '保证金支付', 
      description: '支付拍卖保证金以参与竞拍',
      color: 'blue'
    },
    final_payment: { 
      title: '最终付款', 
      description: '支付拍卖成功后的剩余金额',
      color: 'green'
    },
    buy_now: { 
      title: '一口价购买', 
      description: '立即以一口价购买此节点',
      color: 'purple'
    }
  };

  const calculatePaymentDetails = useCallback((): void => {
    const platformFeeRate = 0.025; // 2.5%
    const platformFee = amount * platformFeeRate;
    const totalAmount = amount + platformFee;

    setPaymentData({
      baseAmount: amount,
      platformFee: platformFee,
      totalAmount: totalAmount,
      currency: 'ETH'
    });
  }, [amount]);

  useEffect(() => {
    if (paymentType && amount) {
      calculatePaymentDetails();
    }
  }, [paymentType, amount, calculatePaymentDetails]);

  const waitForTransactionConfirmation = async (hash: string): Promise<unknown> => {
    return new Promise((resolve, reject) => {
      const checkTransaction = async (): Promise<void> => {
        try {
          const receipt = await window.ethereum?.request({
            method: 'eth_getTransactionReceipt',
            params: [hash],
          }) as { status?: string } | null;

          if (receipt) {
            if (receipt.status === '0x1') {
              resolve(receipt);
            } else {
              reject(new Error('交易失败'));
            }
          } else {
            setTimeout(checkTransaction, 2000);
          }
        } catch (err) {
          reject(err);
        }
      };

      checkTransaction();
    });
  };

  const notifyPaymentComplete = async (hash: string): Promise<void> => {
    if (!paymentData) return;
    
    try {
      const response = await fetch(`/api/v1/payments/${auctionId}`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          txHash: hash,
          amount: paymentData.totalAmount,
          type: paymentType,
          walletAddress
        })
      });

      if (!response.ok) {
        throw new Error('通知后端失败');
      }
    } catch (err) {
      console.error('通知后端支付完成失败:', err);
    }
  };

  const handlePayment = async (): Promise<void> => {
    if (!window.ethereum || !walletAddress || !paymentData) {
      setError('请先连接钱包');
      return;
    }

    setIsProcessing(true);
    setError('');
    setCurrentStep(2);

    try {
      const transactionParams = {
        from: walletAddress,
        to: process.env.REACT_APP_CONTRACT_ADDRESS,
        value: `0x${(paymentData.totalAmount * Math.pow(10, 18)).toString(16)}`,
        gas: '0x5208',
        gasPrice: '0x4a817c800'
      };

      const hash = await window.ethereum.request({
        method: 'eth_sendTransaction',
        params: [transactionParams],
      }) as string;

      setTxHash(hash);
      setCurrentStep(3);

      await waitForTransactionConfirmation(hash);
      await notifyPaymentComplete(hash);

      setCurrentStep(4);
      
      if (onPaymentComplete) {
        onPaymentComplete({
          txHash: hash,
          amount: paymentData.totalAmount,
          type: paymentType
        });
      }

    } catch (err) {
      console.error('支付失败:', err);
      const error = err as { code?: number; message?: string };
      
      if (error.code === 4001) {
        setError('用户取消了交易');
      } else if (error.code === -32603) {
        setError('交易失败，请检查余额是否充足');
      } else {
        setError('支付失败: ' + (error.message || '未知错误'));
      }
      
      setCurrentStep(1);
    } finally {
      setIsProcessing(false);
    }
  };

  const getStepIcon = (stepId: number): React.ReactNode => {
    if (stepId < currentStep) {
      return <CheckCircle className="h-5 w-5 text-green-500" />;
    } else if (stepId === currentStep) {
      return isProcessing ? 
        <Loader2 className="h-5 w-5 text-blue-500 animate-spin" /> :
        <div className="h-5 w-5 rounded-full bg-blue-500 text-white flex items-center justify-center text-xs font-bold">{stepId}</div>;
    } else {
      return <div className="h-5 w-5 rounded-full bg-gray-300 text-gray-600 flex items-center justify-center text-xs font-bold">{stepId}</div>;
    }
  };

  const currentPaymentType = paymentTypes[paymentType];


  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="h-5 w-5" />
          {currentPaymentType?.title || '支付流程'}
          <Badge variant="outline" className={`ml-auto text-${currentPaymentType?.color}-600`}>
            {paymentType}
          </Badge>
        </CardTitle>
        <p className="text-sm text-gray-600">
          {currentPaymentType?.description}
        </p>
      </CardHeader>

      <CardContent className="space-y-6">
        {error && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {paymentData && (
          <div className="p-4 bg-gray-50 rounded-lg">
            <h4 className="font-medium mb-3">支付详情</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>基础金额:</span>
                <span className="font-medium">{paymentData.baseAmount.toFixed(4)} {paymentData.currency}</span>
              </div>
              <div className="flex justify-between">
                <span>平台手续费(2.5%):</span>
                <span className="font-medium">{paymentData.platformFee.toFixed(4)} {paymentData.currency}</span>
              </div>
              <Separator />
              <div className="flex justify-between text-base font-semibold">
                <span>总计:</span>
                <span>{paymentData.totalAmount.toFixed(4)} {paymentData.currency}</span>
              </div>
            </div>
          </div>
        )}

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">支付进度</span>
            <span className="text-sm text-gray-500">{currentStep}/4</span>
          </div>
          
          <Progress value={(currentStep / 4) * 100} className="h-2" />
          
          <div className="space-y-3">
            {steps.map((step) => (
              <div key={step.id} className="flex items-center gap-3">
                {getStepIcon(step.id)}
                <div className="flex-1">
                  <div className={`text-sm font-medium ${
                    step.id <= currentStep ? 'text-gray-900' : 'text-gray-500'
                  }`}>
                    {step.title}
                  </div>
                  <div className="text-xs text-gray-500">
                    {step.description}
                  </div>
                </div>
                {step.id === currentStep && isProcessing && (
                  <div className="text-xs text-blue-600">处理中...</div>
                )}
              </div>
            ))}
          </div>
        </div>

        {txHash && (
          <div className="p-3 bg-blue-50 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Shield className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-900">交易哈希</span>
            </div>
            <div className="font-mono text-xs text-blue-800 break-all">
              {txHash}
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="mt-2 h-6 px-2 text-blue-600"
              onClick={() => window.open(`https://etherscan.io/tx/${txHash}`, '_blank')}
            >
              <ExternalLink className="h-3 w-3 mr-1" />
              在区块浏览器中查看
            </Button>
          </div>
        )}

        <div className="flex gap-3">
          {currentStep === 1 && (
            <>
              <Button 
                onClick={handlePayment}
                disabled={isProcessing || !paymentData}
                className="flex-1"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    处理中...
                  </>
                ) : (
                  <>
                    <DollarSign className="h-4 w-4 mr-2" />
                    确认支付
                  </>
                )}
              </Button>
              <Button 
                variant="outline" 
                onClick={onPaymentCancel}
                disabled={isProcessing}
              >
                取消
              </Button>
            </>
          )}
          
          {currentStep === 4 && paymentData && (
            <Button 
              onClick={() => onPaymentComplete && onPaymentComplete({ txHash, amount: paymentData.totalAmount, type: paymentType })}
              className="flex-1"
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              完成
            </Button>
          )}
          
          {currentStep > 1 && currentStep < 4 && (
            <div className="flex-1 flex items-center justify-center text-sm text-gray-500">
              <Clock className="h-4 w-4 mr-2" />
              请等待交易确认...
            </div>
          )}
        </div>

        <div className="text-xs text-gray-500 space-y-1">
          <div className="flex items-center gap-1">
            <Shield className="h-3 w-3" />
            <span>您的支付通过区块链安全处理</span>
          </div>
          <p>• 交易一旦确认将无法撤销</p>
          <p>• 请确保钱包地址和金额正确</p>
          <p>• 交易可能需要几分钟时间确认</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default PaymentFlow;
