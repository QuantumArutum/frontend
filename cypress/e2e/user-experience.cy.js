// 用户体验测试套件
describe('用户体验测试', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  describe('可用性测试', () => {
    it('用户应该能够快速找到并浏览拍卖', () => {
      // 页面应该在3秒内加载完成
      cy.get('[data-testid="auction-list"]', { timeout: 3000 }).should('be.visible');

      // 搜索功能应该易于发现
      cy.get('[data-testid="search-input"]')
        .should('be.visible')
        .and('have.attr', 'placeholder')
        .and('not.be.empty');

      // 筛选选项应该清晰可见
      cy.get('[data-testid="filter-buttons"]').should('be.visible');
      cy.get('[data-testid="filter-button"]').should('have.length.greaterThan', 0);

      // 拍卖卡片应该包含关键信息
      cy.get('[data-testid="auction-card"]')
        .first()
        .within(() => {
          cy.get('[data-testid="auction-title"]').should('be.visible');
          cy.get('[data-testid="current-price"]').should('be.visible');
          cy.get('[data-testid="time-remaining"]').should('be.visible');
          cy.get('[data-testid="bid-button"]').should('be.visible');
        });
    });

    it('搜索功能应该提供即时反馈', () => {
      const searchTerm = '高性能';

      cy.get('[data-testid="search-input"]').type(searchTerm);

      // 应该显示搜索建议或即时结果
      cy.get('[data-testid="search-suggestions"]', { timeout: 1000 }).should('be.visible');

      // 按Enter搜索
      cy.get('[data-testid="search-input"]').type('{enter}');

      // 应该显示搜索结果
      cy.get('[data-testid="search-results"]').should('be.visible');
      cy.get('[data-testid="search-term"]').should('contain', searchTerm);
    });

    it('出价流程应该简单直观', () => {
      // 点击第一个拍卖
      cy.get('[data-testid="auction-card"]').first().click();

      // 应该进入拍卖详情页
      cy.url().should('include', '/auction/');
      cy.get('[data-testid="auction-details"]').should('be.visible');

      // 出价按钮应该突出显示
      cy.get('[data-testid="place-bid-button"]')
        .should('be.visible')
        .and('have.css', 'background-color')
        .and('not.equal', 'rgba(0, 0, 0, 0)');

      // 点击出价按钮
      cy.get('[data-testid="place-bid-button"]').click();

      // 应该显示出价表单
      cy.get('[data-testid="bid-form"]').should('be.visible');
      cy.get('[data-testid="bid-amount-input"]').should('be.visible');
      cy.get('[data-testid="submit-bid-button"]').should('be.visible');
    });

    it('错误消息应该清晰有用', () => {
      // 尝试提交空的出价表单
      cy.get('[data-testid="auction-card"]').first().click();
      cy.get('[data-testid="place-bid-button"]').click();
      cy.get('[data-testid="submit-bid-button"]').click();

      // 应该显示清晰的错误消息
      cy.get('[data-testid="error-message"]').should('be.visible').and('contain', '请输入出价金额');

      // 错误消息应该指向具体的字段
      cy.get('[data-testid="bid-amount-input"]')
        .should('have.class', 'error')
        .or('have.attr', 'aria-invalid', 'true');
    });

    it('加载状态应该提供清晰反馈', () => {
      // 模拟慢速网络
      cy.intercept('GET', '/api/v1/auctions', (req) => {
        req.reply((res) => {
          return new Promise((resolve) => {
            setTimeout(() => resolve(res), 2000);
          });
        });
      });

      cy.visit('/');

      // 应该显示加载指示器
      cy.get('[data-testid="loading-spinner"]').should('be.visible');
      cy.get('[data-testid="loading-text"]').should('contain', '加载中');

      // 加载完成后应该隐藏指示器
      cy.get('[data-testid="auction-list"]', { timeout: 5000 }).should('be.visible');
      cy.get('[data-testid="loading-spinner"]').should('not.exist');
    });
  });

  describe('无障碍测试', () => {
    it('应该支持键盘导航', () => {
      // Tab键导航
      cy.get('body').tab();
      cy.focused().should('be.visible');

      // 继续Tab导航到主要元素
      cy.focused().tab();
      cy.focused().should('have.attr', 'data-testid');

      // Enter键应该激活按钮
      cy.get('[data-testid="search-input"]').focus().type('test{enter}');

      // 空格键应该激活按钮
      cy.get('[data-testid="filter-button"]').first().focus().type(' ');
    });

    it('应该有正确的焦点管理', () => {
      // 打开模态框
      cy.get('[data-testid="auction-card"]').first().click();
      cy.get('[data-testid="place-bid-button"]').click();

      // 焦点应该移到模态框内
      cy.get('[data-testid="bid-form"]').within(() => {
        cy.focused().should('exist');
      });

      // 关闭模态框
      cy.get('[data-testid="close-modal-button"]').click();

      // 焦点应该返回到触发元素
      cy.get('[data-testid="place-bid-button"]').should('be.focused');
    });

    it('应该有适当的ARIA标签和角色', () => {
      // 检查主要地标
      cy.get('[role="main"]').should('exist');
      cy.get('[role="navigation"]').should('exist');
      cy.get('[role="banner"]').should('exist');

      // 检查按钮标签
      cy.get('[data-testid="bid-button"]').each(($btn) => {
        cy.wrap($btn).should('have.attr', 'aria-label');
      });

      // 检查表单标签
      cy.get('input').each(($input) => {
        cy.wrap($input).should('satisfy', ($el) => {
          return (
            $el.attr('aria-label') || $el.attr('aria-labelledby') || $el.prev('label').length > 0
          );
        });
      });

      // 检查状态信息
      cy.get('[data-testid="auction-status"]').first().should('have.attr', 'aria-live');
    });

    it('应该支持屏幕阅读器', () => {
      // 检查图片alt文本
      cy.get('img').each(($img) => {
        cy.wrap($img).should('have.attr', 'alt').and('not.be.empty');
      });

      // 检查链接文本
      cy.get('a').each(($link) => {
        const text = $link.text().trim();
        const ariaLabel = $link.attr('aria-label');
        expect(text || ariaLabel).to.not.be.empty;
      });

      // 检查标题层次
      cy.get('h1').should('have.length', 1);
      cy.get('h2, h3, h4, h5, h6').should('exist');
    });

    it('应该有足够的颜色对比度', () => {
      // 检查主要文本对比度
      cy.get('[data-testid="auction-title"]')
        .first()
        .then(($el) => {
          const color = $el.css('color');
          const backgroundColor = $el.css('background-color');

          // 这里应该有实际的对比度计算
          // 简化版本：确保颜色不是透明的
          expect(color).to.not.equal('rgba(0, 0, 0, 0)');
        });

      // 检查按钮对比度
      cy.get('[data-testid="bid-button"]')
        .first()
        .then(($el) => {
          const color = $el.css('color');
          const backgroundColor = $el.css('background-color');

          expect(color).to.not.equal(backgroundColor);
        });
    });

    it('应该支持高对比度模式', () => {
      // 模拟高对比度模式
      cy.get('html').invoke('attr', 'data-theme', 'high-contrast');

      // 检查元素在高对比度模式下的可见性
      cy.get('[data-testid="auction-card"]')
        .first()
        .should('be.visible')
        .and('have.css', 'border')
        .and('not.equal', 'none');
    });
  });

  describe('响应式设计测试', () => {
    const devices = [
      { name: 'iPhone SE', width: 375, height: 667 },
      { name: 'iPad', width: 768, height: 1024 },
      { name: 'Desktop', width: 1920, height: 1080 },
    ];

    devices.forEach(({ name, width, height }) => {
      it(`应该在${name}上正确显示`, () => {
        cy.viewport(width, height);

        // 检查导航菜单适配
        if (width < 768) {
          cy.get('[data-testid="mobile-menu-button"]').should('be.visible');
          cy.get('[data-testid="desktop-nav"]').should('not.be.visible');
        } else {
          cy.get('[data-testid="desktop-nav"]').should('be.visible');
        }

        // 检查拍卖卡片布局
        cy.get('[data-testid="auction-grid"]').then(($grid) => {
          const gridCols = $grid.css('grid-template-columns');

          if (width < 768) {
            // 移动端应该是单列
            expect(gridCols).to.match(/1fr|none/);
          } else if (width < 1024) {
            // 平板应该是2列
            expect(gridCols).to.include('1fr 1fr');
          } else {
            // 桌面应该是3列或更多
            expect(gridCols.split(' ').length).to.be.at.least(3);
          }
        });

        // 检查文字大小
        cy.get('[data-testid="auction-title"]')
          .first()
          .should('have.css', 'font-size')
          .then((fontSize) => {
            const size = parseInt(fontSize);
            expect(size).to.be.at.least(14); // 最小可读字体大小
          });
      });
    });

    it('应该支持触摸手势', () => {
      cy.viewport('iphone-x');

      // 测试滑动手势
      cy.get('[data-testid="auction-card"]')
        .first()
        .trigger('touchstart', { touches: [{ clientX: 100, clientY: 100 }] })
        .trigger('touchmove', { touches: [{ clientX: 200, clientY: 100 }] })
        .trigger('touchend');

      // 测试长按手势
      cy.get('[data-testid="auction-card"]')
        .first()
        .trigger('touchstart')
        .wait(1000)
        .trigger('touchend');
    });
  });

  describe('性能用户体验测试', () => {
    it('页面加载应该快速', () => {
      cy.visit('/', {
        onBeforeLoad: (win) => {
          win.performance.mark('start');
        },
      });

      cy.get('[data-testid="auction-list"]')
        .should('be.visible')
        .then(() => {
          cy.window()
            .its('performance')
            .then((performance) => {
              performance.mark('end');
              performance.measure('page-load', 'start', 'end');

              const measure = performance.getEntriesByName('page-load')[0];
              expect(measure.duration).to.be.lessThan(3000); // 3秒内加载
            });
        });
    });

    it('交互应该响应迅速', () => {
      cy.get('[data-testid="search-input"]').type('test');

      // 搜索建议应该快速出现
      cy.get('[data-testid="search-suggestions"]', { timeout: 500 }).should('be.visible');

      // 按钮点击应该有即时反馈
      cy.get('[data-testid="filter-button"]').first().click();
      cy.get('[data-testid="filter-button"]')
        .first()
        .should('have.class', 'active')
        .or('have.attr', 'aria-pressed', 'true');
    });

    it('动画应该流畅', () => {
      // 悬停动画
      cy.get('[data-testid="auction-card"]')
        .first()
        .trigger('mouseenter')
        .should('have.css', 'transform')
        .and('not.equal', 'none');

      // 页面切换动画
      cy.get('[data-testid="auction-card"]').first().click();
      cy.get('[data-testid="auction-details"]')
        .should('be.visible')
        .and('have.css', 'opacity', '1');
    });
  });

  describe('内容可读性测试', () => {
    it('文本应该易于阅读', () => {
      // 检查行高
      cy.get('[data-testid="auction-description"]')
        .first()
        .should('have.css', 'line-height')
        .then((lineHeight) => {
          const height = parseFloat(lineHeight);
          expect(height).to.be.at.least(1.4); // 推荐的最小行高
        });

      // 检查段落间距
      cy.get('p + p')
        .first()
        .should('have.css', 'margin-top')
        .then((marginTop) => {
          const margin = parseInt(marginTop);
          expect(margin).to.be.greaterThan(0);
        });
    });

    it('重要信息应该突出显示', () => {
      // 价格应该突出
      cy.get('[data-testid="current-price"]')
        .first()
        .should('have.css', 'font-weight')
        .then((fontWeight) => {
          const weight = parseInt(fontWeight);
          expect(weight).to.be.at.least(600); // 半粗体或更粗
        });

      // 剩余时间应该醒目
      cy.get('[data-testid="time-remaining"]')
        .first()
        .should('have.css', 'color')
        .and('not.equal', 'rgb(0, 0, 0)'); // 不是纯黑色
    });

    it('表单应该有清晰的标签和说明', () => {
      cy.get('[data-testid="auction-card"]').first().click();
      cy.get('[data-testid="place-bid-button"]').click();

      // 表单字段应该有标签
      cy.get('[data-testid="bid-amount-input"]')
        .should('have.attr', 'aria-label')
        .or('have.attr', 'aria-labelledby');

      // 应该有帮助文本
      cy.get('[data-testid="bid-help-text"]').should('be.visible').and('not.be.empty');

      // 必填字段应该标明
      cy.get('[data-testid="bid-amount-input"]')
        .should('have.attr', 'required')
        .or('have.attr', 'aria-required', 'true');
    });
  });

  describe('用户反馈和确认', () => {
    it('成功操作应该有明确反馈', () => {
      // 模拟成功的出价
      cy.intercept('POST', '/api/v1/bids', {
        statusCode: 201,
        body: { success: true, message: '出价成功' },
      });

      cy.get('[data-testid="auction-card"]').first().click();
      cy.get('[data-testid="place-bid-button"]').click();
      cy.get('[data-testid="bid-amount-input"]').type('1000');
      cy.get('[data-testid="submit-bid-button"]').click();

      // 应该显示成功消息
      cy.get('[data-testid="success-message"]').should('be.visible').and('contain', '出价成功');
    });

    it('重要操作应该要求确认', () => {
      // 尝试删除操作（如果有的话）
      cy.get('[data-testid="delete-button"]').first().click();

      // 应该显示确认对话框
      cy.get('[data-testid="confirm-dialog"]').should('be.visible');
      cy.get('[data-testid="confirm-message"]')
        .should('contain', '确定要删除')
        .or('contain', '此操作不可撤销');

      // 应该有取消选项
      cy.get('[data-testid="cancel-button"]').should('be.visible');
      cy.get('[data-testid="confirm-button"]').should('be.visible');
    });

    it('应该提供撤销选项', () => {
      // 执行可撤销的操作
      cy.get('[data-testid="favorite-button"]').first().click();

      // 应该显示撤销选项
      cy.get('[data-testid="undo-notification"]').should('be.visible').and('contain', '撤销');

      // 点击撤销
      cy.get('[data-testid="undo-button"]').click();

      // 操作应该被撤销
      cy.get('[data-testid="favorite-button"]').first().should('not.have.class', 'active');
    });
  });
});
