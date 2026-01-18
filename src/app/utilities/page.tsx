'use client';

import React, { useState } from 'react';
import { MapPin, CheckCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface Provider {
  id: string;
  name: string;
  country: string;
  region: string;
  logo: string;
  supportedCurrencies: string[];
  processingTime: string;
  fees: string;
}

interface BillData {
  accountNumber: string;
  customerName: string;
  provider: string;
  billingPeriod: string;
  dueDate: string;
  amount: number;
  currency: string;
  usage: number;
  unit: string;
  status: string;
  currentCharges?: number;
}

interface PaymentData {
  transactionId: string;
  status: string;
  amount: number;
  currency: string;
  timestamp: string;
  provider: string;
  accountNumber: string;
  method?: string;
}

const UtilitiesPage = () => {
  const { t } = useTranslation();
  const [currentView, setCurrentView] = useState('search'); // search, results, payment, confirmation
  const [searchParams, setSearchParams] = useState({
    country: '',
    region: '',
    provider: '',
    accountNumber: '',
    customerName: '',
  });
  const [providers, setProviders] = useState<Provider[]>([]);
  const [selectedProvider, setSelectedProvider] = useState<Provider | null>(null);
  const [billData, setBillData] = useState<BillData | null>(null);
  const [paymentData, setPaymentData] = useState<PaymentData | null>(null);
  const [loading, setLoading] = useState(false);

  // 模拟电力公司数据
  const mockProviders = [
    {
      id: 'sgp-001',
      name: t('utilities_page.providers.singapore'),
      country: t('utilities_page.countries.singapore'),
      region: t('utilities_page.regions.nationwide'),
      logo: '⚡',
      supportedCurrencies: ['QAU', 'USDT', 'ETH'],
      processingTime: t('utilities_page.processing.instant'),
      fees: '0.5%',
    },
    {
      id: 'usa-001',
      name: 'Pacific Gas & Electric',
      country: t('utilities_page.countries.usa'),
      region: t('utilities_page.regions.california'),
      logo: '🔌',
      supportedCurrencies: ['QAU', 'USDT', 'BTC'],
      processingTime: t('utilities_page.processing.one_to_three'),
      fees: '0.8%',
    },
    {
      id: 'chn-001',
      name: t('utilities_page.providers.china_grid'),
      country: t('utilities_page.countries.china'),
      region: t('utilities_page.regions.nationwide'),
      logo: '🏭',
      supportedCurrencies: ['QAU', 'USDT'],
      processingTime: t('utilities_page.processing.instant'),
      fees: '0.3%',
    },
    {
      id: 'jpn-001',
      name: t('utilities_page.providers.tokyo_electric'),
      country: t('utilities_page.countries.japan'),
      region: t('utilities_page.regions.kanto'),
      logo: '🔋',
      supportedCurrencies: ['QAU', 'USDT', 'ETH'],
      processingTime: t('utilities_page.processing.one_to_two'),
      fees: '0.6%',
    },
  ];

  // 搜索电力公司
  const searchProviders = () => {
    setLoading(true);
    setTimeout(() => {
      const filtered = mockProviders.filter(
        (provider) =>
          (!searchParams.country || provider.country.includes(searchParams.country)) &&
          (!searchParams.region || provider.region.includes(searchParams.region))
      );
      setProviders(filtered);
      setCurrentView('results');
      setLoading(false);
    }, 1000);
  };

  // 查询账单
  const queryBill = async (provider: Provider) => {
    setLoading(true);
    setSelectedProvider(provider);

    setTimeout(() => {
      // 模拟账单数据
      setBillData({
        accountNumber: searchParams.accountNumber,
        customerName: searchParams.customerName,
        provider: provider.name,
        billingPeriod: '2024年6月',
        dueDate: '2024-06-15',
        amount: Math.floor(Math.random() * 500) + 100,
        currency: 'USD',
        usage: Math.floor(Math.random() * 1000) + 200,
        unit: 'kWh',
        status: 'pending',
      });
      setCurrentView('payment');
      setLoading(false);
    }, 1500);
  };

  // 处理支付
  const processPayment = (_paymentMethod: string) => {
    setLoading(true);
    if (!billData) return;
    setPaymentData({
      transactionId: 'TX' + Date.now(),
      status: 'completed',
      amount: billData.amount || 0,
      currency: 'USD',
      timestamp: new Date().toISOString(),
      provider: selectedProvider?.name || '',
      accountNumber: billData.accountNumber,
    });

    setTimeout(() => {
      setCurrentView('confirmation');
      setLoading(false);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 text-white">
      <div className="container mx-auto px-4 py-8">
        {/* 页面标题 */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
            ⚡ {t('utilities_page.title')}
          </h1>
          <p className="text-gray-300 text-lg">{t('utilities_page.subtitle')}</p>
        </div>

        {/* 搜索界面 */}
        {currentView === 'search' && (
          <div className="max-w-2xl mx-auto">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 p-8">
              <h2 className="text-2xl font-semibold mb-6 text-center">
                {t('utilities_page.find_provider')}
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    {t('utilities_page.form.country')}
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      value={searchParams.country}
                      onChange={(e) =>
                        setSearchParams({ ...searchParams, country: e.target.value })
                      }
                      placeholder={t('utilities_page.form.country_placeholder')}
                      className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    {t('utilities_page.form.region')}
                  </label>
                  <input
                    type="text"
                    value={searchParams.region}
                    onChange={(e) => setSearchParams({ ...searchParams, region: e.target.value })}
                    placeholder={t('utilities_page.form.region_placeholder')}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    {t('utilities_page.form.account_number')}
                  </label>
                  <input
                    type="text"
                    value={searchParams.accountNumber}
                    onChange={(e) =>
                      setSearchParams({ ...searchParams, accountNumber: e.target.value })
                    }
                    placeholder={t('utilities_page.form.account_placeholder')}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    {t('utilities_page.form.customer_name')}
                  </label>
                  <input
                    type="text"
                    value={searchParams.customerName}
                    onChange={(e) =>
                      setSearchParams({ ...searchParams, customerName: e.target.value })
                    }
                    placeholder={t('utilities_page.form.customer_placeholder')}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  />
                </div>

                <button
                  onClick={searchProviders}
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 disabled:opacity-50"
                >
                  {loading ? t('utilities_page.searching') : t('utilities_page.search_providers')}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 电力公司列表 */}
        {currentView === 'results' && (
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold">
                {t('utilities_page.found_providers', { count: providers.length })}
              </h2>
              <button
                onClick={() => setCurrentView('search')}
                className="bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg transition-all duration-200"
              >
                {t('utilities_page.search_again')}
              </button>
            </div>

            <div className="grid gap-6">
              {providers.map((provider) => (
                <div
                  key={provider.id}
                  className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 p-6"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="text-4xl">{provider.logo}</div>
                      <div>
                        <h3 className="text-xl font-semibold">{provider.name}</h3>
                        <p className="text-gray-300">
                          {provider.country} - {provider.region}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => queryBill(provider)}
                      disabled={!searchParams.accountNumber || !searchParams.customerName}
                      className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white font-semibold py-2 px-6 rounded-lg transition-all duration-200 disabled:opacity-50"
                    >
                      {t('utilities_page.query_bill')}
                    </button>
                  </div>

                  <div className="mt-4 grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="text-gray-400">
                        {t('utilities_page.supported_currencies')}:
                      </span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {provider.supportedCurrencies.map((currency) => (
                          <span
                            key={currency}
                            className="bg-yellow-500/20 text-yellow-400 px-2 py-1 rounded"
                          >
                            {currency}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <span className="text-gray-400">{t('utilities_page.processing_time')}:</span>
                      <p className="text-white">{provider.processingTime}</p>
                    </div>
                    <div>
                      <span className="text-gray-400">{t('utilities_page.fees')}:</span>
                      <p className="text-white">{provider.fees}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 账单支付界面 */}
        {currentView === 'payment' && billData && (
          <div className="max-w-2xl mx-auto">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 p-8">
              <h2 className="text-2xl font-semibold mb-6 text-center">
                {t('utilities_page.electricity_bill')}
              </h2>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-400">{t('utilities_page.bill.provider')}:</span>
                  <span>{billData.provider}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">{t('utilities_page.bill.account')}:</span>
                  <span>{billData.accountNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">{t('utilities_page.bill.customer')}:</span>
                  <span>{billData.customerName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">{t('utilities_page.bill.period')}:</span>
                  <span>{billData.billingPeriod}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">{t('utilities_page.bill.usage')}:</span>
                  <span>
                    {billData.usage} {billData.unit}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">{t('utilities_page.bill.due_date')}:</span>
                  <span>{billData.dueDate}</span>
                </div>
                <div className="flex justify-between text-xl font-semibold">
                  <span>{t('utilities_page.bill.amount_due')}:</span>
                  <span className="text-yellow-400">
                    ${billData.amount} {billData.currency}
                  </span>
                </div>
              </div>

              <div className="border-t border-white/20 pt-6">
                <h3 className="text-lg font-semibold mb-4">{t('utilities_page.select_payment')}</h3>
                <div className="grid gap-3">
                  {selectedProvider?.supportedCurrencies.map((currency) => (
                    <button
                      key={currency}
                      onClick={() => processPayment(currency)}
                      className="flex items-center justify-between p-4 bg-white/5 hover:bg-white/10 border border-white/20 rounded-lg transition-all duration-200"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full flex items-center justify-center text-sm font-bold">
                          {currency.charAt(0)}
                        </div>
                        <span>{currency}</span>
                      </div>
                      <span className="text-gray-400">
                        {t('utilities_page.fees')}: {selectedProvider?.fees}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={() => setCurrentView('results')}
                className="w-full mt-6 bg-white/10 hover:bg-white/20 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200"
              >
                {t('utilities_page.back')}
              </button>
            </div>
          </div>
        )}

        {/* 支付确认界面 */}
        {currentView === 'confirmation' && paymentData && (
          <div className="max-w-2xl mx-auto">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 p-8 text-center">
              <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
              <h2 className="text-2xl font-semibold mb-6">{t('utilities_page.payment_success')}</h2>

              <div className="space-y-4 mb-6 text-left">
                <div className="flex justify-between">
                  <span className="text-gray-400">
                    {t('utilities_page.confirmation.transaction_id')}:
                  </span>
                  <span className="font-mono">{paymentData.transactionId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">
                    {t('utilities_page.confirmation.payment_method')}:
                  </span>
                  <span>{paymentData.method}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">{t('utilities_page.confirmation.amount')}:</span>
                  <span>
                    ${paymentData.amount} {paymentData.currency}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">{t('utilities_page.confirmation.time')}:</span>
                  <span>{new Date(paymentData.timestamp).toLocaleString()}</span>
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={() => setCurrentView('search')}
                  className="flex-1 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200"
                >
                  {t('utilities_page.continue_payment')}
                </button>
                <button className="flex-1 bg-white/10 hover:bg-white/20 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200">
                  {t('utilities_page.download_receipt')}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 加载状态 */}
        {loading && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 p-8 text-center">
              <div className="animate-spin w-8 h-8 border-2 border-yellow-500 border-t-transparent rounded-full mx-auto mb-4"></div>
              <p className="text-white">{t('utilities_page.processing')}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UtilitiesPage;
