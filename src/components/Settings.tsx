"use client";

import React from "react";
import { useDrawStore } from "@/store/drawStore";
import { Gauge, Volume2, VolumeX, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Settings() {
  const { settings, updateSettings } = useDrawStore();

  return (
    <div className="space-y-5">
      <h3 className="text-lg font-semibold text-white">ตั้งค่า</h3>

      {/* Animation speed */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-white/80">
          <Gauge className="w-4 h-4" />
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
            <Volume2 className="w-4 h-4" />
          ) : (
            <VolumeX className="w-4 h-4" />
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
          <Sparkles className="w-4 h-4" />
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
    </div>
  );
}
