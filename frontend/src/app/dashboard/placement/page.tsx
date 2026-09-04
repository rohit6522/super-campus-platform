'use client';

import { useAuthStore } from '@/stores/auth-store';
import { usePlacementStats, useAllDrives } from '@/hooks/queries/use-placement-dashboard';
import { useRoleGuard } from '@/hooks/use-role-guard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export default function PlacementDashboardPage() {
  useRoleGuard(['PLACEMENT_OFFICER']);
  const user = useAuthStore((state) => state.user);
  const { data: stats, isLoading: statsLoading } = usePlacementStats();
  const { data: drives, isLoading: drivesLoading } = useAllDrives();

  const statCards = [
    { label: 'Total Drives', value: stats?.totalDrives },
    { label: 'Total Applications', value: stats?.totalApplications },
    { label: 'Students Selected', value: stats?.selectedCount },
    { label: 'Avg Package (LPA)', value: stats?.averagePackageLPA },
    { label: 'Highest Package (LPA)', value: stats?.highestPackageLPA },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Welcome, {user?.name}</h1>
        <p className="text-muted-foreground">Placement overview</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
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

      <Card>
        <CardHeader>
          <CardTitle>Active Drives</CardTitle>
        </CardHeader>
        <CardContent>
          {drivesLoading ? (
            <Skeleton className="h-24 w-full" />
          ) : drives && drives.length > 0 ? (
            <div className="space-y-2">
              {drives.map((drive) => (
                <div
                  key={drive._id}
                  className="flex items-center justify-between rounded-md border p-3 text-sm"
                >
                  <div>
                    <p className="font-medium">
                      {drive.companyId?.name} — {drive.jobRole}
                    </p>
                    <p className="text-muted-foreground">
                      {drive.packageLPA} LPA · Deadline:{' '}
                      {new Date(drive.applicationDeadline).toLocaleDateString()} · {drive.status}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground">No placement drives created yet.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}