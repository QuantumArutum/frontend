import * as React from 'react';
import * as LabelPrimitive from '@radix-ui/react-label';

export interface LabelProps extends React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root> {
  className?: string;
}

export declare function Label(props: LabelProps): React.JSX.Element;
