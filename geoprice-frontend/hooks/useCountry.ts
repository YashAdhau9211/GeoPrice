'use client';

import { useState, useCallback } from 'react';
import { getCountryCurrency } from '@/constants/countries';
import { CountryCode, CurrencyCode } from '@/types/currency';

/**
 * Return type for the useCountry hook
 */
export interface UseCountryReturn {
  country: CountryCode;
  currency: CurrencyCode;
  setCountry: (country: CountryCode) => void;
}

/**
 * Custom hook for managing country detection and selection state
 * 
 * This hook manages the user's selected country and automatically maps it
 * to the corresponding currency code. It accepts an initial country from
 * server-side detection and allows manual override through the setCountry function.
 * 
 * @param initialCountry - Country code detected from server (e.g., from Vercel geolocation header)
 * @returns Object containing current country, currency, and setCountry function
 * 
 * @example
 * ```tsx
 * const { country, currency, setCountry } = useCountry('US');
 * 
 * // Display current country and currency
 * console.log(country); // 'US'
 * console.log(currency); // 'USD'
 * 
 * // Change country (e.g., from country selector)
 * setCountry('IN'); // Updates country to 'IN' and currency to 'INR'
 * ```
 */
export function useCountry(initialCountry: CountryCode): UseCountryReturn {
  // Initialize country state with server-detected value
  const [country, setCountryState] = useState<CountryCode>(initialCountry);

  // Derive currency from current country using mapping logic
  const currency = getCountryCurrency(country);

  // Memoized setter to update country state
  const setCountry = useCallback((newCountry: CountryCode) => {
    setCountryState(newCountry);
  }, []);

  return {
    country,
    currency,
    setCountry,
  };
}
