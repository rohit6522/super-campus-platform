'use client';

import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';
import { useSubmissionsForAssignment, useGradeSubmission } from '@/hooks/queries/use-faculty-assignments';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';

export default function GradeSubmissionsPage() {
  const params = useParams();
  const router = useRouter();
  const assignmentId = params.id as string;

  const { data: submissions, isLoading } = useSubmissionsForAssignment(assignmentId);
  const gradeMutation = useGradeSubmission();

  const [gradingId, setGradingId] = useState<string | null>(null);
  const [marks, setMarks] = useState('');
  const [feedback, setFeedback] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleGrade = async (submissionId: string) => {
    setError(null);
    try {
      await gradeMutation.mutateAsync({
        submissionId,
        marksObtained: parseInt(marks, 10),
        feedback: feedback || undefined,
      });
      setGradingId(null);
      setMarks('');
      setFeedback('');
    } catch {
      setError('Failed to grade submission — check marks don\'t exceed the maximum.');
    }
  };

  return (
    <div className="space-y-6">
      <Button variant="ghost" onClick={() => router.push('/dashboard/faculty/assignments')}>
        ← Back
      </Button>

      <div>
        <h1 className="text-2xl font-bold">Submissions</h1>
        <p className="text-muted-foreground">Review and grade student submissions</p>
      </div>

      {isLoading ? (
        <Skeleton className="h-64 w-full" />
      ) : submissions && submissions.length > 0 ? (
        <div className="space-y-3">
          {submissions.map((sub) => (
            <Card key={sub._id}>
              <CardHeader>
                <CardTitle className="text-base flex items-center justify-between">
                  <span>{sub.studentId?.rollNumber}</span>
                  <span
                    className={`text-sm font-normal ${
                      sub.status === 'GRADED' ? 'text-green-600' : 'text-muted-foreground'
                    }`}
                  >
                    {sub.status}
                    {sub.marksObtained !== undefined && ` — ${sub.marksObtained} marks`}
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <a
                  href={sub.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-blue-600 underline"
                >
                  {sub.fileName}
                </a>

                {sub.feedback && (
                  <p className="text-sm text-muted-foreground">Feedback: {sub.feedback}</p>
                )}

                {gradingId === sub._id ? (
                  <div className="space-y-2 rounded-md border p-3">
                    <Input
                      type="number"
                      placeholder="Marks"
                      value={marks}
                      onChange={(e) => setMarks(e.target.value)}
                    />
                    <Input
                      placeholder="Feedback (optional)"
                      value={feedback}
                      onChange={(e) => setFeedback(e.target.value)}
                    />
                    {error && <p className="text-sm text-destructive">{error}</p>}
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={() => handleGrade(sub._id)}
                        disabled={!marks || gradeMutation.isPending}
                      >
                        {gradeMutation.isPending ? 'Saving...' : 'Save Grade'}
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => setGradingId(null)}>
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <Button size="sm" variant="outline" onClick={() => setGradingId(sub._id)}>
                    {sub.status === 'GRADED' ? 'Update Grade' : 'Grade'}
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <p className="text-muted-foreground">No submissions yet.</p>
      )}
    </div>
  );
}