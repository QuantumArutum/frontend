'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Lock, Coins, ArrowRight, CheckCircle, TrendingUp, TrendingDown } from 'lucide-react';
import { useTranslation, Trans } from 'react-i18next';
import '../../i18n';

const GoldReserveSection = () => {
  const { t } = useTranslation();
  
  // Real-time data state
  const [goldPrice, setGoldPrice] = useState(0);
  const [reserveAmount, setReserveAmount] = useState(1250000);
  const [priceTrend, setPriceTrend] = useState<'up' | 'down'>('up');
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  // Fetch real gold price
  const fetchGoldPrice = async () => {
    try {
      const res = await fetch('/api/gold-price');
      const data = await res.json();
      
      if (data.price_gram) {
        setGoldPrice(prev => {
          if (prev > 0) {
            setPriceTrend(data.price_gram >= prev ? 'up' : 'down');
          }
          return Number(data.price_gram);
        });
        
        // Update reserve amount (if on-chain data available)
        if (data.totalReserve) {
          setReserveAmount(Number(data.totalReserve));
        }

        setLastUpdate(new Date(data.timestamp));
      }
    } catch (error) {
      console.error('Failed to fetch gold price', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Initial load and periodic update
  useEffect(() => {
    setMounted(true);
    fetchGoldPrice();

    // Update real price and on-chain data every 60 seconds
    const priceInterval = setInterval(fetchGoldPrice, 60000);

    return () => {
      clearInterval(priceInterval);
    };
  }, []);

  const steps = [
    {
      icon: <Coins className="w-8 h-8 text-yellow-400" />,
      title: t('gold.steps.buy.title'),
      description: t('gold.steps.buy.desc')
    },
    {
      icon: <Lock className="w-8 h-8 text-blue-400" />,
      title: t('gold.steps.acquisition.title'),
      description: t('gold.steps.acquisition.desc')
    },
    {
      icon: <Shield className="w-8 h-8 text-purple-400" />,
      title: t('gold.steps.audit.title'),
      description: t('gold.steps.audit.desc')
    },
    {
      icon: <CheckCircle className="w-8 h-8 text-green-400" />,
      title: t('gold.steps.redemption.title'),
      description: t('gold.steps.redemption.desc')
    }
  ];

  return (
    <section className="py-24 relative overflow-hidden" id="gold-reserve">
      {/* 使用与主网站一致的背景风格 */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-blue-900/20 to-cyan-900/20 z-0"></div>
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl"></div>
      {/* 金色点缀 */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-yellow-500/5 rounded-full blur-3xl z-0"></div>

      <div className="quantum-container relative z-10">
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-bold mb-6"
          >
            <span className="bg-gradient-to-r from-yellow-300 via-yellow-500 to-yellow-200 bg-clip-text text-transparent">
              {t('gold.title')}
            </span> {t('gold.subtitle')}
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-gray-400 max-w-2xl mx-auto"
          >
            {t('gold.description')}
            <br />
            <span className="text-yellow-400 font-bold">{t('gold.rate')}</span>
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-4 inline-block px-4 py-2 bg-white/5 rounded-full border border-white/10"
          >
            <span className="text-sm text-gray-400">
              <Trans i18nKey="gold.fee_info" components={[<span className="text-yellow-400" key="0" />]} />
            </span>
          </motion.div>
        </div>

        {/* Process Flow */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
          {/* Connector Line (Desktop) */}
          <div className="hidden md:block absolute top-12 left-0 w-full h-0.5 bg-gradient-to-r from-yellow-500/20 via-yellow-500/50 to-yellow-500/20 z-0"></div>

          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.15 }}
              className="relative z-10"
            >
              <div className="bg-white/5 backdrop-blur-md border border-white/10 p-6 rounded-2xl hover:border-yellow-500/30 transition-all duration-300 group">
                <div className="w-16 h-16 bg-white/5 rounded-xl flex items-center justify-center mb-6 mx-auto group-hover:scale-110 transition-transform duration-300 border border-white/10">
                  {step.icon}
                </div>
                <h3 className="text-xl font-bold text-white mb-3 text-center">{step.title}</h3>
                <p className="text-sm text-gray-400 text-center leading-relaxed">
                  {step.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Live Reserve Stats */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-20 bg-white/5 backdrop-blur-md rounded-3xl border border-white/10"
        >
          <div className="rounded-3xl p-8 md:p-12">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
              <div>
                <div className="text-gray-400 mb-2 uppercase tracking-wider text-sm">{t('gold.stats.reserve.label')}</div>
                <div className="text-4xl font-bold text-yellow-400 tabular-nums">
                  {reserveAmount.toLocaleString()} <span className="text-2xl">g</span>
                </div>
                <div className="text-xs text-gray-500 mt-2 flex items-center justify-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                  {t('gold.stats.reserve.sub')}
                </div>
              </div>
              <div className="md:border-x md:border-white/10">
                <div className="text-gray-400 mb-2 uppercase tracking-wider text-sm">{t('gold.stats.supply.label')}</div>
                <div className="text-4xl font-bold text-white tabular-nums">
                  {reserveAmount.toLocaleString()} <span className="text-2xl">QAU</span>
                </div>
                <div className="text-xs text-gray-500 mt-2">{t('gold.stats.supply.sub')}</div>
              </div>
              <div>
                <div className="text-gray-400 mb-2 uppercase tracking-wider text-sm">{t('gold.stats.price.label')}</div>
                <div className={`text-4xl font-bold tabular-nums flex items-center justify-center gap-2 ${
                  priceTrend === 'up' ? 'text-green-400' : 'text-red-400'
                }`}>
                  {isLoading ? (
                    <span className="text-gray-500 animate-pulse">Loading...</span>
                  ) : (
                    <>
                      ${goldPrice.toFixed(2)} 
                      <span className="text-2xl text-gray-400">/ g</span>
                      {priceTrend === 'up' ? (
                        <TrendingUp className="w-6 h-6 text-green-400" />
                      ) : (
                        <TrendingDown className="w-6 h-6 text-red-400" />
                      )}
                    </>
                  )}
                </div>
                <div className="text-xs text-gray-500 mt-2 flex items-center justify-center gap-2">
                  {t('gold.stats.price.sub')}
                  <span className="text-gray-600">
                    {mounted && lastUpdate && `Updated: ${lastUpdate.toLocaleTimeString()}`}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="mt-12 text-center">
               <button className="px-8 py-3 bg-yellow-500 hover:bg-yellow-400 text-black font-bold rounded-full transition-all flex items-center gap-2 mx-auto">
                 {t('gold.cta.audit')} <ArrowRight className="w-4 h-4" />
               </button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default GoldReserveSection;
