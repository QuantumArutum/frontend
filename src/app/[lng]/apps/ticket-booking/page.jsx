'use client';

import { AuthProvider } from '@/contexts/AuthContext';
import TicketBookingApp from '@/app/components/TicketBookingApp';

export default function TicketBookingPage() {
  return (
    <AuthProvider>
      <TicketBookingApp />
    </AuthProvider>
  );
}

