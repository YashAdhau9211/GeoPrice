import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * Combines class names using clsx and tailwind-merge
 * Useful for conditional styling with Tailwind CSS
 * @param inputs - Class names to combine
 * @returns Merged class name string
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Safely extracts a query parameter from URL search params
 * @param searchParams - URLSearchParams or object with query parameters
 * @param key - Parameter key to extract
 * @returns Parameter value or null if not found
 */
export function getQueryParam(
  searchParams: URLSearchParams | Record<string, string | string[] | undefined>,
  key: string
): string | null {
  if (searchParams instanceof URLSearchParams) {
    return searchParams.get(key);
  }
  
  const value = searchParams[key];
  if (typeof value === 'string') {
    return value;
  }
  if (Array.isArray(value) && value.length > 0) {
    return value[0];
  }
  
  return null;
}

/**
 * Delays execution for a specified number of milliseconds
 * Useful for implementing retry logic or debouncing
 * @param ms - Milliseconds to delay
 * @returns Promise that resolves after the delay
 */
export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Truncates a string to a maximum length and adds ellipsis
 * @param str - String to truncate
 * @param maxLength - Maximum length before truncation
 * @returns Truncated string with ellipsis if needed
 */
export function truncate(str: string, maxLength: number): string {
  if (str.length <= maxLength) {
    return str;
  }
  return str.slice(0, maxLength - 3) + '...';
}

/**
 * Checks if code is running in browser environment
 * @returns true if running in browser, false if on server
 */
export function isBrowser(): boolean {
  return typeof window !== 'undefined';
}

/**
 * Safely parses JSON with error handling
 * @param json - JSON string to parse
 * @param fallback - Fallback value if parsing fails
 * @returns Parsed object or fallback value
 */
export function safeJsonParse<T>(json: string, fallback: T): T {
  try {
    return JSON.parse(json) as T;
  } catch {
    return fallback;
  }
}
