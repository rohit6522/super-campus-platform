'use client';

import { useMyCGPA } from '@/hooks/queries/use-student-dashboard';
import { useQuery } from '@tanstack/react-query';
import { getMyResults } from '@/lib/api/exams';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { GraduationCap } from 'lucide-react';

export default function ResultsPage() {
  const { data: cgpaData, isLoading: cgpaLoading } = useMyCGPA();
  const { data: results, isLoading: resultsLoading } = useQuery({
    queryKey: ['my-results'],
    queryFn: getMyResults,
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Results & CGPA</h1>
        <p className="text-muted-foreground">Your academic performance</p>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-2 mb-4">
            <GraduationCap size={18} className="text-blue-600" />
            <h2 className="font-semibold">CGPA Overview</h2>
          </div>
          {cgpaLoading ? (
            <Skeleton className="h-16 w-full" />
          ) : (
            <>
              <p className="text-4xl font-bold">
                {cgpaData?.cgpa ?? 0} <span className="text-base font-normal text-muted-foreground">/ 10.0</span>
              </p>
              {cgpaData?.semesterHistory && cgpaData.semesterHistory.length > 0 && (
                <div className="mt-4 space-y-2">
                  <p className="text-sm font-medium">Semester History</p>
                  {cgpaData.semesterHistory.map((sem: any) => (
                    <div
                      key={sem.semester}
                      className="flex items-center justify-between rounded-md border p-2 text-sm"
                    >
                      <span>Semester {sem.semester}</span>
                      <span className="font-medium">SGPA: {sem.sgpa}</span>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <h2 className="font-semibold mb-3">Subject-wise Results</h2>
          {resultsLoading ? (
            <Skeleton className="h-32 w-full" />
          ) : results && results.length > 0 ? (
            <div className="space-y-2">
              {results.map((result: any) => (
                <div
                  key={result._id}
                  className="flex items-center justify-between rounded-md border p-3 text-sm"
                >
                  <div>
                    <p className="font-medium">{result.subjectId?.name}</p>
                    <p className="text-muted-foreground">
                      {result.examId?.examType} · {result.marksObtained}/{result.maxMarks}
                    </p>
                  </div>
                  <span className="rounded-full bg-muted px-3 py-1 text-xs font-medium">
                    Grade {result.grade}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No results published yet.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}