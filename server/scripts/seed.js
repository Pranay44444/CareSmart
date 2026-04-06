require('dotenv').config();
const Product = require('../src/models/Product');
const connectDB = require('../src/config/db');

// Prices stored in USD (frontend displays price × 83 as INR)
const products = [
  // ── Smartphone accessories ──────────────────────────────────────────────────
  {
    name: 'Premium Tempered Glass',
    category: 'smartphone',
    subCategory: 'screen-protector',
    price: +(299 / 83).toFixed(2),
    compatibleBrands: ['Samsung', 'Apple', 'OnePlus'],
    stock: 100,
    description: '9H hardness tempered glass protection',
    ratings: 0,
    numReviews: 0,
  },
  {
    name: 'Silicone Protective Case',
    category: 'smartphone',
    subCategory: 'case',
    price: +(199 / 83).toFixed(2),
    compatibleBrands: ['Samsung', 'Apple'],
    stock: 150,
    description: 'Shock-absorbing silicone case',
    ratings: 0,
    numReviews: 0,
  },
  {
    name: '65W Fast Charger',
    category: 'smartphone',
    subCategory: 'charger',
    price: +(899 / 83).toFixed(2),
    compatibleBrands: ['Samsung', 'OnePlus', 'Xiaomi'],
    stock: 75,
    description: 'GaN fast charger, 65W output',
    ratings: 0,
    numReviews: 0,
  },
  {
    name: '20000mAh Power Bank',
    category: 'smartphone',
    subCategory: 'power-bank',
    price: +(1299 / 83).toFixed(2),
    compatibleBrands: ['Apple', 'Samsung', 'OnePlus'],
    stock: 50,
    description: '20000mAh with dual USB-C output',
    ratings: 0,
    numReviews: 0,
  },
  {
    name: '15W Wireless Charger',
    category: 'smartphone',
    subCategory: 'wireless-charger',
    price: +(699 / 83).toFixed(2),
    compatibleBrands: ['Apple', 'Samsung'],
    stock: 60,
    description: 'Qi-compatible wireless charging pad',
    ratings: 0,
    numReviews: 0,
  },

  // ── Laptop accessories ──────────────────────────────────────────────────────
  {
    name: 'Adjustable Laptop Stand',
    category: 'laptop',
    subCategory: 'stand',
    price: +(999 / 83).toFixed(2),
    compatibleBrands: ['Apple', 'Dell', 'HP', 'Lenovo'],
    stock: 40,
    description: 'Ergonomic aluminum laptop stand',
    ratings: 0,
    numReviews: 0,
  },
  {
    name: 'USB-C Cooling Pad',
    category: 'laptop',
    subCategory: 'cooling-pad',
    price: +(799 / 83).toFixed(2),
    compatibleBrands: ['Dell', 'HP', 'Lenovo', 'Asus'],
    stock: 35,
    description: 'Dual fan cooling pad with RGB',
    ratings: 0,
    numReviews: 0,
  },
  {
    name: '7-in-1 USB-C Hub',
    category: 'laptop',
    subCategory: 'hub',
    price: +(1499 / 83).toFixed(2),
    compatibleBrands: ['Apple', 'Dell', 'HP'],
    stock: 45,
    description: 'HDMI, USB-A, SD card, USB-C PD',
    ratings: 0,
    numReviews: 0,
  },
  {
    name: '512GB External SSD',
    category: 'laptop',
    subCategory: 'storage',
    price: +(3999 / 83).toFixed(2),
    compatibleBrands: ['Apple', 'Dell', 'HP', 'Lenovo'],
    stock: 25,
    description: 'USB 3.2 Gen2, 1050MB/s read speed',
    ratings: 0,
    numReviews: 0,
  },
  {
    name: 'Neoprene Laptop Sleeve',
    category: 'laptop',
    subCategory: 'sleeve',
    price: +(499 / 83).toFixed(2),
    compatibleBrands: ['Apple', 'Dell', 'HP', 'Lenovo'],
    stock: 80,
    description: 'Water-resistant neoprene sleeve',
    ratings: 0,
    numReviews: 0,
  },
];

const seed = async () => {
  try {
    await connectDB();

    const count = await Product.countDocuments();
    if (count > 0) {
      console.log(`Already seeded (${count} products found), skipping.`);
      process.exit(0);
    }

    await Product.insertMany(products);
    console.log('✅ Database seeded successfully with 10 products');
    process.exit(0);
  } catch (err) {
    console.error('Seed failed:', err);
    process.exit(1);
  }
};

seed();
