import Link from 'next/link';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';

/**
 * Payment Cancellation Page
 * 
 * This page is displayed when a user cancels the payment on Stripe Checkout.
 * It provides a friendly message and encourages the user to try again without
 * using error styling that might discourage retry.
 * 
 * Requirements: 7.1, 7.2, 7.3, 7.4, 7.5
 */
export default function CancelPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <article className="max-w-2xl w-full space-y-6" aria-labelledby="cancel-heading">
        {/* Cancellation Alert - Using default variant (not destructive) */}
        <Alert className="border-blue-500 bg-blue-50 dark:bg-blue-950" role="status" aria-live="polite">
          <div className="flex items-start gap-3">
            <span className="text-2xl" aria-hidden="true">ℹ️</span>
            <div className="flex-1">
              <AlertTitle id="cancel-heading" className="text-blue-900 dark:text-blue-100 text-xl mb-2">
                Payment Cancelled
              </AlertTitle>
              <AlertDescription className="text-blue-800 dark:text-blue-200">
                Your payment was cancelled and no charges were made to your account.
              </AlertDescription>
            </div>
          </div>
        </Alert>

        {/* Reassurance Message */}
        <section className="bg-card border rounded-lg p-6 space-y-3" aria-labelledby="reassurance-heading">
          <h2 id="reassurance-heading" className="font-semibold text-lg">No Problem!</h2>
          <p className="text-muted-foreground">
            We understand that sometimes you need more time to decide. Your cart items are still available, 
            and you can complete your purchase whenever you're ready.
          </p>
        </section>

        {/* Helpful Information */}
        <section className="bg-card border rounded-lg p-6 space-y-3" aria-labelledby="help-heading">
          <h2 id="help-heading" className="font-semibold text-lg">Need Help?</h2>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-start gap-2">
              <span aria-hidden="true">💳</span>
              <span>All major credit cards and payment methods are accepted.</span>
            </li>
            <li className="flex items-start gap-2">
              <span aria-hidden="true">🔒</span>
              <span>Your payment information is secure and encrypted.</span>
            </li>
            <li className="flex items-start gap-2">
              <span aria-hidden="true">🌍</span>
              <span>Prices are automatically converted to your local currency.</span>
            </li>
          </ul>
        </section>

        {/* Action Buttons */}
        <nav className="flex flex-col sm:flex-row gap-4 justify-center pt-4" aria-label="Navigation">
          <Button asChild size="lg" className="min-w-[200px]">
            <Link href="/" aria-label="Return to home page to try purchasing again">
              Try Again
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="min-w-[200px]">
            <Link href="/" aria-label="Return to home page to continue shopping">
              Continue Shopping
            </Link>
          </Button>
        </nav>
      </article>
    </div>
  );
}
