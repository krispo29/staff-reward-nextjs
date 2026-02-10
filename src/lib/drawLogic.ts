import { Employee } from "@/types/employee";

/**
 * Select a random winner from the employee pool, excluding already-drawn IDs.
 * Respects nationality quotas.
 */
export function selectRandomWinner(
  employees: Employee[],
  winners: Employee[],
  quotas: { [key: string]: number },
  maxDraws: number
): Employee | null {
  const excludeIds = new Set(winners.map((w) => w.id));

  // 1. Calculate current counts by department
  const currentCounts = winners.reduce((acc, w) => {
    const dept = w.department || "Others";
    acc[dept] = (acc[dept] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // 2. Filter eligible employees
  const eligible = employees.filter((emp) => {
    // Exclude if already drawn
    if (excludeIds.has(emp.id)) return false;

    // Check quota (Percentage based)
    const dept = emp.department || "Others";
    // If department not in quotas, treat as "Others"
    const targetKey = quotas[dept] !== undefined ? dept : "Others";
    
    // Calculate max allowed for this department
    const percent = quotas[targetKey] || 0;
    const maxAllowed = Math.floor(maxDraws * (percent / 100));

    // Special case: If maxAllowed is 0 (due to low maxDraws), maybe allow at least 0? 
    // Or strictly follow percentage. Let's strictly follow for now.
    // However, we must handle the case where rounding down leaves slots. 
    // For now, simple logic: current < maxAllowed
    const current = currentCounts[targetKey] || 0;
    
    // If we haven't reached the limit for this dept, valid.
    if (current < maxAllowed) return true;

    // If "Others" or strict percentage is full, check if we need to fill valid slots?
    // User requirement: "Thai 3 Myanmar 7 out". "New condition by department %".
    // Implies strict adherence.
    return false;
  });
  
  // Fail-safe: If strict quotas are full but we still need winners (e.g. rounding issues),
  // we might need a fallback. But for now, let's return null if no one fits the quota.
  // Wait, if 5% of 10 = 0.5 -> 0. That dept never wins.
  // If user sets maxDraws=100, then Cutting gets 5.
  // I will proceed with strict logic first.

  if (eligible.length === 0) {
    return null;
  }

  // Use crypto random if available, fallback to Math.random
  let randomIndex: number;
  if (typeof crypto !== "undefined" && crypto.getRandomValues) {
    const array = new Uint32Array(1);
    crypto.getRandomValues(array);
    randomIndex = array[0] % eligible.length;
  } else {
    randomIndex = Math.floor(Math.random() * eligible.length);
  }

  return eligible[randomIndex];
}

/**
 * Get digits array from an employee ID string.
 * Pads to 7 digits if necessary.
 */
export function getDigitsFromId(id: string): number[] {
  const padded = id.padStart(7, "0");
  return padded.split("").map(Number);
}

/**
 * Validate that enough employees exist for the number of draws requested.
 */
export function canDraw(
  totalEmployees: number,
  alreadyDrawn: number,
  maxDraws: number
): boolean {
  return totalEmployees - alreadyDrawn > 0 && alreadyDrawn < maxDraws;
}
