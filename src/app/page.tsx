'use client';

import ParticlesBackground from './components/ParticlesBackground';
import EnhancedNavbar from './components/EnhancedNavbar';
import EnhancedFooter from './components/EnhancedFooter';
import ResponsiveHeroSection from './components/ResponsiveHeroSection';
import GoldReserveSection from './components/GoldReserveSection';
import EcosystemSection from './components/EcosystemSection';
import ProductFeaturesSection from './components/ProductFeaturesSection';
import TechnicalSpecsSection from './components/TechnicalSpecsSection';
import InteractiveDemoSection from './components/InteractiveDemoSection';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useEffect } from 'react';
import '../i18n';

export default function Home() {
  const { t, i18n } = useTranslation();

  useEffect(() => {
    const currentLang = i18n.language || 'zh';
    const rtlLanguages = ['ar'];
    const isRTL = rtlLanguages.includes(currentLang);

    document.documentElement.lang = currentLang;
    document.documentElement.dir = isRTL ? 'rtl' : 'ltr';

    if (isRTL) {
      document.documentElement.classList.add('rtl-language');
    } else {
      document.documentElement.classList.remove('rtl-language');
    }
  }, [i18n.language]);
  
  return (
    <div className="relative min-h-screen overflow-hidden text-white font-sans leading-relaxed">
      <ParticlesBackground />
      
      <div className="relative z-10">
        <EnhancedNavbar />
        
        <ResponsiveHeroSection />

        <GoldReserveSection />

        <section className="py-24 px-5 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="section-title text-4xl font-bold mb-5 bg-gradient-to-r from-[#6E3CBC] to-[#00D4FF] bg-clip-text text-transparent">
              {t('concept.title')}
            </h2>
            <p className="section-subtitle text-lg text-gray-300 mb-16 max-w-3xl mx-auto">
              {t('concept.description')}
            </p>
          </motion.div>
          
          <div className="concept-diagram max-w-4xl mx-auto relative h-[500px]">
            <motion.div
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="central-concept absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-gradient-to-br from-[#6E3CBC] to-[#00D4FF] rounded-full flex items-center justify-center text-5xl shadow-xl shadow-cyan-500/50"
            >
              ⚛️
            </motion.div>
            
            {[
              { icon: '🔐', label: t('concept.items.crypto'), position: { top: '0%', left: '50%', transform: 'translateX(-50%)' } },
              { icon: '💳', label: t('concept.items.hardware'), position: { top: '25%', right: '0%' } },
              { icon: '📱', label: t('concept.items.mobile'), position: { bottom: '25%', right: '0%' } },
              { icon: '🌐', label: t('concept.items.crosschain'), position: { bottom: '0%', left: '50%', transform: 'translateX(-50%)' } },
              { icon: '⚡', label: t('concept.items.performance'), position: { bottom: '25%', left: '0%' } },
              { icon: '📜', label: t('concept.items.contracts'), position: { top: '25%', left: '0%' } }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0 }}
                whileInView={{ opacity: 1, scale: 1 }}
                whileHover={{ scale: 1.1 }}
                transition={{ duration: 0.6, delay: 0.4 + index * 0.1 }}
                className="concept-item absolute w-32 h-32 bg-white/10 backdrop-blur-md rounded-full border border-white/20 flex flex-col items-center justify-center text-center transition-all duration-300 hover:bg-cyan-500/20 cursor-pointer"
                style={item.position}
              >
                <span className="icon text-3xl mb-1">{item.icon}</span>
                <span className="label text-sm font-semibold">{item.label}</span>
              </motion.div>
            ))}
          </div>
        </section>

        <section className="py-24 px-5 bg-white/5">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="section-title text-4xl font-bold mb-5 bg-gradient-to-r from-[#6E3CBC] to-[#00D4FF] bg-clip-text text-transparent text-center">
              {t('benefits.title')}
            </h2>
            <p className="section-subtitle text-lg text-gray-300 mb-16 max-w-3xl mx-auto text-center">
              {t('benefits.description')}
            </p>
          </motion.div>
          
          <div className="benefits-grid max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { icon: '🛡️', title: t('benefits.items.security.title'), desc: t('benefits.items.security.desc') },
              { icon: '🚀', title: t('benefits.items.performance.title'), desc: t('benefits.items.performance.desc') },
              { icon: '💡', title: t('benefits.items.evolution.title'), desc: t('benefits.items.evolution.desc') },
              { icon: '🌍', title: t('benefits.items.global.title'), desc: t('benefits.items.global.desc') },
              { icon: '💰', title: t('benefits.items.economic.title'), desc: t('benefits.items.economic.desc') },
              { icon: '🤝', title: t('benefits.items.developer.title'), desc: t('benefits.items.developer.desc') }
            ].map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                whileHover={{ y: -10, scale: 1.02 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="benefit-card bg-white/10 backdrop-blur-md rounded-xl border border-white/20 p-8 text-center transition-all duration-300 hover:shadow-2xl hover:shadow-cyan-500/30 hover:border-cyan-500/50"
              >
                <div className="benefit-icon w-16 h-16 bg-gradient-to-r from-[#6E3CBC] to-[#00D4FF] rounded-full flex items-center justify-center mx-auto mb-5 text-2xl">
                  {benefit.icon}
                </div>
                <h3 className="text-xl font-semibold mb-4 text-white">{benefit.title}</h3>
                <p className="text-gray-300 leading-relaxed">{benefit.desc}</p>
              </motion.div>
            ))}
          </div>
        </section>

        <div id="features">
          <ProductFeaturesSection />
        </div>

        <section className="py-24 px-5">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="section-title text-4xl font-bold mb-5 bg-gradient-to-r from-[#6E3CBC] to-[#00D4FF] bg-clip-text text-transparent text-center">
              {t('roadmap.title')}
            </h2>
            <p className="section-subtitle text-lg text-gray-300 mb-16 max-w-3xl mx-auto text-center">
              {t('roadmap.description')}
            </p>
          </motion.div>
          
          <div className="roadmap-timeline max-w-6xl mx-auto relative">
            <div className="timeline-line absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-[#6E3CBC] via-[#00D4FF] to-[#FF2A6D] transform -translate-y-1/2"></div>
            <div className="timeline-items flex justify-between relative">
              {[
                { date: '2023 Q4', title: t('roadmap.milestones.q4_2023.title'), desc: t('roadmap.milestones.q4_2023.desc') },
                { date: '2024 Q2', title: t('roadmap.milestones.q2_2024.title'), desc: t('roadmap.milestones.q2_2024.desc') },
                { date: '2024 Q4', title: t('roadmap.milestones.q4_2024.title'), desc: t('roadmap.milestones.q4_2024.desc') },
                { date: '2025 Q2', title: t('roadmap.milestones.q2_2025.title'), desc: t('roadmap.milestones.q2_2025.desc') }
              ].map((milestone, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.2 }}
                  className="timeline-item text-center flex-1 relative"
                >
                  <div className="timeline-dot w-5 h-5 bg-[#00D4FF] rounded-full mx-auto mb-5 relative z-10 shadow-lg shadow-cyan-500/50"></div>
                  <div className="timeline-content bg-white/10 backdrop-blur-md rounded-lg border border-white/20 p-5 mt-5 hover:bg-white/15 transition-all duration-300">
                    <div className="timeline-date text-sm text-[#00D4FF] font-semibold mb-2">{milestone.date}</div>
                    <h3 className="timeline-title text-lg font-semibold mb-2">{milestone.title}</h3>
                    <p className="timeline-desc text-gray-300 text-sm">{milestone.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <div id="specs">
          <TechnicalSpecsSection />
        </div>

        <div id="demo">
          <InteractiveDemoSection />
        </div>

        <div id="ecosystem">
          <EcosystemSection />
        </div>

        <section id="team" className="py-24 px-5 bg-white/5">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="section-title text-4xl font-bold mb-5 bg-gradient-to-r from-[#6E3CBC] to-[#00D4FF] bg-clip-text text-transparent text-center">
              {t('team.title')}
            </h2>
            <p className="section-subtitle text-lg text-gray-300 mb-16 max-w-3xl mx-auto text-center">
              {t('team.description')}
            </p>
          </motion.div>
          
          <div className="team-grid max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { name: t('team.members.ceo.name'), role: t('team.members.ceo.role'), avatar: '👨‍💼' },
              { name: t('team.members.cto.name'), role: t('team.members.cto.role'), avatar: '👩‍💻' },
              { name: t('team.members.scientist.name'), role: t('team.members.scientist.role'), avatar: '👨‍🔬' }
            ].map((member, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                whileHover={{ y: -10, scale: 1.02 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="team-member-card bg-white/10 backdrop-blur-md rounded-xl border border-white/20 p-8 text-center transition-all duration-300 hover:shadow-2xl hover:shadow-purple-500/30 hover:border-purple-500/50"
              >
                <div className="member-photo w-32 h-32 rounded-full mx-auto mb-5 overflow-hidden border-4 border-[#6E3CBC] bg-gradient-to-br from-[#6E3CBC] to-[#00D4FF] flex items-center justify-center text-6xl">
                  {member.avatar}
                </div>
                <h3 className="text-xl font-semibold mb-2 text-white">{member.name}</h3>
                <p className="text-gray-300">{member.role}</p>
              </motion.div>
            ))}
          </div>
        </section>

        <EnhancedFooter />
      </div>
    </div>
  );
}
