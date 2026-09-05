'use client';

import { useState } from 'react';
import { useDepartments } from '@/hooks/queries/use-admin-departments';
import { useAllSubjects, useCreateSubject, useDeleteSubject } from '@/hooks/queries/use-admin-subjects';
import { useRoleGuard } from '@/hooks/use-role-guard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import axios from 'axios';

export default function AdminSubjectsPage() {
  useRoleGuard(['ADMIN', 'SUPER_ADMIN', 'HOD']);

  const { data: departments } = useDepartments();
  const { data: subjects, isLoading } = useAllSubjects();
  const createMutation = useCreateSubject();
  const deleteMutation = useDeleteSubject();

  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [credits, setCredits] = useState('4');
  const [semester, setSemester] = useState('1');
  const [departmentId, setDepartmentId] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleCreate = async () => {
    setError(null);
    try {
      await createMutation.mutateAsync({
        name,
        code,
        credits: parseInt(credits, 10),
        semester: parseInt(semester, 10),
        departmentId,
      });
      setName('');
      setCode('');
    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.data?.message) {
        setError(
          Array.isArray(err.response.data.message)
            ? err.response.data.message.join(', ')
            : err.response.data.message,
        );
      } else {
        setError('Something went wrong.');
      }
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Manage Subjects</h1>
        <p className="text-muted-foreground">Create subjects for each department and semester</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Add Subject</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label>Name</Label>
              <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Data Structures" />
            </div>
            <div className="space-y-2">
              <Label>Code</Label>
              <Input value={code} onChange={(e) => setCode(e.target.value)} placeholder="CS201" />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div className="space-y-2">
              <Label>Credits</Label>
              <Input type="number" value={credits} onChange={(e) => setCredits(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Semester</Label>
              <Input type="number" min={1} max={8} value={semester} onChange={(e) => setSemester(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Department</Label>
              <select
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm"
                value={departmentId}
                onChange={(e) => setDepartmentId(e.target.value)}
              >
                <option value="">-- Select --</option>
                {departments?.map((d) => (
                  <option key={d._id} value={d._id}>
                    {d.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
          <Button onClick={handleCreate} disabled={!name || !code || !departmentId || createMutation.isPending}>
            {createMutation.isPending ? 'Adding...' : 'Add Subject'}
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>All Subjects</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <Skeleton className="h-24 w-full" />
          ) : subjects && subjects.length > 0 ? (
            <div className="space-y-2">
              {subjects.map((subject) => (
                <div key={subject._id} className="flex items-center justify-between border-b py-2 last:border-0">
                  <div>
                    <p className="font-medium">
                      {subject.name} ({subject.code})
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {typeof subject.departmentId === 'object' ? subject.departmentId.name : ''} · Semester{' '}
                      {subject.semester} · {subject.credits} credits
                    </p>
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => deleteMutation.mutate(subject._id)}
                    disabled={deleteMutation.isPending}
                  >
                    Delete
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground">No subjects yet.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}