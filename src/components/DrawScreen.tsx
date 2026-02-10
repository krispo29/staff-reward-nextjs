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
import { soundManager } from "@/lib/audioUtils";
import {
  PlayCircle,
  FastForwardCircle,
  ArrowCounterClockwise,
  Confetti,
  CheckCircle,
  XCircle,
  WarningCircle,
  ListMagnifyingGlass,
} from "@phosphor-icons/react";
import { EntrantsModal } from "./EntrantsModal";
import { FlagThai, FlagMyanmar } from "@/components/icons/Flags";

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
  } = useDrawStore();

  const [showEntrantsModal, setShowEntrantsModal] = React.useState(false);

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

  const handleDraw = useCallback(() => {
    drawWinner();
    const state = useDrawStore.getState();
    if (state.currentWinner) {
      soundManager.startAmbientHum();
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
  const isRevealed = drawStatus === "revealed";
  const isConfirmed = drawStatus === "confirmed";
  const isShowWinner = isRevealed || isConfirmed || isCompleted;
  const isIdle = drawStatus === "idle" && !isAnimating;

  return (
    <div className="flex flex-col lg:flex-row items-center lg:items-start gap-6 lg:gap-10 w-full max-w-7xl mx-auto">
      {/* Main draw area */}
      <div className="flex-1 flex flex-col items-center gap-6 md:gap-8">
        {/* Draw counter */}
        <DrawCounter currentDraw={currentDraw} maxDraws={maxDraws} />

        {/* Quota Counter */}
        <div className="flex gap-4 text-sm font-medium">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-300">
            <FlagThai className="w-5 h-auto rounded-[2px]" />
            <span>ไทย:</span>
            <span className="font-bold">
              {winners.filter((w) => (w.nationality || "Thai") === "Thai").length} / {settings.quotas.Thai}
            </span>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-300">
            <FlagMyanmar className="w-5 h-auto rounded-[2px]" />
            <span>พม่า:</span>
            <span className="font-bold">
              {winners.filter((w) => w.nationality === "Myanmar").length} / {settings.quotas.Myanmar}
            </span>
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

        {/* Winner reveal */}
        <WinnerReveal winner={currentWinner} isRevealed={isShowWinner} />

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
                onClick={handleDraw}
                disabled={!!error}
                className="h-16 md:h-20 px-10 md:px-14 text-xl md:text-2xl font-bold rounded-2xl bg-gradient-to-r from-yellow-500 via-amber-500 to-orange-500 hover:from-yellow-400 hover:via-amber-400 hover:to-orange-400 text-white shadow-2xl shadow-amber-500/30 hover:shadow-amber-500/50 transition-all duration-300 border-0 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <PlayCircle weight="duotone" className="w-7 h-7 mr-2" />
                จับรางวัล
              </Button>
            </div>
          )}

          {isRevealed && (
            <div className="flex gap-4">
              <Button
                onClick={rejectWinner}
                className="h-16 md:h-20 px-8 text-xl font-bold rounded-2xl bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/50 hover:border-red-400 transition-all duration-300 cursor-pointer"
              >
                <XCircle weight="duotone" className="w-7 h-7 mr-2" />
                สละสิทธิ์
              </Button>
              <Button
                onClick={acceptWinner}
                className="h-16 md:h-20 px-10 text-xl font-bold rounded-2xl bg-green-500 hover:bg-green-600 text-white shadow-lg shadow-green-500/20 transition-all duration-300 cursor-pointer"
              >
                <CheckCircle weight="duotone" className="w-7 h-7 mr-2" />
                รับรางวัล
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
        <div className="w-full lg:w-80 xl:w-96">
          <WinnersList winners={winners} />
        </div>
      )}
    </div>
  );
}
