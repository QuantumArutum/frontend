'use client';

import React, { forwardRef } from 'react';
import { LucideIcon, Eye, EyeOff } from 'lucide-react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  icon?: LucideIcon | React.ReactNode;
  iconPosition?: 'left' | 'right';
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    { label, error, hint, icon: Icon, iconPosition = 'left', className = '', type, ...props },
    ref
  ) => {
    const [showPassword, setShowPassword] = React.useState(false);
    const isPassword = type === 'password';
    const inputType = isPassword ? (showPassword ? 'text' : 'password') : type;

    const renderIcon = () => {
      if (!Icon) return null;
      if (React.isValidElement(Icon)) return Icon;
      const IconComponent = Icon as LucideIcon;
      return <IconComponent className="w-5 h-5" />;
    };

    return (
      <div className="w-full">
        {label && <label className="block text-sm font-medium text-gray-300 mb-2">{label}</label>}
        <div className="relative">
          {Icon && iconPosition === 'left' && (
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
              {renderIcon()}
            </div>
          )}
          <input
            ref={ref}
            type={inputType}
            className={`
            w-full bg-gray-800/50 border rounded-xl px-4 py-3 text-white placeholder-gray-500
            focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500
            transition-all duration-200
            ${Icon && iconPosition === 'left' ? 'pl-12' : ''}
            ${(Icon && iconPosition === 'right') || isPassword ? 'pr-12' : ''}
            ${error ? 'border-red-500' : 'border-gray-700'}
            ${className}
          `}
            {...props}
          />
          {isPassword && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-300"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          )}
          {Icon && iconPosition === 'right' && !isPassword && (
            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
              {renderIcon()}
            </div>
          )}
        </div>
        {error && <p className="mt-2 text-sm text-red-400">{error}</p>}
        {hint && !error && <p className="mt-2 text-sm text-gray-500">{hint}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';

// 文本域
interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, hint, className = '', ...props }, ref) => {
    return (
      <div className="w-full">
        {label && <label className="block text-sm font-medium text-gray-300 mb-2">{label}</label>}
        <textarea
          ref={ref}
          className={`
          w-full bg-gray-800/50 border rounded-xl px-4 py-3 text-white placeholder-gray-500
          focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500
          transition-all duration-200 resize-none
          ${error ? 'border-red-500' : 'border-gray-700'}
          ${className}
        `}
          {...props}
        />
        {error && <p className="mt-2 text-sm text-red-400">{error}</p>}
        {hint && !error && <p className="mt-2 text-sm text-gray-500">{hint}</p>}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';

// 选择框
interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: Array<{ value: string; label: string }>;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, options, className = '', ...props }, ref) => {
    return (
      <div className="w-full">
        {label && <label className="block text-sm font-medium text-gray-300 mb-2">{label}</label>}
        <select
          ref={ref}
          className={`
          w-full bg-gray-800/50 border rounded-xl px-4 py-3 text-white
          focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500
          transition-all duration-200
          ${error ? 'border-red-500' : 'border-gray-700'}
          ${className}
        `}
          {...props}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value} className="bg-gray-800">
              {option.label}
            </option>
          ))}
        </select>
        {error && <p className="mt-2 text-sm text-red-400">{error}</p>}
      </div>
    );
  }
);

Select.displayName = 'Select';

export default Input;
