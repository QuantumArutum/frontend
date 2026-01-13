import React from 'react';
import EnhancedNavbar from '@/app/components/EnhancedNavbar';
import EnhancedFooter from '../components/EnhancedFooter';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-screen bg-slate-900">
      <EnhancedNavbar />
      <main className="relative z-10">
        {children}
      </main>
      <EnhancedFooter />
    </div>
  );
}

