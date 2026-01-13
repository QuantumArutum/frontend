import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import '../../i18n';

type DemoKey = 'smart-contract' | 'hardware-wallet' | 'cross-chain' | 'mobile-app';

interface DemoStep {
  title: string;
  code: string;
  status: string;
}

interface Demo {
  title: string;
  icon: string;
  description: string;
  steps: DemoStep[];
}

const InteractiveDemoSection = () => {
  const { t } = useTranslation();
  const [activeDemo, setActiveDemo] = useState<DemoKey>('smart-contract');
  const [demoStep, setDemoStep] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  const demos: Record<DemoKey, Demo> = useMemo(() => ({
    'smart-contract': {
      title: t('demo.demos.smart-contract.title'),
      icon: t('demo.demos.smart-contract.icon'),
      description: t('demo.demos.smart-contract.description'),
      steps: [
        { title: t('demo.steps.write_contract'), code: 'contract QuantumToken {\n  mapping(address => uint256) balances;\n  \n  function transfer(address to, uint256 amount) {\n    require(balances[msg.sender] >= amount);\n    balances[msg.sender] -= amount;\n    balances[to] += amount;\n  }\n}', status: 'ready' },
        { title: t('demo.steps.quantum_compile'), code: t('demo.code.compiling'), status: 'compiling' },
        { title: t('demo.steps.deploy_chain'), code: t('demo.code.deploying'), status: 'deploying' },
        { title: t('demo.steps.execute_call'), code: t('demo.code.executing'), status: 'executing' }
      ]
    },
    'hardware-wallet': {
      title: t('demo.demos.hardware-wallet.title'),
      icon: t('demo.demos.hardware-wallet.icon'),
      description: t('demo.demos.hardware-wallet.description'),
      steps: [
        { title: t('demo.steps.device_detect'), code: t('demo.code.scanning'), status: 'scanning' },
        { title: t('demo.steps.key_generation'), code: t('demo.code.generating'), status: 'generating' },
        { title: t('demo.steps.biometric_auth'), code: t('demo.code.authenticating'), status: 'authenticating' },
        { title: t('demo.steps.quantum_sign'), code: t('demo.code.signing'), status: 'signing' }
      ]
    },
    'cross-chain': {
      title: t('demo.demos.cross-chain.title'),
      icon: t('demo.demos.cross-chain.icon'),
      description: t('demo.demos.cross-chain.description'),
      steps: [
        { title: t('demo.steps.select_source'), code: t('demo.code.selecting'), status: 'selecting' },
        { title: t('demo.steps.create_proof'), code: t('demo.code.proving'), status: 'proving' },
        { title: t('demo.steps.lock_assets'), code: t('demo.code.locking'), status: 'locking' },
        { title: t('demo.steps.release_target'), code: t('demo.code.releasing'), status: 'releasing' }
      ]
    },
    'mobile-app': {
      title: t('demo.demos.mobile-app.title'),
      icon: '📱',
      description: t('demo.demos.mobile-app.description'),
      steps: [
        { title: t('demo.steps.app_launch'), code: t('demo.code.launching'), status: 'launching' },
        { title: t('demo.steps.biometric_login'), code: t('demo.code.biometric'), status: 'biometric' },
        { title: t('demo.steps.view_assets'), code: t('demo.code.loading'), status: 'loading' },
        { title: t('demo.steps.send_transaction'), code: t('demo.code.sending'), status: 'sending' }
      ]
    }
  }), [t]);

  const currentDemoStepsLength = demos[activeDemo].steps.length;

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | undefined;
    if (isRunning) {
      interval = setInterval(() => {
        setDemoStep((prev) => {
          if (prev < currentDemoStepsLength - 1) {
            return prev + 1;
          } else {
            setIsRunning(false);
            return prev;
          }
        });
      }, 2000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, currentDemoStepsLength]);

  const startDemo = () => {
    setDemoStep(0);
    setIsRunning(true);
  };

  const resetDemo = () => {
    setIsRunning(false);
    setDemoStep(0);
  };

  return (
    <section className="py-24 px-5 bg-gradient-to-br from-purple-900/20 to-blue-900/20">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold mb-5 bg-gradient-to-r from-[#6E3CBC] to-[#00D4FF] bg-clip-text text-transparent">
            {t('demo.title')}
          </h2>
          <p className="text-lg text-gray-300 max-w-3xl mx-auto">
            {t('demo.description')}
          </p>
        </motion.div>

        {/* Demo Selection */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          {(Object.entries(demos) as [DemoKey, Demo][]).map(([key, demo]) => (
            <button
              key={key}
              onClick={() => {
                setActiveDemo(key);
                resetDemo();
              }}
              className={`p-6 rounded-xl transition-all duration-300 text-left ${
                activeDemo === key
                  ? 'bg-gradient-to-br from-[#6E3CBC] to-[#00D4FF] text-white shadow-lg scale-105'
                  : 'bg-white/10 text-gray-300 hover:bg-white/20 hover:scale-102'
              }`}
            >
              <div className="text-3xl mb-3">{demo.icon}</div>
              <h3 className="font-semibold text-lg mb-2">{demo.title}</h3>
              <p className="text-sm opacity-80">{demo.description}</p>
            </button>
          ))}
        </div>

        {/* Demo Interface */}
        <div className="bg-black/50 backdrop-blur-md rounded-2xl border border-white/20 overflow-hidden">
          <div className="bg-gradient-to-r from-[#6E3CBC] to-[#00D4FF] p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <span className="text-3xl">{demos[activeDemo].icon}</span>
                <div>
                  <h3 className="text-xl font-bold text-white">{demos[activeDemo].title}</h3>
                  <p className="text-blue-100">{demos[activeDemo].description}</p>
                </div>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={startDemo}
                  disabled={isRunning}
                  className="px-6 py-2 bg-white/20 text-white rounded-lg font-semibold hover:bg-white/30 transition-all duration-300 disabled:opacity-50"
                >
                  {isRunning ? t('demo.buttons.running') : t('demo.buttons.run')}
                </button>
                <button
                  onClick={resetDemo}
                  className="px-6 py-2 bg-white/20 text-white rounded-lg font-semibold hover:bg-white/30 transition-all duration-300"
                >
                  {t('demo.buttons.reset')}
                </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
            {/* Steps Panel */}
            <div className="p-6 border-r border-white/10">
              <h4 className="text-lg font-semibold text-white mb-4">{t('demo.execution_steps')}</h4>
              <div className="space-y-3">
                {demos[activeDemo].steps.map((step, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0.5 }}
                    animate={{ 
                      opacity: index <= demoStep ? 1 : 0.5,
                      scale: index === demoStep ? 1.02 : 1
                    }}
                    className={`p-4 rounded-lg border transition-all duration-300 ${
                      index === demoStep
                        ? 'border-cyan-500 bg-cyan-500/10'
                        : index < demoStep
                        ? 'border-green-500 bg-green-500/10'
                        : 'border-white/20 bg-white/5'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold ${
                        index < demoStep
                          ? 'bg-green-500 text-white'
                          : index === demoStep
                          ? 'bg-cyan-500 text-white'
                          : 'bg-white/20 text-gray-400'
                      }`}>
                        {index < demoStep ? '\u2713' : index + 1}
                      </div>
                      <span className={`font-semibold ${
                        index <= demoStep ? 'text-white' : 'text-gray-400'
                      }`}>
                        {step.title}
                      </span>
                      {index === demoStep && isRunning && (
                        <div className="w-2 h-2 bg-cyan-500 rounded-full animate-pulse"></div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Code/Output Panel */}
            <div className="p-6">
              <h4 className="text-lg font-semibold text-white mb-4">{t('demo.output_title')}</h4>
              <div className="bg-black/80 rounded-lg p-4 font-mono text-sm min-h-[300px]">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={demoStep}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                    className="text-green-400 whitespace-pre-line"
                  >
                    {demos[activeDemo].steps[demoStep]?.code}
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>

        {/* Performance Metrics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          <div className="bg-white/10 backdrop-blur-md rounded-lg p-6 border border-white/20">
            <h4 className="text-lg font-semibold text-white mb-3">{t('demo.performance.title')}</h4>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-400">{t('demo.performance.execution_speed')}</span>
                <span className="text-cyan-400 font-semibold">{t('demo.performance.execution_speed_value')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">{t('demo.performance.memory_usage')}</span>
                <span className="text-cyan-400 font-semibold">{t('demo.performance.memory_usage_value')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">{t('demo.performance.success_rate')}</span>
                <span className="text-cyan-400 font-semibold">{t('demo.performance.success_rate_value')}</span>
              </div>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-lg p-6 border border-white/20">
            <h4 className="text-lg font-semibold text-white mb-3">{t('demo.security.title')}</h4>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-400">{t('demo.security.quantum_level')}</span>
                <span className="text-green-400 font-semibold">{t('demo.security.quantum_level_value')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">{t('demo.security.encryption_strength')}</span>
                <span className="text-green-400 font-semibold">{t('demo.security.encryption_strength_value')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">{t('demo.security.verification_status')}</span>
                <span className="text-green-400 font-semibold">{t('demo.security.verification_status_value')}</span>
              </div>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-lg p-6 border border-white/20">
            <h4 className="text-lg font-semibold text-white mb-3">{t('demo.compatibility.title')}</h4>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-400">{t('demo.compatibility.supported_devices')}</span>
                <span className="text-purple-400 font-semibold">{t('demo.compatibility.supported_devices_value')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">{t('demo.compatibility.platform_support')}</span>
                <span className="text-purple-400 font-semibold">{t('demo.compatibility.platform_support_value')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">{t('demo.compatibility.api_version')}</span>
                <span className="text-purple-400 font-semibold">{t('demo.compatibility.api_version_value')}</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default InteractiveDemoSection;
