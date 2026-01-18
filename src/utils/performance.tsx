// 前端性能优化工具
import React, {
  memo,
  useMemo,
  useCallback,
  lazy,
  Suspense,
  useState,
  useEffect,
  useRef,
  ReactNode,
  ComponentType,
} from 'react';

// 性能指标类型
interface PerformanceMetric {
  startTime: number;
  endTime: number | null;
  duration: number | null;
}

// 导航性能指标类型
interface NavigationMetrics {
  domContentLoaded: number;
  loadComplete: number;
  totalLoadTime: number;
  dnsLookup: number;
  tcpConnection: number;
  serverResponse: number;
  domProcessing: number;
}

// 扩展 Window 接口
declare global {
  interface Window {
    gtag?: (command: string, action: string, params: object) => void;
  }
}

// 性能监控工具
export class PerformanceMonitor {
  private metrics: Map<string, PerformanceMetric>;
  private isEnabled: boolean;

  constructor() {
    this.metrics = new Map();
    this.isEnabled = process.env.NODE_ENV === 'development';
  }

  startMeasure(name: string): void {
    if (!this.isEnabled) return;
    const startTime = performance.now();
    this.metrics.set(name, { startTime, endTime: null, duration: null });
    console.log(`🚀 开始测量: ${name}`);
  }

  endMeasure(name: string): number | undefined {
    if (!this.isEnabled) return;
    const metric = this.metrics.get(name);
    if (!metric) {
      console.warn(`⚠️ 未找到测量: ${name}`);
      return;
    }
    const endTime = performance.now();
    metric.endTime = endTime;
    metric.duration = endTime - metric.startTime;
    console.log(`📊 测量完成: ${name} - ${metric.duration.toFixed(2)}ms`);
    return metric.duration;
  }

  getMetrics(): Array<{ name: string } & PerformanceMetric> {
    return Array.from(this.metrics.entries()).map(([name, metric]) => ({
      name,
      ...metric,
    }));
  }

  monitorPageLoad(): void {
    if (!this.isEnabled || typeof window === 'undefined') return;

    window.addEventListener('load', () => {
      const navigation = performance.getEntriesByType(
        'navigation'
      )[0] as PerformanceNavigationTiming;
      const metrics: NavigationMetrics = {
        domContentLoaded:
          navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
        loadComplete: navigation.loadEventEnd - navigation.loadEventStart,
        totalLoadTime: navigation.loadEventEnd - navigation.fetchStart,
        dnsLookup: navigation.domainLookupEnd - navigation.domainLookupStart,
        tcpConnection: navigation.connectEnd - navigation.connectStart,
        serverResponse: navigation.responseEnd - navigation.requestStart,
        domProcessing: navigation.domComplete - navigation.responseEnd,
      };
      console.log('📊 页面加载性能指标:', metrics);
    });
  }
}

export const performanceMonitor = new PerformanceMonitor();

// React组件性能优化HOC
export function withPerformanceMonitoring<P extends object>(
  WrappedComponent: ComponentType<P>,
  componentName: string
): ComponentType<P> {
  const MonitoredComponent = memo(function MonitoredComponent(props: P) {
    performanceMonitor.startMeasure(`${componentName}_render`);

    useEffect(() => {
      performanceMonitor.endMeasure(`${componentName}_render`);
    });

    return <WrappedComponent {...props} />;
  });

  MonitoredComponent.displayName = `withPerformanceMonitoring(${componentName})`;
  return MonitoredComponent as ComponentType<P>;
}

// 防抖Hook
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
}

// 节流Hook
export function useThrottle<T>(value: T, limit: number): T {
  const [throttledValue, setThrottledValue] = useState<T>(value);
  const lastRan = useRef<number>(Date.now());

  useEffect(() => {
    const handler = setTimeout(
      () => {
        if (Date.now() - lastRan.current >= limit) {
          setThrottledValue(value);
          lastRan.current = Date.now();
        }
      },
      limit - (Date.now() - lastRan.current)
    );
    return () => clearTimeout(handler);
  }, [value, limit]);

  return throttledValue;
}

// 虚拟滚动返回类型
interface VirtualScrollResult<T> {
  visibleItems: {
    startIndex: number;
    endIndex: number;
    items: T[];
    totalHeight: number;
    offsetY: number;
  };
  handleScroll: (e: React.UIEvent<HTMLDivElement>) => void;
}

// 虚拟滚动Hook
export function useVirtualScroll<T>(
  items: T[],
  itemHeight: number,
  containerHeight: number
): VirtualScrollResult<T> {
  const [scrollTop, setScrollTop] = useState<number>(0);

  const visibleItems = useMemo(() => {
    const startIndex = Math.floor(scrollTop / itemHeight);
    const endIndex = Math.min(
      startIndex + Math.ceil(containerHeight / itemHeight) + 1,
      items.length
    );
    return {
      startIndex,
      endIndex,
      items: items.slice(startIndex, endIndex),
      totalHeight: items.length * itemHeight,
      offsetY: startIndex * itemHeight,
    };
  }, [items, itemHeight, containerHeight, scrollTop]);

  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(e.currentTarget.scrollTop);
  }, []);

  return { visibleItems, handleScroll };
}

// 图片懒加载返回类型
interface LazyImageResult {
  imageSrc: string;
  isLoaded: boolean;
  isError: boolean;
  imgRef: React.RefObject<HTMLImageElement | null>;
}

// 图片懒加载Hook
export function useLazyImage(src: string, placeholder: string = ''): LazyImageResult {
  const [imageSrc, setImageSrc] = useState<string>(placeholder);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [isError, setIsError] = useState<boolean>(false);
  const imgRef = useRef<HTMLImageElement | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const img = new Image();
            img.onload = () => {
              setImageSrc(src);
              setIsLoaded(true);
              observer.disconnect();
            };
            img.onerror = () => {
              setIsError(true);
              observer.disconnect();
            };
            img.src = src;
          }
        });
      },
      { threshold: 0.1 }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }
    return () => observer.disconnect();
  }, [src]);

  return { imageSrc, isLoaded, isError, imgRef };
}

// 缓存数据类型
interface CacheData<T> {
  data: T;
  timestamp: number;
}

// 缓存Hook返回类型
interface CacheResult<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

// 缓存Hook
export function useCache<T>(
  key: string,
  fetchFunction: () => Promise<T>,
  dependencies: unknown[] = []
): CacheResult<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  const cache = useRef<Map<string, CacheData<T>>>(new Map());

  const fetchData = useCallback(async (): Promise<void> => {
    if (cache.current.has(key)) {
      const cachedData = cache.current.get(key)!;
      const now = Date.now();
      if (now - cachedData.timestamp < 5 * 60 * 1000) {
        setData(cachedData.data);
        return;
      }
    }

    setLoading(true);
    setError(null);

    try {
      const result = await fetchFunction();
      cache.current.set(key, { data: result, timestamp: Date.now() });
      setData(result);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, [key, fetchFunction]);

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchData, ...dependencies]);

  return { data, loading, error, refetch: fetchData };
}

// 组件懒加载工具
export function createLazyComponent<P extends object>(
  importFunction: () => Promise<{ default: ComponentType<P> }>,
  fallback: ReactNode = <div>Loading...</div>
): React.FC<P> {
  const LazyComponent = lazy(importFunction);

  const WrappedComponent: React.FC<P> = (props: P) => (
    <Suspense fallback={fallback}>
      <LazyComponent {...props} />
    </Suspense>
  );
  WrappedComponent.displayName = 'LazyComponent';
  return WrappedComponent;
}

// 批量状态更新Hook
export function useBatchedState<T extends object>(
  initialState: T
): [T, (update: Partial<T> | ((prev: T) => T)) => void] {
  const [state, setState] = useState<T>(initialState);
  const pendingUpdates = useRef<Array<Partial<T> | ((prev: T) => T)>>([]);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const batchedSetState = useCallback((update: Partial<T> | ((prev: T) => T)) => {
    pendingUpdates.current.push(update);

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      setState((prevState) => {
        let newState = prevState;
        pendingUpdates.current.forEach((upd) => {
          if (typeof upd === 'function') {
            newState = upd(newState);
          } else {
            newState = { ...newState, ...upd };
          }
        });
        pendingUpdates.current = [];
        return newState;
      });
    }, 0);
  }, []);

  return [state, batchedSetState];
}

// 优化列表组件属性类型
interface OptimizedListProps<T> {
  items: T[];
  renderItem: (item: T, index: number) => ReactNode;
  keyExtractor: (item: T, index: number) => string | number;
  itemHeight?: number;
  containerHeight?: number;
}

// 性能优化的列表组件
function OptimizedListComponent<T>({
  items,
  renderItem,
  keyExtractor,
  itemHeight = 50,
  containerHeight = 400,
}: OptimizedListProps<T>): React.ReactElement {
  const { visibleItems, handleScroll } = useVirtualScroll(items, itemHeight, containerHeight);

  return (
    <div style={{ height: containerHeight, overflow: 'auto' }} onScroll={handleScroll}>
      <div style={{ height: visibleItems.totalHeight, position: 'relative' }}>
        <div style={{ transform: `translateY(${visibleItems.offsetY}px)` }}>
          {visibleItems.items.map((item, index) => (
            <div key={keyExtractor(item, visibleItems.startIndex + index)}>
              {renderItem(item, visibleItems.startIndex + index)}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
OptimizedListComponent.displayName = 'OptimizedList';

export const OptimizedList = memo(OptimizedListComponent) as typeof OptimizedListComponent;

// 初始化性能监控
if (typeof window !== 'undefined') {
  performanceMonitor.monitorPageLoad();
}
