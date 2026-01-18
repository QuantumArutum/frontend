'use client';

import React, { useRef } from 'react';
import dynamic from 'next/dynamic';
import { message } from 'antd';
import { barongAPI } from '@/api/client';
import '@uiw/react-md-editor/markdown-editor.css';
import '@uiw/react-markdown-preview/markdown.css';

// 动态导入 MDEditor 以避免 SSR 问题
const MDEditor = dynamic(() => import('@uiw/react-md-editor').then((mod) => mod.default), {
  ssr: false,
});

interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  height?: number;
}

export default function MarkdownEditor({
  value,
  onChange,
  placeholder = '开始编写你的内容...',
  height = 400,
}: MarkdownEditorProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = React.useState(false);

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      message.error('只支持 JPEG、PNG、GIF 和 WebP 格式的图片');
      return;
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      message.error('图片大小不能超过 5MB');
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('image', file);

      const response = await barongAPI.post('/public/community/upload-image', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data.success) {
        const imageUrl = response.data.data.url;
        const imageMarkdown = `![${file.name}](${imageUrl})`;

        // Insert image markdown at cursor position or end of content
        const newValue = value + '\n' + imageMarkdown + '\n';
        onChange(newValue);

        message.success('图片上传成功');
      } else {
        message.error(response.data.message || '图片上传失败');
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      message.error('图片上传失败');
    } finally {
      setUploading(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const triggerImageUpload = () => {
    fileInputRef.current?.click();
  };

  return (
    <div data-color-mode="dark">
      <div className="mb-2 flex items-center gap-2">
        <button
          type="button"
          onClick={triggerImageUpload}
          disabled={uploading}
          className="px-3 py-1.5 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 text-white text-sm rounded-lg transition-colors flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          {uploading ? '上传中...' : '上传图片'}
        </button>
        <span className="text-xs text-gray-400">支持 JPEG、PNG、GIF、WebP，最大 5MB</span>
      </div>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
        onChange={handleImageUpload}
        className="hidden"
      />
      <MDEditor
        value={value}
        onChange={(val) => onChange(val || '')}
        height={height}
        preview="live"
        textareaProps={{
          placeholder: placeholder,
        }}
        previewOptions={{
          rehypePlugins: [],
        }}
      />
    </div>
  );
}
