/**
 * CarCard – Car listing card component
 * Design: Coastal Breeze — soft card with teal left-border accent, amber badge
 */
import { Star, Users, Fuel, Settings } from "lucide-react";
import { Car, formatPrice } from "@/lib/carData";
import { Badge } from "@/components/ui/badge";

interface CarCardProps {
  car: Car;
  onClick?: (car: Car) => void;
}

const badgeColors: Record<string, string> = {
  Popular: "bg-[oklch(0.42_0.09_200)] text-white",
  New: "bg-[oklch(0.72_0.16_65)] text-[oklch(0.15_0_0)]",
  "Best Value": "bg-emerald-500 text-white",
  Premium: "bg-[oklch(0.28_0.08_200)] text-white",
};

export function CarCard({ car, onClick }: CarCardProps) {
  return (
    <div
      className={`card-lift bg-white rounded-2xl overflow-hidden shadow-sm border border-border cursor-pointer relative ${!car.available ? "opacity-60" : ""}`}
      onClick={() => car.available && onClick?.(car)}
    >
      {/* Car image */}
      <div className="relative h-44 bg-[oklch(0.96_0.01_90)] overflow-hidden">
        <img
          src={car.image || ""}
          alt={`${car.brand} ${car.name}`}
          className="w-full h-full object-contain p-3 transition-transform duration-300 hover:scale-105"
          loading="lazy"
        />
        {car.badge && (
          <span className={`absolute top-3 left-3 text-xs font-semibold px-2.5 py-1 rounded-full ${badgeColors[car.badge] || "bg-gray-200 text-gray-700"}`}
            style={{ fontFamily: "'Sora', sans-serif" }}>
            {car.badge}
          </span>
        )}
        {!car.available && (
          <div className="absolute inset-0 bg-white/60 flex items-center justify-center">
            <span className="text-sm font-semibold text-muted-foreground bg-white px-3 py-1 rounded-full shadow-sm">
              Unavailable
            </span>
          </div>
        )}
      </div>

      {/* Card content */}
      <div className="p-4 teal-border-left">
        <div className="flex items-start justify-between mb-1">
          <div>
            <p className="text-xs text-muted-foreground font-medium">{car.brand}</p>
            <h3 className="font-bold text-foreground text-base leading-tight" style={{ fontFamily: "'Sora', sans-serif" }}>
              {car.name}
            </h3>
          </div>
          <div className="text-right">
            <p className="text-lg font-bold text-[oklch(0.42_0.09_200)]" style={{ fontFamily: "'Sora', sans-serif" }}>
              {formatPrice(car.pricePerDay)}
            </p>
            <p className="text-[10px] text-muted-foreground">/ day</p>
          </div>
        </div>

        {/* Rating */}
        <div className="flex items-center gap-1 mb-3">
          <Star size={12} className="fill-[oklch(0.72_0.16_65)] text-[oklch(0.72_0.16_65)]" />
          <span className="text-xs font-semibold text-foreground">{car.rating}</span>
          <span className="text-xs text-muted-foreground">({car.reviews})</span>
        </div>

        {/* Specs row */}
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <Users size={12} />
            {car.seats} seats
          </span>
          <span className="flex items-center gap-1">
            <Settings size={12} />
            {car.transmission}
          </span>
          <span className="flex items-center gap-1">
            <Fuel size={12} />
            {car.fuelType}
          </span>
        </div>
      </div>
    </div>
  );
}
