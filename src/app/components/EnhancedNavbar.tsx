'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';

import { useTranslation } from 'react-i18next';
import LanguageSwitcher from './LanguageSwitcher';
import '../../i18n';

// Quantaureum 网络配置 - 使用 cloudflare tunnel 地址
const QUANTAUREUM_NETWORK = {
  chainId: '0x684', // 1668 in hex
  chainName: 'Quantaureum Mainnet',
  nativeCurrency: {
    name: 'Quantaureum',
    symbol: 'QAU',
    decimals: 18,
  },
  rpcUrls: ['https://accompanied-expanded-deaths-optimal.trycloudflare.com'],
  blockExplorerUrls: ['https://battery-strike-reprint-gaps.trycloudflare.com/explorer'],
};

const EnhancedNavbar = () => {
  const { t } = useTranslation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [showMetaMaskModal, setShowMetaMaskModal] = useState(false);
  const [walletStatus, setWalletStatus] = useState<'idle' | 'connecting' | 'connected' | 'error'>(
    'idle'
  );
  const [walletAddress, setWalletAddress] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');

  const navItems = [
    { id: 'home', label: t('nav.home'), href: '/' },
    { id: 'features', label: t('nav.features'), href: '/#features' },
    { id: 'specs', label: t('nav.specs'), href: '/#specs' },
    { id: 'demo', label: t('nav.demo'), href: '/#demo' },
    { id: 'ecosystem', label: t('nav.ecosystem'), href: '/#ecosystem' },
    { id: 'team', label: t('nav.team'), href: '/#team' },
    { id: 'explorer', label: t('nav.explorer', 'Explorer'), href: '/explorer', isExternal: true },
    {
      id: 'community',
      label: t('nav.community', 'Community'),
      href: '/community',
      isExternal: true,
    },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    const handleSectionChange = () => {
      const sections = ['home', 'features', 'specs', 'demo', 'ecosystem', 'team'];
      const scrollPosition = window.scrollY + 100;

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('scroll', handleSectionChange);
    handleScroll();
    handleSectionChange();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('scroll', handleSectionChange);
    };
  }, []);

  const scrollToSection = (sectionId: string) => {
    if (window.location.pathname === '/') {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      window.location.href = `/#${sectionId}`;
    }
    setIsMobileMenuOpen(false);
  };

  const isMetaMaskInstalled = () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return typeof window !== 'undefined' && typeof (window as any).ethereum !== 'undefined';
  };

  const addQuantaureumNetwork = async () => {
    if (!isMetaMaskInstalled()) {
      window.open('https://metamask.io/download/', '_blank');
      return;
    }

    setWalletStatus('connecting');
    setErrorMessage('');

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const ethereum = (window as any).ethereum;

    try {
      try {
        await ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: QUANTAUREUM_NETWORK.chainId }],
        });
        setWalletStatus('connected');
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (switchError: any) {
        if (switchError?.code === 4902) {
          await ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [QUANTAUREUM_NETWORK],
          });
          setWalletStatus('connected');
        } else {
          throw switchError;
        }
      }

      const accounts = (await ethereum.request({
        method: 'eth_requestAccounts',
      })) as string[];

      if (accounts && accounts.length > 0) {
        setWalletAddress(accounts[0]);
        setWalletStatus('connected');
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error('MetaMask connection error:', error);
      setWalletStatus('error');
      setErrorMessage(error?.message || 'Connection failed');
    }
  };

  const handleExperienceClick = () => {
    setShowMetaMaskModal(true);
    setWalletStatus('idle');
    setErrorMessage('');
  };

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled ? 'bg-black/80 backdrop-blur-md border-b border-white/10' : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-5 py-4">
          <div className="flex items-center justify-between">
            <div
              className="flex items-center gap-3 cursor-pointer keep-ltr"
              onClick={() => scrollToSection('home')}
              style={{ direction: 'ltr' }}
            >
              <Image
                src="/quantaureum-navbar-logo.svg"
                alt="Quantaureum"
                width={120}
                height={48}
                className="h-12 w-auto keep-ltr"
                style={{
                  imageRendering: '-webkit-optimize-contrast',
                  filter: 'contrast(1.1) brightness(1.05)',
                  direction: 'ltr',
                }}
              />
            </div>

            <div className="hidden lg:flex items-center gap-6">
              {navItems.map((item) =>
                item.isExternal ? (
                  <a
                    key={item.id}
                    href={item.href}
                    className="relative px-3 py-2 rounded-lg transition-all duration-300 whitespace-nowrap text-gray-300 hover:text-white hover:bg-white/5"
                  >
                    {item.label}
                  </a>
                ) : (
                  <button
                    key={item.id}
                    onClick={() => scrollToSection(item.id)}
                    className={`relative px-3 py-2 rounded-lg transition-all duration-300 whitespace-nowrap ${
                      activeSection === item.id
                        ? 'text-white bg-white/10'
                        : 'text-gray-300 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    {item.label}
                    {activeSection === item.id && (
                      <div className="absolute inset-0 bg-gradient-to-r from-[#6E3CBC]/20 to-[#00D4FF]/20 rounded-lg border border-cyan-500/30" />
                    )}
                  </button>
                )
              )}
            </div>

            <div className="hidden lg:flex items-center gap-4 flex-shrink-0">
              <LanguageSwitcher />
              <button
                onClick={handleExperienceClick}
                className="px-6 py-3 bg-gradient-to-r from-[#6E3CBC] to-[#00D4FF] text-white rounded-lg font-semibold hover:shadow-lg hover:shadow-cyan-500/25 transition-all duration-300 whitespace-nowrap"
              >
                {t('nav.experience')}
              </button>
            </div>

            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 text-white"
            >
              <div className="w-6 h-6 flex flex-col justify-center items-center">
                <span className="w-6 h-0.5 bg-white block" />
                <span className="w-6 h-0.5 bg-white block mt-1" />
                <span className="w-6 h-0.5 bg-white block mt-1" />
              </div>
            </button>
          </div>
        </div>
      </nav>

      {isMobileMenuOpen && (
        <div className="fixed top-[88px] left-0 right-0 z-40 bg-black/95 backdrop-blur-md border-b border-white/10 lg:hidden">
          <div className="max-w-7xl mx-auto px-5 py-6">
            <div className="flex flex-col gap-4">
              {navItems.map((item) =>
                item.isExternal ? (
                  <a
                    key={item.id}
                    href={item.href}
                    className="text-left px-4 py-3 rounded-lg transition-all duration-300 text-gray-300 hover:text-white hover:bg-white/5"
                  >
                    {item.label}
                  </a>
                ) : (
                  <button
                    key={item.id}
                    onClick={() => scrollToSection(item.id)}
                    className={`text-left px-4 py-3 rounded-lg transition-all duration-300 ${
                      activeSection === item.id
                        ? 'text-white bg-gradient-to-r from-[#6E3CBC]/20 to-[#00D4FF]/20 border border-cyan-500/30'
                        : 'text-gray-300 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    {item.label}
                  </button>
                )
              )}
              <div className="flex flex-row items-center gap-3 mt-4 pt-4 border-t border-white/10">
                <LanguageSwitcher />
                <button
                  onClick={handleExperienceClick}
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-[#6E3CBC] to-[#00D4FF] text-white rounded-lg font-semibold text-center"
                >
                  {t('nav.experience')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showMetaMaskModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => setShowMetaMaskModal(false)}
          />

          <div className="relative bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl border border-white/20 p-8 max-w-md w-full mx-4 shadow-2xl">
            <button
              onClick={() => setShowMetaMaskModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 bg-gradient-to-br from-orange-400 to-orange-600 rounded-2xl flex items-center justify-center">
                <svg className="w-12 h-12" viewBox="0 0 318.6 318.6">
                  <path fill="#E2761B" d="M274.1 35.5l-99.5 73.9L193 65.8z" />
                  <path
                    fill="#E4761B"
                    d="M44.4 35.5l98.7 74.6-17.5-44.3zm193.9 171.3l-26.5 40.6 56.7 15.6 16.3-55.3zm-204.4.9L50.1 263l56.7-15.6-26.5-40.6z"
                  />
                  <path
                    fill="#E4761B"
                    d="M103.6 138.2l-15.8 23.9 56.3 2.5-2-60.5zm111.3 0l-39-34.8-1.3 61.2 56.2-2.5zM106.8 247.4l33.8-16.5-29.2-22.8zm71.1-16.5l33.9 16.5-4.7-39.3z"
                  />
                  <path
                    fill="#D7C1B3"
                    d="M211.8 247.4l-33.9-16.5 2.7 22.1-.3 9.3zm-105 0l31.5 14.9-.2-9.3 2.5-22.1z"
                  />
                  <path
                    fill="#233447"
                    d="M138.8 193.5l-28.2-8.3 19.9-9.1zm40.9 0l8.3-17.4 20 9.1z"
                  />
                  <path
                    fill="#CD6116"
                    d="M106.8 247.4l4.8-40.6-31.3.9zm100.2-40.6l4.8 40.6 26.5-39.7zm23.8-44.7l-56.2 2.5 5.2 28.9 8.3-17.4 20 9.1zm-120.2 23.1l20-9.1 8.2 17.4 5.3-28.9-56.3-2.5z"
                  />
                  <path
                    fill="#E4751F"
                    d="M87.8 162.1l23.6 46-.8-22.9zm120.3 23.1l-1 22.9 23.7-46zm-64-20.6l-5.3 28.9 6.6 34.1 1.5-44.9zm30.5 0l-2.7 18 1.2 45 6.7-34.1z"
                  />
                  <path
                    fill="#F6851B"
                    d="M179.8 193.5l-6.7 34.1 4.8 3.3 29.2-22.8 1-22.9zm-69.2-8.3l.8 22.9 29.2 22.8 4.8-3.3-6.6-34.1z"
                  />
                  <path
                    fill="#C0AD9E"
                    d="M180.3 262.3l.3-9.3-2.5-2.2h-37.7l-2.3 2.2.2 9.3-31.5-14.9 11 9 22.3 15.5h38.3l22.4-15.5 11-9z"
                  />
                  <path
                    fill="#161616"
                    d="M177.9 230.9l-4.8-3.3h-27.7l-4.8 3.3-2.5 22.1 2.3-2.2h37.7l2.5 2.2z"
                  />
                  <path
                    fill="#763D16"
                    d="M278.3 114.2l8.5-40.8-12.7-37.9-96.2 71.4 37 31.3 52.3 15.3 11.6-13.5-5-3.6 8-7.3-6.2-4.8 8-6.1zM31.8 73.4l8.5 40.8-5.4 4 8 6.1-6.1 4.8 8 7.3-5 3.6 11.5 13.5 52.3-15.3 37-31.3-96.2-71.4z"
                  />
                  <path
                    fill="#F6851B"
                    d="M267.2 153.5l-52.3-15.3 15.9 23.9-23.7 46 31.2-.4h46.5zm-163.6-15.3l-52.3 15.3-17.4 54.2h46.4l31.1.4-23.6-46zm71 26.4l3.3-57.7 15.2-41.1h-67.5l15 41.1 3.5 57.7 1.2 18.2.1 44.8h27.7l.2-44.8z"
                  />
                </svg>
              </div>
            </div>

            <h2 className="text-2xl font-bold text-white text-center mb-2">
              {t('hero.modal.title')}
            </h2>
            <p className="text-gray-400 text-center mb-6">{t('hero.modal.description')}</p>

            <div className="bg-black/30 rounded-xl p-4 mb-6">
              <div className="grid grid-cols-4 gap-3 text-center">
                <div className="bg-white/5 rounded-lg p-3">
                  <span className="text-gray-400 text-xs block mb-1">
                    {t('hero.modal.network')}
                  </span>
                  <span className="text-white font-medium text-sm">Quantaureum</span>
                </div>
                <div className="bg-white/5 rounded-lg p-3">
                  <span className="text-gray-400 text-xs block mb-1">
                    {t('hero.modal.chainId')}
                  </span>
                  <span className="text-white font-medium text-sm">1668</span>
                </div>
                <div className="bg-white/5 rounded-lg p-3">
                  <span className="text-gray-400 text-xs block mb-1">{t('hero.modal.symbol')}</span>
                  <span className="text-white font-medium text-sm">QAU</span>
                </div>
                <div className="bg-white/5 rounded-lg p-3">
                  <span className="text-gray-400 text-xs block mb-1">{t('hero.modal.rpc')}</span>
                  <span className="text-cyan-400 font-medium text-xs">:8545</span>
                </div>
              </div>
            </div>

            {walletStatus === 'connected' && walletAddress && (
              <div className="bg-green-500/20 border border-green-500/30 rounded-xl p-4 mb-6">
                <div className="flex items-center gap-2 text-green-400 mb-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span className="font-medium">{t('hero.modal.connected')}</span>
                </div>
                <p className="text-sm text-gray-300 break-all">{walletAddress}</p>
              </div>
            )}

            {walletStatus === 'error' && errorMessage && (
              <div className="bg-red-500/20 border border-red-500/30 rounded-xl p-4 mb-6">
                <div className="flex items-center gap-2 text-red-400">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                  <span className="text-sm">{errorMessage}</span>
                </div>
              </div>
            )}

            <div className="space-y-3">
              <button
                onClick={addQuantaureumNetwork}
                disabled={walletStatus === 'connecting'}
                className="w-full py-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-orange-500/25 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {walletStatus === 'connecting' ? (
                  <>
                    <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    {t('hero.modal.connecting')}
                  </>
                ) : walletStatus === 'connected' ? (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    {t('hero.modal.added')}
                  </>
                ) : (
                  <>
                    {isMetaMaskInstalled()
                      ? t('hero.modal.add_to_metamask')
                      : t('hero.modal.install_metamask')}
                  </>
                )}
              </button>

              {walletStatus === 'connected' && (
                <a
                  href="/wallet"
                  className="block w-full py-3 bg-gradient-to-r from-[#6E3CBC] to-[#00D4FF] text-white rounded-xl font-semibold text-center hover:shadow-lg hover:shadow-cyan-500/25 transition-all duration-300"
                >
                  {t('hero.modal.enter_wallet')}
                </a>
              )}
            </div>

            <div className="mt-6 text-center">
              <a
                href="https://metamask.io/download/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-gray-400 hover:text-cyan-400 transition-colors"
              >
                {t('hero.modal.download_metamask')}
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default EnhancedNavbar;
