/**
 * UTM Parameter Tracking Utilities
 *
 * Provides functions for extracting, storing, and managing UTM campaign parameters
 * for first-touch attribution tracking in PostHog.
 */

export interface UTMParameters {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_term?: string;
  utm_content?: string;
}

const STORAGE_KEY = 'topostory_utm';
const VALID_UTM_PARAMS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'];

/**
 * Extract UTM parameters from the current URL
 */
export function getUTMParametersFromURL(): UTMParameters {
  if (typeof window === 'undefined') return {};

  const params: UTMParameters = {};
  const urlParams = new URLSearchParams(window.location.search);

  VALID_UTM_PARAMS.forEach((param) => {
    const value = urlParams.get(param);
    if (value) {
      params[param as keyof UTMParameters] = value;
    }
  });

  return params;
}

/**
 * Check if any UTM parameters exist in the object
 */
export function hasUTMParameters(params: UTMParameters): boolean {
  return Object.keys(params).length > 0;
}

/**
 * Get stored UTM parameters from sessionStorage
 */
export function getStoredUTMParameters(): UTMParameters | null {
  if (typeof window === 'undefined' || typeof sessionStorage === 'undefined') {
    return null;
  }

  try {
    const stored = sessionStorage.getItem(STORAGE_KEY);
    if (!stored) return null;

    const parsed = JSON.parse(stored);
    return parsed as UTMParameters;
  } catch {
    return null;
  }
}

/**
 * Store UTM parameters in sessionStorage
 */
export function storeUTMParameters(params: UTMParameters): void {
  if (typeof window === 'undefined' || typeof sessionStorage === 'undefined') {
    return;
  }

  if (!hasUTMParameters(params)) return;

  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(params));
  } catch {
    // Silently fail if sessionStorage is not available
  }
}

/**
 * Clear stored UTM parameters from sessionStorage
 */
export function clearStoredUTMParameters(): void {
  if (typeof window === 'undefined' || typeof sessionStorage === 'undefined') {
    return;
  }

  try {
    sessionStorage.removeItem(STORAGE_KEY);
  } catch {
    // Silently fail
  }
}

/**
 * Append UTM parameters to a URL
 * @param url - The URL to append parameters to
 * @param params - The UTM parameters to append
 * @returns The URL with appended UTM parameters
 */
export function appendUTMParametersToURL(url: string, params: UTMParameters): string {
  if (!hasUTMParameters(params)) return url;

  try {
    const urlObj = new URL(url);

    Object.entries(params).forEach(([key, value]) => {
      if (value && !urlObj.searchParams.has(key)) {
        urlObj.searchParams.set(key, value);
      }
    });

    return urlObj.toString();
  } catch {
    // If URL parsing fails, return original URL
    return url;
  }
}
