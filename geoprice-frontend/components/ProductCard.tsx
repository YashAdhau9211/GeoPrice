"use client"

import { useState } from "react";
import Image from "next/image";
import { Product } from "@/types/product";
import { CurrencyFormatter } from "@/lib/currency-formatter";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

interface ProductCardProps {
  product: Product;
  localizedPrice: number | null;
  currency: string;
  isLoadingPrice: boolean;
  onBuyNow: (productId: string) => Promise<void>;
  priority?: boolean; // For above-the-fold images
}

/**
 * ProductCard component displays a single product with its image, details,
 * localized price, and a "Buy Now" button to initiate checkout.
 * 
 * Requirements: 1.2, 1.3, 3.2, 3.3, 3.5, 5.1, 5.5, 11.1
 */
export function ProductCard({
  product,
  localizedPrice,
  currency,
  isLoadingPrice,
  onBuyNow,
  priority = false,
}: ProductCardProps) {
  const [isProcessing, setIsProcessing] = useState(false);

  const handleBuyNow = async () => {
    setIsProcessing(true);
    try {
      await onBuyNow(product._id);
    } catch (error) {
      console.error("Error initiating checkout:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  // Use the first image or a placeholder
  const imageUrl = product.images[0] || "/placeholder-product.png";

  return (
    <Card className="flex flex-col h-full hover:shadow-lg transition-shadow" role="article" aria-label={`Product: ${product.name}`}>
      <CardHeader className="p-0">
        <div className="relative w-full aspect-square overflow-hidden rounded-t-xl">
          <Image
            src={imageUrl}
            alt={`${product.name} - ${product.description}`}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            priority={priority}
            loading={priority ? 'eager' : 'lazy'}
          />
        </div>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col gap-3">
        <CardTitle className="text-xl">{product.name}</CardTitle>
        <CardDescription className="text-sm line-clamp-2">
          {product.description}
        </CardDescription>

        {/* Price Display */}
        <div className="mt-auto pt-2" aria-live="polite" aria-atomic="true">
          {isLoadingPrice ? (
            <Skeleton className="h-8 w-24" aria-label="Loading price" />
          ) : localizedPrice !== null ? (
            <p className="text-2xl font-bold text-primary" aria-label={`Price: ${CurrencyFormatter.format(localizedPrice, currency)}`}>
              {CurrencyFormatter.format(localizedPrice, currency)}
            </p>
          ) : (
            <p className="text-sm text-muted-foreground">Price unavailable</p>
          )}
        </div>
      </CardContent>

      <CardFooter className="pt-0">
        <Button
          onClick={handleBuyNow}
          disabled={isProcessing || isLoadingPrice || localizedPrice === null}
          className="w-full"
          size="lg"
          aria-label={`Buy ${product.name} now`}
        >
          {isProcessing ? (
            <>
              <span className="animate-spin mr-2" aria-hidden="true">⏳</span>
              Processing...
            </>
          ) : (
            "Buy Now"
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
