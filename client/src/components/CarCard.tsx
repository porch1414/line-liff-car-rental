/**
 * CarCard – Car listing card component
 * Design: Coastal Breeze — soft card with teal left-border accent
 */
import { Car } from "@/lib/carData";

interface CarCardProps {
  car: Car;
  onClick?: (car: Car) => void;
}

export function CarCard({ car, onClick }: CarCardProps) {
  // Format price for display
  const formattedPrice = `$${(car.price_per_day || 0).toFixed(2)}`;
  
  return (
    <div
      className={`card-lift bg-white rounded-2xl overflow-hidden shadow-sm border border-border cursor-pointer relative ${!car.is_available ? "opacity-60" : ""}`}
      onClick={() => car.is_available && onClick?.(car)}
    >
      {/* Car image */}
      <div className="relative h-44 bg-[oklch(0.96_0.01_90)] overflow-hidden">
        <img
          src={car.image_url || ""}
          alt={car.name}
          className="w-full h-full object-contain p-3 transition-transform duration-300 hover:scale-105"
          loading="lazy"
        />
        {!car.is_available && (
          <div className="absolute inset-0 bg-white/60 flex items-center justify-center">
            <span className="text-sm font-semibold text-muted-foreground bg-white px-3 py-1 rounded-full shadow-sm">
              Unavailable
            </span>
          </div>
        )}
      </div>

      {/* Card content */}
      <div className="p-4 teal-border-left">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h3 className="font-bold text-foreground text-base leading-tight" style={{ fontFamily: "'Sora', sans-serif" }}>
              {car.name}
            </h3>
          </div>
          <div className="text-right ml-2">
            <p className="text-lg font-bold text-[oklch(0.42_0.09_200)]" style={{ fontFamily: "'Sora', sans-serif" }}>
              {formattedPrice}
            </p>
            <p className="text-[10px] text-muted-foreground">/ day</p>
          </div>
        </div>

        {/* Description */}
        {car.description && (
          <p className="text-xs text-muted-foreground line-clamp-2 mb-3">
            {car.description}
          </p>
        )}

        {/* Book button */}
        <button
          className="w-full bg-[oklch(0.42_0.09_200)] text-white text-sm font-semibold py-2 rounded-lg hover:bg-[oklch(0.38_0.09_200)] transition-colors"
          onClick={(e) => {
            e.stopPropagation();
            if (car.is_available) {
              onClick?.(car);
            }
          }}
        >
          {car.is_available ? "Book Now" : "Unavailable"}
        </button>
      </div>
    </div>
  );
}
