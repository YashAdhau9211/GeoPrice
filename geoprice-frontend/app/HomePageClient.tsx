"use client"

import { useState } from 'react';
import { Product } from '@/types/product';
import { CountryCode } from '@/types/currency';
import { useCountry } from '@/hooks/useCountry';
import { useLocalizedPrices } from '@/hooks/useLocalizedPrices';
import { apiClient } from '@/lib/api-client';
import { Header } from '@/components/Header';
import { ProductCard } from '@/components/ProductCard';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';

interface HomePageClientProps {
  initialCountry: CountryCode;
  initialProducts: Product[];
  initialError: string | null;
}

/**
 * Home Page Client Component
 * 
 * This client component handles:
 * - Country selection and management using useCountry hook
 * - Fetching localized prices using useLocalizedPrices hook
 * - Rendering the product grid with ProductCard components
 * - Handling country selector changes
 * - Implementing the checkout flow (create session and redirect)
 * - Displaying loading states with Skeleton components
 * - Displaying error states with Alert components
 * - Responsive grid layout (1 column mobile, 2-3 columns desktop)
 * 
 * Performance Optimizations:
 * - Receives initial products from server (no client-side fetch needed)
 * - Fetches only localized prices on client (smaller payload)
 * - Automatic refetch when country changes (efficient updates)
 * - Request deduplication prevents duplicate API calls
 * - Loading states provide immediate feedback
 * 
 * Requirements: 1.2, 1.3, 1.4, 2.4, 3.1, 3.2, 3.4, 4.3, 4.4, 5.2, 5.3, 5.4, 5.5, 8.1, 8.2, 8.3, 10.1, 10.2, 11.3
 */
export function HomePageClient({ 
  initialCountry, 
  initialProducts,
  initialError 
}: HomePageClientProps) {
  // Manage country and currency state
  const { country, currency, setCountry } = useCountry(initialCountry);
  
  // Fetch localized prices based on country
  const { prices, isLoading: isPricesLoading, error: pricesError } = useLocalizedPrices(
    initialProducts,
    country
  );

  // State for checkout errors
  const [checkoutError, setCheckoutError] = useState<string | null>(null);

  /**
   * Handles the "Buy Now" button click
   * Creates a checkout session and redirects to Stripe
   */
  const handleBuyNow = async (productId: string) => {
    setCheckoutError(null);
    
    try {
      // Create checkout session
      const session = await apiClient.createCheckoutSession(
        productId,
        currency,
        country
      );

      // Redirect to Stripe Checkout
      window.location.href = session.sessionUrl;
    } catch (error) {
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'Failed to initiate checkout. Please try again.';
      setCheckoutError(errorMessage);
      console.error('Checkout error:', error);
    }
  };

  /**
   * Handles country selector changes
   */
  const handleCountryChange = (newCountry: string) => {
    setCountry(newCountry as CountryCode);
    setCheckoutError(null); // Clear any previous checkout errors
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header with country selector */}
      <Header country={country} onCountryChange={handleCountryChange} />

      {/* Main content */}
      <div className="container mx-auto px-4 py-8">
        {/* Page title */}
        <div className="mb-8">
          <h2 className="text-3xl md:text-4xl font-bold mb-2">
            Shop Our Products
          </h2>
          <p className="text-muted-foreground">
            Prices displayed in your local currency
          </p>
        </div>

        {/* Error alerts */}
        {initialError && (
          <Alert variant="destructive" className="mb-6" role="alert" aria-live="assertive">
            <AlertTitle>Error Loading Products</AlertTitle>
            <AlertDescription>{initialError}</AlertDescription>
          </Alert>
        )}

        {pricesError && (
          <Alert variant="destructive" className="mb-6" role="alert" aria-live="assertive">
            <AlertTitle>Error Loading Prices</AlertTitle>
            <AlertDescription>{pricesError}</AlertDescription>
          </Alert>
        )}

        {checkoutError && (
          <Alert variant="destructive" className="mb-6" role="alert" aria-live="assertive">
            <AlertTitle>Checkout Error</AlertTitle>
            <AlertDescription>{checkoutError}</AlertDescription>
          </Alert>
        )}

        {/* Product grid */}
        {initialProducts.length === 0 && !initialError ? (
          <div className="text-center py-12" role="status">
            <p className="text-muted-foreground text-lg">
              No products available at the moment.
            </p>
          </div>
        ) : (
          <section aria-label="Product catalog">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {initialProducts.map((product, index) => (
                <ProductCard
                  key={product._id}
                  product={product}
                  localizedPrice={prices.get(product._id) || null}
                  currency={currency}
                  isLoadingPrice={isPricesLoading}
                  onBuyNow={handleBuyNow}
                  priority={index < 3} // Prioritize first 3 images (above-the-fold)
                />
              ))}
            </div>
          </section>
        )}

        {/* Loading skeleton for initial load */}
        {initialProducts.length === 0 && !initialError && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" role="status" aria-label="Loading products">
            {[1, 2, 3].map((i) => (
              <div key={i} className="space-y-4">
                <Skeleton className="h-64 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
