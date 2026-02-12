import { create } from "zustand";
import { toast } from "sonner";
import { Employee, DrawStatus, DrawSettings } from "@/types/employee";

interface DrawStore {
  // Employee data
  employees: Employee[];
  isLoading: boolean;
  // Draw state
  winners: Employee[];
  currentWinner: Employee | null;
  drawStatus: DrawStatus;
  currentDraw: number;
  maxDraws: number;
  error: string | null;
  // Settings
  settings: DrawSettings;
  // Actions
  fetchEmployees: () => Promise<void>;
  importEmployees: (employees: Employee[]) => Promise<void>;
  fetchWinners: () => Promise<void>;
  startDraw: () => void;
  drawWinner: (bypassApi?: boolean) => Promise<void>;
  revealWinner: () => void;
  nextDraw: () => void;
  reset: () => Promise<void>;
  fetchSettings: () => Promise<void>;
  saveSettings: (settings: Partial<DrawSettings>) => Promise<void>;
  acceptWinner: () => Promise<void>;
  rejectWinner: () => void;
  clearError: () => void;
  loadEmployees: (employees: Employee[]) => void;
  updateSettings: (settings: Partial<DrawSettings>) => Promise<void>;
  clearEmployees: () => Promise<void>;
}

export const useDrawStore = create<DrawStore>((set, get) => ({
  // Initial state
  employees: [],
  isLoading: false,
  winners: [],
  currentWinner: null,
  drawStatus: "idle",
  currentDraw: 0,
  maxDraws: 10,
  error: null,

  settings: {
    animationSpeed: 1,
    soundEnabled: true,
    confettiEnabled: true,
    quotas: {
      "Production": 10,
      "Cutting": 5,
      "Common": 20,
      "PE": 10,
      "Maintenance": 20,
      "Admin": 10,
      "QA": 15,
      "HR": 10, 
    },
  },

  // Actions
  loadEmployees: (employees) => set({ employees }), // Deprecated but kept for now

  fetchEmployees: async () => {
    set({ isLoading: true });
    try {
      const res = await fetch('/api/employees');
      if (!res.ok) throw new Error('Failed to fetch/api/employees');
      const data = await res.json();
      // Map Prisma Employee to strict Employee type if needed (dates are strings in JSON)
      const mapped = data.map((e: any) => ({
        ...e,
        id: e.employeeId, // Store uses string ID or mapped ID? check lib/drawLogic
        // The Store uses Employee interface. Let's assume it matches.
      }));
      set({ employees: mapped });
    } catch (e) {
      console.error(e);
      set({ error: "Failed to load employees" });
    } finally {
      set({ isLoading: false });
    }
  },

  importEmployees: async (employees) => {
     set({ isLoading: true });
     try {
       // Send to API
       // Map to match API expectation if needed. API expects array of objects.
       const res = await fetch('/api/employees', {
         method: 'POST',
         headers: { 'Content-Type': 'application/json' },
         body: JSON.stringify(employees)
       });
       if (!res.ok) throw new Error('Import failed');
       
       // Refresh list
       await get().fetchEmployees();
     } catch (e) {
       console.error(e);
       set({ error: "Failed to import employees" });
     } finally {
       set({ isLoading: false });
     }
  },

  fetchWinners: async () => {
    try {
      const res = await fetch('/api/winners');
      const data = await res.json();
      const mapped = data.map((w: any) => ({
          ...w,
          id: w.employeeId 
      }));
      set({ winners: mapped, currentDraw: mapped.length });
    } catch (e) {
      console.error(e);
    }
  },

  fetchSettings: async () => {
     try {
       const res = await fetch('/api/settings');
       const data = await res.json();
       if (data && Object.keys(data).length > 0) {
          // Merge with defaults
          set((state) => ({
             settings: { ...state.settings, quotas: data.quotas || state.settings.quotas }
          }));
       }
     } catch (e) { console.error(e); }
  },

  saveSettings: async (newSettings) => {
      // Optimistic update
      set((state) => ({
        settings: { ...state.settings, ...newSettings },
      }));
      // Sync to API
      try {
        await fetch('/api/settings', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newSettings) // Sending partial updates? API handles quotas/maxDraws structure?
          // Our API expects key-values.
          // If newSettings contains 'quotas', we send { quotas: ... }
        });
      } catch (e) { console.error(e); set({ error: "Failed to save settings" }); }
  },

  startDraw: () =>
    set({
      drawStatus: "idle",
      currentDraw: get().winners.length + 1, // Draw number is winners + 1
      // winners: [], // Don't clear winners on startDraw anymore!
      currentWinner: null,
      error: null,
    }),

  drawWinner: async () => {
    const { maxDraws } = get();
    set({ error: null });

    try {
        const res = await fetch('/api/draw/random', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ maxDraws })
        });
        
        if (!res.ok) {
            const data = await res.json();
            throw new Error(data.error || 'Failed to draw winner');
        }

        const data = await res.json();
        const winner = data.winner;

        if (winner) {
            set({
                currentWinner: winner,
                drawStatus: "spinning",
                error: null,
            });
        }
    } catch (e) {
        const errorMsg = e instanceof Error ? e.message : "ไม่พบผู้โชคดีที่ตรงตามเงื่อนไข";
        set({ error: errorMsg });
        
        // Dynamic import to avoid SSR issues if any, or just direct import if fine.
        // We can just use the imported 'toast'
        toast.error('การจับรางวัลล้มเหลว', {
          description: errorMsg,
          duration: 4000,
        });
    }
  },

  revealWinner: () => {
    const { currentWinner } = get();
    if (currentWinner) {
      set({
        drawStatus: "revealed",
      });
    }
  },

  acceptWinner: async () => {
    const { currentWinner, winners, currentDraw, maxDraws } = get();
    if (currentWinner) {
      // Optimistic
      const newWinners = [...winners, currentWinner];
      set({
        winners: newWinners,
        drawStatus: currentDraw >= maxDraws ? "completed" : "confirmed",
      });
      
      // API Call
      try {
        await fetch('/api/winners', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
             employeeId: currentWinner.id, 
             drawRound: currentDraw 
          })
        });
      } catch (e) {
         console.error(e);
         set({ error: "Failed to save winner to database" });
         // Rollback? complex.
      }
    }
  },

  rejectWinner: () => {
    set({
      currentWinner: null,
      drawStatus: "idle",
    });
  },

  nextDraw: () => {
    const { currentDraw } = get();
    set({
      currentDraw: currentDraw + 1,
      currentWinner: null,
      drawStatus: "idle",
    });
  },

  reset: async () => {
    set({ winners: [], currentWinner: null, drawStatus: "idle", currentDraw: 0 });
    try {
        await fetch('/api/winners', { method: 'DELETE' });
    } catch(e) { console.error(e); }
  },



  updateSettings: (newSettings: Partial<DrawSettings>) => get().saveSettings(newSettings), // Alias to saveSettings for compat

  clearEmployees: async () => {
    set({ isLoading: true });
    try {
      const res = await fetch('/api/employees', { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete employees');
      set({ employees: [] });
      toast.success("ลบข้อมูลพนักงานทั้งหมดเรียบร้อยแล้ว");
    } catch (e) {
      console.error(e);
      set({ error: "Failed to clear employees" });
      toast.error("เกิดข้อผิดพลาดในการลบข้อมูล");
    } finally {
      set({ isLoading: false });
    }
  },

  clearError: () => set({ error: null }),
}));
