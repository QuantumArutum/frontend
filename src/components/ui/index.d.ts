// Type definitions for UI components
import * as React from 'react';

// Generic component props that make className and other common props optional
type OptionalClassName<T> = Omit<T, 'className'> & { className?: string };

// Button - all props are optional
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string;
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link' | string;
  size?: 'default' | 'sm' | 'lg' | 'icon' | string;
  asChild?: boolean;
  children?: React.ReactNode;
}
export declare function Button(props: ButtonProps): JSX.Element;

// Tabs
export interface TabsProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
  defaultValue?: string;
  value?: string;
  onValueChange?: (value: string) => void;
}
export declare function Tabs(props: TabsProps): JSX.Element;

export interface TabsListProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}
export declare function TabsList(props: TabsListProps): JSX.Element;

export interface TabsTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string;
  value: string;
}
export declare function TabsTrigger(props: TabsTriggerProps): JSX.Element;

export interface TabsContentProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
  value: string;
}
export declare function TabsContent(props: TabsContentProps): JSX.Element;

// Select
export interface SelectProps {
  className?: string;
  defaultValue?: string;
  value?: string;
  onValueChange?: (value: string) => void;
  children?: React.ReactNode;
}
export declare function Select(props: SelectProps): JSX.Element;

export interface SelectTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string;
}
export declare function SelectTrigger(props: SelectTriggerProps): JSX.Element;

export interface SelectValueProps {
  className?: string;
  placeholder?: string;
}
export declare function SelectValue(props: SelectValueProps): JSX.Element;

export interface SelectContentProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
  position?: string;
}
export declare function SelectContent(props: SelectContentProps): JSX.Element;

export interface SelectItemProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
  value: string;
}
export declare function SelectItem(props: SelectItemProps): JSX.Element;
