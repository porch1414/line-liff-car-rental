/**
 * CarDetail – Car detail page with booking form
 * Design: Coastal Breeze — full-bleed image, booking date picker, confirm CTA
 */
import { useState } from "react";
import { useLocation, useParams } from "wouter";
import { ArrowLeft, Calendar, Loader2, MapPin } from "lucide-react";
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
  const totalPrice = car.price_per_day * totalDays;

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
        lineUserName: profile.displayName || "User",
        carId: String(car.id),
        pickupDate: new Date(pickupDate),
        returnDate: new Date(returnDate),
        pickupLocation,
        totalPrice: Math.round(totalPrice),
      });

      confirmBooking(car, {
        pickupDate,
        returnDate,
        pickupLocation,
      });

      // Send LINE message
      if (liff?.isLoggedIn()) {
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
        description: `${car.name} · ${totalDays} day${totalDays > 1 ? "s" : ""} · Message sent to LINE`,
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
          src={car.image_url || ""}
          alt={car.name}
          className="w-full h-full object-contain p-4"
        />
      </div>

      {/* Car Info */}
      <div className="mx-4 mt-4">
        <h1 className="text-2xl font-bold text-foreground mb-2" style={{ fontFamily: "'Sora', sans-serif" }}>
          {car.name}
        </h1>

        {/* Description */}
        {car.description && (
          <p className="text-sm text-muted-foreground mb-4">
            {car.description}
          </p>
        )}

        {/* Price */}
        <div className="bg-muted rounded-xl p-4 mb-6">
          <p className="text-xs text-muted-foreground mb-1">Daily Rate</p>
          <p className="text-2xl font-bold text-[oklch(0.42_0.09_200)]">
            {formatPrice(car.price_per_day)}
          </p>
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
            <Calendar size={16} className="text-muted-foreground" />
            <input
              type="date"
              value={pickupDate}
              onChange={(e) => setPickupDate(e.target.value)}
              className="flex-1 bg-transparent text-foreground text-sm focus:outline-none"
            />
          </div>
        </div>

        {/* Return Date */}
        <div className="mb-4">
          <label className="text-xs font-semibold text-muted-foreground mb-2 block">Return Date</label>
          <div className="flex items-center gap-2 bg-muted rounded-xl px-3 py-2.5">
            <Calendar size={16} className="text-muted-foreground" />
            <input
              type="date"
              value={returnDate}
              onChange={(e) => setReturnDate(e.target.value)}
              className="flex-1 bg-transparent text-foreground text-sm focus:outline-none"
            />
          </div>
        </div>

        {/* Pickup Location */}
        <div className="mb-4">
          <label className="text-xs font-semibold text-muted-foreground mb-2 block">Pickup Location</label>
          <div className="flex items-center gap-2 bg-muted rounded-xl px-3 py-2.5">
            <MapPin size={16} className="text-muted-foreground" />
            <input
              type="text"
              value={pickupLocation}
              onChange={(e) => setPickupLocation(e.target.value)}
              className="flex-1 bg-transparent text-foreground text-sm focus:outline-none"
            />
          </div>
        </div>

        {/* Booking Summary */}
        <div className="bg-muted rounded-xl p-4 mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-muted-foreground">Rental Days</span>
            <span className="font-semibold text-foreground">{totalDays}</span>
          </div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-muted-foreground">Daily Rate</span>
            <span className="font-semibold text-foreground">{formatPrice(car.price_per_day)}</span>
          </div>
          <div className="border-t border-border pt-2 flex justify-between items-center">
            <span className="text-sm font-semibold text-foreground">Total</span>
            <span className="text-lg font-bold text-[oklch(0.42_0.09_200)]">{formatPrice(totalPrice)}</span>
          </div>
        </div>
      </div>

      {/* Book Button */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-border p-4 max-w-[480px] mx-auto">
        <button
          onClick={handleBooking}
          disabled={isBooking}
          className="w-full bg-[oklch(0.42_0.09_200)] text-white font-semibold py-3 rounded-xl hover:bg-[oklch(0.38_0.09_200)] disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
        >
          {isBooking ? (
            <>
              <Loader2 size={18} className="animate-spin" />
              Booking...
            </>
          ) : (
            "Confirm Booking"
          )}
        </button>
      </div>
    </div>
  );
}
