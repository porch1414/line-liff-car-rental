import type { Booking as DBBooking, Car } from "@/lib/carData";

export interface BookingDisplay {
  id: string;
  car: Car;
  dates: {
    pickupDate: string;
    returnDate: string;
    pickupLocation: string;
  };
  totalDays: number;
  totalPrice: number;
  status: "pending" | "confirmed" | "cancelled";
  bookingId: string;
}

/**
 * Transform a database booking record into the frontend display format.
 * This assumes the car data is available and computes derived fields.
 */
export function transformBooking(dbBooking: any, car: Car | null): BookingDisplay | null {
  if (!car) return null;

  const pickupDate = new Date(dbBooking.pickupDate);
  const returnDate = new Date(dbBooking.returnDate);
  const totalDays = Math.max(
    1,
    Math.ceil((returnDate.getTime() - pickupDate.getTime()) / (1000 * 60 * 60 * 24))
  );

  return {
    id: dbBooking.id,
    car,
    dates: {
      pickupDate: pickupDate.toISOString().split("T")[0],
      returnDate: returnDate.toISOString().split("T")[0],
      pickupLocation: dbBooking.pickupLocation,
    },
    totalDays,
    totalPrice: dbBooking.totalPrice,
    status: dbBooking.status || "confirmed",
    bookingId: dbBooking.id,
  };
}
