'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';

export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';

export default function PostDetailPage() {
  const params = useParams();
  const postId = params.postId as string;
  const [post, setPost] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadPost = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/v2/barong/public/community/post-detail?postId=${postId}`);
        const data = await response.json();
        
        if (data.success) {
          setPost(data.data);
        } else {
          setError('Failed to load post');
        }
      } catch (err) {
        console.error('Error:', err);
        setError('Failed to load post');
      } finally {
        setLoading(false);
      }
    };

    if (postId) {
      loadPost();
    }
  }, [postId]);

  if (loading) {
    return (
      <div style={{ padding: '40px', color: 'white', backgroundColor: '#0f172a', minHeight: '100vh' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div style={{ padding: '40px', color: 'white', backgroundColor: '#0f172a', minHeight: '100vh' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <h1>Error</h1>
          <p>{error || 'Post not found'}</p>
          <Link href="/community" style={{ color: '#60a5fa' }}>Back to Community</Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: '40px', color: 'white', backgroundColor: '#0f172a', minHeight: '100vh' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <Link href="/community" style={{ color: '#60a5fa', marginBottom: '20px', display: 'inline-block' }}>
          ← Back to Community
        </Link>
        
        <h1 style={{ fontSize: '32px', marginBottom: '20px' }}>{post.title}</h1>
        
        <div style={{ marginBottom: '20px', color: '#94a3b8' }}>
          <span>By {post.userName}</span>
          <span style={{ margin: '0 10px' }}>•</span>
          <span>{post.viewCount} views</span>
          <span style={{ margin: '0 10px' }}>•</span>
          <span>{post.likeCount} likes</span>
          <span style={{ margin: '0 10px' }}>•</span>
          <span>{post.commentCount} comments</span>
        </div>
        
        <div style={{ 
          whiteSpace: 'pre-wrap', 
          lineHeight: '1.6',
          padding: '20px',
          backgroundColor: 'rgba(255,255,255,0.05)',
          borderRadius: '8px'
        }}>
          {post.content}
        </div>
        
        <div style={{ marginTop: '40px' }}>
          <h2 style={{ fontSize: '24px', marginBottom: '20px' }}>Comments ({post.commentCount})</h2>
          <p style={{ color: '#94a3b8' }}>Comment system will be added here</p>
        </div>
      </div>
    </div>
  );
}
