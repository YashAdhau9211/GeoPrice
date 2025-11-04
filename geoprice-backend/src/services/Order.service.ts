import mongoose from 'mongoose';
import { OrderRepository } from '../repositories/Order.repository.js';
import type { IOrder } from '../models/Order.model.js';
import type { CreateOrderData } from '../types/order.types.js';
import { NotFoundError } from '../utils/errors.js';
import { logger } from '../utils/logger.js';

export class OrderService {
  constructor(private orderRepo: OrderRepository) {}

  /**
   * Create a new pending order
   * @param orderData - Order creation data
   * @returns Promise resolving to created order
   */
  async createPendingOrder(orderData: CreateOrderData): Promise<IOrder> {
    const order = await this.orderRepo.create({
      ...orderData,
      productId: new mongoose.Types.ObjectId(orderData.productId),
      currency: orderData.currency as 'USD' | 'INR' | 'GBP',
      status: 'pending',
    });

    logger.info('Pending order created', {
      orderId: order._id.toString(),
      productId: orderData.productId,
      stripeSessionId: orderData.stripeSessionId,
    });

    return order;
  }

  /**
   * Mark an order as paid using Stripe session ID
   * @param stripeSessionId - Stripe checkout session ID
   * @returns Promise resolving to updated order
   * @throws NotFoundError if order doesn't exist
   */
  async markOrderAsPaid(stripeSessionId: string): Promise<IOrder> {
    const order = await this.orderRepo.findByStripeSessionId(stripeSessionId);

    if (!order) {
      throw new NotFoundError('Order');
    }

    const updatedOrder = await this.orderRepo.updateStatus(
      order._id.toString(),
      'paid'
    );

    if (!updatedOrder) {
      throw new NotFoundError('Order');
    }

    logger.info('Order marked as paid', {
      orderId: updatedOrder._id.toString(),
      stripeSessionId,
    });

    return updatedOrder;
  }

  /**
   * Get an order by Stripe session ID
   * @param sessionId - Stripe checkout session ID
   * @returns Promise resolving to order or null if not found
   */
  async getOrderBySessionId(sessionId: string): Promise<IOrder | null> {
    return await this.orderRepo.findByStripeSessionId(sessionId);
  }
}
