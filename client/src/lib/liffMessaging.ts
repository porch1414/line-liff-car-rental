/**
 * liffMessaging.ts – Utilities for sending messages via liff.sendMessages()
 * Design: Coastal Breeze — sends booking confirmation to LINE chat
 */

import { Car, formatPrice } from "./carData";

export interface BookingMessage {
  car: Car;
  pickupDate: string;
  returnDate: string;
  totalDays: number;
  totalPrice: number;
  pickupLocation: string;
  bookingId: string;
}

/**
 * Send booking confirmation message to LINE chat
 * Uses liff.sendMessages() with chat_message.write scope
 */
export async function sendBookingConfirmation(
  liff: typeof import("@line/liff").default | null,
  booking: BookingMessage
): Promise<boolean> {
  if (!liff) {
    console.error("LIFF not initialized");
    return false;
  }

  try {
    // Format dates
    const pickupDate = new Date(booking.pickupDate).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
    const returnDate = new Date(booking.returnDate).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

    // Create booking summary message
    const messages: any[] = [
      {
        type: "text" as const,
        text: `🚗 DriveEase Booking Confirmed!\n\n📋 Booking ID: ${booking.bookingId}`,
      },
      {
        type: "text" as const,
        text: `${booking.car.brand} ${booking.car.name}\n\n📍 Pickup: ${booking.pickupLocation}\n📅 From: ${pickupDate}\n📅 To: ${returnDate}\n⏱️ Duration: ${booking.totalDays} day${booking.totalDays > 1 ? "s" : ""}\n\n💰 Total: ${formatPrice(booking.totalPrice)}`,
      },
      {
        type: "text" as const,
        text: "✅ Your booking has been confirmed. You'll receive updates via LINE.",
      },
    ];

    console.log("Sending booking messages to LINE chat...", messages);
    await liff.sendMessages(messages);
    console.log("Messages sent successfully!");
    return true;
  } catch (error) {
    console.error("Failed to send booking message:", error);
    return false;
  }
}

/**
 * Send a simple text message to LINE chat
 */
export async function sendMessage(
  liff: typeof import("@line/liff").default | null,
  text: string
): Promise<boolean> {
  if (!liff) {
    console.error("LIFF not initialized");
    return false;
  }

  try {
    await liff.sendMessages([{ type: "text" as const, text }]);
    return true;
  } catch (error) {
    console.error("Failed to send message:", error);
    return false;
  }
}
