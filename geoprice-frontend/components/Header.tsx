"use client"

import { CountrySelector } from "@/components/CountrySelector";

interface HeaderProps {
  country: string;
  onCountryChange: (country: string) => void;
}

/**
 * Header component displays the site branding and country selector.
 * Provides a consistent navigation experience across all pages.
 * 
 * Requirements: 4.1, 8.1
 */
export function Header({ country, onCountryChange }: HeaderProps) {
  return (
    <header className="border-b bg-background sticky top-0 z-50 shadow-sm" role="banner">
      <nav className="container mx-auto px-4 py-4" role="navigation" aria-label="Main navigation">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Site Branding */}
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-primary">
              <span aria-hidden="true">🌍</span> GeoPrice
            </h1>
            <p className="hidden md:block text-sm text-muted-foreground">
              Shop Local, Pay Local
            </p>
          </div>

          {/* Country Selector */}
          <div className="flex items-center gap-2">
            <label 
              htmlFor="country-selector" 
              className="text-sm font-medium text-muted-foreground hidden sm:inline"
            >
              Your Region:
            </label>
            <CountrySelector 
              value={country} 
              onChange={onCountryChange}
            />
          </div>
        </div>
      </nav>
    </header>
  );
}
