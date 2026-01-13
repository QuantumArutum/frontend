'use client';

import React from 'react';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import EnhancedNavbar from '../../components/EnhancedNavbar';
import EnhancedFooter from '../../components/EnhancedFooter';
import ParticlesBackground from '../../components/ParticlesBackground';
import '../../../i18n/index';

export default function DeveloperDocs() {
  const { t } = useTranslation();

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
              {t('developer_docs.title', 'Developer Documentation')}
            </h1>
            <p className="text-xl text-quantum-secondary max-w-3xl mx-auto">
              {t('developer_docs.subtitle', 'Complete API documentation and development guides to help you quickly build quantum-safe blockchain applications')}
            </p>
          </div>
        </div>
      </section>

      {/* Quick Start */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-quantum-light mb-6">{t('developer_docs.quick_start.title', 'Quick Start')}</h2>
            <p className="text-xl text-quantum-secondary max-w-3xl mx-auto">
              {t('developer_docs.quick_start.subtitle', 'Start your first Quantaureum application development in minutes')}
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="quantum-card p-6 text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-quantum-gradient-primary rounded-full flex items-center justify-center">
                <span className="text-2xl">1</span>
              </div>
              <h3 className="text-xl font-bold text-quantum-light mb-3">{t('developer_docs.quick_start.step1.title', 'Install SDK')}</h3>
              <p className="text-quantum-secondary mb-4">
                {t('developer_docs.quick_start.step1.desc', 'Download and install the Quantaureum development toolkit')}
              </p>
              <code className="bg-quantum-dark-secondary p-2 rounded text-quantum-accent text-sm">
                npm install @quantaureum/sdk
              </code>
            </div>

            <div className="quantum-card p-6 text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-quantum-gradient-secondary rounded-full flex items-center justify-center">
                <span className="text-2xl">2</span>
              </div>
              <h3 className="text-xl font-bold text-quantum-light mb-3">{t('developer_docs.quick_start.step2.title', 'Create Wallet')}</h3>
              <p className="text-quantum-secondary mb-4">
                {t('developer_docs.quick_start.step2.desc', 'Create your first wallet using quantum-safe algorithms')}
              </p>
              <code className="bg-quantum-dark-secondary p-2 rounded text-quantum-accent text-sm">
                const wallet = new QAWallet()
              </code>
            </div>

            <div className="quantum-card p-6 text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-quantum-gradient-accent rounded-full flex items-center justify-center">
                <span className="text-2xl">3</span>
              </div>
              <h3 className="text-xl font-bold text-quantum-light mb-3">{t('developer_docs.quick_start.step3.title', 'Send Transaction')}</h3>
              <p className="text-quantum-secondary mb-4">
                {t('developer_docs.quick_start.step3.desc', 'Send your first transaction using quantum signatures')}
              </p>
              <code className="bg-quantum-dark-secondary p-2 rounded text-quantum-accent text-sm">
                await wallet.sendTransaction()
              </code>
            </div>
          </div>
        </div>
      </section>

      {/* API Documentation */}
      <section className="py-16 bg-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-quantum-light mb-6">{t('developer_docs.api.title', 'API Documentation')}</h2>
            <p className="text-xl text-quantum-secondary max-w-3xl mx-auto">
              {t('developer_docs.api.subtitle', 'Complete API reference documentation covering all core features')}
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="quantum-card p-6">
              <div className="w-16 h-16 mb-4 bg-quantum-gradient-primary rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-quantum-light mb-3">{t('developer_docs.api.wallet.title', 'Wallet API')}</h3>
              <p className="text-quantum-secondary mb-4">
                {t('developer_docs.api.wallet.desc', 'Quantum-safe wallet creation, management and transaction features')}
              </p>
              <Link href="/docs/wallet-api" className="text-quantum-primary hover:text-quantum-accent transition-colors">
                {t('developer_docs.view_docs', 'View Docs')} →
              </Link>
            </div>

            <div className="quantum-card p-6">
              <div className="w-16 h-16 mb-4 bg-quantum-gradient-secondary rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-quantum-light mb-3">{t('developer_docs.api.transaction.title', 'Transaction API')}</h3>
              <p className="text-quantum-secondary mb-4">
                {t('developer_docs.api.transaction.desc', 'High-performance transaction processing and query interfaces')}
              </p>
              <Link href="/docs/transaction-api" className="text-quantum-primary hover:text-quantum-accent transition-colors">
                {t('developer_docs.view_docs', 'View Docs')} →
              </Link>
            </div>

            <div className="quantum-card p-6">
              <div className="w-16 h-16 mb-4 bg-quantum-gradient-accent rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-quantum-light mb-3">{t('developer_docs.api.smart_contract.title', 'Smart Contract API')}</h3>
              <p className="text-quantum-secondary mb-4">
                {t('developer_docs.api.smart_contract.desc', 'Deploy and call quantum-safe smart contracts')}
              </p>
              <Link href="/docs/smart-contract-api" className="text-quantum-primary hover:text-quantum-accent transition-colors">
                {t('developer_docs.view_docs', 'View Docs')} →
              </Link>
            </div>

            <div className="quantum-card p-6">
              <div className="w-16 h-16 mb-4 bg-quantum-gradient-primary rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-quantum-light mb-3">{t('developer_docs.api.data.title', 'Data API')}</h3>
              <p className="text-quantum-secondary mb-4">
                {t('developer_docs.api.data.desc', 'Blockchain data query and analysis interfaces')}
              </p>
              <Link href="/docs/data-api" className="text-quantum-primary hover:text-quantum-accent transition-colors">
                {t('developer_docs.view_docs', 'View Docs')} →
              </Link>
            </div>

            <div className="quantum-card p-6">
              <div className="w-16 h-16 mb-4 bg-quantum-gradient-secondary rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l3 3-3 3m13 0h-6m-2-5h6m2 5v6a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h14a2 2 0 012 2v1" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-quantum-light mb-3">{t('developer_docs.api.crosschain.title', 'Cross-chain API')}</h3>
              <p className="text-quantum-secondary mb-4">
                {t('developer_docs.api.crosschain.desc', 'Cross-chain asset transfer and data exchange interfaces')}
              </p>
              <Link href="/docs/cross-chain-api" className="text-quantum-primary hover:text-quantum-accent transition-colors">
                {t('developer_docs.view_docs', 'View Docs')} →
              </Link>
            </div>

            <div className="quantum-card p-6">
              <div className="w-16 h-16 mb-4 bg-quantum-gradient-accent rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-quantum-light mb-3">{t('developer_docs.api.ai.title', 'AI API')}</h3>
              <p className="text-quantum-secondary mb-4">
                {t('developer_docs.api.ai.desc', 'Interfaces for interacting with the AI evolution system')}
              </p>
              <Link href="/docs/ai-api" className="text-quantum-primary hover:text-quantum-accent transition-colors">
                {t('developer_docs.view_docs', 'View Docs')} →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Code Examples */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-quantum-light mb-6">{t('developer_docs.examples.title', 'Code Examples')}</h2>
            <p className="text-xl text-quantum-secondary max-w-3xl mx-auto">
              {t('developer_docs.examples.subtitle', 'Practical code examples to help you get started quickly')}
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="quantum-card p-6">
              <h3 className="text-xl font-bold text-quantum-light mb-4">{t('developer_docs.examples.create_wallet', 'Create Quantum Wallet')}</h3>
              <div className="bg-quantum-dark-secondary rounded-lg p-4 overflow-x-auto">
                <pre className="text-quantum-accent text-sm">
{`import { QAWallet, QAProvider } from '@quantaureum/sdk';

// Initialize provider
const provider = new QAProvider('https://mainnet.quantaureum.com');

// Create new wallet
const wallet = QAWallet.createRandom();

// Connect to network
await wallet.connect(provider);

// Get balance
const balance = await wallet.getBalance();
console.log('Balance:', balance.toString());`}
                </pre>
              </div>
            </div>

            <div className="quantum-card p-6">
              <h3 className="text-xl font-bold text-quantum-light mb-4">{t('developer_docs.examples.send_transaction', 'Send Quantum-Safe Transaction')}</h3>
              <div className="bg-quantum-dark-secondary rounded-lg p-4 overflow-x-auto">
                <pre className="text-quantum-accent text-sm">
{`// Create transaction
const transaction = {
  to: '0x742d35Cc6634C0532925a3b8D4C0C8b3C2e',
  value: QAUtils.parseQAU('1.0'), // 1 QAU
  gasLimit: 21000
};

// Send transaction with quantum signature
const txResponse = await wallet.sendTransaction(transaction);

// Wait for confirmation
const receipt = await txResponse.wait();
console.log('Transaction hash:', receipt.transactionHash);`}
                </pre>
              </div>
            </div>

            <div className="quantum-card p-6">
              <h3 className="text-xl font-bold text-quantum-light mb-4">{t('developer_docs.examples.deploy_contract', 'Deploy Smart Contract')}</h3>
              <div className="bg-quantum-dark-secondary rounded-lg p-4 overflow-x-auto">
                <pre className="text-quantum-accent text-sm">
{`import { QAContractFactory } from '@quantaureum/sdk';

// Contract bytecode and ABI
const bytecode = '0x608060405234801561001057600080fd5b50...';
const abi = [...];

// Create contract factory
const factory = new QAContractFactory(abi, bytecode, wallet);

// Deploy contract
const contract = await factory.deploy('Hello, Quantum!');
await contract.deployed();

console.log('Contract address:', contract.address);`}
                </pre>
              </div>
            </div>

            <div className="quantum-card p-6">
              <h3 className="text-xl font-bold text-quantum-light mb-4">{t('developer_docs.examples.crosschain_transfer', 'Cross-chain Asset Transfer')}</h3>
              <div className="bg-quantum-dark-secondary rounded-lg p-4 overflow-x-auto">
                <pre className="text-quantum-accent text-sm">
{`import { QACrossBridge } from '@quantaureum/sdk';

// Initialize cross-chain bridge
const bridge = new QACrossBridge(wallet);

// Cross-chain transfer
const transfer = await bridge.transfer({
  fromChain: 'quantaureum',
  toChain: 'ethereum',
  token: 'QAU',
  amount: QAUtils.parseQAU('10.0'),
  recipient: '0x742d35Cc6634C0532925a3b8D4C0C8b3C2e'
});

console.log('Cross-chain transaction ID:', transfer.id);`}
                </pre>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tutorials */}
      <section className="py-16 bg-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-quantum-light mb-6">{t('developer_docs.tutorials.title', 'Tutorial Guides')}</h2>
            <p className="text-xl text-quantum-secondary max-w-3xl mx-auto">
              {t('developer_docs.tutorials.subtitle', 'Complete tutorial series from beginner to advanced')}
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="quantum-card p-6">
              <div className="w-16 h-16 mb-4 bg-quantum-gradient-primary rounded-full flex items-center justify-center">
                <span className="text-2xl">📚</span>
              </div>
              <h3 className="text-xl font-bold text-quantum-light mb-3">{t('developer_docs.tutorials.basics.title', 'Basic Tutorial')}</h3>
              <p className="text-quantum-secondary mb-4">
                {t('developer_docs.tutorials.basics.desc', 'Learn basic concepts of Quantaureum and development environment setup')}
              </p>
              <Link href="/tutorials/basics" className="text-quantum-primary hover:text-quantum-accent transition-colors">
                {t('developer_docs.tutorials.start_learning', 'Start Learning')} →
              </Link>
            </div>

            <div className="quantum-card p-6">
              <div className="w-16 h-16 mb-4 bg-quantum-gradient-secondary rounded-full flex items-center justify-center">
                <span className="text-2xl">🔧</span>
              </div>
              <h3 className="text-xl font-bold text-quantum-light mb-3">{t('developer_docs.tutorials.smart_contracts.title', 'Smart Contract Development')}</h3>
              <p className="text-quantum-secondary mb-4">
                {t('developer_docs.tutorials.smart_contracts.desc', 'Deep dive into quantum-safe smart contract development and deployment')}
              </p>
              <Link href="/tutorials/smart-contracts" className="text-quantum-primary hover:text-quantum-accent transition-colors">
                {t('developer_docs.tutorials.start_learning', 'Start Learning')} →
              </Link>
            </div>

            <div className="quantum-card p-6">
              <div className="w-16 h-16 mb-4 bg-quantum-gradient-accent rounded-full flex items-center justify-center">
                <span className="text-2xl">🌐</span>
              </div>
              <h3 className="text-xl font-bold text-quantum-light mb-3">{t('developer_docs.tutorials.dapp.title', 'DApp Development')}</h3>
              <p className="text-quantum-secondary mb-4">
                {t('developer_docs.tutorials.dapp.desc', 'Build complete decentralized applications')}
              </p>
              <Link href="/tutorials/dapp-development" className="text-quantum-primary hover:text-quantum-accent transition-colors">
                {t('developer_docs.tutorials.start_learning', 'Start Learning')} →
              </Link>
            </div>

            <div className="quantum-card p-6">
              <div className="w-16 h-16 mb-4 bg-quantum-gradient-primary rounded-full flex items-center justify-center">
                <span className="text-2xl">🔗</span>
              </div>
              <h3 className="text-xl font-bold text-quantum-light mb-3">{t('developer_docs.tutorials.crosschain.title', 'Cross-chain Development')}</h3>
              <p className="text-quantum-secondary mb-4">
                {t('developer_docs.tutorials.crosschain.desc', 'Implement cross-chain interoperability and asset transfer features')}
              </p>
              <Link href="/tutorials/cross-chain" className="text-quantum-primary hover:text-quantum-accent transition-colors">
                {t('developer_docs.tutorials.start_learning', 'Start Learning')} →
              </Link>
            </div>

            <div className="quantum-card p-6">
              <div className="w-16 h-16 mb-4 bg-quantum-gradient-secondary rounded-full flex items-center justify-center">
                <span className="text-2xl">🔐</span>
              </div>
              <h3 className="text-xl font-bold text-quantum-light mb-3">{t('developer_docs.tutorials.security.title', 'Security Best Practices')}</h3>
              <p className="text-quantum-secondary mb-4">
                {t('developer_docs.tutorials.security.desc', 'Learn quantum-safe development best practices and security patterns')}
              </p>
              <Link href="/tutorials/security" className="text-quantum-primary hover:text-quantum-accent transition-colors">
                {t('developer_docs.tutorials.start_learning', 'Start Learning')} →
              </Link>
            </div>

            <div className="quantum-card p-6">
              <div className="w-16 h-16 mb-4 bg-quantum-gradient-accent rounded-full flex items-center justify-center">
                <span className="text-2xl">🚀</span>
              </div>
              <h3 className="text-xl font-bold text-quantum-light mb-3">{t('developer_docs.tutorials.optimization.title', 'Performance Optimization')}</h3>
              <p className="text-quantum-secondary mb-4">
                {t('developer_docs.tutorials.optimization.desc', 'Advanced techniques for optimizing application performance and user experience')}
              </p>
              <Link href="/tutorials/optimization" className="text-quantum-primary hover:text-quantum-accent transition-colors">
                {t('developer_docs.tutorials.start_learning', 'Start Learning')} →
              </Link>
            </div>
          </div>
        </div>
      </section>

      <EnhancedFooter />
      </div>
    </div>
  );
}
