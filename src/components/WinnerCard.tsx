"use client";

import React from "react";
import { motion } from "framer-motion";
import { Employee } from "@/types/employee";
import { Trophy } from "lucide-react";

interface WinnerCardProps {
  winner: Employee;
  index: number;
  isLatest: boolean;
}

export function WinnerCard({ winner, index, isLatest }: WinnerCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20, scale: 0.95 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      transition={{ type: "spring", stiffness: 200, damping: 20 }}
      className={`flex items-center gap-3 p-3 md:p-4 rounded-xl border transition-all duration-300 ${
        isLatest
          ? "bg-gradient-to-r from-yellow-500/10 to-amber-500/10 border-yellow-400/30 shadow-lg shadow-yellow-500/10"
          : "bg-white/5 border-white/10 hover:bg-white/8"
      }`}
    >
      {/* Number badge */}
      <div
        className={`flex-shrink-0 w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-full font-bold text-lg ${
          isLatest
            ? "bg-gradient-to-br from-yellow-400 to-amber-500 text-white"
            : "bg-white/10 text-white/70"
        }`}
      >
        {index + 1}
      </div>

      {/* Winner info */}
      <div className="flex-1 min-w-0">
        <p className="text-lg md:text-xl font-bold text-white tabular-nums tracking-wider">
          {winner.id}
        </p>
        {winner.name && (
          <p className="text-sm md:text-base text-blue-300/70 truncate">
            {winner.name}
          </p>
        )}
      </div>

      {/* Trophy for latest */}
      {isLatest && (
        <motion.div
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ duration: 1, repeat: 2 }}
        >
          <Trophy className="w-5 h-5 text-yellow-400" />
        </motion.div>
      )}
    </motion.div>
  );
}
