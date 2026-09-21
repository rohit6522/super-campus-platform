"use client";

import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useStudentProfile } from "@/hooks/queries/use-student-dashboard";
import {
  generateStudyPlan,
  getMyStudyPlans,
  StudyPlan,
} from "@/lib/api/study-planner";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";

const priorityColors: Record<string, string> = {
  HIGH: "bg-red-50 text-red-700",
  MEDIUM: "bg-amber-50 text-amber-700",
  LOW: "bg-green-50 text-green-700",
};

const dayOrder = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

export default function StudyPlannerPage() {
  const { data: profile } = useStudentProfile();
  const { data: pastPlans, refetch } = useQuery({
    queryKey: ["study-plans"],
    queryFn: getMyStudyPlans,
  });

  const [hours, setHours] = useState("4");
  const [weakTopicsInput, setWeakTopicsInput] = useState("");
  const [currentPlan, setCurrentPlan] = useState<StudyPlan | null>(null);
  const [error, setError] = useState<string | null>(null);

  const generateMutation = useMutation({
    mutationFn: generateStudyPlan,
    onSuccess: (plan) => {
      setCurrentPlan(plan);
      refetch();
    },
  });

  const handleGenerate = async () => {
    if (!profile) return;
    setError(null);
    try {
      await generateMutation.mutateAsync({
        departmentId: profile.departmentId._id,
        semester: profile.semester,
        availableHoursPerDay: parseInt(hours, 10),
        weakTopics: weakTopicsInput
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean),
      });
    } catch {
      setError("Failed to generate study plan. Please try again.");
    }
  };

  const displayPlan = currentPlan ?? pastPlans?.[0];

  const groupedByDay = dayOrder.map((day) => ({
    day,
    tasks: displayPlan?.dailySchedule.filter((t) => t.day === day) ?? [],
  }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">AI Exam Study Planner</h1>
        <p className="text-muted-foreground">
          Get a personalized 7-day study schedule based on your subjects and
          upcoming exams
        </p>
      </div>

      <Card>
        <CardContent className="space-y-4 pt-6">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label>Available Hours Per Day</Label>
              <Input
                type="number"
                min={1}
                max={16}
                value={hours}
                onChange={(e) => setHours(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Weak Topics (comma-separated, optional)</Label>
            <Input
              value={weakTopicsInput}
              onChange={(e) => setWeakTopicsInput(e.target.value)}
              placeholder="e.g. Dynamic Programming, Database Normalization"
            />
            <p className="text-xs text-muted-foreground">
              Leave blank to get a balanced plan across all your subjects.
            </p>
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}
          <Button
            onClick={handleGenerate}
            disabled={!profile || generateMutation.isPending}
          >
            {generateMutation.isPending
              ? "Generating..."
              : "Generate Study Plan"}
          </Button>
        </CardContent>
      </Card>

      {generateMutation.isPending && (
        <Card>
          <CardContent className="pt-6">
            <Skeleton className="h-64 w-full" />
            <p className="mt-2 text-center text-sm text-muted-foreground">
              Analyzing your subjects and exams...
            </p>
          </CardContent>
        </Card>
      )}

      {displayPlan && !generateMutation.isPending && (
        <>
          <Card>
            <CardContent className="pt-6">
              <h2 className="font-semibold mb-2">Strategy Overview</h2>
              <p className="text-sm text-muted-foreground">
                {displayPlan.summary}
              </p>

              {displayPlan.priorityTopics.length > 0 && (
                <div className="mt-4">
                  <p className="text-sm font-medium mb-2">Priority Topics</p>
                  <div className="flex flex-wrap gap-2">
                    {displayPlan.priorityTopics.map((topic) => (
                      <span
                        key={topic}
                        className="rounded-full bg-muted px-3 py-1 text-xs"
                      >
                        {topic}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <div className="space-y-3">
            {groupedByDay.map(({ day, tasks }) => (
              <Card key={day}>
                <CardContent className="pt-6">
                  <h3 className="font-semibold mb-2">{day}</h3>
                  {tasks.length > 0 ? (
                    <div className="space-y-2">
                      {tasks.map((task, i) => (
                        <div
                          key={i}
                          className="flex items-center justify-between rounded-md border p-3 text-sm"
                        >
                          <div>
                            <p className="font-medium">
                              {task.subject} — {task.topic}
                            </p>
                            <p className="text-muted-foreground">
                              {task.durationMinutes} minutes
                            </p>
                          </div>
                          <span
                            className={`rounded-full px-2 py-0.5 text-xs ${priorityColors[task.priority] ?? ""}`}
                          >
                            {task.priority}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      No tasks scheduled.
                    </p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
