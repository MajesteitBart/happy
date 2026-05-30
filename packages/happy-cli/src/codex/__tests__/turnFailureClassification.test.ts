import { describe, expect, it } from 'vitest';
import { classifyCodexTurnFailure } from '../turnFailureClassification';

describe('classifyCodexTurnFailure', () => {
  it('classifies provider rejection after a user abort as cancellation', () => {
    expect(classifyCodexTurnFailure({
      turnAbortGeneration: 2,
      currentAbortGeneration: 3,
      abortInProgress: false,
      turnSubmitted: true,
      providerStarted: true,
    })).toBe('user-abort');
  });

  it('classifies rejection during an in-flight abort as cancellation', () => {
    expect(classifyCodexTurnFailure({
      turnAbortGeneration: 2,
      currentAbortGeneration: 2,
      abortInProgress: true,
      turnSubmitted: true,
      providerStarted: true,
    })).toBe('user-abort');
  });

  it('classifies provider rejection before turn submission as launcher crash before delivery', () => {
    expect(classifyCodexTurnFailure({
      turnAbortGeneration: 2,
      currentAbortGeneration: 2,
      abortInProgress: false,
      turnSubmitted: false,
      providerStarted: false,
    })).toBe('launcher-crash-before-delivery');
  });

  it('classifies provider rejection after turn submission as delivered but not consumed', () => {
    expect(classifyCodexTurnFailure({
      turnAbortGeneration: 2,
      currentAbortGeneration: 2,
      abortInProgress: false,
      turnSubmitted: true,
      providerStarted: true,
    })).toBe('delivered-but-not-consumed');
  });

  it('classifies provider rejection after startup but before turn submission as unexpected exit', () => {
    expect(classifyCodexTurnFailure({
      turnAbortGeneration: 2,
      currentAbortGeneration: 2,
      abortInProgress: false,
      turnSubmitted: false,
      providerStarted: true,
    })).toBe('unexpected-exit');
  });
});
