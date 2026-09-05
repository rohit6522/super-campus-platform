'use client';

import { useState } from 'react';
import { useRoleGuard } from '@/hooks/use-role-guard';
import { useMySubjectsForAttendance, useStudentsByClass, useCreateSession, useMarkAttendance } from '@/hooks/queries/use-faculty-attendance';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';

interface Subject {
  _id: string;
  name: string;
  code: string;
  semester: number;
  departmentId: { _id: string; name: string; code: string };
}

export default function FacultyAttendancePage() {
  useRoleGuard(['FACULTY']);

  const { data: subjects, isLoading: subjectsLoading } = useMySubjectsForAttendance();
  const createSessionMutation = useCreateSession();
  const markMutation = useMarkAttendance();

  const [selectedSubjectId, setSelectedSubjectId] = useState('');
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [statuses, setStatuses] = useState<Record<string, 'PRESENT' | 'ABSENT'>>({});
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const selectedSubject: Subject | undefined = subjects?.find((s: Subject) => s._id === selectedSubjectId);

  const { data: students, isLoading: studentsLoading } = useStudentsByClass(
    selectedSubject?.departmentId?._id,
    selectedSubject?.semester,
  );

  const handleCreateSession = async () => {
    if (!selectedSubject) return;
    setError(null);
    try {
      const session = await createSessionMutation.mutateAsync({
        subjectId: selectedSubject._id,
        departmentId: selectedSubject.departmentId._id,
        semester: selectedSubject.semester,
        date,
      });
      setSessionId(session._id);
      // default everyone to PRESENT to start — faculty can flip absentees
      const defaults: Record<string, 'PRESENT' | 'ABSENT'> = {};
      students?.forEach((s: any) => {
        defaults[s._id] = 'PRESENT';
      });
      setStatuses(defaults);
    } catch {
      setError('Failed to create attendance session.');
    }
  };

  const toggleStatus = (studentId: string) => {
    setStatuses((prev) => ({
      ...prev,
      [studentId]: prev[studentId] === 'PRESENT' ? 'ABSENT' : 'PRESENT',
    }));
  };

  const handleSubmitAttendance = async () => {
    if (!sessionId) return;
    setError(null);
    setSuccess(false);
    try {
      const records = Object.entries(statuses).map(([studentId, status]) => ({ studentId, status }));
      await markMutation.mutateAsync({ sessionId, records });
      setSuccess(true);
    } catch {
      setError('Failed to submit attendance. The session may already be finalized.');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Take Attendance</h1>
        <p className="text-muted-foreground">Create a session and mark attendance for your class</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>1. Select Subject & Date</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label>Subject</Label>
              {subjectsLoading ? (
                <Skeleton className="h-9 w-full" />
              ) : (
                <select
                  className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm"
                  value={selectedSubjectId}
                  onChange={(e) => {
                    setSelectedSubjectId(e.target.value);
                    setSessionId(null);
                    setSuccess(false);
                  }}
                  disabled={!!sessionId}
                >
                  <option value="">-- Select --</option>
                  {subjects?.map((s: Subject) => (
                    <option key={s._id} value={s._id}>
                      {s.name} ({s.code}) — Sem {s.semester}
                    </option>
                  ))}
                </select>
              )}
            </div>
            <div className="space-y-2">
              <Label>Date</Label>
              <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} disabled={!!sessionId} />
            </div>
          </div>

          {!sessionId && (
            <Button
              onClick={handleCreateSession}
              disabled={!selectedSubjectId || createSessionMutation.isPending}
            >
              {createSessionMutation.isPending ? 'Creating...' : 'Start Attendance Session'}
            </Button>
          )}
        </CardContent>
      </Card>

      {sessionId && (
        <Card>
          <CardHeader>
            <CardTitle>2. Mark Attendance</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {studentsLoading ? (
              <Skeleton className="h-48 w-full" />
            ) : students && students.length > 0 ? (
              <div className="space-y-2">
                {students.map((student: any) => (
                  <div
                    key={student._id}
                    className="flex items-center justify-between rounded-md border p-3"
                  >
                    <div>
                      <p className="font-medium">{student.rollNumber}</p>
                      <p className="text-sm text-muted-foreground">{student.userId?.name}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => toggleStatus(student._id)}
                      className={`rounded-full px-4 py-1 text-sm font-medium ${
                        statuses[student._id] === 'PRESENT'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-red-100 text-red-700'
                      }`}
                    >
                      {statuses[student._id] ?? 'PRESENT'}
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground">No students found for this department/semester.</p>
            )}

            {error && <p className="text-sm text-destructive">{error}</p>}
            {success && <p className="text-sm text-green-600">Attendance submitted successfully!</p>}

            {!success && (
              <Button
                onClick={handleSubmitAttendance}
                disabled={markMutation.isPending || !students?.length}
                className="w-full"
              >
                {markMutation.isPending ? 'Submitting...' : 'Submit Attendance'}
              </Button>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}