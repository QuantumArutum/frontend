'use client';

import { useState, useEffect, useCallback } from 'react';

// API Base URL - 在生产环境使用相对路径或禁用外部 API
const API_BASE_URL =
  typeof window !== 'undefined' && window.location.hostname !== 'localhost'
    ? '' // 生产环境使用相对路径（Next.js API routes）
    : process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

// 是否启用外部 API（生产环境禁用，因为没有后端）
const ENABLE_EXTERNAL_API =
  typeof window !== 'undefined' && window.location.hostname === 'localhost';

// Types
export interface SiteSettings {
  site_name?: string;
  site_logo?: string;
  site_favicon?: string;
  contact_email?: string;
  meta_title?: string;
  meta_description?: string;
  meta_keywords?: string;
  social_twitter?: string;
  social_discord?: string;
  social_telegram?: string;
  social_github?: string;
  social_linkedin?: string;
  social_medium?: string;
  [key: string]: string | undefined;
}

export interface MenuItem {
  id: string;
  label: string;
  link: string;
  icon?: string;
  parent_id?: string;
  target?: string;
  sort_order: number;
  is_active: boolean;
}

export interface FooterLink {
  id: string;
  section: string;
  label: string;
  link?: string;
  icon?: string;
  sort_order: number;
  is_active: boolean;
}

export interface FooterSection {
  title: string;
  links: FooterLink[];
}

export interface LaunchStatus {
  id: string;
  launch_date?: string;
  pre_launch_enabled: boolean;
  countdown_message?: string;
  maintenance_mode: boolean;
  maintenance_message?: string;
  is_launched: boolean;
  time_until_launch?: number;
}

export interface DemoModule {
  id: string;
  name: string;
  slug: string;
  description?: string;
  is_active: boolean;
  show_demo_badge: boolean;
  config?: string;
  sort_order: number;
}

export interface PageContent {
  id: string;
  slug: string;
  title: string;
  content?: string;
  meta_title?: string;
  meta_description?: string;
  is_published: boolean;
}

// Hook for site settings (Requirements 11.2)
export function useSiteConfig() {
  const [config, setConfig] = useState<SiteSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchConfig = useCallback(async () => {
    // 生产环境使用默认配置
    if (!ENABLE_EXTERNAL_API) {
      setConfig({
        site_name: 'Quantaureum',
        contact_email: 'support@quantaureum.com',
        meta_title: 'Quantaureum - Quantum-Secured Blockchain',
        meta_description: 'The future of secure blockchain technology',
      });
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`${API_BASE_URL}/api/v2/barong/public/system/settings`);
      const data = await response.json();
      if (data.success) {
        setConfig(data.data);
      } else {
        setError(data.message || 'Failed to fetch site config');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch site config');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchConfig();
  }, [fetchConfig]);

  return { config, loading, error, refetch: fetchConfig };
}

// Hook for navigation menu (Requirements 1.2)
export function useNavigation() {
  const [menus, setMenus] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMenus = useCallback(async () => {
    // 生产环境使用空数组（导航由前端静态定义）
    if (!ENABLE_EXTERNAL_API) {
      setMenus([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`${API_BASE_URL}/api/v2/barong/public/cms/menus`);
      const data = await response.json();
      if (data.success) {
        setMenus(data.data || []);
      } else {
        setError(data.message || 'Failed to fetch navigation');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch navigation');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMenus();
  }, [fetchMenus]);

  return { menus, loading, error, refetch: fetchMenus };
}

// Hook for footer content (Requirements 2.2)
export function useFooter() {
  const [footerLinks, setFooterLinks] = useState<FooterLink[]>([]);
  const [sections, setSections] = useState<FooterSection[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchFooter = useCallback(async () => {
    // 生产环境使用空数组（页脚由前端静态定义）
    if (!ENABLE_EXTERNAL_API) {
      setFooterLinks([]);
      setSections([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`${API_BASE_URL}/api/v2/barong/public/cms/footer`);
      const data = await response.json();
      if (data.success) {
        const links = data.data || [];
        setFooterLinks(links);

        // Group links by section
        const sectionMap = new Map<string, FooterLink[]>();
        links.forEach((link: FooterLink) => {
          const section = link.section || 'Other';
          if (!sectionMap.has(section)) {
            sectionMap.set(section, []);
          }
          sectionMap.get(section)!.push(link);
        });

        // Convert to array of sections
        const sectionsArray: FooterSection[] = [];
        sectionMap.forEach((links, title) => {
          sectionsArray.push({ title, links });
        });
        setSections(sectionsArray);
      } else {
        setError(data.message || 'Failed to fetch footer');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch footer');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFooter();
  }, [fetchFooter]);

  return { footerLinks, sections, loading, error, refetch: fetchFooter };
}

// Hook for launch status (Requirements 15.5, 15.6, 15.7)
export function useLaunchStatus() {
  const [status, setStatus] = useState<LaunchStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStatus = useCallback(async () => {
    // 生产环境使用默认状态（已上线）
    if (!ENABLE_EXTERNAL_API) {
      setStatus({
        id: 'default',
        is_launched: true,
        pre_launch_enabled: false,
        maintenance_mode: false,
      });
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`${API_BASE_URL}/api/v2/barong/public/system/launch`);
      const data = await response.json();
      if (data.success) {
        setStatus(data.data);
      } else {
        setError(data.message || 'Failed to fetch launch status');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch launch status');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStatus();
  }, [fetchStatus]);

  // Auto-refresh disabled to prevent unnecessary re-renders
  // Countdown can be handled client-side without refetching

  return { status, loading, error, refetch: fetchStatus };
}

// Hook for demo modules (Requirements 7.2, 7.5)
export function useDemoModules() {
  const [modules, setModules] = useState<DemoModule[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchModules = useCallback(async () => {
    // 生产环境使用空数组
    if (!ENABLE_EXTERNAL_API) {
      setModules([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`${API_BASE_URL}/api/v2/barong/public/demo/modules`);
      const data = await response.json();
      if (data.success) {
        setModules(data.data || []);
      } else {
        setError(data.message || 'Failed to fetch demo modules');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch demo modules');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchModules();
  }, [fetchModules]);

  // Helper to check if a specific module is active
  const isModuleActive = useCallback(
    (slug: string) => {
      return modules.some((m) => m.slug === slug && m.is_active);
    },
    [modules]
  );

  // Helper to get module config
  const getModuleConfig = useCallback(
    (slug: string) => {
      const module = modules.find((m) => m.slug === slug);
      if (module?.config) {
        try {
          return JSON.parse(module.config);
        } catch {
          return null;
        }
      }
      return null;
    },
    [modules]
  );

  // Helper to check if demo badge should be shown
  const shouldShowDemoBadge = useCallback(
    (slug: string) => {
      const module = modules.find((m) => m.slug === slug);
      return module?.show_demo_badge ?? false;
    },
    [modules]
  );

  return {
    modules,
    loading,
    error,
    refetch: fetchModules,
    isModuleActive,
    getModuleConfig,
    shouldShowDemoBadge,
  };
}

// Hook for page content (Requirements 4.2, 4.3, 4.4)
export function usePageContent(slug: string) {
  const [page, setPage] = useState<PageContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPage = useCallback(async () => {
    if (!slug) {
      setLoading(false);
      return;
    }

    // 生产环境返回 null（页面内容由前端静态定义）
    if (!ENABLE_EXTERNAL_API) {
      setPage(null);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`${API_BASE_URL}/api/v2/barong/public/cms/pages/${slug}`);
      const data = await response.json();
      if (data.success) {
        setPage(data.data);
      } else {
        setError(data.message || 'Failed to fetch page content');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch page content');
    } finally {
      setLoading(false);
    }
  }, [slug]);

  useEffect(() => {
    fetchPage();
  }, [fetchPage]);

  return { page, loading, error, refetch: fetchPage };
}

// Combined hook for all site configuration
export function useAllSiteConfig() {
  const siteConfig = useSiteConfig();
  const navigation = useNavigation();
  const footer = useFooter();
  const launchStatus = useLaunchStatus();
  const demoModules = useDemoModules();

  const loading =
    siteConfig.loading ||
    navigation.loading ||
    footer.loading ||
    launchStatus.loading ||
    demoModules.loading;

  const error =
    siteConfig.error || navigation.error || footer.error || launchStatus.error || demoModules.error;

  const refetchAll = useCallback(() => {
    siteConfig.refetch();
    navigation.refetch();
    footer.refetch();
    launchStatus.refetch();
    demoModules.refetch();
  }, [siteConfig, navigation, footer, launchStatus, demoModules]);

  return {
    siteConfig: siteConfig.config,
    menus: navigation.menus,
    footerSections: footer.sections,
    launchStatus: launchStatus.status,
    demoModules: demoModules.modules,
    loading,
    error,
    refetchAll,
  };
}
