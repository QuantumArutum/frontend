'use client';

import { AuthProvider } from '@/contexts/AuthContext';
import MovieBookingApp from '@/app/components/MovieBookingApp';

export default function MovieBookingPage() {
  return (
    <AuthProvider>
      <MovieBookingApp />
    </AuthProvider>
  );
}

