import { CurrencyFormatter } from '../currency-formatter';

describe('CurrencyFormatter', () => {
  describe('format', () => {
    it('should format USD correctly', () => {
      const formatted = CurrencyFormatter.format(10.5, 'USD');
      expect(formatted).toMatch(/\$10\.50/);
    });

    it('should format INR correctly', () => {
      const formatted = CurrencyFormatter.format(750, 'INR');
      expect(formatted).toMatch(/₹750\.00/);
    });

    it('should format GBP correctly', () => {
      const formatted = CurrencyFormatter.format(8.5, 'GBP');
      expect(formatted).toMatch(/£8\.50/);
    });

    it('should format with two decimal places', () => {
      const formatted = CurrencyFormatter.format(10, 'USD');
      expect(formatted).toMatch(/10\.00/);
    });

    it('should handle large amounts', () => {
      const formatted = CurrencyFormatter.format(1234567.89, 'USD');
      expect(formatted).toContain('1,234,567.89');
    });
  });

  describe('getSymbol', () => {
    it('should return $ for USD', () => {
      const symbol = CurrencyFormatter.getSymbol('USD');
      expect(symbol).toBe('$');
    });

    it('should return ₹ for INR', () => {
      const symbol = CurrencyFormatter.getSymbol('INR');
      expect(symbol).toBe('₹');
    });

    it('should return £ for GBP', () => {
      const symbol = CurrencyFormatter.getSymbol('GBP');
      expect(symbol).toBe('£');
    });
  });

  describe('getLocale', () => {
    it('should return en-US for USD', () => {
      const locale = CurrencyFormatter.getLocale('USD');
      expect(locale).toBe('en-US');
    });

    it('should return en-IN for INR', () => {
      const locale = CurrencyFormatter.getLocale('INR');
      expect(locale).toBe('en-IN');
    });

    it('should return en-GB for GBP', () => {
      const locale = CurrencyFormatter.getLocale('GBP');
      expect(locale).toBe('en-GB');
    });

    it('should fallback to en-US for unknown currency', () => {
      const locale = CurrencyFormatter.getLocale('XYZ');
      expect(locale).toBe('en-US');
    });
  });

  describe('formatCompact', () => {
    it('should format large amounts compactly', () => {
      const formatted = CurrencyFormatter.formatCompact(1200, 'USD');
      expect(formatted).toMatch(/\$1\.2K/);
    });

    it('should format millions compactly', () => {
      const formatted = CurrencyFormatter.formatCompact(1500000, 'USD');
      expect(formatted).toMatch(/\$1\.5M/);
    });

    it('should format small amounts normally', () => {
      const formatted = CurrencyFormatter.formatCompact(100, 'USD');
      expect(formatted).toMatch(/\$100/);
    });
  });

  describe('parse', () => {
    it('should parse USD formatted string', () => {
      const parsed = CurrencyFormatter.parse('$10.50');
      expect(parsed).toBe(10.5);
    });

    it('should parse INR formatted string', () => {
      const parsed = CurrencyFormatter.parse('₹750.00');
      expect(parsed).toBe(750);
    });

    it('should parse GBP formatted string', () => {
      const parsed = CurrencyFormatter.parse('£8.50');
      expect(parsed).toBe(8.5);
    });

    it('should handle strings with commas', () => {
      const parsed = CurrencyFormatter.parse('$1,234.56');
      expect(parsed).toBe(1234.56);
    });

    it('should return NaN for invalid input', () => {
      const parsed = CurrencyFormatter.parse('invalid');
      expect(parsed).toBeNaN();
    });
  });
});
