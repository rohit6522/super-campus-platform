'use client';

import { useAuthStore } from '@/stores/auth-store';
import {
  useStudentProfile,
  useMyAttendance,
  useMyCGPA,
  useMySubmissions,
  useMyTimetable,
} from '@/hooks/queries/use-student-dashboard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export default function DashboardPage() {
  const user = useAuthStore((state) => state.user);

  const { data: profile, isLoading: profileLoading, isError: profileError } =
    useStudentProfile();
  const { data: attendance, isLoading: attendanceLoading } = useMyAttendance();
  const { data: cgpaData, isLoading: cgpaLoading } = useMyCGPA();
  const { data: submissions, isLoading: submissionsLoading } = useMySubmissions();
  const { data: timetable, isLoading: timetableLoading } = useMyTimetable(
    profile?.departmentId?._id,
    profile?.semester,
  );

  const pendingCount = submissions?.filter(
    (s: any) => s.status === 'SUBMITTED' || s.status === 'LATE',
  ).length ?? 0;

  if (profileError) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>No student profile found</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            You haven&apos;t created your student profile yet. This is expected
            if you registered but haven&apos;t completed onboarding — we&apos;ll
            build that flow soon. For now, create one via the API using your
            student details.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Welcome, {user?.name}</h1>
        {profileLoading ? (
          <Skeleton className="h-4 w-48 mt-1" />
        ) : (
          <p className="text-muted-foreground">
            {profile?.departmentId?.name} · Semester {profile?.semester} · Roll No.{' '}
            {profile?.rollNumber}
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              CGPA
            </CardTitle>
          </CardHeader>
          <CardContent>
            {cgpaLoading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <p className="text-2xl font-bold">{cgpaData?.cgpa ?? '—'}</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Attendance
            </CardTitle>
          </CardHeader>
          <CardContent>
            {attendanceLoading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <p
                className={`text-2xl font-bold ${
                  (attendance?.percentage ?? 0) < 75 ? 'text-destructive' : ''
                }`}
              >
                {attendance?.percentage ?? 0}%
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Pending Assignments
            </CardTitle>
          </CardHeader>
          <CardContent>
            {submissionsLoading ? (
              <Skeleton className="h-8 w-8" />
            ) : (
              <p className="text-2xl font-bold">{pendingCount}</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Backlogs
            </CardTitle>
          </CardHeader>
          <CardContent>
            {profileLoading ? (
              <Skeleton className="h-8 w-8" />
            ) : (
              <p className="text-2xl font-bold">{profile?.backlogs ?? 0}</p>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Weekly Timetable</CardTitle>
        </CardHeader>
        <CardContent>
          {timetableLoading ? (
            <Skeleton className="h-32 w-full" />
          ) : timetable && timetable.length > 0 ? (
            <div className="space-y-2">
              {timetable.map((entry) => (
                <div
                  key={entry._id}
                  className="flex items-center justify-between rounded-md border p-3 text-sm"
                >
                  <div>
                    <p className="font-medium">{entry.subjectId?.name}</p>
                    <p className="text-muted-foreground">
                      {entry.dayOfWeek} · {entry.startTime}–{entry.endTime} · Room{' '}
                      {entry.room}
                    </p>
                  </div>
                  <span className="text-muted-foreground">{entry.facultyId?.name}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground">
              No timetable entries found for your department/semester yet.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}