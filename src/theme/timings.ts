/**
 * The timings for animations.
 */
export const timings = {
  /**
   * The duration (ms) for immediate animations.
   */
  immediate: 0,

  /**
   * The duration (ms) for quick animations.
   */
  quick: 250,

  /**
   * The duration (ms) for normal animations.
   */
  normal: 500,

  /**
   * The duration (ms) for slow animations.
   */
  slow: 1000,

  /**
   * The duration (ms) for very slow animations.
   */
  verySlow: 2000,
};

/**
 * The timings for animations.
 */
export type Timings = keyof typeof timings;
