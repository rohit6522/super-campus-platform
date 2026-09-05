'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRoleGuard } from '@/hooks/use-role-guard';
import { useMySubjectsForAttendance } from '@/hooks/queries/use-faculty-attendance';
import { useCreateAssignment } from '@/hooks/queries/use-faculty-assignments';
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
  departmentId: { _id: string; name: string };
}

export default function FacultyAssignmentsPage() {
  useRoleGuard(['FACULTY']);

  const { data: subjects, isLoading: subjectsLoading } = useMySubjectsForAttendance();
  const createMutation = useCreateAssignment();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [subjectId, setSubjectId] = useState('');
  const [deadline, setDeadline] = useState('');
  const [maxMarks, setMaxMarks] = useState('20');
  const [error, setError] = useState<string | null>(null);
  const [createdId, setCreatedId] = useState<string | null>(null);

  const selectedSubject: Subject | undefined = subjects?.find((s: Subject) => s._id === subjectId);

  const handleCreate = async () => {
    if (!selectedSubject) return;
    setError(null);
    try {
      const assignment = await createMutation.mutateAsync({
        title,
        description: description || undefined,
        subjectId: selectedSubject._id,
        departmentId: selectedSubject.departmentId._id,
        semester: selectedSubject.semester,
        deadline: new Date(deadline).toISOString(),
        maxMarks: parseInt(maxMarks, 10),
      });
      setCreatedId(assignment._id);
      setTitle('');
      setDescription('');
    } catch {
      setError('Failed to create assignment.');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Create Assignment</h1>
        <p className="text-muted-foreground">Set up a new assignment for your class</p>
      </div>

      <Card>
        <CardContent className="space-y-3 pt-6">
          <div className="space-y-2">
            <Label>Title</Label>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Description</Label>
            <textarea
              className="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label>Subject</Label>
            {subjectsLoading ? (
              <Skeleton className="h-9 w-full" />
            ) : (
              <select
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm"
                value={subjectId}
                onChange={(e) => setSubjectId(e.target.value)}
              >
                <option value="">-- Select --</option>
                {subjects?.map((s: Subject) => (
                  <option key={s._id} value={s._id}>
                    {s.name} ({s.code})
                  </option>
                ))}
              </select>
            )}
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label>Deadline</Label>
              <Input type="datetime-local" value={deadline} onChange={(e) => setDeadline(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Max Marks</Label>
              <Input type="number" value={maxMarks} onChange={(e) => setMaxMarks(e.target.value)} />
            </div>
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}
          {createdId && (
            <p className="text-sm text-green-600">
              Assignment created!{' '}
              <Link href={`/dashboard/faculty/assignments/${createdId}`} className="underline">
                View submissions
              </Link>
            </p>
          )}

          <Button onClick={handleCreate} disabled={!title || !subjectId || !deadline || createMutation.isPending}>
            {createMutation.isPending ? 'Creating...' : 'Create Assignment'}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}