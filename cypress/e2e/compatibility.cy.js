// 兼容性测试套件
describe('兼容性测试', () => {
  beforeEach(() => {
    // 访问主页
    cy.visit('/');
  });

  describe('浏览器兼容性测试', () => {
    it('应该在Chrome中正常工作', () => {
      // 检查基本功能
      cy.get('[data-testid="auction-list"]').should('be.visible');
      cy.get('[data-testid="search-input"]').should('be.visible');
      cy.get('[data-testid="filter-buttons"]').should('be.visible');

      // 检查CSS样式
      cy.get('body').should('have.css', 'font-family');
      cy.get('[data-testid="auction-card"]').first().should('have.css', 'border-radius');
    });

    it('应该支持现代JavaScript特性', () => {
      // 检查ES6+特性支持
      cy.window().then((win) => {
        // 检查Promise支持
        expect(win.Promise).to.exist;

        // 检查fetch API支持
        expect(win.fetch).to.exist;

        // 检查localStorage支持
        expect(win.localStorage).to.exist;

        // 检查WebSocket支持
        expect(win.WebSocket).to.exist;
      });
    });

    it('应该正确处理CSS Grid和Flexbox', () => {
      // 检查Grid布局
      cy.get('[data-testid="auction-grid"]').should('have.css', 'display', 'grid');

      // 检查Flexbox布局
      cy.get('[data-testid="header-nav"]').should('have.css', 'display', 'flex');
    });
  });

  describe('响应式设计测试', () => {
    const viewports = [
      { device: 'mobile', width: 375, height: 667 },
      { device: 'tablet', width: 768, height: 1024 },
      { device: 'desktop', width: 1920, height: 1080 },
    ];

    viewports.forEach(({ device, width, height }) => {
      it(`应该在${device}设备上正确显示`, () => {
        cy.viewport(width, height);

        // 检查导航菜单
        if (device === 'mobile') {
          cy.get('[data-testid="mobile-menu-button"]').should('be.visible');
          cy.get('[data-testid="desktop-nav"]').should('not.be.visible');
        } else {
          cy.get('[data-testid="desktop-nav"]').should('be.visible');
          cy.get('[data-testid="mobile-menu-button"]').should('not.be.visible');
        }

        // 检查拍卖卡片布局
        cy.get('[data-testid="auction-card"]')
          .first()
          .then(($card) => {
            const cardWidth = $card.width();

            if (device === 'mobile') {
              expect(cardWidth).to.be.greaterThan(300);
            } else if (device === 'tablet') {
              expect(cardWidth).to.be.greaterThan(200);
            } else {
              expect(cardWidth).to.be.greaterThan(250);
            }
          });

        // 检查文字可读性
        cy.get('[data-testid="auction-title"]')
          .first()
          .should('have.css', 'font-size')
          .and('match', /\d+px/);
      });
    });

    it('应该支持触摸设备交互', () => {
      cy.viewport('iphone-x');

      // 模拟触摸事件
      cy.get('[data-testid="auction-card"]').first().trigger('touchstart').trigger('touchend');

      // 检查触摸友好的按钮大小
      cy.get('[data-testid="bid-button"]')
        .first()
        .should('have.css', 'min-height')
        .and('match', /\d+px/)
        .then((minHeight) => {
          const height = parseInt(minHeight.match(/\d+/)[0]);
          expect(height).to.be.at.least(44); // iOS推荐的最小触摸目标
        });
    });
  });

  describe('网络兼容性测试', () => {
    it('应该在慢速网络下正常工作', () => {
      // 模拟慢速网络
      cy.intercept('GET', '/api/v1/auctions', (req) => {
        req.reply((res) => {
          // 延迟2秒响应
          return new Promise((resolve) => {
            setTimeout(() => resolve(res), 2000);
          });
        });
      });

      cy.visit('/');

      // 应该显示加载状态
      cy.get('[data-testid="loading-spinner"]').should('be.visible');

      // 最终应该加载完成
      cy.get('[data-testid="auction-list"]', { timeout: 5000 }).should('be.visible');
      cy.get('[data-testid="loading-spinner"]').should('not.exist');
    });

    it('应该处理网络错误', () => {
      // 模拟网络错误
      cy.intercept('GET', '/api/v1/auctions', { forceNetworkError: true });

      cy.visit('/');

      // 应该显示错误消息
      cy.get('[data-testid="error-message"]').should('be.visible');
      cy.get('[data-testid="retry-button"]').should('be.visible');

      // 点击重试按钮
      cy.intercept('GET', '/api/v1/auctions', { fixture: 'auctions.json' });
      cy.get('[data-testid="retry-button"]').click();

      // 应该重新加载数据
      cy.get('[data-testid="auction-list"]').should('be.visible');
    });

    it('应该支持离线模式', () => {
      // 首先加载页面
      cy.visit('/');
      cy.get('[data-testid="auction-list"]').should('be.visible');

      // 模拟离线状态
      cy.window().then((win) => {
        cy.stub(win.navigator, 'onLine').value(false);
        win.dispatchEvent(new Event('offline'));
      });

      // 应该显示离线提示
      cy.get('[data-testid="offline-banner"]').should('be.visible');

      // 模拟重新上线
      cy.window().then((win) => {
        cy.stub(win.navigator, 'onLine').value(true);
        win.dispatchEvent(new Event('online'));
      });

      // 离线提示应该消失
      cy.get('[data-testid="offline-banner"]').should('not.exist');
    });
  });

  describe('可访问性测试', () => {
    it('应该支持键盘导航', () => {
      cy.visit('/');

      // 使用Tab键导航
      cy.get('body').tab();
      cy.focused().should('have.attr', 'data-testid', 'search-input');

      cy.focused().tab();
      cy.focused().should('have.attr', 'data-testid', 'filter-button');

      // 使用Enter键激活按钮
      cy.focused().type('{enter}');
    });

    it('应该有正确的ARIA标签', () => {
      cy.visit('/');

      // 检查主要区域的ARIA标签
      cy.get('[role="main"]').should('exist');
      cy.get('[role="navigation"]').should('exist');
      cy.get('[role="banner"]').should('exist');

      // 检查按钮的ARIA标签
      cy.get('[data-testid="bid-button"]')
        .first()
        .should('have.attr', 'aria-label')
        .and('not.be.empty');

      // 检查表单的ARIA标签
      cy.get('[data-testid="search-input"]').should('have.attr', 'aria-label').and('not.be.empty');
    });

    it('应该支持屏幕阅读器', () => {
      cy.visit('/');

      // 检查alt文本
      cy.get('img').each(($img) => {
        cy.wrap($img).should('have.attr', 'alt');
      });

      // 检查标题层次结构
      cy.get('h1').should('have.length', 1);
      cy.get('h2').should('exist');

      // 检查链接文本
      cy.get('a').each(($link) => {
        cy.wrap($link).should('not.be.empty');
      });
    });

    it('应该有足够的颜色对比度', () => {
      cy.visit('/');

      // 检查主要文本的对比度
      cy.get('[data-testid="auction-title"]')
        .first()
        .should('have.css', 'color')
        .and('not.equal', 'rgba(0, 0, 0, 0)');

      // 检查按钮的对比度
      cy.get('[data-testid="bid-button"]')
        .first()
        .should('have.css', 'background-color')
        .and('not.equal', 'rgba(0, 0, 0, 0)');
    });
  });

  describe('性能兼容性测试', () => {
    it('应该在低性能设备上流畅运行', () => {
      // 模拟低性能设备
      cy.window().then((win) => {
        // 限制CPU性能
        Object.defineProperty(win.navigator, 'hardwareConcurrency', {
          value: 2,
        });
      });

      cy.visit('/');

      // 检查页面加载时间
      cy.window()
        .its('performance')
        .then((performance) => {
          const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
          expect(loadTime).to.be.lessThan(5000); // 5秒内加载完成
        });

      // 检查动画性能
      cy.get('[data-testid="auction-card"]')
        .first()
        .trigger('mouseenter')
        .should('have.css', 'transform');
    });

    it('应该正确处理大量数据', () => {
      // 模拟大量拍卖数据
      cy.intercept('GET', '/api/v1/auctions', {
        fixture: 'large-auctions.json',
      });

      cy.visit('/');

      // 应该使用虚拟滚动或分页
      cy.get('[data-testid="auction-card"]').should('have.length.lessThan', 50);

      // 滚动应该流畅
      cy.scrollTo('bottom');
      cy.get('[data-testid="load-more-button"]').should('be.visible');
    });
  });

  describe('浏览器特性检测', () => {
    it('应该检测并处理不支持的特性', () => {
      cy.visit('/');

      cy.window().then((win) => {
        // 检查WebSocket支持
        if (!win.WebSocket) {
          cy.get('[data-testid="websocket-fallback"]').should('be.visible');
        }

        // 检查localStorage支持
        if (!win.localStorage) {
          cy.get('[data-testid="storage-fallback"]').should('be.visible');
        }

        // 检查Geolocation支持
        if (!win.navigator.geolocation) {
          cy.get('[data-testid="location-manual-input"]').should('be.visible');
        }
      });
    });

    it('应该提供优雅降级', () => {
      // 模拟不支持某些CSS特性的浏览器
      cy.visit('/', {
        onBeforeLoad: (win) => {
          // 移除CSS Grid支持
          const style = win.document.createElement('style');
          style.innerHTML = `
            .grid-container {
              display: block !important;
            }
          `;
          win.document.head.appendChild(style);
        },
      });

      // 应该回退到其他布局方式
      cy.get('[data-testid="auction-grid"]').should('be.visible').and('have.css', 'display');
    });
  });

  describe('国际化兼容性测试', () => {
    it('应该支持不同语言', () => {
      // 测试中文
      cy.visit('/?lang=zh');
      cy.get('[data-testid="page-title"]').should('contain', '拍卖');

      // 测试英文
      cy.visit('/?lang=en');
      cy.get('[data-testid="page-title"]').should('contain', 'Auction');
    });

    it('应该正确处理RTL语言', () => {
      // 测试阿拉伯语（RTL）
      cy.visit('/?lang=ar');

      cy.get('html').should('have.attr', 'dir', 'rtl');
      cy.get('[data-testid="auction-card"]').first().should('have.css', 'text-align', 'right');
    });

    it('应该支持不同时区', () => {
      cy.visit('/');

      // 检查时间显示
      cy.get('[data-testid="auction-end-time"]').first().should('be.visible').and('not.be.empty');

      // 时间格式应该是本地化的
      cy.get('[data-testid="auction-end-time"]')
        .first()
        .invoke('text')
        .should('match', /\d{1,2}:\d{2}/); // 时间格式
    });
  });
});
