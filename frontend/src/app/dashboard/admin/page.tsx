'use client';

import { useAuthStore } from '@/stores/auth-store';
import { useAdminStats } from '@/hooks/queries/use-admin-dashboard';
import { useRoleGuard } from '@/hooks/use-role-guard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export default function AdminDashboardPage() {
  useRoleGuard(['ADMIN', 'SUPER_ADMIN']);
  const user = useAuthStore((state) => state.user);
  // ...rest stays exactly the same
  const { data: stats, isLoading } = useAdminStats();

  const statCards = [
    { label: 'Total Students', value: stats?.totalStudents },
    { label: 'Total Faculty', value: stats?.totalFaculty },
    { label: 'Departments', value: stats?.totalDepartments },
    { label: 'Companies', value: stats?.totalCompanies },
    { label: 'Active Placement Drives', value: stats?.activeDrives },
    { label: 'Total Users', value: stats?.totalUsers },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Welcome, {user?.name}</h1>
        <p className="text-muted-foreground">System-wide overview</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {statCards.map((card) => (
          <Card key={card.label}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {card.label}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-8 w-16" />
              ) : (
                <p className="text-2xl font-bold">{card.value ?? 0}</p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Department, subject, and company management screens will be built next —
            for now, manage these via the API directly.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}