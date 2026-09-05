'use client';

import { useParams, useRouter } from 'next/navigation';
import { useDriveApplications, useUpdateApplicationStatus } from '@/hooks/queries/use-officer-placements';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

const statusOptions = ['APPLIED', 'SHORTLISTED', 'INTERVIEW_SCHEDULED', 'SELECTED', 'REJECTED'];

const statusColors: Record<string, string> = {
  APPLIED: 'bg-blue-50 text-blue-700',
  SHORTLISTED: 'bg-yellow-50 text-yellow-700',
  INTERVIEW_SCHEDULED: 'bg-purple-50 text-purple-700',
  SELECTED: 'bg-green-50 text-green-700',
  REJECTED: 'bg-red-50 text-red-700',
};

export default function DriveApplicationsPage() {
  const params = useParams();
  const router = useRouter();
  const driveId = params.id as string;

  const { data: applications, isLoading } = useDriveApplications(driveId);
  const updateStatusMutation = useUpdateApplicationStatus();

  return (
    <div className="space-y-6">
      <Button variant="ghost" onClick={() => router.push('/dashboard/placement/drives')}>
        ← Back
      </Button>

      <div>
        <h1 className="text-2xl font-bold">Applications</h1>
        <p className="text-muted-foreground">Manage candidates for this drive</p>
      </div>

      {isLoading ? (
        <Skeleton className="h-64 w-full" />
      ) : applications && applications.length > 0 ? (
        <div className="space-y-3">
          {applications.map((app) => (
            <Card key={app._id}>
              <CardContent className="flex items-center justify-between py-4">
                <div>
                  <p className="font-medium">{app.studentId?.rollNumber}</p>
                  <p className="text-sm text-muted-foreground">
                    CGPA {app.studentId?.currentCGPA} · Applied{' '}
                    {new Date(app.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <select
                  className={`rounded-full px-3 py-1 text-xs font-medium border-none ${
                    statusColors[app.status] ?? 'bg-muted text-muted-foreground'
                  }`}
                  value={app.status}
                  onChange={(e) =>
                    updateStatusMutation.mutate({ applicationId: app._id, status: e.target.value })
                  }
                >
                  {statusOptions.map((s) => (
                    <option key={s} value={s}>
                      {s.replace('_', ' ')}
                    </option>
                  ))}
                </select>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <p className="text-muted-foreground">No applications yet.</p>
      )}
    </div>
  );
}