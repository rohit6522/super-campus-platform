'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/auth-store';

export function useAuth() {
  const router = useRouter();
  const { user, accessToken, clearAuth } = useAuthStore();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    if (!accessToken || !user) {
      router.replace('/login');
    } else {
      setIsChecking(false);
    }
  }, [accessToken, user, router]);

  return { user, isChecking, clearAuth };
}