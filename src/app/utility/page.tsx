'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Zap, CreditCard, Lightbulb, Leaf, BarChart3, TrendingUp, Clock, Search } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import '../../i18n';

// Type definitions
interface BoundAccount {
  binding_id: string;
  provider_id: string;
  account_number: string;
  [key: string]: unknown;
}

interface Bill {
  bill_id: string;
  billing_period: { start_date: string; end_date: string };
  usage_details: { total_kwh: number };
  charges: { total_amount: number };
  payment_info: { due_date: string; payment_status: string };
}

interface UsageAnalysis {
  [key: string]: unknown;
}

interface SmartMeterData {
  [key: string]: unknown;
}

interface Provider {
  provider_id: string;
  name: string;
  country: string;
  region: string;
  logo_url: string;
  service_areas: string[];
  services: string[];
  quantum_security: boolean;
  contact_info: { phone: string };
}

const UtilityBillPage = () => {
  const { t } = useTranslation();
  const [currentView, setCurrentView] = useState('dashboard'); // dashboard, providers, bills, payment, analysis, smart-meter
  const [selectedProvider, setSelectedProvider] = useState<Provider | null>(null);
  const [boundAccounts, setBoundAccounts] = useState<BoundAccount[]>([]);
  const [bills, setBills] = useState<Bill[]>([]);
  const [usageAnalysis, setUsageAnalysis] = useState<UsageAnalysis | null>(null);
  const [smartMeterData, setSmartMeterData] = useState<SmartMeterData | null>(null);
  const [loading, setLoading] = useState(false);

  // 获取电力公司列表
  const getUtilityProviders = async (country = '', region = '') => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (country) params.append('country', country);
      if (region) params.append('region', region);
      
      const response = await fetch(`/api/utility/providers?${params}`);
      const data = await response.json();
      
      if (data.success) {
        return data.data.providers;
      }
    } catch (error) {
      console.error('获取电力公司失败:', error);
    }
    setLoading(false);
    return [];
  };

  // 绑定电力账户
  const bindUtilityAccount = async (providerData: Record<string, unknown>) => {
    try {
      const response = await fetch('/api/utility/account/bind', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(providerData)
      });
      
      const data = await response.json();
      if (data.success) {
        setBoundAccounts([...boundAccounts, data.data]);
        return data.data;
      }
    } catch (error) {
      console.error('绑定账户失败:', error);
    }
    return null;
  };

  // 获取电费账单
  const getUtilityBills = async (bindingId: string) => {
    try {
      const response = await fetch(`/api/utility/bills?binding_id=${bindingId}`);
      const data = await response.json();
      
      if (data.success) {
        setBills(data.data.bills);
        return data.data;
      }
    } catch (error) {
      console.error('获取账单失败:', error);
    }
    return null;
  };

  // 缴纳电费
  const payUtilityBill = async (billId: string, amount: number, method = 'QAU Token') => {
    try {
      const response = await fetch('/api/utility/payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bill_id: billId,
          payment_amount: amount,
          payment_method: method
        })
      });
      
      const data = await response.json();
      if (data.success) {
        return data.data;
      }
    } catch (error) {
      console.error('缴费失败:', error);
    }
    return null;
  };

  // 获取用电分析
  const getUsageAnalysis = async (bindingId: string, period = '12months') => {
    try {
      const response = await fetch(`/api/utility/usage/analysis?binding_id=${bindingId}&period=${period}`);
      const data = await response.json();
      
      if (data.success) {
        setUsageAnalysis(data.data);
        return data.data;
      }
    } catch (error) {
      console.error('获取用电分析失败:', error);
    }
    return null;
  };

  // 获取智能电表数据
  const getSmartMeterData = async (bindingId: string, date: string) => {
    try {
      const response = await fetch(`/api/utility/smart-meter?binding_id=${bindingId}&date=${date}`);
      const data = await response.json();
      
      if (data.success) {
        setSmartMeterData(data.data);
        return data.data;
      }
    } catch (error) {
      console.error('获取智能电表数据失败:', error);
    }
    return null;
  };

  // 渲染仪表板
  const renderDashboard = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">{t('utility.title')}</h1>
        <p className="text-gray-600">{t('utility.subtitle')}</p>
      </div>

      {/* 快速统计 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-full">
              <Zap className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">{t('utility.stats.monthly_usage')}</p>
              <p className="text-2xl font-bold text-gray-900">450.5 kWh</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-full">
              <CreditCard className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">{t('utility.stats.monthly_bill')}</p>
              <p className="text-2xl font-bold text-gray-900">359.00 QAU</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="p-3 bg-yellow-100 rounded-full">
              <TrendingUp className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">{t('utility.stats.vs_last_month')}</p>
              <p className="text-2xl font-bold text-gray-900">+7.1%</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="p-3 bg-purple-100 rounded-full">
              <Leaf className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">{t('utility.stats.carbon_footprint')}</p>
              <p className="text-2xl font-bold text-gray-900">225.8 kg</p>
            </div>
          </div>
        </div>
      </div>

      {/* 快速操作 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div 
          className="bg-white rounded-lg shadow-md p-6 cursor-pointer hover:shadow-lg transition-shadow"
          onClick={() => setCurrentView('providers')}
        >
          <div className="text-center">
            <div className="p-4 bg-blue-100 rounded-full w-16 h-16 mx-auto mb-4">
              <Search className="h-8 w-8 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold mb-2">{t('utility.actions.bind_account')}</h3>
            <p className="text-gray-600">{t('utility.actions.bind_account_desc')}</p>
          </div>
        </div>

        <div 
          className="bg-white rounded-lg shadow-md p-6 cursor-pointer hover:shadow-lg transition-shadow"
          onClick={() => setCurrentView('bills')}
        >
          <div className="text-center">
            <div className="p-4 bg-green-100 rounded-full w-16 h-16 mx-auto mb-4">
              <CreditCard className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold mb-2">{t('utility.actions.view_bills')}</h3>
            <p className="text-gray-600">{t('utility.actions.view_bills_desc')}</p>
          </div>
        </div>

        <div 
          className="bg-white rounded-lg shadow-md p-6 cursor-pointer hover:shadow-lg transition-shadow"
          onClick={() => setCurrentView('analysis')}
        >
          <div className="text-center">
            <div className="p-4 bg-purple-100 rounded-full w-16 h-16 mx-auto mb-4">
              <BarChart3 className="h-8 w-8 text-purple-600" />
            </div>
            <h3 className="text-lg font-semibold mb-2">{t('utility.actions.usage_analysis')}</h3>
            <p className="text-gray-600">{t('utility.actions.usage_analysis_desc')}</p>
          </div>
        </div>
      </div>

      {/* 最近账单 */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold mb-4">{t('utility.recent_bills')}</h3>
        <div className="space-y-4">
          {[
            { period: '2024-01', amount: 359.00, status: 'paid', dueDate: '2024-02-15' },
            { period: '2023-12', amount: 335.00, status: 'paid', dueDate: '2024-01-15' },
            { period: '2023-11', amount: 298.50, status: 'paid', dueDate: '2023-12-15' }
          ].map((bill, index) => (
            <div key={index} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div>
                <h4 className="font-medium">{bill.period}</h4>
                <p className="text-sm text-gray-600">{t('utility.due_date')}: {bill.dueDate}</p>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold">{bill.amount} QAU</p>
                <span className={`px-2 py-1 rounded text-xs ${
                  bill.status === 'paid' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {bill.status === 'paid' ? t('utility.status.paid') : t('utility.status.pending')}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // 渲染电力公司选择组件
  const ProvidersComponent = () => {
    const [providers, setProviders] = useState<Provider[]>([]);
    const [searchCountry, setSearchCountry] = useState('');
    const [searchRegion, setSearchRegion] = useState('');

    useEffect(() => {
      const loadProviders = async () => {
        const data = await getUtilityProviders(searchCountry, searchRegion);
        setProviders(data);
      };
      loadProviders();
    }, [searchCountry, searchRegion]);

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">{t('utility.providers.title')}</h2>
          <button
            onClick={() => setCurrentView('dashboard')}
            className="text-blue-600 hover:text-blue-800"
          >
            {t('utility.back_to_dashboard')}
          </button>
        </div>

        {/* 搜索过滤 */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">{t('utility.providers.country')}</label>
              <select
                value={searchCountry}
                onChange={(e) => setSearchCountry(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">{t('utility.providers.all_countries')}</option>
                <option value="China">{t('utility.providers.countries.china')}</option>
                <option value="USA">{t('utility.providers.countries.usa')}</option>
                <option value="France">{t('utility.providers.countries.france')}</option>
                <option value="Japan">{t('utility.providers.countries.japan')}</option>
                <option value="Germany">{t('utility.providers.countries.germany')}</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">{t('utility.providers.region')}</label>
              <select
                value={searchRegion}
                onChange={(e) => setSearchRegion(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">{t('utility.providers.all_regions')}</option>
                <option value="Beijing">{t('utility.providers.regions.beijing')}</option>
                <option value="New York">{t('utility.providers.regions.new_york')}</option>
                <option value="Paris">{t('utility.providers.regions.paris')}</option>
                <option value="Tokyo">{t('utility.providers.regions.tokyo')}</option>
              </select>
            </div>
          </div>
        </div>

        {/* 电力公司列表 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {providers.map((provider) => (
            <div key={provider.provider_id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center mb-4">
                <Image
                  src={provider.logo_url}
                  alt={provider.name}
                  width={48}
                  height={48}
                  className="w-12 h-12 mr-4"
                />
                <div>
                  <h3 className="text-lg font-semibold">{provider.name}</h3>
                  <p className="text-sm text-gray-600">{provider.country} - {provider.region}</p>
                </div>
              </div>

              <div className="mb-4">
                <p className="text-sm text-gray-600 mb-2">{t('utility.providers.service_areas')}:</p>
                <div className="flex flex-wrap gap-1">
                  {provider.service_areas.slice(0, 3).map((area, index) => (
                    <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                      {area}
                    </span>
                  ))}
                  {provider.service_areas.length > 3 && (
                    <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                      +{provider.service_areas.length - 3}
                    </span>
                  )}
                </div>
              </div>

              <div className="mb-4">
                <p className="text-sm text-gray-600 mb-2">{t('utility.providers.services')}:</p>
                <div className="flex flex-wrap gap-1">
                  {provider.services.slice(0, 3).map((service, index) => (
                    <span key={index} className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded">
                      {service}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  {provider.quantum_security && (
                    <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded mr-2">
                      {t('utility.providers.quantum_secure')}
                    </span>
                  )}
                  <span className="text-sm text-gray-500">
                    {provider.contact_info.phone}
                  </span>
                </div>
                <button
                  onClick={() => {
                    setSelectedProvider(provider);
                    // 这里可以打开绑定账户的模态框
                  }}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                >
                  {t('utility.providers.bind_account')}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // 渲染账单管理
  const renderBills = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">{t('utility.bills.title')}</h2>
        <button
          onClick={() => setCurrentView('dashboard')}
          className="text-blue-600 hover:text-blue-800"
        >
          {t('utility.back_to_dashboard')}
        </button>
      </div>

      {/* 账单列表 */}
      <div className="space-y-4">
        {[
          {
            bill_id: 'BILL_202401_001',
            billing_period: { start_date: '2024-01-01', end_date: '2024-01-31' },
            usage_details: { total_kwh: 450.5 },
            charges: { total_amount: 359.00 },
            payment_info: { due_date: '2024-02-15', payment_status: 'paid' }
          },
          {
            bill_id: 'BILL_202312_001',
            billing_period: { start_date: '2023-12-01', end_date: '2023-12-31' },
            usage_details: { total_kwh: 420.8 },
            charges: { total_amount: 335.00 },
            payment_info: { due_date: '2024-01-15', payment_status: 'paid' }
          }
        ].map((bill) => (
          <div key={bill.bill_id} className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold">
                  {bill.billing_period.start_date} - {bill.billing_period.end_date}
                </h3>
                <p className="text-sm text-gray-600">{t('utility.bills.bill_id')}: {bill.bill_id}</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-blue-600">{bill.charges.total_amount} QAU</p>
                <span className={`px-2 py-1 rounded text-xs ${
                  bill.payment_info.payment_status === 'paid' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {bill.payment_info.payment_status === 'paid' ? t('utility.status.paid') : t('utility.status.pending')}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <p className="text-sm text-gray-600">{t('utility.bills.usage')}</p>
                <p className="text-lg font-semibold">{bill.usage_details.total_kwh} kWh</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">{t('utility.due_date')}</p>
                <p className="text-lg font-semibold">{bill.payment_info.due_date}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">{t('utility.bills.status')}</p>
                <p className="text-lg font-semibold">
                  {bill.payment_info.payment_status === 'paid' ? t('utility.status.paid') : t('utility.status.pending')}
                </p>
              </div>
            </div>

            <div className="flex justify-end space-x-2">
              <button className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50">
                {t('utility.bills.view_details')}
              </button>
              {bill.payment_info.payment_status !== 'paid' && (
                <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                  {t('utility.bills.pay_now')}
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  // 渲染用电分析
  const renderAnalysis = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">{t('utility.analysis.title')}</h2>
        <button
          onClick={() => setCurrentView('dashboard')}
          className="text-blue-600 hover:text-blue-800"
        >
          {t('utility.back_to_dashboard')}
        </button>
      </div>

      {/* 用电趋势 */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold mb-4">{t('utility.analysis.usage_trend')}</h3>
        <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
          <p className="text-gray-500">{t('utility.analysis.chart_area')}</p>
        </div>
      </div>

      {/* 节能建议 */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold mb-4">{t('utility.analysis.energy_tips')}</h3>
        <div className="space-y-4">
          {[
            {
              type: 'energy_saving',
              title: t('utility.analysis.tips.ac_title'),
              description: t('utility.analysis.tips.ac_desc'),
              potential_savings: 45.00,
              icon: <Lightbulb className="h-5 w-5" />
            },
            {
              type: 'time_shifting',
              title: t('utility.analysis.tips.offpeak_title'),
              description: t('utility.analysis.tips.offpeak_desc'),
              potential_savings: 25.00,
              icon: <Clock className="h-5 w-5" />
            }
          ].map((recommendation, index) => (
            <div key={index} className="flex items-start p-4 border border-gray-200 rounded-lg">
              <div className="p-2 bg-green-100 rounded-full mr-4">
                {recommendation.icon}
              </div>
              <div className="flex-1">
                <h4 className="font-medium mb-1">{recommendation.title}</h4>
                <p className="text-sm text-gray-600 mb-2">{recommendation.description}</p>
                <p className="text-sm font-medium text-green-600">
                  {t('utility.analysis.estimated_savings')}: {recommendation.potential_savings} QAU/{t('utility.analysis.month')}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* 导航菜单 */}
        <div className="flex justify-center mb-8">
          <div className="flex space-x-1 bg-white rounded-lg shadow-md p-1">
            {[
              { key: 'dashboard', label: t('utility.nav.dashboard'), icon: BarChart3 },
              { key: 'providers', label: t('utility.nav.providers'), icon: Search },
              { key: 'bills', label: t('utility.nav.bills'), icon: CreditCard },
              { key: 'analysis', label: t('utility.nav.analysis'), icon: TrendingUp },
              { key: 'smart-meter', label: t('utility.nav.smart_meter'), icon: Zap }
            ].map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.key}
                  onClick={() => setCurrentView(item.key)}
                  className={`flex items-center px-4 py-2 rounded-md transition-colors ${
                    currentView === item.key
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="h-4 w-4 mr-2" />
                  {item.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* 主要内容 */}
        {currentView === 'dashboard' && renderDashboard()}
        {currentView === 'providers' && <ProvidersComponent />}
        {currentView === 'bills' && renderBills()}
        {currentView === 'analysis' && renderAnalysis()}
      </div>
    </div>
  );
};

export default UtilityBillPage;


