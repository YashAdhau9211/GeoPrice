import axios from 'axios';
import type { ExchangeRates, CacheEntry } from '../types/currency.types.js';
import { getCurrencyForCountry } from '../utils/currencyMapper.js';
import { ExternalServiceError, ValidationError } from '../utils/errors.js';
import { logger } from '../utils/logger.js';
import { config } from '../config/environment.js';

export class CurrencyService {
  private cache: CacheEntry | null = null;
  private readonly CACHE_DURATION = 15 * 60 * 1000;

  /**
   * Get exchange rates with 15-minute caching
   */
  async getExchangeRates(base: string, targets: string[]): Promise<ExchangeRates> {
    if (this.isCacheValid()) {
      logger.info('Exchange rates cache hit', { base, targets });
      return this.cache!.rates;
    }

    logger.info('Exchange rates cache miss - fetching from API', { base, targets });
    const rates = await this.fetchRatesFromAPI(base, targets);
    
    this.cache = {
      rates,
      timestamp: Date.now(),
    };
    
    return rates;
  }

  async convertPrice(
    amount: number,
    fromCurrency: string,
    toCurrency: string
  ): Promise<number> {
    if (fromCurrency === toCurrency) {
      return amount;
    }

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

    const convertedAmount = amount * rates[toCurrency];
    return Math.round(convertedAmount * 100) / 100;
  }

  getCurrencyForCountry(countryCode: string): string {
    return getCurrencyForCountry(countryCode);
  }

  private isCacheValid(): boolean {
    if (!this.cache) {
      return false;
    }

    const now = Date.now();
    const cacheAge = now - this.cache.timestamp;
    
    return cacheAge < this.CACHE_DURATION;
  }

  private async fetchRatesFromAPI(base: string, targets: string[]): Promise<ExchangeRates> {
    try {
      const url = `https://v6.exchangerate-api.com/v6/${config.EXCHANGE_API_KEY}/latest/${base}`;
      
      logger.info('Fetching exchange rates from API', { url: url.replace(config.EXCHANGE_API_KEY, '***'), base, targets });
      
      const response = await axios.get(url, {
        timeout: 5000,
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

      const allRates: ExchangeRates = response.data.conversion_rates;

      const missingCurrencies: string[] = [];
      for (const target of targets) {
        if (!allRates[target]) {
          missingCurrencies.push(target);
        }
      }

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
      
      if (this.cache) {
        logger.warn('Using expired cache as fallback for exchange rates');
        return this.cache.rates;
      }
      
      throw new ExternalServiceError('Exchange Rate Service');
    }
  }
}
