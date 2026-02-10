import { Employee } from "@/types/employee";

/**
 * Select a random winner from the employee pool, excluding already-drawn IDs.
 * Respects nationality quotas.
 */
export function selectRandomWinner(
  employees: Employee[],
  winners: Employee[], // Pass full winner objects to check history
  quotas: { [key: string]: number }
): Employee | null {
  const excludeIds = new Set(winners.map((w) => w.id));

  // 1. Calculate current counts by nationality
  const currentCounts = winners.reduce((acc, w) => {
    const nat = w.nationality || "Thai"; // Default to Thai if undefined
    acc[nat] = (acc[nat] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // 2. Filter eligible employees
  const eligible = employees.filter((emp) => {
    // Exclude if already drawn
    if (excludeIds.has(emp.id)) return false;

    // Check quota
    const nat = emp.nationality || "Thai"; // Default to Thai
    const max = quotas[nat] || 0;
    const current = currentCounts[nat] || 0;

    return current < max;
  });

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
