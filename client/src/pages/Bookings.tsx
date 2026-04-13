/**
 * Bookings – User booking history page
 * Design: Coastal Breeze
 */
import { useLocation } from "wouter";
import { CalendarCheck, Car, ChevronRight, Clock, CheckCircle2, XCircle, Loader2 } from "lucide-react";
import { useBooking, type Booking } from "@/contexts/BookingContext";
import { formatPrice } from "@/lib/carData";
import { toast } from "sonner";
import { useLiffContext } from "@/contexts/LiffContext";
import { trpc } from "@/lib/trpc";
import { transformBooking } from "@/lib/bookingTransform";

const statusConfig = {
  confirmed: {
    icon: CheckCircle2,
    label: "Confirmed",
    color: "text-emerald-600",
    bg: "bg-emerald-50",
  },
  pending: {
    icon: Clock,
    label: "Pending",
    color: "text-amber-600",
    bg: "bg-amber-50",
  },
  cancelled: {
    icon: XCircle,
    label: "Cancelled",
    color: "text-destructive",
    bg: "bg-red-50",
  },
};

function BookingCard({ booking, onCancel }: { booking: Booking; onCancel: (id: string) => void }) {
  const status = statusConfig[booking.status];
  const StatusIcon = status.icon;

  return (
    <div className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden">
      {/* Car image strip */}
      <div className="flex items-center gap-3 p-4 border-b border-border">
        <div className="w-20 h-14 rounded-xl bg-[oklch(0.96_0.01_90)] overflow-hidden shrink-0">
          <img
            src={booking.car.image || ""}
            alt={booking.car.name}
            className="w-full h-full object-contain p-1"
          />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs text-muted-foreground">{booking.car.brand}</p>
          <h3 className="font-bold text-foreground text-sm truncate" style={{ fontFamily: "'Sora', sans-serif" }}>
            {booking.car.name}
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5">ID: {booking.bookingId}</p>
        </div>
        <div className={`flex items-center gap-1 px-2.5 py-1 rounded-full ${status.bg}`}>
          <StatusIcon size={12} className={status.color} />
          <span className={`text-xs font-semibold ${status.color}`} style={{ fontFamily: "'Sora', sans-serif" }}>
            {status.label}
          </span>
        </div>
      </div>

      {/* Booking details */}
      <div className="p-4">
        <div className="grid grid-cols-2 gap-3 mb-3">
          <div>
            <p className="text-[10px] text-muted-foreground mb-0.5">Pickup</p>
            <p className="text-sm font-semibold text-foreground">{booking.dates.pickupDate}</p>
          </div>
          <div>
            <p className="text-[10px] text-muted-foreground mb-0.5">Return</p>
            <p className="text-sm font-semibold text-foreground">{booking.dates.returnDate}</p>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[10px] text-muted-foreground">Duration</p>
            <p className="text-sm font-semibold text-foreground">
              {booking.totalDays} day{booking.totalDays > 1 ? "s" : ""}
            </p>
          </div>
          <div className="text-right">
            <p className="text-[10px] text-muted-foreground">Total Paid</p>
            <p className="text-base font-bold text-[oklch(0.42_0.09_200)]" style={{ fontFamily: "'Sora', sans-serif" }}>
              {formatPrice(Math.round(booking.totalPrice * 1.05))}
            </p>
          </div>
        </div>

        {booking.status === "confirmed" && (
          <button
            onClick={() => onCancel(booking.bookingId)}
            className="mt-3 w-full py-2 rounded-xl border border-destructive/30 text-destructive text-sm font-semibold transition-colors hover:bg-red-50"
            style={{ fontFamily: "'Sora', sans-serif" }}
          >
            Cancel Booking
          </button>
        )}
      </div>
    </div>
  );
}

export default function Bookings() {
  const [, navigate] = useLocation();
  const { cancelBooking } = useBooking();
  const { profile } = useLiffContext();
  const { data: liveBookings = [], isLoading } = trpc.bookings.getByLineUserId.useQuery(
    { lineUserId: profile?.userId || "" },
    { enabled: !!profile?.userId }
  );
  const { data: allCars = [] } = trpc.cars.list.useQuery();

  const bookings: Booking[] = (liveBookings as any[])
    .map((dbBooking: any) => {
      const car = (allCars as any[]).find((c: any) => c.id === dbBooking.carId);
      const transformed = transformBooking(dbBooking, car);
      return transformed as Booking;
    })
    .filter((b): b is Booking => b !== null);

  const handleCancel = (bookingId: string) => {
    // In a real app, you would call a mutation to cancel the booking
    // For now, just show a message
    toast.info("Booking cancellation is not yet implemented");
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-border">
        <div className="max-w-[480px] mx-auto px-4 py-4">
          <h1 className="text-xl font-bold text-foreground" style={{ fontFamily: "'Sora', sans-serif" }}>
            My Bookings
          </h1>
        </div>
      </header>

      <div className="max-w-[480px] mx-auto px-4 mt-4">
        {isLoading || !profile?.userId ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="animate-spin text-[oklch(0.42_0.09_200)]" size={32} />
          </div>
        ) : bookings.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-20 h-20 rounded-full bg-[oklch(0.42_0.09_200/0.08)] flex items-center justify-center mx-auto mb-5">
              <CalendarCheck size={32} className="text-[oklch(0.42_0.09_200)]" />
            </div>
            <h2 className="text-lg font-bold text-foreground mb-2" style={{ fontFamily: "'Sora', sans-serif" }}>
              No Bookings Yet
            </h2>
            <p className="text-sm text-muted-foreground mb-6">
              Your rental history will appear here once you make a booking.
            </p>
            <button
              onClick={() => navigate("/cars")}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl font-bold text-white text-sm"
              style={{
                fontFamily: "'Sora', sans-serif",
                background: "linear-gradient(135deg, oklch(0.42 0.09 200), oklch(0.35 0.10 210))",
                boxShadow: "0 8px 24px oklch(0.42 0.09 200 / 0.3)",
              }}
            >
              <Car size={16} />
              Browse Cars
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {bookings.map((booking, i) => (
              <div
                key={booking.id}
                className="animate-slide-up"
                style={{ animationDelay: `${i * 60}ms`, animationFillMode: "both" }}
              >
                <BookingCard booking={booking as any} onCancel={handleCancel} />
              </div>
            ))}
          </div>
        )
        }
      </div>
    </div>
  );
}
