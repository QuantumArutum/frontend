'use client';

import React, { useState } from 'react';
import { useServerInsertedHTML } from 'next/navigation';
import { ServerStyleSheet, StyleSheetManager } from 'styled-components';
import isPropValid from '@emotion/is-prop-valid';

export default function StyledComponentsRegistry({ children }: { children: React.ReactNode }) {
  // Only create stylesheet once per render
  const [styledComponentsStyleSheet] = useState(() => new ServerStyleSheet());

  useServerInsertedHTML(() => {
    const styles = styledComponentsStyleSheet.getStyleElement();
    styledComponentsStyleSheet.instance.clearTag();
    return <>{styles}</>;
  });

  const shouldForwardProp = (propName: string, target: unknown): boolean => {
    // 过滤 framer-motion 的 props
    if (
      propName.startsWith('while') ||
      propName.startsWith('initial') ||
      propName.startsWith('animate') ||
      propName.startsWith('exit') ||
      propName.startsWith('transition') ||
      propName.startsWith('variants')
    ) {
      return false;
    }
    // 过滤掉自定义的布局 props，这些 props 仅用于 styled-components 内部逻辑
    if (['primary', 'isOpen', 'danger'].includes(propName)) {
      return false;
    }
    // 默认行为：如果 prop 是有效的 HTML 属性，则转发
    return isPropValid(propName);
  };

  return <StyleSheetManager shouldForwardProp={shouldForwardProp}>{children}</StyleSheetManager>;
}
