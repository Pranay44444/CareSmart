require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('../src/models/Product');
const User = require('../src/models/User');

const sampleProducts = [
  {
    name: "Rugged Armor Case",
    description: "Shockproof case for iPhone 15 with carbon fiber finish.",
    price: 24.99,
    category: "smartphone",
    subCategory: "cases",
    compatibleBrands: ["Apple"],
    stock: 100,
    image: "https://example.com/images/rugged-case.jpg"
  },
  {
    name: "4-Port USB-C Hub",
    description: "Aluminum 4-in-1 USB-C hub with HDMI and PD charging.",
    price: 39.99,
    category: "laptop",
    subCategory: "hubs",
    compatibleBrands: ["Apple", "Dell", "HP"],
    stock: 50,
    image: "https://example.com/images/usb-hub.jpg"
  },
  {
    name: "Fast Wireless Charger",
    description: "15W Qi-certified wireless charging pad with LED indicator.",
    price: 29.99,
    category: "smartphone",
    subCategory: "chargers",
    compatibleBrands: ["Apple", "Samsung", "Google"],
    stock: 75,
    image: "https://example.com/images/wireless-charger.jpg"
  },
  {
    name: "Laptop Cooling Pad",
    description: "Ergonomic cooling stand with 5 quiet fans and RGB lighting.",
    price: 45.00,
    category: "laptop",
    subCategory: "cooling",
    compatibleBrands: ["Any"],
    stock: 30,
    image: "https://example.com/images/cooling-pad.jpg"
  }
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB for seeding...');

    // Clear existing products
    await Product.deleteMany({});
    console.log('Cleared existing products.');

    // Insert new products
    await Product.insertMany(sampleProducts);
    console.log('Sample products seeded successfully!');

    // Check if an admin exists, if not create one
    const adminExists = await User.findOne({ role: 'admin' });
    if (!adminExists) {
        await User.create({
            name: "Default Admin",
            email: "admin@caresmart.com",
            password: "adminpassword123",
            role: "admin"
        });
        console.log('Created default admin: admin@caresmart.com / adminpassword123');
    }

    mongoose.connection.close();
    console.log('Seeding complete. Database connection closed.');
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDB();
