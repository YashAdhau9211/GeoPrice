export type SupportedCurrency = 'USD' | 'INR' | 'GBP';


export interface ExchangeRates {
  [currency: string]: number;
}

export interface CacheEntry {
  rates: ExchangeRates;
  timestamp: number;
}
