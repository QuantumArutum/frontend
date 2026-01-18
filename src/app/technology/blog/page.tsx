'use client';

import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import '../../../i18n/index';

export default function TechBlog() {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [subscribeStatus, setSubscribeStatus] = useState<'idle' | 'loading' | 'success' | 'error'>(
    'idle'
  );
  const [subscribeMessage, setSubscribeMessage] = useState('');

  const handleSubscribe = async () => {
    if (!email.trim()) {
      setSubscribeStatus('error');
      setSubscribeMessage(t('blog.newsletter.errorEmpty', 'Please enter your email'));
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setSubscribeStatus('error');
      setSubscribeMessage(t('blog.newsletter.errorInvalid', 'Please enter a valid email'));
      return;
    }

    setSubscribeStatus('loading');
    setSubscribeMessage('');

    try {
      const response = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), source: 'blog' }),
      });

      const data = await response.json();

      if (data.success) {
        setSubscribeStatus('success');
        setSubscribeMessage(t('blog.newsletter.success', 'Successfully subscribed!'));
        setEmail('');
        setTimeout(() => {
          setSubscribeStatus('idle');
          setSubscribeMessage('');
        }, 3000);
      } else {
        setSubscribeStatus('error');
        setSubscribeMessage(data.error || t('blog.newsletter.errorFailed', 'Subscription failed'));
      }
    } catch {
      setSubscribeStatus('error');
      setSubscribeMessage(t('blog.newsletter.errorFailed', 'Subscription failed'));
    }
  };

  const blogPosts = [
    {
      id: 1,
      title: t('blog.posts.quantum.title', '量子计算时代的区块链安全'),
      excerpt: t(
        'blog.posts.quantum.excerpt',
        '探讨量子计算对传统密码学的威胁，以及Quantaureum如何提供解决方案。'
      ),
      date: '2024-01-15',
      category: t('blog.categories.security', '安全'),
      readTime: '8 min',
    },
    {
      id: 2,
      title: t('blog.posts.dilithium.title', 'CRYSTALS-Dilithium：下一代数字签名'),
      excerpt: t(
        'blog.posts.dilithium.excerpt',
        '深入了解我们采用的后量子数字签名算法及其技术优势。'
      ),
      date: '2024-01-10',
      category: t('blog.categories.technology', '技术'),
      readTime: '12 min',
    },
    {
      id: 3,
      title: t('blog.posts.crosschain.title', '跨链互操作性的量子安全实现'),
      excerpt: t(
        'blog.posts.crosschain.excerpt',
        '介绍Quantaureum如何在保证量子安全的前提下实现跨链功能。'
      ),
      date: '2024-01-05',
      category: t('blog.categories.innovation', '创新'),
      readTime: '10 min',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-white mb-4">{t('blog.title', '技术博客')}</h1>
            <p className="text-xl text-gray-300">
              {t('blog.subtitle', '探索量子安全区块链技术的前沿发展')}
            </p>
          </div>

          {/* Featured Post */}
          <div className="mb-12">
            <div className="bg-gradient-to-r from-purple-600/20 to-cyan-600/20 backdrop-blur-md rounded-2xl p-8 border border-white/20">
              <div className="flex items-center gap-4 mb-4">
                <span className="bg-gradient-to-r from-purple-600 to-cyan-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                  {t('blog.featured', '精选文章')}
                </span>
                <span className="text-gray-400 text-sm">2024-01-20</span>
              </div>
              <h2 className="text-3xl font-bold text-white mb-4">
                {t('blog.featured.title', 'Quantaureum主网正式上线：开启量子安全区块链新时代')}
              </h2>
              <p className="text-gray-300 text-lg leading-relaxed mb-6">
                {t(
                  'blog.featured.excerpt',
                  '经过两年的精心开发和测试，Quantaureum主网今日正式上线。这标志着全球首个企业级后量子密码学区块链平台的诞生，为即将到来的量子计算时代提供了坚实的安全保障。'
                )}
              </p>
              <a
                href="/technology/blog/mainnet-launch"
                className="inline-block bg-gradient-to-r from-purple-600 to-cyan-600 text-white px-6 py-3 rounded-lg font-medium hover:from-purple-700 hover:to-cyan-700 transition-all duration-200"
              >
                {t('blog.readMore', '阅读全文')}
              </a>
            </div>
          </div>

          {/* Blog Posts Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {blogPosts.map((post) => (
              <article
                key={post.id}
                className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 hover:border-cyan-400/50 transition-all duration-200"
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="bg-purple-600/20 text-purple-300 px-3 py-1 rounded-full text-sm">
                    {post.category}
                  </span>
                  <span className="text-gray-400 text-sm">{post.readTime}</span>
                </div>

                <h3 className="text-xl font-semibold text-white mb-3 line-clamp-2">{post.title}</h3>

                <p className="text-gray-300 mb-4 line-clamp-3">{post.excerpt}</p>

                <div className="flex items-center justify-between">
                  <span className="text-gray-400 text-sm">{post.date}</span>
                  <a
                    href={`/technology/blog/${post.id}`}
                    className="text-cyan-400 hover:text-cyan-300 font-medium transition-colors"
                  >
                    {t('blog.readMore', '阅读全文')} →
                  </a>
                </div>
              </article>
            ))}
          </div>

          {/* Categories */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <h3 className="text-2xl font-semibold text-white mb-6">
              {t('blog.categories.title', '文章分类')}
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <a
                href="/technology/blog/category/security"
                className="bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 px-4 py-3 rounded-lg text-center transition-colors"
              >
                {t('blog.categories.security', '安全')}
              </a>
              <a
                href="/technology/blog/category/technology"
                className="bg-cyan-600/20 hover:bg-cyan-600/30 text-cyan-300 px-4 py-3 rounded-lg text-center transition-colors"
              >
                {t('blog.categories.technology', '技术')}
              </a>
              <a
                href="/technology/blog/category/innovation"
                className="bg-green-600/20 hover:bg-green-600/30 text-green-300 px-4 py-3 rounded-lg text-center transition-colors"
              >
                {t('blog.categories.innovation', '创新')}
              </a>
              <a
                href="/technology/blog/category/research"
                className="bg-yellow-600/20 hover:bg-yellow-600/30 text-yellow-300 px-4 py-3 rounded-lg text-center transition-colors"
              >
                {t('blog.categories.research', '研究')}
              </a>
            </div>
          </div>

          {/* Newsletter Subscription */}
          <div className="mt-12 bg-gradient-to-r from-purple-600/20 to-cyan-600/20 backdrop-blur-md rounded-2xl p-8 border border-white/20 text-center">
            <h3 className="text-2xl font-semibold text-white mb-4">
              {t('blog.newsletter.title', '订阅技术更新')}
            </h3>
            <p className="text-gray-300 mb-6">
              {t('blog.newsletter.description', '第一时间获取最新的技术文章和产品更新')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSubscribe()}
                placeholder={t('blog.newsletter.placeholder', '输入您的邮箱')}
                disabled={subscribeStatus === 'loading'}
                className="flex-1 bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400 disabled:opacity-50"
              />
              <button
                onClick={handleSubscribe}
                disabled={subscribeStatus === 'loading'}
                className="bg-gradient-to-r from-purple-600 to-cyan-600 text-white px-6 py-3 rounded-lg font-medium hover:from-purple-700 hover:to-cyan-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {subscribeStatus === 'loading'
                  ? t('blog.newsletter.subscribing', 'Subscribing...')
                  : t('blog.newsletter.subscribe', '订阅')}
              </button>
            </div>
            {subscribeMessage && (
              <p
                className={`mt-3 text-sm ${subscribeStatus === 'success' ? 'text-green-400' : 'text-red-400'}`}
              >
                {subscribeMessage}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
