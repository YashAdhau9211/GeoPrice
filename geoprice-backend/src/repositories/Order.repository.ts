import { OrderModel, type IOrder } from '../models/Order.model.js';

export class OrderRepository {
  /**
   * Create a new order
   * @param orderData - Partial order data
   * @returns Promise resolving to created order
   */
  async create(orderData: Partial<IOrder>): Promise<IOrder> {
    const order = new OrderModel(orderData);
    return await order.save();
  }

  /**
   * Find an order by Stripe session ID
   * @param sessionId - Stripe checkout session ID
   * @returns Promise resolving to order or null if not found
   */
  async findByStripeSessionId(sessionId: string): Promise<IOrder | null> {
    return await OrderModel.findOne({ stripeSessionId: sessionId }).exec();
  }

  /**
   * Update the status of an order
   * @param orderId - Order ID as string
   * @param status - New status value ('pending' | 'paid' | 'failed')
   * @returns Promise resolving to updated order or null if not found
   */
  async updateStatus(orderId: string, status: string): Promise<IOrder | null> {
    return await OrderModel.findByIdAndUpdate(
      orderId,
      { status },
      { new: true, runValidators: true }
    ).exec();
  }
}
