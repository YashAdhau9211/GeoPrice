// Currency and country type definitions

export interface CountryConfig {
  code: string;        // ISO 3166-1 alpha-2 (e.g., "US", "IN", "GB")
  name: string;        // Display name (e.g., "United States")
  currency: string;    // ISO 4217 currency code (e.g., "USD", "INR", "GBP")
  locale: string;      // BCP 47 locale (e.g., "en-US", "en-IN", "en-GB")
  flag: string;        // Emoji flag
}

export type CountryCode = 'US' | 'IN' | 'GB';
export type CurrencyCode = 'USD' | 'INR' | 'GBP';
