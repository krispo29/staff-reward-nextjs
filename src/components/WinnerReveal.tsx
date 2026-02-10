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
          {/* Winner badge */}
          <motion.div
            className="px-6 py-2 rounded-full bg-gradient-to-r from-emerald-500/20 to-teal-500/20 border border-emerald-400/30"
            animate={{
              boxShadow: [
                "0 0 10px rgba(16, 185, 129, 0.2)",
                "0 0 25px rgba(16, 185, 129, 0.4)",
                "0 0 10px rgba(16, 185, 129, 0.2)",
              ],
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <span className="text-lg md:text-xl font-bold text-emerald-400">
              🎉 ยินดีด้วย! 🎉
            </span>
          </motion.div>

          {/* Winner details */}
          {winner.name && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-2xl md:text-3xl font-bold text-white"
            >
              {winner.name}
            </motion.p>
          )}

          {winner.department && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-lg md:text-xl text-blue-300/70"
            >
              แผนก: {winner.department}
            </motion.p>
          )}

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="text-xl md:text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-amber-400"
          >
            🏆 รางวัล 10,000 บาท
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
