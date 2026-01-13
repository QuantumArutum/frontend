'use client';

import React from 'react';
import { useTranslation } from 'react-i18next';
import EnhancedNavbar from '@/app/components/EnhancedNavbar';
import EnhancedFooter from '@/app/components/EnhancedFooter';
import ParticlesBackground from '@/app/components/ParticlesBackground';
import '../../../i18n/index';

export default function APIReference() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen relative">
      <ParticlesBackground />
      <EnhancedNavbar />
      <div className="container mx-auto px-4 py-16 pt-24">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-white mb-4">
              {t('api.title', 'API Reference')}
            </h1>
            <p className="text-xl text-gray-300">
              {t('api.subtitle', 'Quantaureum Blockchain Platform API Reference')}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1">
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 sticky top-8">
                <h3 className="text-xl font-semibold text-white mb-4">
                  {t('api.categories.title', 'API Categories')}
                </h3>
                <nav className="space-y-2">
                  <a href="#wallet" className="block text-cyan-400 hover:text-cyan-300 transition-colors">
                    {t('api.categories.wallet', 'Wallet API')}
                  </a>
                  <a href="#blockchain" className="block text-cyan-400 hover:text-cyan-300 transition-colors">
                    {t('api.categories.blockchain', 'Blockchain API')}
                  </a>
                  <a href="#contracts" className="block text-cyan-400 hover:text-cyan-300 transition-colors">
                    {t('api.categories.contracts', 'Smart Contract API')}
                  </a>
                  <a href="#crosschain" className="block text-cyan-400 hover:text-cyan-300 transition-colors">
                    {t('api.categories.crosschain', 'Cross-chain API')}
                  </a>
                  <a href="#quantum" className="block text-cyan-400 hover:text-cyan-300 transition-colors">
                    {t('api.categories.quantum', 'Quantum Security API')}
                  </a>
                </nav>
              </div>
            </div>

            <div className="lg:col-span-2 space-y-8">
              <section id="wallet" className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
                <h2 className="text-2xl font-semibold text-white mb-6">
                  {t('api.wallet.title', 'Wallet API')}
                </h2>
                
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium text-white mb-3">
                      {t('api.wallet.create.title', 'Create Wallet')}
                    </h3>
                    <div className="bg-black/30 rounded-lg p-4 font-mono text-sm">
                      <div className="text-green-400">POST</div>
                      <div className="text-gray-300">/api/v1/wallet/create</div>
                    </div>
                    <p className="text-gray-300 mt-2">
                      {t('api.wallet.create.description', 'Create a new quantum-safe wallet')}
                    </p>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium text-white mb-3">
                      {t('api.wallet.balance.title', 'Query Balance')}
                    </h3>
                    <div className="bg-black/30 rounded-lg p-4 font-mono text-sm">
                      <div className="text-blue-400">GET</div>
                      <div className="text-gray-300">/api/v1/wallet/{'{address}'}/balance</div>
                    </div>
                    <p className="text-gray-300 mt-2">
                      {t('api.wallet.balance.description', 'Get balance information for a specific address')}
                    </p>
                  </div>
                </div>
              </section>

              <section id="blockchain" className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
                <h2 className="text-2xl font-semibold text-white mb-6">
                  {t('api.blockchain.title', 'Blockchain API')}
                </h2>
                
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium text-white mb-3">
                      {t('api.blockchain.block.title', 'Get Block Info')}
                    </h3>
                    <div className="bg-black/30 rounded-lg p-4 font-mono text-sm">
                      <div className="text-blue-400">GET</div>
                      <div className="text-gray-300">/api/v1/block/{'{blockNumber}'}</div>
                    </div>
                    <p className="text-gray-300 mt-2">
                      {t('api.blockchain.block.description', 'Get detailed information for a specific block')}
                    </p>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium text-white mb-3">
                      {t('api.blockchain.transaction.title', 'Send Transaction')}
                    </h3>
                    <div className="bg-black/30 rounded-lg p-4 font-mono text-sm">
                      <div className="text-green-400">POST</div>
                      <div className="text-gray-300">/api/v1/transaction/send</div>
                    </div>
                    <p className="text-gray-300 mt-2">
                      {t('api.blockchain.transaction.description', 'Broadcast a quantum-signed transaction to the network')}
                    </p>
                  </div>
                </div>
              </section>

              <section id="contracts" className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
                <h2 className="text-2xl font-semibold text-white mb-6">
                  {t('api.contracts.title', 'Smart Contract API')}
                </h2>
                
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium text-white mb-3">
                      {t('api.contracts.deploy.title', 'Deploy Contract')}
                    </h3>
                    <div className="bg-black/30 rounded-lg p-4 font-mono text-sm">
                      <div className="text-green-400">POST</div>
                      <div className="text-gray-300">/api/v1/contract/deploy</div>
                    </div>
                    <p className="text-gray-300 mt-2">
                      {t('api.contracts.deploy.description', 'Deploy a quantum-safe smart contract')}
                    </p>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium text-white mb-3">
                      {t('api.contracts.call.title', 'Call Contract')}
                    </h3>
                    <div className="bg-black/30 rounded-lg p-4 font-mono text-sm">
                      <div className="text-green-400">POST</div>
                      <div className="text-gray-300">/api/v1/contract/{'{address}'}/call</div>
                    </div>
                    <p className="text-gray-300 mt-2">
                      {t('api.contracts.call.description', 'Call a smart contract function')}
                    </p>
                  </div>
                </div>
              </section>

              <section className="bg-gradient-to-r from-purple-600/20 to-cyan-600/20 backdrop-blur-md rounded-2xl p-8 border border-white/20">
                <h2 className="text-2xl font-semibold text-white mb-4">
                  {t('api.gettingStarted.title', 'Getting Started')}
                </h2>
                <p className="text-gray-300 mb-4">
                  {t('api.gettingStarted.description', 'Start using Quantaureum API in a few simple steps:')}
                </p>
                <ol className="list-decimal list-inside text-gray-300 space-y-2">
                  <li>{t('api.gettingStarted.step1', 'Register a developer account to get API key')}</li>
                  <li>{t('api.gettingStarted.step2', 'Install Quantaureum SDK')}</li>
                  <li>{t('api.gettingStarted.step3', 'Check sample code and documentation')}</li>
                  <li>{t('api.gettingStarted.step4', 'Start building your application')}</li>
                </ol>
                
                <div className="mt-6">
                  <a 
                    href="/developers/sdk" 
                    className="inline-block bg-gradient-to-r from-purple-600 to-cyan-600 text-white px-6 py-3 rounded-lg font-medium hover:from-purple-700 hover:to-cyan-700 transition-all duration-200"
                  >
                    {t('api.gettingStarted.downloadSDK', 'Download SDK')}
                  </a>
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
      <EnhancedFooter />
    </div>
  );
}
