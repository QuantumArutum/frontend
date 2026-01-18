'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import '@uiw/react-markdown-preview/markdown.css';

// 动态导入 MarkdownPreview 以避免 SSR 问题
const MDPreview = dynamic(() => import('@uiw/react-markdown-preview'), { ssr: false });

interface MarkdownPreviewProps {
  content: string;
}

export default function MarkdownPreview({ content }: MarkdownPreviewProps) {
  return (
    <div data-color-mode="dark" className="markdown-preview">
      <MDPreview source={content} />
    </div>
  );
}
