'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { AuctionFilters as FilterType, NodeTier, AuctionStatus } from '../../types/auction.types';

interface AuctionFiltersProps {
  filters: FilterType;
  onFiltersChange: (filters: FilterType) => void;
}

const AuctionFilters: React.FC<AuctionFiltersProps> = ({ filters, onFiltersChange }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [localFilters, setLocalFilters] = useState<FilterType>(filters);

  const locations = [
    '新加坡', '香港', '东京', '首尔', '台北', '悉尼', '墨尔本', '奥克兰',
    '曼谷', '吉隆坡', '雅加达', '马尼拉', '胡志明市', '孟买', '班加罗尔',
    '纽约', '洛杉矶', '旧金山', '西雅图', '芝加哥', '达拉斯', '迈阿密', '波士顿',
    '多伦多', '温哥华', '蒙特利尔', '墨西哥城',
    '伦敦', '法兰克福', '阿姆斯特丹', '苏黎世', '斯德哥尔摩', '赫尔辛基', '哥本哈根',
    '巴黎', '米兰', '马德里', '都柏林', '维也纳', '布拉格', '华沙', '塔林',
    '迪拜', '特拉维夫', '开普敦', '拉各斯',
    '圣保罗', '布宜诺斯艾利斯', '圣地亚哥', '利马'
  ];

  const handleFilterChange = (key: keyof FilterType, value: FilterType[keyof FilterType]) => {
    const newFilters = { ...localFilters, [key]: value };
    setLocalFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const handlePriceRangeChange = (type: 'min' | 'max', value: number) => {
    const currentRange = localFilters.priceRange || { min: 0, max: 0 };
    const newPriceRange = {
      min: currentRange.min,
      max: currentRange.max,
      [type]: value
    };
    handleFilterChange('priceRange', newPriceRange);
  };

  const clearFilters = () => {
    const emptyFilters: FilterType = {};
    setLocalFilters(emptyFilters);
    onFiltersChange(emptyFilters);
  };

  const getActiveFilterCount = () => {
    let count = 0;
    if (localFilters.tier) count++;
    if (localFilters.location) count++;
    if (localFilters.status) count++;
    if (localFilters.priceRange) count++;
    if (localFilters.endingSoon) count++;
    if (localFilters.hasReserve) count++;
    if (localFilters.hasBuyNow) count++;
    return count;
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6"
    >
      {/* 筛选器标题 */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-white flex items-center">
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.414A1 1 0 013 6.707V4z" />
          </svg>
          筛选条件
        </h3>
        {getActiveFilterCount() > 0 && (
          <button
            onClick={clearFilters}
            className="text-sm text-cyan-400 hover:text-cyan-300 transition-colors"
          >
            清除 ({getActiveFilterCount()})
          </button>
        )}
      </div>

      {/* 节点等级 */}
      <div className="mb-6">
        <label className="block text-white font-semibold mb-3">节点等级</label>
        <div className="space-y-2">
          {[
            { value: '', label: '全部等级' },
            { value: 'genesis', label: '创世节点' },
            { value: 'premium', label: '高级节点' },
            { value: 'standard', label: '标准节点' }
          ].map((option) => (
            <label key={option.value} className="flex items-center cursor-pointer">
              <input
                type="radio"
                name="tier"
                value={option.value}
                checked={localFilters.tier === option.value || (!localFilters.tier && option.value === '')}
                onChange={(e) => handleFilterChange('tier', e.target.value || undefined)}
                className="mr-2 text-cyan-500 focus:ring-cyan-500"
              />
              <span className="text-gray-300 hover:text-white transition-colors">
                {option.label}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* 拍卖状态 */}
      <div className="mb-6">
        <label className="block text-white font-semibold mb-3">拍卖状态</label>
        <div className="space-y-2">
          {[
            { value: '', label: '全部状态' },
            { value: 'active', label: '进行中' },
            { value: 'upcoming', label: '即将开始' },
            { value: 'ended', label: '已结束' }
          ].map((option) => (
            <label key={option.value} className="flex items-center cursor-pointer">
              <input
                type="radio"
                name="status"
                value={option.value}
                checked={localFilters.status === option.value || (!localFilters.status && option.value === '')}
                onChange={(e) => handleFilterChange('status', e.target.value || undefined)}
                className="mr-2 text-cyan-500 focus:ring-cyan-500"
              />
              <span className="text-gray-300 hover:text-white transition-colors">
                {option.label}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* 价格范围 */}
      <div className="mb-6">
        <label className="block text-white font-semibold mb-3">价格范围</label>
        <div className="space-y-3">
          <div>
            <label className="block text-sm text-gray-400 mb-1">最低价格</label>
            <input
              type="number"
              placeholder="0"
              value={localFilters.priceRange?.min || ''}
              onChange={(e) => handlePriceRangeChange('min', parseInt(e.target.value) || 0)}
              className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">最高价格</label>
            <input
              type="number"
              placeholder="无限制"
              value={localFilters.priceRange?.max || ''}
              onChange={(e) => handlePriceRangeChange('max', parseInt(e.target.value) || 0)}
              className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400"
            />
          </div>
        </div>
      </div>

      {/* 位置筛选 */}
      <div className="mb-6">
        <label className="block text-white font-semibold mb-3">节点位置</label>
        <select
          value={localFilters.location || ''}
          onChange={(e) => handleFilterChange('location', e.target.value || undefined)}
          className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-cyan-400"
        >
          <option value="">全部位置</option>
          {locations.map((location) => (
            <option key={location} value={location} className="bg-gray-800">
              {location}
            </option>
          ))}
        </select>
      </div>

      {/* 特殊筛选 */}
      <div className="space-y-3">
        <label className="flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={localFilters.endingSoon || false}
            onChange={(e) => handleFilterChange('endingSoon', e.target.checked || undefined)}
            className="mr-2 text-cyan-500 focus:ring-cyan-500"
          />
          <span className="text-gray-300 hover:text-white transition-colors">
            即将结束 (24小时内)
          </span>
        </label>

        <label className="flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={localFilters.hasReserve || false}
            onChange={(e) => handleFilterChange('hasReserve', e.target.checked || undefined)}
            className="mr-2 text-cyan-500 focus:ring-cyan-500"
          />
          <span className="text-gray-300 hover:text-white transition-colors">
            有保留价
          </span>
        </label>

        <label className="flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={localFilters.hasBuyNow || false}
            onChange={(e) => handleFilterChange('hasBuyNow', e.target.checked || undefined)}
            className="mr-2 text-cyan-500 focus:ring-cyan-500"
          />
          <span className="text-gray-300 hover:text-white transition-colors">
            支持一口价
          </span>
        </label>
      </div>

      {/* 快速筛选按钮 */}
      <div className="mt-6 pt-6 border-t border-white/10">
        <div className="text-sm text-gray-400 mb-3">快速筛选</div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => handleFilterChange('endingSoon', true)}
            className="px-3 py-1 bg-red-500/20 text-red-400 rounded-full text-xs hover:bg-red-500/30 transition-colors"
          >
            即将结束
          </button>
          <button
            onClick={() => handleFilterChange('tier', 'genesis')}
            className="px-3 py-1 bg-yellow-500/20 text-yellow-400 rounded-full text-xs hover:bg-yellow-500/30 transition-colors"
          >
            创世节点
          </button>
          <button
            onClick={() => handleFilterChange('status', 'active')}
            className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-xs hover:bg-green-500/30 transition-colors"
          >
            进行中
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default AuctionFilters;
