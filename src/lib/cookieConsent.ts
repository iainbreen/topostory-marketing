/**
 * Cookie Consent Management
 *
 * Manages GDPR-compliant cookie consent across topostory.com subdomains.
 * Consent is stored in a cookie that can be read by both app.topostory.com
 * and www.topostory.com.
 */

export interface ConsentCategories {
  necessary: true;
  analytics: boolean;
  marketing: boolean;
}

export interface ConsentState {
  version: number;
  timestamp: string;
  categories: ConsentCategories;
}

const COOKIE_NAME = 'topostory_consent';
const COOKIE_DOMAIN = '.topostory.com';
const COOKIE_MAX_AGE_DAYS = 365;
const CONSENT_VERSION = 1;

function parseConsent(cookieValue: string): ConsentState | null {
  try {
    const decoded = decodeURIComponent(cookieValue);
    const parsed = JSON.parse(decoded) as ConsentState;

    if (
      typeof parsed.version !== 'number' ||
      typeof parsed.timestamp !== 'string' ||
      typeof parsed.categories?.analytics !== 'boolean' ||
      typeof parsed.categories?.marketing !== 'boolean'
    ) {
      return null;
    }

    return parsed;
  } catch {
    return null;
  }
}

export function getConsent(): ConsentState | null {
  if (typeof document === 'undefined') return null;

  const match = document.cookie.match(new RegExp(`${COOKIE_NAME}=([^;]+)`));
  if (!match) return null;

  return parseConsent(match[1]);
}

export function setConsent(categories: Omit<ConsentCategories, 'necessary'>): void {
  const state: ConsentState = {
    version: CONSENT_VERSION,
    timestamp: new Date().toISOString(),
    categories: {
      necessary: true,
      analytics: categories.analytics,
      marketing: categories.marketing,
    },
  };

  const value = encodeURIComponent(JSON.stringify(state));
  const maxAge = COOKIE_MAX_AGE_DAYS * 24 * 60 * 60;

  const isLocalhost = typeof window !== 'undefined' && window.location.hostname === 'localhost';
  const domainPart = isLocalhost ? '' : `; domain=${COOKIE_DOMAIN}`;

  document.cookie = `${COOKIE_NAME}=${value}${domainPart}; path=/; max-age=${maxAge}; SameSite=Lax; Secure`;
}

export function hasConsented(): boolean {
  return getConsent() !== null;
}

export function isAnalyticsAllowed(): boolean {
  return getConsent()?.categories.analytics ?? false;
}

export function isMarketingAllowed(): boolean {
  return getConsent()?.categories.marketing ?? false;
}

export function clearConsent(): void {
  const isLocalhost = typeof window !== 'undefined' && window.location.hostname === 'localhost';
  const domainPart = isLocalhost ? '' : `; domain=${COOKIE_DOMAIN}`;

  document.cookie = `${COOKIE_NAME}=; path=/${domainPart}; max-age=0`;
}

export function acceptAll(): void {
  setConsent({ analytics: true, marketing: true });
}

export function rejectAll(): void {
  setConsent({ analytics: false, marketing: false });
}
