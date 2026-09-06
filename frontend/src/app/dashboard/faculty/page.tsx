'use client';

import { useAuthStore } from '@/stores/auth-store';
import { useFacultyProfile, useMySubjects } from '@/hooks/queries/use-faculty-dashboard';
import { useRoleGuard } from '@/hooks/use-role-guard';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import Link from 'next/link';
import { BookOpen, Award, CalendarCheck, PenSquare, ClipboardCheck } from 'lucide-react';

export default function FacultyDashboardPage() {
  useRoleGuard(['FACULTY']);
  const user = useAuthStore((state) => state.user);

  const { data: profile, isLoading: profileLoading, isError: profileError } = useFacultyProfile();
  const { data: subjects, isLoading: subjectsLoading } = useMySubjects();

  if (profileError) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="font-medium">No faculty profile found</p>
          <p className="text-sm text-muted-foreground mt-1">
            Create one via <code className="text-xs">POST /api/faculty/profile</code>.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="pt-6">
          <span className="inline-block rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
            FACULTY PORTAL
          </span>
          <h1 className="mt-3 text-2xl font-bold">Welcome, {user?.name}</h1>
          {profileLoading ? (
            <Skeleton className="mt-2 h-4 w-64" />
          ) : (
            <p className="mt-1 text-muted-foreground">
              {profile?.designation} · {profile?.departmentId?.name} ({profile?.departmentId?.code}) ·
              Employee ID: {profile?.employeeId}
            </p>
          )}
          <div className="mt-4 flex flex-wrap gap-2">
            <Link href="/dashboard/faculty/attendance">
              <Button variant="outline" size="sm" className="gap-1.5">
                <CalendarCheck size={14} /> Take Attendance
              </Button>
            </Link>
            <Link href="/dashboard/faculty/assignments">
              <Button variant="outline" size="sm" className="gap-1.5">
                <PenSquare size={14} /> Assignments & Grading
              </Button>
            </Link>
            <Link href="/dashboard/faculty/exams">
              <Button variant="outline" size="sm" className="gap-1.5">
                <ClipboardCheck size={14} /> Exams & Results
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Assigned Subjects
              </p>
              <BookOpen size={18} className="text-blue-600" />
            </div>
            {subjectsLoading ? (
              <Skeleton className="mt-2 h-8 w-16" />
            ) : (
              <p className="mt-1 text-3xl font-bold">{subjects?.length ?? 0}</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Specialization
              </p>
              <Award size={18} className="text-purple-600" />
            </div>
            <p className="mt-1 text-lg font-medium">{profile?.specialization ?? '—'}</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="pt-6">
          <h2 className="font-semibold mb-3">My Subjects</h2>
          {subjectsLoading ? (
            <Skeleton className="h-24 w-full" />
          ) : subjects && subjects.length > 0 ? (
            <div className="space-y-2">
              {subjects.map((subject) => (
                <div key={subject._id} className="flex items-center justify-between rounded-lg border p-3 text-sm">
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