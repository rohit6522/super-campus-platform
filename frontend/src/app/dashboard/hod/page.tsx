'use client';

import { useAuthStore } from '@/stores/auth-store';
import { useHodProfile, useDepartmentStats } from '@/hooks/queries/use-hod-dashboard';
import { useRoleGuard } from '@/hooks/use-role-guard';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import Link from 'next/link';
import { GraduationCap, UserCog, TrendingUp, CalendarCheck, PenSquare, ClipboardCheck } from 'lucide-react';

export default function HodDashboardPage() {
  useRoleGuard(['HOD']);
  const user = useAuthStore((state) => state.user);
  const { data: profile, isLoading: profileLoading, isError: profileError } = useHodProfile();
  const { data: stats, isLoading: statsLoading } = useDepartmentStats(profile?.departmentId?._id);

  if (profileError) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="font-medium">No HOD profile found</p>
          <p className="text-sm text-muted-foreground mt-1">
            Create one via <code className="text-xs">POST /api/faculty/profile</code>.
          </p>
        </CardContent>
      </Card>
    );
  }

  const statCards = [
    { label: 'Total Students', value: stats?.totalStudents, icon: GraduationCap, color: 'text-blue-600' },
    { label: 'Total Faculty', value: stats?.totalFaculty, icon: UserCog, color: 'text-purple-600' },
    { label: 'Average CGPA', value: stats?.averageCGPA, icon: TrendingUp, color: 'text-green-600' },
    {
      label: 'Average Attendance',
      value: stats ? `${stats.averageAttendance}%` : undefined,
      icon: CalendarCheck,
      color: 'text-amber-600',
    },
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="pt-6">
          <span className="inline-block rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
            HOD PORTAL
          </span>
          <h1 className="mt-3 text-2xl font-bold">Welcome, {user?.name}</h1>
          {profileLoading ? (
            <Skeleton className="mt-2 h-4 w-64" />
          ) : (
            <p className="mt-1 text-muted-foreground">
              {profile?.designation} · {profile?.departmentId?.name} ({profile?.departmentId?.code})
            </p>
          )}
          <div className="mt-4 flex flex-wrap gap-2">
            <Link href="/dashboard/faculty/attendance">
              <Button variant="outline" size="sm" className="gap-1.5">
                <CalendarCheck size={14} /> Take Attendance
              </Button>
            </Link>
            <Link href="/dashboard/faculty/assignments">
              <Button variant="outline" size="sm" className="gap-1.5">
                <PenSquare size={14} /> Assignments & Grading
              </Button>
            </Link>
            <Link href="/dashboard/faculty/exams">
              <Button variant="outline" size="sm" className="gap-1.5">
                <ClipboardCheck size={14} /> Exams & Results
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
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
                {statsLoading ? (
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