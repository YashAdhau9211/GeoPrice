import type { Request, Response, NextFunction } from 'express';
import { PaymentService } from '../services/Payment.service.js';
import { ValidationError } from '../utils/errors.js';
import { logger } from '../utils/logger.js';

export class WebhookController {
  constructor(private paymentService: PaymentService) {}

  /**
   * Handle Stripe webhook events
   * POST /api/webhook
   * @param req - Express request with raw body
   * @param res - Express response
   * @param next - Express next function
   */
  async handleStripeWebhook(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      // Get Stripe signature from headers
      const signature = req.headers['stripe-signature'];

      if (!signature || typeof signature !== 'string') {
        throw new ValidationError('Missing stripe-signature header');
      }

      // Get raw body (must be string for signature verification)
      const rawBody = (req as any).rawBody || JSON.stringify(req.body);

      // Verify webhook signature and construct event
      const event = await this.paymentService.verifyWebhookSignature(
        rawBody,
        signature
      );

      logger.info('Webhook event received', {
        eventType: event.type,
        eventId: event.id,
      });

      // Handle different event types
      switch (event.type) {
        case 'checkout.session.completed':
          const session = event.data.object as any;
          await this.paymentService.handleCheckoutComplete(session);
          logger.info('Checkout session completed successfully', {
            sessionId: session.id,
          });
          break;

        default:
          logger.info('Unhandled webhook event type', {
            eventType: event.type,
          });
      }

      // Respond with success
      res.json({ received: true });
    } catch (error) {
      next(error);
    }
  }
}
