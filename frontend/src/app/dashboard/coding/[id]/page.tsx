"use client";

import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import {
  useProblem,
  useSubmitCode,
  useMySubmissions,
} from "@/hooks/queries/use-coding";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

const verdictColors: Record<string, string> = {
  ACCEPTED: "text-green-600",
  WRONG_ANSWER: "text-red-600",
  RUNTIME_ERROR: "text-red-600",
  TIME_LIMIT_EXCEEDED: "text-yellow-600",
  PENDING: "text-muted-foreground",
};

const languageOptions = [
  { value: "javascript", label: "JavaScript" },
  { value: "python", label: "Python" },
  { value: "cpp", label: "C++" },
  { value: "java", label: "Java" },
];

export default function ProblemDetailPage() {
  const params = useParams();
  const router = useRouter();
  const problemId = params.id as string;

  const { data: problem, isLoading } = useProblem(problemId);
  const { data: submissions } = useMySubmissions(problemId);
  const submitMutation = useSubmitCode();

  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("javascript");
  const [lastResult, setLastResult] = useState<{
    verdict: string;
    passed: number;
    total: number;
  } | null>(null);

  // Set starter code once the problem loads, only if the editor is still empty
  if (problem?.starterCode && !code) {
    setCode(problem.starterCode);
  }

  const handleSubmit = async () => {
    setLastResult(null);
    const result = await submitMutation.mutateAsync({
      problemId,
      code,
      language,
    });
    setLastResult({
      verdict: result.verdict,
      passed: result.testCasesPassed,
      total: result.totalTestCases,
    });
  };

  if (isLoading || !problem) {
    return <Skeleton className="h-96 w-full" />;
  }

  return (
    <div className="space-y-6">
      <Button variant="ghost" onClick={() => router.push("/dashboard/coding")}>
        ← Back to problems
      </Button>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Left: problem statement */}
        <Card>
          <CardHeader>
            <CardTitle>{problem.title}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              {problem.description}
            </p>

            <div className="flex flex-wrap gap-2 text-xs">
              <span className="rounded-full bg-muted px-3 py-1">
                {problem.difficulty}
              </span>
              {problem.topics.map((t) => (
                <span key={t} className="rounded-full bg-muted px-3 py-1">
                  {t}
                </span>
              ))}
              <span className="rounded-full bg-muted px-3 py-1">
                {problem.points} points
              </span>
            </div>

            {problem.testCases && problem.testCases.length > 0 && (
              <div className="space-y-2">
                <p className="text-sm font-medium">Sample Test Cases</p>
                {problem.testCases.map((tc, i) => (
                  <div key={i} className="rounded-md border p-3 text-sm">
                    <p>
                      <span className="text-muted-foreground">Input:</span>{" "}
                      {tc.input}
                    </p>
                    <p>
                      <span className="text-muted-foreground">
                        Expected Output:
                      </span>{" "}
                      {tc.expectedOutput}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Right: code editor + submit */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Solution</CardTitle>
            <select
              className="flex h-9 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm"
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
            >
              {languageOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </CardHeader>
          <CardContent className="space-y-3">
            <textarea
              className="flex w-full rounded-md border border-input bg-muted/30 px-3 py-2 font-mono text-sm shadow-sm"
              rows={16}
              value={code}
              onChange={(e) => setCode(e.target.value)}
              spellCheck={false}
            />

            {lastResult && (
              <div
                className={`rounded-md p-3 text-sm font-medium ${verdictColors[lastResult.verdict]} bg-muted`}
              >
                {lastResult.verdict.replace("_", " ")} — {lastResult.passed}/
                {lastResult.total} test cases passed
              </div>
            )}

            <Button
              onClick={handleSubmit}
              disabled={!code || submitMutation.isPending}
              className="w-full"
            >
              {submitMutation.isPending ? "Running..." : "Submit"}
            </Button>

            <p className="text-xs text-muted-foreground">
              Note: code execution currently uses a placeholder evaluator while
              a secure sandboxed executor is being integrated — submissions are
              tracked but results may not reflect real logic yet.
            </p>
          </CardContent>
        </Card>
      </div>

      {submissions && submissions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Submission History</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {submissions.map((sub) => (
              <div
                key={sub._id}
                className="flex items-center justify-between border-b py-2 text-sm last:border-0"
              >
                <span className="text-muted-foreground">
                  {new Date(sub.createdAt).toLocaleString()} · {sub.language}
                </span>
                <span className={`font-medium ${verdictColors[sub.verdict]}`}>
                  {sub.verdict.replace("_", " ")} ({sub.testCasesPassed}/
                  {sub.totalTestCases})
                </span>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
