"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useDrawStore } from "@/store/drawStore";
import { Employee } from "@/types/employee";
import {
  UserPlus,
  Trash,
  CheckCircle,
  WarningCircle,
  Plus,
  CaretDown,
} from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { FlagThai, FlagMyanmar } from "@/components/icons/Flags";

interface EmployeeRow {
  id: string;
  name: string;
  department: string;
  nationality: "Thai" | "Myanmar";
}

const emptyRow: EmployeeRow = { id: "", name: "", department: "", nationality: "Thai" };

export function ManualEmployeeEntry() {
  const { employees, loadEmployees } = useDrawStore();
  const [rows, setRows] = useState<EmployeeRow[]>([{ ...emptyRow }]);
  const [openDropdown, setOpenDropdown] = useState<number | null>(null);
  const [status, setStatus] = useState<{
    type: "idle" | "success" | "error";
    message: string;
  }>({ type: "idle", message: "" });

  const updateRow = (index: number, field: keyof EmployeeRow, value: string) => {
    setRows((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value } as EmployeeRow;
      return updated;
    });
  };

  const addRow = () => {
    setRows((prev) => [...prev, { ...emptyRow }]);
  };

  const removeRow = (index: number) => {
    if (rows.length <= 1) return;
    setRows((prev) => prev.filter((_, i) => i !== index));
    if (openDropdown === index) setOpenDropdown(null);
  };

  const handleSubmit = () => {
    // Filter out empty rows
    const validRows = rows.filter((row) => row.id.trim() !== "");

    if (validRows.length === 0) {
      setStatus({ type: "error", message: "กรุณากรอกรหัสพนักงานอย่างน้อย 1 คน" });
      return;
    }

    // Validate all IDs are 7 digits
    const invalidRows = validRows.filter((row) => !/^\d{7}$/.test(row.id.trim()));
    if (invalidRows.length > 0) {
      setStatus({
        type: "error",
        message: `รหัสพนักงานต้องเป็นตัวเลข 7 หลัก (พบรหัสไม่ถูกต้อง: ${invalidRows.map((r) => r.id).join(", ")})`,
      });
      return;
    }

    // Check for duplicates within input
    const ids = validRows.map((r) => r.id.trim());
    const duplicates = ids.filter((id, i) => ids.indexOf(id) !== i);
    if (duplicates.length > 0) {
      setStatus({
        type: "error",
        message: `พบรหัสพนักงานซ้ำ: ${[...new Set(duplicates)].join(", ")}`,
      });
      return;
    }

    const newEmployees: Employee[] = validRows.map((row) => ({
      id: row.id.trim(),
      name: row.name.trim() || undefined,
      department: row.department.trim() || undefined,
      nationality: row.nationality,
    }));

    // Merge with existing employees (avoid duplicates)
    const existingIds = new Set(employees.map((e) => e.id));
    const uniqueNew = newEmployees.filter((e) => !existingIds.has(e.id));
    const mergedEmployees = [...employees, ...uniqueNew];

    loadEmployees(mergedEmployees);

    const skipped = newEmployees.length - uniqueNew.length;
    setStatus({
      type: "success",
      message: `เพิ่มพนักงาน ${uniqueNew.length} คนสำเร็จ${
        skipped > 0 ? ` (ข้าม ${skipped} คนที่มีอยู่แล้ว)` : ""
      }`,
    });

    // Reset form
    setRows([{ ...emptyRow }]);
  };

  const handleClearAll = () => {
    if (window.confirm("คุณแน่ใจหรือไม่ว่าต้องการล้างข้อมูลพนักงานทั้งหมด?")) {
      loadEmployees([]);
      setStatus({ type: "success", message: "ล้างข้อมูลพนักงานทั้งหมดแล้ว" });
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-white flex items-center gap-2">
        <UserPlus weight="duotone" className="w-5 h-5 text-blue-400" />
        กรอกข้อมูลพนักงาน
      </h3>

      {/* Current employee count */}
      <div className="text-sm text-white/60 bg-white/5 rounded-lg px-3 py-2 border border-white/10">
        ข้อมูลในระบบตอนนี้: <span className="font-bold text-white">{employees.length}</span> คน
      </div>

      {/* Table header */}
      <div className="grid grid-cols-[80px_1fr_1fr_100px_36px] gap-2 text-xs text-white/50 font-medium px-1">
        <span>รหัส (7 หลัก)</span>
        <span>ชื่อ-สกุล</span>
        <span>แผนก</span>
        <span>สัญชาติ</span>
        <span></span>
      </div>

      {/* Rows */}
      <div className="space-y-2 max-h-[300px] overflow-visible pr-1">
        {rows.map((row, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-[80px_1fr_1fr_100px_36px] gap-2 relative"
            style={{ zIndex: openDropdown === index ? 50 : 1 }}
          >
            <input
              type="text"
              value={row.id}
              onChange={(e) => {
                const val = e.target.value.replace(/\D/g, "").slice(0, 7);
                updateRow(index, "id", val);
              }}
              placeholder="2210001"
              className="w-full px-2 py-1.5 text-sm rounded-md bg-white/10 border border-white/15 text-white placeholder:text-white/30 focus:outline-none focus:border-blue-400/50 focus:ring-1 focus:ring-blue-400/30 tabular-nums"
            />
            <input
              type="text"
              value={row.name}
              onChange={(e) => updateRow(index, "name", e.target.value)}
              placeholder="ชื่อ-สกุล"
              className="w-full px-2 py-1.5 text-sm rounded-md bg-white/10 border border-white/15 text-white placeholder:text-white/30 focus:outline-none focus:border-blue-400/50 focus:ring-1 focus:ring-blue-400/30"
            />
            <input
              type="text"
              value={row.department}
              onChange={(e) => updateRow(index, "department", e.target.value)}
              placeholder="แผนก"
              className="w-full px-2 py-1.5 text-sm rounded-md bg-white/10 border border-white/15 text-white placeholder:text-white/30 focus:outline-none focus:border-blue-400/50 focus:ring-1 focus:ring-blue-400/30"
            />
            
            {/* Custom Nationality Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setOpenDropdown(openDropdown === index ? null : index)}
                className="w-full px-2 py-1.5 text-sm rounded-md bg-white/10 border border-white/15 text-white flex items-center justify-between hover:bg-white/15 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-1.5 min-w-0">
                  {row.nationality === "Thai" ? (
                    <FlagThai className="w-4 h-auto rounded-[1px] flex-shrink-0" />
                  ) : (
                    <FlagMyanmar className="w-4 h-auto rounded-[1px] flex-shrink-0" />
                  )}
                  <span className="truncate">{row.nationality === "Thai" ? "ไทย" : "พม่า"}</span>
                </div>
                <CaretDown 
                  weight="bold" 
                  className={`w-3 h-3 text-white/40 transition-transform duration-200 flex-shrink-0 ${openDropdown === index ? 'rotate-180' : ''}`} 
                />
              </button>

              {openDropdown === index && (
                <>
                  <div 
                    className="fixed inset-0 z-40 bg-transparent" 
                    onClick={() => setOpenDropdown(null)}
                  />
                  <motion.div
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute top-full left-0 w-full mt-1 z-50 bg-[#1e293b] border border-white/10 rounded-md shadow-2xl overflow-hidden py-1"
                  >
                    <button
                      type="button"
                      className={`w-full px-3 py-2 text-sm text-left flex items-center gap-2 hover:bg-white/10 transition-colors ${row.nationality === "Thai" ? "bg-blue-500/10 text-blue-400" : "text-white/70"}`}
                      onClick={() => {
                        updateRow(index, "nationality", "Thai");
                        setOpenDropdown(null);
                      }}
                    >
                      <FlagThai className="w-4 h-auto rounded-[1px]" />
                      <span>ไทย</span>
                    </button>
                    <button
                      type="button"
                      className={`w-full px-3 py-2 text-sm text-left flex items-center gap-2 hover:bg-white/10 transition-colors ${row.nationality === "Myanmar" ? "bg-blue-500/10 text-blue-400" : "text-white/70"}`}
                      onClick={() => {
                        updateRow(index, "nationality", "Myanmar");
                        setOpenDropdown(null);
                      }}
                    >
                      <FlagMyanmar className="w-4 h-auto rounded-[1px]" />
                      <span>พม่า</span>
                    </button>
                  </motion.div>
                </>
              )}
            </div>

            <button
              onClick={() => removeRow(index)}
              disabled={rows.length <= 1}
              className="flex items-center justify-center w-8 h-8 rounded-md text-white/40 hover:text-red-400 hover:bg-red-500/10 disabled:opacity-30 disabled:hover:text-white/40 disabled:hover:bg-transparent transition-colors cursor-pointer"
            >
              <Trash weight="duotone" className="w-4 h-4" />
            </button>
          </motion.div>
        ))}
      </div>

      {/* Add row button */}
      <button
        onClick={addRow}
        className="w-full flex items-center justify-center gap-1.5 py-2 rounded-lg border border-dashed border-white/20 text-white/50 hover:text-blue-300 hover:border-blue-400/30 hover:bg-blue-500/5 transition-colors text-sm cursor-pointer"
      >
        <Plus weight="bold" className="w-4 h-4" />
        เพิ่มแถว
      </button>

      {/* Action buttons */}
      <div className="flex gap-2 relative z-0">
        <Button
          onClick={handleSubmit}
          className="flex-1 h-12 text-base font-semibold bg-blue-500 hover:bg-blue-600 text-white shadow-lg shadow-blue-500/20 cursor-pointer"
        >
          <UserPlus weight="bold" className="w-5 h-5 mr-2" />
          เพิ่มพนักงาน
        </Button>
        <Button
          onClick={handleClearAll}
          variant="outline"
          className="flex-1 h-12 text-base font-semibold border-white/20 text-white bg-white/5 hover:bg-red-500/10 hover:text-red-400 hover:border-red-400/30 transition-all cursor-pointer"
        >
          ล้างทั้งหมด
        </Button>
      </div>

      {/* Status message */}
      <AnimatePresence>
        {status.type !== "idle" && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={`flex items-center gap-2 p-3 rounded-lg text-sm ${
              status.type === "success"
                ? "bg-emerald-500/10 border border-emerald-400/30 text-emerald-400"
                : "bg-red-500/10 border border-red-400/30 text-red-400"
            }`}
          >
            {status.type === "success" ? (
              <CheckCircle weight="duotone" className="w-4 h-4 flex-shrink-0" />
            ) : (
              <WarningCircle weight="duotone" className="w-4 h-4 flex-shrink-0" />
            )}
            <span>{status.message}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
