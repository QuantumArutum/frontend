'use client';

import React from 'react';
import EnhancedNavbar from '@/app/components/EnhancedNavbar';
import EnhancedFooter from '../../components/EnhancedFooter';
import ParticlesBackground from '../../components/ParticlesBackground';
import { useTranslation } from 'react-i18next';
import '../../../i18n';

export default function Whitepaper() {
  const { t } = useTranslation();

  const tocItems = t('technology.whitepaper_page.toc.items', { returnObjects: true }) as Array<{
    title: string;
    page: string;
  }>;
  const highlights = t('technology.whitepaper_page.highlights.items', {
    returnObjects: true,
  }) as Array<{ title: string; desc: string }>;
  const team = t('technology.whitepaper_page.team.members', { returnObjects: true }) as Array<{
    role: string;
    degree: string;
    background: string;
    emoji: string;
  }>;

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
                {t('technology.whitepaper_page.hero.title')}
              </h1>
              <p className="text-xl text-quantum-secondary max-w-3xl mx-auto">
                {t('technology.whitepaper_page.hero.subtitle')}
              </p>
            </div>
          </div>
        </section>

        {/* Download Section */}
        <section className="py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="quantum-card p-8 text-center">
              <div className="w-24 h-24 mx-auto mb-6 bg-quantum-gradient-primary rounded-full flex items-center justify-center">
                <svg
                  className="w-12 h-12 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <h2 className="text-3xl font-bold text-quantum-light mb-4">
                {t('technology.whitepaper_page.download.title')}
              </h2>
              <p className="text-quantum-secondary text-lg mb-8">
                {t('technology.whitepaper_page.download.desc')}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button className="quantum-btn quantum-btn-primary text-lg px-8 py-4">
                  {t('technology.whitepaper_page.download.pdf_btn')}
                </button>
                <button className="quantum-btn quantum-btn-secondary text-lg px-8 py-4">
                  {t('technology.whitepaper_page.download.online_btn')}
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Abstract */}
        <section className="py-16 bg-white/5">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-quantum-light mb-8 text-center">
              {t('technology.whitepaper_page.abstract.title')}
            </h2>
            <div className="quantum-card p-8">
              <p className="text-quantum-secondary text-lg leading-relaxed mb-6">
                {t('technology.whitepaper_page.abstract.p1')}
              </p>
              <p className="text-quantum-secondary text-lg leading-relaxed mb-6">
                {t('technology.whitepaper_page.abstract.p2')}
              </p>
              <p className="text-quantum-secondary text-lg leading-relaxed">
                {t('technology.whitepaper_page.abstract.p3')}
              </p>
            </div>
          </div>
        </section>

        {/* Table of Contents */}
        <section className="py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-quantum-light mb-8 text-center">
              {t('technology.whitepaper_page.toc.title')}
            </h2>
            <div className="quantum-card p-8">
              <div className="space-y-4">
                {tocItems.map((item, index) => (
                  <div
                    key={index}
                    className={`flex justify-between items-center py-3 ${index < tocItems.length - 1 ? 'border-b border-quantum-primary/20' : ''}`}
                  >
                    <span className="text-quantum-light font-medium">
                      {index + 1}. {item.title}
                    </span>
                    <span className="text-quantum-secondary">{item.page}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Key Features */}
        <section className="py-16 bg-white/5">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-quantum-light mb-12 text-center">
              {t('technology.whitepaper_page.highlights.title')}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {highlights.map((item, index) => (
                <div key={index} className="quantum-card p-6">
                  <div
                    className={`w-16 h-16 mb-4 ${index % 3 === 0 ? 'bg-quantum-gradient-primary' : index % 3 === 1 ? 'bg-quantum-gradient-secondary' : 'bg-quantum-gradient-accent'} rounded-full flex items-center justify-center`}
                  >
                    <svg
                      className="w-8 h-8 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      {index === 0 && (
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                        />
                      )}
                      {index === 1 && (
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                        />
                      )}
                      {index === 2 && (
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13 10V3L4 14h7v7l9-11h-7z"
                        />
                      )}
                      {index === 3 && (
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 9l3 3-3 3m13 0h-6m-2-5h6m2 5v6a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h14a2 2 0 012 2v1"
                        />
                      )}
                      {index === 4 && (
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                        />
                      )}
                      {index === 5 && (
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                        />
                      )}
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-quantum-light mb-3">{item.title}</h3>
                  <p className="text-quantum-secondary">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Research Team */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-quantum-light mb-12 text-center">
              {t('technology.whitepaper_page.team.title')}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {team.map((member, index) => (
                <div key={index} className="text-center">
                  <div
                    className={`w-32 h-32 mx-auto mb-4 ${index % 3 === 0 ? 'bg-quantum-gradient-primary' : index % 3 === 1 ? 'bg-quantum-gradient-secondary' : 'bg-quantum-gradient-accent'} rounded-full flex items-center justify-center`}
                  >
                    <span className="text-4xl text-white">{member.emoji}</span>
                  </div>
                  <h3 className="text-xl font-bold text-quantum-light mb-2">{member.role}</h3>
                  <p className="text-quantum-secondary mb-2">{member.degree}</p>
                  <p className="text-sm text-quantum-secondary">{member.background}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <EnhancedFooter />
      </div>
    </div>
  );
}
