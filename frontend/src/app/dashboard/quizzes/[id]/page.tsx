'use client';

import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getQuizForTaking, submitQuiz, getQuizResult } from '@/lib/api/ai-mcqs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

export default function TakeQuizPage() {
  const params = useParams();
  const router = useRouter();
  const mcqSetId = params.id as string;

  const { data: quiz, isLoading } = useQuery({
    queryKey: ['quiz-for-taking', mcqSetId],
    queryFn: () => getQuizForTaking(mcqSetId),
    enabled: !!mcqSetId,
  });

  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [attemptId, setAttemptId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const { data: result, isLoading: resultLoading } = useQuery({
    queryKey: ['quiz-result', attemptId],
    queryFn: () => getQuizResult(attemptId!),
    enabled: !!attemptId,
  });

  const selectAnswer = (questionIndex: number, optionIndex: number) => {
    setSelectedAnswers((prev) => ({ ...prev, [questionIndex]: optionIndex }));
  };

  const allAnswered = quiz ? quiz.questions.every((_, i) => selectedAnswers[i] !== undefined) : false;

  const handleSubmit = async () => {
    if (!quiz) return;
    setSubmitError(null);
    setIsSubmitting(true);
    try {
      const orderedAnswers = quiz.questions.map((_, i) => selectedAnswers[i]);
      const attempt = await submitQuiz(mcqSetId, orderedAnswers);
      setAttemptId(attempt._id);
    } catch {
      setSubmitError('Failed to submit quiz. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading || !quiz) {
    return <Skeleton className="h-96 w-full" />;
  }

  // Once submitted, show the graded result view instead of the quiz form
  if (attemptId) {
    if (resultLoading || !result) {
      return <Skeleton className="h-96 w-full" />;
    }

    return (
      <div className="space-y-6">
        <Button variant="ghost" onClick={() => router.push('/dashboard/quizzes')}>
          ← Back to quizzes
        </Button>

        <Card>
          <CardHeader>
            <CardTitle>
              Score: {result.attempt.score} / {result.attempt.totalQuestions}
            </CardTitle>
          </CardHeader>
        </Card>

        {result.questions.map((q, i) => {
          const userAnswer = result.attempt.answers[i];
          return (
            <Card key={i}>
              <CardHeader>
                <CardTitle className="text-base">
                  {i + 1}. {q.question}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {q.options.map((option, optIndex) => {
                  const isCorrectOption = optIndex === q.correctAnswerIndex;
                  const isUserChoice = optIndex === userAnswer?.selectedIndex;

                  let style = 'border';
                  if (isCorrectOption) style = 'border-green-500 bg-green-50';
                  else if (isUserChoice && !isCorrectOption) style = 'border-red-500 bg-red-50';

                  return (
                    <div key={optIndex} className={`rounded-md p-2 text-sm ${style}`}>
                      {option}
                      {isCorrectOption && <span className="ml-2 text-green-600">✓ Correct</span>}
                      {isUserChoice && !isCorrectOption && (
                        <span className="ml-2 text-red-600">✗ Your answer</span>
                      )}
                    </div>
                  );
                })}
                <p className="text-sm text-muted-foreground pt-2">
                  <span className="font-medium">Explanation:</span> {q.explanation}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>
    );
  }

  // Quiz-taking view
  return (
    <div className="space-y-6">
      <Button variant="ghost" onClick={() => router.push('/dashboard/quizzes')}>
        ← Back to quizzes
      </Button>

      <div>
        <h1 className="text-2xl font-bold">{quiz.title}</h1>
        <p className="text-muted-foreground">
          {quiz.questions.length} questions · Answer all to submit
        </p>
      </div>

      {quiz.questions.map((q, i) => (
        <Card key={i}>
          <CardHeader>
            <CardTitle className="text-base">
              {i + 1}. {q.question}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {q.options.map((option, optIndex) => (
              <button
                key={optIndex}
                type="button"
                onClick={() => selectAnswer(i, optIndex)}
                className={`w-full rounded-md border p-2 text-left text-sm transition-colors ${
                  selectedAnswers[i] === optIndex
                    ? 'border-primary bg-primary/10'
                    : 'hover:bg-muted/50'
                }`}
              >
                {option}
              </button>
            ))}
          </CardContent>
        </Card>
      ))}

      {submitError && <p className="text-sm text-destructive">{submitError}</p>}

      <Button onClick={handleSubmit} disabled={!allAnswered || isSubmitting} className="w-full">
        {isSubmitting ? 'Submitting...' : 'Submit Quiz'}
      </Button>
    </div>
  );
}