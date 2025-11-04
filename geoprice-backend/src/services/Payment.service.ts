import Stripe from 'stripe';
import type { IProduct } from '../models/Product.model.js';
import { OrderRepository } from '../repositories/Order.repository.js';
import { ValidationError } from '../utils/errors.js';
import { logger } from '../utils/logger.js';
import { config } from '../config/environment.js';

export class PaymentService {
  constructor(
    private stripeClient: Stripe,
    private orderRepo: OrderRepository
  ) {}

  /**
   * Create a Stripe Checkout session for a product
   * @param product - Product to create checkout for
   * @param currency - Currency code for the transaction
   * @param customerCountry - Customer's country code
   * @returns Promise resolving to session ID and URL
   */
  async createCheckoutSession(
    product: IProduct,
    currency: string,
    customerCountry: string
  ): Promise<{ sessionId: string; sessionUrl: string }> {
    try {
      // Convert price to smallest currency unit (cents, paise, pence)
      const amountInSmallestUnit = this.convertToSmallestUnit(
        product.basePrice,
        currency
      );

      // Create Stripe checkout session
      const session = await this.stripeClient.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [
          {
            price_data: {
              currency: currency.toLowerCase(),
              product_data: {
                name: product.name,
                description: product.description,
                images: product.images,
              },
              unit_amount: amountInSmallestUnit,
            },
            quantity: 1,
          },
        ],
        mode: 'payment',
        success_url: `${config.FRONTEND_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${config.FRONTEND_URL}/cancel`,
        metadata: {
          productId: product._id.toString(),
          customerCountry,
        },
      });

      if (!session.id || !session.url) {
        throw new Error('Stripe session creation failed - missing session ID or URL');
      }

      // Create pending order in database
      await this.orderRepo.create({
        productId: product._id,
        amount: product.basePrice,
        currency: currency as 'USD' | 'INR' | 'GBP',
        stripeSessionId: session.id,
        status: 'pending',
        customerCountry,
      });

      logger.info('Checkout session created successfully', {
        sessionId: session.id,
        productId: product._id.toString(),
        currency,
        amount: product.basePrice,
      });

      return {
        sessionId: session.id,
        sessionUrl: session.url,
      };
    } catch (error) {
      logger.error('Failed to create checkout session', error as Error, {
        productId: product._id.toString(),
        currency,
      });
      throw error;
    }
  }

  /**
   * Verify Stripe webhook signature
   * @param payload - Raw request body as string
   * @param signature - Stripe signature from header
   * @returns Promise resolving to verified Stripe event
   * @throws ValidationError if signature is invalid
   */
  async verifyWebhookSignature(
    payload: string,
    signature: string
  ): Promise<Stripe.Event> {
    try {
      const event = this.stripeClient.webhooks.constructEvent(
        payload,
        signature,
        config.STRIPE_WEBHOOK_SECRET
      );

      logger.info('Webhook signature verified successfully', {
        eventType: event.type,
        eventId: event.id,
      });

      return event;
    } catch (error) {
      logger.error('Webhook signature verification failed', error as Error);
      throw new ValidationError('Invalid webhook signature');
    }
  }

  /**
   * Handle completed checkout session
   * @param session - Stripe checkout session object
   */
  async handleCheckoutComplete(session: Stripe.Checkout.Session): Promise<void> {
    try {
      const sessionId = session.id;

      // Find the order by Stripe session ID
      const order = await this.orderRepo.findByStripeSessionId(sessionId);

      if (!order) {
        logger.warn('Order not found for completed checkout session', {
          sessionId,
        });
        return;
      }

      // Update order status to paid
      await this.orderRepo.updateStatus(order._id.toString(), 'paid');

      logger.info('Order marked as paid after successful checkout', {
        orderId: order._id.toString(),
        sessionId,
        productId: order.productId.toString(),
      });
    } catch (error) {
      logger.error('Failed to handle checkout completion', error as Error, {
        sessionId: session.id,
      });
      throw error;
    }
  }

  /**
   * Convert amount to smallest currency unit
   * @param amount - Amount in standard units
   * @param currency - Currency code
   * @returns Amount in smallest unit (e.g., cents)
   */
  private convertToSmallestUnit(amount: number, currency: string): number {
    // Most currencies use 2 decimal places (multiply by 100)
    // Zero-decimal currencies like JPY, KRW would need special handling
    // For this implementation, we support USD, INR, GBP which all use 2 decimals
    return Math.round(amount * 100);
  }
}
