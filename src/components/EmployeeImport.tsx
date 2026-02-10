"use client";

import React, { useCallback, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useDrawStore } from "@/store/drawStore";
import { parseEmployeeCSV } from "@/lib/csvParser";
import { UploadSimple, FileCsv, CheckCircle, WarningCircle } from "@phosphor-icons/react";

export function EmployeeImport() {
  const { loadEmployees } = useDrawStore();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [status, setStatus] = useState<{
    type: "idle" | "success" | "error";
    message: string;
    count?: number;
  }>({ type: "idle", message: "" });

  const handleFile = useCallback(
    async (file: File) => {
      if (!file.name.endsWith(".csv")) {
        setStatus({ type: "error", message: "กรุณาเลือกไฟล์ CSV เท่านั้น" });
        return;
      }

      try {
        setStatus({ type: "idle", message: "กำลังอ่านไฟล์..." });
        const employees = await parseEmployeeCSV(file);
        loadEmployees(employees);
        setStatus({
          type: "success",
          message: `นำเข้าข้อมูลพนักงานสำเร็จ`,
          count: employees.length,
        });
      } catch (err) {
        setStatus({
          type: "error",
          message: err instanceof Error ? err.message : "เกิดข้อผิดพลาด",
        });
      }
    },
    [loadEmployees]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setIsDragging(false);
  }, []);

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-white">นำเข้าข้อมูลพนักงาน</h3>

      {/* Drop zone */}
      <div
        role="button"
        tabIndex={0}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => fileInputRef.current?.click()}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') fileInputRef.current?.click(); }}
        className={`relative flex flex-col items-center justify-center gap-3 p-8 rounded-xl border-2 border-dashed cursor-pointer transition-all duration-300 ${
          isDragging
            ? "border-blue-400 bg-blue-500/10"
            : "border-white/20 bg-white/5 hover:border-white/30 hover:bg-white/8"
        }`}
      >
        <UploadSimple
          weight="duotone"
          className={`w-10 h-10 ${isDragging ? "text-blue-400" : "text-white/50"}`}
        />
        <p className="text-base text-white/70 text-center">
          ลากไฟล์ CSV มาวางที่นี่
          <br />
          <span className="text-sm text-white/40">หรือคลิกเพื่อเลือกไฟล์</span>
        </p>

        <input
          ref={fileInputRef}
          type="file"
          accept=".csv"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleFile(file);
            e.target.value = "";
          }}
        />
      </div>

      {/* CSV format hint */}
      <div className="flex items-start gap-2 p-3 rounded-lg bg-white/5 border border-white/10">
        <FileCsv weight="duotone" className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
        <div className="text-sm text-white/60">
          <p className="font-medium text-white/80 mb-1">รูปแบบไฟล์ CSV:</p>
          <code className="text-xs bg-white/10 px-2 py-1 rounded">
            id, name, department
          </code>
          <p className="mt-1">รหัสพนักงานต้องเป็นตัวเลข 7 หลัก</p>
        </div>
      </div>

      {/* Status message */}
      <AnimatePresence>
        {status.type !== "idle" && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={`flex items-center gap-2 p-3 rounded-lg ${
              status.type === "success"
                ? "bg-emerald-500/10 border border-emerald-400/30 text-emerald-400"
                : "bg-red-500/10 border border-red-400/30 text-red-400"
            }`}
          >
            {status.type === "success" ? (
              <CheckCircle weight="duotone" className="w-5 h-5" />
            ) : (
              <WarningCircle weight="duotone" className="w-5 h-5" />
            )}
            <span className="text-sm">
              {status.message}
              {status.count && ` (${status.count} คน)`}
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
