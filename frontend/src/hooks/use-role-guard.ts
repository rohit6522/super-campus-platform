'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/auth-store';
import { getDashboardPathForRole } from '@/lib/role-routes';

/**
 * Redirects away if the logged-in user's role doesn't match the page they're on.
 * Call this at the top of any role-specific dashboard page.
 */
export function useRoleGuard(allowedRoles: string[]) {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const hasHydrated = useAuthStore((state) => state.hasHydrated);

  useEffect(() => {
    if (!hasHydrated || !user) return; // wait for hydration, or let useAuth handle no-user case

    if (!allowedRoles.includes(user.role)) {
      router.replace(getDashboardPathForRole(user.role));
    }
  }, [user, hasHydrated, allowedRoles, router]);
}