// Country and API configuration constants

import { CountryConfig, CountryCode, CurrencyCode } from '@/types/currency';

// Supported countries with their configurations
export const COUNTRIES: CountryConfig[] = [
  {
    code: 'US',
    name: 'United States',
    currency: 'USD',
    locale: 'en-US',
    flag: '🇺🇸',
  },
  {
    code: 'IN',
    name: 'India',
    currency: 'INR',
    locale: 'en-IN',
    flag: '🇮🇳',
  },
  {
    code: 'GB',
    name: 'United Kingdom',
    currency: 'GBP',
    locale: 'en-GB',
    flag: '🇬🇧',
  },
];

// Default country for fallback when geolocation is unavailable
export const DEFAULT_COUNTRY: CountryCode = 'US';

// API endpoint paths
export const API_ENDPOINTS = {
  PRODUCTS: '/api/products',
  PRICE: '/api/price',
  CREATE_CHECKOUT: '/api/create-checkout-session',
} as const;

/**
 * Maps a country code to its corresponding currency code
 * @param countryCode - ISO 3166-1 alpha-2 country code
 * @returns ISO 4217 currency code
 */
export function getCountryCurrency(countryCode: string): CurrencyCode {
  const country = COUNTRIES.find((c) => c.code === countryCode);
  return (country?.currency as CurrencyCode) || 'USD';
}

/**
 * Gets the full country configuration for a given country code
 * @param countryCode - ISO 3166-1 alpha-2 country code
 * @returns CountryConfig object or undefined if not found
 */
export function getCountryConfig(countryCode: string): CountryConfig | undefined {
  return COUNTRIES.find((c) => c.code === countryCode);
}

/**
 * Validates if a country code is supported
 * @param countryCode - Country code to validate
 * @returns true if the country is supported, false otherwise
 */
export function isSupportedCountry(countryCode: string): boolean {
  return COUNTRIES.some((c) => c.code === countryCode);
}
