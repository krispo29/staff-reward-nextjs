"use client";

import React from "react";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button"; // Assumed existing button component
import { Employee } from "@/types/employee";
import { CheckCircle, XCircle } from "@phosphor-icons/react";

interface WinnerModalProps {
  winner: Employee | null;
  isOpen: boolean;
  onAccept: () => void;
  onReject: () => void;
}

export function WinnerModal({ winner, isOpen, onAccept, onReject }: WinnerModalProps) {
  if (!winner) return null;

  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent showCloseButton={false} className="max-w-2xl bg-slate-900 border-white/10 p-0 overflow-hidden text-white sm:rounded-3xl">
        <div className="relative w-full bg-gradient-to-br from-slate-900 to-slate-800">
          
          {/* Header */}
          <div className="bg-gradient-to-r from-yellow-500/20 via-amber-500/20 to-yellow-500/20 border-b border-white/10 p-4 text-center">
             <DialogDescription className="sr-only">
               รายละเอียดผู้โชคดีที่ได้รับรางวัล 10,000 บาท
             </DialogDescription>
             <div className="flex flex-col md:flex-row items-center justify-center gap-2 md:gap-4">
                <DialogTitle className="text-xl md:text-2xl font-bold text-white drop-shadow-md flex items-center gap-2">
                  🎉 <span>ยินดีด้วย!</span>
                </DialogTitle>
                <span className="hidden md:block text-white/30 text-lg">|</span>
                <span className="text-lg md:text-xl font-bold text-yellow-300 drop-shadow-md">
                  🏆 รางวัล 10,000 บาท
                </span>
             </div>
          </div>

          {/* Winner Details */}
          <div className="p-6 md:p-8 space-y-6">
             {/* ID & Name */}
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

              {/* Grid 4 Items */}
              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/10">
                {/* Plant */}
                <div className="bg-white/5 rounded-xl p-3 border border-white/5 flex flex-col items-center justify-center text-center">
                  <span className="text-white/40 text-[10px] uppercase tracking-wider mb-1">Plant</span>
                  <span className="text-white font-medium text-sm md:text-base leading-tight">
                    {winner.plant || "-"}
                  </span>
                </div>

                {/* Department */}
                <div className="bg-white/5 rounded-xl p-3 border border-white/5 flex flex-col items-center justify-center text-center">
                  <span className="text-white/40 text-[10px] uppercase tracking-wider mb-1">Department</span>
                  <span className="text-white font-medium text-sm md:text-base leading-tight">
                    {winner.department || "-"}
                  </span>
                </div>

                {/* Section */}
                <div className="bg-white/5 rounded-xl p-3 border border-white/5 flex flex-col items-center justify-center text-center">
                  <span className="text-white/40 text-[10px] uppercase tracking-wider mb-1">Section</span>
                  <span className="text-white font-medium text-sm md:text-base leading-tight">
                    {winner.section || "-"}
                  </span>
                </div>

                {/* Position */}
                <div className="bg-white/5 rounded-xl p-3 border border-white/5 flex flex-col items-center justify-center text-center">
                  <span className="text-white/40 text-[10px] uppercase tracking-wider mb-1">Position</span>
                  <span className="text-white font-medium text-sm md:text-base leading-tight">
                    {winner.position || "-"}
                  </span>
                </div>
              </div>
          </div>

          {/* Action Buttons */}
          <div className="p-4 bg-black/20 border-t border-white/10 flex gap-4 justify-center">
             <Button
                onClick={onReject}
                className="flex-1 h-14 text-lg font-bold rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/50 hover:border-red-400 transition-all cursor-pointer"
              >
                <XCircle weight="duotone" className="w-6 h-6 mr-2" />
                สละสิทธิ์
              </Button>
              <Button
                onClick={onAccept}
                className="flex-[2] h-14 text-lg font-bold rounded-xl bg-green-600 hover:bg-green-700 text-white shadow-lg shadow-green-600/20 transition-all cursor-pointer border-0"
              >
                <CheckCircle weight="duotone" className="w-6 h-6 mr-2" />
                รับรางวัล
              </Button>
          </div>

        </div>
      </DialogContent>
    </Dialog>
  );
}
