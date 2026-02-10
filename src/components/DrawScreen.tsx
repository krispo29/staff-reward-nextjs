"use client";

import React, { useCallback } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { SlotMachine } from "@/components/SlotMachine";
import { DrawCounter } from "@/components/DrawCounter";
import { WinnerReveal } from "@/components/WinnerReveal";
import { WinnersList } from "@/components/WinnersList";
import { useDrawStore } from "@/store/drawStore";
import { useSlotAnimation } from "@/hooks/useSlotAnimation";
import { PlayCircle, FastForwardCircle, ArrowCounterClockwise, Confetti } from "@phosphor-icons/react";

export function DrawScreen() {
  const {
    drawStatus,
    currentDraw,
    maxDraws,
    currentWinner,
    winners,
    settings,
    drawWinner,
    revealWinner,
    nextDraw,
    reset,
  } = useDrawStore();

  const onAnimationComplete = useCallback(() => {
    revealWinner();
  }, [revealWinner]);

  const { reels, isAnimating, startAnimation, resetAnimation } =
    useSlotAnimation(onAnimationComplete);

  const handleDraw = useCallback(() => {
    drawWinner();
    const state = useDrawStore.getState();
    if (state.currentWinner) {
      startAnimation(state.currentWinner.id, settings.animationSpeed);
    }
  }, [drawWinner, startAnimation, settings.animationSpeed]);

  const handleNext = useCallback(() => {
    resetAnimation();
    nextDraw();
  }, [resetAnimation, nextDraw]);

  const handleReset = useCallback(() => {
    resetAnimation();
    reset();
  }, [resetAnimation, reset]);

  const isCompleted = drawStatus === "completed";
  const isRevealed = drawStatus === "revealed" || isCompleted;
  const isIdle = drawStatus === "idle" && !isAnimating;

  return (
    <div className="flex flex-col lg:flex-row items-center lg:items-start gap-6 lg:gap-10 w-full max-w-7xl mx-auto">
      {/* Main draw area */}
      <div className="flex-1 flex flex-col items-center gap-6 md:gap-8">
        {/* Draw counter */}
        <DrawCounter currentDraw={currentDraw} maxDraws={maxDraws} />

        {/* Slot Machine */}
        <SlotMachine reels={reels} isAnimating={isAnimating} />

        {/* Winner reveal */}
        <WinnerReveal winner={currentWinner} isRevealed={isRevealed} />

        {/* Action buttons */}
        <motion.div
          className="flex flex-col sm:flex-row items-center gap-4 mt-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          {isIdle && !isCompleted && (
            <Button
              onClick={handleDraw}
              className="h-16 md:h-20 px-10 md:px-14 text-xl md:text-2xl font-bold rounded-2xl bg-gradient-to-r from-yellow-500 via-amber-500 to-orange-500 hover:from-yellow-400 hover:via-amber-400 hover:to-orange-400 text-white shadow-2xl shadow-amber-500/30 hover:shadow-amber-500/50 transition-all duration-300 border-0 cursor-pointer"
            >
              <PlayCircle weight="duotone" className="w-7 h-7 mr-2" />
              จับรางวัล
            </Button>
          )}

          {isRevealed && !isCompleted && (
            <Button
              onClick={handleNext}
              className="h-16 md:h-20 px-10 md:px-14 text-xl md:text-2xl font-bold rounded-2xl bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-400 hover:to-indigo-400 text-white shadow-2xl shadow-blue-500/30 hover:shadow-blue-500/50 transition-all duration-300 border-0 cursor-pointer"
            >
              <FastForwardCircle weight="duotone" className="w-7 h-7 mr-2" />
              จับรางวัลถัดไป
            </Button>
          )}

          {isCompleted && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center gap-4"
            >
              <div className="flex items-center gap-2 px-8 py-4 rounded-2xl bg-gradient-to-r from-emerald-500/20 to-teal-500/20 border border-emerald-400/30">
                <Confetti weight="duotone" className="w-8 h-8 text-emerald-400" />
                <span className="text-2xl md:text-3xl font-bold text-emerald-400">
                  จับรางวัลครบทุกรางวัลแล้ว!
                </span>
              </div>
              <Button
                onClick={handleReset}
                variant="outline"
                className="h-14 px-8 text-lg font-semibold rounded-xl border-white/20 text-white hover:bg-white/10 cursor-pointer"
              >
                <ArrowCounterClockwise weight="duotone" className="w-5 h-5 mr-2" />
                เริ่มใหม่
              </Button>
            </motion.div>
          )}
        </motion.div>
      </div>

      {/* Winners sidebar */}
      {winners.length > 0 && (
        <div className="w-full lg:w-80 xl:w-96">
          <WinnersList winners={winners} />
        </div>
      )}
    </div>
  );
}
