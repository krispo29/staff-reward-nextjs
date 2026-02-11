"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";

interface SlotReelProps {
  currentDigit: number;
  isSpinning: boolean;
  isStopped: boolean;
  index: number;
}

export function SlotReel({
  currentDigit,
  isSpinning,
  isStopped,
  index,
}: SlotReelProps) {
  return (
    <div className="relative w-[60px] h-[90px] md:w-[80px] md:h-[110px] xl:w-[100px] xl:h-[130px] overflow-hidden rounded-xl border-2 border-white/20 bg-gradient-to-b from-slate-800 to-slate-900 shadow-lg shadow-blue-500/10">
      {/* Top gradient overlay */}
      <div className="absolute top-0 left-0 right-0 h-6 bg-gradient-to-b from-slate-800 to-transparent z-10 pointer-events-none" />
      {/* Bottom gradient overlay */}
      <div className="absolute bottom-0 left-0 right-0 h-6 bg-gradient-to-t from-slate-900 to-transparent z-10 pointer-events-none" />

      {/* Glow effect when stopped */}
      {isStopped && (
        <motion.div
          className="absolute inset-0 rounded-xl z-0"
          initial={{ opacity: 0 }}
          animate={{
            opacity: [0, 0.6, 0.3],
            boxShadow: [
              "inset 0 0 20px rgba(59, 130, 246, 0)",
              "inset 0 0 30px rgba(59, 130, 246, 0.5)",
              "inset 0 0 20px rgba(59, 130, 246, 0.2)",
            ],
          }}
          transition={{ duration: 0.5, delay: 0.1 }}
        />
      )}

      {/* Digit display */}
      <div className="absolute inset-0 flex items-center justify-center z-5">
        <AnimatePresence mode="popLayout">
          <motion.span
            key={`${index}-${currentDigit}-${isSpinning}`}
            className={`text-5xl md:text-6xl xl:text-7xl font-black tabular-nums select-none ${
              isStopped
                ? "text-transparent bg-clip-text bg-gradient-to-b from-yellow-300 via-yellow-400 to-amber-500 drop-shadow-[0_0_15px_rgba(250,204,21,0.4)]"
                : "text-white/80"
            }`}
            initial={
              isSpinning
                ? { y: -30, opacity: 0, scale: 0.8 }
                : { scale: 1.3, opacity: 0 }
            }
            animate={
              isSpinning
                ? { y: 0, opacity: 1, scale: 1 }
                : { scale: 1, opacity: 1 }
            }
            exit={
              isSpinning
                ? { y: 30, opacity: 0, scale: 0.8 }
                : { scale: 0.8, opacity: 0 }
            }
            transition={
              isSpinning
                ? { duration: 0.05, ease: "linear" }
                : { type: "spring", stiffness: 300, damping: 20 }
            }
          >
            {currentDigit}
          </motion.span>
        </AnimatePresence>
      </div>

      {/* Side light bars */}
      <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-gradient-to-b from-transparent via-blue-400/30 to-transparent" />
      <div className="absolute right-0 top-0 bottom-0 w-[2px] bg-gradient-to-b from-transparent via-blue-400/30 to-transparent" />
    </div>
  );
}
