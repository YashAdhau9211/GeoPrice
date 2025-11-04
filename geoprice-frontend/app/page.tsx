import { headers } from 'next/headers';
import { apiClient } from '@/lib/api-client';
import { DEFAULT_COUNTRY, isSupportedCountry } from '@/constants/countries';
import { CountryCode } from '@/types/currency';
import { Product } from '@/types/product';
import { HomePageClient } from './HomePageClient';

/**
 * Home Page Server Component
 * 
 * This server component handles:
 * - Reading the x-vercel-ip-country header for automatic country detection
 * - Fetching the initial product list from the backend API during SSR
 * - Passing detected country and products to the client component
 * 
 * Performance Optimizations:
 * - Products are fetched on the server (SSR) to reduce client-side loading time
 * - Initial data is passed as props to avoid waterfall requests
 * - Localized prices are fetched on the client to allow dynamic country changes
 * 
 * Requirements: 1.1, 2.1, 2.2, 2.3, 11.3
 */
export default async function Home() {
  // Read the Vercel geolocation header
  const headersList = await headers();
  const detectedCountry = headersList.get('x-vercel-ip-country') || DEFAULT_COUNTRY;
  
  // Validate and use the detected country, fallback to default if unsupported
  const country: CountryCode = isSupportedCountry(detectedCountry) 
    ? (detectedCountry as CountryCode)
    : DEFAULT_COUNTRY;

  // Fetch products on the server for initial render
  let products: Product[] = [];
  let error: string | null = null;

  try {
    products = await apiClient.getProducts();
  } catch (err) {
    console.error('Error fetching products:', err);
    error = err instanceof Error ? err.message : 'Failed to load products';
  }

  // Pass data to client component
  return (
    <HomePageClient 
      initialCountry={country} 
      initialProducts={products}
      initialError={error}
    />
  );
}
