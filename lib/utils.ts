import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Calculate age from date of birth
 * @param dob - Date of birth in ISO string format (e.g., "2026-01-21")
 * @returns Age in years as a string, or "N/A" if invalid
 */
export function calculateAge(dob: string): string {
  if (!dob) return "N/A";

  try {
    const birthDate = new Date(dob);
    const today = new Date();

    // Check if birth date is valid
    if (isNaN(birthDate.getTime())) {
      return "N/A";
    }

    // Handle future dates
    if (birthDate > today) {
      return "N/A";
    }

    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    const dayDiff = today.getDate() - birthDate.getDate();

    // If birthday hasn't occurred this year yet, subtract 1
    if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
      age--;
    }

    // For very young pets (less than 1 year), show months
    if (age === 0) {
      const months = monthDiff + (dayDiff >= 0 ? 1 : 0);
      if (months > 0) {
        return `${months} month${months > 1 ? "s" : ""}`;
      } else {
        const days = Math.floor(
          (today.getTime() - birthDate.getTime()) / (1000 * 60 * 60 * 24),
        );
        return `${days} day${days > 1 ? "s" : ""}`;
      }
    }

    return age.toString();
  } catch (error) {
    return "N/A";
  }
}

/**
 * Format a date string to DD/MM/YYYY format
 * @param dateString - Date in ISO string format or any valid date string
 * @returns Formatted date as DD/MM/YYYY, or "—" if invalid or null
 */
export function formatDate(dateString: string | null | undefined): string {
  if (!dateString) return "—";

  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "—";

    return date.toLocaleDateString("en-GB"); // DD/MM/YYYY
  } catch (error) {
    return "—";
  }
}
