'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

interface PageLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
  icon?: LucideIcon;
  headerContent?: React.ReactNode;
  headerStats?: Array<{
    label: string;
    value: string | number;
    color?: string;
  }>;
}

export const PageLayout: React.FC<PageLayoutProps> = ({
  children,
  title,
  subtitle,
  icon: Icon,
  headerContent,
  headerStats,
}) => {
  return (
    <div className="min-h-screen relative">
      {/* 页面头部 */}
      <div className="relative border-b border-gray-800/50 bg-gray-900/50 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6"
          >
            <div className="flex items-center gap-4">
              {Icon && (
                <div className="p-3 rounded-2xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-blue-500/20">
                  <Icon className="w-8 h-8 text-blue-400" />
                </div>
              )}
              <div>
                <h1 className="text-3xl font-bold text-white">{title}</h1>
                {subtitle && (
                  <p className="text-gray-400 mt-1">{subtitle}</p>
                )}
              </div>
            </div>

            {headerContent && (
              <div className="flex items-center gap-4">
                {headerContent}
              </div>
            )}
          </motion.div>

          {/* 头部统计 */}
          {headerStats && headerStats.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8"
            >
              {headerStats.map((stat, index) => (
                <div
                  key={index}
                  className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 border border-gray-700/50"
                >
                  <p className="text-gray-400 text-sm">{stat.label}</p>
                  <p className={`text-2xl font-bold mt-1 ${stat.color || 'text-white'}`}>
                    {stat.value}
                  </p>
                </div>
              ))}
            </motion.div>
          )}
        </div>
      </div>

      {/* 页面内容 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
      >
        {children}
      </motion.div>
    </div>
  );
};

export default PageLayout;
