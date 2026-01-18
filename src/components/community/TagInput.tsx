'use client';

import React, { useState, useRef, useEffect } from 'react';
import { X, Tag as TagIcon } from 'lucide-react';
import { barongAPI } from '@/api/client';
import { message } from 'antd';

interface TagInputProps {
  value: string[];
  onChange: (tags: string[]) => void;
  maxTags?: number;
  placeholder?: string;
  suggestions?: string[];
}

export default function TagInput({
  value = [],
  onChange,
  maxTags = 5,
  placeholder = '添加标签...',
  suggestions = [],
}: TagInputProps) {
  const [inputValue, setInputValue] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filteredSuggestions, setFilteredSuggestions] = useState<string[]>([]);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  // 搜索标签
  useEffect(() => {
    const searchTags = async () => {
      if (inputValue.trim().length > 0) {
        try {
          const response = await barongAPI.get('/public/community/tags/search', {
            params: { query: inputValue, limit: 10 },
          });
          if (response.data.success) {
            setSearchResults(response.data.data.tags);
          }
        } catch (error) {
          console.error('Error searching tags:', error);
        }
      } else {
        setSearchResults([]);
      }
    };

    const timer = setTimeout(searchTags, 300);
    return () => clearTimeout(timer);
  }, [inputValue]);

  // 过滤建议
  useEffect(() => {
    if (inputValue.trim().length > 0) {
      const filtered = suggestions.filter(
        (tag) =>
          tag.toLowerCase().includes(inputValue.toLowerCase()) &&
          !value.includes(tag)
      );
      setFilteredSuggestions(filtered);
      setShowSuggestions(true);
    } else {
      setFilteredSuggestions([]);
      setShowSuggestions(false);
    }
  }, [inputValue, suggestions, value]);

  const addTag = (tag: string) => {
    const trimmedTag = tag.trim();

    if (!trimmedTag) {
      return;
    }

    // 验证标签长度
    if (trimmedTag.length > 50) {
      message.error('标签长度不能超过50个字符');
      return;
    }

    // 检查是否已存在
    if (value.includes(trimmedTag)) {
      message.warning('标签已存在');
      return;
    }

    // 检查数量限制
    if (value.length >= maxTags) {
      message.warning(`最多只能添加${maxTags}个标签`);
      return;
    }

    onChange([...value, trimmedTag]);
    setInputValue('');
    setShowSuggestions(false);
  };

  const removeTag = (tagToRemove: string) => {
    onChange(value.filter((tag) => tag !== tagToRemove));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag(inputValue);
    } else if (e.key === 'Backspace' && !inputValue && value.length > 0) {
      removeTag(value[value.length - 1]);
    }
  };

  const handleSuggestionClick = (tag: string) => {
    addTag(tag);
    inputRef.current?.focus();
  };

  return (
    <div className="relative">
      {/* 标签输入框 */}
      <div className="flex flex-wrap gap-2 p-3 bg-gray-800 border border-gray-700 rounded-lg focus-within:border-blue-500 transition-colors">
        {/* 已添加的标签 */}
        {value.map((tag) => (
          <div
            key={tag}
            className="flex items-center gap-1 px-3 py-1 bg-blue-600 text-white rounded-full text-sm"
          >
            <TagIcon className="w-3 h-3" />
            <span>{tag}</span>
            <button
              type="button"
              onClick={() => removeTag(tag)}
              className="hover:bg-blue-700 rounded-full p-0.5 transition-colors"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        ))}

        {/* 输入框 */}
        {value.length < maxTags && (
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => setShowSuggestions(true)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
            placeholder={value.length === 0 ? placeholder : ''}
            className="flex-1 min-w-[120px] bg-transparent outline-none text-white placeholder-gray-400"
          />
        )}
      </div>

      {/* 标签数量提示 */}
      <div className="mt-1 text-xs text-gray-400">
        {value.length}/{maxTags} 个标签
      </div>

      {/* 建议列表 */}
      {showSuggestions && (searchResults.length > 0 || filteredSuggestions.length > 0) && (
        <div className="absolute z-10 w-full mt-1 bg-gray-800 border border-gray-700 rounded-lg shadow-lg max-h-60 overflow-y-auto">
          {/* 搜索结果 */}
          {searchResults.length > 0 && (
            <div>
              <div className="px-3 py-2 text-xs text-gray-400 border-b border-gray-700">
                搜索结果
              </div>
              {searchResults.map((tag) => (
                <button
                  key={tag.id}
                  type="button"
                  onClick={() => handleSuggestionClick(tag.name)}
                  className="w-full px-3 py-2 text-left hover:bg-gray-700 transition-colors flex items-center gap-2"
                >
                  <TagIcon className="w-4 h-4" style={{ color: tag.color }} />
                  <span className="text-white">{tag.name}</span>
                  {tag.is_official && (
                    <span className="text-xs text-blue-400">官方</span>
                  )}
                  <span className="ml-auto text-xs text-gray-400">
                    {tag.usage_count} 次使用
                  </span>
                </button>
              ))}
            </div>
          )}

          {/* 预设建议 */}
          {filteredSuggestions.length > 0 && (
            <div>
              <div className="px-3 py-2 text-xs text-gray-400 border-b border-gray-700">
                建议标签
              </div>
              {filteredSuggestions.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => handleSuggestionClick(tag)}
                  className="w-full px-3 py-2 text-left hover:bg-gray-700 transition-colors text-white"
                >
                  {tag}
                </button>
              ))}
            </div>
          )}

          {/* 创建新标签提示 */}
          {inputValue.trim() && (
            <button
              type="button"
              onClick={() => handleSuggestionClick(inputValue)}
              className="w-full px-3 py-2 text-left hover:bg-gray-700 transition-colors border-t border-gray-700"
            >
              <span className="text-blue-400">创建新标签: </span>
              <span className="text-white">{inputValue}</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
}
