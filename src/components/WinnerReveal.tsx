"use client";

import React, { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Employee } from "@/types/employee";
import { useDrawStore } from "@/store/drawStore";

interface WinnerRevealProps {
  winner: Employee | null;
  isRevealed: boolean;
}

export function WinnerReveal({ winner, isRevealed }: WinnerRevealProps) {
  const { settings } = useDrawStore();
  const confettiFired = useRef(false);

  useEffect(() => {
    if (isRevealed && winner && settings.confettiEnabled && !confettiFired.current) {
      confettiFired.current = true;
      fireConfetti();
    }
    if (!isRevealed) {
      confettiFired.current = false;
    }
  }, [isRevealed, winner, settings.confettiEnabled]);

  const fireConfetti = async () => {
    try {
      const confetti = (await import("canvas-confetti")).default;

      // First burst
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6, x: 0.3 },
        colors: ["#FFD700", "#FFA500", "#FF6347", "#00CED1", "#7B68EE"],
      });

      // Second burst
      setTimeout(() => {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6, x: 0.7 },
          colors: ["#FFD700", "#FFA500", "#FF6347", "#00CED1", "#7B68EE"],
        });
      }, 200);

      // Shower
      setTimeout(() => {
        confetti({
          particleCount: 50,
          angle: 60,
          spread: 55,
          origin: { x: 0, y: 0.6 },
        });
        confetti({
          particleCount: 50,
          angle: 120,
          spread: 55,
          origin: { x: 1, y: 0.6 },
        });
      }, 400);
    } catch (e) {
      console.warn("Confetti failed:", e);
    }
  };

  return (
    <AnimatePresence>
      {isRevealed && winner && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: -20 }}
          transition={{ type: "spring", stiffness: 200, damping: 20 }}
          className="flex flex-col items-center gap-3 mt-6"
        >

          {/* Unified Winner Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 20, delay: 0.1 }}
            className="w-full max-w-2xl mx-auto mt-4 md:mt-6 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-3xl border border-white/20 shadow-2xl overflow-hidden"
          >
            {/* Header: Congratulations & Prize */}
            <div className="bg-gradient-to-r from-yellow-500/20 via-amber-500/20 to-yellow-500/20 border-b border-white/10 p-4 text-center relative overflow-hidden">
              <div className="absolute inset-0 bg-yellow-400/5 blur-xl"></div>
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="relative z-10 flex flex-col md:flex-row items-center justify-center gap-2 md:gap-4"
              >
                <span className="text-xl md:text-2xl font-bold text-white drop-shadow-md">
                  🎉 ยินดีด้วย!
                </span>
                <span className="hidden md:block text-white/30 text-lg">|</span>
                <span className="text-lg md:text-xl font-bold text-yellow-300 drop-shadow-md">
                  🏆 รางวัล 10,000 บาท
                </span>
              </motion.div>
            </div>

            {/* Body: Employee Details */}
            <div className="p-6 md:p-8 space-y-6">
              
              {/* ID & Name Row */}
              <div className="flex flex-col items-center justify-center text-center space-y-2">
                <div className="space-y-1">
                  <span className="block text-white/40 text-[10px] md:text-xs font-bold uppercase tracking-[0.2em]">
                    Employee ID
                  </span>
                  <span className="block text-4xl md:text-6xl font-black text-white tracking-widest tabular-nums filter drop-shadow-lg">
                    {winner.id}
                  </span>
                </div>
                
                <div className="w-12 h-1 bg-gradient-to-r from-transparent via-white/20 to-transparent rounded-full my-2"></div>
                
                <div className="space-y-1">
                  <span className="block text-2xl md:text-4xl font-bold text-blue-300 filter drop-shadow-lg">
                    {winner.name || "-"}
                  </span>
                </div>
              </div>

              {/* Details Grid */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t border-white/10">
                {/* Plant */}
                <div className="bg-white/5 rounded-xl p-3 border border-white/5 flex flex-col items-center justify-center text-center hover:bg-white/10 transition-colors">
                  <span className="text-white/40 text-[10px] uppercase tracking-wider mb-1">Plant</span>
                  <span className="text-white font-medium text-sm md:text-base leading-tight">
                    {winner.plant || "-"}
                  </span>
                </div>

                {/* Department */}
                <div className="bg-white/5 rounded-xl p-3 border border-white/5 flex flex-col items-center justify-center text-center hover:bg-white/10 transition-colors">
                  <span className="text-white/40 text-[10px] uppercase tracking-wider mb-1">Department</span>
                  <span className="text-white font-medium text-sm md:text-base leading-tight">
                    {winner.department || "-"}
                  </span>
                </div>

                {/* Section */}
                <div className="bg-white/5 rounded-xl p-3 border border-white/5 flex flex-col items-center justify-center text-center hover:bg-white/10 transition-colors">
                  <span className="text-white/40 text-[10px] uppercase tracking-wider mb-1">Section</span>
                  <span className="text-white font-medium text-sm md:text-base leading-tight">
                    {winner.section || "-"}
                  </span>
                </div>

                {/* Position */}
                <div className="bg-white/5 rounded-xl p-3 border border-white/5 flex flex-col items-center justify-center text-center hover:bg-white/10 transition-colors">
                  <span className="text-white/40 text-[10px] uppercase tracking-wider mb-1">Position</span>
                  <span className="text-white font-medium text-sm md:text-base leading-tight">
                    {winner.position || "-"}
                  </span>
                </div>
              </div>
            </div>

            {/* Subtle Footer Decoration */}
            <div className="h-1.5 w-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 opacity-50"></div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
