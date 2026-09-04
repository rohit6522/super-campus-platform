'use client';

import Link from 'next/link';
import { useDrives } from '@/hooks/queries/use-placements';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';

export default function PlacementsListPage() {
  const { data: drives, isLoading } = useDrives();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Placement Drives</h1>
          <p className="text-muted-foreground">Browse open opportunities</p>
        </div>
        <Link href="/dashboard/placements/applications">
          <Button variant="outline">My Applications</Button>
        </Link>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-40 w-full" />
          ))}
        </div>
      ) : drives && drives.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {drives.map((drive) => (
            <Link key={drive._id} href={`/dashboard/placements/${drive._id}`}>
              <Card className="h-full transition-colors hover:bg-muted/50">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>{drive.companyId?.name}</span>
                    <span className="text-sm font-normal text-muted-foreground">
                      {drive.status}
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-1 text-sm">
                  <p className="font-medium">{drive.jobRole}</p>
                  <p className="text-muted-foreground">{drive.companyId?.industry}</p>
                  <p className="text-muted-foreground">
                    {drive.packageLPA} LPA · Min CGPA {drive.minCGPA}
                  </p>
                  <p className="text-muted-foreground">
                    Deadline: {new Date(drive.applicationDeadline).toLocaleDateString()}
                  </p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      ) : (
        <p className="text-muted-foreground">No placement drives available right now.</p>
      )}
    </div>
  );
}