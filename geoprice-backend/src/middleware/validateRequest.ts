import type { Request, Response, NextFunction } from 'express';
import { ValidationError } from '../utils/errors.js';


const SUPPORTED_CURRENCIES = ['USD', 'INR', 'GBP'];


export const validateCheckoutRequest = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const { productId, currency } = req.body;

  // Validate productId is provided
  if (!productId) {
    throw new ValidationError('productId is required');
  }

  // Validate productId is a valid string
  if (typeof productId !== 'string' || productId.trim().length === 0) {
    throw new ValidationError('productId must be a valid string');
  }

  // Validate currency is provided
  if (!currency) {
    throw new ValidationError('currency is required');
  }

  // Validate currency is one of the supported values
  if (!SUPPORTED_CURRENCIES.includes(currency)) {
    throw new ValidationError(
      `currency must be one of: ${SUPPORTED_CURRENCIES.join(', ')}`
    );
  }

  next();
};

export const validatePriceRequest = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const { country } = req.body;

  // Validate country is provided
  if (!country) {
    throw new ValidationError('country is required');
  }

  // Validate country is a valid string
  if (typeof country !== 'string' || country.trim().length === 0) {
    throw new ValidationError('country must be a valid string');
  }

  // Validate country code is 2 characters (ISO 3166-1 alpha-2)
  if (country.length !== 2) {
    throw new ValidationError('country must be a 2-character ISO country code');
  }

  next();
};
