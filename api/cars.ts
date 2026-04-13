import type { VercelRequest, VercelResponse } from "@vercel/node";
import postgres from "postgres";

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  // Set CORS headers
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET,OPTIONS,PATCH,DELETE,POST,PUT"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version"
  );

  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  if (req.method !== "GET") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  try {
    const databaseUrl = process.env.DATABASE_URL;
    if (!databaseUrl) {
      console.error("DATABASE_URL not set");
      res.status(500).json({ error: "Database configuration missing" });
      return;
    }

    // Create postgres connection
    const sql = postgres(databaseUrl, {
      ssl: "require",
      max: 1,
    });

    // Query cars from database
    const cars = await sql`
      SELECT id, name, price_per_day as "pricePerDay", image_url as "imageUrl", description, is_available as "isAvailable"
      FROM cars
      WHERE is_available = true
      ORDER BY id ASC
    `;

    // Close connection
    await sql.end();

    // Return cars as JSON
    res.status(200).json({
      result: {
        data: cars,
      },
    });
  } catch (error) {
    console.error("Error fetching cars:", error);
    res.status(500).json({
      error: "Failed to fetch cars",
      message: error instanceof Error ? error.message : "Unknown error",
    });
  }
}
