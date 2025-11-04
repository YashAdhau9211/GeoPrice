import { renderHook, waitFor } from '@testing-library/react';
import { useLocalizedPrices } from '../useLocalizedPrices';
import { apiClient } from '@/lib/api-client';
import { Product } from '@/types/product';
import { CountryCode } from '@/types/currency';

// Mock the API client
vi.mock('@/lib/api-client', () => ({
  apiClient: {
    getLocalizedPrices: vi.fn(),
  },
}));

const mockProducts: Product[] = [
  {
    _id: 'prod1',
    name: 'Product 1',
    description: 'Description 1',
    basePrice: 10,
    sku: 'SKU1',
    images: ['image1.jpg'],
  },
  {
    _id: 'prod2',
    name: 'Product 2',
    description: 'Description 2',
    basePrice: 20,
    sku: 'SKU2',
    images: ['image2.jpg'],
  },
];

describe('useLocalizedPrices', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should fetch and store localized prices', async () => {
    const mockPrices = [
      { productId: 'prod1', localizedPrice: 10, currency: 'USD' },
      { productId: 'prod2', localizedPrice: 20, currency: 'USD' },
    ];

    vi.mocked(apiClient.getLocalizedPrices).mockResolvedValue(mockPrices);

    const { result } = renderHook(() =>
      useLocalizedPrices(mockProducts, 'US' as CountryCode)
    );

    expect(result.current.isLoading).toBe(true);

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.prices.get('prod1')).toBe(10);
    expect(result.current.prices.get('prod2')).toBe(20);
    expect(result.current.error).toBeNull();
  });

  it('should handle API errors', async () => {
    const errorMessage = 'Failed to fetch prices';
    vi.mocked(apiClient.getLocalizedPrices).mockRejectedValue(
      new Error(errorMessage)
    );

    const { result } = renderHook(() =>
      useLocalizedPrices(mockProducts, 'US' as CountryCode)
    );

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.error).toBe(errorMessage);
    expect(result.current.prices.size).toBe(0);
  });

  it('should refetch prices when country changes', async () => {
    const mockPricesUS = [
      { productId: 'prod1', localizedPrice: 10, currency: 'USD' },
    ];
    const mockPricesIN = [
      { productId: 'prod1', localizedPrice: 750, currency: 'INR' },
    ];

    vi.mocked(apiClient.getLocalizedPrices)
      .mockResolvedValueOnce(mockPricesUS)
      .mockResolvedValueOnce(mockPricesIN);

    const { result, rerender } = renderHook(
      ({ country }) => useLocalizedPrices(mockProducts, country),
      { initialProps: { country: 'US' as CountryCode } }
    );

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.prices.get('prod1')).toBe(10);

    rerender({ country: 'IN' as CountryCode });

    await waitFor(() => {
      expect(result.current.prices.get('prod1')).toBe(750);
    });

    expect(apiClient.getLocalizedPrices).toHaveBeenCalledTimes(2);
  });

  it('should not fetch when products array is empty', async () => {
    const { result } = renderHook(() =>
      useLocalizedPrices([], 'US' as CountryCode)
    );

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(apiClient.getLocalizedPrices).not.toHaveBeenCalled();
    expect(result.current.prices.size).toBe(0);
  });

  it('should allow manual refetch', async () => {
    const mockPrices = [
      { productId: 'prod1', localizedPrice: 10, currency: 'USD' },
    ];

    vi.mocked(apiClient.getLocalizedPrices).mockResolvedValue(mockPrices);

    const { result } = renderHook(() =>
      useLocalizedPrices(mockProducts, 'US' as CountryCode)
    );

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(apiClient.getLocalizedPrices).toHaveBeenCalledTimes(1);

    await result.current.refetch();

    expect(apiClient.getLocalizedPrices).toHaveBeenCalledTimes(2);
  });
});
