'use client';

import { useMyApplications } from '@/hooks/queries/use-placements';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

const statusColors: Record<string, string> = {
  APPLIED: 'bg-blue-50 text-blue-700',
  SHORTLISTED: 'bg-yellow-50 text-yellow-700',
  INTERVIEW_SCHEDULED: 'bg-purple-50 text-purple-700',
  SELECTED: 'bg-green-50 text-green-700',
  REJECTED: 'bg-red-50 text-red-700',
};

export default function MyApplicationsPage() {
  const { data: applications, isLoading } = useMyApplications();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">My Applications</h1>
        <p className="text-muted-foreground">Track your placement applications</p>
      </div>

      {isLoading ? (
        <Skeleton className="h-32 w-full" />
      ) : applications && applications.length > 0 ? (
        <div className="space-y-3">
          {applications.map((app) => (
            <Card key={app._id}>
              <CardContent className="flex items-center justify-between py-4">
                <div>
                  <p className="font-medium">
                    {app.driveId?.companyId?.name} — {app.driveId?.jobRole}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {app.driveId?.packageLPA} LPA · Applied{' '}
                    {new Date(app.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <span
                  className={`rounded-full px-3 py-1 text-xs font-medium ${
                    statusColors[app.status] ?? 'bg-muted text-muted-foreground'
                  }`}
                >
                  {app.status.replace('_', ' ')}
                </span>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <p className="text-muted-foreground">You haven't applied to any drives yet.</p>
      )}
    </div>
  );
}