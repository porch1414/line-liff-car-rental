/**
 * BookingContext – Manages car rental booking state
 * Design: Coastal Breeze
 */
import React, { createContext, useContext, useState } from "react";
import { Car } from "@/lib/carData";

export interface BookingDates {
  pickupDate: string;
  returnDate: string;
  pickupLocation: string;
}

export interface Booking {
  car: Car;
  dates: BookingDates;
  totalDays: number;
  totalPrice: number;
  status: "pending" | "confirmed" | "cancelled";
  bookingId: string;
}

interface BookingContextType {
  selectedCar: Car | null;
  bookingDates: BookingDates;
  bookings: Booking[];
  selectCar: (car: Car) => void;
  setBookingDates: (dates: BookingDates) => void;
  confirmBooking: (car: Car, dates: BookingDates) => Booking;
  cancelBooking: (bookingId: string) => void;
}

const defaultDates: BookingDates = {
  pickupDate: "",
  returnDate: "",
  pickupLocation: "Bangkok Suvarnabhumi Airport",
};

const BookingContext = createContext<BookingContextType | null>(null);

export function BookingProvider({ children }: { children: React.ReactNode }) {
  const [selectedCar, setSelectedCar] = useState<Car | null>(null);
  const [bookingDates, setBookingDates] = useState<BookingDates>(defaultDates);
  const [bookings, setBookings] = useState<Booking[]>([]);

  const selectCar = (car: Car) => setSelectedCar(car);

  const confirmBooking = (car: Car, dates: BookingDates): Booking => {
    const pickup = new Date(dates.pickupDate);
    const returnD = new Date(dates.returnDate);
    const totalDays = Math.max(1, Math.ceil((returnD.getTime() - pickup.getTime()) / (1000 * 60 * 60 * 24)));
    const totalPrice = car.pricePerDay * totalDays;
    const booking: Booking = {
      car,
      dates,
      totalDays,
      totalPrice,
      status: "confirmed",
      bookingId: `DE-${Date.now().toString(36).toUpperCase()}`,
    };
    setBookings((prev) => [booking, ...prev]);
    return booking;
  };

  const cancelBooking = (bookingId: string) => {
    setBookings((prev) =>
      prev.map((b) => b.bookingId === bookingId ? { ...b, status: "cancelled" as const } : b)
    );
  };

  return (
    <BookingContext.Provider value={{
      selectedCar,
      bookingDates,
      bookings,
      selectCar,
      setBookingDates,
      confirmBooking,
      cancelBooking,
    }}>
      {children}
    </BookingContext.Provider>
  );
}

export function useBooking() {
  const ctx = useContext(BookingContext);
  if (!ctx) throw new Error("useBooking must be used within BookingProvider");
  return ctx;
}
