'use client';

import { useAuthStore } from '@/stores/auth-store';
import { useAdminStats } from '@/hooks/queries/use-admin-dashboard';
import { useRoleGuard } from '@/hooks/use-role-guard';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import Link from 'next/link';
import { Users, GraduationCap, Building2, Briefcase, Rocket, UserCog, Megaphone, Code2, BookOpen } from 'lucide-react';

export default function AdminDashboardPage() {
  useRoleGuard(['ADMIN', 'SUPER_ADMIN']);
  const user = useAuthStore((state) => state.user);
  const { data: stats, isLoading } = useAdminStats();

  const statCards = [
    { label: 'Total Students', value: stats?.totalStudents, icon: GraduationCap, color: 'text-blue-600' },
    { label: 'Total Faculty', value: stats?.totalFaculty, icon: UserCog, color: 'text-purple-600' },
    { label: 'Departments', value: stats?.totalDepartments, icon: Building2, color: 'text-amber-600' },
    { label: 'Companies', value: stats?.totalCompanies, icon: Briefcase, color: 'text-green-600' },
    { label: 'Active Drives', value: stats?.activeDrives, icon: Rocket, color: 'text-pink-600' },
    { label: 'Total Users', value: stats?.totalUsers, icon: Users, color: 'text-indigo-600' },
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="pt-6">
          <span className="inline-block rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
            ADMIN PORTAL
          </span>
          <h1 className="mt-3 text-2xl font-bold">Welcome, {user?.name}</h1>
          <p className="mt-1 text-muted-foreground">System-wide overview and management</p>

          <div className="mt-4 flex flex-wrap gap-2">
            <Link href="/dashboard/admin/departments">
              <Button variant="outline" size="sm" className="gap-1.5">
                <Building2 size={14} /> Departments
              </Button>
            </Link>
            <Link href="/dashboard/admin/subjects">
              <Button variant="outline" size="sm" className="gap-1.5">
                <BookOpen size={14} /> Subjects
              </Button>
            </Link>
            <Link href="/dashboard/admin/companies">
              <Button variant="outline" size="sm" className="gap-1.5">
                <Briefcase size={14} /> Companies
              </Button>
            </Link>
            <Link href="/dashboard/admin/coding-problems">
              <Button variant="outline" size="sm" className="gap-1.5">
                <Code2 size={14} /> Coding Problems
              </Button>
            </Link>
            <Link href="/dashboard/admin/announcements">
              <Button variant="outline" size="sm" className="gap-1.5">
                <Megaphone size={14} /> Announcements
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <Card key={card.label}>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    {card.label}
                  </p>
                  <Icon size={18} className={card.color} />
                </div>
                {isLoading ? (
                  <Skeleton className="mt-2 h-8 w-16" />
                ) : (
                  <p className="mt-1 text-3xl font-bold">{card.value ?? 0}</p>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}