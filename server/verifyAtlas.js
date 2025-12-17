// Verify Atlas data
import { connectDB, closeDB } from './database.js';

console.log('🔍 Verifying MongoDB Atlas data...\n');

try {
  const db = await connectDB();
  
  const customers = await db.collection('customers').find({}).toArray();
  console.log(`✅ Customers: ${customers.length}`);
  
  if (customers.length > 0) {
    console.log('\n📋 Sample Customers:');
    customers.slice(0, 3).forEach(c => {
      console.log(`  - ${c.name} (${c.phone}) - ₹${c.preApprovedLimit.toLocaleString()}`);
    });
  }
  
  const creditScores = await db.collection('creditScores').find({}).toArray();
  console.log(`\n✅ Credit Scores: ${creditScores.length}`);
  
  const offers = await db.collection('offers').find({}).toArray();
  console.log(`✅ Loan Offers: ${offers.length}`);
  
  await closeDB();
  console.log('\n🎉 MongoDB Atlas is ready for your demo!');
  process.exit(0);
} catch (error) {
  console.error('❌ Verification failed:', error);
  process.exit(1);
}
