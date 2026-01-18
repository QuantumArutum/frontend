'use client';

import React from 'react';

export interface SeparatorProps {
  className?: string;
  orientation?: 'horizontal' | 'vertical';
  decorative?: boolean;
}

export const Separator: React.FC<SeparatorProps> = ({
  className = '',
  orientation = 'horizontal',
  decorative = true,
}) => {
  const isHorizontal = orientation === 'horizontal';

  return (
    <div
      role={decorative ? 'none' : 'separator'}
      aria-orientation={decorative ? undefined : orientation}
      className={`
        shrink-0 bg-gray-700/50
        ${isHorizontal ? 'h-[1px] w-full' : 'h-full w-[1px]'}
        ${className}
      `}
    />
  );
};

export default Separator;
