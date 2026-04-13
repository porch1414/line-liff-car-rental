import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.error('DATABASE_URL environment variable is not set');
  process.exit(1);
}

async function seedDatabase() {
  let connection;
  try {
    connection = await mysql.createConnection(DATABASE_URL);

    // Define demo cars
    const cars = [
      {
        id: 'c1',
        brand: 'Toyota',
        name: 'Camry 2024',
        category: 'Sedan',
        pricePerDay: 1200,
        seats: 5,
        transmission: 'Auto',
        fuelType: 'Hybrid',
        image: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663549312228/Kw6FodCzAqfHhtkur2wrWq/car-sedan-TE4VMo84jW7fCEa9C52JcF.webp',
        rating: 4.8,
        reviews: 142,
        available: 1,
        badge: 'Popular',
      },
      {
        id: 'c2',
        brand: 'Honda',
        name: 'CR-V 2024',
        category: 'SUV',
        pricePerDay: 1600,
        seats: 5,
        transmission: 'Auto',
        fuelType: 'Petrol',
        image: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663549312228/Kw6FodCzAqfHhtkur2wrWq/car-suv-PkEReVAunyP6htRoxHepgK.webp',
        rating: 4.7,
        reviews: 98,
        available: 1,
        badge: 'New',
      },
      {
        id: 'c3',
        brand: 'Toyota',
        name: 'Yaris 2024',
        category: 'Compact',
        pricePerDay: 750,
        seats: 5,
        transmission: 'Auto',
        fuelType: 'Petrol',
        image: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663549312228/Kw6FodCzAqfHhtkur2wrWq/car-compact-DjfoquXLP9LnMKfqgxm5ER.webp',
        rating: 4.5,
        reviews: 211,
        available: 1,
        badge: 'Best Value',
      },
      {
        id: 'c4',
        brand: 'Toyota',
        name: 'HiAce 2024',
        category: 'Van',
        pricePerDay: 2200,
        seats: 12,
        transmission: 'Manual',
        fuelType: 'Diesel',
        image: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663549312228/Kw6FodCzAqfHhtkur2wrWq/car-van-FckKaYKkFnfMjr8CqeD8GX.webp',
        rating: 4.6,
        reviews: 67,
        available: 1,
        badge: null,
      },
      {
        id: 'c5',
        brand: 'Honda',
        name: 'Accord 2023',
        category: 'Sedan',
        pricePerDay: 1350,
        seats: 5,
        transmission: 'Auto',
        fuelType: 'Hybrid',
        image: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663549312228/Kw6FodCzAqfHhtkur2wrWq/car-sedan-TE4VMo84jW7fCEa9C52JcF.webp',
        rating: 4.6,
        reviews: 89,
        available: 0,
        badge: null,
      },
      {
        id: 'c6',
        brand: 'Toyota',
        name: 'Fortuner 2024',
        category: 'SUV',
        pricePerDay: 1900,
        seats: 7,
        transmission: 'Auto',
        fuelType: 'Diesel',
        image: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663549312228/Kw6FodCzAqfHhtkur2wrWq/car-suv-PkEReVAunyP6htRoxHepgK.webp',
        rating: 4.9,
        reviews: 134,
        available: 1,
        badge: 'Premium',
      },
    ];

    // Clear existing cars
    console.log('Clearing existing cars...');
    await connection.execute('DELETE FROM cars');

    // Insert demo cars
    console.log('Inserting demo cars...');
    for (const car of cars) {
      await connection.execute(
        `INSERT INTO cars (id, brand, name, category, pricePerDay, seats, transmission, fuelType, image, rating, reviews, available, badge) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          car.id,
          car.brand,
          car.name,
          car.category,
          car.pricePerDay,
          car.seats,
          car.transmission,
          car.fuelType,
          car.image,
          car.rating,
          car.reviews,
          car.available,
          car.badge,
        ]
      );
      console.log(`✓ Inserted ${car.brand} ${car.name}`);
    }

    console.log('\n✅ Database seeded successfully!');
    console.log(`Total cars inserted: ${cars.length}`);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

seedDatabase();
