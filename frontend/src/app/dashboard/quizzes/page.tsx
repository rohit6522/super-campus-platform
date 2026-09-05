'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';
import { uploadPdfForMcqs } from '@/lib/api/ai-mcqs';
import { useMyMcqSets, useMcqJobStatus } from '@/hooks/queries/use-ai-mcqs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export default function QuizzesPage() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [activeJobId, setActiveJobId] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const { data: mcqSets, isLoading, refetch } = useMyMcqSets();
  const { data: job } = useMcqJobStatus(activeJobId);

  if (job?.status === 'COMPLETED' && activeJobId) {
    refetch();
  }

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadError(null);
    try {
      const uploadedJob = await uploadPdfForMcqs(file);
      setActiveJobId(uploadedJob._id);
    } catch {
      setUploadError('Upload failed. Please make sure the file is a valid PDF.');
    } finally {
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">PDF to MCQs</h1>
        <p className="text-muted-foreground">
          Upload study material and take an AI-generated quiz
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Upload PDF</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <input
            ref={fileInputRef}
            type="file"
            accept="application/pdf"
            onChange={handleFileSelect}
            className="text-sm"
          />
          {uploadError && <p className="text-sm text-destructive">{uploadError}</p>}
          {job && (
            <div className="rounded-md bg-muted p-3 text-sm">
              <p>
                <span className="font-medium">{job.sourceFileName}</span> — status:{' '}
                <span
                  className={
                    job.status === 'COMPLETED'
                      ? 'text-green-600'
                      : job.status === 'FAILED'
                      ? 'text-red-600'
                      : 'text-muted-foreground'
                  }
                >
                  {job.status}
                </span>
              </p>
              {job.status === 'FAILED' && job.errorMessage && (
                <p className="text-destructive">{job.errorMessage}</p>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>My Quizzes</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <Skeleton className="h-24 w-full" />
          ) : mcqSets && mcqSets.length > 0 ? (
            <div className="space-y-2">
              {mcqSets.map((set) => (
                <Link key={set._id} href={`/dashboard/quizzes/${set._id}`}>
                  <div className="rounded-md border p-3 transition-colors hover:bg-muted/50">
                    <p className="font-medium">{set.title}</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(set.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground">No quizzes yet.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}