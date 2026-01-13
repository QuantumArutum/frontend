'use client';

import React from 'react';
import { AlertCircle, CheckCircle, Info, AlertTriangle, X } from 'lucide-react';

export interface AlertProps {
  variant?: 'default' | 'destructive' | 'success' | 'warning' | 'info';
  className?: string;
  children?: React.ReactNode;
  title?: string;
  description?: string;
  onClose?: () => void;
  icon?: React.ReactNode;
}

const variantStyles = {
  default: 'bg-gray-800/50 border-gray-700 text-gray-100',
  destructive: 'bg-red-900/20 border-red-500/50 text-red-200',
  success: 'bg-green-900/20 border-green-500/50 text-green-200',
  warning: 'bg-yellow-900/20 border-yellow-500/50 text-yellow-200',
  info: 'bg-blue-900/20 border-blue-500/50 text-blue-200',
};

const variantIcons = {
  default: <Info className="w-5 h-5" />,
  destructive: <AlertCircle className="w-5 h-5" />,
  success: <CheckCircle className="w-5 h-5" />,
  warning: <AlertTriangle className="w-5 h-5" />,
  info: <Info className="w-5 h-5" />,
};

export const Alert: React.FC<AlertProps> = ({
  variant = 'default',
  className = '',
  children,
  title,
  description,
  onClose,
  icon,
}) => {
  const displayIcon = icon || variantIcons[variant];

  return (
    <div
      role="alert"
      className={`
        relative flex gap-3 p-4 rounded-lg border backdrop-blur-sm
        ${variantStyles[variant]}
        ${className}
      `}
    >
      {displayIcon && (
        <div className="flex-shrink-0 mt-0.5">
          {displayIcon}
        </div>
      )}
      <div className="flex-1 min-w-0">
        {title && (
          <AlertTitle>{title}</AlertTitle>
        )}
        {description && (
          <AlertDescription>{description}</AlertDescription>
        )}
        {children}
      </div>
      {onClose && (
        <button
          onClick={onClose}
          className="flex-shrink-0 p-1 rounded hover:bg-white/10 transition-colors"
          aria-label="Close alert"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};

export interface AlertTitleProps {
  className?: string;
  children: React.ReactNode;
}

export const AlertTitle: React.FC<AlertTitleProps> = ({ className = '', children }) => {
  return (
    <h5 className={`font-medium leading-none tracking-tight mb-1 ${className}`}>
      {children}
    </h5>
  );
};

export interface AlertDescriptionProps {
  className?: string;
  children: React.ReactNode;
}

export const AlertDescription: React.FC<AlertDescriptionProps> = ({ className = '', children }) => {
  return (
    <div className={`text-sm opacity-90 ${className}`}>
      {children}
    </div>
  );
};

export default Alert;
