'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRef } from 'react';
import { uploadPdfForNotes } from '@/lib/api/ai-notes';
import { useMyNotes, useJobStatus } from '@/hooks/queries/use-ai-notes';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

export default function NotesPage() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [activeJobId, setActiveJobId] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const { data: notes, isLoading: notesLoading, refetch: refetchNotes } = useMyNotes();
  const { data: job } = useJobStatus(activeJobId);

  // Once the job completes, refresh the notes list to show the new one
  if (job?.status === 'COMPLETED' && activeJobId) {
    refetchNotes();
  }

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadError(null);
    setIsUploading(true);
    try {
      const uploadedJob = await uploadPdfForNotes(file);
      setActiveJobId(uploadedJob._id);
    } catch {
      setUploadError('Upload failed. Please make sure the file is a valid PDF.');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">PDF to Notes</h1>
        <p className="text-muted-foreground">
          Upload study material and get AI-generated structured notes
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
            disabled={isUploading}
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
              {job.status === 'PROCESSING' || job.status === 'PENDING' ? (
                <p className="text-muted-foreground">
                  Generating notes... this may take a few seconds.
                </p>
              ) : null}
              {job.status === 'FAILED' && job.errorMessage && (
                <p className="text-destructive">{job.errorMessage}</p>
              )}
              {job.status === 'COMPLETED' && (
                <p className="text-green-600">Notes generated! See below.</p>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>My Notes</CardTitle>
        </CardHeader>
        <CardContent>
          {notesLoading ? (
            <Skeleton className="h-24 w-full" />
          ) : notes && notes.length > 0 ? (
            <div className="space-y-2">
              {notes.map((note) => (
                <Link key={note._id} href={`/dashboard/notes/${note._id}`}>
                  <div className="rounded-md border p-3 transition-colors hover:bg-muted/50">
                    <p className="font-medium">{note.title}</p>
                    <p className="text-sm text-muted-foreground line-clamp-1">{note.summary}</p>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground">No notes generated yet.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}