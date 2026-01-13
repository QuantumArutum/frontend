import * as React from "react";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}

export interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}

export interface CardTitleProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}

export interface CardDescriptionProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}

export interface CardActionProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}

export interface CardContentProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}

export interface CardFooterProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}

export declare function Card(props: CardProps): JSX.Element;
export declare function CardHeader(props: CardHeaderProps): JSX.Element;
export declare function CardTitle(props: CardTitleProps): JSX.Element;
export declare function CardDescription(props: CardDescriptionProps): JSX.Element;
export declare function CardAction(props: CardActionProps): JSX.Element;
export declare function CardContent(props: CardContentProps): JSX.Element;
export declare function CardFooter(props: CardFooterProps): JSX.Element;
