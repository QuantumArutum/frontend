'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { Search, Calendar, MapPin, Clock, Star, Users, Music, Ticket, CreditCard, Heart, Share2 } from 'lucide-react';

// 类型定义
interface Artist {
  artist_name: string;
  stage_name?: string;
  profile_image_url?: string;
}

interface Venue {
  venue_name: string;
  city: string;
  total_capacity: number;
}

interface PriceRange {
  min_price: number;
  max_price: number;
}

interface Concert {
  concert_id: string;
  concert_title: string;
  concert_subtitle?: string;
  poster_url?: string;
  age_restriction?: string;
  genre: string;
  artist: Artist;
  concert_date: string;
  show_start_time: string;
  estimated_end_time?: string;
  venue: Venue;
  price_range: PriceRange;
  status: 'ON_SALE' | 'SOLD_OUT' | 'COMING_SOON';
  description?: string;
  setlist?: string[];
  max_tickets_per_person?: number;
  ticket_categories?: TicketCategory[];
}

interface TicketCategory {
  category_id: string;
  category_name: string;
  base_price: number;
  service_fee: number;
  total_tickets: number;
  available_tickets: number;
  availability_percentage: number;
  status: 'AVAILABLE' | 'SOLD_OUT';
  benefits?: string[];
}

interface SearchFilters {
  city: string;
  genre: string;
  date_from: string;
  date_to: string;
  artist: string;
}

type StepType = 'concerts' | 'details' | 'booking' | 'payment' | 'confirmation';

const ConcertTicketPage = () => {
  const [concerts, setConcerts] = useState<Concert[]>([]);
  const [selectedConcert, setSelectedConcert] = useState<Concert | null>(null);
  const [ticketCategories, setTicketCategories] = useState<TicketCategory[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<TicketCategory | null>(null);
  const [ticketQuantity, setTicketQuantity] = useState<number>(1);
  const [currentStep, setCurrentStep] = useState<StepType>('concerts');
  const [searchFilters, setSearchFilters] = useState<SearchFilters>({
    city: 'New York',
    genre: '',
    date_from: new Date().toISOString().split('T')[0],
    date_to: '',
    artist: ''
  });
  const [loading, setLoading] = useState<boolean>(false);

  // 获取演唱会列表
  const fetchConcerts = useCallback(async (): Promise<void> => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (searchFilters.city) params.append('city', searchFilters.city);
      if (searchFilters.genre) params.append('genre', searchFilters.genre);
      if (searchFilters.date_from) params.append('date_from', searchFilters.date_from);
      if (searchFilters.date_to) params.append('date_to', searchFilters.date_to);
      if (searchFilters.artist) params.append('artist', searchFilters.artist);

      const response = await fetch(`/api/concerts?${params}`);
      const data = await response.json();
      
      if (data.success) {
        setConcerts(data.data);
      }
    } catch (error) {
      console.error('获取演唱会列表失败', error);
    }
    setLoading(false);
  }, [searchFilters]);

  // 获取演唱会详情
  const fetchConcertDetails = async (concertId: string): Promise<void> => {
    setLoading(true);
    try {
      const response = await fetch(`/api/concerts/${concertId}`);
      const data = await response.json();
      
      if (data.success) {
        setSelectedConcert(data.data);
        setTicketCategories(data.data.ticket_categories || []);
      }
    } catch (error) {
      console.error('获取演唱会详情失败', error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchConcerts();
  }, [fetchConcerts]);

  // 选择演唱会
  const selectConcert = (concert: Concert): void => {
    setCurrentStep('details');
    fetchConcertDetails(concert.concert_id);
  };

  // 选择票价分类
  const selectCategory = (category: TicketCategory): void => {
    setSelectedCategory(category);
    setCurrentStep('booking');
  };

  // 计算总价
  const calculateTotal = (): number => {
    if (!selectedCategory) return 0;
    const ticketTotal = selectedCategory.base_price * ticketQuantity;
    const serviceTotal = selectedCategory.service_fee * ticketQuantity;
    const taxes = ticketTotal * 0.08;
    return ticketTotal + serviceTotal + taxes;
  };


  // 渲染演唱会列表
  const renderConcertList = () => (
    <div className="space-y-6">
      {/* 搜索过滤器 */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">城市</label>
            <div className="relative">
              <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <select
                value={searchFilters.city}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSearchFilters({...searchFilters, city: e.target.value})}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="New York">纽约</option>
                <option value="Los Angeles">洛杉矶</option>
                <option value="London">伦敦</option>
                <option value="Tokyo">东京</option>
                <option value="Seoul">首尔</option>
              </select>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">类型</label>
            <select
              value={searchFilters.genre}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSearchFilters({...searchFilters, genre: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="">全部类型</option>
              <option value="Pop">流行</option>
              <option value="Rock">摇滚</option>
              <option value="K-Pop">K-Pop</option>
              <option value="Hip-Hop">嘻哈</option>
              <option value="Classical">古典</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">开始日期</label>
            <div className="relative">
              <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <input
                type="date"
                value={searchFilters.date_from}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchFilters({...searchFilters, date_from: e.target.value})}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">艺人</label>
            <input
              type="text"
              value={searchFilters.artist}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchFilters({...searchFilters, artist: e.target.value})}
              placeholder="搜索艺人"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
          
          <div className="flex items-end">
            <button
              onClick={fetchConcerts}
              className="w-full bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 transition-colors flex items-center justify-center"
            >
              <Search className="h-4 w-4 mr-2" />
              搜索
            </button>
          </div>
        </div>
      </div>

      {/* 演唱会列表 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {concerts.map((concert) => (
          <div key={concert.concert_id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
            <div className="relative">
              <Image
                src={concert.poster_url || '/api/placeholder/400/300'}
                alt={concert.concert_title}
                width={400}
                height={300}
                className="w-full h-48 object-cover"
              />
              <div className="absolute top-2 right-2 bg-black bg-opacity-70 text-white px-2 py-1 rounded text-sm">
                {concert.age_restriction}
              </div>
              <div className="absolute top-2 left-2 bg-purple-600 text-white px-2 py-1 rounded text-xs">
                {concert.genre}
              </div>
              <div className="absolute bottom-2 right-2">
                <button className="bg-white bg-opacity-80 p-2 rounded-full hover:bg-opacity-100 transition-all">
                  <Heart className="h-4 w-4 text-gray-600" />
                </button>
              </div>
            </div>
            
            <div className="p-4">
              <h3 className="font-bold text-lg mb-2">{concert.concert_title}</h3>
              {concert.concert_subtitle && (
                <p className="text-gray-600 text-sm mb-2">{concert.concert_subtitle}</p>
              )}
              
              <div className="flex items-center mb-2">
                <Image
                  src={concert.artist.profile_image_url || '/api/placeholder/32/32'}
                  alt={concert.artist.artist_name}
                  width={32}
                  height={32}
                  className="w-8 h-8 rounded-full mr-2"
                />
                <span className="font-medium">{concert.artist.stage_name || concert.artist.artist_name}</span>
              </div>
              
              <div className="space-y-2 mb-4">
                <div className="flex items-center text-sm text-gray-600">
                  <Calendar className="h-4 w-4 mr-2" />
                  <span>{concert.concert_date}</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Clock className="h-4 w-4 mr-2" />
                  <span>{concert.show_start_time}</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <MapPin className="h-4 w-4 mr-2" />
                  <span>{concert.venue.venue_name}, {concert.venue.city}</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Users className="h-4 w-4 mr-2" />
                  <span>{concert.venue.total_capacity.toLocaleString()} 座位</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between mb-4">
                <div>
                  <span className="text-lg font-bold text-purple-600">
                    {concert.price_range.min_price} QAU
                  </span>
                  <span className="text-sm text-gray-500 ml-1">起</span>
                </div>
                <span className={`px-2 py-1 rounded text-xs ${
                  concert.status === 'ON_SALE' ? 'bg-green-100 text-green-800' :
                  concert.status === 'SOLD_OUT' ? 'bg-red-100 text-red-800' :
                  'bg-yellow-100 text-yellow-800'
                }`}>
                  {concert.status === 'ON_SALE' ? '售票中' :
                   concert.status === 'SOLD_OUT' ? '已售罄' : '即将开售'}
                </span>
              </div>
              
              <button
                onClick={() => selectConcert(concert)}
                disabled={concert.status === 'SOLD_OUT'}
                className={`w-full py-2 rounded-md transition-colors flex items-center justify-center ${
                  concert.status === 'SOLD_OUT'
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-purple-600 text-white hover:bg-purple-700'
                }`}
              >
                <Ticket className="h-4 w-4 mr-2" />
                {concert.status === 'SOLD_OUT' ? '已售罄' : '查看详情'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );


  // 渲染演唱会详情
  const renderConcertDetails = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">演唱会详情</h2>
        <button
          onClick={() => setCurrentStep('concerts')}
          className="text-purple-600 hover:text-purple-800"
        >
          返回列表
        </button>
      </div>

      {selectedConcert && (
        <>
          {/* 演唱会基本信息 */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="md:flex">
              <div className="md:w-1/3">
                <Image
                  src={selectedConcert.poster_url || '/api/placeholder/400/600'}
                  alt={selectedConcert.concert_title}
                  width={400}
                  height={600}
                  className="w-full h-64 md:h-full object-cover"
                />
              </div>
              <div className="md:w-2/3 p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h1 className="text-3xl font-bold mb-2">{selectedConcert.concert_title}</h1>
                    {selectedConcert.concert_subtitle && (
                      <p className="text-xl text-gray-600 mb-4">{selectedConcert.concert_subtitle}</p>
                    )}
                  </div>
                  <div className="flex space-x-2">
                    <button className="p-2 border border-gray-300 rounded-md hover:bg-gray-50">
                      <Heart className="h-5 w-5" />
                    </button>
                    <button className="p-2 border border-gray-300 rounded-md hover:bg-gray-50">
                      <Share2 className="h-5 w-5" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div>
                    <h3 className="font-semibold mb-2">艺人信息</h3>
                    <div className="flex items-center mb-2">
                      <Image
                        src={selectedConcert.artist.profile_image_url || '/api/placeholder/48/48'}
                        alt={selectedConcert.artist.artist_name}
                        width={48}
                        height={48}
                        className="w-12 h-12 rounded-full mr-3"
                      />
                      <div>
                        <p className="font-medium">{selectedConcert.artist.stage_name || selectedConcert.artist.artist_name}</p>
                        <p className="text-sm text-gray-600">{selectedConcert.genre}</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-2">演出信息</h3>
                    <div className="space-y-1 text-sm">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                        <span>{selectedConcert.concert_date}</span>
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-2 text-gray-500" />
                        <span>{selectedConcert.show_start_time} - {selectedConcert.estimated_end_time}</span>
                      </div>
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 mr-2 text-gray-500" />
                        <span>{selectedConcert.venue.venue_name}</span>
                      </div>
                      <div className="flex items-center">
                        <Users className="h-4 w-4 mr-2 text-gray-500" />
                        <span>{selectedConcert.venue.total_capacity.toLocaleString()} 座位</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mb-6">
                  <h3 className="font-semibold mb-2">演出描述</h3>
                  <p className="text-gray-700">{selectedConcert.description}</p>
                </div>

                {selectedConcert.setlist && selectedConcert.setlist.length > 0 && (
                  <div className="mb-6">
                    <h3 className="font-semibold mb-2">预计曲目</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      {selectedConcert.setlist.slice(0, 12).map((song, index) => (
                        <div key={index} className="bg-gray-100 px-3 py-1 rounded text-sm">
                          {song}
                        </div>
                      ))}
                      {selectedConcert.setlist.length > 12 && (
                        <div className="bg-gray-100 px-3 py-1 rounded text-sm text-gray-600">
                          +{selectedConcert.setlist.length - 12} 更多
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* 票价分类 */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-bold mb-4">选择票价</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {ticketCategories.map((category) => (
                <div
                  key={category.category_id}
                  onClick={() => category.status !== 'SOLD_OUT' && selectCategory(category)}
                  onKeyDown={(e: React.KeyboardEvent) => {
                    if ((e.key === 'Enter' || e.key === ' ') && category.status !== 'SOLD_OUT') {
                      selectCategory(category);
                    }
                  }}
                  role="button"
                  tabIndex={category.status === 'SOLD_OUT' ? -1 : 0}
                  className={`border rounded-lg p-4 cursor-pointer transition-all ${
                    category.status === 'SOLD_OUT'
                      ? 'border-gray-300 bg-gray-50 cursor-not-allowed'
                      : 'border-gray-300 hover:border-purple-500 hover:shadow-md'
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-semibold">{category.category_name}</h4>
                    <span className={`px-2 py-1 rounded text-xs ${
                      category.status === 'SOLD_OUT' ? 'bg-red-100 text-red-800' :
                      category.availability_percentage < 20 ? 'bg-orange-100 text-orange-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {category.status === 'SOLD_OUT' ? '售罄' :
                       category.availability_percentage < 20 ? '紧张' : '充足'}
                    </span>
                  </div>
                  
                  <div className="mb-3">
                    <span className="text-2xl font-bold text-purple-600">
                      {category.base_price} QAU
                    </span>
                    {category.service_fee > 0 && (
                      <span className="text-sm text-gray-500 ml-2">
                        +{category.service_fee} 服务费
                      </span>
                    )}
                  </div>

                  <div className="text-sm text-gray-600 mb-3">
                    余票: {category.available_tickets}/{category.total_tickets}
                  </div>

                  {category.benefits && category.benefits.length > 0 && (
                    <div className="mb-3">
                      <p className="text-sm font-medium text-gray-700 mb-1">包含权益:</p>
                      <ul className="text-xs text-gray-600 space-y-1">
                        {category.benefits.slice(0, 3).map((benefit, index) => (
                          <li key={index}>• {benefit}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <button
                    disabled={category.status === 'SOLD_OUT'}
                    className={`w-full py-2 rounded-md transition-colors ${
                      category.status === 'SOLD_OUT'
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        : 'bg-purple-600 text-white hover:bg-purple-700'
                    }`}
                  >
                    {category.status === 'SOLD_OUT' ? '已售罄' : '选择此票价'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );


  // 渲染订票页面
  const renderBooking = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">确认订票</h2>
        <button
          onClick={() => setCurrentStep('details')}
          className="text-purple-600 hover:text-purple-800"
        >
          返回详情
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 订单详情 */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="font-bold text-lg mb-4">订单详情</h3>
          
          <div className="space-y-3">
            <div className="flex justify-between">
              <span>演唱会:</span>
              <span className="font-medium">{selectedConcert?.concert_title}</span>
            </div>
            <div className="flex justify-between">
              <span>艺人:</span>
              <span className="font-medium">{selectedConcert?.artist.stage_name}</span>
            </div>
            <div className="flex justify-between">
              <span>场馆:</span>
              <span className="font-medium">{selectedConcert?.venue.venue_name}</span>
            </div>
            <div className="flex justify-between">
              <span>时间:</span>
              <span className="font-medium">
                {selectedConcert?.concert_date} {selectedConcert?.show_start_time}
              </span>
            </div>
            <div className="flex justify-between">
              <span>票价分类:</span>
              <span className="font-medium">{selectedCategory?.category_name}</span>
            </div>
            
            <div className="flex justify-between items-center">
              <span>票数:</span>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setTicketQuantity(Math.max(1, ticketQuantity - 1))}
                  className="w-8 h-8 border border-gray-300 rounded-md flex items-center justify-center hover:bg-gray-50"
                >
                  -
                </button>
                <span className="w-12 text-center">{ticketQuantity}</span>
                <button
                  onClick={() => setTicketQuantity(Math.min(selectedConcert?.max_tickets_per_person || 8, ticketQuantity + 1))}
                  className="w-8 h-8 border border-gray-300 rounded-md flex items-center justify-center hover:bg-gray-50"
                >
                  +
                </button>
              </div>
            </div>
            
            <hr />
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>票价小计:</span>
                <span>{((selectedCategory?.base_price || 0) * ticketQuantity).toFixed(2)} QAU</span>
              </div>
              <div className="flex justify-between">
                <span>服务费:</span>
                <span>{((selectedCategory?.service_fee || 0) * ticketQuantity).toFixed(2)} QAU</span>
              </div>
              <div className="flex justify-between">
                <span>税费:</span>
                <span>{(((selectedCategory?.base_price || 0) * ticketQuantity) * 0.08).toFixed(2)} QAU</span>
              </div>
              <hr />
              <div className="flex justify-between text-lg font-bold">
                <span>总计:</span>
                <span className="text-purple-600">{calculateTotal().toFixed(2)} QAU</span>
              </div>
            </div>
          </div>
        </div>

        {/* 购票信息 */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="font-bold text-lg mb-4">购票信息</h3>
          
          <form className="space-y-4" onSubmit={(e: React.FormEvent) => { e.preventDefault(); setCurrentStep('payment'); }}>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">姓名 *</label>
              <input
                type="text"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="请输入真实姓名"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">邮箱 *</label>
              <input
                type="email"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="请输入邮箱地址"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">手机号 *</label>
              <input
                type="tel"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="请输入手机号"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">身份证号 *</label>
              <input
                type="text"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="实名制购票，请输入身份证号"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">紧急联系人</label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="紧急联系人姓名和电话"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">特殊需求</label>
              <textarea
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="如需轮椅通道、素食等特殊安排，请说明"
              />
            </div>

            <div className="bg-purple-50 p-4 rounded-lg">
              <div className="flex items-center mb-2">
                <CreditCard className="h-5 w-5 text-purple-600 mr-2" />
                <span className="font-medium">支付方式: QAU代币</span>
              </div>
              <p className="text-sm text-gray-600">
                使用量子安全加密的QAU代币进行支付，确保交易安全。
              </p>
            </div>

            <div className="bg-yellow-50 p-4 rounded-lg">
              <h4 className="font-medium text-yellow-800 mb-2">购票须知</h4>
              <ul className="text-sm text-yellow-700 space-y-1">
                <li>• 实名制购票，入场需携带身份证件</li>
                <li>• 票品一经售出，不可退换</li>
                <li>• 禁止携带专业摄影设备</li>
                <li>• 演出时间如有变动，以现场公告为准</li>
              </ul>
            </div>

            <button
              type="submit"
              className="w-full bg-purple-600 text-white py-3 rounded-md hover:bg-purple-700 transition-colors font-medium"
            >
              确认购买 {calculateTotal().toFixed(2)} QAU
            </button>
          </form>
        </div>
      </div>
    </div>
  );


  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* 页面标题 */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">全球演唱会</h1>
          <p className="text-gray-600">发现精彩演出，感受音乐魅力</p>
        </div>

        {/* 步骤指示器 */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center space-x-4">
            {[
              { key: 'concerts' as StepType, label: '选择演出', icon: Music },
              { key: 'details' as StepType, label: '演出详情', icon: Star },
              { key: 'booking' as StepType, label: '确认订票', icon: Ticket },
              { key: 'payment' as StepType, label: '完成支付', icon: CreditCard }
            ].map((step, index) => {
              const Icon = step.icon;
              const isActive = currentStep === step.key;
              const stepOrder: StepType[] = ['concerts', 'details', 'booking', 'payment'];
              const isCompleted = stepOrder.indexOf(currentStep) > index;
              
              return (
                <div key={step.key} className="flex items-center">
                  <div className={`flex items-center justify-center w-10 h-10 rounded-full ${
                    isActive ? 'bg-purple-600 text-white' : 
                    isCompleted ? 'bg-green-600 text-white' : 
                    'bg-gray-300 text-gray-600'
                  }`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <span className={`ml-2 text-sm font-medium ${
                    isActive ? 'text-purple-600' : 
                    isCompleted ? 'text-green-600' : 
                    'text-gray-500'
                  }`}>
                    {step.label}
                  </span>
                  {index < 3 && (
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
        {loading && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
            <p className="mt-2 text-gray-600">加载中...</p>
          </div>
        )}

        {!loading && currentStep === 'concerts' && renderConcertList()}
        {!loading && currentStep === 'details' && renderConcertDetails()}
        {!loading && currentStep === 'booking' && renderBooking()}
      </div>
    </div>
  );
};

export default ConcertTicketPage;

