'use client';

import { AuthProvider } from '@/contexts/AuthContext';
import FlightBookingApp from '@/app/components/FlightBookingApp';

export default function FlightBookingPage() {
  return (
    <AuthProvider>
      <FlightBookingApp />
    </AuthProvider>
  );
}
