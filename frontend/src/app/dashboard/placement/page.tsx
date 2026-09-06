'use client';

import { useAuthStore } from '@/stores/auth-store';
import { usePlacementStats, useAllDrives } from '@/hooks/queries/use-placement-dashboard';
import { useRoleGuard } from '@/hooks/use-role-guard';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import Link from 'next/link';
import { Rocket, ClipboardList, Trophy, TrendingUp, Award, Briefcase, Building2 } from 'lucide-react';

export default function PlacementDashboardPage() {
  useRoleGuard(['PLACEMENT_OFFICER']);
  const user = useAuthStore((state) => state.user);
  const { data: stats, isLoading: statsLoading } = usePlacementStats();
  const { data: drives, isLoading: drivesLoading } = useAllDrives();

  const statCards = [
    { label: 'Total Drives', value: stats?.totalDrives, icon: Rocket, color: 'text-blue-600' },
    { label: 'Total Applications', value: stats?.totalApplications, icon: ClipboardList, color: 'text-purple-600' },
    { label: 'Students Selected', value: stats?.selectedCount, icon: Trophy, color: 'text-green-600' },
    { label: 'Avg Package (LPA)', value: stats?.averagePackageLPA, icon: TrendingUp, color: 'text-amber-600' },
    { label: 'Highest Package (LPA)', value: stats?.highestPackageLPA, icon: Award, color: 'text-pink-600' },
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="pt-6">
          <span className="inline-block rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
            PLACEMENT CELL
          </span>
          <h1 className="mt-3 text-2xl font-bold">Welcome, {user?.name}</h1>
          <p className="mt-1 text-muted-foreground">Placement overview and management</p>

          <div className="mt-4 flex flex-wrap gap-2">
            <Link href="/dashboard/admin/companies">
              <Button variant="outline" size="sm" className="gap-1.5">
                <Building2 size={14} /> Companies
              </Button>
            </Link>
            <Link href="/dashboard/placement/drives">
              <Button variant="outline" size="sm" className="gap-1.5">
                <Briefcase size={14} /> Create Drive
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
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

      <Card>
        <CardContent className="pt-6">
          <h2 className="font-semibold mb-3">Active Drives</h2>
          {drivesLoading ? (
            <Skeleton className="h-24 w-full" />
          ) : drives && drives.length > 0 ? (
            <div className="space-y-2">
              {drives.map((drive) => (
                <Link key={drive._id} href={`/dashboard/placement/drives/${drive._id}`}>
                  <div className="flex items-center justify-between rounded-lg border p-3 text-sm transition-colors hover:bg-muted/50">
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
                </Link>
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