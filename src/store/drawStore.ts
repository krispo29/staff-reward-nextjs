import { create } from "zustand";
import { Employee, DrawStatus, DrawSettings } from "@/types/employee";
import { selectRandomWinner } from "@/lib/drawLogic";

interface DrawStore {
  // Employee data
  employees: Employee[];
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
  loadEmployees: (employees: Employee[]) => void;
  startDraw: () => void;
  drawWinner: () => void;
  revealWinner: () => void;
  nextDraw: () => void;
  reset: () => void;
  updateSettings: (settings: Partial<DrawSettings>) => void;
  acceptWinner: () => void;
  rejectWinner: () => void;
  clearError: () => void;
}

export const useDrawStore = create<DrawStore>((set, get) => ({
  // Initial state
  employees: [],
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
      Thai: 3,
      Myanmar: 7,
    },
  },

  // Actions
  loadEmployees: (employees) => set({ employees }),

  startDraw: () =>
    set({
      drawStatus: "idle",
      currentDraw: 1,
      winners: [],
      currentWinner: null,
      error: null,
    }),

  drawWinner: () => {
    const { employees, winners, settings } = get();
    // const winnerIds = winners.map((w) => w.id); // Removed unused
    const winner = selectRandomWinner(employees, winners, settings.quotas);

    if (winner) {
      set({
        currentWinner: winner,
        drawStatus: "spinning",
        error: null,
      });
    } else {
      set({
        error: "ไม่พบผู้โชคดีที่ตรงตามเงื่อนไข (โควต้าเต็มหรือไม่มีรายชื่อเหลืออยู่)",
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

  acceptWinner: () => {
    const { currentWinner, winners, currentDraw, maxDraws } = get();
    if (currentWinner) {
      const newWinners = [...winners, currentWinner];
      set({
        winners: newWinners,
        drawStatus: currentDraw >= maxDraws ? "completed" : "confirmed",
      });
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

  reset: () =>
    set({
      winners: [],
      currentWinner: null,
      drawStatus: "idle",
      currentDraw: 0,
    }),

  updateSettings: (newSettings) =>
    set((state) => ({
      settings: { ...state.settings, ...newSettings },
    })),

  clearError: () => set({ error: null }),
}));
