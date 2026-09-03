export interface EligibilityCheckInput {
  studentCGPA: number;
  studentBranchCode: string;
  studentBacklogs: number;
  studentGraduationYear: number;
  drive: {
    minCGPA: number;
    allowedBranches: string[];
    maxBacklogs: number;
    graduationYear: number;
  };
}

export interface EligibilityReason {
  criterion: string;
  required: string;
  actual: string;
  passed: boolean;
}

export interface EligibilityResult {
  eligible: boolean;
  reasons: EligibilityReason[];
}

export function checkEligibility(input: EligibilityCheckInput): EligibilityResult {
  const reasons: EligibilityReason[] = [];

  const cgpaPassed = input.studentCGPA >= input.drive.minCGPA;
  reasons.push({
    criterion: 'CGPA',
    required: `>= ${input.drive.minCGPA}`,
    actual: String(input.studentCGPA),
    passed: cgpaPassed,
  });

  const branchPassed = input.drive.allowedBranches.includes(input.studentBranchCode);
  reasons.push({
    criterion: 'Branch',
    required: input.drive.allowedBranches.join(', '),
    actual: input.studentBranchCode,
    passed: branchPassed,
  });

  const backlogsPassed = input.studentBacklogs <= input.drive.maxBacklogs;
  reasons.push({
    criterion: 'Backlogs',
    required: `<= ${input.drive.maxBacklogs}`,
    actual: String(input.studentBacklogs),
    passed: backlogsPassed,
  });

  const graduationYearPassed = input.studentGraduationYear === input.drive.graduationYear;
  reasons.push({
    criterion: 'Graduation Year',
    required: String(input.drive.graduationYear),
    actual: String(input.studentGraduationYear),
    passed: graduationYearPassed,
  });

  const eligible = reasons.every((r) => r.passed);

  return { eligible, reasons };
}