import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Triggers a profile update event to refresh profile pictures across components
 */
export function triggerProfileUpdate() {
  if (typeof window !== "undefined") {
    // Create and dispatch a custom event
    const event = new Event("profile-updated")
    window.dispatchEvent(event)
  }
}

