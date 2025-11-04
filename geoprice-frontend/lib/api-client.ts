// API Client service for backend communication

import { Product } from '@/types/product';
import {
  ApiResponse,
  CheckoutSession,
  LocalizedPrice,
} from '@/types/api';
import { API_ENDPOINTS } from '@/constants/countries';
import { ApiError, NetworkError, ValidationError } from '@/lib/errors';

// Re-export error classes for backward compatibility
export { ApiError, NetworkError, ValidationError };

/**
 * API Client for communicating with the backend API
 * 
 * Performance Optimizations:
 * - Request deduplication: Prevents duplicate concurrent requests
 * - Error handling with retry guidance
 * - Efficient JSON parsing with fallback
 */
export class ApiClient {
  private baseUrl: string;
  private pendingRequests: Map<string, Promise<any>>;

  /**
   * Creates a new ApiClient instance
   * @param baseUrl - Base URL of the backend API
   */
  constructor(baseUrl: string) {
    this.baseUrl = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
    this.pendingRequests = new Map();
  }

  /**
   * Makes a fetch request with error handling and request deduplication
   * @param endpoint - API endpoint path
   * @param options - Fetch options
   * @returns Parsed JSON response
   * @throws {NetworkError} When network request fails
   * @throws {ApiError} When API returns an error response
   */
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    
    // Create a unique key for request deduplication
    const requestKey = `${options.method || 'GET'}:${endpoint}:${options.body || ''}`;
    
    // Check if there's already a pending request for this endpoint
    if (this.pendingRequests.has(requestKey)) {
      return this.pendingRequests.get(requestKey);
    }

    // Create the request promise
    const requestPromise = (async () => {
      try {
        const response = await fetch(url, {
        ...options,
          headers: {
            'Content-Type': 'application/json',
            ...options.headers,
          },
        });

        // Try to parse response body
        let data: ApiResponse<T>;
        try {
          data = await response.json();
        } catch (parseError) {
          // If JSON parsing fails, throw appropriate error
          if (!response.ok) {
            throw new ApiError(
              `Server returned ${response.status}: ${response.statusText}`,
              response.status,
              endpoint
            );
          }
          throw new ApiError(
            'Invalid response format from server',
            response.status,
            endpoint
          );
        }

        // Check if response indicates success
        if (!response.ok || !data.success) {
          const errorMessage =
            'error' in data ? data.error : 'An unknown error occurred';
          
          // Provide more helpful error messages based on status code
          let enhancedMessage = errorMessage;
          if (response.status === 404) {
            enhancedMessage = `${errorMessage}. The requested resource was not found.`;
          } else if (response.status === 500) {
            enhancedMessage = `${errorMessage}. Please try again later.`;
          } else if (response.status === 400) {
            enhancedMessage = `${errorMessage}. Please check your input and try again.`;
          } else if (response.status >= 500) {
            enhancedMessage = `Server error: ${errorMessage}. Please try again later.`;
          }
          
          throw new ApiError(enhancedMessage, response.status, endpoint);
        }

        return data.data;
      } catch (error) {
        // Handle network errors (connection failures, DNS errors, etc.)
        if (error instanceof TypeError) {
          throw new NetworkError(
            'Network request failed. Please check your internet connection and try again.',
            endpoint
          );
        }

        // Re-throw ApiError and NetworkError as-is
        if (error instanceof ApiError || error instanceof NetworkError) {
          throw error;
        }

        // Handle unexpected errors
        throw new NetworkError(
          error instanceof Error 
            ? `Unexpected error: ${error.message}` 
            : 'An unexpected error occurred. Please try again.',
          endpoint
        );
      } finally {
        // Clean up pending request
        this.pendingRequests.delete(requestKey);
      }
    })();

    // Store the pending request
    this.pendingRequests.set(requestKey, requestPromise);
    
    return requestPromise;
  }

  /**
   * Fetches all products from the backend
   * @returns Array of products
   * @throws {NetworkError} When network request fails
   * @throws {ApiError} When API returns an error
   */
  async getProducts(): Promise<Product[]> {
    return this.request<Product[]>(API_ENDPOINTS.PRODUCTS, {
      method: 'GET',
    });
  }

  /**
   * Fetches localized prices for all products based on country
   * @param country - ISO 3166-1 alpha-2 country code (e.g., "US", "IN", "GB")
   * @returns Array of localized prices
   * @throws {NetworkError} When network request fails
   * @throws {ApiError} When API returns an error
   */
  async getLocalizedPrices(country: string): Promise<LocalizedPrice[]> {
    const response = await this.request<{
      country: string;
      currency: string;
      products: Array<Product & { localizedPrice: number; currency: string }>;
    }>(API_ENDPOINTS.PRICE, {
      method: 'POST',
      body: JSON.stringify({ country }),
    });

    // Transform the response to match the expected LocalizedPrice format
    return response.products.map((product) => ({
      productId: product._id,
      localizedPrice: product.localizedPrice,
      currency: product.currency,
    }));
  }

  /**
   * Creates a Stripe checkout session for a product
   * @param productId - Product ID to purchase
   * @param currency - ISO 4217 currency code (e.g., "USD", "INR", "GBP")
   * @param country - ISO 3166-1 alpha-2 country code (e.g., "US", "IN", "GB")
   * @returns Checkout session with sessionId and sessionUrl
   * @throws {NetworkError} When network request fails
   * @throws {ApiError} When API returns an error
   */
  async createCheckoutSession(
    productId: string,
    currency: string,
    country: string
  ): Promise<CheckoutSession> {
    return this.request<CheckoutSession>(API_ENDPOINTS.CREATE_CHECKOUT, {
      method: 'POST',
      body: JSON.stringify({ productId, currency, country }),
    });
  }
}

/**
 * Default API client instance using environment variable for base URL
 */
export const apiClient = new ApiClient(
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'
);
