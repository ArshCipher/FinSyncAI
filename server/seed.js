import { getDB } from './database.js';

export async function seedDatabase() {
  const db = getDB();
  
  // Clear existing data
  await db.collection('customers').deleteMany({});
  await db.collection('creditScores').deleteMany({});
  await db.collection('offers').deleteMany({});
  
  // Seed customers
  const customers = [
    {
      customerId: 'C001',
      name: 'Rajesh Kumar',
      phone: '+91-9876543210',
      email: 'rajesh.kumar@email.com',
      panCard: 'ABCDE1234F',
      aadhaar: '1234-5678-9012',
      dob: '1985-03-15',
      address: '123 MG Road, Bangalore, Karnataka 560001',
      employmentType: 'Salaried',
      employer: 'Tech Corp India',
      monthlyIncome: 150000,
      existingEMIs: 15000,
      preApprovedLimit: 500000
    },
    {
      customerId: 'C002',
      name: 'Priya Sharma',
      phone: '+91-9876543211',
      email: 'priya.sharma@email.com',
      panCard: 'BCDEF2345G',
      aadhaar: '2345-6789-0123',
      dob: '1990-07-22',
      address: '456 Park Street, Mumbai, Maharashtra 400001',
      employmentType: 'Salaried',
      employer: 'Global Finance Ltd',
      monthlyIncome: 200000,
      existingEMIs: 20000,
      preApprovedLimit: 1000000
    },
    {
      customerId: 'C003',
      name: 'Amit Patel',
      phone: '+91-9876543212',
      email: 'amit.patel@email.com',
      panCard: 'CDEFG3456H',
      aadhaar: '3456-7890-1234',
      dob: '1988-11-30',
      address: '789 Ring Road, Ahmedabad, Gujarat 380001',
      employmentType: 'Self-Employed',
      employer: 'Patel Trading Co.',
      monthlyIncome: 120000,
      existingEMIs: 25000,
      preApprovedLimit: 300000
    },
    {
      customerId: 'C004',
      name: 'Sneha Reddy',
      phone: '+91-9876543213',
      email: 'sneha.reddy@email.com',
      panCard: 'DEFGH4567I',
      aadhaar: '4567-8901-2345',
      dob: '1992-05-18',
      address: '321 Banjara Hills, Hyderabad, Telangana 500034',
      employmentType: 'Salaried',
      employer: 'InfoTech Solutions',
      monthlyIncome: 180000,
      existingEMIs: 30000,
      preApprovedLimit: 800000
    },
    {
      customerId: 'C005',
      name: 'Vikram Singh',
      phone: '+91-9876543214',
      email: 'vikram.singh@email.com',
      panCard: 'EFGHI5678J',
      aadhaar: '5678-9012-3456',
      dob: '1987-09-10',
      address: '654 Civil Lines, Delhi 110054',
      employmentType: 'Salaried',
      employer: 'Manufacturing Inc',
      monthlyIncome: 90000,
      existingEMIs: 35000,
      preApprovedLimit: 200000
    },
    {
      customerId: 'C006',
      name: 'Ananya Iyer',
      phone: '+91-9876543215',
      email: 'ananya.iyer@email.com',
      panCard: 'FGHIJ6789K',
      aadhaar: '6789-0123-4567',
      dob: '1991-12-25',
      address: '987 Anna Salai, Chennai, Tamil Nadu 600002',
      employmentType: 'Salaried',
      employer: 'Consulting Partners',
      monthlyIncome: 250000,
      existingEMIs: 40000,
      preApprovedLimit: 1500000
    },
    {
      customerId: 'C007',
      name: 'Karan Malhotra',
      phone: '+91-9876543216',
      email: 'karan.malhotra@email.com',
      panCard: 'GHIJK7890L',
      aadhaar: '7890-1234-5678',
      dob: '1989-04-08',
      address: '147 Salt Lake, Kolkata, West Bengal 700091',
      employmentType: 'Self-Employed',
      employer: 'Malhotra Enterprises',
      monthlyIncome: 160000,
      existingEMIs: 18000,
      preApprovedLimit: 600000
    },
    {
      customerId: 'C008',
      name: 'Divya Nair',
      phone: '+91-9876543217',
      email: 'divya.nair@email.com',
      panCard: 'HIJKL8901M',
      aadhaar: '8901-2345-6789',
      dob: '1993-08-14',
      address: '258 MG Road, Kochi, Kerala 682016',
      employmentType: 'Salaried',
      employer: 'Healthcare Systems',
      monthlyIncome: 140000,
      existingEMIs: 22000,
      preApprovedLimit: 400000
    },
    {
      customerId: 'C009',
      name: 'Rohit Verma',
      phone: '+91-9876543218',
      email: 'rohit.verma@email.com',
      panCard: 'IJKLM9012N',
      aadhaar: '9012-3456-7890',
      dob: '1986-02-20',
      address: '369 Cantonment, Pune, Maharashtra 411001',
      employmentType: 'Salaried',
      employer: 'Automotive Ltd',
      monthlyIncome: 110000,
      existingEMIs: 28000,
      preApprovedLimit: 350000
    },
    {
      customerId: 'C010',
      name: 'Meera Desai',
      phone: '+91-9876543219',
      email: 'meera.desai@email.com',
      panCard: 'JKLMN0123O',
      aadhaar: '0123-4567-8901',
      dob: '1994-06-05',
      address: '741 Residency Road, Jaipur, Rajasthan 302001',
      employmentType: 'Self-Employed',
      employer: 'Desai Fashion Studio',
      monthlyIncome: 95000,
      existingEMIs: 12000,
      preApprovedLimit: 250000
    },
    {
      customerId: 'C011',
      name: 'Arshad Khan',
      phone: '+91-9999109506',
      email: 'arshad.khan@email.com',
      panCard: 'KLMNO1234P',
      aadhaar: '1234-5678-9013',
      dob: '1990-08-15',
      address: '852 Lake View, Pune, Maharashtra 411001',
      employmentType: 'Salaried',
      employer: 'Digital Solutions Pvt Ltd',
      monthlyIncome: 175000,
      existingEMIs: 18000,
      preApprovedLimit: 750000
    }
  ];
  
  await db.collection('customers').insertMany(customers);
  console.log(`✓ Seeded ${customers.length} customers`);
  
  // Seed credit scores
  const creditScores = [
    { customerId: 'C001', score: 820, lastUpdated: new Date() },
    { customerId: 'C002', score: 850, lastUpdated: new Date() },
    { customerId: 'C003', score: 780, lastUpdated: new Date() },
    { customerId: 'C004', score: 795, lastUpdated: new Date() },
    { customerId: 'C005', score: 680, lastUpdated: new Date() },
    { customerId: 'C006', score: 810, lastUpdated: new Date() },
    { customerId: 'C007', score: 745, lastUpdated: new Date() },
    { customerId: 'C008', score: 770, lastUpdated: new Date() },
    { customerId: 'C009', score: 725, lastUpdated: new Date() },
    { customerId: 'C010', score: 760, lastUpdated: new Date() },
    { customerId: 'C011', score: 800, lastUpdated: new Date() }
  ];
  
  await db.collection('creditScores').insertMany(creditScores);
  console.log(`✓ Seeded ${creditScores.length} credit scores`);
  
  // Seed base offers
  const offers = [
    {
      productId: 'PL001',
      productName: 'Personal Loan - Premium',
      minAmount: 100000,
      maxAmount: 5000000,
      minTenure: 12,
      maxTenure: 84,
      processingFee: 0.01,
      minCreditScore: 750
    },
    {
      productId: 'PL002',
      productName: 'Personal Loan - Standard',
      minAmount: 50000,
      maxAmount: 2000000,
      minTenure: 12,
      maxTenure: 60,
      processingFee: 0.015,
      minCreditScore: 700
    },
    {
      productId: 'PL003',
      productName: 'Personal Loan - Basic',
      minAmount: 25000,
      maxAmount: 1000000,
      minTenure: 12,
      maxTenure: 48,
      processingFee: 0.02,
      minCreditScore: 650
    }
  ];
  
  await db.collection('offers').insertMany(offers);
  console.log(`✓ Seeded ${offers.length} loan offers`);
  
  console.log('✓ Database seeding complete');
}
