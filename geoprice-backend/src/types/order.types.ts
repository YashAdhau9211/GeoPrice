export type OrderStatus = 'pending' | 'paid' | 'failed';

export interface CreateOrderData {
  productId: string;
  amount: number;
  currency: string;
  stripeSessionId: string;
  customerCountry: string;
  status?: OrderStatus;
}
