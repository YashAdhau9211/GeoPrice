# GeoPrice Frontend

A Next.js e-commerce storefront with automatic regional pricing based on user location. This application provides a localized shopping experience by detecting the user's country and displaying prices in their local currency (USD, INR, or GBP).

## Features

- Automatic country detection using Vercel geolocation
- Dynamic currency conversion and localized pricing
- Manual country/currency selection
- Stripe Checkout integration for secure payments
- Responsive design for mobile, tablet, and desktop
- Server-side rendering for optimal performance
- Accessible UI components with keyboard navigation
- Built with Next.js 16, TypeScript, and Tailwind CSS

## Prerequisites

Before you begin, ensure you have the following installed:

- Node.js 20.x or higher
- npm 10.x or higher
- A running instance of the GeoPrice backend API

## Environment Variables

This project requires the following environment variables:

| Variable | Description | Example |
|----------|-------------|---------|
| `NEXT_PUBLIC_API_URL` | Base URL for the backend API | `http://localhost:5000/api` (local) or `https://your-backend.onrender.com/api` (production) |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe publishable key for client-side checkout | `pk_test_...` (test) or `pk_live_...` (production) |

### Setting Up Environment Variables

1. Copy the example environment file:
   ```bash
   copy .env.example .env.local
   ```

2. Edit `.env.local` and replace the placeholder values with your actual configuration:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:5000/api
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_actual_key_here
   ```

3. For production deployment on Vercel, set these variables in the Vercel dashboard under Project Settings → Environment Variables

## Installation

1. Clone the repository and navigate to the frontend directory:
   ```bash
   cd localized-e-commerce-frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables as described above

## Development

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

The page will auto-reload when you make changes to the code.

### Development Notes

- The app expects the backend API to be running (default: `http://localhost:5000`)
- In local development, the country will default to "US" since Vercel geolocation headers are not available
- Use the country selector dropdown to test different currencies

## Build Commands

### Production Build

Create an optimized production build:

```bash
npm run build
```

This command:
- Compiles TypeScript
- Optimizes and bundles JavaScript/CSS
- Generates static pages where possible
- Outputs to the `.next` directory

### Start Production Server

Run the production build locally:

```bash
npm start
```

This starts the Next.js production server on port 3000.

### Linting

Run ESLint to check code quality:

```bash
npm run lint
```

### Bundle Analysis

Analyze the bundle size:

```bash
npm run analyze
```

This generates a visual representation of the bundle composition.

## Project Structure

```
localized-e-commerce-frontend/
├── app/                      # Next.js App Router pages
│   ├── layout.tsx           # Root layout with Header
│   ├── page.tsx             # Home page (product listing)
│   ├── success/             # Payment success page
│   └── cancel/              # Payment cancellation page
├── components/              # React components
│   ├── ui/                  # ShadCN UI components
│   ├── ProductCard.tsx      # Product display component
│   ├── CountrySelector.tsx  # Country selection dropdown
│   └── Header.tsx           # Site header
├── lib/                     # Utility libraries
│   ├── api-client.ts        # Backend API service
│   ├── currency-formatter.ts # Currency formatting utilities
│   └── utils.ts             # General utilities
├── hooks/                   # Custom React hooks
│   ├── useCountry.ts        # Country management hook
│   └── useLocalizedPrices.ts # Price fetching hook
├── types/                   # TypeScript type definitions
│   ├── product.ts           # Product types
│   ├── api.ts               # API response types
│   └── currency.ts          # Currency types
├── constants/               # Application constants
│   └── countries.ts         # Country configurations
├── .env.example             # Environment variable template
├── .env.local               # Local environment variables (gitignored)
├── next.config.ts           # Next.js configuration
└── package.json             # Dependencies and scripts
```

## Deployment

### Deploy to Vercel

This application is optimized for deployment on Vercel:

1. Push your code to a Git repository (GitHub, GitLab, or Bitbucket)

2. Import your repository in Vercel:
   - Go to [vercel.com/new](https://vercel.com/new)
   - Select your repository
   - Vercel will automatically detect Next.js

3. Configure environment variables:
   - In the Vercel dashboard, go to Project Settings → Environment Variables
   - Add `NEXT_PUBLIC_API_URL` with your production backend URL
   - Add `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` with your Stripe key
   - Set variables for Production, Preview, and Development environments as needed

4. Deploy:
   - Click "Deploy"
   - Vercel will build and deploy your application
   - You'll receive a production URL (e.g., `your-app.vercel.app`)

5. Verify deployment:
   - Visit your production URL
   - Test geolocation detection (should work automatically on Vercel)
   - Test the complete purchase flow with Stripe test cards

### Vercel Configuration

The application uses the following Vercel features:

- Automatic HTTPS
- Edge Network (CDN) for global distribution
- Image Optimization via Next.js Image component
- Geolocation headers (`x-vercel-ip-country`) for country detection
- Automatic deployments on git push

### Environment-Specific Configuration

- Development: Uses `.env.local` with localhost backend
- Preview: Uses Vercel environment variables (can use staging backend)
- Production: Uses Vercel environment variables with production backend

## Testing

### Manual Testing Checklist

- [ ] Products load and display correctly
- [ ] Country selector changes currency
- [ ] Prices update without page reload
- [ ] "Buy Now" redirects to Stripe Checkout
- [ ] Success page displays after payment
- [ ] Cancel page displays when payment is cancelled
- [ ] Responsive design works on mobile/tablet/desktop
- [ ] Keyboard navigation works throughout
- [ ] Images load and are optimized

### Testing with Stripe

Use Stripe test cards for testing payments:

- Success: `4242 4242 4242 4242`
- Decline: `4000 0000 0000 0002`
- Use any future expiry date and any 3-digit CVC

## Supported Countries and Currencies

| Country | Currency | Symbol |
|---------|----------|--------|
| United States | USD | $ |
| India | INR | ₹ |
| United Kingdom | GBP | £ |

## Troubleshooting

### Build Errors

If you encounter build errors:

1. Clear the Next.js cache:
   ```bash
   rmdir /s /q .next
   npm run build
   ```

2. Verify all environment variables are set correctly

3. Check that the backend API is accessible from your deployment environment

### Geolocation Not Working

- Geolocation only works on Vercel deployments
- In local development, the app defaults to "US"
- Use the country selector to test different currencies locally

### API Connection Issues

- Verify `NEXT_PUBLIC_API_URL` is set correctly
- Ensure the backend API is running and accessible
- Check CORS configuration on the backend allows your frontend domain

## Technology Stack

- Next.js 16.0.1 - React framework with App Router
- React 19.2.0 - UI library
- TypeScript 5.x - Type-safe development
- Tailwind CSS 4.x - Utility-first styling
- ShadCN UI - Accessible component library
- Vercel - Hosting and deployment platform

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Vercel Geolocation](https://vercel.com/docs/edge-network/headers#x-vercel-ip-country)
- [Stripe Checkout](https://stripe.com/docs/payments/checkout)
- [ShadCN UI](https://ui.shadcn.com/)

## License

This project is part of the GeoPrice e-commerce platform.
