/**
 * Animation timing configuration for the slot machine.
 * All durations are in milliseconds.
 */

export const ANIMATION_CONFIG = {
  /** Duration each reel spins before starting to decelerate */
  SPIN_DURATION: 2000,

  /** Delay between each reel stopping (stagger effect) */
  STAGGER_DELAY: 400,

  /** How fast digits change during spinning (ms per digit change) */
  SPIN_INTERVAL: 50,

  /** Duration of the deceleration phase for each reel */
  DECELERATION_DURATION: 500,

  /** Total number of digit reels */
  REEL_COUNT: 7,

  /** Easing for the final landing animation */
  LANDING_EASE: [0.25, 0.1, 0.25, 1.0] as const,

  /** Duration of the celebration after reveal (ms) */
  CELEBRATION_DURATION: 3000,

  /** Confetti particle count */
  CONFETTI_PARTICLES: 150,

  /** Delay before showing winner details after reveal */
  REVEAL_DELAY: 500,
} as const;

/**
 * Calculate total animation duration based on reel count and stagger.
 */
export function getTotalAnimationDuration(speedMultiplier: number = 1): number {
  const { SPIN_DURATION, STAGGER_DELAY, REEL_COUNT, DECELERATION_DURATION } =
    ANIMATION_CONFIG;
  const totalStagger = STAGGER_DELAY * (REEL_COUNT - 1);
  return (SPIN_DURATION + totalStagger + DECELERATION_DURATION) / speedMultiplier;
}
