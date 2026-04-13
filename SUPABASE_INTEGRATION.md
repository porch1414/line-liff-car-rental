# Supabase Integration Guide

This document outlines the steps to connect the LINE LIFF Car Rental app to Supabase Postgres and deploy to Vercel.

## Database Setup

### 1. Create Tables in Supabase

The app expects three tables in your Supabase project:

#### `users` table
```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  openId VARCHAR(64) NOT NULL UNIQUE,
  name TEXT,
  email VARCHAR(320),
  loginMethod VARCHAR(64),
  role VARCHAR(50) DEFAULT 'user' NOT NULL,
  createdAt TIMESTAMP DEFAULT NOW() NOT NULL,
  updatedAt TIMESTAMP DEFAULT NOW() NOT NULL,
  lastSignedIn TIMESTAMP DEFAULT NOW() NOT NULL
);
```

#### `cars` table
```sql
CREATE TABLE cars (
  id VARCHAR(64) PRIMARY KEY,
  brand VARCHAR(100) NOT NULL,
  name VARCHAR(100) NOT NULL,
  category VARCHAR(50) NOT NULL,
  pricePerDay INTEGER NOT NULL,
  image TEXT,
  rating INTEGER,
  reviews INTEGER,
  seats INTEGER,
  transmission VARCHAR(50),
  fuelType VARCHAR(50),
  available INTEGER DEFAULT 1 NOT NULL,
  badge VARCHAR(50),
  createdAt TIMESTAMP DEFAULT NOW() NOT NULL,
  updatedAt TIMESTAMP DEFAULT NOW() NOT NULL
);
```

#### `bookings` table
```sql
CREATE TABLE bookings (
  id VARCHAR(64) PRIMARY KEY,
  lineUserId VARCHAR(255) NOT NULL,
  lineUserName VARCHAR(255) NOT NULL,
  carId VARCHAR(64) NOT NULL,
  pickupDate TIMESTAMP NOT NULL,
  returnDate TIMESTAMP NOT NULL,
  pickupLocation VARCHAR(255) NOT NULL,
  totalPrice INTEGER NOT NULL,
  status VARCHAR(50) DEFAULT 'confirmed' NOT NULL,
  createdAt TIMESTAMP DEFAULT NOW() NOT NULL,
  updatedAt TIMESTAMP DEFAULT NOW() NOT NULL
);
```

### 2. Seed Sample Car Data

Insert at least 5 realistic cars into the `cars` table:

```sql
INSERT INTO cars (id, brand, name, category, pricePerDay, image, rating, reviews, seats, transmission, fuelType, available, badge)
VALUES
  ('camry-2024', 'Toyota', 'Camry 2.5 Premium 2024', 'Sedan', 1650, 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1200&q=80', 5, 126, 5, 'Automatic', 'Hybrid', 1, 'Popular'),
  ('honda-crv-2024', 'Honda', 'CR-V Turbo 2024', 'SUV', 2100, 'https://images.unsplash.com/photo-1511919884226-fd3cad34687c?auto=format&fit=crop&w=1200&q=80', 5, 93, 5, 'Automatic', 'Petrol', 1, 'Family Pick'),
  ('yaris-2024', 'Toyota', 'Yaris ATIV Smart 2024', 'Compact', 990, 'https://images.unsplash.com/photo-1550355291-bbee04a92027?auto=format&fit=crop&w=1200&q=80', 5, 178, 5, 'Automatic', 'Petrol', 1, 'Best Value'),
  ('fortuner-2024', 'Toyota', 'Fortuner Legender 2024', 'SUV', 2550, 'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?auto=format&fit=crop&w=1200&q=80', 5, 81, 7, 'Automatic', 'Diesel', 1, 'Premium'),
  ('hiace-2024', 'Toyota', 'HiAce GL Grandia 2024', 'Van', 3200, 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80', 5, 54, 10, 'Automatic', 'Diesel', 1, 'Group Travel');
```

## Vercel Environment Variables

Set the following environment variables in your Vercel project settings:

| Variable | Value | Example |
|----------|-------|---------|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://postgres:password@db.jgicpvamaebcdphhrrty.supabase.co:5432/postgres` |
| `SUPABASE_URL` | Supabase project URL | `https://jgicpvamaebcdphhrrty.supabase.co` |
| `SUPABASE_SERVICE_ROLE_KEY` | Service role key from Supabase settings | `sb_secret_xxxxx` |
| `VITE_APP_ID` | LINE LIFF app ID | From LINE Developers console |
| `JWT_SECRET` | Random secret for JWT signing | Generate with `openssl rand -hex 32` |
| `OAUTH_SERVER_URL` | OAuth server URL | Your Manus OAuth endpoint |
| `OWNER_OPEN_ID` | Admin user's open ID | From your auth system |

## Deployment Steps

### 1. Push Changes to GitHub

```bash
git add .
git commit -m "feat: integrate Supabase Postgres and update for Vercel serverless"
git push origin main
```

### 2. Trigger Vercel Redeploy

1. Go to your Vercel dashboard
2. Select the `line-liff-car-rental` project
3. Click "Deployments"
4. Click the three-dot menu on the latest deployment
5. Select "Redeploy"

Alternatively, push to the connected GitHub branch to trigger an automatic redeploy.

### 3. Verify the Deployment

Once the deployment completes:

1. Open https://line-liff-car-rental.vercel.app
2. Navigate to the "Browse Cars" page
3. Confirm that cars from the Supabase `cars` table are displayed
4. Click "Book Now" on a car
5. Complete the booking form and submit
6. Verify that a new row appears in the Supabase `bookings` table

## Troubleshooting

### Cars Not Appearing

- Verify the `cars` table has data: `SELECT COUNT(*) FROM cars;`
- Check Vercel logs for API errors: Vercel Dashboard → Deployments → Logs
- Ensure `DATABASE_URL` is correctly set in Vercel environment variables

### Bookings Not Saving

- Verify the `bookings` table exists and is accessible
- Check that `LIFF_ID` matches your LINE app configuration
- Confirm the user is logged in via LINE LIFF before booking

### Database Connection Errors

- Verify the PostgreSQL connection string is correct
- Ensure Supabase SSL is enabled (the connection string should include `?sslmode=require`)
- Check that the Vercel IP is whitelisted in Supabase network settings (if applicable)

## Architecture Overview

The app uses the following data flow:

1. **Frontend (React)** → Calls tRPC endpoints via `/api/trpc`
2. **Vercel API Handler** (`api/server.ts`) → Routes to Express tRPC middleware
3. **tRPC Router** (`server/routers.ts`) → Calls database functions
4. **Database Layer** (`server/db.ts`) → Executes Drizzle ORM queries against Supabase Postgres
5. **Supabase Postgres** → Returns data

## Next Steps

- Implement booking cancellation mutation
- Add admin dashboard for viewing all bookings
- Set up automated email confirmations
- Add payment processing with Stripe
