// Product type definitions matching backend API response

export interface Product {
  _id: string;
  name: string;
  description: string;
  basePrice: number;
  sku: string;
  images: string[];
  createdAt?: string;
  updatedAt?: string;
}
