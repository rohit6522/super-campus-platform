'use client';

import { useState } from 'react';
import { useRoleGuard } from '@/hooks/use-role-guard';
import { useAnnouncements, useCreateAnnouncement } from '@/hooks/queries/use-announcements';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';

export default function AdminAnnouncementsPage() {
  useRoleGuard(['ADMIN', 'SUPER_ADMIN', 'HOD']);

  const { data: announcements, isLoading } = useAnnouncements(20);
  const createMutation = useCreateAnnouncement();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('GENERAL');
  const [error, setError] = useState<string | null>(null);

  const handleCreate = async () => {
    setError(null);
    try {
      await createMutation.mutateAsync({ title, content, category });
      setTitle('');
      setContent('');
    } catch {
      setError('Failed to post announcement.');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Announcements</h1>
        <p className="text-muted-foreground">Post university-wide notices</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>New Announcement</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="space-y-2">
            <Label>Title</Label>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Content</Label>
            <textarea
              className="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm"
              rows={4}
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label>Category</Label>
            <select
              className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="GENERAL">General</option>
              <option value="EXAM">Exam</option>
              <option value="PLACEMENT">Placement</option>
              <option value="URGENT">Urgent</option>
            </select>
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
          <Button onClick={handleCreate} disabled={!title || !content || createMutation.isPending}>
            {createMutation.isPending ? 'Posting...' : 'Post Announcement'}
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>All Announcements</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <Skeleton className="h-24 w-full" />
          ) : announcements && announcements.length > 0 ? (
            <div className="space-y-2">
              {announcements.map((a) => (
                <div key={a._id} className="border-b py-2 last:border-0">
                  <p className="font-medium">{a.title}</p>
                  <p className="text-sm text-muted-foreground">{a.content}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground">No announcements yet.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}