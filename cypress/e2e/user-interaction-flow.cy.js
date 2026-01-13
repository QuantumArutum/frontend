// 用户交互流程测试套件
describe('用户交互流程测试', () => {
  beforeEach(() => {
    // 设置测试环境
    cy.setupTestEnvironment();
    cy.visit('/');
  });

  describe('完整的用户注册和登录流程', () => {
    it('新用户应该能够完成完整的注册流程', () => {
      // 1. 访问注册页面
      cy.get('[data-testid="register-link"]').click();
      cy.url().should('include', '/register');
      
      // 2. 填写注册表单
      const userData = {
        username: `testuser_${Date.now()}`,
        email: `test_${Date.now()}@example.com`,
        password: 'SecurePassword123!',
        firstName: '测试',
        lastName: '用户'
      };
      
      cy.get('[data-testid="username-input"]').type(userData.username);
      cy.get('[data-testid="email-input"]').type(userData.email);
      cy.get('[data-testid="password-input"]').type(userData.password);
      cy.get('[data-testid="confirm-password-input"]').type(userData.password);
      cy.get('[data-testid="first-name-input"]').type(userData.firstName);
      cy.get('[data-testid="last-name-input"]').type(userData.lastName);
      
      // 3. 同意条款
      cy.get('[data-testid="terms-checkbox"]').check();
      cy.get('[data-testid="privacy-checkbox"]').check();
      
      // 4. 提交注册
      cy.get('[data-testid="register-button"]').click();
      
      // 5. 验证注册成功
      cy.get('[data-testid="registration-success"]')
        .should('be.visible')
        .and('contain', '注册成功');
      
      // 6. 验证邮箱验证提示
      cy.get('[data-testid="email-verification-notice"]')
        .should('be.visible')
        .and('contain', '请查看邮箱');
      
      // 7. 模拟邮箱验证
      cy.visit(`/verify-email?token=mock_verification_token`);
      cy.get('[data-testid="verification-success"]')
        .should('be.visible')
        .and('contain', '邮箱验证成功');
      
      // 8. 自动登录或跳转到登录页
      cy.url().should('include', '/login');
    });

    it('用户应该能够成功登录', () => {
      // 使用预设的测试账户
      cy.get('[data-testid="login-link"]').click();
      
      cy.get('[data-testid="email-input"]').type('test@quantaureum.com');
      cy.get('[data-testid="password-input"]').type('TestPassword123!');
      cy.get('[data-testid="login-button"]').click();
      
      // 验证登录成功
      cy.get('[data-testid="user-menu"]').should('be.visible');
      cy.get('[data-testid="user-avatar"]').should('be.visible');
      cy.url().should('not.include', '/login');
    });

    it('应该处理登录错误', () => {
      cy.get('[data-testid="login-link"]').click();
      
      // 使用错误的凭据
      cy.get('[data-testid="email-input"]').type('wrong@email.com');
      cy.get('[data-testid="password-input"]').type('wrongpassword');
      cy.get('[data-testid="login-button"]').click();
      
      // 验证错误消息
      cy.get('[data-testid="login-error"]')
        .should('be.visible')
        .and('contain', '邮箱或密码错误');
    });
  });

  describe('拍卖浏览和搜索流程', () => {
    beforeEach(() => {
      cy.loginAsTestUser();
    });

    it('用户应该能够浏览和筛选拍卖', () => {
      // 1. 查看拍卖列表
      cy.get('[data-testid="auction-list"]').should('be.visible');
      cy.get('[data-testid="auction-card"]').should('have.length.greaterThan', 0);
      
      // 2. 使用筛选器
      cy.get('[data-testid="filter-status"]').select('active');
      cy.get('[data-testid="filter-price-min"]').type('1000');
      cy.get('[data-testid="filter-price-max"]').type('10000');
      cy.get('[data-testid="apply-filters"]').click();
      
      // 3. 验证筛选结果
      cy.get('[data-testid="auction-card"]').each(($card) => {
        cy.wrap($card).within(() => {
          cy.get('[data-testid="auction-status"]').should('contain', '进行中');
          cy.get('[data-testid="current-price"]').invoke('text').then((priceText) => {
            const price = parseFloat(priceText.replace(/[^\d.]/g, ''));
            expect(price).to.be.within(1000, 10000);
          });
        });
      });
      
      // 4. 搜索功能
      cy.get('[data-testid="search-input"]').type('高性能节点');
      cy.get('[data-testid="search-button"]').click();
      
      // 5. 验证搜索结果
      cy.get('[data-testid="search-results"]').should('be.visible');
      cy.get('[data-testid="search-term"]').should('contain', '高性能节点');
    });

    it('用户应该能够查看拍卖详情', () => {
      // 1. 点击拍卖卡片
      cy.get('[data-testid="auction-card"]').first().click();
      
      // 2. 验证详情页面
      cy.url().should('include', '/auction/');
      cy.get('[data-testid="auction-details"]').should('be.visible');
      
      // 3. 检查详情页面内容
      cy.get('[data-testid="auction-title"]').should('be.visible');
      cy.get('[data-testid="auction-description"]').should('be.visible');
      cy.get('[data-testid="current-price"]').should('be.visible');
      cy.get('[data-testid="time-remaining"]').should('be.visible');
      cy.get('[data-testid="bid-history"]').should('be.visible');
      cy.get('[data-testid="node-specifications"]').should('be.visible');
      
      // 4. 检查操作按钮
      cy.get('[data-testid="place-bid-button"]').should('be.visible');
      cy.get('[data-testid="buy-now-button"]').should('be.visible');
      cy.get('[data-testid="watch-auction-button"]').should('be.visible');
    });
  });

  describe('出价流程测试', () => {
    beforeEach(() => {
      cy.loginAsTestUser();
      cy.setupConnectedWallet();
    });

    it('用户应该能够成功出价', () => {
      // 1. 进入拍卖详情页
      cy.get('[data-testid="auction-card"]').first().click();
      
      // 2. 获取当前价格
      cy.get('[data-testid="current-price"]').invoke('text').then((currentPriceText) => {
        const currentPrice = parseFloat(currentPriceText.replace(/[^\d.]/g, ''));
        const bidAmount = currentPrice + 100;
        
        // 3. 点击出价按钮
        cy.get('[data-testid="place-bid-button"]').click();
        
        // 4. 填写出价表单
        cy.get('[data-testid="bid-amount-input"]').type(bidAmount.toString());
        
        // 5. 确认出价
        cy.get('[data-testid="confirm-bid-button"]').click();
        
        // 6. 验证钱包交互
        cy.get('[data-testid="wallet-confirmation"]').should('be.visible');
        cy.get('[data-testid="transaction-details"]').should('be.visible');
        
        // 7. 确认交易
        cy.get('[data-testid="confirm-transaction"]').click();
        
        // 8. 验证出价成功
        cy.get('[data-testid="bid-success"]', { timeout: 10000 })
          .should('be.visible')
          .and('contain', '出价成功');
        
        // 9. 验证页面更新
        cy.get('[data-testid="current-price"]').should('contain', bidAmount.toString());
        cy.get('[data-testid="bid-history"]').within(() => {
          cy.get('[data-testid="latest-bid"]').should('contain', bidAmount.toString());
        });
      });
    });

    it('应该处理出价验证错误', () => {
      cy.get('[data-testid="auction-card"]').first().click();
      cy.get('[data-testid="place-bid-button"]').click();
      
      // 1. 测试出价金额过低
      cy.get('[data-testid="bid-amount-input"]').type('1');
      cy.get('[data-testid="confirm-bid-button"]').click();
      
      cy.get('[data-testid="bid-error"]')
        .should('be.visible')
        .and('contain', '出价金额过低');
      
      // 2. 测试无效金额
      cy.get('[data-testid="bid-amount-input"]').clear().type('abc');
      cy.get('[data-testid="confirm-bid-button"]').click();
      
      cy.get('[data-testid="bid-error"]')
        .should('be.visible')
        .and('contain', '请输入有效金额');
    });
  });

  describe('一口价购买流程', () => {
    beforeEach(() => {
      cy.loginAsTestUser();
      cy.setupConnectedWallet();
    });

    it('用户应该能够成功一口价购买', () => {
      // 1. 进入拍卖详情页
      cy.get('[data-testid="auction-card"]').first().click();
      
      // 2. 点击一口价购买
      cy.get('[data-testid="buy-now-button"]').click();
      
      // 3. 确认购买详情
      cy.get('[data-testid="buy-now-modal"]').should('be.visible');
      cy.get('[data-testid="purchase-summary"]').should('be.visible');
      cy.get('[data-testid="total-amount"]').should('be.visible');
      cy.get('[data-testid="platform-fee"]').should('be.visible');
      
      // 4. 确认购买
      cy.get('[data-testid="confirm-purchase"]').click();
      
      // 5. 钱包确认
      cy.get('[data-testid="wallet-confirmation"]').should('be.visible');
      cy.get('[data-testid="confirm-transaction"]').click();
      
      // 6. 验证购买成功
      cy.get('[data-testid="purchase-success"]', { timeout: 15000 })
        .should('be.visible')
        .and('contain', '购买成功');
      
      // 7. 验证拍卖状态更新
      cy.get('[data-testid="auction-status"]').should('contain', '已售出');
      cy.get('[data-testid="winner-badge"]').should('be.visible');
    });
  });

  describe('KYC验证流程', () => {
    beforeEach(() => {
      cy.loginAsTestUser();
    });

    it('用户应该能够完成KYC验证', () => {
      // 1. 访问KYC页面
      cy.get('[data-testid="user-menu"]').click();
      cy.get('[data-testid="kyc-verification"]').click();
      
      // 2. 填写个人信息
      cy.get('[data-testid="first-name"]').type('张');
      cy.get('[data-testid="last-name"]').type('三');
      cy.get('[data-testid="date-of-birth"]').type('1990-01-01');
      cy.get('[data-testid="nationality"]').select('CN');
      cy.get('[data-testid="phone-number"]').type('13800138000');
      cy.get('[data-testid="address"]').type('北京市朝阳区测试街道123号');
      cy.get('[data-testid="city"]').type('北京');
      cy.get('[data-testid="country"]').select('CN');
      
      cy.get('[data-testid="next-step"]').click();
      
      // 3. 上传身份证件
      cy.get('[data-testid="id-type"]').select('id_card');
      cy.get('[data-testid="id-number"]').type('110101199001011234');
      
      // 模拟文件上传
      cy.fixture('test-id-front.jpg').then(fileContent => {
        cy.get('[data-testid="id-front-upload"]').attachFile({
          fileContent: fileContent.toString(),
          fileName: 'id-front.jpg',
          mimeType: 'image/jpeg'
        });
      });
      
      cy.fixture('test-id-back.jpg').then(fileContent => {
        cy.get('[data-testid="id-back-upload"]').attachFile({
          fileContent: fileContent.toString(),
          fileName: 'id-back.jpg',
          mimeType: 'image/jpeg'
        });
      });
      
      cy.get('[data-testid="next-step"]').click();
      
      // 4. 上传自拍照
      cy.fixture('test-selfie.jpg').then(fileContent => {
        cy.get('[data-testid="selfie-upload"]').attachFile({
          fileContent: fileContent.toString(),
          fileName: 'selfie.jpg',
          mimeType: 'image/jpeg'
        });
      });
      
      cy.get('[data-testid="next-step"]').click();
      
      // 5. 提交KYC申请
      cy.get('[data-testid="submit-kyc"]').click();
      
      // 6. 验证提交成功
      cy.get('[data-testid="kyc-submitted"]')
        .should('be.visible')
        .and('contain', 'KYC申请已提交');
      
      cy.get('[data-testid="kyc-status"]').should('contain', '审核中');
    });
  });

  describe('用户设置和个人资料管理', () => {
    beforeEach(() => {
      cy.loginAsTestUser();
    });

    it('用户应该能够更新个人资料', () => {
      // 1. 访问设置页面
      cy.get('[data-testid="user-menu"]').click();
      cy.get('[data-testid="user-settings"]').click();
      
      // 2. 更新个人信息
      cy.get('[data-testid="display-name"]').clear().type('新的显示名称');
      cy.get('[data-testid="bio"]').clear().type('这是我的新个人简介');
      
      // 3. 更新通知设置
      cy.get('[data-testid="email-notifications"]').check();
      cy.get('[data-testid="bid-notifications"]').check();
      cy.get('[data-testid="auction-end-notifications"]').uncheck();
      
      // 4. 保存设置
      cy.get('[data-testid="save-settings"]').click();
      
      // 5. 验证保存成功
      cy.get('[data-testid="settings-saved"]')
        .should('be.visible')
        .and('contain', '设置已保存');
    });

    it('用户应该能够修改密码', () => {
      cy.get('[data-testid="user-menu"]').click();
      cy.get('[data-testid="user-settings"]').click();
      cy.get('[data-testid="security-tab"]').click();
      
      // 1. 填写密码修改表单
      cy.get('[data-testid="current-password"]').type('TestPassword123!');
      cy.get('[data-testid="new-password"]').type('NewPassword123!');
      cy.get('[data-testid="confirm-new-password"]').type('NewPassword123!');
      
      // 2. 提交修改
      cy.get('[data-testid="change-password"]').click();
      
      // 3. 验证修改成功
      cy.get('[data-testid="password-changed"]')
        .should('be.visible')
        .and('contain', '密码修改成功');
    });
  });

  describe('错误处理和边界情况', () => {
    it('应该处理网络错误', () => {
      // 模拟网络错误
      cy.intercept('GET', '/api/v1/auctions', { forceNetworkError: true });
      
      cy.visit('/');
      
      // 验证错误处理
      cy.get('[data-testid="network-error"]')
        .should('be.visible')
        .and('contain', '网络连接失败');
      
      cy.get('[data-testid="retry-button"]').should('be.visible');
    });

    it('应该处理服务器错误', () => {
      // 模拟服务器错误
      cy.intercept('GET', '/api/v1/auctions', { statusCode: 500 });
      
      cy.visit('/');
      
      // 验证错误处理
      cy.get('[data-testid="server-error"]')
        .should('be.visible')
        .and('contain', '服务器暂时不可用');
    });

    it('应该处理会话过期', () => {
      cy.loginAsTestUser();
      
      // 模拟会话过期
      cy.intercept('GET', '/api/v1/user/profile', { statusCode: 401 });
      
      cy.get('[data-testid="user-menu"]').click();
      cy.get('[data-testid="user-profile"]').click();
      
      // 应该重定向到登录页
      cy.url().should('include', '/login');
      cy.get('[data-testid="session-expired"]')
        .should('be.visible')
        .and('contain', '会话已过期');
    });
  });
});

// 自定义命令
Cypress.Commands.add('setupTestEnvironment', () => {
  // 设置测试环境的通用配置
  cy.window().then((win) => {
    win.localStorage.setItem('test_mode', 'true');
  });
});

Cypress.Commands.add('loginAsTestUser', () => {
  // 快速登录测试用户
  cy.request({
    method: 'POST',
    url: '/api/v1/auth/login',
    body: {
      email: 'test@quantaureum.com',
      password: 'TestPassword123!'
    }
  }).then((response) => {
    window.localStorage.setItem('authToken', response.body.data.tokens.accessToken);
    window.localStorage.setItem('user', JSON.stringify(response.body.data.user));
  });
});
