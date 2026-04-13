/**
 * Home – Main landing page for DriveEase LINE LIFF Car Rental
 * Design: Coastal Breeze — hero with overlay, category pills, featured cars
 */
import { useState } from "react";
import { useLocation } from "wouter";
import { Search, MapPin, Bell, ChevronRight, Sparkles, Loader2 } from "lucide-react";
import { useAuth } from "@/_core/hooks/useAuth";
import { useLiffContext } from "@/contexts/LiffContext";
import { useBooking } from "@/contexts/BookingContext";
import { CarCard } from "@/components/CarCard";
import { categories, HERO_IMAGE, type CarCategory } from "@/lib/carData";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

export default function Home() {
  // The userAuth hooks provides authentication state
  let { user, loading, error, isAuthenticated, logout } = useAuth();

  const { profile, isLoggedIn } = useLiffContext();
  const { selectCar } = useBooking();
  const [, navigate] = useLocation();
  const [activeCategory, setActiveCategory] = useState<CarCategory>("All");

  // Fetch live car data from tRPC API
  const { data: liveCars = [], isLoading: carsLoading } = trpc.cars.list.useQuery();

  // Filter cars based on category
  const filteredCars = liveCars.filter((c) => c.is_available);
  const featuredCars = liveCars.slice(0, 3);

  const greeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  };

  const handleCarSelect = (car: typeof liveCars[0]) => {
    selectCar(car);
    navigate(`/cars/${car.id}`);
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-border">
        <div className="max-w-[480px] mx-auto px-4 py-3 flex items-center justify-between">
          <div>
            <p className="text-xs text-muted-foreground">{greeting()},</p>
            <h2 className="font-bold text-foreground text-base leading-tight" style={{ fontFamily: "'Sora', sans-serif" }}>
              {isLoggedIn && profile ? profile.displayName : "Guest"}
            </h2>
          </div>
          <div className="flex items-center gap-3">
            <button
              className="w-9 h-9 rounded-full bg-muted flex items-center justify-center relative"
              onClick={() => toast.info("No new notifications")}
            >
              <Bell size={18} className="text-muted-foreground" />
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[oklch(0.72_0.16_65)]" />
            </button>
            {isLoggedIn && profile?.pictureUrl ? (
              <img
                src={profile.pictureUrl}
                alt={profile.displayName}
                className="w-9 h-9 rounded-full object-cover border-2 border-[oklch(0.42_0.09_200)]"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = "none";
                }}
              />
            ) : (
              <div className="w-9 h-9 rounded-full bg-[oklch(0.42_0.09_200)] flex items-center justify-center">
                <span className="text-white text-sm font-bold" style={{ fontFamily: "'Sora', sans-serif" }}>
                  {isLoggedIn && profile ? profile.displayName[0].toUpperCase() : "G"}
                </span>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Hero Banner */}
      <section className="relative mx-4 mt-4 rounded-2xl overflow-hidden shadow-lg" style={{ height: "200px" }}>
        <img
          src={HERO_IMAGE}
          alt="DriveEase coastal road"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[oklch(0.28_0.08_200/0.85)] via-[oklch(0.28_0.08_200/0.5)] to-transparent" />
        <div className="absolute inset-0 flex flex-col justify-end p-5">
          <div className="flex items-center gap-1.5 mb-1">
            <Sparkles size={14} className="text-[oklch(0.88_0.12_75)]" />
            <span className="text-[oklch(0.88_0.12_75)] text-xs font-semibold" style={{ fontFamily: "'Sora', sans-serif" }}>
              Special Offer
            </span>
          </div>
          <h1 className="text-white text-2xl font-bold leading-tight mb-1" style={{ fontFamily: "'Sora', sans-serif" }}>
            Drive Your<br />Adventure
          </h1>
          <p className="text-white/80 text-xs">Up to 20% off weekend rentals</p>
        </div>
      </section>

      {/* Search Bar */}
      <div className="px-4 mt-4">
        <div className="relative">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search cars, brands…"
            className="w-full bg-white border border-border rounded-xl pl-11 pr-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-[oklch(0.42_0.09_200/0.3)] focus:border-[oklch(0.42_0.09_200)] transition-all"
            style={{ fontFamily: "'Noto Sans', sans-serif" }}
            onFocus={() => navigate("/cars")}
            readOnly
          />
        </div>
      </div>

      {/* Location Bar */}
      <div className="px-4 mt-3">
        <div className="flex items-center gap-2 bg-[oklch(0.42_0.09_200/0.06)] rounded-xl px-4 py-2.5">
          <MapPin size={16} className="text-[oklch(0.42_0.09_200)] shrink-0" />
          <span className="text-sm text-foreground flex-1" style={{ fontFamily: "'Noto Sans', sans-serif" }}>
            Bangkok Suvarnabhumi Airport
          </span>
          <button className="text-xs text-[oklch(0.42_0.09_200)] font-semibold" style={{ fontFamily: "'Sora', sans-serif" }}>
            Change
          </button>
        </div>
      </div>

      {/* Category Filters */}
      <div className="mt-5 px-4">
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide pb-1">
          {categories.map((cat) => (
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

      {/* Loading State */}
      {carsLoading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="animate-spin text-[oklch(0.42_0.09_200)]" size={24} />
        </div>
      )}

      {/* Featured Cars */}
      {!carsLoading && activeCategory === "All" && featuredCars.length > 0 && (
        <section className="mt-5 px-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-base font-bold text-foreground" style={{ fontFamily: "'Sora', sans-serif" }}>
              Featured Picks
            </h2>
            <button
              className="flex items-center gap-1 text-xs text-[oklch(0.42_0.09_200)] font-semibold"
              onClick={() => navigate("/cars")}
              style={{ fontFamily: "'Sora', sans-serif" }}
            >
              See all <ChevronRight size={14} />
            </button>
          </div>
          <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-2">
            {featuredCars.map((car) => (
              <div key={car.id} className="min-w-[240px]">
                <CarCard car={car} onClick={handleCarSelect} />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* All / Filtered Cars */}
      <section className="mt-5 px-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base font-bold text-foreground" style={{ fontFamily: "'Sora', sans-serif" }}>
            {activeCategory === "All" ? "All Available Cars" : `${activeCategory} Cars`}
          </h2>
          <span className="text-xs text-muted-foreground">{filteredCars.length} cars</span>
        </div>
        {filteredCars.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-sm">No cars available in this category.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {filteredCars.map((car: typeof filteredCars[0], i: number) => (
              <div
                key={car.id}
                className="animate-slide-up"
                style={{ animationDelay: `${i * 60}ms`, animationFillMode: "both" }}
              >
                <CarCard car={car} onClick={handleCarSelect} />
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
