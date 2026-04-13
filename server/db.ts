import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { InsertUser, users, cars, bookings, InsertBooking, Car, Booking } from "../drizzle/schema";
import { ENV } from './_core/env';
import { nanoid } from "nanoid";

let _db: ReturnType<typeof drizzle> | null = null;
let _client: ReturnType<typeof postgres> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _client = postgres(process.env.DATABASE_URL, { ssl: "require" });
      _db = drizzle(_client);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
      _client = null;
    }
  }
  return _db;
}

export async function closeDb() {
  if (_client) {
    await _client.end();
    _client = null;
    _db = null;
  }
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role as any;
      updateSet.role = user.role as any;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin' as any;
      updateSet.role = 'admin' as any;
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onConflictDoUpdate({
      target: users.openId,
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

export async function getAllCars(): Promise<Car[]> {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get cars: database not available");
    return [];
  }

  try {
    const result = await db.select().from(cars);
    return result;
  } catch (error) {
    console.error("[Database] Failed to get cars:", error);
    return [];
  }
}

export async function getCarById(carId: string): Promise<Car | undefined> {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get car: database not available");
    return undefined;
  }

  try {
    const result = await db.select().from(cars).where(eq(cars.id, carId)).limit(1);
    return result.length > 0 ? result[0] : undefined;
  } catch (error) {
    console.error("[Database] Failed to get car:", error);
    return undefined;
  }
}

export async function createBooking(booking: Omit<InsertBooking, 'id'>): Promise<Booking | null> {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot create booking: database not available");
    return null;
  }

  try {
    const bookingWithId: InsertBooking = {
      ...booking,
      id: nanoid(),
      status: "confirmed",
    };
    await db.insert(bookings).values(bookingWithId);
    return bookingWithId as Booking;
  } catch (error) {
    console.error("[Database] Failed to create booking:", error);
    return null;
  }
}

export async function getBookingsByLineUserId(lineUserId: string): Promise<Booking[]> {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get bookings: database not available");
    return [];
  }

  try {
    const result = await db.select().from(bookings).where(eq(bookings.lineUserId, lineUserId));
    return result;
  } catch (error) {
    console.error("[Database] Failed to get bookings:", error);
    return [];
  }
}
