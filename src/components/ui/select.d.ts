import * as React from "react";

export interface SelectProps {
  children?: React.ReactNode;
  defaultValue?: string;
  value?: string;
  onValueChange?: (value: string) => void;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  disabled?: boolean;
  name?: string;
  required?: boolean;
}

export interface SelectGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
}

export interface SelectValueProps {
  placeholder?: string;
  children?: React.ReactNode;
}

export interface SelectTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string;
  size?: "default" | "sm";
  children?: React.ReactNode;
}

export interface SelectContentProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
  children?: React.ReactNode;
  position?: "popper" | "item-aligned";
}

export interface SelectLabelProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}

export interface SelectItemProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
  value: string;
  disabled?: boolean;
  children?: React.ReactNode;
}

export interface SelectSeparatorProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}

export interface SelectScrollButtonProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}

export declare function Select(props: SelectProps): JSX.Element;
export declare function SelectGroup(props: SelectGroupProps): JSX.Element;
export declare function SelectValue(props: SelectValueProps): JSX.Element;
export declare function SelectTrigger(props: SelectTriggerProps): JSX.Element;
export declare function SelectContent(props: SelectContentProps): JSX.Element;
export declare function SelectLabel(props: SelectLabelProps): JSX.Element;
export declare function SelectItem(props: SelectItemProps): JSX.Element;
export declare function SelectSeparator(props: SelectSeparatorProps): JSX.Element;
export declare function SelectScrollUpButton(props: SelectScrollButtonProps): JSX.Element;
export declare function SelectScrollDownButton(props: SelectScrollButtonProps): JSX.Element;
