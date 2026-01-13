'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Search, Calendar, MapPin, Plane, Users, CreditCard, Star, Wifi, Tv, Utensils } from 'lucide-react';
import DemoModuleWrapper, { DemoBadge, DemoModuleDisabledCard } from '../../components/DemoModuleWrapper';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Flight = Record<string, any>;

const FlightBookingPage = () => {
  const [searchParams, setSearchParams] = useState({
    departure_city: 'New York',
    arrival_city: 'Los Angeles',
    departure_date: new Date().toISOString().split('T')[0],
    return_date: '',
    passengers: 1,
    class_type: 'ECONOMY',
    trip_type: 'one_way'
  });
  
  const [searchResults, setSearchResults] = useState<{
    search_params: {
      departure_city: string;
      arrival_city: string;
    };
    outbound_flights: Flight[];
    return_flights?: Flight[];
  } | null>(null);
  const [selectedOutbound, setSelectedOutbound] = useState<Flight | null>(null);
  const [selectedReturn, setSelectedReturn] = useState<Flight | null>(null);
  const [selectedFares, setSelectedFares] = useState<Record<string, Flight>>({});
  const [currentStep, setCurrentStep] = useState('search');
  const [loading, setLoading] = useState(false);

  // 搜索航班
  const searchFlights = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        ...searchParams,
        passengers: String(searchParams.passengers)
      });
      const response = await fetch(`/api/flights/search?${params}`);
      const data = await response.json();
      
      if (data.success) {
        setSearchResults(data.data);
        setCurrentStep('results');
      }
    } catch (error) {
      console.error('搜索航班失败:', error);
    }
    setLoading(false);
  };

  // 获取航班详情和票价
  const getFlightDetails = async (flightId: string) => {
    try {
      const response = await fetch(`/api/flights/${flightId}/fares`);
      const data = await response.json();
      
      if (data.success) {
        return data.data;
      }
    } catch (error) {
      console.error('获取航班详情失败:', error);
    }
    return null;
  };

  // 选择航班
  const selectFlight = async (flight: Flight, type: string) => {
    const details = await getFlightDetails(flight.flight_id);
    if (details) {
      if (type === 'outbound') {
        setSelectedOutbound(details);
      } else {
        setSelectedReturn(details);
      }
      setCurrentStep('details');
    }
  };

  // 选择票价
  const selectFare = (flightId: string, fareClass: Flight) => {
    setSelectedFares({
      ...selectedFares,
      [flightId]: fareClass
    });
  };

  // 格式化时间
  const formatTime = (timeString: string): string => {
    return timeString.slice(0, 5);
  };

  // 格式化持续时间
  const formatDuration = (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}小时${mins}分钟`;
  };

  // 渲染搜索表单
  const renderSearchForm = () => (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">行程类型</label>
          <div className="flex space-x-4">
            <label className="flex items-center">
              <input
                type="radio"
                value="one_way"
                checked={searchParams.trip_type === 'one_way'}
                onChange={(e) => setSearchParams({...searchParams, trip_type: e.target.value, return_date: ''})}
                className="mr-2"
              />
              单程
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                value="round_trip"
                checked={searchParams.trip_type === 'round_trip'}
                onChange={(e) => setSearchParams({...searchParams, trip_type: e.target.value})}
                className="mr-2"
              />
              往返
            </label>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">出发城市</label>
          <div className="relative">
            <Plane className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <select
              value={searchParams.departure_city}
              onChange={(e) => setSearchParams({...searchParams, departure_city: e.target.value})}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="New York">纽约 (JFK)</option>
              <option value="Los Angeles">洛杉矶 (LAX)</option>
              <option value="London">伦敦 (LHR)</option>
              <option value="Dubai">迪拜 (DXB)</option>
              <option value="Singapore">新加坡 (SIN)</option>
              <option value="Tokyo">东京 (NRT)</option>
              <option value="Paris">巴黎 (CDG)</option>
              <option value="Frankfurt">法兰克福 (FRA)</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">到达城市</label>
          <div className="relative">
            <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <select
              value={searchParams.arrival_city}
              onChange={(e) => setSearchParams({...searchParams, arrival_city: e.target.value})}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="Los Angeles">洛杉矶 (LAX)</option>
              <option value="New York">纽约 (JFK)</option>
              <option value="London">伦敦 (LHR)</option>
              <option value="Dubai">迪拜 (DXB)</option>
              <option value="Singapore">新加坡 (SIN)</option>
              <option value="Tokyo">东京 (NRT)</option>
              <option value="Paris">巴黎 (CDG)</option>
              <option value="Frankfurt">法兰克福 (FRA)</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">出发日期</label>
          <div className="relative">
            <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <input
              type="date"
              value={searchParams.departure_date}
              onChange={(e) => setSearchParams({...searchParams, departure_date: e.target.value})}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {searchParams.trip_type === 'round_trip' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">返程日期</label>
            <div className="relative">
              <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <input
                type="date"
                value={searchParams.return_date}
                onChange={(e) => setSearchParams({...searchParams, return_date: e.target.value})}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">乘客数量</label>
          <div className="relative">
            <Users className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <select
              value={searchParams.passengers}
              onChange={(e) => setSearchParams({...searchParams, passengers: parseInt(e.target.value)})}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {[1,2,3,4,5,6,7,8,9].map(num => (
                <option key={num} value={num}>{num} 位乘客</option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">舱位等级</label>
          <select
            value={searchParams.class_type}
            onChange={(e) => setSearchParams({...searchParams, class_type: e.target.value})}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="ECONOMY">经济舱</option>
            <option value="PREMIUM_ECONOMY">超级经济舱</option>
            <option value="BUSINESS">商务舱</option>
            <option value="FIRST">头等舱</option>
          </select>
        </div>

        <div className="flex items-end">
          <button
            onClick={searchFlights}
            disabled={loading}
            className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors flex items-center justify-center"
          >
            {loading ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            ) : (
              <>
                <Search className="h-4 w-4 mr-2" />
                搜索航班
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );

  // 渲染航班卡片
  const renderFlightCard = (flight: Flight, type: string = 'outbound') => (
    <div key={flight.flight_id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <Image
            src={flight.airline.logo_url || '/api/placeholder/40/40'}
            alt={flight.airline.name}
            width={40}
            height={40}
            className="w-10 h-10 mr-3"
          />
          <div>
            <h3 className="font-semibold">{flight.airline.name}</h3>
            <p className="text-sm text-gray-600">{flight.flight_number}</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-600">{flight.aircraft.manufacturer} {flight.aircraft.model}</p>
          <div className="flex items-center text-sm text-gray-500">
            {flight.aircraft.wifi_available && <Wifi className="h-4 w-4 mr-1" />}
            {flight.aircraft.entertainment_system && <Tv className="h-4 w-4 mr-1" />}
            {flight.meal_service && <Utensils className="h-4 w-4 mr-1" />}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between mb-4">
        <div className="text-center">
          <p className="text-2xl font-bold">{formatTime(flight.departure_time)}</p>
          <p className="text-sm text-gray-600">{flight.departure_airport.code}</p>
          <p className="text-xs text-gray-500">{flight.departure_airport.city}</p>
        </div>

        <div className="flex-1 mx-4">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center">
              <span className="bg-white px-3 text-sm text-gray-500">
                {formatDuration(flight.duration_minutes)}
              </span>
            </div>
          </div>
          <div className="text-center mt-1">
            {flight.stops === 0 ? (
              <span className="text-xs text-green-600">直飞</span>
            ) : (
              <span className="text-xs text-orange-600">{flight.stops} 次中转</span>
            )}
          </div>
        </div>

        <div className="text-center">
          <p className="text-2xl font-bold">{formatTime(flight.arrival_time)}</p>
          <p className="text-sm text-gray-600">{flight.arrival_airport.code}</p>
          <p className="text-xs text-gray-500">{flight.arrival_airport.city}</p>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div>
          <span className="text-2xl font-bold text-blue-600">
            {flight.price_range?.min_price ?? 0} QAU
          </span>
          <span className="text-sm text-gray-500 ml-1">起</span>
        </div>
        
        <div className="flex items-center space-x-2">
          {(flight as Flight & { delay_minutes?: number }).delay_minutes && (flight as Flight & { delay_minutes?: number }).delay_minutes! > 0 && (
            <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded">
              延误 {(flight as Flight & { delay_minutes?: number }).delay_minutes} 分钟
            </span>
          )}
          <button
            onClick={() => selectFlight(flight, type)}
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            选择航班
          </button>
        </div>
      </div>
    </div>
  );

  // 渲染搜索结果
  const renderSearchResults = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">搜索结果</h2>
        <button
          onClick={() => setCurrentStep('search')}
          className="text-blue-600 hover:text-blue-800"
        >
          修改搜索
        </button>
      </div>

      {/* 出发航班 */}
      <div>
        <h3 className="text-lg font-semibold mb-4">
          出发航班: {searchResults?.search_params.departure_city} → {searchResults?.search_params.arrival_city}
        </h3>
        <div className="space-y-4">
          {searchResults?.outbound_flights.map(flight => renderFlightCard(flight, 'outbound'))}
        </div>
      </div>

      {/* 返程航班 */}
      {searchResults?.return_flights && searchResults.return_flights.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-4">
            返程航班: {searchResults?.search_params.arrival_city} → {searchResults?.search_params.departure_city}
          </h3>
          <div className="space-y-4">
            {searchResults?.return_flights.map(flight => renderFlightCard(flight, 'return'))}
          </div>
        </div>
      )}
    </div>
  );

  // 渲染航班详情和票价选择
  const renderFlightDetails = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">选择票价</h2>
        <button
          onClick={() => setCurrentStep('results')}
          className="text-blue-600 hover:text-blue-800"
        >
          返回搜索结果
        </button>
      </div>

      {selectedOutbound && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4">出发航班票价</h3>
          <div className="mb-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">{selectedOutbound.flight_number}</h4>
                <p className="text-sm text-gray-600">
                  {selectedOutbound.departure_airport.city} → {selectedOutbound.arrival_airport.city}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm">{selectedOutbound.departure_date}</p>
                <p className="text-sm">{formatTime(selectedOutbound.departure_time)} - {formatTime(selectedOutbound.arrival_time)}</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {selectedOutbound.fare_classes.map((fareClass: Flight) => (
              <div
                key={fareClass.fare_class_id}
                className={`border rounded-lg p-4 cursor-pointer transition-all ${
                  selectedFares[selectedOutbound.flight_id]?.fare_class_id === fareClass.fare_class_id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-300 hover:border-blue-300'
                }`}
                onClick={() => selectFare(selectedOutbound.flight_id, fareClass)}
              >
                <div className="text-center mb-3">
                  <h4 className="font-semibold">{fareClass.class_type}</h4>
                  <p className="text-sm text-gray-600">{fareClass.cabin_class}</p>
                </div>

                <div className="text-center mb-3">
                  <span className="text-2xl font-bold text-blue-600">
                    {fareClass.pricing.total_price} QAU
                  </span>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>座位间距:</span>
                    <span>{fareClass.seat_details.pitch_inches}&quot;</span>
                  </div>
                  <div className="flex justify-between">
                    <span>行李:</span>
                    <span>{fareClass.inclusions.baggage_kg}kg</span>
                  </div>
                  <div className="flex justify-between">
                    <span>餐食:</span>
                    <span>{fareClass.inclusions.meal_included ? '包含' : '不含'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>可退票:</span>
                    <span>{fareClass.policies.refundable ? '可退' : '不可退'}</span>
                  </div>
                </div>

                <div className="mt-3 text-center">
                  <span className={`px-2 py-1 rounded text-xs ${
                    fareClass.availability.availability_percentage > 50 ? 'bg-green-100 text-green-800' :
                    fareClass.availability.availability_percentage > 20 ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    余票 {fareClass.availability.available_seats}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {selectedReturn && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4">返程航班票价</h3>
        </div>
      )}

      {Object.keys(selectedFares).length > 0 && (
        <div className="text-center">
          <button
            onClick={() => setCurrentStep('booking')}
            className="bg-blue-600 text-white px-8 py-3 rounded-md hover:bg-blue-700 transition-colors"
          >
            继续预订
          </button>
        </div>
      )}
    </div>
  );

  return (
    <DemoModuleWrapper 
      moduleSlug="flights"
      fallback={
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
          <DemoModuleDisabledCard 
            title="Flight Booking" 
            description="Flight booking feature is currently unavailable. Please check back later."
          />
        </div>
      }
    >
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          {/* 页面标题 */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-2 mb-2">
              <h1 className="text-4xl font-bold text-gray-900">全球飞机票</h1>
              <DemoBadge variant="demo" />
            </div>
            <p className="text-gray-600">安全便捷的全球航班预订服务</p>
          </div>

        {/* 步骤指示器 */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center space-x-4">
            {[
              { key: 'search', label: '搜索航班', icon: Search },
              { key: 'results', label: '选择航班', icon: Plane },
              { key: 'details', label: '选择票价', icon: Star },
              { key: 'booking', label: '填写信息', icon: Users },
              { key: 'payment', label: '完成支付', icon: CreditCard }
            ].map((step, index) => {
              const Icon = step.icon;
              const isActive = currentStep === step.key;
              const isCompleted = ['search', 'results', 'details', 'booking', 'payment'].indexOf(currentStep) > index;
              
              return (
                <div key={step.key} className="flex items-center">
                  <div className={`flex items-center justify-center w-10 h-10 rounded-full ${
                    isActive ? 'bg-blue-600 text-white' : 
                    isCompleted ? 'bg-green-600 text-white' : 
                    'bg-gray-300 text-gray-600'
                  }`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <span className={`ml-2 text-sm font-medium ${
                    isActive ? 'text-blue-600' : 
                    isCompleted ? 'text-green-600' : 
                    'text-gray-500'
                  }`}>
                    {step.label}
                  </span>
                  {index < 4 && (
                    <div className={`w-8 h-0.5 mx-4 ${
                      isCompleted ? 'bg-green-600' : 'bg-gray-300'
                    }`} />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* 主要内容 */}
        {currentStep === 'search' && renderSearchForm()}
        {currentStep === 'results' && searchResults && renderSearchResults()}
        {currentStep === 'details' && renderFlightDetails()}
      </div>
    </div>
    </DemoModuleWrapper>
  );
};

export default FlightBookingPage;
