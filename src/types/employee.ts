export interface Employee {
  id: string; // 7-digit employee ID, e.g., "2210053"
  name?: string;
  department?: string;
  plant?: string;
  section?: string;
  position?: string;
  nationality?: "Thai" | "Myanmar";
}

export type DrawStatus = "idle" | "spinning" | "revealed" | "confirmed" | "completed";

export interface DrawSettings {
  animationSpeed: number; // 0.5 = slow, 1 = normal, 2 = fast
  soundEnabled: boolean;
  confettiEnabled: boolean;
  quotas: {
    Thai: number;
    Myanmar: number;
  };
}

export interface Winner extends Employee {
  drawNumber: number; // 1-10
  drawnAt: Date;
}
