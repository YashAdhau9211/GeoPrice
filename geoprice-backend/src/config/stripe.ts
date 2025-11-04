import Stripe from 'stripe';
import { config } from './environment.js';

export const stripeClient = new Stripe(config.STRIPE_SECRET_KEY, {
  apiVersion: '2025-10-29.clover',
});
