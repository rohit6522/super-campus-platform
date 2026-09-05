'use client';

import { useState } from 'react';
import { useMyResumes } from '@/hooks/queries/use-resumes';
import { useAnalyzeResume, useAtsHistory } from '@/hooks/queries/use-ats';
import { AtsAnalysis } from '@/lib/api/ats';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import axios from 'axios';

function ScoreBar({ label, score }: { label: string; score: number }) {
  const color = score >= 70 ? 'bg-green-500' : score >= 40 ? 'bg-yellow-500' : 'bg-red-500';
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-sm">
        <span>{label}</span>
        <span className="font-medium">{score}%</span>
      </div>
      <div className="h-2 w-full rounded-full bg-muted">
        <div className={`h-2 rounded-full ${color}`} style={{ width: `${score}%` }} />
      </div>
    </div>
  );
}

export default function AtsAnalyzerPage() {
  const { data: resumes, isLoading: resumesLoading } = useMyResumes();
  const { data: history } = useAtsHistory();
  const analyzeMutation = useAnalyzeResume();

  const [selectedResumeId, setSelectedResumeId] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [result, setResult] = useState<AtsAnalysis | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async () => {
    setError(null);
    setResult(null);
    try {
      const analysis = await analyzeMutation.mutateAsync({
        resumeId: selectedResumeId,
        jobDescription,
      });
      setResult(analysis);
    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.data?.message) {
        setError(
          Array.isArray(err.response.data.message)
            ? err.response.data.message.join(', ')
            : err.response.data.message,
        );
      } else {
        setError('Something went wrong. Please try again.');
      }
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">ATS Resume Analyzer</h1>
        <p className="text-muted-foreground">
          Check how well your resume matches a job description
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Run Analysis</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Select Resume</Label>
            {resumesLoading ? (
              <Skeleton className="h-9 w-full" />
            ) : (
              <select
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm"
                value={selectedResumeId}
                onChange={(e) => setSelectedResumeId(e.target.value)}
              >
                <option value="">-- Choose a resume --</option>
                {resumes?.map((r) => (
                  <option key={r._id} value={r._id}>
                    {r.title}
                  </option>
                ))}
              </select>
            )}
          </div>

          <div className="space-y-2">
            <Label>Job Description</Label>
            <textarea
              className="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm"
              rows={6}
              placeholder="Paste the job description here (minimum 50 characters)..."
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
            />
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}

          <Button
            onClick={handleAnalyze}
            disabled={!selectedResumeId || jobDescription.length < 50 || analyzeMutation.isPending}
          >
            {analyzeMutation.isPending ? 'Analyzing...' : 'Analyze Resume'}
          </Button>
        </CardContent>
      </Card>

      {result && (
        <Card>
          <CardHeader>
            <CardTitle>Results — Overall Score: {result.overallScore}%</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-3">
              <ScoreBar label="Keyword Match" score={result.keywordMatchScore} />
              <ScoreBar label="Skills Match" score={result.skillsMatchScore} />
              <ScoreBar label="Experience Match" score={result.experienceMatchScore} />
              <ScoreBar label="Education Match" score={result.educationMatchScore} />
            </div>

            {result.missingKeywords.length > 0 && (
              <div>
                <p className="text-sm font-medium mb-2">Missing Keywords</p>
                <div className="flex flex-wrap gap-2">
                  {result.missingKeywords.map((kw) => (
                    <span key={kw} className="rounded-full bg-red-50 text-red-700 px-3 py-1 text-xs">
                      {kw}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {result.formattingIssues.length > 0 && (
              <div>
                <p className="text-sm font-medium mb-2">Formatting Issues</p>
                <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
                  {result.formattingIssues.map((issue) => (
                    <li key={issue}>{issue}</li>
                  ))}
                </ul>
              </div>
            )}

            {result.suggestions.length > 0 && (
              <div>
                <p className="text-sm font-medium mb-2">Suggestions</p>
                <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
                  {result.suggestions.map((s) => (
                    <li key={s}>{s}</li>
                  ))}
                </ul>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {history && history.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Analysis History</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {history.map((h) => (
              <div key={h._id} className="flex items-center justify-between border-b py-2 text-sm last:border-0">
                <span className="text-muted-foreground">
                  {new Date(h.createdAt).toLocaleDateString()}
                </span>
                <span className="font-medium">{h.overallScore}% overall</span>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}