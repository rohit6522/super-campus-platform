'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCreateProblem } from '@/hooks/queries/use-admin-coding';
import { useRoleGuard } from '@/hooks/use-role-guard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import axios from 'axios';

const topicOptions = [
  'ARRAYS', 'STRINGS', 'LINKED_LISTS', 'STACK', 'QUEUE', 'TREES',
  'GRAPHS', 'DYNAMIC_PROGRAMMING', 'SORTING', 'SEARCHING', 'RECURSION', 'GREEDY',
];

interface TestCaseForm {
  input: string;
  expectedOutput: string;
  isHidden: boolean;
}

export default function AdminCodingProblemsPage() {
  useRoleGuard(['FACULTY', 'ADMIN', 'SUPER_ADMIN']);
  const router = useRouter();

  const createMutation = useCreateProblem();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [difficulty, setDifficulty] = useState('EASY');
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const [points, setPoints] = useState('10');
  const [starterCode, setStarterCode] = useState('');
  const [testCases, setTestCases] = useState<TestCaseForm[]>([
    { input: '', expectedOutput: '', isHidden: false },
  ]);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const toggleTopic = (topic: string) => {
    setSelectedTopics((prev) =>
      prev.includes(topic) ? prev.filter((t) => t !== topic) : [...prev, topic],
    );
  };

  const addTestCase = () =>
    setTestCases((prev) => [...prev, { input: '', expectedOutput: '', isHidden: false }]);

  const updateTestCase = (index: number, patch: Partial<TestCaseForm>) => {
    setTestCases((prev) => {
      const list = [...prev];
      list[index] = { ...list[index], ...patch };
      return list;
    });
  };

  const removeTestCase = (index: number) =>
    setTestCases((prev) => prev.filter((_, i) => i !== index));

  const handleCreate = async () => {
    setError(null);
    setSuccess(false);
    try {
      await createMutation.mutateAsync({
        title,
        description,
        difficulty,
        topics: selectedTopics,
        testCases,
        starterCode: starterCode || undefined,
        points: parseInt(points, 10),
      });
      setSuccess(true);
      setTitle('');
      setDescription('');
      setSelectedTopics([]);
      setTestCases([{ input: '', expectedOutput: '', isHidden: false }]);
      setStarterCode('');
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

  const isValid =
    title && description && selectedTopics.length > 0 && testCases.every((tc) => tc.input && tc.expectedOutput);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Create Coding Problem</h1>
          <p className="text-muted-foreground">Add a new DSA practice problem</p>
        </div>
        <Button variant="outline" onClick={() => router.push('/dashboard/coding')}>
          View Problems
        </Button>
      </div>

      <Card>
        <CardContent className="space-y-4 pt-6">
          <div className="space-y-2">
            <Label>Title</Label>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Two Sum" />
          </div>

          <div className="space-y-2">
            <Label>Description</Label>
            <textarea
              className="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm"
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label>Difficulty</Label>
              <select
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm"
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
              >
                <option value="EASY">Easy</option>
                <option value="MEDIUM">Medium</option>
                <option value="HARD">Hard</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label>Points</Label>
              <Input type="number" value={points} onChange={(e) => setPoints(e.target.value)} />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Topics</Label>
            <div className="flex flex-wrap gap-2">
              {topicOptions.map((topic) => (
                <button
                  key={topic}
                  type="button"
                  onClick={() => toggleTopic(topic)}
                  className={`rounded-full px-3 py-1 text-xs ${
                    selectedTopics.includes(topic)
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-muted-foreground'
                  }`}
                >
                  {topic}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Starter Code (optional)</Label>
            <textarea
              className="flex w-full rounded-md border border-input bg-muted/30 px-3 py-2 font-mono text-sm shadow-sm"
              rows={4}
              value={starterCode}
              onChange={(e) => setStarterCode(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Test Cases</CardTitle>
          <Button size="sm" variant="outline" onClick={addTestCase}>
            + Add Test Case
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          {testCases.map((tc, i) => (
            <div key={i} className="space-y-2 rounded-md border p-3">
              <div className="grid grid-cols-2 gap-2">
                <Input
                  placeholder="Input"
                  value={tc.input}
                  onChange={(e) => updateTestCase(i, { input: e.target.value })}
                />
                <Input
                  placeholder="Expected Output"
                  value={tc.expectedOutput}
                  onChange={(e) => updateTestCase(i, { expectedOutput: e.target.value })}
                />
              </div>
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={tc.isHidden}
                    onChange={(e) => updateTestCase(i, { isHidden: e.target.checked })}
                  />
                  Hidden test case (not shown to students)
                </label>
                {testCases.length > 1 && (
                  <Button size="sm" variant="ghost" onClick={() => removeTestCase(i)}>
                    Remove
                  </Button>
                )}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {error && <p className="text-sm text-destructive">{error}</p>}
      {success && <p className="text-sm text-green-600">Problem created successfully!</p>}

      <Button onClick={handleCreate} disabled={!isValid || createMutation.isPending} className="w-full">
        {createMutation.isPending ? 'Creating...' : 'Create Problem'}
      </Button>
    </div>
  );
}