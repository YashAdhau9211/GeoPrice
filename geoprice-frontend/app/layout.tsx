import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "GeoPrice - Shop Local, Pay Local",
  description: "E-commerce storefront with automatic regional pricing. Shop in your local currency with prices tailored to your location.",
  keywords: ["e-commerce", "localized pricing", "international shopping", "multi-currency"],
  authors: [{ name: "GeoPrice Team" }],
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#ffffff",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen bg-background`}
      >
        <a href="#main-content" className="skip-to-main">
          Skip to main content
        </a>
        <ErrorBoundary>
          <div className="flex flex-col min-h-screen">
            <main id="main-content" className="flex-1" role="main">
              {children}
            </main>
          </div>
        </ErrorBoundary>
      </body>
    </html>
  );
}
