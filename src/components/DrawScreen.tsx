"use client";

import React, { useCallback } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { SlotMachine } from "@/components/SlotMachine";
import { DrawCounter } from "@/components/DrawCounter";
import { WinnersList } from "@/components/WinnersList";
import { WinnerModal } from "@/components/WinnerModal";
import { useDrawStore } from "@/store/drawStore";
import { useSlotAnimation } from "@/hooks/useSlotAnimation";
import { soundManager } from "@/lib/audioUtils";
import {
  PlayCircle,
  FastForwardCircle,
  ArrowCounterClockwise,
  Confetti,
  XCircle,
  WarningCircle,
  ListMagnifyingGlass,
  CircleNotch,
} from "@phosphor-icons/react";
import { EntrantsModal } from "./EntrantsModal";

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
    acceptWinner,
    rejectWinner,
    nextDraw,
    reset,
    error,
    clearError,
    isLoading,
  } = useDrawStore();

  const [showEntrantsModal, setShowEntrantsModal] = React.useState(false);
  const [showQuotaTooltip, setShowQuotaTooltip] = React.useState(false);

  // Sync sound setting
  React.useEffect(() => {
    soundManager.setEnabled(settings.soundEnabled);
  }, [settings.soundEnabled]);

  const onAnimationComplete = useCallback(() => {
    revealWinner();
    soundManager.stopAmbientHum();
    soundManager.playWin();
  }, [revealWinner]);

  const onTick = useCallback(() => {
    soundManager.playSpin();
  }, []);

  const onReelStop = useCallback(() => {
    soundManager.playReelStop();
  }, []);

  const { reels, isAnimating, startAnimation, resetAnimation } =
    useSlotAnimation(onAnimationComplete, onTick, onReelStop);

  const handleDraw = useCallback(async () => {
    clearError(); // Clear any previous error before trying again
    await drawWinner();
    const state = useDrawStore.getState();
    if (state.currentWinner) {
      soundManager.startAmbientHum();
      startAnimation(state.currentWinner.id, settings.animationSpeed);
    }
  }, [drawWinner, startAnimation, settings.animationSpeed, clearError]);

  const handleNext = useCallback(() => {
    resetAnimation();
    nextDraw();
  }, [resetAnimation, nextDraw]);

  const handleReset = useCallback(() => {
    resetAnimation();
    reset();
  }, [resetAnimation, reset]);

  const isCompleted = drawStatus === "completed";
  const isRevealed = drawStatus === "revealed";
  const isConfirmed = drawStatus === "confirmed";
  const isShowWinner = isRevealed || isConfirmed || isCompleted;
  const isIdle = drawStatus === "idle" && !isAnimating;

  return (
    <div className="flex flex-col lg:flex-row items-center lg:items-start gap-6 lg:gap-8 w-full max-w-7xl mx-auto px-4 overflow-hidden">
      {/* Main draw area */}
      <div className="flex-1 min-w-0 flex flex-col items-center gap-6 md:gap-8">
        {/* Header */}
        <div className="flex flex-col items-center">
          <h1 className="text-3xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-amber-400 to-yellow-300 drop-shadow-sm">
            NEW YEAR PARTY
          </h1>
          <p className="text-blue-200/60 text-sm tracking-widest font-medium">STAFF REWARD 2026</p>
        </div>

        {/* Draw counter */}
        <DrawCounter currentDraw={currentDraw} maxDraws={maxDraws} />

        {/* Quota Counter */}
        <div className="flex gap-4 text-sm font-medium">
          <div
            className="relative"
            onMouseEnter={() => setShowQuotaTooltip(true)}
            onMouseLeave={() => setShowQuotaTooltip(false)}
          >
            <button
              type="button"
              onClick={() => setShowQuotaTooltip((v) => !v)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 hover:bg-purple-500/20 transition-colors cursor-pointer"
            >
              <span className="font-bold">Department Quota Active</span>
              <svg xmlns="http://www.w3.org/2000/svg" className={`w-3.5 h-3.5 transition-transform ${showQuotaTooltip ? 'rotate-180' : ''}`} viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
              </svg>
            </button>

            {/* Tooltip dropdown */}
            {showQuotaTooltip && (
              <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 z-50 min-w-[220px] p-3 rounded-xl bg-gray-900/95 border border-purple-500/30 shadow-2xl shadow-purple-500/10 backdrop-blur-xl">
                <div className="text-xs text-purple-300/70 font-semibold uppercase tracking-wider mb-2 text-center">Department Quotas</div>
                <div className="space-y-1.5">
                  {Object.entries(settings.quotas).map(([dept, pct]) => (
                    <div key={dept} className="flex items-center justify-between gap-4">
                      <span className="text-white/80 text-sm truncate">{dept}</span>
                      <div className="flex items-center gap-2 shrink-0">
                        <div className="w-16 h-1.5 rounded-full bg-white/10 overflow-hidden">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-purple-400 to-pink-400"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                        <span className="text-purple-300 text-xs font-bold w-8 text-right">{pct}%</span>
                      </div>
                    </div>
                  ))}
                </div>
                {/* Arrow pointer */}
                <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3 h-3 rotate-45 bg-gray-900/95 border-l border-t border-purple-500/30" />
              </div>
            )}
          </div>

          <button
            onClick={() => setShowEntrantsModal(true)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-white/70 hover:bg-white/10 hover:text-white transition-colors cursor-pointer"
          >
            <ListMagnifyingGlass weight="bold" className="w-4 h-4" />
            <span>ตรวจสอบรายชื่อ</span>
          </button>
        </div>

        {/* Slot Machine */}
        <SlotMachine reels={reels} isAnimating={isAnimating} />

        {/* Winner Modal */}
        <WinnerModal
          isOpen={isRevealed}
          winner={currentWinner}
          onAccept={acceptWinner}
          onReject={rejectWinner}
        />

        <EntrantsModal
          isOpen={showEntrantsModal}
          onClose={() => setShowEntrantsModal(false)}
        />

        {/* Action buttons */}
        <motion.div
          className="flex flex-col sm:flex-row items-center gap-4 mt-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          {error && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute -top-16 left-1/2 -translate-x-1/2 w-max max-w-[90vw] px-4 py-2 rounded-lg bg-red-500/90 text-white text-sm font-medium shadow-lg backdrop-blur-sm z-50 flex items-center gap-2"
            >
              <WarningCircle weight="fill" className="w-5 h-5 flex-shrink-0" />
              {error}
              <button onClick={clearError} className="ml-2 opacity-80 hover:opacity-100">
                <XCircle weight="fill" className="w-4 h-4" />
              </button>
            </motion.div>
          )}

          {isIdle && !isCompleted && (
            <div className="relative">
              <Button
                onClick={() => {
                  clearError();
                  handleDraw();
                }}
                disabled={isLoading}
                className="h-16 md:h-20 px-10 md:px-14 text-xl md:text-2xl font-bold rounded-2xl bg-gradient-to-r from-yellow-500 via-amber-500 to-orange-500 hover:from-yellow-400 hover:via-amber-400 hover:to-orange-400 text-white shadow-2xl shadow-amber-500/30 hover:shadow-amber-500/50 transition-all duration-300 border-0 cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <CircleNotch weight="bold" className="w-7 h-7 mr-2 animate-spin" />
                    กำลังจับรางวัล...
                  </>
                ) : (
                  <>
                    <PlayCircle weight="duotone" className="w-7 h-7 mr-2" />
                    จับรางวัล
                  </>
                )}
              </Button>
            </div>
          )}

          {isConfirmed && !isCompleted && (
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
        <div className="w-full lg:w-72 xl:w-80 lg:shrink-0">
          <WinnersList winners={winners} />
        </div>
      )}
    </div>
  );
}
