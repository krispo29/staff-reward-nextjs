"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useDrawStore } from "@/store/drawStore";
import { useAuth } from "@/hooks/useAuth";
import { printWinners } from "@/lib/exportWinners";
import { EmployeeImport } from "./EmployeeImport";
import { ManualEmployeeEntry } from "./ManualEmployeeEntry";
import { Settings } from "./Settings";
import {
  Gear,
  ArrowCounterClockwise,
  DownloadSimple,
  Printer,
  CaretDown,
  CaretUp,
  X,
  UserPlus,
  Lock,
  SignOut,
  CircleNotch,
} from "@phosphor-icons/react";

export function AdminPanel() {
  const { winners, reset, employees } = useDrawStore();
  const { user, login, logout, loading } = useAuth();
  
  const [isOpen, setIsOpen] = useState(false);
  const [showResetDialog, setShowResetDialog] = useState(false);
  const [activeSection, setActiveSection] = useState<string | null>(null);
  
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const handleReset = () => {
    reset();
    setShowResetDialog(false);
  };

  const toggleSection = (section: string) => {
    setActiveSection(activeSection === section ? null : section);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggingIn(true);
    setLoginError(false);
    const success = await login(password);
    if (!success) {
      setLoginError(true);
    } else {
      setPassword("");
    }
    setIsLoggingIn(false);
  };

  return (
    <>
      {/* Toggle button */}
      <motion.div className="fixed top-4 right-4 z-50" whileHover={{ scale: 1.05 }}>
        <Button
          onClick={() => setIsOpen(!isOpen)}
          variant="outline"
          size="icon"
          className="h-12 w-12 rounded-full bg-white/10 border-white/20 text-white hover:bg-white/20 backdrop-blur-sm cursor-pointer"
        >
          {isOpen ? <X weight="bold" className="w-5 h-5" /> : <Gear weight="duotone" className="w-5 h-5" />}
        </Button>
      </motion.div>

      {/* Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, x: 300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 300 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed top-0 right-0 bottom-0 w-full max-w-sm z-40 bg-slate-900/95 backdrop-blur-xl border-l border-white/10 shadow-2xl overflow-y-auto"
          >
            <div className="p-6 pt-20 space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-white">แผงควบคุม</h2>
                {user && (
                    <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => logout()}
                        className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                    >
                        <SignOut className="w-4 h-4 mr-2" />
                        ออกจากระบบ
                    </Button>
                )}
              </div>

              {!user ? (
                // Login Form
                <form onSubmit={handleLogin} className="space-y-4 py-10">
                    <div className="flex flex-col items-center gap-4 mb-6">
                        <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center">
                            <Lock weight="duotone" className="w-8 h-8 text-white/50" />
                        </div>
                        <p className="text-sm text-white/60 text-center">
                            กรุณากรอกรหัสผ่านเพื่อเข้าถึงส่วนผู้ดูแลระบบ
                        </p>
                    </div>

                    <div className="space-y-2">
                        <Input 
                            type="password" 
                            placeholder="รหัสผ่าน Admin" 
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="bg-white/5 border-white/10 text-white placeholder:text-white/30 text-center"
                        />
                        {loginError && (
                            <p className="text-xs text-red-400 text-center">รหัสผ่านไม่ถูกต้อง</p>
                        )}
                    </div>

                    <Button 
                        type="submit" 
                        className="w-full bg-blue-600 hover:bg-blue-500 text-white"
                        disabled={isLoggingIn || !password}
                    >
                        {isLoggingIn ? <CircleNotch className="w-4 h-4 animate-spin" /> : "เข้าสู่ระบบ"}
                    </Button>
                </form>
              ) : (
                // Authenticated Content
                <>
                    {/* Quick actions */}
                    <div className="grid grid-cols-2 gap-3">
                        <Button
                        onClick={() => setShowResetDialog(true)}
                        variant="outline"
                        className="h-14 flex flex-col gap-1 bg-white/5 border-white/10 text-white hover:bg-red-500/10 hover:border-red-400/30 hover:text-red-400 cursor-pointer"
                        >
                        <ArrowCounterClockwise weight="duotone" className="w-5 h-5" />
                        <span className="text-xs">เริ่มใหม่</span>
                        </Button>

                        <Button
                        onClick={() => {
                            window.location.href = '/api/export/winners';
                        }}
                        variant="outline"
                        disabled={winners.length === 0}
                        className="h-14 flex flex-col gap-1 bg-white/5 border-white/10 text-white hover:bg-emerald-500/10 hover:border-emerald-400/30 hover:text-emerald-400 cursor-pointer disabled:opacity-50"
                        >
                        <DownloadSimple weight="duotone" className="w-5 h-5" />
                        <span className="text-xs">Export CSV</span>
                        </Button>

                        <Button
                        onClick={() => printWinners(winners)}
                        variant="outline"
                        disabled={winners.length === 0}
                        className="h-14 flex flex-col gap-1 bg-white/5 border-white/10 text-white hover:bg-blue-500/10 hover:border-blue-400/30 hover:text-blue-400 cursor-pointer disabled:opacity-50"
                        >
                        <Printer weight="duotone" className="w-5 h-5" />
                        <span className="text-xs">พิมพ์</span>
                        </Button>

                        <div className="h-14 flex flex-col items-center justify-center bg-white/5 border border-white/10 rounded-md text-white/60">
                        <span className="text-lg font-bold">{employees.length}</span>
                        <span className="text-xs">พนักงาน</span>
                        </div>
                    </div>

                    {/* Collapsible sections */}
                    <div className="space-y-3">
                        {/* Import section */}
                        <button
                        onClick={() => toggleSection("import")}
                        className="w-full flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/10 text-white hover:bg-white/8 transition-colors cursor-pointer"
                        >
                        <span className="font-medium">นำเข้าข้อมูลพนักงาน</span>
                        {activeSection === "import" ? (
                            <CaretUp weight="bold" className="w-4 h-4" />
                        ) : (
                            <CaretDown weight="bold" className="w-4 h-4" />
                        )}
                        </button>
                        <AnimatePresence>
                        {activeSection === "import" && (
                            <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="overflow-hidden"
                            >
                            <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                                <EmployeeImport />
                            </div>
                            </motion.div>
                        )}
                        </AnimatePresence>

                        {/* Manual entry section */}
                        <button
                        onClick={() => toggleSection("manual")}
                        className="w-full flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/10 text-white hover:bg-white/8 transition-colors cursor-pointer"
                        >
                        <span className="font-medium flex items-center gap-2">
                            <UserPlus weight="duotone" className="w-4 h-4 text-blue-400" />
                            กรอกข้อมูลพนักงาน
                        </span>
                        {activeSection === "manual" ? (
                            <CaretUp weight="bold" className="w-4 h-4" />
                        ) : (
                            <CaretDown weight="bold" className="w-4 h-4" />
                        )}
                        </button>
                        <AnimatePresence>
                        {activeSection === "manual" && (
                            <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="overflow-hidden"
                            >
                            <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                                <ManualEmployeeEntry />
                            </div>
                            </motion.div>
                        )}
                        </AnimatePresence>

                        {/* Settings section */}
                        <button
                        onClick={() => toggleSection("settings")}
                        className="w-full flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/10 text-white hover:bg-white/8 transition-colors cursor-pointer"
                        >
                        <span className="font-medium">ตั้งค่า</span>
                        {activeSection === "settings" ? (
                            <CaretUp weight="bold" className="w-4 h-4" />
                        ) : (
                            <CaretDown weight="bold" className="w-4 h-4" />
                        )}
                        </button>
                        <AnimatePresence>
                        {activeSection === "settings" && (
                            <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="overflow-hidden"
                            >
                            <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                                <Settings />
                            </div>
                            </motion.div>
                        )}
                        </AnimatePresence>
                    </div>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Reset confirmation dialog */}
      <Dialog open={showResetDialog} onOpenChange={setShowResetDialog}>
        <DialogContent className="bg-slate-900 border-white/10 text-white">
          <DialogHeader>
            <DialogTitle className="text-xl">ยืนยันการเริ่มใหม่</DialogTitle>
            <DialogDescription className="text-white/60">
              การดำเนินการนี้จะลบรายชื่อผู้โชคดีทั้งหมดและเริ่มจับรางวัลใหม่
              ท่านแน่ใจหรือไม่?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={() => setShowResetDialog(false)}
              className="flex-1 h-12 text-base font-semibold border-white/20 text-white bg-white/5 hover:bg-white/10 transition-all cursor-pointer mr-2"
            >
              ยกเลิก
            </Button>
            <Button
              onClick={handleReset}
              className="flex-1 h-12 text-base font-semibold bg-red-500 hover:bg-red-600 text-white shadow-lg shadow-red-500/20 transition-all cursor-pointer"
            >
              ยืนยัน เริ่มใหม่
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
