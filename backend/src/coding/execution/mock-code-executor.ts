import { Injectable } from '@nestjs/common';
import { CodeExecutor, ExecutionResult } from './code-executor.interface.js';

/**
 * MOCK EXECUTOR — does not actually run any code.
 *
 * Per project security rules, we never execute untrusted user code directly
 * on the main backend server. This stub exists so the full submission flow
 * (API, DB, verdict tracking) can be built and tested end-to-end now.
 *
 * TODO: Replace with a real sandboxed executor (e.g. Judge0 API, or a
 * Docker-isolated worker service) — implement CodeExecutor and swap it
 * in via the CODING_EXECUTOR provider token, no other code needs to change.
 */
@Injectable()
export class MockCodeExecutor implements CodeExecutor {
  async execute(code: string, language: string, input: string): Promise<ExecutionResult> {
    // Always reports success with the input echoed back — clearly a placeholder,
    // not a real evaluation. Swap this implementation, not its callers.
    return {
      passed: true,
      actualOutput: input,
    };
  }
}