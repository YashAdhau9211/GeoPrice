'use client';

import { useState, useEffect, useCallback } from 'react';
import { Product } from '@/types/product';
import { apiClient } from '@/lib/api-client';
import { CountryCode } from '@/types/currency';

/**
 * Return type for the useLocalizedPrices hook
 */
export interface UseLocalizedPricesReturn {
  prices: Map<string, number>;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

/**
 * Custom hook for fetching and managing localized prices for products
 * 
 * This hook fetches localized prices from the backend API based on the user's
 * country. It automatically refetches prices when the country changes and
 * manages loading and error states. Prices are stored in a Map keyed by
 * product ID for efficient lookups.
 * 
 * @param products - Array of products to fetch prices for
 * @param country - ISO 3166-1 alpha-2 country code (e.g., "US", "IN", "GB")
 * @returns Object containing prices Map, loading state, error state, and refetch function
 * 
 * @example
 * ```tsx
 * const { prices, isLoading, error, refetch } = useLocalizedPrices(products, 'US');
 * 
 * // Get price for a specific product
 * const productPrice = prices.get(product._id);
 * 
 * // Check loading state
 * if (isLoading) {
 *   return <Skeleton />;
 * }
 * 
 * // Handle errors
 * if (error) {
 *   return <Alert>{error}</Alert>;
 * }
 * 
 * // Manually refetch prices
 * await refetch();
 * ```
 */
export function useLocalizedPrices(
  products: Product[],
  country: CountryCode
): UseLocalizedPricesReturn {
  // State for storing prices as a Map (productId -> localizedPrice)
  const [prices, setPrices] = useState<Map<string, number>>(new Map());
  
  // Loading state
  const [isLoading, setIsLoading] = useState<boolean>(true);
  
  // Error state
  const [error, setError] = useState<string | null>(null);

  /**
   * Fetches localized prices from the API
   */
  const fetchPrices = useCallback(async () => {
    // Don't fetch if there are no products
    if (!products || products.length === 0) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Fetch localized prices from backend
      const localizedPrices = await apiClient.getLocalizedPrices(country);

      // Convert array to Map for efficient lookups
      const pricesMap = new Map<string, number>();
      localizedPrices.forEach((priceData) => {
        pricesMap.set(priceData.productId, priceData.localizedPrice);
      });

      setPrices(pricesMap);
    } catch (err) {
      // Handle errors
      const errorMessage =
        err instanceof Error
          ? err.message
          : 'Failed to fetch localized prices. Please try again.';
      setError(errorMessage);
      console.error('Error fetching localized prices:', err);
    } finally {
      setIsLoading(false);
    }
  }, [products, country]);

  /**
   * Refetch function that can be called manually
   */
  const refetch = useCallback(async () => {
    await fetchPrices();
  }, [fetchPrices]);

  // Fetch prices on mount and when country or products change
  useEffect(() => {
    fetchPrices();
  }, [fetchPrices]);

  return {
    prices,
    isLoading,
    error,
    refetch,
  };
}
