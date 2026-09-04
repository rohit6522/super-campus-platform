export interface ExecutionResult {
  passed: boolean;
  actualOutput: string;
  error?: string;
}

export interface CodeExecutor {
  execute(code: string, language: string, input: string): Promise<ExecutionResult>;
}