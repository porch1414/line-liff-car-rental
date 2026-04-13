import { integer, pgEnum, pgTable, text, timestamp, varchar, doublePrecision, boolean } from "drizzle-orm/pg-core";

export const roleEnum = pgEnum("role", ["user", "admin"]);

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = pgTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: roleEnum("role").default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

// Cars table for car rental inventory
export const cars = pgTable("cars", {
  id: integer("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  price_per_day: doublePrecision("price_per_day").notNull(),
  image_url: text("image_url"),
  description: text("description"),
  is_available: boolean("is_available").default(true).notNull(),
});

export type Car = typeof cars.$inferSelect;
export type InsertCar = typeof cars.$inferInsert;

// Bookings table for car rental bookings
export const bookings = pgTable("bookings", {
  id: varchar("id", { length: 64 }).primaryKey(),
  lineUserId: varchar("lineUserId", { length: 255 }).notNull(),
  lineUserName: varchar("lineUserName", { length: 255 }).notNull(),
  carId: varchar("carId", { length: 64 }).notNull(),
  pickupDate: timestamp("pickupDate").notNull(),
  returnDate: timestamp("returnDate").notNull(),
  pickupLocation: varchar("pickupLocation", { length: 255 }).notNull(),
  totalPrice: integer("totalPrice").notNull(),
  status: varchar("status", { length: 50 }).default("confirmed").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});

export type Booking = typeof bookings.$inferSelect;
export type InsertBooking = typeof bookings.$inferInsert;