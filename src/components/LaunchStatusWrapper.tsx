'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useLaunchStatus } from '../hooks/useSiteConfig';

interface LaunchStatusWrapperProps {
  children: React.ReactNode;
}

interface CountdownTime {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

// Countdown display component
const CountdownDisplay: React.FC<{ time: CountdownTime }> = ({ time }) => {
  const timeUnits = [
    { value: time.days, label: 'Days' },
    { value: time.hours, label: 'Hours' },
    { value: time.minutes, label: 'Minutes' },
    { value: time.seconds, label: 'Seconds' },
  ];

  return (
    <div className="flex gap-4 justify-center">
      {timeUnits.map((unit, index) => (
        <motion.div
          key={unit.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="flex flex-col items-center"
        >
          <div className="w-20 h-20 md:w-24 md:h-24 bg-white/10 backdrop-blur-md rounded-xl border border-white/20 flex items-center justify-center">
            <span className="text-3xl md:text-4xl font-bold text-white">
              {String(unit.value).padStart(2, '0')}
            </span>
          </div>
          <span className="text-sm text-gray-400 mt-2">{unit.label}</span>
        </motion.div>
      ))}
    </div>
  );
};

// Pre-launch page component (Requirements 15.5, 15.7)
const PreLaunchPage: React.FC<{
  message?: string;
  launchDate?: string;
}> = ({ message, launchDate }) => {
  const [countdown, setCountdown] = useState<CountdownTime>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [email, setEmail] = useState('');
  const [subscribeStatus, setSubscribeStatus] = useState<'idle' | 'loading' | 'success' | 'error'>(
    'idle'
  );
  const [subscribeMessage, setSubscribeMessage] = useState('');

  const handleSubscribe = async () => {
    if (!email.trim()) {
      setSubscribeStatus('error');
      setSubscribeMessage('Please enter your email');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setSubscribeStatus('error');
      setSubscribeMessage('Please enter a valid email');
      return;
    }

    setSubscribeStatus('loading');
    setSubscribeMessage('');

    try {
      const response = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), source: 'pre-launch' }),
      });

      const data = await response.json();

      if (data.success) {
        setSubscribeStatus('success');
        setSubscribeMessage("Successfully subscribed! We'll notify you when we launch.");
        setEmail('');
        setTimeout(() => {
          setSubscribeStatus('idle');
          setSubscribeMessage('');
        }, 5000);
      } else {
        setSubscribeStatus('error');
        setSubscribeMessage(data.error || 'Subscription failed');
      }
    } catch {
      setSubscribeStatus('error');
      setSubscribeMessage('Subscription failed');
    }
  };

  useEffect(() => {
    if (!launchDate) return;

    const calculateCountdown = () => {
      const now = new Date().getTime();
      const launch = new Date(launchDate).getTime();
      const diff = launch - now;

      if (diff <= 0) {
        setCountdown({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      setCountdown({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((diff % (1000 * 60)) / 1000),
      });
    };

    calculateCountdown();
    const interval = setInterval(calculateCountdown, 1000);
    return () => clearInterval(interval);
  }, [launchDate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-black flex items-center justify-center px-4">
      <div className="text-center max-w-2xl">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
        >
          {/* Logo */}
          <div className="mb-8">
            <div className="w-24 h-24 mx-auto bg-gradient-to-br from-[#6E3CBC] to-[#00D4FF] rounded-full flex items-center justify-center shadow-2xl shadow-cyan-500/50">
              <span className="text-4xl">⚛️</span>
            </div>
          </div>

          {/* Title */}
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-[#6E3CBC] to-[#00D4FF] bg-clip-text text-transparent">
            Coming Soon
          </h1>

          {/* Message */}
          <p className="text-lg text-gray-300 mb-12">
            {message || 'We are preparing something amazing. Stay tuned!'}
          </p>

          {/* Countdown */}
          {launchDate && <CountdownDisplay time={countdown} />}

          {/* Subscribe section */}
          <div className="mt-12">
            <p className="text-gray-400 mb-4">Get notified when we launch</p>
            <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSubscribe()}
                placeholder="Enter your email"
                disabled={subscribeStatus === 'loading'}
                className="flex-1 px-4 py-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-cyan-500/50 disabled:opacity-50"
              />
              <motion.button
                whileHover={{ scale: subscribeStatus === 'loading' ? 1 : 1.05 }}
                whileTap={{ scale: subscribeStatus === 'loading' ? 1 : 0.95 }}
                onClick={handleSubscribe}
                disabled={subscribeStatus === 'loading'}
                className="px-6 py-3 bg-gradient-to-r from-[#6E3CBC] to-[#00D4FF] text-white rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {subscribeStatus === 'loading' ? 'Subscribing...' : 'Notify Me'}
              </motion.button>
            </div>
            {subscribeMessage && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`mt-3 text-sm ${subscribeStatus === 'success' ? 'text-green-400' : 'text-red-400'}`}
              >
                {subscribeMessage}
              </motion.p>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

// Maintenance page component (Requirements 15.5)
const MaintenancePage: React.FC<{ message?: string }> = ({ message }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-orange-900 to-black flex items-center justify-center px-4">
      <div className="text-center max-w-2xl">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
        >
          {/* Icon */}
          <div className="mb-8">
            <div className="w-24 h-24 mx-auto bg-gradient-to-br from-orange-500 to-amber-500 rounded-full flex items-center justify-center shadow-2xl shadow-orange-500/50">
              <span className="text-4xl">🔧</span>
            </div>
          </div>

          {/* Title */}
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-orange-400 to-amber-400 bg-clip-text text-transparent">
            Under Maintenance
          </h1>

          {/* Message */}
          <p className="text-lg text-gray-300 mb-8">
            {message ||
              'We are currently performing scheduled maintenance. Please check back soon.'}
          </p>

          {/* Status indicator */}
          <div className="flex items-center justify-center gap-2 text-orange-400">
            <div className="w-3 h-3 bg-orange-400 rounded-full animate-pulse"></div>
            <span>Maintenance in progress</span>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

// Main wrapper component (Requirements 15.5, 15.6, 15.7)
const LaunchStatusWrapper: React.FC<LaunchStatusWrapperProps> = ({ children }) => {
  const { status, loading } = useLaunchStatus();

  // Show loading state briefly
  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // Check maintenance mode first (highest priority)
  if (status?.maintenance_mode) {
    return <MaintenancePage message={status.maintenance_message} />;
  }

  // Check pre-launch mode (Requirements 15.7)
  if (status?.pre_launch_enabled && !status?.is_launched) {
    return <PreLaunchPage message={status.countdown_message} launchDate={status.launch_date} />;
  }

  // Site is live, render children
  return <>{children}</>;
};

export default LaunchStatusWrapper;
