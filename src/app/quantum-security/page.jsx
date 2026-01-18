'use client';

import React from 'react';
import QuantumSecurityPanel from '@/app/components/QuantumSecurityPanel';
import { useTranslation } from 'react-i18next';
import '../../i18n';

export default function QuantumSecurityPage() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white p-4">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent mb-4">
            {t('quantum_security_page.title')}
          </h1>
          <p className="text-gray-300 text-lg">{t('quantum_security_page.description')}</p>
        </div>

        {/* Full Quantum Security Panel */}
        <QuantumSecurityPanel
          onSecurityChange={(event) => {
            console.log('Global security event:', event);
            switch (event.type) {
              case 'keyGenerated':
                console.log('New key generated:', event.keyId);
                break;
              case 'keyRotated':
                console.log('Key rotated:', event.oldKeyId, '->', event.newKeyId);
                break;
              case 'securityLevelChanged':
                console.log('Security level changed:', event.newLevel);
                break;
              default:
                console.log('Unknown security event:', event);
            }
          }}
          showFullPanel={true}
        />
      </div>
    </div>
  );
}
