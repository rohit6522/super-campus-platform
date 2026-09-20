'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { useDepartments } from '@/hooks/queries/use-admin-departments';
import { useAllSubjects, useCreateSubject, useUpdateSubject, useDeleteSubject } from '@/hooks/queries/use-admin-subjects';
import { useRoleGuard } from '@/hooks/use-role-guard';
import { getErrorMessage } from '@/lib/get-error-message';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { EmptyState } from '@/components/ui/empty-state';
import { BookOpen } from 'lucide-react';

export default function AdminSubjectsPage() {
  useRoleGuard(['ADMIN', 'SUPER_ADMIN', 'HOD']);

  const { data: departments } = useDepartments();
  const { data: subjects, isLoading } = useAllSubjects();
  const createMutation = useCreateSubject();
  const updateMutation = useUpdateSubject();
  const deleteMutation = useDeleteSubject();

  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [credits, setCredits] = useState('4');
  const [semester, setSemester] = useState('1');
  const [departmentId, setDepartmentId] = useState('');
  const [error, setError] = useState<string | null>(null);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editCode, setEditCode] = useState('');
  const [editCredits, setEditCredits] = useState('');
  const [editSemester, setEditSemester] = useState('');

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
      toast.success('Subject added successfully');
    } catch (err) {
      const msg = getErrorMessage(err, 'Failed to add subject.');
      setError(msg);
      toast.error(msg);
    }
  };

  const startEdit = (subject: any) => {
    setEditingId(subject._id);
    setEditName(subject.name);
    setEditCode(subject.code);
    setEditCredits(String(subject.credits));
    setEditSemester(String(subject.semester));
  };

  const handleUpdate = async (id: string) => {
    try {
      await updateMutation.mutateAsync({
        id,
        data: {
          name: editName,
          code: editCode,
          credits: parseInt(editCredits, 10),
          semester: parseInt(editSemester, 10),
        },
      });
      setEditingId(null);
      toast.success('Subject updated successfully');
    } catch (err) {
      toast.error(getErrorMessage(err, 'Failed to update subject.'));
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteMutation.mutateAsync(id);
      toast.success('Subject deleted');
    } catch (err) {
      toast.error(getErrorMessage(err, 'Failed to delete subject. You may not have permission.'));
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Manage Subjects</h1>
        <p className="text-muted-foreground">Create, edit, and remove subjects for each department and semester</p>
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
                <div key={subject._id} className="rounded-md border p-3">
                  {editingId === subject._id ? (
                    <div className="space-y-2">
                      <div className="grid grid-cols-2 gap-2">
                        <Input value={editName} onChange={(e) => setEditName(e.target.value)} placeholder="Name" />
                        <Input value={editCode} onChange={(e) => setEditCode(e.target.value)} placeholder="Code" />
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <Input
                          type="number"
                          value={editCredits}
                          onChange={(e) => setEditCredits(e.target.value)}
                          placeholder="Credits"
                        />
                        <Input
                          type="number"
                          value={editSemester}
                          onChange={(e) => setEditSemester(e.target.value)}
                          placeholder="Semester"
                        />
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" onClick={() => handleUpdate(subject._id)} disabled={updateMutation.isPending}>
                          {updateMutation.isPending ? 'Saving...' : 'Save'}
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => setEditingId(null)}>
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">
                          {subject.name} ({subject.code})
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {typeof subject.departmentId === 'object' ? subject.departmentId.name : ''} · Semester{' '}
                          {subject.semester} · {subject.credits} credits
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" onClick={() => startEdit(subject)}>
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleDelete(subject._id)}
                          disabled={deleteMutation.isPending}
                        >
                          {deleteMutation.isPending ? 'Deleting...' : 'Delete'}
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <EmptyState icon={BookOpen} title="No subjects yet" description="Add your first subject above." />
          )}
        </CardContent>
      </Card>
    </div>
  );
}