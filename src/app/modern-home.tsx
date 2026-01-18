'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowRight,
  Zap,
  Shield,
  Globe,
  ChevronDown,
  Play,
  Sparkles,
  Rocket,
  Cpu,
  Network,
} from 'lucide-react';
import '../styles/design-system.css';
import GoldReserveSection from './components/GoldReserveSection';

// Modern Navigation Component
const ModernNavbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'quantum-glass py-4' : 'py-6'
      }`}
    >
      <div className="quantum-container">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <motion.div whileHover={{ scale: 1.05 }} className="flex items-center gap-3">
            <div className="w-10 h-10 quantum-bg-primary rounded-xl flex items-center justify-center">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold quantum-text-gradient">Quantaureum</span>
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {['Home', 'Community', 'Technology', 'Developers', 'About'].map((item, index) => (
              <motion.a
                key={item}
                href={`#${item.toLowerCase()}`}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="text-sm font-medium text-gray-300 hover:text-white transition-colors relative group"
              >
                {item}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 quantum-bg-primary transition-all duration-300 group-hover:w-full"></span>
              </motion.a>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="hidden md:flex items-center gap-4">
            <button className="quantum-btn quantum-btn-ghost">Sign In</button>
            <button className="quantum-btn quantum-btn-primary">
              Get Started
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden quantum-btn quantum-btn-ghost p-2"
          >
            <div className="w-6 h-6 flex flex-col justify-center gap-1">
              <span
                className={`w-full h-0.5 bg-white transition-all ${isMobileMenuOpen ? 'rotate-45 translate-y-1.5' : ''}`}
              ></span>
              <span
                className={`w-full h-0.5 bg-white transition-all ${isMobileMenuOpen ? 'opacity-0' : ''}`}
              ></span>
              <span
                className={`w-full h-0.5 bg-white transition-all ${isMobileMenuOpen ? '-rotate-45 -translate-y-1.5' : ''}`}
              ></span>
            </div>
          </button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden mt-6 quantum-glass rounded-xl p-6"
            >
              <div className="flex flex-col gap-4">
                {['Home', 'Community', 'Technology', 'Developers', 'About'].map((item) => (
                  <a
                    key={item}
                    href={`#${item.toLowerCase()}`}
                    className="text-gray-300 hover:text-white transition-colors py-2"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {item}
                  </a>
                ))}
                <div className="flex flex-col gap-3 pt-4 border-t border-white/10">
                  <button className="quantum-btn quantum-btn-ghost w-full">Sign In</button>
                  <button className="quantum-btn quantum-btn-primary w-full">
                    Get Started
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  );
};

// Hero Section Component
const ModernHeroSection = () => {
  const [currentFeature, setCurrentFeature] = useState(0);

  const features = [
    { icon: Shield, text: 'Quantum-Safe Security' },
    { icon: Zap, text: 'Lightning Fast Transactions' },
    { icon: Globe, text: 'Global Decentralized Network' },
    { icon: Cpu, text: 'AI-Powered Consensus' },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFeature((prev) => (prev + 1) % features.length);
    }, 3000);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 quantum-bg-dark opacity-50"></div>
        {[...Array(50)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-purple-400 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              opacity: [0, 1, 0],
              scale: [0, 1, 0],
            }}
            transition={{
              duration: 2 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      <div className="quantum-container relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto"
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-2 quantum-glass rounded-full mb-8"
          >
            <Sparkles className="w-4 h-4 text-purple-400" />
            <span className="text-sm font-medium">Next-Generation Blockchain Technology</span>
          </motion.div>

          {/* Main Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="quantum-heading-1 mb-6"
          >
            The Future of
            <br />
            <span className="relative">
              Quantum Blockchain
              <motion.div
                className="absolute -inset-2 quantum-bg-primary opacity-20 blur-xl rounded-lg"
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto leading-relaxed"
          >
            Experience unprecedented security, speed, and scalability with our quantum-resistant
            blockchain platform. Join the revolution that&apos;s reshaping the future of
            decentralized technology.
          </motion.p>

          {/* Feature Rotation */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="flex items-center justify-center gap-3 mb-10"
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={currentFeature}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="flex items-center gap-2 px-4 py-2 quantum-glass rounded-lg"
              >
                {React.createElement(features[currentFeature].icon, {
                  className: 'w-5 h-5 text-purple-400',
                })}
                <span className="text-sm font-medium">{features[currentFeature].text}</span>
              </motion.div>
            </AnimatePresence>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12"
          >
            <button className="quantum-btn quantum-btn-primary text-lg px-8 py-4">
              <Rocket className="w-5 h-5" />
              Launch App
            </button>
            <button className="quantum-btn quantum-btn-secondary text-lg px-8 py-4">
              <Play className="w-5 h-5" />
              Watch Demo
            </button>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-2xl mx-auto"
          >
            {[
              { value: '100K+', label: 'Active Users' },
              { value: '1M+', label: 'Transactions' },
              { value: '99.9%', label: 'Uptime' },
              { value: '50+', label: 'Countries' },
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.8 + index * 0.1 }}
                className="text-center"
              >
                <div className="text-2xl font-bold quantum-text-gradient mb-1">{stat.value}</div>
                <div className="text-sm text-gray-400">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="flex flex-col items-center gap-2 text-gray-400"
          >
            <span className="text-xs">Scroll to explore</span>
            <ChevronDown className="w-4 h-4" />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

// Features Section Component
const ModernFeaturesSection = () => {
  const features = [
    {
      icon: Shield,
      title: 'Quantum-Safe Security',
      description:
        'Advanced post-quantum cryptography ensures your assets remain secure against future quantum computing threats.',
      color: 'from-purple-500 to-pink-500',
    },
    {
      icon: Zap,
      title: 'Lightning Speed',
      description:
        'Process thousands of transactions per second with our innovative consensus mechanism and optimized architecture.',
      color: 'from-cyan-500 to-blue-500',
    },
    {
      icon: Network,
      title: 'Decentralized Network',
      description:
        'Join a truly decentralized ecosystem with nodes distributed globally for maximum resilience and accessibility.',
      color: 'from-emerald-500 to-teal-500',
    },
    {
      icon: Cpu,
      title: 'AI-Powered Consensus',
      description:
        'Our AI-enhanced consensus algorithm adapts to network conditions for optimal performance and security.',
      color: 'from-amber-500 to-orange-500',
    },
  ];

  return (
    <section className="py-24 quantum-container">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-16"
      >
        <h2 className="quantum-heading-2 mb-4">Built for the Future</h2>
        <p className="text-xl text-gray-300 max-w-2xl mx-auto">
          Discover the revolutionary features that make Quantaureum the most advanced blockchain
          platform ever created.
        </p>
      </motion.div>

      <div className="quantum-grid quantum-grid-2 lg:grid-cols-2 gap-8">
        {features.map((feature, index) => (
          <motion.div
            key={feature.title}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            className="quantum-card quantum-card-interactive group"
          >
            <div
              className={`w-12 h-12 rounded-xl bg-gradient-to-r ${feature.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}
            >
              <feature.icon className="w-6 h-6 text-white" />
            </div>
            <h3 className="quantum-heading-3 mb-4">{feature.title}</h3>
            <p className="text-gray-300 leading-relaxed">{feature.description}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

// Main Component
export default function ModernHome() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900/20 to-gray-900">
      <ModernNavbar />
      <ModernHeroSection />
      <GoldReserveSection />
      <ModernFeaturesSection />
    </div>
  );
}
