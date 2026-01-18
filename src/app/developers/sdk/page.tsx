'use client';

import React from 'react';
import EnhancedNavbar from '@/app/components/EnhancedNavbar';
import EnhancedFooter from '@/app/components/EnhancedFooter';
import ParticlesBackground from '../../components/ParticlesBackground';
import { useTranslation } from 'react-i18next';
import '../../../i18n';

export default function SDK() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-quantum-dark relative">
      <ParticlesBackground />
      <div className="relative z-10">
        <EnhancedNavbar />

        <section className="pt-24 pb-16 bg-gradient-to-br from-quantum-dark via-quantum-dark-secondary to-quantum-dark">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-4xl md:text-6xl font-bold text-quantum-light mb-6">
                {t('sdk_page.title')}
              </h1>
              <p className="text-xl text-quantum-secondary max-w-3xl mx-auto">
                {t('sdk_page.subtitle')}
              </p>
            </div>
          </div>
        </section>

        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="quantum-card p-8 text-center relative overflow-hidden">
                <div className="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                  {t('sdk_page.available')}
                </div>
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
                      d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-quantum-light mb-4">
                  {t('sdk_page.sdks.typescript.title')}
                </h3>
                <p className="text-quantum-secondary mb-6">
                  {t('sdk_page.sdks.typescript.description')}
                </p>
                <div className="space-y-4">
                  <div className="text-sm text-quantum-accent">
                    {t('sdk_page.version')}: v0.1.0 | {t('sdk_page.size')}: ~100KB
                  </div>
                  <a
                    href="/downloads/quantaureum-sdk-0.1.0.zip"
                    download
                    className="w-full quantum-btn quantum-btn-primary inline-block"
                  >
                    {t('sdk_page.sdks.typescript.download')}
                  </a>
                  <div className="text-xs text-quantum-secondary">npm install @quantaureum/sdk</div>
                </div>
              </div>

              <div className="quantum-card p-8 text-center relative overflow-hidden">
                <div className="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                  {t('sdk_page.available')}
                </div>
                <div className="w-24 h-24 mx-auto mb-6 bg-quantum-gradient-secondary rounded-full flex items-center justify-center">
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
                      d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
                    />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-quantum-light mb-4">
                  {t('sdk_page.sdks.python.title')}
                </h3>
                <p className="text-quantum-secondary mb-6">
                  {t('sdk_page.sdks.python.description')}
                </p>
                <div className="space-y-4">
                  <div className="text-sm text-quantum-accent">
                    {t('sdk_page.version')}: v0.1.0 | Python 3.10+
                  </div>
                  <a
                    href="/downloads/quantaureum-0.1.0-py3-none-any.whl"
                    download
                    className="w-full quantum-btn quantum-btn-primary inline-block"
                  >
                    {t('sdk_page.sdks.python.download')}
                  </a>
                  <div className="text-xs text-quantum-secondary">pip install quantaureum</div>
                </div>
              </div>

              <div className="quantum-card p-8 text-center relative overflow-hidden">
                <div className="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                  {t('sdk_page.available')}
                </div>
                <div className="w-24 h-24 mx-auto mb-6 bg-quantum-gradient-accent rounded-full flex items-center justify-center">
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
                      d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z"
                    />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-quantum-light mb-4">
                  {t('sdk_page.sdks.go.title')}
                </h3>
                <p className="text-quantum-secondary mb-6">{t('sdk_page.sdks.go.description')}</p>
                <div className="space-y-4">
                  <div className="text-sm text-quantum-accent">
                    {t('sdk_page.version')}: v0.1.0 | Go 1.21+
                  </div>
                  <a
                    href="https://github.com/quantaureum/go-sdk"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full quantum-btn quantum-btn-primary inline-block"
                  >
                    {t('sdk_page.sdks.go.view')}
                  </a>
                  <div className="text-xs text-quantum-secondary">
                    go get github.com/quantaureum/go-sdk
                  </div>
                </div>
              </div>

              <div className="quantum-card p-8 text-center relative overflow-hidden">
                <div className="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                  {t('sdk_page.available')}
                </div>
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
                      d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-quantum-light mb-4">
                  {t('sdk_page.sdks.rust.title')}
                </h3>
                <p className="text-quantum-secondary mb-6">{t('sdk_page.sdks.rust.description')}</p>
                <div className="space-y-4">
                  <div className="text-sm text-quantum-accent">
                    {t('sdk_page.version')}: v0.1.0 | Rust 1.70+
                  </div>
                  <a
                    href="https://github.com/quantaureum/rust-sdk"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full quantum-btn quantum-btn-primary inline-block"
                  >
                    {t('sdk_page.sdks.rust.view')}
                  </a>
                  <div className="text-xs text-quantum-secondary">cargo add quantaureum-sdk</div>
                </div>
              </div>

              <div className="quantum-card p-8 text-center relative overflow-hidden">
                <div className="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                  {t('sdk_page.available')}
                </div>
                <div className="w-24 h-24 mx-auto mb-6 bg-quantum-gradient-secondary rounded-full flex items-center justify-center">
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
                      d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-quantum-light mb-4">
                  {t('sdk_page.sdks.java.title')}
                </h3>
                <p className="text-quantum-secondary mb-6">{t('sdk_page.sdks.java.description')}</p>
                <div className="space-y-4">
                  <div className="text-sm text-quantum-accent">
                    {t('sdk_page.version')}: v0.1.0 | Java 17+
                  </div>
                  <a
                    href="https://github.com/quantaureum/java-sdk"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full quantum-btn quantum-btn-primary inline-block"
                  >
                    {t('sdk_page.sdks.java.view')}
                  </a>
                  <div className="text-xs text-quantum-secondary">
                    Maven: com.quantaureum:quantaureum-sdk:0.1.0
                  </div>
                </div>
              </div>

              <div className="quantum-card p-8 text-center relative overflow-hidden">
                <div className="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                  {t('sdk_page.available')}
                </div>
                <div className="w-24 h-24 mx-auto mb-6 bg-quantum-gradient-accent rounded-full flex items-center justify-center">
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
                      d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-quantum-light mb-4">
                  {t('sdk_page.sdks.cpp.title')}
                </h3>
                <p className="text-quantum-secondary mb-6">{t('sdk_page.sdks.cpp.description')}</p>
                <div className="space-y-4">
                  <div className="text-sm text-quantum-accent">
                    {t('sdk_page.version')}: v0.1.0 | C++17 | CMake 3.16+
                  </div>
                  <a
                    href="/downloads/quantaureum-cpp-sdk-0.1.0.zip"
                    download
                    className="w-full quantum-btn quantum-btn-primary inline-block"
                  >
                    {t('sdk_page.sdks.cpp.download')}
                  </a>
                  <div className="text-xs text-quantum-secondary">
                    CMake FetchContent or manual integration
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 bg-white/5">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-quantum-light mb-6">
                {t('sdk_page.requirements.title')}
              </h2>
              <p className="text-xl text-quantum-secondary">
                {t('sdk_page.requirements.subtitle')}
              </p>
            </div>

            <div className="quantum-card p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-bold text-quantum-light mb-4">
                    {t('sdk_page.requirements.minimum.title')}
                  </h3>
                  <div className="space-y-3 text-quantum-secondary">
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-quantum-primary rounded-full"></div>
                      <span>{t('sdk_page.requirements.minimum.os')}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-quantum-primary rounded-full"></div>
                      <span>{t('sdk_page.requirements.minimum.memory')}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-quantum-primary rounded-full"></div>
                      <span>{t('sdk_page.requirements.minimum.storage')}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-quantum-primary rounded-full"></div>
                      <span>{t('sdk_page.requirements.minimum.nodejs')}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-quantum-light mb-4">
                    {t('sdk_page.requirements.recommended.title')}
                  </h3>
                  <div className="space-y-3 text-quantum-secondary">
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-quantum-accent rounded-full"></div>
                      <span>{t('sdk_page.requirements.recommended.os')}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-quantum-accent rounded-full"></div>
                      <span>{t('sdk_page.requirements.recommended.memory')}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-quantum-accent rounded-full"></div>
                      <span>{t('sdk_page.requirements.recommended.storage')}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-quantum-accent rounded-full"></div>
                      <span>{t('sdk_page.requirements.recommended.nodejs')}</span>
                    </div>
                  </div>
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
