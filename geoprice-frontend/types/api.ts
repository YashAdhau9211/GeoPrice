// API response type definitions

// Generic API response wrappers
export interface ApiSuccessResponse<T> {
  success: true;
  data: T;
}

export interface ApiErrorResponse {
  success: false;
  error: string;
  statusCode?: number;
}

export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;

// Checkout session data
export interface CheckoutSession {
  sessionId: string;
  sessionUrl: string;
}

// Localized price data
export interface LocalizedPrice {
  productId: string;
  localizedPrice: number;
  currency: string;
}
