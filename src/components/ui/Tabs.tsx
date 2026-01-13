'use client';

import React, { createContext, useContext, useState } from 'react';
import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

// ============ Type Definitions ============

interface TabsContextValue {
  value: string;
  onValueChange: (value: string) => void;
}

const TabsContext = createContext<TabsContextValue | undefined>(undefined);

// Radix-style props
interface RadixTabsProps {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  className?: string;
  children?: React.ReactNode;
}

// Legacy props
interface Tab {
  id: string;
  label: string;
  icon?: LucideIcon | React.ReactNode;
  badge?: string | number;
}

interface LegacyTabsProps {
  tabs: Tab[];
  activeTab: string;
  onChange: (tabId: string) => void;
  variant?: 'default' | 'pills' | 'underline';
}

// Combined props type
type TabsProps = RadixTabsProps | LegacyTabsProps;

// Type guard
function isLegacyProps(props: TabsProps): props is LegacyTabsProps {
  return 'tabs' in props && Array.isArray(props.tabs);
}

// ============ Main Tabs Component ============

export const Tabs: React.FC<TabsProps> = (props) => {
  // Always call hooks at the top level
  const [internalValue, setInternalValue] = useState('');
  
  // Get defaultValue for initialization (handle both API styles)
  const defaultVal = isLegacyProps(props) ? '' : (props.defaultValue || '');
  const controlledValue = isLegacyProps(props) ? undefined : props.value;
  
  // Initialize internal value with defaultValue on first render
  React.useEffect(() => {
    if (defaultVal && !controlledValue) {
      setInternalValue(defaultVal);
    }
  }, [defaultVal, controlledValue]);
  
  // Check if using legacy API
  if (isLegacyProps(props)) {
    return <LegacyTabs {...props} />;
  }
  
  // Radix-style API
  const { value, onValueChange, className, children } = props;
  
  const currentValue = value !== undefined ? value : internalValue;
  const handleValueChange = onValueChange || setInternalValue;
  
  return (
    <TabsContext.Provider value={{ value: currentValue, onValueChange: handleValueChange }}>
      <div className={className}>
        {children}
      </div>
    </TabsContext.Provider>
  );
};

interface TabsListProps {
  className?: string;
  children: React.ReactNode;
}

export const TabsList: React.FC<TabsListProps> = ({ className, children }) => {
  return (
    <div className={`flex ${className || ''}`}>
      {children}
    </div>
  );
};

interface TabsTriggerProps {
  value: string;
  className?: string;
  children: React.ReactNode;
  disabled?: boolean;
}

export const TabsTrigger: React.FC<TabsTriggerProps> = ({ value, className, children, disabled }) => {
  const context = useContext(TabsContext);
  if (!context) throw new Error('TabsTrigger must be used within Tabs');
  
  const isActive = context.value === value;
  
  return (
    <button
      type="button"
      role="tab"
      aria-selected={isActive}
      disabled={disabled}
      onClick={() => context.onValueChange(value)}
      className={`
        relative px-4 py-2 font-medium transition-all duration-200
        ${isActive 
          ? 'text-white bg-gradient-to-r from-blue-600/20 to-purple-600/20 border-b-2 border-blue-500' 
          : 'text-gray-400 hover:text-white'
        }
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        ${className || ''}
      `}
    >
      {children}
    </button>
  );
};

interface TabsContentProps {
  value: string;
  className?: string;
  children: React.ReactNode;
}

export const TabsContent: React.FC<TabsContentProps> = ({ value, className, children }) => {
  const context = useContext(TabsContext);
  if (!context) throw new Error('TabsContent must be used within Tabs');
  
  if (context.value !== value) return null;
  
  return (
    <div role="tabpanel" className={className}>
      {children}
    </div>
  );
};

// ============ Legacy Tabs Component ============

// 辅助函数：渲染图标
const renderIcon = (icon: LucideIcon | React.ReactNode | undefined) => {
  if (!icon) return null;
  
  // 如果是React元素（JSX），直接返回
  if (React.isValidElement(icon)) {
    return icon;
  }
  
  // 如果是组件（LucideIcon），实例化它
  const IconComponent = icon as LucideIcon;
  return <IconComponent className="w-4 h-4" />;
};

const LegacyTabs: React.FC<LegacyTabsProps> = ({
  tabs,
  activeTab,
  onChange,
  variant = 'default',
}) => {
  if (variant === 'pills') {
    return (
      <div className="flex flex-wrap gap-2">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          
          return (
            <motion.button
              key={tab.id}
              onClick={() => onChange(tab.id)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`
                flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium transition-all duration-200
                ${isActive
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-500/25'
                  : 'bg-gray-800/50 text-gray-400 hover:text-white hover:bg-gray-700/50 border border-gray-700/50'
                }
              `}
            >
              {renderIcon(tab.icon)}
              {tab.label}
              {tab.badge && (
                <span className={`
                  px-2 py-0.5 rounded-full text-xs font-medium
                  ${isActive ? 'bg-white/20' : 'bg-gray-700'}
                `}>
                  {tab.badge}
                </span>
              )}
            </motion.button>
          );
        })}
      </div>
    );
  }

  if (variant === 'underline') {
    return (
      <div className="border-b border-gray-700/50">
        <div className="flex gap-1">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            
            return (
              <button
                key={tab.id}
                onClick={() => onChange(tab.id)}
                className={`
                  relative flex items-center gap-2 px-6 py-4 font-medium transition-colors
                  ${isActive ? 'text-blue-400' : 'text-gray-400 hover:text-white'}
                `}
              >
                {renderIcon(tab.icon)}
                {tab.label}
                {tab.badge && (
                  <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-gray-700">
                    {tab.badge}
                  </span>
                )}
                {isActive && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500"
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  // Default variant
  return (
    <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700/50 p-1.5">
      <div className="flex">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          
          return (
            <button
              key={tab.id}
              onClick={() => onChange(tab.id)}
              className={`
                relative flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-medium transition-all duration-200
                ${isActive
                  ? 'text-white'
                  : 'text-gray-400 hover:text-white'
                }
              `}
            >
              {isActive && (
                <motion.div
                  layoutId="activeTabBg"
                  className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-xl border border-blue-500/30"
                  transition={{ type: 'spring', duration: 0.3 }}
                />
              )}
              <span className="relative flex items-center gap-2">
                {renderIcon(tab.icon)}
                {tab.label}
                {tab.badge && (
                  <span className={`
                    px-2 py-0.5 rounded-full text-xs font-medium
                    ${isActive ? 'bg-blue-500/30' : 'bg-gray-700'}
                  `}>
                    {tab.badge}
                  </span>
                )}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default Tabs;
