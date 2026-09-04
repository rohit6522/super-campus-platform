'use client';

import { useAuthStore } from '@/stores/auth-store';
import { useHodProfile, useDepartmentStats } from '@/hooks/queries/use-hod-dashboard';
import { useRoleGuard } from '@/hooks/use-role-guard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export default function HodDashboardPage() {
  useRoleGuard(['HOD']);
  const user = useAuthStore((state) => state.user);
  const { data: profile, isLoading: profileLoading, isError: profileError } = useHodProfile();
  const { data: stats, isLoading: statsLoading } = useDepartmentStats(profile?.departmentId?._id);

  if (profileError) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>No HOD profile found</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Create one via <code className="text-sm">POST /api/faculty/profile</code>.
          </p>
        </CardContent>
      </Card>
    );
  }

  const statCards = [
    { label: 'Total Students', value: stats?.totalStudents },
    { label: 'Total Faculty', value: stats?.totalFaculty },
    { label: 'Average CGPA', value: stats?.averageCGPA },
    { label: 'Average Attendance', value: stats ? `${stats.averageAttendance}%` : undefined },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Welcome, {user?.name}</h1>
        {profileLoading ? (
          <Skeleton className="h-4 w-64 mt-1" />
        ) : (
          <p className="text-muted-foreground">
            {profile?.designation} · {profile?.departmentId?.name} ({profile?.departmentId?.code})
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((card) => (
          <Card key={card.label}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {card.label}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {statsLoading ? (
                <Skeleton className="h-8 w-16" />
              ) : (
                <p className="text-2xl font-bold">{card.value ?? 0}</p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}