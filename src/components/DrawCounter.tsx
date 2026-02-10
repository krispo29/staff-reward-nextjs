"use client";

import React from "react";
import { motion } from "framer-motion";
import { Progress } from "@/components/ui/progress";

interface DrawCounterProps {
  currentDraw: number;
  maxDraws: number;
}

export function DrawCounter({ currentDraw, maxDraws }: DrawCounterProps) {
  const progress = ((currentDraw - 1) / maxDraws) * 100;

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center gap-3 w-full max-w-md"
    >
      <div className="flex items-center gap-3">
        <span className="text-lg md:text-xl text-blue-300/70 font-medium">
          ผู้โชคดีคนที่
        </span>
        <span className="text-3xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-amber-400">
          {currentDraw}
        </span>
        <span className="text-lg md:text-xl text-blue-300/70 font-medium">
          จาก {maxDraws}
        </span>
      </div>

      <div className="w-full">
        <Progress value={progress} className="h-2 bg-white/10" />
      </div>
    </motion.div>
  );
}
