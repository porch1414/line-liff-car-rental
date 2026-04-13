/**
 * carData.ts – Static car rental data for DriveEase
 * Design: Coastal Breeze
 */

export type CarCategory = "All" | "Sedan" | "SUV" | "Compact" | "Van";

// Car type is inferred from Drizzle schema
export interface Car {
  id: string;
  name: string;
  brand: string;
  category: string;
  pricePerDay: number;
  seats: number | null;
  transmission: string | null;
  fuelType: string | null;
  image: string | null;
  rating: number | null;
  reviews: number | null;
  available: number;
  badge: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export const HERO_IMAGE = "https://d2xsxph8kpxj0f.cloudfront.net/310519663549312228/Kw6FodCzAqfHhtkur2wrWq/hero-banner-LxjhdqwrKidJf85T922ays.webp";

export const cars: Car[] = [
  {
    id: "c1",
    name: "Camry 2024",
    brand: "Toyota",
    category: "Sedan",
    pricePerDay: 1200,
    seats: 5,
    transmission: "Auto",
    fuelType: "Hybrid",
    image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663549312228/Kw6FodCzAqfHhtkur2wrWq/car-sedan-TE4VMo84jW7fCEa9C52JcF.webp",
    rating: 4.8,
    reviews: 142,
    available: 1,
    badge: "Popular",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "c2",
    name: "CR-V 2024",
    brand: "Honda",
    category: "SUV",
    pricePerDay: 1600,
    seats: 5,
    transmission: "Auto",
    fuelType: "Petrol",
    image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663549312228/Kw6FodCzAqfHhtkur2wrWq/car-suv-PkEReVAunyP6htRoxHepgK.webp",
    rating: 4.7,
    reviews: 98,
    available: 1,
    badge: "New",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "c3",
    name: "Yaris 2024",
    brand: "Toyota",
    category: "Compact",
    pricePerDay: 750,
    seats: 5,
    transmission: "Auto",
    fuelType: "Petrol",
    image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663549312228/Kw6FodCzAqfHhtkur2wrWq/car-compact-DjfoquXLP9LnMKfqgxm5ER.webp",
    rating: 4.5,
    reviews: 211,
    available: 1,
    badge: "Best Value",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "c4",
    name: "HiAce 2024",
    brand: "Toyota",
    category: "Van",
    pricePerDay: 2200,
    seats: 12,
    transmission: "Manual",
    fuelType: "Diesel",
    image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663549312228/Kw6FodCzAqfHhtkur2wrWq/car-van-FckKaYKkFnfMjr8CqeD8GX.webp",
    rating: 4.6,
    reviews: 67,
    available: 1,
    badge: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "c5",
    name: "Accord 2023",
    brand: "Honda",
    category: "Sedan",
    pricePerDay: 1350,
    seats: 5,
    transmission: "Auto",
    fuelType: "Hybrid",
    image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663549312228/Kw6FodCzAqfHhtkur2wrWq/car-sedan-TE4VMo84jW7fCEa9C52JcF.webp",
    rating: 4.6,
    reviews: 89,
    available: 0,
    badge: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "c6",
    name: "Fortuner 2024",
    brand: "Toyota",
    category: "SUV",
    pricePerDay: 1900,
    seats: 7,
    transmission: "Auto",
    fuelType: "Diesel",
    image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663549312228/Kw6FodCzAqfHhtkur2wrWq/car-suv-PkEReVAunyP6htRoxHepgK.webp",
    rating: 4.9,
    reviews: 134,
    available: 1,
    badge: "Premium",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

export const categories: CarCategory[] = ["All", "Sedan", "SUV", "Compact", "Van"];

export function filterCars(cars: Car[], category: CarCategory): Car[] {
  if (category === "All") return cars;
  return cars.filter((c) => c.category === category);
}

export function formatPrice(price: number): string {
  return `฿${price.toLocaleString()}`;
}
