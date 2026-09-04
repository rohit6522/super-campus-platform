'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useMyResumes, useCreateResume, useDeleteResume, useDuplicateResume } from '@/hooks/queries/use-resumes';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

export default function ResumesListPage() {
  const router = useRouter();
  const { data: resumes, isLoading } = useMyResumes();
  const createMutation = useCreateResume();
  const deleteMutation = useDeleteResume();
  const duplicateMutation = useDuplicateResume();

  const handleCreate = async () => {
    const resume = await createMutation.mutateAsync({
      title: 'Untitled Resume',
      fullName: '',
      email: '',
      education: [],
      skills: [],
      experience: [],
      projects: [],
      certifications: [],
      achievements: [],
      languages: [],
    });
    router.push(`/dashboard/resumes/${resume._id}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">My Resumes</h1>
          <p className="text-muted-foreground">Build and manage your resumes</p>
        </div>
        <Button onClick={handleCreate} disabled={createMutation.isPending}>
          {createMutation.isPending ? 'Creating...' : '+ New Resume'}
        </Button>
      </div>

      {isLoading ? (
        <Skeleton className="h-40 w-full" />
      ) : resumes && resumes.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {resumes.map((resume) => (
            <Card key={resume._id}>
              <CardHeader>
                <CardTitle>{resume.title}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  {resume.fullName || 'No name set'} · {resume.skills.length} skills ·{' '}
                  {resume.experience.length} experience entries
                </p>
                <div className="flex gap-2">
                  <Link href={`/dashboard/resumes/${resume._id}`}>
                    <Button size="sm" variant="outline">
                      Edit
                    </Button>
                  </Link>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => duplicateMutation.mutate(resume._id)}
                  >
                    Duplicate
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => deleteMutation.mutate(resume._id)}
                  >
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <p className="text-muted-foreground">
          No resumes yet — create your first one to get started.
        </p>
      )}
    </div>
  );
}