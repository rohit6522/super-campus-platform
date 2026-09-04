'use client';

import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';
import { useDrive, useEligibility, useApplyToDrive } from '@/hooks/queries/use-placements';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import axios from 'axios';

export default function DriveDetailPage() {
  const params = useParams();
  const router = useRouter();
  const driveId = params.driveId as string;

  const { data: drive, isLoading: driveLoading } = useDrive(driveId);
  const { data: eligibility, isLoading: eligibilityLoading } = useEligibility(driveId);
  const applyMutation = useApplyToDrive();
  const [applyError, setApplyError] = useState<string | null>(null);
  const [applied, setApplied] = useState(false);

  const handleApply = async () => {
    setApplyError(null);
    try {
      await applyMutation.mutateAsync(driveId);
      setApplied(true);
    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.data?.message) {
        setApplyError(err.response.data.message);
      } else {
        setApplyError('Something went wrong. Please try again.');
      }
    }
  };

  if (driveLoading) {
    return <Skeleton className="h-64 w-full" />;
  }

  if (!drive) {
    return <p className="text-muted-foreground">Drive not found.</p>;
  }

  return (
    <div className="space-y-6">
      <Button variant="ghost" onClick={() => router.push('/dashboard/placements')}>
        ← Back to drives
      </Button>

      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">
            {drive.companyId?.name} — {drive.jobRole}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-muted-foreground">{drive.jobDescription}</p>

          <div className="grid grid-cols-2 gap-4 text-sm sm:grid-cols-3">
            <div>
              <p className="text-muted-foreground">Package</p>
              <p className="font-medium">{drive.packageLPA} LPA</p>
            </div>
            <div>
              <p className="text-muted-foreground">Min CGPA</p>
              <p className="font-medium">{drive.minCGPA}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Max Backlogs</p>
              <p className="font-medium">{drive.maxBacklogs}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Allowed Branches</p>
              <p className="font-medium">{drive.allowedBranches?.join(', ')}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Graduation Year</p>
              <p className="font-medium">{drive.graduationYear}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Deadline</p>
              <p className="font-medium">
                {new Date(drive.applicationDeadline).toLocaleDateString()}
              </p>
            </div>
          </div>

          {drive.requiredSkills?.length > 0 && (
            <div>
              <p className="text-sm text-muted-foreground mb-1">Required Skills</p>
              <div className="flex flex-wrap gap-2">
                {drive.requiredSkills.map((skill) => (
                  <span key={skill} className="rounded-full bg-muted px-3 py-1 text-xs">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Eligibility</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {eligibilityLoading ? (
            <Skeleton className="h-24 w-full" />
          ) : eligibility ? (
            <>
              <div
                className={`rounded-md p-3 text-sm font-medium ${
                  eligibility.eligible
                    ? 'bg-green-50 text-green-700'
                    : 'bg-red-50 text-red-700'
                }`}
              >
                {eligibility.eligible
                  ? 'You are eligible for this drive'
                  : 'You are not eligible for this drive'}
              </div>

              <div className="space-y-2">
                {eligibility.reasons.map((reason) => (
                  <div
                    key={reason.criterion}
                    className="flex items-center justify-between text-sm border-b pb-2 last:border-0"
                  >
                    <span className="font-medium">{reason.criterion}</span>
                    <span className="text-muted-foreground">
                      Required: {reason.required} · Yours: {reason.actual}
                    </span>
                    <span className={reason.passed ? 'text-green-600' : 'text-red-600'}>
                      {reason.passed ? '✓' : '✗'}
                    </span>
                  </div>
                ))}
              </div>

              {applyError && <p className="text-sm text-destructive">{applyError}</p>}
              {applied && (
                <p className="text-sm text-green-600">
                  Application submitted successfully!
                </p>
              )}

              <Button
                onClick={handleApply}
                disabled={!eligibility.eligible || applyMutation.isPending || applied}
                className="w-full"
              >
                {applied
                  ? 'Applied'
                  : applyMutation.isPending
                  ? 'Applying...'
                  : 'Apply Now'}
              </Button>
            </>
          ) : null}
        </CardContent>
      </Card>
    </div>
  );
}