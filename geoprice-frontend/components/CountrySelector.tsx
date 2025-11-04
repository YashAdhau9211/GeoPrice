"use client"

import { useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { COUNTRIES } from "@/constants/countries";

interface CountrySelectorProps {
  value: string;              // Current country code
  onChange: (country: string) => void;
}

/**
 * CountrySelector component allows users to manually select their country
 * to override automatic geolocation detection and see prices in their preferred currency.
 * 
 * Requirements: 4.1, 4.2, 4.3, 8.4
 */
export function CountrySelector({ value, onChange }: CountrySelectorProps) {
  const [mounted, setMounted] = useState(false);

  // Only render after mount to avoid hydration mismatch with Radix UI's random IDs
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    // Return a placeholder that matches the Select's dimensions
    return (
      <div className="w-[200px] sm:w-[240px] h-10 border border-input rounded-md bg-background" />
    );
  }

  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger 
        id="country-selector"
        className="w-[200px] sm:w-[240px]"
        aria-label="Select your country and currency"
      >
        <SelectValue placeholder="Select country" />
      </SelectTrigger>
      <SelectContent>
        {COUNTRIES.map((country) => (
          <SelectItem key={country.code} value={country.code}>
            <span className="flex items-center gap-2">
              <span className="text-base" aria-hidden="true">{country.flag}</span>
              <span className="hidden sm:inline">{country.name}</span>
              <span className="sm:hidden">{country.code}</span>
              <span className="text-muted-foreground">({country.currency})</span>
            </span>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
