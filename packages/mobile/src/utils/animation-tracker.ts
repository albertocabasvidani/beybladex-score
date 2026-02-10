import { logger } from './logger';

type AnimationPhase = 'mounted' | 'animating' | 'completing' | 'fading' | 'done';

interface TrackedAnimation {
  type: string;
  startedAt: number;
  phase: AnimationPhase;
  expectedDuration: number;
}

// Expected total durations per animation type (effect + fade)
const EXPECTED_DURATIONS: Record<string, number> = {
  spin: 1500,   // 1200ms effect + 300ms fade
  burst: 1900,  // 1600ms effect + 300ms fade
  over: 2600,   // 2300ms effect + 300ms fade
  xtreme: 1600, // 1300ms effect + 300ms fade
};

const STUCK_GRACE_MS = 3000;

let activeAnimation: { id: string; data: TrackedAnimation } | null = null;
let stuckCheckTimer: ReturnType<typeof setInterval> | null = null;

function checkStuck() {
  if (!activeAnimation) return;

  const elapsed = Date.now() - activeAnimation.data.startedAt;
  const threshold = activeAnimation.data.expectedDuration + STUCK_GRACE_MS;

  if (elapsed > threshold) {
    logger.error('Animation STUCK detected', {
      id: activeAnimation.id,
      type: activeAnimation.data.type,
      phase: activeAnimation.data.phase,
      elapsedMs: elapsed,
      thresholdMs: threshold,
    });
  }
}

function startStuckChecker() {
  if (stuckCheckTimer) return;
  stuckCheckTimer = setInterval(checkStuck, 3000);
}

function stopStuckChecker() {
  if (stuckCheckTimer) {
    clearInterval(stuckCheckTimer);
    stuckCheckTimer = null;
  }
}

export const animationTracker = {
  start(id: string, type: string) {
    const data: TrackedAnimation = {
      type,
      startedAt: Date.now(),
      phase: 'mounted',
      expectedDuration: EXPECTED_DURATIONS[type] ?? 3000,
    };
    activeAnimation = { id, data };
    startStuckChecker();
    logger.info('AnimTracker: start', { id, type });
  },

  phase(id: string, phase: AnimationPhase) {
    if (activeAnimation && activeAnimation.id === id) {
      activeAnimation.data.phase = phase;
      const elapsed = Date.now() - activeAnimation.data.startedAt;
      logger.debug('AnimTracker: phase', { id, phase, elapsedMs: elapsed });
    }
  },

  complete(id: string) {
    if (activeAnimation && activeAnimation.id === id) {
      const elapsed = Date.now() - activeAnimation.data.startedAt;
      logger.info('AnimTracker: complete', {
        id,
        type: activeAnimation.data.type,
        elapsedMs: elapsed,
      });
      activeAnimation = null;
      stopStuckChecker();
    }
  },

  getActive(): { id: string; type: string; elapsedMs: number; phase: AnimationPhase } | null {
    if (!activeAnimation) return null;
    return {
      id: activeAnimation.id,
      type: activeAnimation.data.type,
      elapsedMs: Date.now() - activeAnimation.data.startedAt,
      phase: activeAnimation.data.phase,
    };
  },

  isStuck(): boolean {
    if (!activeAnimation) return false;
    const elapsed = Date.now() - activeAnimation.data.startedAt;
    return elapsed > activeAnimation.data.expectedDuration + STUCK_GRACE_MS;
  },

  forceComplete() {
    if (activeAnimation) {
      logger.warn('AnimTracker: force complete', {
        id: activeAnimation.id,
        type: activeAnimation.data.type,
        phase: activeAnimation.data.phase,
      });
      activeAnimation = null;
      stopStuckChecker();
    }
  },
};
