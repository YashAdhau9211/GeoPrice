// Currency formatting service using Intl.NumberFormat

import { CurrencyCode } from '@/types/currency';
import { COUNTRIES } from '@/constants/countries';

/**
 * Currency formatter service for consistent currency display across the application
 */
export class CurrencyFormatter {
  /**
   * Formats an amount with the appropriate currency symbol and locale
   * @param amount - Numeric amount to format
   * @param currency - ISO 4217 currency code (e.g., "USD", "INR", "GBP")
   * @returns Formatted currency string (e.g., "$10.00", "₹750.00", "£8.50")
   */
  static format(amount: number, currency: string): string {
    const locale = this.getLocale(currency);
    
    try {
      return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency: currency,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(amount);
    } catch (error) {
      // Fallback to basic formatting if Intl fails
      console.error(`Error formatting currency ${currency}:`, error);
      return `${this.getSymbol(currency)}${amount.toFixed(2)}`;
    }
  }

  /**
   * Extracts the currency symbol for a given currency code
   * @param currency - ISO 4217 currency code (e.g., "USD", "INR", "GBP")
   * @returns Currency symbol (e.g., "$", "₹", "£")
   */
  static getSymbol(currency: string): string {
    const locale = this.getLocale(currency);
    
    try {
      // Format 0 to extract just the symbol
      const formatted = new Intl.NumberFormat(locale, {
        style: 'currency',
        currency: currency,
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(0);
      
      // Remove digits and whitespace to get symbol
      return formatted.replace(/[\d\s.,]/g, '');
    } catch (error) {
      // Fallback symbols
      const symbolMap: Record<string, string> = {
        USD: '$',
        INR: '₹',
        GBP: '£',
      };
      return symbolMap[currency] || currency;
    }
  }

  /**
   * Maps a currency code to its appropriate locale for formatting
   * @param currency - ISO 4217 currency code (e.g., "USD", "INR", "GBP")
   * @returns BCP 47 locale string (e.g., "en-US", "en-IN", "en-GB")
   */
  static getLocale(currency: string): string {
    // Find the country configuration that uses this currency
    const country = COUNTRIES.find((c) => c.currency === currency);
    
    if (country) {
      return country.locale;
    }
    
    // Fallback locale mapping
    const localeMap: Record<string, string> = {
      USD: 'en-US',
      INR: 'en-IN',
      GBP: 'en-GB',
    };
    
    return localeMap[currency] || 'en-US';
  }

  /**
   * Formats an amount as a compact currency string (e.g., "$1.2K", "₹75K")
   * Useful for displaying large amounts in limited space
   * @param amount - Numeric amount to format
   * @param currency - ISO 4217 currency code
   * @returns Compact formatted currency string
   */
  static formatCompact(amount: number, currency: string): string {
    const locale = this.getLocale(currency);
    
    try {
      return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency: currency,
        notation: 'compact',
        minimumFractionDigits: 0,
        maximumFractionDigits: 1,
      }).format(amount);
    } catch (error) {
      // Fallback to regular format
      return this.format(amount, currency);
    }
  }

  /**
   * Parses a formatted currency string back to a number
   * Note: This is a basic implementation and may not handle all edge cases
   * @param formattedAmount - Formatted currency string
   * @returns Numeric value or NaN if parsing fails
   */
  static parse(formattedAmount: string): number {
    // Remove currency symbols, spaces, and commas
    const cleaned = formattedAmount.replace(/[^\d.-]/g, '');
    return parseFloat(cleaned);
  }
}
