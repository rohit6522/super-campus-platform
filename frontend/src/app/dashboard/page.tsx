'use client';

import { useAuthStore } from '@/stores/auth-store';
import {
  useStudentProfile,
  useMyAttendance,
  useMyCGPA,
  useMySubmissions,
  useMyTimetable,
} from '@/hooks/queries/use-student-dashboard';
import { useRoleGuard } from '@/hooks/use-role-guard';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { CalendarCheck, GraduationCap, Briefcase, FileText, Clock, AlertTriangle } from 'lucide-react';

export default function DashboardPage() {
  useRoleGuard(['STUDENT']);
  const user = useAuthStore((state) => state.user);

  const { data: profile, isLoading: profileLoading, isError: profileError } = useStudentProfile();
  const { data: attendance, isLoading: attendanceLoading } = useMyAttendance();
  const { data: cgpaData, isLoading: cgpaLoading } = useMyCGPA();
  const { data: submissions, isLoading: submissionsLoading } = useMySubmissions();
  const { data: timetable, isLoading: timetableLoading } = useMyTimetable(
    profile?.departmentId?._id,
    profile?.semester,
  );

  const pendingCount =
    submissions?.filter((s: any) => s.status === 'SUBMITTED' || s.status === 'LATE').length ?? 0;

  if (profileError) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="font-medium">No student profile found</p>
          <p className="text-sm text-muted-foreground mt-1">
            Your student profile hasn&apos;t been set up yet. Contact your admin, or create one via{' '}
            <code className="text-xs">POST /api/students/profile</code>.
          </p>
        </CardContent>
      </Card>
    );
  }

  const today = new Date().toLocaleDateString('en-US', { weekday: 'long' }).toUpperCase();
  const todaysClasses = timetable?.filter((entry) => entry.dayOfWeek === today) ?? [];

  return (
    <div className="space-y-6">
           {/* Welcome header */}
      <Card>
        <CardContent className="pt-6">
          <span className="inline-block rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
            STUDENT PORTAL
          </span>
          <h1 className="mt-3 text-2xl font-bold">
            Welcome back, {user?.name} 👋
          </h1>
          {profileLoading ? (
            <Skeleton className="mt-2 h-4 w-64" />
          ) : (
            <p className="mt-1 text-muted-foreground">
              Roll No: {profile?.rollNumber} · {profile?.departmentId?.name} · Semester{' '}
              {profile?.semester}
            </p>
          )}
        </CardContent>
      </Card>
      {/* Stat cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Total Attendance
              </p>
              <CalendarCheck size={18} className="text-green-600" />
            </div>
            {attendanceLoading ? (
              <Skeleton className="mt-2 h-8 w-20" />
            ) : (
              <>
                <p className="mt-1 text-3xl font-bold">
                  {attendance?.percentage ?? 0}%{' '}
                  <span
                    className={`text-sm font-medium ${
                      (attendance?.percentage ?? 0) >= 75 ? 'text-green-600' : 'text-red-600'
                    }`}
                  >
                    {(attendance?.percentage ?? 0) >= 75 ? '✓ Safe' : '⚠ Low'}
                  </span>
                </p>
                <p className="text-xs text-muted-foreground">
                  {attendance?.present ?? 0} of {attendance?.total ?? 0} classes attended
                </p>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Academic CGPA
              </p>
              <GraduationCap size={18} className="text-blue-600" />
            </div>
            {cgpaLoading ? (
              <Skeleton className="mt-2 h-8 w-20" />
            ) : (
              <>
                <p className="mt-1 text-3xl font-bold">
                  {cgpaData?.cgpa ?? 0} <span className="text-sm font-normal text-muted-foreground">/ 10.0</span>
                </p>
                <p className="text-xs text-muted-foreground">
                  {cgpaData?.semesterHistory?.length ?? 0} semester(s) recorded
                </p>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Backlogs
              </p>
              <Briefcase size={18} className="text-purple-600" />
            </div>
            {profileLoading ? (
              <Skeleton className="mt-2 h-8 w-20" />
            ) : (
              <>
                <p className="mt-1 text-3xl font-bold">{profile?.backlogs ?? 0}</p>
                <p className="text-xs text-muted-foreground">
                  {(profile?.backlogs ?? 0) === 0 ? 'Clear record' : 'Needs attention'}
                </p>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Assignments Due
              </p>
              <FileText size={18} className="text-amber-600" />
            </div>
            {submissionsLoading ? (
              <Skeleton className="mt-2 h-8 w-20" />
            ) : (
              <>
                <p className="mt-1 text-3xl font-bold">
                  {pendingCount} <span className="text-sm font-medium text-amber-600">Pending</span>
                </p>
                <p className="text-xs text-muted-foreground">Check submissions</p>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Today's schedule */}
      <Card>
        <CardContent className="pt-6">
          <div className="mb-3 flex items-center gap-2">
            <Clock size={16} className="text-muted-foreground" />
            <h2 className="font-semibold">Today&apos;s Schedule</h2>
          </div>
          {timetableLoading ? (
            <Skeleton className="h-24 w-full" />
          ) : todaysClasses.length > 0 ? (
            <div className="space-y-2">
              {todaysClasses.map((entry) => (
                <div
                  key={entry._id}
                  className="flex items-center justify-between rounded-lg border p-3 text-sm"
                >
                  <div>
                    <p className="font-medium">{entry.subjectId?.name}</p>
                    <p className="text-muted-foreground">
                      {entry.startTime} – {entry.endTime} · Room {entry.room} ·{' '}
                      {entry.facultyId?.name}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No classes scheduled for today.</p>
          )}
        </CardContent>
      </Card>

      {/* Placeholder notice board (real feature comes later) */}
      <Card className="border-amber-200 bg-amber-50/50">
        <CardContent className="pt-6">
          <div className="mb-2 flex items-center gap-2 text-amber-700">
            <AlertTriangle size={16} />
            <h2 className="font-semibold">Notice Board</h2>
          </div>
          <p className="text-sm text-muted-foreground">
            University-wide announcements will appear here once the Notices feature is built.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}