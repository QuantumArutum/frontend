// 钱包连接测试套件
describe('钱包连接测试', () => {
  beforeEach(() => {
    // 模拟MetaMask环境
    cy.window().then((win) => {
      // 模拟ethereum对象
      win.ethereum = {
        isMetaMask: true,
        request: cy.stub().as('ethereumRequest'),
        on: cy.stub().as('ethereumOn'),
        removeListener: cy.stub().as('ethereumRemoveListener'),
        selectedAddress: null,
        chainId: '0x1', // Ethereum Mainnet
        networkVersion: '1',
      };
    });

    cy.visit('/');
  });

  describe('钱包检测和连接', () => {
    it('应该检测到MetaMask钱包', () => {
      cy.get('[data-testid="wallet-connect-button"]').click();

      // 应该显示MetaMask选项
      cy.get('[data-testid="metamask-option"]').should('be.visible');
      cy.get('[data-testid="metamask-icon"]').should('be.visible');
      cy.get('[data-testid="metamask-label"]').should('contain', 'MetaMask');
    });

    it('应该处理未安装钱包的情况', () => {
      // 移除ethereum对象
      cy.window().then((win) => {
        delete win.ethereum;
      });

      cy.reload();
      cy.get('[data-testid="wallet-connect-button"]').click();

      // 应该显示安装提示
      cy.get('[data-testid="install-wallet-message"]')
        .should('be.visible')
        .and('contain', '请先安装MetaMask');

      cy.get('[data-testid="install-metamask-link"]')
        .should('be.visible')
        .and('have.attr', 'href')
        .and('include', 'metamask.io');
    });

    it('应该成功连接MetaMask钱包', () => {
      // 模拟成功的钱包连接
      cy.get('@ethereumRequest').callsFake((params) => {
        if (params.method === 'eth_requestAccounts') {
          return Promise.resolve(['0x1234567890123456789012345678901234567890']);
        }
        if (params.method === 'eth_chainId') {
          return Promise.resolve('0x1');
        }
        if (params.method === 'eth_getBalance') {
          return Promise.resolve('0x1bc16d674ec80000'); // 2 ETH
        }
        return Promise.resolve();
      });

      cy.get('[data-testid="wallet-connect-button"]').click();
      cy.get('[data-testid="metamask-option"]').click();

      // 应该显示连接成功状态
      cy.get('[data-testid="wallet-connected"]').should('be.visible');
      cy.get('[data-testid="wallet-address"]').should('be.visible').and('contain', '0x1234...7890');
      cy.get('[data-testid="wallet-balance"]').should('be.visible').and('contain', '2.0000 ETH');
    });

    it('应该处理用户拒绝连接', () => {
      // 模拟用户拒绝连接
      cy.get('@ethereumRequest').callsFake((params) => {
        if (params.method === 'eth_requestAccounts') {
          const error = new Error('User rejected the request');
          error.code = 4001;
          return Promise.reject(error);
        }
        return Promise.resolve();
      });

      cy.get('[data-testid="wallet-connect-button"]').click();
      cy.get('[data-testid="metamask-option"]').click();

      // 应该显示拒绝连接的消息
      cy.get('[data-testid="connection-error"]')
        .should('be.visible')
        .and('contain', '用户拒绝连接');
    });
  });

  describe('网络检测和切换', () => {
    beforeEach(() => {
      // 模拟已连接的钱包
      cy.get('@ethereumRequest').callsFake((params) => {
        if (params.method === 'eth_requestAccounts') {
          return Promise.resolve(['0x1234567890123456789012345678901234567890']);
        }
        if (params.method === 'eth_chainId') {
          return Promise.resolve('0x1'); // Ethereum Mainnet
        }
        if (params.method === 'eth_getBalance') {
          return Promise.resolve('0x1bc16d674ec80000');
        }
        return Promise.resolve();
      });

      cy.get('[data-testid="wallet-connect-button"]').click();
      cy.get('[data-testid="metamask-option"]').click();
    });

    it('应该显示当前网络信息', () => {
      cy.get('[data-testid="current-network"]')
        .should('be.visible')
        .and('contain', 'Ethereum Mainnet');

      cy.get('[data-testid="network-status"]')
        .should('have.class', 'connected')
        .or('have.class', 'success');
    });

    it('应该检测不支持的网络', () => {
      // 模拟切换到不支持的网络
      cy.get('@ethereumRequest').callsFake((params) => {
        if (params.method === 'eth_chainId') {
          return Promise.resolve('0x38'); // BSC Mainnet (不支持)
        }
        return Promise.resolve();
      });

      // 触发网络变化事件
      cy.window().then((win) => {
        const changeHandler = cy
          .get('@ethereumOn')
          .args.find((args) => args[0] === 'chainChanged')[1];
        changeHandler('0x38');
      });

      // 应该显示网络不支持的警告
      cy.get('[data-testid="unsupported-network"]')
        .should('be.visible')
        .and('contain', '当前网络不受支持');

      cy.get('[data-testid="switch-network-button"]')
        .should('be.visible')
        .and('contain', '切换网络');
    });

    it('应该能够切换到支持的网络', () => {
      // 模拟网络切换请求
      cy.get('@ethereumRequest').callsFake((params) => {
        if (params.method === 'wallet_switchEthereumChain') {
          return Promise.resolve();
        }
        if (params.method === 'eth_chainId') {
          return Promise.resolve('0x89'); // Polygon
        }
        return Promise.resolve();
      });

      cy.get('[data-testid="network-selector"]').click();
      cy.get('[data-testid="polygon-network"]').click();

      // 应该显示切换成功
      cy.get('[data-testid="current-network"]').should('contain', 'Polygon');
    });
  });

  describe('出价支付流程测试', () => {
    beforeEach(() => {
      // 设置已连接的钱包
      cy.setupConnectedWallet();

      // 进入拍卖详情页
      cy.get('[data-testid="auction-card"]').first().click();
    });

    it('应该在出价时提示连接钱包', () => {
      // 断开钱包连接
      cy.get('[data-testid="disconnect-wallet"]').click();

      // 尝试出价
      cy.get('[data-testid="place-bid-button"]').click();

      // 应该显示连接钱包提示
      cy.get('[data-testid="connect-wallet-prompt"]')
        .should('be.visible')
        .and('contain', '请先连接钱包');

      cy.get('[data-testid="connect-wallet-action"]')
        .should('be.visible')
        .and('contain', '连接钱包');
    });

    it('应该验证余额是否足够', () => {
      // 模拟余额不足
      cy.get('@ethereumRequest').callsFake((params) => {
        if (params.method === 'eth_getBalance') {
          return Promise.resolve('0x0'); // 0 ETH
        }
        return Promise.resolve();
      });

      cy.get('[data-testid="place-bid-button"]').click();
      cy.get('[data-testid="bid-amount-input"]').type('1');
      cy.get('[data-testid="submit-bid-button"]').click();

      // 应该显示余额不足警告
      cy.get('[data-testid="insufficient-balance"]')
        .should('be.visible')
        .and('contain', '余额不足');
    });

    it('应该成功提交出价交易', () => {
      // 模拟成功的交易
      cy.get('@ethereumRequest').callsFake((params) => {
        if (params.method === 'eth_sendTransaction') {
          return Promise.resolve(
            '0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890'
          );
        }
        if (params.method === 'eth_getTransactionReceipt') {
          return Promise.resolve({
            status: '0x1',
            transactionHash: '0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890',
          });
        }
        return Promise.resolve();
      });

      cy.get('[data-testid="place-bid-button"]').click();
      cy.get('[data-testid="bid-amount-input"]').type('1');
      cy.get('[data-testid="submit-bid-button"]').click();

      // 应该显示交易确认
      cy.get('[data-testid="transaction-pending"]')
        .should('be.visible')
        .and('contain', '交易确认中');

      // 应该显示成功消息
      cy.get('[data-testid="bid-success"]', { timeout: 10000 })
        .should('be.visible')
        .and('contain', '出价成功');

      // 应该显示交易哈希
      cy.get('[data-testid="transaction-hash"]').should('be.visible').and('contain', '0xabcdef');
    });

    it('应该处理交易失败', () => {
      // 模拟交易失败
      cy.get('@ethereumRequest').callsFake((params) => {
        if (params.method === 'eth_sendTransaction') {
          const error = new Error('Transaction failed');
          error.code = -32603;
          return Promise.reject(error);
        }
        return Promise.resolve();
      });

      cy.get('[data-testid="place-bid-button"]').click();
      cy.get('[data-testid="bid-amount-input"]').type('1');
      cy.get('[data-testid="submit-bid-button"]').click();

      // 应该显示错误消息
      cy.get('[data-testid="transaction-error"]').should('be.visible').and('contain', '交易失败');

      // 应该提供重试选项
      cy.get('[data-testid="retry-transaction"]').should('be.visible').and('contain', '重试');
    });
  });

  describe('一口价支付流程测试', () => {
    beforeEach(() => {
      cy.setupConnectedWallet();
      cy.get('[data-testid="auction-card"]').first().click();
    });

    it('应该显示一口价支付选项', () => {
      cy.get('[data-testid="buy-now-button"]').should('be.visible').and('contain', '立即购买');

      cy.get('[data-testid="buy-now-price"]')
        .should('be.visible')
        .and('match', /\d+(\.\d+)?\s*(ETH|MATIC)/);
    });

    it('应该确认一口价购买', () => {
      cy.get('[data-testid="buy-now-button"]').click();

      // 应该显示确认对话框
      cy.get('[data-testid="buy-now-confirm"]').should('be.visible').and('contain', '确认购买');

      cy.get('[data-testid="total-amount"]').should('be.visible');

      cy.get('[data-testid="platform-fee"]').should('be.visible').and('contain', '平台手续费');
    });

    it('应该成功执行一口价购买', () => {
      // 模拟成功的购买交易
      cy.get('@ethereumRequest').callsFake((params) => {
        if (params.method === 'eth_sendTransaction') {
          return Promise.resolve(
            '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef'
          );
        }
        if (params.method === 'eth_getTransactionReceipt') {
          return Promise.resolve({
            status: '0x1',
            transactionHash: '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
          });
        }
        return Promise.resolve();
      });

      cy.get('[data-testid="buy-now-button"]').click();
      cy.get('[data-testid="confirm-purchase"]').click();

      // 应该显示购买成功
      cy.get('[data-testid="purchase-success"]', { timeout: 10000 })
        .should('be.visible')
        .and('contain', '购买成功');

      // 应该更新拍卖状态
      cy.get('[data-testid="auction-status"]').should('contain', '已售出');
    });
  });

  describe('钱包状态管理', () => {
    it('应该处理账户切换', () => {
      cy.setupConnectedWallet();

      // 模拟账户切换
      cy.window().then((win) => {
        const changeHandler = cy
          .get('@ethereumOn')
          .args.find((args) => args[0] === 'accountsChanged')[1];
        changeHandler(['0x9876543210987654321098765432109876543210']);
      });

      // 应该更新显示的账户
      cy.get('[data-testid="wallet-address"]').should('contain', '0x9876...3210');
    });

    it('应该处理钱包断开连接', () => {
      cy.setupConnectedWallet();

      // 模拟钱包断开
      cy.window().then((win) => {
        const changeHandler = cy
          .get('@ethereumOn')
          .args.find((args) => args[0] === 'accountsChanged')[1];
        changeHandler([]);
      });

      // 应该显示未连接状态
      cy.get('[data-testid="wallet-connect-button"]')
        .should('be.visible')
        .and('contain', '连接钱包');

      cy.get('[data-testid="wallet-connected"]').should('not.exist');
    });

    it('应该自动重连已授权的钱包', () => {
      // 模拟页面刷新时的自动连接
      cy.get('@ethereumRequest').callsFake((params) => {
        if (params.method === 'eth_accounts') {
          return Promise.resolve(['0x1234567890123456789012345678901234567890']);
        }
        return Promise.resolve();
      });

      cy.reload();

      // 应该自动显示连接状态
      cy.get('[data-testid="wallet-connected"]', { timeout: 5000 }).should('be.visible');
    });
  });

  describe('错误处理和用户体验', () => {
    it('应该显示清晰的错误消息', () => {
      cy.setupConnectedWallet();

      // 模拟RPC错误
      cy.get('@ethereumRequest').callsFake((params) => {
        if (params.method === 'eth_sendTransaction') {
          const error = new Error('RPC Error');
          error.code = -32603;
          error.data = { message: 'insufficient funds for gas * price + value' };
          return Promise.reject(error);
        }
        return Promise.resolve();
      });

      cy.get('[data-testid="auction-card"]').first().click();
      cy.get('[data-testid="place-bid-button"]').click();
      cy.get('[data-testid="bid-amount-input"]').type('1');
      cy.get('[data-testid="submit-bid-button"]').click();

      // 应该显示用户友好的错误消息
      cy.get('[data-testid="transaction-error"]')
        .should('be.visible')
        .and('contain', 'Gas费用不足');
    });

    it('应该提供交易状态跟踪', () => {
      cy.setupConnectedWallet();

      let transactionSent = false;
      cy.get('@ethereumRequest').callsFake((params) => {
        if (params.method === 'eth_sendTransaction') {
          transactionSent = true;
          return Promise.resolve('0xabcdef1234567890');
        }
        if (params.method === 'eth_getTransactionReceipt' && transactionSent) {
          return Promise.resolve(null); // 交易还未确认
        }
        return Promise.resolve();
      });

      cy.get('[data-testid="auction-card"]').first().click();
      cy.get('[data-testid="place-bid-button"]').click();
      cy.get('[data-testid="bid-amount-input"]').type('1');
      cy.get('[data-testid="submit-bid-button"]').click();

      // 应该显示交易状态
      cy.get('[data-testid="transaction-status"]').should('be.visible').and('contain', '等待确认');

      // 应该显示区块浏览器链接
      cy.get('[data-testid="view-on-explorer"]')
        .should('be.visible')
        .and('have.attr', 'href')
        .and('include', '0xabcdef1234567890');
    });
  });
});

// 自定义命令
Cypress.Commands.add('setupConnectedWallet', () => {
  cy.get('@ethereumRequest').callsFake((params) => {
    if (params.method === 'eth_requestAccounts') {
      return Promise.resolve(['0x1234567890123456789012345678901234567890']);
    }
    if (params.method === 'eth_accounts') {
      return Promise.resolve(['0x1234567890123456789012345678901234567890']);
    }
    if (params.method === 'eth_chainId') {
      return Promise.resolve('0x1');
    }
    if (params.method === 'eth_getBalance') {
      return Promise.resolve('0x1bc16d674ec80000'); // 2 ETH
    }
    return Promise.resolve();
  });

  cy.get('[data-testid="wallet-connect-button"]').click();
  cy.get('[data-testid="metamask-option"]').click();
  cy.get('[data-testid="wallet-connected"]').should('be.visible');
});
