import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IOrder extends Document {
  _id: mongoose.Types.ObjectId;
  productId: mongoose.Types.ObjectId;
  amount: number;
  currency: 'USD' | 'INR' | 'GBP';
  stripeSessionId: string;
  status: 'pending' | 'paid' | 'failed';
  customerCountry: string;
  createdAt: Date;
  updatedAt: Date;
}

const OrderSchema: Schema<IOrder> = new Schema(
  {
    productId: {
      type: Schema.Types.ObjectId,
      ref: 'Product',
      required: [true, 'Product ID is required'],
    },
    amount: {
      type: Number,
      required: [true, 'Amount is required'],
      min: [0, 'Amount must be a positive number'],
    },
    currency: {
      type: String,
      required: [true, 'Currency is required'],
      enum: {
        values: ['USD', 'INR', 'GBP'],
        message: '{VALUE} is not a supported currency',
      },
    },
    stripeSessionId: {
      type: String,
      required: [true, 'Stripe session ID is required'],
      unique: true,
      index: true,
    },
    status: {
      type: String,
      required: true,
      enum: {
        values: ['pending', 'paid', 'failed'],
        message: '{VALUE} is not a valid order status',
      },
      default: 'pending',
    },
    customerCountry: {
      type: String,
      required: [true, 'Customer country is required'],
      trim: true,
      uppercase: true,
    },
  },
  {
    timestamps: true,
  }
);

export const OrderModel: Model<IOrder> = mongoose.model<IOrder>('Order', OrderSchema);
