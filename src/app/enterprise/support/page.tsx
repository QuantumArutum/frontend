'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  FaHeadset,
  FaBook,
  FaVideo,
  FaComments,
  FaTicketAlt,
  FaClock,
  FaCheckCircle,
  FaPhone,
  FaEnvelope,
  FaGlobe,
  FaStar,
} from 'react-icons/fa';
import EnhancedNavbar from '@/app/components/EnhancedNavbar';
import EnhancedFooter from '@/app/components/EnhancedFooter';
import ParticlesBackground from '@/app/components/ParticlesBackground';
import { useTranslation } from 'react-i18next';
import '../../../i18n';

/* eslint-disable @typescript-eslint/no-explicit-any */
const getSupportPlans = (t: any) => [
  {
    name: t('enterprise.support.plans.basic.name'),
    price: t('enterprise.support.plans.basic.price'),
    description: t('enterprise.support.plans.basic.desc'),
    features: t('enterprise.support.plans.basic.features', { returnObjects: true }) as string[],
    highlighted: false,
  },
  {
    name: t('enterprise.support.plans.professional.name'),
    price: t('enterprise.support.plans.professional.price'),
    description: t('enterprise.support.plans.professional.desc'),
    features: t('enterprise.support.plans.professional.features', {
      returnObjects: true,
    }) as string[],
    highlighted: true,
  },
  {
    name: t('enterprise.support.plans.enterprise.name'),
    price: t('enterprise.support.plans.enterprise.price'),
    description: t('enterprise.support.plans.enterprise.desc'),
    features: t('enterprise.support.plans.enterprise.features', {
      returnObjects: true,
    }) as string[],
    highlighted: false,
  },
];

const getSupportChannels = (t: any) => [
  {
    icon: FaTicketAlt,
    title: t('enterprise.support.channels.ticket.title'),
    description: t('enterprise.support.channels.ticket.desc'),
    action: t('enterprise.support.channels.ticket.action'),
    link: '/contact',
  },
  {
    icon: FaComments,
    title: t('enterprise.support.channels.chat.title'),
    description: t('enterprise.support.channels.chat.desc'),
    action: t('enterprise.support.channels.chat.action'),
    link: '#',
  },
  {
    icon: FaPhone,
    title: t('enterprise.support.channels.phone.title'),
    description: t('enterprise.support.channels.phone.desc'),
    action: '+86 400-XXX-XXXX',
    link: 'tel:+86400XXXXXXX',
  },
  {
    icon: FaEnvelope,
    title: t('enterprise.support.channels.email.title'),
    description: t('enterprise.support.channels.email.desc'),
    action: 'support@quantaureum.com',
    link: 'mailto:support@quantaureum.com',
  },
];

const getResources = (t: any) => [
  {
    icon: FaBook,
    title: t('enterprise.support.resources.docs.title'),
    description: t('enterprise.support.resources.docs.desc'),
    link: '/developers/docs',
  },
  {
    icon: FaVideo,
    title: t('enterprise.support.resources.videos.title'),
    description: t('enterprise.support.resources.videos.desc'),
    link: '/developers/docs',
  },
  {
    icon: FaGlobe,
    title: t('enterprise.support.resources.kb.title'),
    description: t('enterprise.support.resources.kb.desc'),
    link: '/faq',
  },
  {
    icon: FaComments,
    title: t('enterprise.support.resources.forum.title'),
    description: t('enterprise.support.resources.forum.desc'),
    link: '/community/forum',
  },
];

const getFaqs = (t: any) => {
  const faqItems = t('enterprise.support.faqs.items', { returnObjects: true }) as Array<{
    question: string;
    answer: string;
  }>;
  return faqItems;
};

export default function EnterpriseSupportPage() {
  const { t } = useTranslation();
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const supportPlans = getSupportPlans(t);
  const supportChannels = getSupportChannels(t);
  const resources = getResources(t);
  const faqs = getFaqs(t);

  return (
    <div className="min-h-screen relative">
      <ParticlesBackground />
      <EnhancedNavbar />
      <div className="relative z-10">
        {/* Hero Section */}
        <section className="pt-24 pb-16 px-4">
          <div className="max-w-7xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <span className="inline-block px-4 py-2 bg-green-500/20 text-green-300 rounded-full text-sm mb-6">
                {t('enterprise.support.title')}
              </span>
              <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
                {t('enterprise.support.hero.title_prefix')}
                <span className="bg-gradient-to-r from-green-400 to-cyan-400 bg-clip-text text-transparent">
                  {' '}
                  {t('enterprise.support.hero.title_highlight')}{' '}
                </span>
                {t('enterprise.support.hero.title_suffix')}
              </h1>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
                {t('enterprise.support.subtitle')}
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link href="/contact">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-8 py-4 bg-gradient-to-r from-green-600 to-cyan-600 text-white rounded-xl font-semibold flex items-center gap-2"
                  >
                    <FaHeadset /> {t('enterprise.support.contact.title')}
                  </motion.button>
                </Link>
                <Link href="/faq">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-8 py-4 bg-white/10 text-white rounded-xl font-semibold border border-white/20"
                  >
                    {t('enterprise.support.view_faq')}
                  </motion.button>
                </Link>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Support Plans */}
        <section className="py-16 px-4">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl font-bold text-white text-center mb-4">
              {t('enterprise.support.plans_title')}
            </h2>
            <p className="text-gray-400 text-center mb-12">
              {t('enterprise.support.plans_subtitle')}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {supportPlans.map((plan, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`rounded-2xl p-8 ${
                    plan.highlighted
                      ? 'bg-gradient-to-b from-green-600/30 to-cyan-600/30 border-2 border-green-500/50'
                      : 'bg-white/5 border border-white/10'
                  }`}
                >
                  {plan.highlighted && (
                    <div className="flex items-center gap-2 text-green-400 text-sm mb-4">
                      <FaStar /> {t('enterprise.support.most_popular')}
                    </div>
                  )}
                  <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                  <div className="text-3xl font-bold text-green-400 mb-2">{plan.price}</div>
                  <p className="text-gray-400 mb-6">{plan.description}</p>
                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-gray-300">
                        <FaCheckCircle className="text-green-400 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Link href="/contact">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      className={`w-full py-3 rounded-xl font-semibold ${
                        plan.highlighted
                          ? 'bg-gradient-to-r from-green-600 to-cyan-600 text-white'
                          : 'bg-white/10 text-white border border-white/20'
                      }`}
                    >
                      {plan.price === t('enterprise.support.plans.enterprise.price')
                        ? t('enterprise.support.contact_sales')
                        : t('enterprise.support.get_started')}
                    </motion.button>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Support Channels */}
        <section className="py-16 px-4 bg-black/30">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl font-bold text-white text-center mb-4">
              {t('enterprise.support.channels_title')}
            </h2>
            <p className="text-gray-400 text-center mb-12">
              {t('enterprise.support.channels_subtitle')}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {supportChannels.map((channel, index) => {
                const IconComponent = channel.icon;
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 p-6 text-center hover:border-green-500/50 transition-all"
                  >
                    <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-4">
                      <IconComponent className="text-2xl text-green-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-2">{channel.title}</h3>
                    <p className="text-gray-400 text-sm mb-4">{channel.description}</p>
                    <Link href={channel.link}>
                      <span className="text-green-400 hover:text-green-300 text-sm font-medium">
                        {channel.action}
                      </span>
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Resources */}
        <section className="py-16 px-4">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl font-bold text-white text-center mb-4">
              {t('enterprise.support.resources_title')}
            </h2>
            <p className="text-gray-400 text-center mb-12">
              {t('enterprise.support.resources_subtitle')}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {resources.map((resource, index) => {
                const IconComponent = resource.icon;
                return (
                  <Link key={index} href={resource.link}>
                    <motion.div
                      whileHover={{ y: -5 }}
                      className="bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 p-6 hover:border-cyan-500/50 transition-all cursor-pointer h-full"
                    >
                      <IconComponent className="text-3xl text-cyan-400 mb-4" />
                      <h3 className="text-lg font-semibold text-white mb-2">{resource.title}</h3>
                      <p className="text-gray-400 text-sm">{resource.description}</p>
                    </motion.div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-16 px-4 bg-black/30">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-white text-center mb-4">
              {t('enterprise.support.faqs.title')}
            </h2>
            <p className="text-gray-400 text-center mb-12">
              {t('enterprise.support.faqs.subtitle')}
            </p>
            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  className="bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 overflow-hidden"
                >
                  <button
                    onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                    className="w-full p-4 text-left flex items-center justify-between"
                  >
                    <span className="text-white font-medium">{faq.question}</span>
                    <span className="text-gray-400">{expandedFaq === index ? '−' : '+'}</span>
                  </button>
                  {expandedFaq === index && (
                    <div className="px-4 pb-4 text-gray-300">{faq.answer}</div>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-r from-green-600/20 to-cyan-600/20 rounded-3xl border border-green-500/30 p-12"
            >
              <FaClock className="text-5xl text-green-400 mx-auto mb-6" />
              <h2 className="text-3xl font-bold text-white mb-4">
                {t('enterprise.support.cta.title')}
              </h2>
              <p className="text-gray-300 mb-8">{t('enterprise.support.cta.subtitle')}</p>
              <Link href="/contact">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  className="px-8 py-4 bg-gradient-to-r from-green-600 to-cyan-600 text-white rounded-xl font-semibold"
                >
                  {t('enterprise.support.cta.button')}
                </motion.button>
              </Link>
            </motion.div>
          </div>
        </section>
      </div>
      <EnhancedFooter />
    </div>
  );
}
