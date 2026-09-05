'use client';

import { useState } from 'react';
import { useStudentProfile } from '@/hooks/queries/use-student-dashboard';
import { useAssignmentsForSubject, useMySubmissions, useSubmitAssignment } from '@/hooks/queries/use-student-assignments';
import { apiClient } from '@/lib/api-client';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { BookOpen } from 'lucide-react';

interface Subject {
  _id: string;
  name: string;
  code: string;
}

export default function AssignmentsPage() {
  const { data: profile } = useStudentProfile();

  const { data: subjects, isLoading: subjectsLoading } = useQuery({
    queryKey: ['subjects-for-student', profile?.departmentId?._id, profile?.semester],
    queryFn: async () => {
      const response = await apiClient.get<Subject[]>('/subjects', {
        params: { departmentId: profile?.departmentId?._id, semester: profile?.semester },
      });
      return response.data;
    },
    enabled: !!profile?.departmentId?._id && !!profile?.semester,
  });

  const { data: mySubmissions } = useMySubmissions();
  const submitMutation = useSubmitAssignment();

  const [expandedSubjectId, setExpandedSubjectId] = useState<string | null>(null);
  const [submittingId, setSubmittingId] = useState<string | null>(null);
  const [fileUrl, setFileUrl] = useState('');
  const [fileName, setFileName] = useState('');
  const [error, setError] = useState<string | null>(null);

  const { data: assignments, isLoading: assignmentsLoading } = useAssignmentsForSubject(
    expandedSubjectId ?? '',
  );

  const getSubmissionFor = (assignmentId: string) =>
    mySubmissions?.find((s) => s.assignmentId?._id === assignmentId);

  const handleSubmit = async (assignmentId: string) => {
    setError(null);
    try {
      await submitMutation.mutateAsync({ assignmentId, fileUrl, fileName });
      setSubmittingId(null);
      setFileUrl('');
      setFileName('');
    } catch {
      setError('Failed to submit. Please try again.');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Courses & Assignments</h1>
        <p className="text-muted-foreground">View subjects and submit assignments</p>
      </div>

      {subjectsLoading ? (
        <Skeleton className="h-64 w-full" />
      ) : subjects && subjects.length > 0 ? (
        <div className="space-y-3">
          {subjects.map((subject) => (
            <Card key={subject._id}>
              <CardContent className="pt-6">
                <button
                  onClick={() =>
                    setExpandedSubjectId(expandedSubjectId === subject._id ? null : subject._id)
                  }
                  className="flex w-full items-center justify-between text-left"
                >
                  <div className="flex items-center gap-2">
                    <BookOpen size={16} className="text-muted-foreground" />
                    <span className="font-medium">
                      {subject.name} ({subject.code})
                    </span>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {expandedSubjectId === subject._id ? 'Hide' : 'View Assignments'}
                  </span>
                </button>

                {expandedSubjectId === subject._id && (
                  <div className="mt-4 space-y-3 border-t pt-4">
                    {assignmentsLoading ? (
                      <Skeleton className="h-24 w-full" />
                    ) : assignments && assignments.length > 0 ? (
                      assignments.map((assignment) => {
                        const submission = getSubmissionFor(assignment._id);
                        return (
                          <div key={assignment._id} className="rounded-md border p-3 text-sm">
                            <div className="flex items-center justify-between">
                              <p className="font-medium">{assignment.title}</p>
                              <span className="text-xs text-muted-foreground">
                                Due {new Date(assignment.deadline).toLocaleDateString()} ·{' '}
                                {assignment.maxMarks} marks
                              </span>
                            </div>
                            {assignment.description && (
                              <p className="mt-1 text-muted-foreground">{assignment.description}</p>
                            )}

                            {submission ? (
                              <div className="mt-2 rounded-md bg-muted p-2">
                                <p>
                                  Status:{' '}
                                  <span
                                    className={
                                      submission.status === 'GRADED'
                                        ? 'text-green-600 font-medium'
                                        : 'text-muted-foreground'
                                    }
                                  >
                                    {submission.status}
                                  </span>
                                  {submission.marksObtained !== undefined &&
                                    ` — ${submission.marksObtained}/${assignment.maxMarks}`}
                                </p>
                                {submission.feedback && (
                                  <p className="text-muted-foreground mt-1">
                                    Feedback: {submission.feedback}
                                  </p>
                                )}
                              </div>
                            ) : submittingId === assignment._id ? (
                              <div className="mt-2 space-y-2">
                                <Input
                                  placeholder="File URL (e.g. Google Drive link)"
                                  value={fileUrl}
                                  onChange={(e) => setFileUrl(e.target.value)}
                                />
                                <Input
                                  placeholder="File name"
                                  value={fileName}
                                  onChange={(e) => setFileName(e.target.value)}
                                />
                                {error && <p className="text-destructive">{error}</p>}
                                <div className="flex gap-2">
                                  <Button
                                    size="sm"
                                    onClick={() => handleSubmit(assignment._id)}
                                    disabled={!fileUrl || !fileName || submitMutation.isPending}
                                  >
                                    {submitMutation.isPending ? 'Submitting...' : 'Submit'}
                                  </Button>
                                  <Button size="sm" variant="ghost" onClick={() => setSubmittingId(null)}>
                                    Cancel
                                  </Button>
                                </div>
                              </div>
                            ) : (
                              <Button
                                size="sm"
                                variant="outline"
                                className="mt-2"
                                onClick={() => setSubmittingId(assignment._id)}
                              >
                                Submit Assignment
                              </Button>
                            )}
                          </div>
                        );
                      })
                    ) : (
                      <p className="text-muted-foreground">No assignments for this subject yet.</p>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <p className="text-muted-foreground">No subjects found for your semester.</p>
      )}
    </div>
  );
}