import { ApiClient, ApiError, NetworkError } from '../api-client';
import { Product } from '@/types/product';

describe('ApiClient', () => {
  let apiClient: ApiClient;
  const baseUrl = 'http://localhost:5000/api';

  beforeEach(() => {
    apiClient = new ApiClient(baseUrl);
    vi.clearAllMocks();
  });

  describe('getProducts', () => {
    it('should fetch products successfully', async () => {
      const mockProducts: Product[] = [
        {
          _id: 'prod1',
          name: 'Product 1',
          description: 'Description 1',
          basePrice: 10,
          sku: 'SKU1',
          images: ['image1.jpg'],
        },
      ];

      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ success: true, data: mockProducts }),
      });

      const products = await apiClient.getProducts();

      expect(products).toEqual(mockProducts);
      expect(global.fetch).toHaveBeenCalledWith(
        `${baseUrl}/products`,
        expect.objectContaining({
          method: 'GET',
          headers: expect.objectContaining({
            'Content-Type': 'application/json',
          }),
        })
      );
    });

    it('should throw ApiError on API error', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error',
        json: async () => ({ success: false, error: 'Server error' }),
      });

      await expect(apiClient.getProducts()).rejects.toThrow(ApiError);
    });

    it('should throw NetworkError on network failure', async () => {
      global.fetch = vi.fn().mockRejectedValue(new TypeError('Network error'));

      await expect(apiClient.getProducts()).rejects.toThrow(NetworkError);
    });
  });

  describe('getLocalizedPrices', () => {
    it('should fetch localized prices successfully', async () => {
      const mockResponse = {
        country: 'US',
        currency: 'USD',
        products: [
          {
            _id: 'prod1',
            name: 'Product 1',
            description: 'Description 1',
            basePrice: 10,
            sku: 'SKU1',
            images: ['image1.jpg'],
            localizedPrice: 10,
            currency: 'USD',
          },
        ],
      };

      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ success: true, data: mockResponse }),
      });

      const prices = await apiClient.getLocalizedPrices('US');

      expect(prices).toEqual([
        {
          productId: 'prod1',
          localizedPrice: 10,
          currency: 'USD',
        },
      ]);
      expect(global.fetch).toHaveBeenCalledWith(
        `${baseUrl}/price`,
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify({ country: 'US' }),
        })
      );
    });
  });

  describe('createCheckoutSession', () => {
    it('should create checkout session successfully', async () => {
      const mockSession = {
        sessionId: 'sess_123',
        sessionUrl: 'https://checkout.stripe.com/sess_123',
      };

      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ success: true, data: mockSession }),
      });

      const session = await apiClient.createCheckoutSession(
        'prod1',
        'USD',
        'US'
      );

      expect(session).toEqual(mockSession);
      expect(global.fetch).toHaveBeenCalledWith(
        `${baseUrl}/create-checkout-session`,
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify({
            productId: 'prod1',
            currency: 'USD',
            country: 'US',
          }),
        })
      );
    });

    it('should throw ApiError with enhanced message for 404', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: false,
        status: 404,
        statusText: 'Not Found',
        json: async () => ({ success: false, error: 'Product not found' }),
      });

      await expect(
        apiClient.createCheckoutSession('invalid', 'USD', 'US')
      ).rejects.toThrow('Product not found. The requested resource was not found.');
    });
  });

  describe('request deduplication', () => {
    it('should deduplicate concurrent identical requests', async () => {
      const mockProducts: Product[] = [
        {
          _id: 'prod1',
          name: 'Product 1',
          description: 'Description 1',
          basePrice: 10,
          sku: 'SKU1',
          images: ['image1.jpg'],
        },
      ];

      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ success: true, data: mockProducts }),
      });

      // Make two concurrent requests
      const [result1, result2] = await Promise.all([
        apiClient.getProducts(),
        apiClient.getProducts(),
      ]);

      expect(result1).toEqual(mockProducts);
      expect(result2).toEqual(mockProducts);
      // Should only call fetch once due to deduplication
      expect(global.fetch).toHaveBeenCalledTimes(1);
    });
  });
});
