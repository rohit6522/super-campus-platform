'use client';

import { useState } from 'react';
import { useDepartments, useCreateDepartment, useDeleteDepartment } from '@/hooks/queries/use-admin-departments';
import { useRoleGuard } from '@/hooks/use-role-guard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import axios from 'axios';

export default function AdminDepartmentsPage() {
  useRoleGuard(['ADMIN', 'SUPER_ADMIN']);

  const { data: departments, isLoading } = useDepartments();
  const createMutation = useCreateDepartment();
  const deleteMutation = useDeleteDepartment();

  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleCreate = async () => {
    setError(null);
    try {
      await createMutation.mutateAsync({ name, code, description: description || undefined });
      setName('');
      setCode('');
      setDescription('');
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
        <h1 className="text-2xl font-bold">Manage Departments</h1>
        <p className="text-muted-foreground">Create and view academic departments</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Add Department</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label>Name</Label>
              <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Computer Science" />
            </div>
            <div className="space-y-2">
              <Label>Code</Label>
              <Input value={code} onChange={(e) => setCode(e.target.value)} placeholder="CSE" />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Description (optional)</Label>
            <Input value={description} onChange={(e) => setDescription(e.target.value)} />
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
          <Button onClick={handleCreate} disabled={!name || !code || createMutation.isPending}>
            {createMutation.isPending ? 'Adding...' : 'Add Department'}
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>All Departments</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <Skeleton className="h-24 w-full" />
          ) : departments && departments.length > 0 ? (
            <div className="space-y-2">
              {departments.map((dept) => (
                <div key={dept._id} className="flex items-center justify-between border-b py-2 last:border-0">
                  <div>
                    <p className="font-medium">
                      {dept.name} ({dept.code})
                    </p>
                    {dept.description && (
                      <p className="text-sm text-muted-foreground">{dept.description}</p>
                    )}
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => deleteMutation.mutate(dept._id)}
                    disabled={deleteMutation.isPending}
                  >
                    Delete
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground">No departments yet.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}