require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../src/models/User');
const Product = require('../src/models/Product');
const connectDB = require('../src/config/db');

// Sample products for CareSmart AI testing
const products = [
  {
    name: 'Anker PowerCore 20000mAh',
    description: 'High-Capacity Power Bank, compact and safe for fast charging.',
    price: 49.99,
    category: 'smartphone',
    subCategory: 'power bank',
    compatibleBrands: ['apple', 'samsung', 'google'],
    stock: 50,
    image: 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=500&q=80',
  },
  {
    name: 'Spigen Tough Armor Case',
    description: 'Slim & Ventilated Protective Case built for extreme drop protection and heat dissipation.',
    price: 19.99,
    category: 'smartphone',
    subCategory: 'case',
    compatibleBrands: ['apple', 'samsung'],
    stock: 120,
    image: 'https://images.unsplash.com/photo-1541560052-77ec1bbc09f7?w=500&q=80',
  },
  {
    name: 'Belkin BoostCharge Pro 30W',
    description: 'Certified USB-C Fast Charger with GaN technology for cooler, faster charging.',
    price: 29.99,
    category: 'smartphone',
    subCategory: 'charger',
    compatibleBrands: ['apple', 'samsung', 'google'],
    stock: 200,
    image: 'https://images.unsplash.com/photo-1583863788434-e58f3fc434c0?w=500&q=80',
  },
  {
    name: 'amFilm Tempered Glass Screen Protector',
    description: 'Ultra-clear, scratch-resistant tempered glass for max protection.',
    price: 9.99,
    category: 'smartphone',
    subCategory: 'screen protector',
    compatibleBrands: ['apple'],
    stock: 300,
    image: 'https://images.unsplash.com/photo-1601524909162-ae8725290836?w=500&q=80',
  },
  {
    name: 'Logitech MX Master 3S',
    description: 'Advanced Wireless Mouse with ergonomic design and ultra-fast scrolling.',
    price: 99.99,
    category: 'laptop',
    subCategory: 'mouse',
    compatibleBrands: ['apple', 'dell', 'hp', 'lenovo'],
    stock: 45,
    image: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=500&q=80',
  },
  {
    name: 'Laptop Cooling Pad with RGB',
    description: '5 high-speed quiet fans to prevent laptop overheating during gaming or heavy workloads.',
    price: 34.99,
    category: 'laptop',
    subCategory: 'cooling',
    compatibleBrands: ['dell', 'hp', 'lenovo', 'asus'],
    stock: 60,
    image: 'https://images.unsplash.com/photo-1616423640778-28d1b53229bd?w=500&q=80',
  }
];

const seedData = async () => {
  try {
    await connectDB();
    console.log('Connected to target DB...');

    // Delete existing standard mock data to prevent duplicates upon multiple runs
    await Product.deleteMany({});
    console.log('🧹 Cleared existing Products.');

    // Look for existing admin, if not create one
    const adminExists = await User.findOne({ email: 'admin@caresmart.com' });
    if (!adminExists) {
      await User.create({
        name: 'Super Admin',
        email: 'admin@caresmart.com',
        password: 'admin123',
        role: 'admin',
      });
      console.log('✅ Created default Admin account (admin@caresmart.com / admin123).');
    } else {
      console.log('✅ Admin account already exists.');
    }

    // Insert mock products
    await Product.insertMany(products);
    console.log(`✅ successfully seeded ${products.length} mock products!`);

    process.exit();
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedData();
