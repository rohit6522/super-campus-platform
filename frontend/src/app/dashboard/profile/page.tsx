'use client';

import { useAuthStore } from '@/stores/auth-store';
import { useStudentProfile } from '@/hooks/queries/use-student-dashboard';
import { useFacultyProfile } from '@/hooks/queries/use-faculty-dashboard';
import { useHodProfile } from '@/hooks/queries/use-hod-dashboard';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { User, Mail, Shield, Building2, Hash } from 'lucide-react';

export default function ProfilePage() {
  const user = useAuthStore((state) => state.user);
  const role = user?.role;

  const studentQuery = useStudentProfile();
  const facultyQuery = useFacultyProfile();
  const hodQuery = useHodProfile();

  const isStudent = role === 'STUDENT';
  const isFaculty = role === 'FACULTY';
  const isHod = role === 'HOD';

  const roleSpecificLoading =
    (isStudent && studentQuery.isLoading) ||
    (isFaculty && facultyQuery.isLoading) ||
    (isHod && hodQuery.isLoading);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">My Profile</h1>
        <p className="text-muted-foreground">View your account information</p>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-2xl font-bold text-primary-foreground">
              {user?.name?.charAt(0) ?? '?'}
            </div>
            <div>
              <h2 className="text-xl font-bold">{user?.name}</h2>
              <span className="mt-1 inline-block rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium">
                {user?.role}
              </span>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="flex items-center gap-3 rounded-lg border p-3">
              <Mail size={16} className="text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">Email</p>
                <p className="text-sm font-medium">{user?.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-lg border p-3">
              <Shield size={16} className="text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">Role</p>
                <p className="text-sm font-medium">{user?.role}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {isStudent && (
        <Card>
          <CardContent className="pt-6">
            <h3 className="mb-4 font-semibold">Academic Details</h3>
            {roleSpecificLoading ? (
              <Skeleton className="h-24 w-full" />
            ) : studentQuery.data ? (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <InfoRow icon={Hash} label="Roll Number" value={studentQuery.data.rollNumber} />
                <InfoRow
                  icon={Building2}
                  label="Department"
                  value={`${studentQuery.data.departmentId?.name} (${studentQuery.data.departmentId?.code})`}
                />
                <InfoRow icon={User} label="Semester" value={String(studentQuery.data.semester)} />
                <InfoRow icon={User} label="Batch Year" value={String(studentQuery.data.batchYear)} />
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No student profile found.</p>
            )}
          </CardContent>
        </Card>
      )}

      {(isFaculty || isHod) && (
        <Card>
          <CardContent className="pt-6">
            <h3 className="mb-4 font-semibold">Faculty Details</h3>
            {roleSpecificLoading ? (
              <Skeleton className="h-24 w-full" />
            ) : (isFaculty ? facultyQuery.data : hodQuery.data) ? (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <InfoRow
                  icon={Hash}
                  label="Employee ID"
                  value={(isFaculty ? facultyQuery.data : hodQuery.data)?.employeeId ?? ''}
                />
                <InfoRow
                  icon={Building2}
                  label="Department"
                  value={`${(isFaculty ? facultyQuery.data : hodQuery.data)?.departmentId?.name} (${
                    (isFaculty ? facultyQuery.data : hodQuery.data)?.departmentId?.code
                  })`}
                />
                <InfoRow
                  icon={User}
                  label="Designation"
                  value={(isFaculty ? facultyQuery.data : hodQuery.data)?.designation ?? ''}
                />
                <InfoRow
                  icon={User}
                  label="Specialization"
                  value={(isFaculty ? facultyQuery.data : hodQuery.data)?.specialization ?? '—'}
                />
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No profile found.</p>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function InfoRow({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: string }) {
  return (
    <div className="flex items-center gap-3 rounded-lg border p-3">
      <Icon size={16} className="text-muted-foreground" />
      <div>
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-sm font-medium">{value}</p>
      </div>
    </div>
  );
} 