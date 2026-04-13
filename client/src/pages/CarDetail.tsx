/**
 * CarDetail – Car detail page with booking form
 * Design: Coastal Breeze — full-bleed image, booking date picker, confirm CTA
 */
import { useState } from "react";
import { useLocation, useParams } from "wouter";
import { ArrowLeft, Star, Users, Fuel, Settings, Check, MapPin, Calendar } from "lucide-react";
import { cars, formatPrice } from "@/lib/carData";
import { useBooking } from "@/contexts/BookingContext";
import { useLiffContext } from "@/contexts/LiffContext";
import { toast } from "sonner";

export default function CarDetail() {
  const { id } = useParams<{ id: string }>();
  const [, navigate] = useLocation();
  const { confirmBooking } = useBooking();
  const { isLoggedIn, login } = useLiffContext();

  const car = cars.find((c) => c.id === id);

  const today = new Date().toISOString().split("T")[0];
  const tomorrow = new Date(Date.now() + 86400000).toISOString().split("T")[0];

  const [pickupDate, setPickupDate] = useState(today);
  const [returnDate, setReturnDate] = useState(tomorrow);
  const [pickupLocation, setPickupLocation] = useState("Bangkok Suvarnabhumi Airport");
  const [isBooking, setIsBooking] = useState(false);

  if (!car) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <p className="text-muted-foreground">Car not found.</p>
          <button className="mt-4 text-[oklch(0.42_0.09_200)] font-semibold" onClick={() => navigate("/cars")}>
            Back to Cars
          </button>
        </div>
      </div>
    );
  }

  const totalDays = Math.max(1, Math.ceil(
    (new Date(returnDate).getTime() - new Date(pickupDate).getTime()) / (1000 * 60 * 60 * 24)
  ));
  const totalPrice = car.pricePerDay * totalDays;

  const handleBooking = async () => {
    if (!isLoggedIn) {
      login();
      return;
    }
    if (!pickupDate || !returnDate) {
      toast.error("Please select pickup and return dates");
      return;
    }
    if (new Date(returnDate) <= new Date(pickupDate)) {
      toast.error("Return date must be after pickup date");
      return;
    }
    setIsBooking(true);
    await new Promise((r) => setTimeout(r, 1200));
    const booking = confirmBooking(car, { pickupDate, returnDate, pickupLocation });
    setIsBooking(false);
    toast.success(`Booking confirmed! ID: ${booking.bookingId}`, {
      description: `${car.brand} ${car.name} · ${totalDays} day${totalDays > 1 ? "s" : ""}`,
    });
    navigate("/bookings");
  };

  return (
    <div className="min-h-screen bg-background pb-32">
      {/* Back button */}
      <div className="sticky top-0 z-40 px-4 pt-4 pb-2 bg-background/80 backdrop-blur-sm">
        <button
          onClick={() => navigate(-1 as any)}
          className="w-10 h-10 rounded-full bg-white shadow-sm border border-border flex items-center justify-center"
        >
          <ArrowLeft size={20} className="text-foreground" />
        </button>
      </div>

      {/* Car Image */}
      <div className="mx-4 -mt-2 rounded-2xl overflow-hidden bg-[oklch(0.96_0.01_90)] h-56 shadow-sm">
        <img
          src={car.image}
          alt={`${car.brand} ${car.name}`}
          className="w-full h-full object-contain p-4"
        />
      </div>

      {/* Car Info */}
      <div className="px-4 mt-5">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs text-muted-foreground font-medium">{car.brand}</p>
            <h1 className="text-2xl font-bold text-foreground" style={{ fontFamily: "'Sora', sans-serif" }}>
              {car.name}
            </h1>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-[oklch(0.42_0.09_200)]" style={{ fontFamily: "'Sora', sans-serif" }}>
              {formatPrice(car.pricePerDay)}
            </p>
            <p className="text-xs text-muted-foreground">per day</p>
          </div>
        </div>

        {/* Rating */}
        <div className="flex items-center gap-2 mt-2">
          <div className="flex items-center gap-1 bg-[oklch(0.72_0.16_65/0.12)] px-2.5 py-1 rounded-full">
            <Star size={12} className="fill-[oklch(0.72_0.16_65)] text-[oklch(0.72_0.16_65)]" />
            <span className="text-xs font-bold text-[oklch(0.42_0.06_65)]">{car.rating}</span>
          </div>
          <span className="text-xs text-muted-foreground">{car.reviewCount} reviews</span>
          <span className="text-xs text-muted-foreground">·</span>
          <span className={`text-xs font-semibold ${car.available ? "text-emerald-600" : "text-destructive"}`}>
            {car.available ? "Available" : "Unavailable"}
          </span>
        </div>

        {/* Specs */}
        <div className="grid grid-cols-3 gap-3 mt-5">
          {[
            { icon: Users, label: "Seats", value: `${car.seats} seats` },
            { icon: Settings, label: "Transmission", value: car.transmission },
            { icon: Fuel, label: "Fuel", value: car.fuel },
          ].map(({ icon: Icon, label, value }) => (
            <div key={label} className="bg-white rounded-xl p-3 text-center border border-border shadow-sm">
              <Icon size={18} className="text-[oklch(0.42_0.09_200)] mx-auto mb-1" />
              <p className="text-[10px] text-muted-foreground">{label}</p>
              <p className="text-xs font-semibold text-foreground" style={{ fontFamily: "'Sora', sans-serif" }}>{value}</p>
            </div>
          ))}
        </div>

        {/* Features */}
        <div className="mt-5">
          <h3 className="text-sm font-bold text-foreground mb-3" style={{ fontFamily: "'Sora', sans-serif" }}>
            Features
          </h3>
          <div className="flex flex-wrap gap-2">
            {car.features.map((feature) => (
              <span
                key={feature}
                className="flex items-center gap-1.5 bg-[oklch(0.42_0.09_200/0.08)] text-[oklch(0.28_0.08_200)] text-xs px-3 py-1.5 rounded-full font-medium"
              >
                <Check size={11} strokeWidth={3} />
                {feature}
              </span>
            ))}
          </div>
        </div>

        {/* Booking Form */}
        <div className="mt-6 bg-white rounded-2xl border border-border shadow-sm p-4">
          <h3 className="text-sm font-bold text-foreground mb-4" style={{ fontFamily: "'Sora', sans-serif" }}>
            Book This Car
          </h3>

          {/* Pickup Location */}
          <div className="mb-4">
            <label className="text-xs font-semibold text-muted-foreground mb-1.5 flex items-center gap-1">
              <MapPin size={12} /> Pickup Location
            </label>
            <select
              value={pickupLocation}
              onChange={(e) => setPickupLocation(e.target.value)}
              className="w-full bg-muted border-0 rounded-xl px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-[oklch(0.42_0.09_200/0.3)] transition-all"
            >
              <option>Bangkok Suvarnabhumi Airport</option>
              <option>Bangkok Don Mueang Airport</option>
              <option>Phuket International Airport</option>
              <option>Chiang Mai Airport</option>
              <option>Pattaya City Center</option>
            </select>
          </div>

          {/* Date Range */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div>
              <label className="text-xs font-semibold text-muted-foreground mb-1.5 flex items-center gap-1">
                <Calendar size={12} /> Pickup Date
              </label>
              <input
                type="date"
                value={pickupDate}
                min={today}
                onChange={(e) => setPickupDate(e.target.value)}
                className="w-full bg-muted border-0 rounded-xl px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-[oklch(0.42_0.09_200/0.3)] transition-all"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-muted-foreground mb-1.5 flex items-center gap-1">
                <Calendar size={12} /> Return Date
              </label>
              <input
                type="date"
                value={returnDate}
                min={pickupDate || today}
                onChange={(e) => setReturnDate(e.target.value)}
                className="w-full bg-muted border-0 rounded-xl px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-[oklch(0.42_0.09_200/0.3)] transition-all"
              />
            </div>
          </div>

          {/* Price Summary */}
          <div className="bg-[oklch(0.42_0.09_200/0.06)] rounded-xl p-3 mb-4">
            <div className="flex justify-between text-sm mb-1">
              <span className="text-muted-foreground">{formatPrice(car.pricePerDay)} × {totalDays} day{totalDays > 1 ? "s" : ""}</span>
              <span className="font-semibold text-foreground">{formatPrice(car.pricePerDay * totalDays)}</span>
            </div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-muted-foreground">Service fee</span>
              <span className="font-semibold text-foreground">{formatPrice(Math.round(totalPrice * 0.05))}</span>
            </div>
            <div className="border-t border-[oklch(0.42_0.09_200/0.15)] mt-2 pt-2 flex justify-between">
              <span className="font-bold text-foreground" style={{ fontFamily: "'Sora', sans-serif" }}>Total</span>
              <span className="font-bold text-[oklch(0.42_0.09_200)] text-lg" style={{ fontFamily: "'Sora', sans-serif" }}>
                {formatPrice(Math.round(totalPrice * 1.05))}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Sticky Book Button */}
      <div className="fixed bottom-20 left-0 right-0 px-4 z-40">
        <div className="max-w-[480px] mx-auto">
          <button
            onClick={handleBooking}
            disabled={!car.available || isBooking}
            className="w-full py-4 rounded-2xl font-bold text-white text-base shadow-lg transition-all duration-200 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              fontFamily: "'Sora', sans-serif",
              background: car.available
                ? "linear-gradient(135deg, oklch(0.42 0.09 200), oklch(0.35 0.10 210))"
                : "oklch(0.75 0.02 200)",
              boxShadow: car.available ? "0 8px 24px oklch(0.42 0.09 200 / 0.35)" : "none",
            }}
          >
            {isBooking ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                Confirming…
              </span>
            ) : !isLoggedIn ? (
              "Login with LINE to Book"
            ) : !car.available ? (
              "Currently Unavailable"
            ) : (
              `Book Now · ${formatPrice(Math.round(totalPrice * 1.05))}`
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
