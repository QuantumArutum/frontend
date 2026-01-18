import * as React from 'react';

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
  variant?: 'default' | 'secondary' | 'destructive' | 'outline' | string;
}

export declare function Badge(props: BadgeProps): JSX.Element;
