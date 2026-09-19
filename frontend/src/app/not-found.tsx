import Link from 'next/link';
import { GraduationCap, Home } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 text-center px-4">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
        <GraduationCap size={28} />
      </div>
      <h1 className="text-4xl font-bold">404</h1>
      <p className="text-muted-foreground">This page doesn&apos;t exist or has been moved.</p>
      <Link
        href="/"
        className="mt-2 flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90"
      >
        <Home size={16} /> Back to Home
      </Link>
    </div>
  );
}