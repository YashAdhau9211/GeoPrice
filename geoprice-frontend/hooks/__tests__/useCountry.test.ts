import { renderHook, act } from '@testing-library/react';
import { useCountry } from '../useCountry';
import { CountryCode } from '@/types/currency';

describe('useCountry', () => {
  it('should initialize with provided country', () => {
    const { result } = renderHook(() => useCountry('US' as CountryCode));
    
    expect(result.current.country).toBe('US');
    expect(result.current.currency).toBe('USD');
  });

  it('should map IN country to INR currency', () => {
    const { result } = renderHook(() => useCountry('IN' as CountryCode));
    
    expect(result.current.country).toBe('IN');
    expect(result.current.currency).toBe('INR');
  });

  it('should map GB country to GBP currency', () => {
    const { result } = renderHook(() => useCountry('GB' as CountryCode));
    
    expect(result.current.country).toBe('GB');
    expect(result.current.currency).toBe('GBP');
  });

  it('should update country when setCountry is called', () => {
    const { result } = renderHook(() => useCountry('US' as CountryCode));
    
    expect(result.current.country).toBe('US');
    expect(result.current.currency).toBe('USD');
    
    act(() => {
      result.current.setCountry('IN' as CountryCode);
    });
    
    expect(result.current.country).toBe('IN');
    expect(result.current.currency).toBe('INR');
  });

  it('should update currency when country changes', () => {
    const { result } = renderHook(() => useCountry('US' as CountryCode));
    
    act(() => {
      result.current.setCountry('GB' as CountryCode);
    });
    
    expect(result.current.currency).toBe('GBP');
  });
});
