'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from './LanguageSwitcher';
import { useNavigation } from '../hooks/useSiteConfig';
import '../i18n';

interface NavItem {
  id: string;
  label: string;
  isLink?: boolean;
  href?: string;
  target?: string;
}

const EnhancedNavbar = () => {
  const { t } = useTranslation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  
  // Fetch dynamic navigation from API (Requirements 1.2, 1.5, 1.6)
  const { menus, loading: menusLoading } = useNavigation();

  // Default navigation items (fallback when API is not available)
  const defaultNavItems: NavItem[] = useMemo(() => [
    { id: 'home', label: t('nav.home') },
    { id: 'features', label: t('nav.features') },
    { id: 'specs', label: t('nav.specs') },
    { id: 'demo', label: t('nav.demo') },
    { id: 'ecosystem', label: t('nav.ecosystem') },
    { id: 'team', label: t('nav.team') },
    { id: 'explorer', label: t('nav.explorer', 'Explorer'), isLink: true, href: '/explorer' },
    { id: 'community', label: t('nav.community', 'Community'), isLink: true, href: '/community' }
  ], [t]);

  // Convert API menus to NavItem format, or use defaults
  const navItems: NavItem[] = useMemo(() => {
    if (menusLoading || menus.length === 0) {
      return defaultNavItems;
    }
    
    return menus.map(menu => {
      // Check if link is external (starts with http) or internal page link
      const isExternalLink = menu.link?.startsWith('http');
      const isPageLink = menu.link?.startsWith('/');
      const isAnchorLink = menu.link?.startsWith('#') || (!isExternalLink && !isPageLink);
      
      return {
        id: menu.id,
        label: menu.label,
        isLink: isExternalLink || isPageLink,
        href: isAnchorLink ? undefined : menu.link,
        target: menu.target || (isExternalLink ? '_blank' : '_self')
      };
    });
  }, [menus, menusLoading, defaultNavItems]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    const handleSectionChange = () => {
      // Only for static sections
      const sections = navItems.filter(i => !i.isLink).map(item => item.id);
      const currentSection = sections.find(section => {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          return rect.top <= 100 && rect.bottom >= 100;
        }
        return false;
      });

      if (currentSection) {
        setActiveSection(currentSection);
      }
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('scroll', handleSectionChange);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('scroll', handleSectionChange);
    };
  }, [navItems]);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const offsetTop = element.offsetTop - 80;
      window.scrollTo({
        top: offsetTop,
        behavior: 'smooth'
      });
    }
    setIsMobileMenuOpen(false);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <div>
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled
        ? 'bg-black/80 backdrop-blur-md border-b border-white/10'
        : 'bg-transparent'
        }`}>
        <div className="max-w-7xl mx-auto px-5 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 cursor-pointer keep-ltr"
              onClick={() => window.location.href = '/'}
              tabIndex={0}
              role="button"
              aria-label="Go to home"
              style={{ direction: 'ltr' }}>
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

            <div className="hidden lg:flex items-center gap-8">
              {navItems.map((item: NavItem) => (
                item.isLink ? (
                  <a
                    key={item.id}
                    href={item.href}
                    target={item.target || '_self'}
                    rel={item.target === '_blank' ? 'noopener noreferrer' : undefined}
                    className="relative px-4 py-2 rounded-lg transition-all duration-300 whitespace-nowrap text-gray-300 hover:text-white hover:bg-white/5"
                  >
                    {item.label}
                  </a>
                ) : (
                  <button
                    key={item.id}
                    onClick={() => scrollToSection(item.id)}
                    className={`relative px-4 py-2 rounded-lg transition-all duration-300 whitespace-nowrap ${activeSection === item.id
                      ? 'text-white bg-white/10'
                      : 'text-gray-300 hover:text-white hover:bg-white/5'
                      }`}
                  >
                    {item.label}
                  </button>
                )
              ))}
            </div>

            <div className="hidden lg:flex items-center gap-4">
              <LanguageSwitcher />
              <button className="px-6 py-3 bg-gradient-to-r from-[#6E3CBC] to-[#00D4FF] text-white rounded-lg font-semibold hover:shadow-lg hover:shadow-cyan-500/25 transition-all duration-300">
                {t('nav.experience')}
              </button>
            </div>

            <button
              onClick={toggleMobileMenu}
              className="lg:hidden p-2 text-white hover:bg-white/10 rounded-lg transition-colors"
              aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={isMobileMenuOpen}
            >
              <div className="w-6 h-6 flex flex-col justify-center items-center">
                <span className={`bg-white block transition-all duration-300 ease-out h-0.5 w-6 rounded-sm ${isMobileMenuOpen ? 'rotate-45 translate-y-1' : '-translate-y-0.5'}`}></span>
                <span className={`bg-white block transition-all duration-300 ease-out h-0.5 w-6 rounded-sm my-0.5 ${isMobileMenuOpen ? 'opacity-0' : 'opacity-100'}`}></span>
                <span className={`bg-white block transition-all duration-300 ease-out h-0.5 w-6 rounded-sm ${isMobileMenuOpen ? '-rotate-45 -translate-y-1' : 'translate-y-0.5'}`}></span>
              </div>
            </button>
          </div>
        </div>
      </nav>

      {isMobileMenuOpen && (
        <div 
          className="lg:hidden bg-black/95 backdrop-blur-md border-t border-white/10 fixed top-[88px] left-0 right-0 z-40"
          role="navigation"
          aria-label="Mobile navigation"
        >
          <div className="px-5 py-6 space-y-4">
            {navItems.map((item: NavItem) => (
              item.isLink ? (
                <a
                  key={item.id}
                  href={item.href}
                  target={item.target || '_self'}
                  rel={item.target === '_blank' ? 'noopener noreferrer' : undefined}
                  className="block w-full text-left px-4 py-3 rounded-lg transition-all duration-300 text-gray-300 hover:text-white hover:bg-white/5"
                >
                  {item.label}
                </a>
              ) : (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className={`block w-full text-left px-4 py-3 rounded-lg transition-all duration-300 ${activeSection === item.id
                    ? 'text-white bg-gradient-to-r from-[#6E3CBC]/20 to-[#00D4FF]/20 border border-cyan-500/30'
                    : 'text-gray-300 hover:text-white hover:bg-white/5'
                    }`}
                >
                  {item.label}
                </button>
              )
            ))}
            <div className="flex flex-row items-center gap-3 mt-4 pt-4 border-t border-white/10">
              <LanguageSwitcher />
              <button className="flex-1 px-4 py-3 bg-gradient-to-r from-[#6E3CBC] to-[#00D4FF] text-white rounded-lg font-semibold text-center">
                {t('nav.experience')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EnhancedNavbar;
