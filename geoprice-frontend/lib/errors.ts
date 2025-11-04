/**
 * Custom error classes for the GeoPrice frontend application
 */

/**
 * Error thrown when an API request fails with a non-2xx status code
 */
export class ApiError extends Error {
  constructor(
    message: string,
    public statusCode: number,
    public endpoint: string
  ) {
    super(message);
    this.name = 'ApiError';
    // Maintains proper stack trace for where our error was thrown (only available on V8)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ApiError);
    }
  }
}

/**
 * Error thrown when a network request fails (e.g., no internet connection, DNS failure)
 */
export class NetworkError extends Error {
  constructor(message: string, public endpoint: string) {
    super(message);
    this.name = 'NetworkError';
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, NetworkError);
    }
  }
}

/**
 * Error thrown when validation fails (e.g., invalid input data)
 */
export class ValidationError extends Error {
  constructor(message: string, public field: string) {
    super(message);
    this.name = 'ValidationError';
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ValidationError);
    }
  }
}
