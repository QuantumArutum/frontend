'use client';

import React from 'react';
import { useTranslation } from 'react-i18next';
import EnhancedNavbar from '@/app/components/EnhancedNavbar';
import EnhancedFooter from '../components/EnhancedFooter';
import ParticlesBackground from '../components/ParticlesBackground';

export default function About() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-quantum-dark relative">
      <ParticlesBackground />
      <div className="relative z-10">
      <EnhancedNavbar />
      
      {/* Hero Section */}
      <section className="pt-24 pb-16 bg-gradient-to-br from-quantum-dark via-quantum-dark-secondary to-quantum-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-quantum-light mb-6">
              {t('about.title')}
            </h1>
            <p className="text-xl text-quantum-secondary max-w-3xl mx-auto">
              {t('about.subtitle')}
            </p>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-quantum-light mb-6">{t('about.mission.title')}</h2>
              <p className="text-quantum-secondary text-lg mb-6">
                {t('about.mission.desc1')}
              </p>
              <p className="text-quantum-secondary text-lg">
                {t('about.mission.desc2')}
              </p>
            </div>
            <div className="quantum-card p-8">
              <div className="text-center">
                <div className="w-24 h-24 mx-auto mb-6 bg-quantum-gradient-primary rounded-full flex items-center justify-center">
                  <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-quantum-light mb-4">{t('about.mission.card.title')}</h3>
                <p className="text-quantum-secondary">
                  {t('about.mission.card.desc')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Vision Section */}
      <section className="py-16 bg-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-quantum-light mb-6">{t('about.vision.title')}</h2>
            <p className="text-xl text-quantum-secondary max-w-3xl mx-auto">
              {t('about.vision.subtitle')}
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="quantum-card p-6 text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-quantum-gradient-primary rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-quantum-light mb-2">{t('about.vision.safety.title')}</h3>
              <p className="text-quantum-secondary">
                {t('about.vision.safety.desc')}
              </p>
            </div>

            <div className="quantum-card p-6 text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-quantum-gradient-secondary rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-quantum-light mb-2">{t('about.vision.user.title')}</h3>
              <p className="text-quantum-secondary">
                {t('about.vision.user.desc')}
              </p>
            </div>

            <div className="quantum-card p-6 text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-quantum-gradient-accent rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-quantum-light mb-2">{t('about.vision.innovation.title')}</h3>
              <p className="text-quantum-secondary">
                {t('about.vision.innovation.desc')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-quantum-light mb-6">{t('about.team.title')}</h2>
            <p className="text-xl text-quantum-secondary max-w-3xl mx-auto">
              {t('about.team.subtitle')}
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-32 h-32 mx-auto mb-4 bg-quantum-gradient-primary rounded-full flex items-center justify-center">
                <span className="text-4xl text-white">👨‍💼</span>
              </div>
              <h3 className="text-xl font-bold text-quantum-light mb-2">{t('about.team.ceo.title')}</h3>
              <p className="text-quantum-secondary mb-2">{t('about.team.ceo.role')}</p>
              <p className="text-sm text-quantum-secondary">{t('about.team.ceo.desc')}</p>
            </div>

            <div className="text-center">
              <div className="w-32 h-32 mx-auto mb-4 bg-quantum-gradient-secondary rounded-full flex items-center justify-center">
                <span className="text-4xl text-white">👨‍💻</span>
              </div>
              <h3 className="text-xl font-bold text-quantum-light mb-2">{t('about.team.cto.title')}</h3>
              <p className="text-quantum-secondary mb-2">{t('about.team.cto.role')}</p>
              <p className="text-sm text-quantum-secondary">{t('about.team.cto.desc')}</p>
            </div>

            <div className="text-center">
              <div className="w-32 h-32 mx-auto mb-4 bg-quantum-gradient-accent rounded-full flex items-center justify-center">
                <span className="text-4xl text-white">👩‍🔬</span>
              </div>
              <h3 className="text-xl font-bold text-quantum-light mb-2">{t('about.team.scientist.title')}</h3>
              <p className="text-quantum-secondary mb-2">{t('about.team.scientist.role')}</p>
              <p className="text-sm text-quantum-secondary">{t('about.team.scientist.desc')}</p>
            </div>

            <div className="text-center">
              <div className="w-32 h-32 mx-auto mb-4 bg-quantum-gradient-primary rounded-full flex items-center justify-center">
                <span className="text-4xl text-white">👨‍💼</span>
              </div>
              <h3 className="text-xl font-bold text-quantum-light mb-2">{t('about.team.coo.title')}</h3>
              <p className="text-quantum-secondary mb-2">{t('about.team.coo.role')}</p>
              <p className="text-sm text-quantum-secondary">{t('about.team.coo.desc')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 bg-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-quantum-light mb-6">{t('about.contact.title')}</h2>
            <p className="text-xl text-quantum-secondary mb-8 max-w-3xl mx-auto">
              {t('about.contact.subtitle')}
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="quantum-card p-6 text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-quantum-gradient-primary rounded-full flex items-center justify-center">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-quantum-light mb-2">{t('about.contact.email')}</h3>
                <p className="text-quantum-secondary">contact@quantaureum.com</p>
              </div>

              <div className="quantum-card p-6 text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-quantum-gradient-secondary rounded-full flex items-center justify-center">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-quantum-light mb-2">{t('about.contact.address')}</h3>
                <p className="text-quantum-secondary">{t('about.contact.address_val')}</p>
              </div>

              <div className="quantum-card p-6 text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-quantum-gradient-accent rounded-full flex items-center justify-center">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-quantum-light mb-2">{t('about.contact.community')}</h3>
                <p className="text-quantum-secondary">Telegram: @quantaureum</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <EnhancedFooter />
      </div>
    </div>
  );
}

