'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/auth-store';

export function useAuth() {
  const router = useRouter();
  const { user, accessToken, clearAuth, hasHydrated } = useAuthStore();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    if (!hasHydrated) return; // wait until Zustand has loaded from localStorage

    if (!accessToken || !user) {
      router.replace('/login');
    } else {
      setIsChecking(false);
    }
  }, [accessToken, user, hasHydrated, router]);

  return { user, isChecking: isChecking || !hasHydrated, clearAuth };
}