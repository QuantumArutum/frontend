'use client';
import React, { useState, useEffect } from 'react';
import { Card, Button, Input, List, Avatar, message, Tag, Typography, Divider } from 'antd';
import { LikeOutlined, LikeFilled, CommentOutlined, UserOutlined } from '@ant-design/icons';
import { useParams } from 'next/navigation';
import { barongAPI } from '../../../../api/client';
import ParticlesBackground from '../../../../app/components/ParticlesBackground';
import CommunityNavbar from '../../../../components/community/CommunityNavbar';
import EnhancedFooter from '../../../../components/EnhancedFooter';

const { Title, Text } = Typography;
const { TextArea } = Input;

export default function PostDetailPage() {
  const params = useParams();
  const id = params?.id;
  const [post, setPost] = useState<any>(null);
  const [commentContent, setCommentContent] = useState('');
  const [liked, setLiked] = useState(false);

  const fetchPost = async () => {
    try {
      const res = await barongAPI.get(`/public/community/posts/${id}`);
      if (res.data.success) {
        setPost(res.data.data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (id) fetchPost();
  }, [id]);

  const handleComment = async () => {
    if (!commentContent) return;
    try {
      const res = await barongAPI.post(`/public/community/posts/${id}/comments`, { content: commentContent });
      if (res.data.success) {
        message.success('Comment posted');
        setCommentContent('');
        fetchPost();
      }
    } catch (err) {
      message.error('Failed to post comment. Please login.');
    }
  };

  const handleLike = async () => {
    try {
      const res = await barongAPI.post(`/public/community/posts/${id}/like`);
      if (res.data.success) {
        setLiked(res.data.liked);
        fetchPost();
      }
    } catch (err) {
      message.error('Login required to like');
    }
  };

  if (!post) return (
    <div className="min-h-screen relative">
      <ParticlesBackground />
      <CommunityNavbar />
      <div className="text-white p-12 text-center">Loading...</div>
    </div>
  );

  return (
    <div className="min-h-screen relative">
      <ParticlesBackground />
      <CommunityNavbar />
      <div className="relative z-10">
    <div className="container mx-auto px-4 py-8">
      <Card className="bg-gray-900 border-gray-800 text-white mb-6">
        <div className="flex items-center mb-4">
          <Avatar size="large" icon={<UserOutlined />} className="bg-blue-500 mr-4" />
          <div>
            <Title level={3} style={{ color: 'white', margin: 0 }}>{post.title}</Title>
            <Text style={{ color: '#9CA3AF' }}>
              Posted by {post.author_email} • {new Date(post.created_at).toLocaleString()}
            </Text>
          </div>
        </div>
        
        <div className="text-lg mb-8 whitespace-pre-wrap leading-relaxed" style={{ color: 'white' }}>
          {post.content}
        </div>

        <div className="flex gap-4">
          <Button 
            type={liked ? 'primary' : 'default'} 
            icon={liked ? <LikeFilled /> : <LikeOutlined />} 
            onClick={handleLike}
            className={liked ? '' : 'bg-transparent text-gray-300 border-gray-600'}
          >
            {post.likes_count} Likes
          </Button>
          <Button icon={<CommentOutlined />} className="bg-transparent text-gray-300 border-gray-600">
            {post.comments_count} Comments
          </Button>
        </div>
      </Card>

      <div className="mb-8">
        <Title level={4} style={{ color: 'white', marginBottom: '16px' }}>Leave a Comment</Title>
        <TextArea 
          rows={4} 
          value={commentContent}
          onChange={e => setCommentContent(e.target.value)}
          placeholder="Share your thoughts..."
          style={{ backgroundColor: '#1f2937', color: 'white', borderColor: '#374151', marginBottom: '16px' }}
        />
        <Button type="primary" onClick={handleComment}>Post Comment</Button>
      </div>

      <List
        className="bg-gray-900 rounded-lg p-6 border border-gray-800"
        itemLayout="horizontal"
        dataSource={post.comments}
        renderItem={(item: any) => (
          <List.Item className="border-b border-gray-800 last:border-0">
            <List.Item.Meta
              avatar={<Avatar icon={<UserOutlined />} />}
              title={<span style={{ color: '#D1D5DB' }}>{item.user_email} <span style={{ color: '#6B7280', fontSize: '12px', marginLeft: '8px' }}>{new Date(item.created_at).toLocaleString()}</span></span>}
              description={<span style={{ color: 'white', fontSize: '16px', marginTop: '4px', display: 'block' }}>{item.content}</span>}
            />
          </List.Item>
        )}
      />
    </div>
    </div>
    <EnhancedFooter />
    </div>
  );
}
