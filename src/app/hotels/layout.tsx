'use client';

import React from 'react';
import EnhancedNavbar from '@/app/components/EnhancedNavbar';
import EnhancedFooter from '../../components/EnhancedFooter';

export default function HotelsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen">
      <EnhancedNavbar />
      <main className="flex-grow pt-24 pb-12 relative z-10">
        {children}
      </main>
      <EnhancedFooter />
    </div>
  );
}

