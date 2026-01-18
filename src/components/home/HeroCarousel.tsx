'use client';
import React, { useEffect, useState } from 'react';
import { Button } from 'antd';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { barongAPI } from '@/api/client';

const HeroCarousel = () => {
  const [bannerData, setBannerData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch data from backend, but render with specific Hero styling
    barongAPI
      .get('/public/cms/banners')
      .then((res) => {
        if (res.data.success && res.data.data.length > 0) {
          // Take the first active banner
          const apiBanner = res.data.data[0];

          // Parse description if it contains pipe separator (Title|Subtitle) logic or similar
          // Our update script set description as "Subtitle|Long Description"
          let subtitle = 'Identity Protocol';
          let desc = 'Next-generation digital identity system built on decentralized identifiers.';

          if (apiBanner.description) {
            const parts = apiBanner.description.split('|');
            if (parts.length > 1) {
              subtitle = parts[0];
              desc = parts[1];
            } else {
              desc = apiBanner.description;
            }
          }

          setBannerData({
            title: apiBanner.title || 'Digital Sovereignty',
            subtitle: subtitle,
            description: desc,
            link_url: apiBanner.link_url || '/demo',
            button_text: 'Start Demo', // Could be added to DB too
          });
        }
      })
      .catch((err) => {
        console.warn('Failed to fetch hero content, using fallback', err);
        // Fallback is handled by initial state or below check
      })
      .finally(() => setLoading(false));
  }, []);

  // Default / Fallback Data (Backup Style)
  const content = bannerData || {
    title: 'Digital Sovereignty',
    subtitle: 'Identity Protocol',
    description:
      'Next-generation digital identity system built on decentralized identifiers. Unified, Immortal, Inalienable.',
    link_url: '/demo',
    button_text: 'Start Demo',
  };

  return (
    <div className="relative h-[600px] flex items-center justify-center overflow-hidden pointer-events-none">
      {/* Content Layer */}
      <div className="relative z-10 w-full px-4 max-w-5xl mx-auto text-center pointer-events-auto">
        <motion.div
          key={content.title} // Re-animate if title changes
          initial={{ opacity: 0, y: 30, filter: 'blur(10px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          <h1 className="text-5xl md:text-7xl font-extrabold mb-6 tracking-tight leading-tight">
            <span className="block text-white">{content.title}</span>
            <span
              className="block"
              style={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                textShadow: '0 0 40px rgba(118, 75, 162, 0.4)',
              }}
            >
              {content.subtitle}
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-gray-300 mb-10 leading-relaxed font-light max-w-3xl mx-auto">
            {content.description}
          </p>

          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link href={content.link_url}>
              <Button
                type="primary"
                size="large"
                shape="round"
                className="px-12 h-14 text-lg font-bold border-none"
                style={{
                  background: 'linear-gradient(90deg, #6E3CBC 0%, #00D4FF 100%)',
                  boxShadow: '0 10px 30px rgba(110, 60, 188, 0.4)',
                }}
              >
                {content.button_text}
              </Button>
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default HeroCarousel;
