/**
 * carData.ts – Static car rental data for DriveEase
 * Design: Coastal Breeze
 */

export type CarCategory = "All" | "Sedan" | "SUV" | "Compact" | "Van";

export interface Car {
  id: string;
  name: string;
  brand: string;
  category: CarCategory;
  pricePerDay: number;
  seats: number;
  transmission: "Auto" | "Manual";
  fuel: "Petrol" | "Diesel" | "Hybrid" | "Electric";
  image: string;
  rating: number;
  reviewCount: number;
  features: string[];
  available: boolean;
  badge?: string;
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
    fuel: "Hybrid",
    image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663549312228/Kw6FodCzAqfHhtkur2wrWq/car-sedan-TE4VMo84jW7fCEa9C52JcF.webp",
    rating: 4.8,
    reviewCount: 142,
    features: ["Bluetooth", "Backup Camera", "Lane Assist", "Cruise Control"],
    available: true,
    badge: "Popular",
  },
  {
    id: "c2",
    name: "CR-V 2024",
    brand: "Honda",
    category: "SUV",
    pricePerDay: 1600,
    seats: 5,
    transmission: "Auto",
    fuel: "Petrol",
    image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663549312228/Kw6FodCzAqfHhtkur2wrWq/car-suv-PkEReVAunyP6htRoxHepgK.webp",
    rating: 4.7,
    reviewCount: 98,
    features: ["AWD", "Sunroof", "Apple CarPlay", "Heated Seats"],
    available: true,
    badge: "New",
  },
  {
    id: "c3",
    name: "Yaris 2024",
    brand: "Toyota",
    category: "Compact",
    pricePerDay: 750,
    seats: 5,
    transmission: "Auto",
    fuel: "Petrol",
    image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663549312228/Kw6FodCzAqfHhtkur2wrWq/car-compact-DjfoquXLP9LnMKfqgxm5ER.webp",
    rating: 4.5,
    reviewCount: 211,
    features: ["Fuel Efficient", "Easy Parking", "Bluetooth", "USB Charging"],
    available: true,
    badge: "Best Value",
  },
  {
    id: "c4",
    name: "HiAce 2024",
    brand: "Toyota",
    category: "Van",
    pricePerDay: 2200,
    seats: 12,
    transmission: "Manual",
    fuel: "Diesel",
    image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663549312228/Kw6FodCzAqfHhtkur2wrWq/car-van-FckKaYKkFnfMjr8CqeD8GX.webp",
    rating: 4.6,
    reviewCount: 67,
    features: ["12 Seats", "Large Cargo", "AC", "GPS Navigation"],
    available: true,
  },
  {
    id: "c5",
    name: "Accord 2023",
    brand: "Honda",
    category: "Sedan",
    pricePerDay: 1350,
    seats: 5,
    transmission: "Auto",
    fuel: "Hybrid",
    image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663549312228/Kw6FodCzAqfHhtkur2wrWq/car-sedan-TE4VMo84jW7fCEa9C52JcF.webp",
    rating: 4.6,
    reviewCount: 89,
    features: ["Wireless Charging", "Honda Sensing", "Sunroof", "Leather Seats"],
    available: false,
  },
  {
    id: "c6",
    name: "Fortuner 2024",
    brand: "Toyota",
    category: "SUV",
    pricePerDay: 1900,
    seats: 7,
    transmission: "Auto",
    fuel: "Diesel",
    image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663549312228/Kw6FodCzAqfHhtkur2wrWq/car-suv-PkEReVAunyP6htRoxHepgK.webp",
    rating: 4.9,
    reviewCount: 134,
    features: ["4WD", "7 Seats", "Tow Hitch", "Off-Road Ready"],
    available: true,
    badge: "Premium",
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
