export const COUNTRY_TO_CURRENCY: Record<string, string> = {
  // North America
  US: 'USD',
  CA: 'CAD',
  MX: 'MXN',

  // Europe
  GB: 'GBP',
  DE: 'EUR',
  FR: 'EUR',
  IT: 'EUR',
  ES: 'EUR',
  NL: 'EUR',
  BE: 'EUR',
  AT: 'EUR',
  PT: 'EUR',
  IE: 'EUR',
  FI: 'EUR',
  GR: 'EUR',
  CH: 'CHF',
  SE: 'SEK',
  NO: 'NOK',
  DK: 'DKK',
  PL: 'PLN',
  CZ: 'CZK',

  // Asia
  IN: 'INR',
  CN: 'CNY',
  JP: 'JPY',
  KR: 'KRW',
  SG: 'SGD',
  HK: 'HKD',
  TH: 'THB',
  MY: 'MYR',
  ID: 'IDR',
  PH: 'PHP',
  VN: 'VND',
  TW: 'TWD',

  // Oceania
  AU: 'AUD',
  NZ: 'NZD',

  // Middle East
  AE: 'AED',
  SA: 'SAR',
  IL: 'ILS',
  TR: 'TRY',

  // South America
  BR: 'BRL',
  AR: 'ARS',
  CL: 'CLP',
  CO: 'COP',

  // Africa
  ZA: 'ZAR',
  EG: 'EGP',
  NG: 'NGN',
  KE: 'KES',
};

/**
 * Get currency code for a given country code
 * @param countryCode - ISO 3166-1 alpha-2 country code
 * @returns Currency code (ISO 4217) or USD as default
 */
export const getCurrencyForCountry = (countryCode: string): string => {
  const normalizedCode = countryCode.toUpperCase();
  return COUNTRY_TO_CURRENCY[normalizedCode] || 'USD';
};
