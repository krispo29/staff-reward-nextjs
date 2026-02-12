"use client";

import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useDrawStore } from "@/store/drawStore";
import { Trophy, Sparkle, Users, Sparkle as SparklesAlias } from "@phosphor-icons/react";

export function StartScreen() {
  const { startDraw, employees, fetchEmployees, isLoading } = useDrawStore();

  const initialized = React.useRef(false);

  useEffect(() => {
    // Fetch real data on mount if empty strict once
    if (!initialized.current && employees.length === 0 && !isLoading) {
      initialized.current = true;
      fetchEmployees();
    }
  }, [employees.length, fetchEmployees, isLoading]);

  return (
    <div className="flex flex-col items-center justify-center gap-8 md:gap-12 text-center w-full max-w-3xl mx-auto">
      {/* Title */}
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="space-y-4"
      >
        <motion.div
          className="inline-flex items-center justify-center w-24 h-24 md:w-32 md:h-32 rounded-full bg-gradient-to-br from-yellow-400 via-amber-500 to-orange-500 shadow-2xl shadow-amber-500/30 mb-4"
          animate={{
            scale: [1, 1.05, 1],
            rotate: [0, 2, -2, 0],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <Trophy weight="duotone" className="w-12 h-12 md:w-16 md:h-16 text-white" />
        </motion.div>

        <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-amber-400 to-yellow-300">
          New Year Party
        </h1>
        <p className="text-xl md:text-2xl text-blue-200/80 font-medium tracking-widest uppercase mt-2">
          Staff Reward 2026
        </p>
      </motion.div>

      {/* Prize info */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="flex flex-col md:flex-row items-center gap-4 md:gap-8"
      >
        <div className="flex items-center gap-3 px-6 py-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
          <Sparkle weight="duotone" className="w-6 h-6 text-yellow-400" />
          <div className="text-left">
            <p className="text-sm text-blue-300/70">รางวัลละ</p>
            <p className="text-2xl md:text-3xl font-bold text-white">
              10,000{" "}
              <span className="text-lg text-blue-300/70">THB</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 px-6 py-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
          <Trophy weight="duotone" className="w-6 h-6 text-emerald-400" />
          <div className="text-left">
            <p className="text-sm text-blue-300/70">จำนวน</p>
            <p className="text-2xl md:text-3xl font-bold text-white">
              10{" "}
              <span className="text-lg text-blue-300/70">รางวัล</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 px-6 py-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
          <Users weight="duotone" className="w-6 h-6 text-blue-400" />
          <div className="text-left">
            <p className="text-sm text-blue-300/70">ผู้มีสิทธิ์</p>
            <p className="text-2xl md:text-3xl font-bold text-white">
              {employees.length}{" "}
              <span className="text-lg text-blue-300/70">คน</span>
            </p>
          </div>
        </div>
      </motion.div>

      {/* Start button */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.6 }}
      >
        <Button
          onClick={startDraw}
          disabled={employees.length === 0}
          className="h-20 md:h-24 px-12 md:px-16 text-2xl md:text-3xl font-bold rounded-2xl bg-gradient-to-r from-yellow-500 via-amber-500 to-orange-500 hover:from-yellow-400 hover:via-amber-400 hover:to-orange-400 text-white shadow-2xl shadow-amber-500/30 hover:shadow-amber-500/50 transition-all duration-300 border-0 cursor-pointer"
        >
          <SparklesAlias weight="duotone" className="w-8 h-8 mr-3" />
          เริ่มจับรางวัล
        </Button>
      </motion.div>
    </div>
  );
}
