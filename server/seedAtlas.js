// Seed MongoDB Atlas with customer data
import { connectDB } from './database.js';
import { seedDatabase } from './seed.js';

console.log('🌱 Seeding MongoDB Atlas...');

try {
  await connectDB();
  await seedDatabase();
  console.log('✅ Atlas seeding complete!');
  process.exit(0);
} catch (error) {
  console.error('❌ Seeding failed:', error);
  process.exit(1);
}
