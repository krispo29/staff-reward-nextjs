"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { ANIMATION_CONFIG } from "@/lib/animationConfig";
import { getDigitsFromId } from "@/lib/drawLogic";

export interface ReelState {
  currentDigit: number;
  isSpinning: boolean;
  isStopped: boolean;
  finalDigit: number;
}

interface UseSlotAnimationReturn {
  reels: ReelState[];
  isAnimating: boolean;
  startAnimation: (targetId: string, speedMultiplier?: number) => void;
  resetAnimation: () => void;
}

const initialReelState = (): ReelState => ({
  currentDigit: 0,
  isSpinning: false,
  isStopped: false,
  finalDigit: 0,
});

export function useSlotAnimation(
  onComplete?: () => void
): UseSlotAnimationReturn {
  const [reels, setReels] = useState<ReelState[]>(
    Array.from({ length: ANIMATION_CONFIG.REEL_COUNT }, initialReelState)
  );
  const [isAnimating, setIsAnimating] = useState(false);
  const intervalsRef = useRef<NodeJS.Timeout[]>([]);
  const timeoutsRef = useRef<NodeJS.Timeout[]>([]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      intervalsRef.current.forEach(clearInterval);
      timeoutsRef.current.forEach(clearTimeout);
    };
  }, []);

  const clearAllTimers = useCallback(() => {
    intervalsRef.current.forEach(clearInterval);
    timeoutsRef.current.forEach(clearTimeout);
    intervalsRef.current = [];
    timeoutsRef.current = [];
  }, []);

  const startAnimation = useCallback(
    (targetId: string, speedMultiplier: number = 1) => {
      clearAllTimers();
      const targetDigits = getDigitsFromId(targetId);
      setIsAnimating(true);

      // Start all reels spinning
      setReels(
        Array.from({ length: ANIMATION_CONFIG.REEL_COUNT }, (_, i) => ({
          currentDigit: Math.floor(Math.random() * 10),
          isSpinning: true,
          isStopped: false,
          finalDigit: targetDigits[i],
        }))
      );

      // Spin interval - randomize digits while spinning
      const spinInterval = ANIMATION_CONFIG.SPIN_INTERVAL / speedMultiplier;

      for (let i = 0; i < ANIMATION_CONFIG.REEL_COUNT; i++) {
        const interval = setInterval(() => {
          setReels((prev) => {
            const newReels = [...prev];
            if (newReels[i].isSpinning && !newReels[i].isStopped) {
              newReels[i] = {
                ...newReels[i],
                currentDigit: Math.floor(Math.random() * 10),
              };
            }
            return newReels;
          });
        }, spinInterval);
        intervalsRef.current.push(interval);

        // Schedule each reel to stop with stagger delay (Reverse: Right to Left)
        const reverseIndex = ANIMATION_CONFIG.REEL_COUNT - 1 - i;
        const stopDelay =
          (ANIMATION_CONFIG.SPIN_DURATION +
            reverseIndex * ANIMATION_CONFIG.STAGGER_DELAY) /
          speedMultiplier;

        const timeout = setTimeout(() => {
          // Clear the spin interval for this reel
          clearInterval(intervalsRef.current[i]);

          setReels((prev) => {
            const newReels = [...prev];
            newReels[i] = {
              ...newReels[i],
              currentDigit: targetDigits[i],
              isSpinning: false,
              isStopped: true,
            };
            return newReels;
          });

          // Check if all reels are stopped (index 0 is the last one to stop now)
          if (i === 0) {
            const completeTimeout = setTimeout(() => {
              setIsAnimating(false);
              onComplete?.();
            }, ANIMATION_CONFIG.REVEAL_DELAY / speedMultiplier);
            timeoutsRef.current.push(completeTimeout);
          }
        }, stopDelay);
        timeoutsRef.current.push(timeout);
      }
    },
    [clearAllTimers, onComplete]
  );

  const resetAnimation = useCallback(() => {
    clearAllTimers();
    setIsAnimating(false);
    setReels(
      Array.from({ length: ANIMATION_CONFIG.REEL_COUNT }, initialReelState)
    );
  }, [clearAllTimers]);

  return { reels, isAnimating, startAnimation, resetAnimation };
}
