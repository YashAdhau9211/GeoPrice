# Testing Guide

## Unit Tests

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run specific test file
npm test -- hooks/__tests__/useCountry.test.ts
```

### Test Coverage

- **Hooks**: `useCountry`, `useLocalizedPrices`
- **Services**: `ApiClient`, `CurrencyFormatter`

## Manual Testing Checklist

### User Flow Testing
- [ ] Load home page and verify products display
- [ ] Verify automatic country detection works
- [ ] Change country selector and verify prices update
- [ ] Click "Buy Now" and verify redirect to Stripe
- [ ] Complete test payment and verify success page
- [ ] Cancel payment and verify cancel page

### Country Selector Testing
- [ ] Select United States (USD) - verify prices update
- [ ] Select India (INR) - verify prices update
- [ ] Select United Kingdom (GBP) - verify prices update
- [ ] Verify currency symbols display correctly

### Error Scenarios
- [ ] Disconnect network and verify error message
- [ ] Test with invalid API URL and verify error handling
- [ ] Test with backend down and verify graceful degradation

### Device Testing
- [ ] Test on mobile device (< 640px)
- [ ] Test on tablet (640px - 1024px)
- [ ] Test on desktop (> 1024px)
- [ ] Test on different browsers (Chrome, Firefox, Safari, Edge)

### Accessibility Testing
- [ ] Navigate entire site using only keyboard (Tab, Enter, Escape)
- [ ] Verify all interactive elements have visible focus indicators
- [ ] Test with screen reader (NVDA, JAWS, or VoiceOver)
- [ ] Verify all images have appropriate alt text
- [ ] Check color contrast meets WCAG AA standards

## Lighthouse Audit

### Prerequisites

1. Ensure backend is running:
   ```bash
   cd localized-E-Commerce-Backend
   npm run dev
   ```

2. Start production build:
   ```bash
   cd localized-e-commerce-frontend
   npm run build
   npm start
   ```

### Running Lighthouse

#### Option 1: Chrome DevTools
1. Open Chrome and navigate to `http://localhost:3000`
2. Open DevTools (F12)
3. Go to "Lighthouse" tab
4. Select categories: Performance, Accessibility, Best Practices, SEO
5. Select device: Desktop and Mobile
6. Click "Analyze page load"

#### Option 2: Lighthouse CLI
```bash
# Install Lighthouse globally
npm install -g lighthouse

# Run audit for desktop
lighthouse http://localhost:3000 --preset=desktop --output=html --output-path=./lighthouse-desktop.html

# Run audit for mobile
lighthouse http://localhost:3000 --preset=mobile --output=html --output-path=./lighthouse-mobile.html
```

### Target Scores
- **Performance**: 90+ (desktop), 80+ (mobile)
- **Accessibility**: 100
- **Best Practices**: 90+
- **SEO**: 90+

### Common Issues and Fixes

#### Performance
- Ensure images are optimized with Next.js Image component
- Check for unused JavaScript
- Verify code splitting is working
- Check for render-blocking resources

#### Accessibility
- Add ARIA labels to interactive elements
- Ensure proper heading hierarchy
- Verify color contrast ratios
- Add alt text to all images

#### Best Practices
- Use HTTPS in production
- Ensure no console errors
- Check for deprecated APIs
- Verify CSP headers

## Automated Testing (Future)

Consider adding:
- E2E tests with Playwright or Cypress
- Visual regression tests
- Performance monitoring
- Accessibility automation with axe-core
