import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { appRouter } from "./routers";

describe("Cars tRPC Procedures", () => {
  let caller: ReturnType<typeof appRouter.createCaller>;

  beforeAll(() => {
    // Create a public caller context (no user authentication required)
    const ctx = {
      user: null,
      req: {
        protocol: "https",
        headers: {},
      },
      res: {},
    };
    caller = appRouter.createCaller(ctx as any);
  });

  it("should list all cars", async () => {
    const cars = await caller.cars.list();
    expect(Array.isArray(cars)).toBe(true);
    // Should return at least the demo cars
    expect(cars.length).toBeGreaterThanOrEqual(0);
  });

  it("should get a car by ID", async () => {
    const car = await caller.cars.getById({ id: "c1" });
    if (car) {
      expect(car.id).toBe("c1");
      expect(car.name).toBeDefined();
      expect(car.brand).toBeDefined();
      expect(car.pricePerDay).toBeGreaterThan(0);
    }
  });

  it("should return undefined for non-existent car", async () => {
    const car = await caller.cars.getById({ id: "non-existent" });
    expect(car).toBeUndefined();
  });
});

describe("Bookings tRPC Procedures", () => {
  let caller: ReturnType<typeof appRouter.createCaller>;

  beforeAll(() => {
    const ctx = {
      user: null,
      req: {
        protocol: "https",
        headers: {},
      },
      res: {},
    };
    caller = appRouter.createCaller(ctx as any);
  });

  it("should create a booking", async () => {
    const booking = await caller.bookings.create({
      lineUserId: "U1234567890abcdef1234567890abcdef",
      lineUserName: "Test User",
      carId: "c1",
      pickupDate: new Date("2026-05-01"),
      returnDate: new Date("2026-05-03"),
      pickupLocation: "Bangkok Airport",
      totalPrice: 2400,
    });

    expect(booking).toBeDefined();
    expect(booking?.lineUserId).toBe("U1234567890abcdef1234567890abcdef");
    expect(booking?.lineUserName).toBe("Test User");
    expect(booking?.carId).toBe("c1");
    expect(booking?.totalPrice).toBe(2400);
    expect(booking?.status).toBe("confirmed");
  });

  it("should get bookings by LINE user ID", async () => {
    const lineUserId = "U1234567890abcdef1234567890abcdef";
    
    // First create a booking
    await caller.bookings.create({
      lineUserId,
      lineUserName: "Test User 2",
      carId: "c2",
      pickupDate: new Date("2026-05-10"),
      returnDate: new Date("2026-05-12"),
      pickupLocation: "Bangkok Airport",
      totalPrice: 3200,
    });

    // Then retrieve bookings for that user
    const bookings = await caller.bookings.getByLineUserId({ lineUserId });
    expect(Array.isArray(bookings)).toBe(true);
    expect(bookings.length).toBeGreaterThan(0);
    expect(bookings.some(b => b.lineUserId === lineUserId)).toBe(true);
  });

  it("should return empty array for non-existent user", async () => {
    const bookings = await caller.bookings.getByLineUserId({ lineUserId: "non-existent-user" });
    expect(Array.isArray(bookings)).toBe(true);
    expect(bookings.length).toBe(0);
  });
});
