'use client';

import { AuthProvider } from '@/contexts/AuthContext';
import HotelBookingApp from '@/app/components/HotelBookingApp';

export default function HotelBookingPage() {
  return (
    <AuthProvider>
      <HotelBookingApp />
    </AuthProvider>
  );
}

