'use client';

import { useAuthStore } from '@/stores/auth-store';
import { useFacultyProfile, useMySubjects } from '@/hooks/queries/use-faculty-dashboard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export default function FacultyDashboardPage() {
  const user = useAuthStore((state) => state.user);
  const { data: profile, isLoading: profileLoading, isError: profileError } = useFacultyProfile();
  const { data: subjects, isLoading: subjectsLoading } = useMySubjects();

  if (profileError) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>No faculty profile found</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            You haven&apos;t created your faculty profile yet. Create one via{' '}
            <code className="text-sm">POST /api/faculty/profile</code>.
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
          <Skeleton className="h-4 w-64 mt-1" />
        ) : (
          <p className="text-muted-foreground">
            {profile?.designation} · {profile?.departmentId?.name} ({profile?.departmentId?.code}) ·
            Employee ID: {profile?.employeeId}
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Assigned Subjects
            </CardTitle>
          </CardHeader>
          <CardContent>
            {subjectsLoading ? (
              <Skeleton className="h-8 w-8" />
            ) : (
              <p className="text-2xl font-bold">{subjects?.length ?? 0}</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Specialization
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg font-medium">{profile?.specialization ?? '—'}</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>My Subjects</CardTitle>
        </CardHeader>
        <CardContent>
          {subjectsLoading ? (
            <Skeleton className="h-24 w-full" />
          ) : subjects && subjects.length > 0 ? (
            <div className="space-y-2">
              {subjects.map((subject) => (
                <div
                  key={subject._id}
                  className="flex items-center justify-between rounded-md border p-3 text-sm"
                >
                  <div>
                    <p className="font-medium">{subject.name}</p>
                    <p className="text-muted-foreground">
                      {subject.code} · {subject.credits} credits · Semester {subject.semester}
                    </p>
                  </div>
                  <span className="text-muted-foreground">{subject.departmentId?.code}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground">No subjects assigned yet.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}