export interface Employee {
  id: string; // 7-digit employee ID, e.g., "2210053"
  name?: string;
  department?: string;
}

export type DrawStatus = "idle" | "spinning" | "revealed" | "completed";

export interface DrawSettings {
  animationSpeed: number; // 0.5 = slow, 1 = normal, 2 = fast
  soundEnabled: boolean;
  confettiEnabled: boolean;
}

export interface Winner extends Employee {
  drawNumber: number; // 1-10
  drawnAt: Date;
}
