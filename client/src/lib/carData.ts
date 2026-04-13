/**
 * carData.ts – Car rental data utilities
 * Design: Coastal Breeze
 */

export type CarCategory = "All" | "Sedan" | "SUV" | "Compact" | "Van";

// Car type from Supabase
export interface Car {
  id: number;
  name: string;
  price_per_day: number;
  image_url: string | null;
  description: string | null;
  is_available: boolean;
}

export const HERO_IMAGE = "https://d2xsxph8kpxj0f.cloudfront.net/310519663549312228/Kw6FodCzAqfHhtkur2wrWq/hero-banner-LxjhdqwrKidJf85T922ays.webp";

export const categories: CarCategory[] = ["All", "Sedan", "SUV", "Compact", "Van"];

export function formatPrice(price: number): string {
  return `$${price.toFixed(2)}`;
}
