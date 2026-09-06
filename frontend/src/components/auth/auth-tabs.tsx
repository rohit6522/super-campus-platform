'use client';

import Link from 'next/link';

export function AuthTabs({ active }: { active: 'login' | 'signup' }) {
  return (
    <div className="mb-6 flex border-b">
      <Link
        href="/login"
        className={`flex-1 pb-3 text-center text-sm font-semibold ${
          active === 'login' ? 'border-b-2 border-primary text-primary' : 'text-muted-foreground'
        }`}
      >
        Login
      </Link>
      <Link
        href="/register"
        className={`flex-1 pb-3 text-center text-sm font-semibold ${
          active === 'signup' ? 'border-b-2 border-primary text-primary' : 'text-muted-foreground'
        }`}
      >
        Sign Up
      </Link>
    </div>
  );
}