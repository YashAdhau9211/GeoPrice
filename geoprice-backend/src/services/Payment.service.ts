import Stripe from 'stripe';
import type { IProduct } from '../models/Product.model.js';
import { OrderService } from './Order.service.js';
import { ValidationError } from '../utils/errors.js';
import { logger } from '../utils/logger.js';
import { config } from '../config/environment.js';

export class PaymentService {
  constructor(
    private stripeClient: Stripe,
    private orderService: OrderService
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
      const amountInSmallestUnit = this.convertToSmallestUnit(
        product.basePrice,
        currency
      );

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

      await this.orderService.createPendingOrder({
        productId: product._id.toString(),
        amount: product.basePrice,
        currency: currency,
        stripeSessionId: session.id,
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

      await this.orderService.markOrderAsPaid(sessionId);

      logger.info('Order marked as paid after successful checkout', {
        sessionId,
      });
    } catch (error) {
      logger.error('Failed to handle checkout completion', error as Error, {
        sessionId: session.id,
      });
      throw error;
    }
  }


  private convertToSmallestUnit(amount: number, currency: string): number {
    return Math.round(amount * 100);
  }
}
