'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useProblems } from '@/hooks/queries/use-coding';
import { useMyProgress } from '@/hooks/queries/use-coding';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

const difficultyColors: Record<string, string> = {
  EASY: 'text-green-600',
  MEDIUM: 'text-yellow-600',
  HARD: 'text-red-600',
};

export default function CodingProblemsPage() {
  const [difficulty, setDifficulty] = useState('');
  const [search, setSearch] = useState('');
  const { data: problems, isLoading } = useProblems({
    difficulty: difficulty || undefined,
    search: search || undefined,
  });
  const { data: progress } = useMyProgress();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">DSA Practice</h1>
          <p className="text-muted-foreground">
            {progress ? `${progress.problemsSolved} solved · ${progress.totalPoints} points` : 'Loading progress...'}
          </p>
        </div>
      </div>

      <div className="flex gap-3">
        <input
          className="flex h-9 flex-1 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm"
          placeholder="Search problems..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          className="flex h-9 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm"
          value={difficulty}
          onChange={(e) => setDifficulty(e.target.value)}
        >
          <option value="">All Difficulties</option>
          <option value="EASY">Easy</option>
          <option value="MEDIUM">Medium</option>
          <option value="HARD">Hard</option>
        </select>
      </div>

      {isLoading ? (
        <Skeleton className="h-64 w-full" />
      ) : problems && problems.length > 0 ? (
        <div className="space-y-2">
          {problems.map((problem) => (
            <Link key={problem._id} href={`/dashboard/coding/${problem._id}`}>
              <Card className="transition-colors hover:bg-muted/50">
                <CardContent className="flex items-center justify-between py-4">
                  <div>
                    <p className="font-medium">{problem.title}</p>
                    <p className="text-sm text-muted-foreground">
                      {problem.topics.join(', ')} · {problem.points} points
                    </p>
                  </div>
                  <span className={`text-sm font-medium ${difficultyColors[problem.difficulty]}`}>
                    {problem.difficulty}
                  </span>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      ) : (
        <p className="text-muted-foreground">No problems found.</p>
      )}
    </div>
  );
}