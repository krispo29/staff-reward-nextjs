"use client";

import React, { useCallback, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useDrawStore } from "@/store/drawStore";
import { parseEmployeeCSV } from "@/lib/csvParser";
import { UploadSimple, FileCsv, CheckCircle, WarningCircle } from "@phosphor-icons/react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Employee } from "@/types/employee";
import { ManualEmployeeEntry } from "./ManualEmployeeEntry";
import { UserPlus } from "@phosphor-icons/react";

export function EmployeeImport() {
  const { importEmployees } = useDrawStore();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [status, setStatus] = useState<{
    type: "idle" | "success" | "error";
    message: string;
    count?: number;
  }>({ type: "idle", message: "" });
  
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [showManualEntryDialog, setShowManualEntryDialog] = useState(false);
  const [parsedEmployees, setParsedEmployees] = useState<Employee[]>([]);

  const handleFile = useCallback(
    async (file: File) => {
      if (!file.name.endsWith(".csv")) {
        setStatus({ type: "error", message: "กรุณาเลือกไฟล์ CSV เท่านั้น" });
        return;
      }

      try {
        setStatus({ type: "idle", message: "กำลังอ่านไฟล์..." });
        const employees = await parseEmployeeCSV(file);
        
        if (employees.length === 0) {
            setStatus({ type: "error", message: "ไม่พบข้อมูลในไฟล์ CSV" });
            return;
        }

        setParsedEmployees(employees);
        setShowConfirmDialog(true);
      } catch (err) {
        setStatus({
          type: "error",
          message: err instanceof Error ? err.message : "เกิดข้อผิดพลาด",
        });
      }
    },
    []
  );

  const confirmImport = async () => {
    try {
        setShowConfirmDialog(false);
        setStatus({ type: "idle", message: "กำลังนำเข้าข้อมูล..." });
        await importEmployees(parsedEmployees);
        setStatus({
          type: "success",
          message: `นำเข้าข้อมูลพนักงานสำเร็จ`,
          count: parsedEmployees.length,
        });
    } catch (err) {
        setStatus({
          type: "error",
          message: err instanceof Error ? err.message : "เกิดข้อผิดพลาด",
        });
    }
  };

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
            id, name, department, section, position, plant, nationality
          </code>
          <p className="mt-1">รหัสพนักงานต้องเป็นตัวเลข 7 หลัก (สัญชาติระบุ: Thai หรือ Myanmar)</p>
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

      {/* Confirmation Dialog */}
      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent className="!w-[90vw] !max-w-7xl bg-slate-900 border-white/10 text-white">
          <DialogHeader>
            <DialogTitle className="text-xl">ยืนยันการนำเข้าข้อมูล</DialogTitle>
            <DialogDescription className="text-white/60">
              พบข้อมูลพนักงานจำนวน <span className="text-blue-400 font-bold">{parsedEmployees.length}</span> คนจากไฟล์ CSV
            </DialogDescription>
          </DialogHeader>

          <div className="my-4 max-h-[400px] overflow-auto rounded-lg border border-white/10 bg-black/20">
            <table className="w-full text-sm text-left">
              <thead className="sticky top-0 bg-slate-800 text-white/70 uppercase text-xs">
                <tr>
                  <th className="px-4 py-3 font-semibold">รหัสพนักงาน</th>
                  <th className="px-4 py-3 font-semibold">ชื่อ-นามสกุล</th>
                  <th className="px-4 py-3 font-semibold">แผนก</th>
                  <th className="px-4 py-3 font-semibold">Section</th>
                  <th className="px-4 py-3 font-semibold">ตำแหน่ง</th>
                  <th className="px-4 py-3 font-semibold">Plant</th>
                  <th className="px-4 py-3 font-semibold">สัญชาติ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {parsedEmployees.map((emp, index) => (
                  <tr key={index} className="hover:bg-white/5 transition-colors">
                    <td className="px-4 py-2.5 font-mono text-blue-400">{emp.id}</td>
                    <td className="px-4 py-2.5 text-white/90">{emp.name}</td>
                    <td className="px-4 py-2.5 text-white/60">{emp.department}</td>
                    <td className="px-4 py-2.5 text-white/60">{emp.section}</td>
                    <td className="px-4 py-2.5 text-white/60">{emp.position}</td>
                    <td className="px-4 py-2.5 text-white/60">{emp.plant}</td>
                    <td className="px-4 py-2.5">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] uppercase font-bold ${
                        emp.nationality?.toLowerCase() === 'myanmar' 
                        ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' 
                        : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                      }`}>
                        {emp.nationality || 'Thai'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={() => setShowConfirmDialog(false)}
              className="flex-1 h-12 text-base font-semibold border-white/20 text-white bg-white/5 hover:bg-white/10 transition-all cursor-pointer mr-2"
            >
              ยกเลิก
            </Button>
            <Button
              onClick={confirmImport}
              className="flex-1 h-12 text-base font-semibold bg-blue-500 hover:bg-blue-600 text-white shadow-lg shadow-blue-500/20 transition-all cursor-pointer"
            >
              ยืนยัน นำเข้า ({parsedEmployees.length} คน)
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Manual Entry Button & Modal */}
        <div className="pt-4 border-t border-white/10 flex justify-center">
        <Button
            onClick={() => setShowManualEntryDialog(true)}
            variant="outline"
            className="w-full h-auto py-3 border-2 border-dashed border-blue-500/30 text-blue-300 hover:text-white hover:border-blue-400 hover:bg-blue-500/20 text-sm transition-all whitespace-normal leading-tight"
        >
            <UserPlus weight="duotone" className="w-5 h-5 mr-2 flex-shrink-0" />
            หรือ กรอกข้อมูลพนักงานด้วยตนเอง (Manual Entry)
        </Button>
      </div>

       <Dialog open={showManualEntryDialog} onOpenChange={setShowManualEntryDialog}>
        <DialogContent className="max-w-[90vw] md:max-w-7xl bg-slate-900 border-white/10 text-white max-h-[90vh] overflow-y-auto">
             <DialogHeader className="mb-6 border-b border-white/10 pb-4">
                <DialogTitle className="text-xl flex items-center gap-3">
                  <span className="p-2 rounded-lg bg-blue-500/10 text-blue-400">
                    <UserPlus weight="duotone" className="w-6 h-6" />
                  </span>
                  กรอกข้อมูลพนักงาน (Manual Entry)
                </DialogTitle>
             </DialogHeader>
             <ManualEmployeeEntry />
        </DialogContent>
      </Dialog>
    </div>
  );
}
