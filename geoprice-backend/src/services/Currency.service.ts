import axios from 'axios';
import type { ExchangeRates, CacheEntry } from '../types/currency.types.js';
import { getCurrencyForCountry } from '../utils/currencyMapper.js';
import { ExternalServiceError, ValidationError } from '../utils/errors.js';
import { logger } from '../utils/logger.js';
import { config } from '../config/environment.js';

export class CurrencyService {
  private cache: CacheEntry | null = null;
  private readonly CACHE_DURATION = 15 * 60 * 1000; // 15 minutes in milliseconds

  /**
   * Get exchange rates with 15-minute caching
   * @param base - Base currency code (e.g., 'USD')
   * @param targets - Array of target currency codes
   * @returns Promise resolving to exchange rates object
   */
  async getExchangeRates(base: string, targets: string[]): Promise<ExchangeRates> {
    // Check if cache is valid
    if (this.isCacheValid()) {
      logger.info('Exchange rates cache hit', { base, targets });
      return this.cache!.rates;
    }

    // Cache miss - fetch fresh rates
    logger.info('Exchange rates cache miss - fetching from API', { base, targets });
    const rates = await this.fetchRatesFromAPI(base, targets);
    
    // Update cache
    this.cache = {
      rates,
      timestamp: Date.now(),
    };
    
    return rates;
  }

  /**
   * Convert price from one currency to another
   * @param amount - Amount to convert
   * @param fromCurrency - Source currency code
   * @param toCurrency - Target currency code
   * @returns Promise resolving to converted amount
   */
  async convertPrice(
    amount: number,
    fromCurrency: string,
    toCurrency: string
  ): Promise<number> {
    // If currencies are the same, no conversion needed
    if (fromCurrency === toCurrency) {
      return amount;
    }

    // Get exchange rates with base currency as fromCurrency
    const rates = await this.getExchangeRates(fromCurrency, [toCurrency]);
    
    if (!rates[toCurrency]) {
      logger.error('Exchange rate not found', new Error('Missing rate'), {
        fromCurrency,
        toCurrency,
        availableRates: Object.keys(rates),
      });
      throw new ValidationError(
        `Exchange rate not available for ${toCurrency}. Please check your input and try again.`
      );
    }

    // Convert and round to 2 decimal places
    const convertedAmount = amount * rates[toCurrency];
    return Math.round(convertedAmount * 100) / 100;
  }

  /**
   * Get currency code for a given country
   * @param countryCode - ISO 3166-1 alpha-2 country code
   * @returns Currency code (ISO 4217)
   */
  getCurrencyForCountry(countryCode: string): string {
    return getCurrencyForCountry(countryCode);
  }

  /**
   * Check if cached rates are still valid
   * @returns Boolean indicating cache validity
   */
  private isCacheValid(): boolean {
    if (!this.cache) {
      return false;
    }

    const now = Date.now();
    const cacheAge = now - this.cache.timestamp;
    
    return cacheAge < this.CACHE_DURATION;
  }

  /**
   * Fetch exchange rates from external API
   * @param base - Base currency code
   * @param targets - Array of target currency codes
   * @returns Promise resolving to exchange rates
   */
  private async fetchRatesFromAPI(base: string, targets: string[]): Promise<ExchangeRates> {
    try {
      // Using exchangerate-api.com which has a free tier
      const url = `https://v6.exchangerate-api.com/v6/${config.EXCHANGE_API_KEY}/latest/${base}`;
      
      logger.info('Fetching exchange rates from API', { url: url.replace(config.EXCHANGE_API_KEY, '***'), base, targets });
      
      const response = await axios.get(url, {
        timeout: 5000, // 5 second timeout
      });

      logger.info('API response received', { 
        status: response.status,
        hasData: !!response.data,
        hasRates: !!response.data?.conversion_rates,
        result: response.data?.result,
      });

      if (!response.data || !response.data.conversion_rates) {
        logger.error('Invalid API response format', undefined, { responseData: response.data });
        throw new Error('Invalid response format from exchange rate API');
      }

      // Cache ALL conversion rates from the API (not just requested ones)
      // This allows subsequent requests for different currencies to use the cache
      const allRates: ExchangeRates = response.data.conversion_rates;

      // Verify that requested target currencies are available
      const missingCurrencies: string[] = [];
      for (const target of targets) {
        if (!allRates[target]) {
          missingCurrencies.push(target);
        }
      }

      // Log if any currencies are missing
      if (missingCurrencies.length > 0) {
        logger.warn('Some currencies not found in API response', {
          base,
          missingCurrencies,
          availableCurrencies: Object.keys(allRates).slice(0, 10),
        });
      }

      logger.info('Successfully fetched exchange rates from API', {
        base,
        targets,
        totalRatesCount: Object.keys(allRates).length,
        requestedRatesCount: targets.length,
      });

      return allRates;
    } catch (error) {
      logger.error('Failed to fetch exchange rates from API', error as Error, {
        base,
        targets,
        errorMessage: error instanceof Error ? error.message : 'Unknown error',
        errorResponse: axios.isAxiosError(error) ? error.response?.data : undefined,
      });
      
      // If we have cached data (even if expired), use it as fallback
      if (this.cache) {
        logger.warn('Using expired cache as fallback for exchange rates');
        return this.cache.rates;
      }
      
      throw new ExternalServiceError('Exchange Rate Service');
    }
  }
}
