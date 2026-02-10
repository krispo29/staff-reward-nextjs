"use client";

import React from "react";
import { motion } from "framer-motion";
import { Employee } from "@/types/employee";
import { WinnerCard } from "./WinnerCard";
import { Trophy } from "@phosphor-icons/react";

interface WinnersListProps {
  winners: Employee[];
}

export function WinnersList({ winners }: Readonly<WinnersListProps>) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-4 md:p-6"
    >
      {/* Header */}
      <div className="flex items-center gap-2 mb-4 pb-3 border-b border-white/10">
        <Trophy weight="duotone" className="w-5 h-5 text-yellow-400" />
        <h2 className="text-lg md:text-xl font-bold text-white">
          รายชื่อผู้โชคดี
        </h2>
        <span className="ml-auto text-sm text-blue-300/70 bg-white/5 px-3 py-1 rounded-full">
          {winners.length} คน
        </span>
      </div>

      {/* Winners list */}
      <div className="space-y-2 max-h-[400px] lg:max-h-[500px] overflow-y-auto pr-1 scrollbar-thin">
        {winners.map((winner, index) => (
          <WinnerCard
            key={winner.id}
            winner={winner}
            index={index}
            isLatest={index === winners.length - 1}
          />
        ))}
      </div>
    </motion.div>
  );
}
