import { describe, expect, it } from 'vitest';
import { classifyCodexTurnFailure } from '../turnFailureClassification';

describe('classifyCodexTurnFailure', () => {
  it('classifies provider rejection after a user abort as cancellation', () => {
    expect(classifyCodexTurnFailure({
      turnAbortGeneration: 2,
      currentAbortGeneration: 3,
      abortInProgress: false,
    })).toBe('user-abort');
  });

  it('classifies rejection during an in-flight abort as cancellation', () => {
    expect(classifyCodexTurnFailure({
      turnAbortGeneration: 2,
      currentAbortGeneration: 2,
      abortInProgress: true,
    })).toBe('user-abort');
  });

  it('classifies provider rejection without an abort as unexpected exit', () => {
    expect(classifyCodexTurnFailure({
      turnAbortGeneration: 2,
      currentAbortGeneration: 2,
      abortInProgress: false,
    })).toBe('unexpected-exit');
  });
});
