interface SuccessResponse<T = any> {
  success: true;
  data: T;
}

interface ErrorResponse {
  success: false;
  error: string;
}

/**
 * Format successful API response
 * @param data - Response data payload
 * @returns Formatted success response
 */
export const successResponse = <T = any>(data: T): SuccessResponse<T> => {
  return {
    success: true,
    data,
  };
};

/**
 * Format error API response
 * @param message - Error message
 * @returns Formatted error response
 */
export const errorResponse = (message: string): ErrorResponse => {
  return {
    success: false,
    error: message,
  };
};
