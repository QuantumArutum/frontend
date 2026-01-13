'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useDemoModules } from '../hooks/useSiteConfig';

interface DemoModuleWrapperProps {
  /** The slug of the demo module (e.g., 'flights', 'hotels', 'movies', 'concerts', 'lottery') */
  moduleSlug: string;
  /** The content to render if the module is active */
  children: React.ReactNode;
  /** Optional fallback content when module is inactive */
  fallback?: React.ReactNode;
  /** Whether to show the demo badge (default: true, respects API config) */
  showBadge?: boolean;
}

/**
 * Demo Badge Component (Requirements 7.5)
 * Shows a "Demo" or "Coming Soon" label on demo modules
 */
export const DemoBadge: React.FC<{ 
  variant?: 'demo' | 'coming-soon';
  className?: string;
}> = ({ variant = 'demo', className = '' }) => {
  const isDemo = variant === 'demo';
  
  return (
    <motion.span
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`
        inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold
        ${isDemo 
          ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' 
          : 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
        }
        ${className}
      `}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${isDemo ? 'bg-amber-400' : 'bg-purple-400'} animate-pulse`}></span>
      {isDemo ? 'Demo' : 'Coming Soon'}
    </motion.span>
  );
};

/**
 * Demo Module Wrapper Component (Requirements 7.2, 7.5)
 * Conditionally renders demo modules based on admin configuration
 */
const DemoModuleWrapper: React.FC<DemoModuleWrapperProps> = ({
  moduleSlug,
  children,
  fallback,
  showBadge = true
}) => {
  const { isModuleActive, shouldShowDemoBadge, loading } = useDemoModules();

  // Show loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="w-6 h-6 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // Check if module is active
  const isActive = isModuleActive(moduleSlug);
  const showDemoBadgeForModule = showBadge && shouldShowDemoBadge(moduleSlug);

  // If module is not active, show fallback or nothing
  if (!isActive) {
    return fallback ? <>{fallback}</> : null;
  }

  // Module is active, render with optional demo badge
  return (
    <div className="relative">
      {showDemoBadgeForModule && (
        <div className="absolute top-4 right-4 z-10">
          <DemoBadge variant="demo" />
        </div>
      )}
      {children}
    </div>
  );
};

/**
 * Hook to check if a demo module should be shown
 * Can be used directly in components without the wrapper
 */
export function useDemoModule(moduleSlug: string) {
  const { isModuleActive, shouldShowDemoBadge, getModuleConfig, loading } = useDemoModules();
  
  return {
    isActive: isModuleActive(moduleSlug),
    showBadge: shouldShowDemoBadge(moduleSlug),
    config: getModuleConfig(moduleSlug),
    loading
  };
}

/**
 * Demo Module Card Component
 * A card that shows when a demo module is disabled
 */
export const DemoModuleDisabledCard: React.FC<{
  title: string;
  description?: string;
}> = ({ title, description }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/5 backdrop-blur-md rounded-xl border border-white/10 p-8 text-center"
    >
      <div className="w-16 h-16 mx-auto mb-4 bg-gray-500/20 rounded-full flex items-center justify-center">
        <span className="text-2xl">🔒</span>
      </div>
      <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
      <p className="text-gray-400">
        {description || 'This feature is currently unavailable.'}
      </p>
      <DemoBadge variant="coming-soon" className="mt-4" />
    </motion.div>
  );
};

export default DemoModuleWrapper;
