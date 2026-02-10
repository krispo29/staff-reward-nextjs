"use client";

import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, MagnifyingGlass, User, Users } from "@phosphor-icons/react";
import { useDrawStore } from "@/store/drawStore";
import { Employee } from "@/types/employee";

interface EntrantsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function EntrantsModal({ isOpen, onClose }: EntrantsModalProps) {
  const { employees, winners } = useDrawStore();
  const [search, setSearch] = useState("");

  const winnerIds = useMemo(() => new Set(winners.map((w) => w.id)), [winners]);

  const filteredEmployees = useMemo(() => {
    return employees.filter((emp) => {
      const query = search.toLowerCase().trim();
      const matchesSearch =
        emp.id.includes(query) ||
        (emp.name && emp.name.toLowerCase().includes(query)) ||
        (emp.department && emp.department.toLowerCase().includes(query));
      return matchesSearch;
    });
  }, [employees, search]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="w-full max-w-2xl bg-slate-900 border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh]"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="p-4 border-b border-white/10 flex items-center justify-between bg-white/5">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Users weight="duotone" className="w-6 h-6 text-blue-400" />
              รายชื่อผู้มีสิทธิ์จับรางวัล
              <span className="text-sm font-normal text-white/50 ml-2">
                ({employees.length} คน)
              </span>
            </h2>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-white/10 text-white/50 hover:text-white transition-colors"
            >
              <X weight="bold" className="w-5 h-5" />
            </button>
          </div>

          {/* Search */}
          <div className="p-4 border-b border-white/10 bg-slate-900/50">
            <div className="relative">
              <MagnifyingGlass
                weight="bold"
                className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30"
              />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="ค้นหาด้วยรหัส, ชื่อ หรือแผนก..."
                className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-white/30 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/30 transition-all"
                autoFocus
              />
            </div>
          </div>

          {/* List */}
          <div className="flex-1 overflow-y-auto p-2 scrollbar-thin">
            {filteredEmployees.length > 0 ? (
              <div className="space-y-1">
                {filteredEmployees.map((emp) => {
                  const isWinner = winnerIds.has(emp.id);
                  return (
                    <div
                      key={emp.id}
                      className={`flex items-center justify-between p-3 rounded-lg border ${
                        isWinner
                          ? "bg-emerald-500/10 border-emerald-500/30"
                          : "bg-white/5 border-white/5 hover:bg-white/10"
                      } transition-colors`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold ${
                            isWinner
                              ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/30"
                              : "bg-gradient-to-br from-blue-500 to-indigo-600 text-white/90"
                          }`}
                        >
                          {isWinner ? "🏆" : <User weight="fill" className="w-5 h-5" />}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-white font-mono font-medium">
                              {emp.id}
                            </span>
                            {emp.department && (
                              <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30">
                                {emp.department}
                              </span>
                            )}
                          </div>
                          <div className="text-sm text-white/60">
                            {emp.name || "-"}
                             {/* Department is now in the badge above, so maybe remove it here or keep as secondary? 
                                 Actually, moving department to a badge next to ID/Name is better. 
                                 Let's put it next to ID as before. 
                             */}
                          </div>
                        </div>
                      </div>

                      {isWinner && (
                        <div className="px-2 py-1 rounded bg-emerald-500/20 text-emerald-400 text-xs font-bold border border-emerald-500/30">
                          ได้รับรางวัลแล้ว
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-40 text-white/30">
                <MagnifyingGlass weight="duotone" className="w-8 h-8 mb-2" />
                <p>ไม่พบรายชื่อที่ค้นหา</p>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
