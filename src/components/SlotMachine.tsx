"use client";

import React from "react";
import { motion } from "framer-motion";
import { SlotReel } from "./SlotReel";
import { ReelState } from "@/hooks/useSlotAnimation";

interface SlotMachineProps {
  reels: ReelState[];
  isAnimating: boolean;
}

export function SlotMachine({ reels, isAnimating }: SlotMachineProps) {
  return (
    <div className="flex flex-col items-center gap-4">
      {/* Machine frame */}
      <motion.div
        className="relative p-3 md:p-4 lg:p-6 rounded-2xl bg-gradient-to-b from-slate-700/50 to-slate-800/50 border border-white/10 backdrop-blur-sm shadow-2xl"
        animate={
          isAnimating
            ? {
                boxShadow: [
                  "0 0 20px rgba(59, 130, 246, 0.1)",
                  "0 0 40px rgba(59, 130, 246, 0.3)",
                  "0 0 20px rgba(59, 130, 246, 0.1)",
                ],
              }
            : {}
        }
        transition={{
          duration: 1.5,
          repeat: isAnimating ? Infinity : 0,
          ease: "easeInOut",
        }}
      >
        {/* Label */}
        <div className="text-center mb-3 md:mb-4">
          <span className="text-sm md:text-base text-blue-300/70 font-medium tracking-widest uppercase">
            Employee ID
          </span>
        </div>

        {/* Reels container */}
        <div className="flex gap-2 md:gap-3 lg:gap-4">
          {reels.map((reel, index) => (
            <SlotReel
              key={index}
              index={index}
              currentDigit={reel.currentDigit}
              isSpinning={reel.isSpinning}
              isStopped={reel.isStopped}
            />
          ))}
        </div>

        {/* Bottom bar */}
        <div className="mt-3 md:mt-4 h-1 rounded-full bg-gradient-to-r from-transparent via-blue-500/50 to-transparent" />
      </motion.div>
    </div>
  );
}
