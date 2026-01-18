'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowLeft, Shield, CheckCircle, XCircle, Search, Lock, Key, Cpu } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import '../../../i18n';

interface VerificationResult {
  valid: boolean;
  txHash: string;
  algorithm: string;
  keySize: number;
  signatureSize: number;
  securityLevel: string;
  quantumResistant: boolean;
  verificationTime: string;
  publicKey: string;
  signature: string;
}

export default function QuantumVerifyPage() {
  const router = useRouter();
  const { t } = useTranslation();
  const [txHash, setTxHash] = useState('');
  const [verifying, setVerifying] = useState(false);
  const [result, setResult] = useState<VerificationResult | null>(null);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!txHash.trim()) return;

    setVerifying(true);
    setResult(null);

    // 模拟验证过程
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // 模拟验证结果
    setResult({
      valid: true,
      txHash: txHash,
      algorithm: 'CRYSTALS-Dilithium',
      keySize: 2528,
      signatureSize: 2420,
      securityLevel: 'NIST Level 3',
      quantumResistant: true,
      verificationTime: '12.5ms',
      publicKey: '0x' + '7a8b9c'.repeat(20).slice(0, 64),
      signature: '0x' + 'd4e5f6'.repeat(40).slice(0, 128),
    });

    setVerifying(false);
  };

  return (
    <div className="max-w-4xl mx-auto px-5">
      {/* Back Button */}
      <button
        onClick={() => router.push('/explorer')}
        className="flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition-colors"
      >
        <ArrowLeft className="w-5 h-5" /> {t('explorer.quantum_verify.back')}
      </button>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-10"
      >
        <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-4">
          {t('explorer.quantum_verify.title')}
        </h1>
        <p className="text-gray-400">{t('explorer.quantum_verify.subtitle')}</p>
      </motion.div>

      {/* Algorithm Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
      >
        {[
          {
            label: t('explorer.quantum_verify.stats.algorithm'),
            value: 'Dilithium',
            icon: Key,
            color: 'text-purple-400',
          },
          {
            label: t('explorer.quantum_verify.stats.security_level'),
            value: 'NIST L3',
            icon: Shield,
            color: 'text-pink-400',
          },
          {
            label: t('explorer.quantum_verify.stats.key_size'),
            value: '2528 bytes',
            icon: Lock,
            color: 'text-indigo-400',
          },
          {
            label: t('explorer.quantum_verify.stats.quantum_safe'),
            value: t('explorer.quantum_verify.enabled'),
            icon: Cpu,
            color: 'text-emerald-400',
          },
        ].map((item, i) => (
          <div
            key={i}
            className="bg-white/5 backdrop-blur-md rounded-xl p-4 border border-white/10 hover:bg-white/10 transition-colors"
          >
            <item.icon className={`w-5 h-5 ${item.color} mb-2`} />
            <p className="text-gray-400 text-xs">{item.label}</p>
            <p className={`font-semibold ${item.color}`}>{item.value}</p>
          </div>
        ))}
      </motion.div>

      {/* Verify Form */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-8 mb-8"
      >
        <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
          <Search className="w-6 h-6 text-purple-400" />
          {t('explorer.quantum_verify.verify_title')}
        </h3>
        <form onSubmit={handleVerify} className="space-y-6">
          <div>
            <label className="block text-gray-400 text-sm mb-2 font-medium">
              {t('explorer.quantum_verify.tx_hash')}
            </label>
            <div className="relative">
              <input
                type="text"
                value={txHash}
                onChange={(e) => setTxHash(e.target.value)}
                placeholder={t('explorer.quantum_verify.input_placeholder')}
                className="w-full pl-4 pr-12 py-4 bg-black/20 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 font-mono transition-all"
              />
              {txHash && (
                <div className="absolute right-4 top-1/2 -translate-y-1/2">
                  <CheckCircle className="w-5 h-5 text-emerald-500" />
                </div>
              )}
            </div>
            <p className="text-gray-500 text-xs mt-2">{t('explorer.quantum_verify.input_hint')}</p>
          </div>

          <button
            type="submit"
            disabled={verifying || !txHash.trim()}
            className="w-full py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 rounded-xl text-white font-bold text-lg shadow-lg shadow-purple-500/25 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
          >
            {verifying ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                {t('explorer.quantum_verify.verifying')}
              </>
            ) : (
              <>
                <Shield className="w-5 h-5" />
                {t('explorer.quantum_verify.verify')}
              </>
            )}
          </button>
        </form>
      </motion.div>

      {/* Result Card */}
      {result && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`rounded-2xl border p-8 ${
            result.valid
              ? 'bg-emerald-500/5 border-emerald-500/20'
              : 'bg-red-500/5 border-red-500/20'
          }`}
        >
          <div className="flex items-center gap-4 mb-6">
            <div
              className={`w-12 h-12 rounded-full flex items-center justify-center ${
                result.valid ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'
              }`}
            >
              {result.valid ? <CheckCircle className="w-6 h-6" /> : <XCircle className="w-6 h-6" />}
            </div>
            <div>
              <h3 className={`text-xl font-bold ${result.valid ? 'text-white' : 'text-red-400'}`}>
                {result.valid
                  ? t('explorer.quantum_verify.result.valid')
                  : t('explorer.quantum_verify.result.invalid')}
              </h3>
              <p className="text-gray-400 text-sm">
                {result.valid
                  ? t('explorer.quantum_verify.result.valid_desc')
                  : t('explorer.quantum_verify.result.invalid_desc')}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <DetailRow
                label={t('explorer.quantum_verify.result.algorithm')}
                value={result.algorithm}
              />
              <DetailRow
                label={t('explorer.quantum_verify.result.security_level')}
                value={result.securityLevel}
              />
              <DetailRow
                label={t('explorer.quantum_verify.result.verification_time')}
                value={result.verificationTime}
              />
            </div>
            <div className="space-y-4">
              <DetailRow
                label={t('explorer.quantum_verify.result.key_size')}
                value={`${result.keySize} bytes`}
              />
              <DetailRow
                label={t('explorer.quantum_verify.result.signature_size')}
                value={`${result.signatureSize} bytes`}
              />
              <DetailRow
                label={t('explorer.quantum_verify.result.quantum_resistant')}
                value={
                  result.quantumResistant
                    ? t('explorer.quantum_verify.yes')
                    : t('explorer.quantum_verify.no')
                }
                highlight
              />
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-white/10 space-y-4">
            <div>
              <span className="text-gray-500 text-xs uppercase tracking-wider">
                {t('explorer.quantum_verify.result.public_key')}
              </span>
              <div className="mt-1 p-3 bg-black/20 rounded-lg border border-white/5 font-mono text-xs text-gray-300 break-all">
                {result.publicKey}
              </div>
            </div>
            <div>
              <span className="text-gray-500 text-xs uppercase tracking-wider">
                {t('explorer.quantum_verify.result.signature')}
              </span>
              <div className="mt-1 p-3 bg-black/20 rounded-lg border border-white/5 font-mono text-xs text-gray-300 break-all">
                {result.signature}
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}

function DetailRow({
  label,
  value,
  highlight,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div className="flex justify-between items-center py-2 border-b border-white/5 last:border-0">
      <span className="text-gray-400 text-sm">{label}</span>
      <span className={`font-medium ${highlight ? 'text-emerald-400' : 'text-white'}`}>
        {value}
      </span>
    </div>
  );
}
