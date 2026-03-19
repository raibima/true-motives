import 'server-only';

export const INVESTIGATION_PHASE_TRACKING = {
  // Treat a typical investigation as spending roughly this many research
  // tool calls across all planned phases.
  //
  // Higher values slow phase advancement because each phase gets a larger
  // share of the total call budget. Lower values make phases advance sooner.
  targetResearchCalls: 24,
  // Prevent very short phases when many phases are planned.
  //
  // Higher values force each phase to stay active for more tool calls.
  // Lower values allow faster transitions, especially with many phases.
  minCallsPerPhase: 2,
  // Used when no phases are configured; phase tracking is effectively off,
  // but this preserves the fallback math contract.
  //
  // Higher values would matter only if phase-less tracking logic is added
  // later; lower values keep the fallback behavior minimal.
  fallbackCallsPerPhase: 1,
} as const;

export function getCallsPerPhase(phaseCount: number) {
  if (phaseCount <= 0) {
    return INVESTIGATION_PHASE_TRACKING.fallbackCallsPerPhase;
  }

  return Math.max(
    INVESTIGATION_PHASE_TRACKING.minCallsPerPhase,
    Math.ceil(INVESTIGATION_PHASE_TRACKING.targetResearchCalls / phaseCount),
  );
}

export function getTargetPhaseIndex(
  researchCallCount: number,
  phaseCount: number,
  callsPerPhase: number,
) {
  return Math.min(phaseCount - 1, Math.floor((researchCallCount - 1) / callsPerPhase));
}
