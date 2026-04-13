/**
 * CarDetail – Car detail page with booking form
 * Design: Coastal Breeze — full-bleed image, booking date picker, confirm CTA
 */
import { useState } from "react";
import { useLocation, useParams } from "wouter";
import { ArrowLeft, Star, Users, Fuel, Settings, Check, MapPin, Calendar, Loader2 } from "lucide-react";
import { formatPrice } from "@/lib/carData";
import { useBooking } from "@/contexts/BookingContext";
import { useLiffContext } from "@/contexts/LiffContext";
import { sendBookingConfirmation } from "@/lib/liffMessaging";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

export default function CarDetail() {
  const { id } = useParams<{ id: string }>();
  const [, navigate] = useLocation();
  const { confirmBooking } = useBooking();
  const { isLoggedIn, login, liff, profile } = useLiffContext();

  // Fetch car from tRPC API
  const { data: car, isLoading: carLoading } = trpc.cars.getById.useQuery({ id: id || "" }, { enabled: !!id });
  const bookingMutation = trpc.bookings.create.useMutation();

  const today = new Date().toISOString().split("T")[0];
  const tomorrow = new Date(Date.now() + 86400000).toISOString().split("T")[0];

  const [pickupDate, setPickupDate] = useState(today);
  const [returnDate, setReturnDate] = useState(tomorrow);
  const [pickupLocation, setPickupLocation] = useState("Bangkok Suvarnabhumi Airport");
  const [isBooking, setIsBooking] = useState(false);

  if (carLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="animate-spin text-[oklch(0.42_0.09_200)]" size={32} />
      </div>
    );
  }

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
    if (!profile) {
      toast.error("Unable to fetch user profile");
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
    try {
      // Create booking via tRPC API
      const booking = await bookingMutation.mutateAsync({
        lineUserId: profile.userId,
        lineUserName: profile.displayName,
        carId: car.id,
        pickupDate: new Date(pickupDate),
        returnDate: new Date(returnDate),
        pickupLocation,
        totalPrice,
      });

      // Send booking confirmation to LINE chat
      if (liff) {
        await sendBookingConfirmation(liff, {
          car,
          pickupDate,
          returnDate,
          totalDays,
          totalPrice,
          pickupLocation,
          bookingId: booking?.id || "unknown",
        });
      }

      toast.success(`Booking confirmed! ID: ${booking?.id}`, {
        description: `${car.brand} ${car.name} · ${totalDays} day${totalDays > 1 ? "s" : ""} · Message sent to LINE`,
      });
      navigate("/bookings");
    } catch (error) {
      console.error("Booking error:", error);
      toast.error("Failed to create booking. Please try again.");
    } finally {
      setIsBooking(false);
    }
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
          src={car.image || ""}
          alt={`${car.brand} ${car.name}`}
          className="w-full h-full object-contain p-4"
        />
      </div>

      {/* Car Info */}
      <div className="mx-4 mt-4">
        <div className="flex items-start justify-between mb-2">
          <div>
            <p className="text-xs text-muted-foreground">{car.category}</p>
            <h1 className="text-2xl font-bold text-foreground" style={{ fontFamily: "'Sora', sans-serif" }}>
              {car.brand} {car.name}
            </h1>
          </div>
          {car.badge && (
            <div className="bg-[oklch(0.72_0.16_65)] text-white text-xs font-bold px-3 py-1 rounded-full">
              {car.badge}
            </div>
          )}
        </div>

        {/* Rating */}
        {car.rating && (
          <div className="flex items-center gap-1 mb-4">
            <div className="flex items-center gap-0.5">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={14}
                  className={i < Math.floor(car.rating || 0) ? "fill-[oklch(0.72_0.16_65)] text-[oklch(0.72_0.16_65)]" : "text-muted-foreground"}
                />
              ))}
            </div>
            <span className="text-xs text-muted-foreground">{car.rating} ({car.reviews} reviews)</span>
          </div>
        )}

        {/* Specs */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          {car.seats && (
            <div className="bg-muted rounded-xl p-3 text-center">
              <Users size={18} className="text-[oklch(0.42_0.09_200)] mx-auto mb-1" />
              <p className="text-xs text-muted-foreground">{car.seats} Seats</p>
            </div>
          )}
          {car.transmission && (
            <div className="bg-muted rounded-xl p-3 text-center">
              <Settings size={18} className="text-[oklch(0.42_0.09_200)] mx-auto mb-1" />
              <p className="text-xs text-muted-foreground">{car.transmission}</p>
            </div>
          )}
          {car.fuelType && (
            <div className="bg-muted rounded-xl p-3 text-center">
              <Fuel size={18} className="text-[oklch(0.42_0.09_200)] mx-auto mb-1" />
              <p className="text-xs text-muted-foreground">{car.fuelType}</p>
            </div>
          )}
        </div>
      </div>

      {/* Booking Form */}
      <div className="mx-4 mb-6 bg-white rounded-2xl border border-border p-5 shadow-sm">
        <h2 className="text-base font-bold text-foreground mb-4" style={{ fontFamily: "'Sora', sans-serif" }}>
          Booking Details
        </h2>

        {/* Pickup Date */}
        <div className="mb-4">
          <label className="text-xs font-semibold text-muted-foreground mb-2 block">Pickup Date</label>
          <div className="flex items-center gap-2 bg-muted rounded-xl px-3 py-2.5">
            <Calendar size={16} className="text-[oklch(0.42_0.09_200)]" />
            <input
              type="date"
              value={pickupDate}
              onChange={(e) => setPickupDate(e.target.value)}
              className="flex-1 bg-transparent text-sm text-foreground outline-none"
            />
          </div>
        </div>

        {/* Return Date */}
        <div className="mb-4">
          <label className="text-xs font-semibold text-muted-foreground mb-2 block">Return Date</label>
          <div className="flex items-center gap-2 bg-muted rounded-xl px-3 py-2.5">
            <Calendar size={16} className="text-[oklch(0.42_0.09_200)]" />
            <input
              type="date"
              value={returnDate}
              onChange={(e) => setReturnDate(e.target.value)}
              className="flex-1 bg-transparent text-sm text-foreground outline-none"
            />
          </div>
        </div>

        {/* Pickup Location */}
        <div className="mb-6">
          <label className="text-xs font-semibold text-muted-foreground mb-2 block">Pickup Location</label>
          <div className="flex items-center gap-2 bg-muted rounded-xl px-3 py-2.5">
            <MapPin size={16} className="text-[oklch(0.42_0.09_200)]" />
            <input
              type="text"
              value={pickupLocation}
              onChange={(e) => setPickupLocation(e.target.value)}
              className="flex-1 bg-transparent text-sm text-foreground outline-none"
            />
          </div>
        </div>

        {/* Price Summary */}
        <div className="bg-[oklch(0.42_0.09_200/0.06)] rounded-xl p-4 mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">{formatPrice(car.pricePerDay)} × {totalDays} day{totalDays > 1 ? "s" : ""}</span>
            <span className="text-sm font-semibold text-foreground">{formatPrice(totalPrice)}</span>
          </div>
          <div className="border-t border-border pt-2 flex items-center justify-between">
            <span className="text-sm font-bold text-foreground">Total</span>
            <span className="text-lg font-bold text-[oklch(0.42_0.09_200)]">{formatPrice(totalPrice)}</span>
          </div>
        </div>

        {/* Book Button */}
        <button
          onClick={handleBooking}
          disabled={isBooking}
          className="w-full bg-[oklch(0.42_0.09_200)] hover:bg-[oklch(0.38_0.09_200)] disabled:opacity-50 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-all"
          style={{ fontFamily: "'Sora', sans-serif" }}
        >
          {isBooking ? (
            <>
              <Loader2 size={18} className="animate-spin" />
              Booking...
            </>
          ) : (
            <>
              <Check size={18} />
              Book Now
            </>
          )}
        </button>
      </div>
    </div>
  );
}
