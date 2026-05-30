export type CodexTurnFailureClassification =
  | 'user-abort'
  | 'launcher-crash-before-delivery'
  | 'delivered-but-not-consumed'
  | 'unexpected-exit';

export function classifyCodexTurnFailure(input: {
  turnAbortGeneration: number;
  currentAbortGeneration: number;
  abortInProgress: boolean;
  turnSubmitted: boolean;
  providerStarted: boolean;
}): CodexTurnFailureClassification {
  if (input.abortInProgress || input.currentAbortGeneration > input.turnAbortGeneration) {
    return 'user-abort';
  }
  if (input.turnSubmitted) {
    return 'delivered-but-not-consumed';
  }
  if (input.providerStarted) {
    return 'unexpected-exit';
  }
  return 'launcher-crash-before-delivery';
}
