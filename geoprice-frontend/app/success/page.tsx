import Link from 'next/link';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';

interface SuccessPageProps {
  searchParams: Promise<{ session_id?: string }>;
}

/**
 * Payment Success Page
 * 
 * This page is displayed after a successful payment on Stripe Checkout.
 * It extracts the session_id from URL query parameters and displays
 * a confirmation message to the user.
 * 
 * Requirements: 6.1, 6.2, 6.3, 6.4, 6.5
 */
export default async function SuccessPage({ searchParams }: SuccessPageProps) {
  // Extract session_id from URL query parameters
  const params = await searchParams;
  const sessionId = params.session_id;

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <article className="max-w-2xl w-full space-y-6" aria-labelledby="success-heading">
        {/* Success Alert */}
        <Alert className="border-green-500 bg-green-50 dark:bg-green-950" role="status" aria-live="polite">
          <div className="flex items-start gap-3">
            <span className="text-2xl" aria-hidden="true">✅</span>
            <div className="flex-1">
              <AlertTitle id="success-heading" className="text-green-900 dark:text-green-100 text-xl mb-2">
                Payment Successful!
              </AlertTitle>
              <AlertDescription className="text-green-800 dark:text-green-200">
                Thank you for your purchase. Your order has been confirmed and is being processed.
              </AlertDescription>
            </div>
          </div>
        </Alert>

        {/* Session ID Display */}
        {sessionId && (
          <section className="bg-card border rounded-lg p-6" aria-labelledby="order-reference-heading">
            <h2 id="order-reference-heading" className="text-sm font-medium text-muted-foreground mb-2">
              Order Reference
            </h2>
            <p className="text-sm font-mono bg-muted p-3 rounded break-all" aria-label={`Order reference number: ${sessionId}`}>
              {sessionId}
            </p>
            <p className="text-xs text-muted-foreground mt-2">
              Save this reference number for your records
            </p>
          </section>
        )}

        {/* Additional Information */}
        <section className="bg-card border rounded-lg p-6 space-y-3" aria-labelledby="next-steps-heading">
          <h2 id="next-steps-heading" className="font-semibold text-lg">What's Next?</h2>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-start gap-2">
              <span aria-hidden="true">📧</span>
              <span>You will receive a confirmation email shortly with your order details.</span>
            </li>
            <li className="flex items-start gap-2">
              <span aria-hidden="true">📦</span>
              <span>Your order will be processed and shipped within 2-3 business days.</span>
            </li>
            <li className="flex items-start gap-2">
              <span aria-hidden="true">🔍</span>
              <span>You can track your order status using the reference number above.</span>
            </li>
          </ul>
        </section>

        {/* Continue Shopping Button */}
        <nav className="flex justify-center pt-4" aria-label="Navigation">
          <Button asChild size="lg" className="min-w-[200px]">
            <Link href="/" aria-label="Return to home page to continue shopping">
              Continue Shopping
            </Link>
          </Button>
        </nav>
      </article>
    </div>
  );
}
