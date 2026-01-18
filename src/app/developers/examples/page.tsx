'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  FaCode,
  FaCopy,
  FaCheck,
  FaGithub,
  FaPlay,
  FaBook,
  FaRocket,
  FaWallet,
  FaExchangeAlt,
  FaFileContract,
  FaCoins,
} from 'react-icons/fa';
import { useTranslation } from 'react-i18next';
import '../../../i18n';
import EnhancedNavbar from '@/app/components/EnhancedNavbar';
import EnhancedFooter from '@/app/components/EnhancedFooter';
import ParticlesBackground from '@/app/components/ParticlesBackground';

export default function DevelopersExamplesPage() {
  const { t } = useTranslation();
  const [selectedCategory, setSelectedCategory] = useState(t('dev_examples.categories.all'));
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const categories = [
    t('dev_examples.categories.all'),
    t('dev_examples.categories.wallet'),
    t('dev_examples.categories.transaction'),
    t('dev_examples.categories.smart_contract'),
    t('dev_examples.categories.defi'),
    t('dev_examples.categories.quantum_security'),
  ];

  const codeExamples = [
    {
      id: 'connect-wallet',
      category: t('dev_examples.categories.wallet'),
      icon: FaWallet,
      title: t('dev_examples.examples.connect_wallet.title'),
      description: t('dev_examples.examples.connect_wallet.description'),
      language: 'javascript',
      code: `import { QuantaureumSDK } from '@quantaureum/sdk';

// Initialize SDK
const sdk = new QuantaureumSDK({
  network: 'mainnet',
  rpcUrl: 'https://rpc.quantaureum.com'
});

// Connect wallet
async function connectWallet() {
  try {
    const wallet = await sdk.wallet.connect();
    console.log('Wallet address:', wallet.address);
    console.log('Balance:', await wallet.getBalance());
    return wallet;
  } catch (error) {
    console.error('Connection failed:', error);
  }
}

// Call connect
connectWallet();`,
    },
    {
      id: 'send-transaction',
      category: t('dev_examples.categories.transaction'),
      icon: FaExchangeAlt,
      title: t('dev_examples.examples.send_transaction.title'),
      description: t('dev_examples.examples.send_transaction.description'),
      language: 'javascript',
      code: `import { QuantaureumSDK, parseQAU } from '@quantaureum/sdk';

const sdk = new QuantaureumSDK({ network: 'mainnet' });

async function sendTransaction(to, amount) {
  const wallet = await sdk.wallet.connect();
  
  // Build transaction
  const tx = await wallet.sendTransaction({
    to: to,
    value: parseQAU(amount), // Convert to smallest unit
    gasLimit: 21000
  });
  
  console.log('Transaction hash:', tx.hash);
  
  // Wait for confirmation
  const receipt = await tx.wait();
  console.log('Transaction confirmed, block:', receipt.blockNumber);
  
  return receipt;
}

// Send 10 QAU
sendTransaction('0x742d35Cc6634C0532925a3b844Bc9e7595f...', '10');`,
    },
    {
      id: 'deploy-contract',
      category: t('dev_examples.categories.smart_contract'),
      icon: FaFileContract,
      title: t('dev_examples.examples.deploy_contract.title'),
      description: t('dev_examples.examples.deploy_contract.description'),
      language: 'solidity',
      code: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@quantaureum/contracts/token/QRC20.sol";
import "@quantaureum/contracts/security/QuantumSafe.sol";

contract MyToken is QRC20, QuantumSafe {
    constructor(
        string memory name,
        string memory symbol,
        uint256 initialSupply
    ) QRC20(name, symbol) {
        _mint(msg.sender, initialSupply * 10**decimals());
    }
    
    // Quantum-safe transfer function
    function transfer(address to, uint256 amount) 
        public 
        override 
        quantumVerified 
        returns (bool) 
    {
        return super.transfer(to, amount);
    }
    
    // Mint new tokens (admin only)
    function mint(address to, uint256 amount) public onlyOwner {
        _mint(to, amount);
    }
}`,
    },
    {
      id: 'staking',
      category: t('dev_examples.categories.defi'),
      icon: FaCoins,
      title: t('dev_examples.examples.staking.title'),
      description: t('dev_examples.examples.staking.description'),
      language: 'javascript',
      code: `import { QuantaureumSDK, parseQAU } from '@quantaureum/sdk';

const sdk = new QuantaureumSDK({ network: 'mainnet' });

async function stakeQAU(validatorAddress, amount) {
  const wallet = await sdk.wallet.connect();
  const staking = sdk.staking;
  
  // Check validator info
  const validator = await staking.getValidator(validatorAddress);
  console.log('Validator:', validator.name);
  console.log('Current APY:', validator.apy + '%');
  
  // Execute staking
  const tx = await staking.stake({
    validator: validatorAddress,
    amount: parseQAU(amount)
  });
  
  console.log('Staking transaction:', tx.hash);
  await tx.wait();
  
  // Query staking info
  const myStakes = await staking.getStakes(wallet.address);
  console.log('My stakes:', myStakes);
  
  return myStakes;
}

// Stake 1000 QAU
stakeQAU('0xValidatorAddress...', '1000');`,
    },
    {
      id: 'quantum-signature',
      category: t('dev_examples.categories.quantum_security'),
      icon: FaRocket,
      title: t('dev_examples.examples.quantum_signature.title'),
      description: t('dev_examples.examples.quantum_signature.description'),
      language: 'javascript',
      code: `import { QuantaureumSDK, QuantumCrypto } from '@quantaureum/sdk';

const sdk = new QuantaureumSDK({ network: 'mainnet' });

async function quantumSign() {
  const wallet = await sdk.wallet.connect();
  
  // Sign using CRYSTALS-Dilithium
  const message = 'Hello, Quantum World!';
  
  const signature = await wallet.signMessage(message, {
    algorithm: 'dilithium3' // NIST Level 3
  });
  
  console.log('Message:', message);
  console.log('Signature:', signature);
  
  // Verify signature
  const isValid = await QuantumCrypto.verify(
    message,
    signature,
    wallet.publicKey
  );
  
  console.log('Signature valid:', isValid);
  
  // Get signature details
  const signatureInfo = QuantumCrypto.parseSignature(signature);
  console.log('Algorithm:', signatureInfo.algorithm);
  console.log('Security level:', signatureInfo.securityLevel);
  
  return { signature, isValid };
}

quantumSign();`,
    },
  ];

  const filteredExamples =
    selectedCategory === t('dev_examples.categories.all')
      ? codeExamples
      : codeExamples.filter((ex) => ex.category === selectedCategory);

  const copyCode = (id: string, code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="min-h-screen relative">
      <ParticlesBackground />
      <EnhancedNavbar />
      <div className="relative z-10">
        {/* Hero Section */}
        <section className="pt-24 pb-16 px-4">
          <div className="max-w-7xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <span className="inline-block px-4 py-2 bg-cyan-500/20 text-cyan-300 rounded-full text-sm mb-6">
                {t('dev_examples.badge')}
              </span>
              <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
                {t('dev_examples.title')}
                <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                  {' '}
                  {t('dev_examples.title_highlight')}{' '}
                </span>
              </h1>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
                {t('dev_examples.subtitle')}
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link href="/developers/docs">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-6 py-3 bg-white/10 text-white rounded-xl font-semibold border border-white/20 flex items-center gap-2"
                  >
                    <FaBook /> {t('dev_examples.full_docs')}
                  </motion.button>
                </Link>
                <a href="https://github.com/quantaureum" target="_blank" rel="noopener noreferrer">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-6 py-3 bg-white/10 text-white rounded-xl font-semibold border border-white/20 flex items-center gap-2"
                  >
                    <FaGithub /> GitHub
                  </motion.button>
                </a>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Category Filter */}
        <section className="py-8 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-wrap justify-center gap-3">
              {categories.map((category) => (
                <motion.button
                  key={category}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    selectedCategory === category
                      ? 'bg-gradient-to-r from-cyan-600 to-purple-600 text-white'
                      : 'bg-white/10 text-gray-300 hover:bg-white/20'
                  }`}
                >
                  {category}
                </motion.button>
              ))}
            </div>
          </div>
        </section>

        {/* Code Examples */}
        <section className="py-8 px-4 pb-24">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {filteredExamples.map((example, index) => {
                const IconComponent = example.icon;
                return (
                  <motion.div
                    key={example.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 overflow-hidden"
                  >
                    {/* Header */}
                    <div className="p-6 border-b border-white/10">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-cyan-600/30 to-purple-600/30 flex items-center justify-center">
                            <IconComponent className="text-xl text-cyan-400" />
                          </div>
                          <div>
                            <h3 className="text-lg font-bold text-white">{example.title}</h3>
                            <p className="text-gray-400 text-sm">{example.description}</p>
                          </div>
                        </div>
                        <span className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-xs">
                          {example.category}
                        </span>
                      </div>
                    </div>

                    {/* Code Block */}
                    <div className="relative">
                      <div className="absolute top-3 right-3 flex gap-2">
                        <span className="px-2 py-1 bg-gray-800 text-gray-400 rounded text-xs">
                          {example.language}
                        </span>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => copyCode(example.id, example.code)}
                          className="p-2 bg-gray-800 hover:bg-gray-700 rounded text-gray-400 hover:text-white transition-colors"
                        >
                          {copiedId === example.id ? (
                            <FaCheck className="text-green-400" />
                          ) : (
                            <FaCopy />
                          )}
                        </motion.button>
                      </div>
                      <pre className="p-6 pt-12 overflow-x-auto text-sm">
                        <code className="text-gray-300 font-mono whitespace-pre">
                          {example.code}
                        </code>
                      </pre>
                    </div>

                    {/* Footer */}
                    <div className="p-4 border-t border-white/10 flex justify-between items-center">
                      <Link href="/developers/docs">
                        <span className="text-cyan-400 hover:text-cyan-300 text-sm flex items-center gap-1">
                          <FaBook /> {t('dev_examples.view_docs')}
                        </span>
                      </Link>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        className="px-4 py-2 bg-gradient-to-r from-cyan-600 to-purple-600 text-white rounded-lg text-sm font-medium flex items-center gap-2"
                      >
                        <FaPlay /> {t('dev_examples.run_online')}
                      </motion.button>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 px-4 bg-black/30">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-r from-cyan-600/20 to-purple-600/20 rounded-3xl border border-cyan-500/30 p-12"
            >
              <FaRocket className="text-5xl text-cyan-400 mx-auto mb-6" />
              <h2 className="text-3xl font-bold text-white mb-4">{t('dev_examples.cta.title')}</h2>
              <p className="text-gray-300 mb-8">{t('dev_examples.cta.description')}</p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link href="/developers/docs">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    className="px-8 py-4 bg-gradient-to-r from-cyan-600 to-purple-600 text-white rounded-xl font-semibold"
                  >
                    {t('dev_examples.cta.view_docs')}
                  </motion.button>
                </Link>
                <Link href="/developers/sdk">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    className="px-8 py-4 bg-white/10 text-white rounded-xl font-semibold border border-white/20"
                  >
                    {t('dev_examples.cta.download_sdk')}
                  </motion.button>
                </Link>
              </div>
            </motion.div>
          </div>
        </section>
      </div>
      <EnhancedFooter />
    </div>
  );
}
