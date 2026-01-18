import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';

interface PaymentMethod {
  id: string;
  name: string;
  type: 'crypto' | 'bank' | 'card' | 'wallet';
  icon: string;
  description: string;
  fee: number;
  processingTime: string;
  available: boolean;
}

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  amount: number;
  type: 'deposit' | 'bid_payment' | 'final_payment';
  auctionId?: string;
  onPaymentSuccess: (paymentId: string, transactionHash?: string) => void;
  onPaymentError: (error: string) => void;
}

const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  onClose,
  amount,
  type,
  auctionId,
  onPaymentSuccess,
  onPaymentError,
}) => {
  interface PaymentDetails {
    address?: string;
    cryptoAmount?: string;
    qrCode?: string;
    transactionId?: string;
  }

  const [selectedMethod, setSelectedMethod] = useState<string>('');
  const [step, setStep] = useState<'select' | 'details' | 'processing' | 'success' | 'error'>(
    'select'
  );
  const [loading, setLoading] = useState(false);
  const [paymentDetails, setPaymentDetails] = useState<PaymentDetails>({});
  const [transactionId, setTransactionId] = useState<string>('');
  const [qrCode, setQrCode] = useState<string>('');
  const [countdown, setCountdown] = useState<number>(600); // 10分钟倒计时
  const paymentMethods: PaymentMethod[] = [
    {
      id: 'usdt_trc20',
      name: 'USDT (TRC20)',
      type: 'crypto',
      icon: '💵',
      description: '使用USDT支付，快速到账',
      fee: 0,
      processingTime: '1-5分钟',
      available: true,
    },
    {
      id: 'eth',
      name: 'Ethereum (ETH)',
      type: 'crypto',
      icon: 'Ξ',
      description: '使用以太坊支付',
      fee: 0.002,
      processingTime: '5-15分钟',
      available: true,
    },
    {
      id: 'btc',
      name: 'Bitcoin (BTC)',
      type: 'crypto',
      icon: '₿',
      description: '使用比特币支付',
      fee: 0.0001,
      processingTime: '10-30分钟',
      available: true,
    },
    {
      id: 'bank_transfer',
      name: '银行转账',
      type: 'bank',
      icon: '🏦',
      description: '通过银行转账支付',
      fee: 0,
      processingTime: '1-3个工作日',
      available: false, // 暂时不可用
    },
    {
      id: 'credit_card',
      name: '信用卡',
      type: 'card',
      icon: '💳',
      description: '使用信用卡支付',
      fee: 0.03, // 3%手续费
      processingTime: '即时',
      available: false, // 暂时不可用
    },
  ];

  // 倒计时效果
  useEffect(() => {
    if (step === 'details' && countdown > 0) {
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            setStep('error');
            onPaymentError('支付超时，请重新发起支付');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [step, countdown, onPaymentError]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const getPaymentTitle = () => {
    switch (type) {
      case 'deposit':
        return '账户充值';
      case 'bid_payment':
        return '出价保证金';
      case 'final_payment':
        return '最终付款';
      default:
        return '支付';
    }
  };

  const calculateFee = (method: PaymentMethod) => {
    return method.fee * amount;
  };

  const calculateTotal = (method: PaymentMethod) => {
    return amount + calculateFee(method);
  };

  const handleMethodSelect = (methodId: string) => {
    setSelectedMethod(methodId);
  };

  const handleProceedToPayment = async () => {
    if (!selectedMethod) return;

    setLoading(true);
    try {
      // 模拟创建支付订单
      const response = await fetch('/api/v1/payments/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          amount,
          paymentMethod: selectedMethod,
          type,
          auctionId,
        }),
      });

      const result = await response.json();

      if (result.success) {
        setPaymentDetails(result.data);
        setTransactionId(result.data.transactionId);

        // 如果是加密货币支付，生成二维码
        if (result.data.qrCode) {
          setQrCode(result.data.qrCode);
        }

        setStep('details');
        setCountdown(600); // 重置倒计时
      } else {
        throw new Error(result.error.message);
      }
    } catch (error) {
      onPaymentError(error instanceof Error ? error.message : '创建支付订单失败');
      setStep('error');
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmPayment = async () => {
    setStep('processing');

    try {
      // 模拟支付确认
      await new Promise((resolve) => setTimeout(resolve, 3000));

      // 检查支付状态
      const response = await fetch(`/api/v1/payments/${transactionId}/status`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      const result = await response.json();

      if (result.success && result.data.status === 'completed') {
        setStep('success');
        onPaymentSuccess(transactionId, result.data.transactionHash);
      } else {
        throw new Error('支付未完成，请稍后重试');
      }
    } catch (error) {
      setStep('error');
      onPaymentError(error instanceof Error ? error.message : '支付确认失败');
    }
  };

  const selectedMethodData = paymentMethods.find((m) => m.id === selectedMethod);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="bg-white rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto"
        >
          {/* 头部 */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">{getPaymentTitle()}</h2>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {/* 金额显示 */}
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <div className="text-center">
                <div className="text-sm text-gray-600">支付金额</div>
                <div className="text-2xl font-bold text-gray-900">¥{amount.toLocaleString()}</div>
              </div>
            </div>
          </div>

          {/* 内容区域 */}
          <div className="p-6">
            <AnimatePresence mode="wait">
              {step === 'select' && (
                <motion.div
                  key="select"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  <h3 className="text-lg font-semibold mb-4">选择支付方式</h3>

                  <div className="space-y-3">
                    {paymentMethods.map((method) => (
                      <div
                        key={method.id}
                        className={`border rounded-lg p-4 cursor-pointer transition-all ${
                          !method.available
                            ? 'opacity-50 cursor-not-allowed bg-gray-50'
                            : selectedMethod === method.id
                              ? 'border-blue-500 bg-blue-50'
                              : 'border-gray-200 hover:border-gray-300'
                        }`}
                        onClick={() => method.available && handleMethodSelect(method.id)}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="text-2xl">{method.icon}</div>
                            <div>
                              <div className="font-medium text-gray-900">
                                {method.name}
                                {!method.available && (
                                  <span className="ml-2 text-xs text-gray-500">(暂不可用)</span>
                                )}
                              </div>
                              <div className="text-sm text-gray-600">{method.description}</div>
                              <div className="text-xs text-gray-500">
                                手续费:{' '}
                                {method.fee === 0 ? '免费' : `${(method.fee * 100).toFixed(1)}%`} |
                                到账时间: {method.processingTime}
                              </div>
                            </div>
                          </div>

                          {method.available && (
                            <div
                              className={`w-4 h-4 rounded-full border-2 ${
                                selectedMethod === method.id
                                  ? 'border-blue-500 bg-blue-500'
                                  : 'border-gray-300'
                              }`}
                            >
                              {selectedMethod === method.id && (
                                <div className="w-full h-full rounded-full bg-white scale-50"></div>
                              )}
                            </div>
                          )}
                        </div>

                        {selectedMethod === method.id && method.fee > 0 && (
                          <div className="mt-3 pt-3 border-t border-gray-200">
                            <div className="flex justify-between text-sm">
                              <span>支付金额:</span>
                              <span>¥{amount.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span>手续费:</span>
                              <span>¥{calculateFee(method).toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between text-sm font-semibold border-t border-gray-200 pt-2 mt-2">
                              <span>总计:</span>
                              <span>¥{calculateTotal(method).toLocaleString()}</span>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={handleProceedToPayment}
                    disabled={!selectedMethod || loading}
                    className="w-full mt-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {loading ? '创建订单中...' : '确认支付'}
                  </button>
                </motion.div>
              )}

              {step === 'details' && selectedMethodData && (
                <motion.div
                  key="details"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  <div className="text-center mb-6">
                    <h3 className="text-lg font-semibold mb-2">完成支付</h3>
                    <div className="text-red-600 font-medium">
                      剩余时间: {formatTime(countdown)}
                    </div>
                  </div>

                  {selectedMethodData.type === 'crypto' && (
                    <div className="space-y-4">
                      {/* 二维码 */}
                      {qrCode && (
                        <div className="text-center">
                          <div className="inline-block p-4 bg-white border rounded-lg">
                            <Image
                              src={qrCode}
                              alt="Payment QR Code"
                              width={192}
                              height={192}
                              className="w-48 h-48"
                            />
                          </div>
                          <div className="text-sm text-gray-600 mt-2">扫描二维码完成支付</div>
                        </div>
                      )}

                      {/* 支付地址 */}
                      <div className="bg-gray-50 rounded-lg p-4">
                        <div className="text-sm text-gray-600 mb-2">支付地址:</div>
                        <div className="font-mono text-sm bg-white p-2 rounded border break-all">
                          {paymentDetails.address}
                        </div>
                        <button
                          onClick={() =>
                            paymentDetails.address &&
                            navigator.clipboard.writeText(paymentDetails.address)
                          }
                          className="mt-2 text-blue-600 hover:text-blue-800 text-sm"
                        >
                          复制地址
                        </button>
                      </div>

                      {/* 支付金额 */}
                      <div className="bg-gray-50 rounded-lg p-4">
                        <div className="text-sm text-gray-600 mb-2">支付金额:</div>
                        <div className="font-mono text-lg font-bold">
                          {paymentDetails.cryptoAmount} {selectedMethodData.name.split(' ')[0]}
                        </div>
                      </div>

                      {/* 注意事项 */}
                      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                        <div className="text-sm text-yellow-800">
                          <div className="font-medium mb-2">⚠️ 重要提醒:</div>
                          <ul className="list-disc list-inside space-y-1">
                            <li>请确保转账金额完全一致</li>
                            <li>仅支持{selectedMethodData.name}网络</li>
                            <li>转账完成后请点击&quot;我已完成支付&quot;</li>
                            <li>请在{formatTime(countdown)}内完成支付</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  )}

                  <button
                    onClick={handleConfirmPayment}
                    className="w-full mt-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    我已完成支付
                  </button>
                </motion.div>
              )}

              {step === 'processing' && (
                <motion.div
                  key="processing"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="text-center py-8"
                >
                  <div className="animate-spin w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
                  <h3 className="text-lg font-semibold mb-2">正在确认支付</h3>
                  <p className="text-gray-600">请稍候，我们正在验证您的支付...</p>
                </motion.div>
              )}

              {step === 'success' && (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="text-center py-8"
                >
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg
                      className="w-8 h-8 text-green-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold mb-2 text-green-600">支付成功!</h3>
                  <p className="text-gray-600 mb-4">您的支付已确认，交易ID: {transactionId}</p>
                  <button
                    onClick={onClose}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    完成
                  </button>
                </motion.div>
              )}

              {step === 'error' && (
                <motion.div
                  key="error"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="text-center py-8"
                >
                  <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg
                      className="w-8 h-8 text-red-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold mb-2 text-red-600">支付失败</h3>
                  <p className="text-gray-600 mb-4">支付过程中出现问题，请重试</p>
                  <div className="space-x-3">
                    <button
                      onClick={() => setStep('select')}
                      className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                    >
                      重新支付
                    </button>
                    <button
                      onClick={onClose}
                      className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      关闭
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default PaymentModal;
