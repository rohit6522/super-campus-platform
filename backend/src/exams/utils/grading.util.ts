// Standard 10-point grading scale — adjust thresholds to match your university's actual policy
export function calculateGrade(percentage: number): { grade: string; gradePoint: number } {
  if (percentage >= 90) return { grade: 'A+', gradePoint: 10 };
  if (percentage >= 80) return { grade: 'A', gradePoint: 9 };
  if (percentage >= 70) return { grade: 'B+', gradePoint: 8 };
  if (percentage >= 60) return { grade: 'B', gradePoint: 7 };
  if (percentage >= 50) return { grade: 'C', gradePoint: 6 };
  if (percentage >= 40) return { grade: 'D', gradePoint: 5 };
  return { grade: 'F', gradePoint: 0 };
}