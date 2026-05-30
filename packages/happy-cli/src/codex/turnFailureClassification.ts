export type CodexTurnFailureClassification = 'user-abort' | 'unexpected-exit';

export function classifyCodexTurnFailure(input: {
  turnAbortGeneration: number;
  currentAbortGeneration: number;
  abortInProgress: boolean;
}): CodexTurnFailureClassification {
  if (input.abortInProgress || input.currentAbortGeneration > input.turnAbortGeneration) {
    return 'user-abort';
  }
  return 'unexpected-exit';
}
