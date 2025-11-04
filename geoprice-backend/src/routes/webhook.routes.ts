import express, { Router } from 'express';
import { WebhookController } from '../controllers/Webhook.controller.js';
import { PaymentService } from '../services/Payment.service.js';
import { OrderService } from '../services/Order.service.js';
import { OrderRepository } from '../repositories/Order.repository.js';
import { stripeClient } from '../config/stripe.js';

// Initialize dependencies
const orderRepository = new OrderRepository();
const orderService = new OrderService(orderRepository);
const paymentService = new PaymentService(stripeClient, orderService);
const webhookController = new WebhookController(paymentService);

// Create router
export const webhookRouter = Router();

webhookRouter.post(
  '/webhook',
  express.raw({ type: 'application/json' }),
  (req, res, next) => {
    webhookController.handleStripeWebhook(req, res, next);
  }
);
