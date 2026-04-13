/**
 * Cars – Full car listing page with search and filters
 * Design: Coastal Breeze
 */
import { useState } from "react";
import { useLocation } from "wouter";
import { Search, SlidersHorizontal, X, Loader2 } from "lucide-react";
import { CarCard } from "@/components/CarCard";
import { useBooking } from "@/contexts/BookingContext";
import { categories, type CarCategory } from "@/lib/carData";
import { trpc } from "@/lib/trpc";

export default function Cars() {
  const [, navigate] = useLocation();
  const { selectCar } = useBooking();
  const [activeCategory, setActiveCategory] = useState<CarCategory>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [showUnavailable, setShowUnavailable] = useState(false);
  const { data: liveCars = [], isLoading } = trpc.cars.list.useQuery();

  const filtered = liveCars.filter((car) => {
    const matchesSearch =
      searchQuery === "" ||
      car.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesAvailability = showUnavailable || car.is_available;
    return matchesSearch && matchesAvailability;
  });

  const handleCarSelect = (car: (typeof liveCars)[0]) => {
    selectCar(car);
    navigate(`/cars/${car.id}`);
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-border">
        <div className="max-w-[480px] mx-auto px-4 py-3">
          <h1 className="text-xl font-bold text-foreground mb-3" style={{ fontFamily: "'Sora', sans-serif" }}>
            Browse Cars
          </h1>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search cars…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-muted border-0 rounded-xl pl-9 pr-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-[oklch(0.42_0.09_200/0.3)] transition-all"
              />
              {searchQuery && (
                <button
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                  onClick={() => setSearchQuery("")}
                >
                  <X size={14} className="text-muted-foreground" />
                </button>
              )}
            </div>
            <button
              className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${showUnavailable ? "bg-[oklch(0.42_0.09_200)] text-white" : "bg-muted text-muted-foreground"}`}
              onClick={() => setShowUnavailable(!showUnavailable)}
              title="Show unavailable cars"
            >
              <SlidersHorizontal size={18} />
            </button>
          </div>
        </div>
      </header>

      {/* Category Pills */}
      <div className="max-w-[480px] mx-auto px-4 mt-4">
        <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
          {categories.map((cat: CarCategory) => (
            <button
              key={cat}
              className={`pill-filter ${activeCategory === cat ? "active" : ""}`}
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Results */}
      <div className="max-w-[480px] mx-auto px-4 mt-4">
        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="animate-spin text-[oklch(0.42_0.09_200)]" size={32} />
          </div>
        ) : (
          <>
            <p className="text-xs text-muted-foreground mb-3">
              {filtered.length} car{filtered.length !== 1 ? "s" : ""} found
            </p>
            {filtered.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
              <Search size={24} className="text-muted-foreground" />
            </div>
            <p className="font-semibold text-foreground mb-1" style={{ fontFamily: "'Sora', sans-serif" }}>
              No cars found
            </p>
            <p className="text-sm text-muted-foreground">Try adjusting your search or filters</p>
          </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {filtered.map((car, i) => (
                  <div
                    key={car.id}
                    className="animate-slide-up"
                    style={{ animationDelay: `${i * 50}ms`, animationFillMode: "both" }}
                  >
                    <CarCard car={car} onClick={handleCarSelect} />
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
