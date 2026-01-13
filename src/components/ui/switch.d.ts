import * as React from 'react';
import * as SwitchPrimitive from '@radix-ui/react-switch';

export interface SwitchProps extends React.ComponentPropsWithoutRef<typeof SwitchPrimitive.Root> {
  className?: string;
}

export declare function Switch(props: SwitchProps): React.JSX.Element;
