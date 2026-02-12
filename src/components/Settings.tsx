"use client";

import React, { useState } from "react";
import { useDrawStore } from "@/store/drawStore";
import { Gauge, SpeakerHigh, SpeakerX, Sparkle, Trash } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";

export function Settings() {
  const { settings, updateSettings } = useDrawStore();
  const [isClearConfirmOpen, setIsClearConfirmOpen] = useState(false);

  return (
    <div className="space-y-5">
      <h3 className="text-lg font-semibold text-white">ตั้งค่า</h3>

      {/* Animation speed */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-white/80">
          <Gauge weight="duotone" className="w-4 h-4" />
          <span className="text-sm font-medium">ความเร็วแอนิเมชัน</span>
        </div>
        <div className="flex gap-2">
          {[
            { value: 0.5, label: "ช้า" },
            { value: 1, label: "ปกติ" },
            { value: 2, label: "เร็ว" },
          ].map((speed) => (
            <Button
              key={speed.value}
              variant="outline"
              size="sm"
              onClick={() => updateSettings({ animationSpeed: speed.value })}
              className={`flex-1 text-sm cursor-pointer ${
                settings.animationSpeed === speed.value
                  ? "bg-blue-500/20 border-blue-400/50 text-blue-300"
                  : "bg-white/5 border-white/10 text-white/60 hover:bg-white/10"
              }`}
            >
              {speed.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Sound toggle */}
      <div className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/10">
        <div className="flex items-center gap-2 text-white/80">
          {settings.soundEnabled ? (
            <SpeakerHigh weight="duotone" className="w-4 h-4" />
          ) : (
            <SpeakerX weight="duotone" className="w-4 h-4" />
          )}
          <span className="text-sm font-medium">เสียง</span>
        </div>
        <button
          onClick={() =>
            updateSettings({ soundEnabled: !settings.soundEnabled })
          }
          className={`relative w-12 h-6 rounded-full transition-colors cursor-pointer ${
            settings.soundEnabled ? "bg-blue-500" : "bg-white/20"
          }`}
        >
          <span
            className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-transform ${
              settings.soundEnabled ? "translate-x-6" : "translate-x-0"
            }`}
          />
        </button>
      </div>

      {/* Confetti toggle */}
      <div className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/10">
        <div className="flex items-center gap-2 text-white/80">
          <Sparkle weight="duotone" className="w-4 h-4" />
          <span className="text-sm font-medium">เอฟเฟกต์ Confetti</span>
        </div>
        <button
          onClick={() =>
            updateSettings({ confettiEnabled: !settings.confettiEnabled })
          }
          className={`relative w-12 h-6 rounded-full transition-colors cursor-pointer ${
            settings.confettiEnabled ? "bg-blue-500" : "bg-white/20"
          }`}
        >
          <span
            className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-transform ${
              settings.confettiEnabled ? "translate-x-6" : "translate-x-0"
            }`}
          />
        </button>
      </div>

      {/* Clear Data */}
      <div className="pt-4 border-t border-white/10">
        <h4 className="text-sm font-medium text-white/80 mb-3">จัดการข้อมูล</h4>
        <Button
          variant="destructive"
          onClick={() => setIsClearConfirmOpen(true)}
          className="w-full flex items-center justify-center gap-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/50 hover:border-red-400"
        >
          <Trash weight="duotone" className="w-4 h-4" />
          ล้างข้อมูลพนักงานทั้งหมด
        </Button>

        <Dialog open={isClearConfirmOpen} onOpenChange={setIsClearConfirmOpen}>
          <DialogContent className="sm:max-w-md bg-slate-900 text-white border-white/10">
            <DialogHeader>
              <DialogTitle className="text-white">ยืนยันการลบข้อมูล</DialogTitle>
              <DialogDescription className="text-white/70">
                คุณแน่ใจหรือไม่ที่จะลบข้อมูลพนักงานทั้งหมด? การกระทำนี้ไม่สามารถย้อนกลับได้
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="flex gap-2 sm:justify-end">
              <DialogClose asChild>
                <Button variant="outline" className="border-white/10 text-white hover:bg-white/10 bg-transparent">
                  ยกเลิก
                </Button>
              </DialogClose>
              <Button
                variant="destructive"
                onClick={() => {
                  const { clearEmployees } = useDrawStore.getState();
                  clearEmployees();
                  setIsClearConfirmOpen(false);
                }}
                className="bg-red-500 hover:bg-red-600 text-white border-none"
              >
                ลบข้อมูลทั้งหมด
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
