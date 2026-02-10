import { Employee } from "@/types/employee";

/**
 * Select a random winner from the employee pool, excluding already-drawn IDs.
 * Uses crypto-safe randomness when available.
 */
export function selectRandomWinner(
  employees: Employee[],
  excludeIds: string[]
): Employee | null {
  const eligible = employees.filter((emp) => !excludeIds.includes(emp.id));

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
