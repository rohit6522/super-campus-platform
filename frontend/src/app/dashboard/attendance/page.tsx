'use client';

import { useMyAttendance } from '@/hooks/queries/use-student-dashboard';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { CalendarCheck } from 'lucide-react';

export default function AttendanceHubPage() {
  const { data: attendance, isLoading } = useMyAttendance();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Attendance Hub</h1>
        <p className="text-muted-foreground">Track your overall attendance percentage</p>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-2 mb-4">
            <CalendarCheck size={18} className="text-green-600" />
            <h2 className="font-semibold">Overall Attendance</h2>
          </div>

          {isLoading ? (
            <Skeleton className="h-32 w-full" />
          ) : (
            <div className="space-y-4">
              <div className="flex items-baseline gap-3">
                <p className="text-5xl font-bold">{attendance?.percentage ?? 0}%</p>
                <span
                  className={`text-sm font-medium ${
                    (attendance?.percentage ?? 0) >= 75 ? 'text-green-600' : 'text-red-600'
                  }`}
                >
                  {(attendance?.percentage ?? 0) >= 75 ? '✓ Safe to sit for exams' : '⚠ Below minimum requirement'}
                </span>
              </div>

              <div className="h-3 w-full rounded-full bg-muted">
                <div
                  className={`h-3 rounded-full ${
                    (attendance?.percentage ?? 0) >= 75 ? 'bg-green-500' : 'bg-red-500'
                  }`}
                  style={{ width: `${Math.min(attendance?.percentage ?? 0, 100)}%` }}
                />
              </div>

              <div className="grid grid-cols-3 gap-4 pt-2 text-center">
                <div>
                  <p className="text-2xl font-bold">{attendance?.total ?? 0}</p>
                  <p className="text-xs text-muted-foreground">Total Classes</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-green-600">{attendance?.present ?? 0}</p>
                  <p className="text-xs text-muted-foreground">Present</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-red-600">{attendance?.absent ?? 0}</p>
                  <p className="text-xs text-muted-foreground">Absent</p>
                </div>
              </div>

              <p className="text-xs text-muted-foreground pt-2">
                Minimum 75% attendance is required to be eligible for semester-end examinations.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}