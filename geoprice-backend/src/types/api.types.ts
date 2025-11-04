export interface CreateCheckoutRequest {
  productId: string;
  currency: string;
  country: string;
}


export interface CreateCheckoutResponse {
  sessionId: string;
  sessionUrl: string;
}

export interface GetPriceRequest {
  country: string;
}

export interface GetRatesQuery {
  base: string;
  targets: string;
}

export interface SuccessResponse<T = any> {
  success: true;
  data: T;
}


export interface ErrorResponse {
  success: false;
  error: string;
  statusCode?: number;
}
