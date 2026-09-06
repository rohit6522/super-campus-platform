'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema, LoginFormValues } from '@/lib/validations/auth';
import { loginUser } from '@/lib/api/auth';
import { useAuthStore } from '@/stores/auth-store';
import { getDashboardPathForRole } from '@/lib/role-routes';
import { AuthBrandPanel } from '@/components/auth/auth-brand-panel';
import { AuthTabs } from '@/components/auth/auth-tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import axios from 'axios';

export default function LoginPage() {
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);
  const [serverError, setServerError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({ resolver: zodResolver(loginSchema) });

  const onSubmit = async (data: LoginFormValues) => {
    setServerError(null);
    setIsSubmitting(true);
    try {
      const response = await loginUser(data);
      setAuth(response.user, response.accessToken, response.refreshToken);
      router.push(getDashboardPathForRole(response.user.role));
    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.data?.message) {
        setServerError(err.response.data.message);
      } else {
        setServerError('Something went wrong. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen">
      <AuthBrandPanel />

      <div className="flex w-full items-center justify-center bg-muted/20 p-6 lg:w-1/2">
        <div className="w-full max-w-md rounded-2xl border bg-background p-8 shadow-sm">
          <AuthTabs active="login" />

          <h2 className="text-lg font-semibold">Sign in to your account</h2>
          <p className="text-sm text-muted-foreground">Welcome back to CampusOS</p>

          <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  className="pl-9"
                  placeholder="you@university.edu"
                  {...register('email')}
                />
              </div>
              {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <span className="cursor-not-allowed text-xs text-muted-foreground" title="Coming soon">
                  Forgot Password?
                </span>
              </div>
              <div className="relative">
                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  className="pl-9 pr-9"
                  placeholder="Your password"
                  {...register('password')}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((p) => !p)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && <p className="text-sm text-destructive">{errors.password.message}</p>}
            </div>

            {serverError && <p className="text-sm text-destructive text-center">{serverError}</p>}

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? 'Logging in...' : 'Log In to Campus'}
            </Button>
          </form>

          <div className="mt-6 flex items-center gap-3">
            <div className="h-px flex-1 bg-border" />
            <span className="text-xs text-muted-foreground">Or sign in with</span>
            <div className="h-px flex-1 bg-border" />
          </div>

          <div className="mt-4 flex justify-center gap-3">
            {['Google', 'Microsoft', 'Facebook'].map((provider) => (
              <button
                key={provider}
                type="button"
                disabled
                title="Coming soon"
                className="flex h-10 w-10 cursor-not-allowed items-center justify-center rounded-full border text-xs text-muted-foreground opacity-50"
              >
                {provider.charAt(0)}
              </button>
            ))}
          </div>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            New student?{' '}
            <a href="/register" className="font-medium text-primary underline underline-offset-4">
              Create an account
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}