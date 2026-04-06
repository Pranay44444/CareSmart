const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../src/app');

jest.setTimeout(30000);

beforeAll(async () => {
  if (mongoose.connection.readyState === 0) {
    let mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1/caresmart';
    if (mongoUri.includes('mongodb+srv')) {
      const url = new URL(mongoUri);
      url.pathname = '/caresmart_test';
      mongoUri = url.toString();
    } else if (!mongoUri.includes('_test')) {
      mongoUri = mongoUri.replace('?', '_test?');
    }
    await mongoose.connect(mongoUri);
  }
});

afterAll(async () => {
  if (mongoose.connection.readyState !== 0 && mongoose.connection.db) {
    try {
      await mongoose.connection.db.dropDatabase();
    } catch (e) {}
    await mongoose.connection.close();
  }
});

let userToken = '';
let productId = '';

describe('Cart Endpoints', () => {
  test('Register user and get token', async () => {
    const testUser = {
      name: 'Cart Tester',
      email: `cart_${Date.now()}@example.com`,
      password: 'password123',
    };
    const res = await request(app).post('/api/auth/register').send(testUser);
    expect(res.statusCode).toBe(201);
    userToken = res.body.token;
  });

  test('Create a test product to add to cart', async () => {
    // Elevate user to admin directly or create product directly
    const Product = mongoose.model('Product');
    const p = await Product.create({
      name: 'Cart Item',
      description: 'desc',
      price: 9.99,
      category: 'smartphone',
      stock: 5,
    });
    productId = p._id.toString();
  });

  test('GET /api/cart → 200, has items array', async () => {
    const res = await request(app).get('/api/cart').set('Authorization', `Bearer ${userToken}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('cart');
    expect(Array.isArray(res.body.cart.items)).toBe(true);
  });

  test('POST /api/cart/add → 200', async () => {
    const res = await request(app)
      .post('/api/cart/add')
      .set('Authorization', `Bearer ${userToken}`)
      .send({ productId, qty: 1 });
    expect(res.statusCode).toBe(200);
    expect(res.body.cart.items.length).toBeGreaterThan(0);
  });

  test('DELETE /api/cart/clear → 200', async () => {
    const res = await request(app)
      .delete('/api/cart/clear')
      .set('Authorization', `Bearer ${userToken}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.cart.items.length).toBe(0);
  });
});
