import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { z } from "zod";
import { getAllCars, getCarById, createBooking, getBookingsByLineUserId } from "./db";

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  cars: router({
    list: publicProcedure.query(async () => {
      return await getAllCars();
    }),
    getById: publicProcedure
      .input(z.object({ id: z.string() }))
      .query(async ({ input }) => {
        return await getCarById(input.id);
      }),
  }),

  bookings: router({
    create: publicProcedure
      .input(
        z.object({
          lineUserId: z.string(),
          lineUserName: z.string(),
          carId: z.string(),
          pickupDate: z.date(),
          returnDate: z.date(),
          pickupLocation: z.string(),
          totalPrice: z.number(),
        })
      )
      .mutation(async ({ input }) => {
        const booking = await createBooking({
          lineUserId: input.lineUserId,
          lineUserName: input.lineUserName,
          carId: input.carId,
          pickupDate: input.pickupDate,
          returnDate: input.returnDate,
          pickupLocation: input.pickupLocation,
          totalPrice: input.totalPrice,
        });
        return booking;
      }),
    getByLineUserId: publicProcedure
      .input(z.object({ lineUserId: z.string() }))
      .query(async ({ input }) => {
        return await getBookingsByLineUserId(input.lineUserId);
      }),
  }),
});

export type AppRouter = typeof appRouter;
