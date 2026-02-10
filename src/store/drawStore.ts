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
}

export const useDrawStore = create<DrawStore>((set, get) => ({
  // Initial state
  employees: [],
  winners: [],
  currentWinner: null,
  drawStatus: "idle",
  currentDraw: 0,
  maxDraws: 10,

  settings: {
    animationSpeed: 1,
    soundEnabled: true,
    confettiEnabled: true,
  },

  // Actions
  loadEmployees: (employees) => set({ employees }),

  startDraw: () =>
    set({
      drawStatus: "idle",
      currentDraw: 1,
      winners: [],
      currentWinner: null,
    }),

  drawWinner: () => {
    const { employees, winners } = get();
    const winnerIds = winners.map((w) => w.id);
    const winner = selectRandomWinner(employees, winnerIds);

    if (winner) {
      set({
        currentWinner: winner,
        drawStatus: "spinning",
      });
    }
  },

  revealWinner: () => {
    const { currentWinner, winners, currentDraw, maxDraws } = get();
    if (currentWinner) {
      const newWinners = [...winners, currentWinner];
      set({
        winners: newWinners,
        drawStatus: currentDraw >= maxDraws ? "completed" : "revealed",
      });
    }
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
}));
