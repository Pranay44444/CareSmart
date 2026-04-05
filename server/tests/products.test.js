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
    } catch(e) {}
    await mongoose.connection.close();
  }
});

let adminToken = '';

describe('Products Endpoints', () => {
  const adminUser = {
    name: 'Admin Products Test',
    email: `admin_prod_${Date.now()}@caresmart.com`,
    password: 'admin123',
    role: 'admin'
  };

  test('Register admin to get token', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send(adminUser);
    
    // Fallback if email taken in test db (not dropped yet)
    if (res.statusCode === 400) {
      const loginRes = await request(app).post('/api/auth/login').send({ email: adminUser.email, password: adminUser.password });
      adminToken = loginRes.body.token;
    } else {
      adminToken = res.body.token;
      
      // Upgrade role to admin manually for tests if needed, or if endpoint allows role
      // For this test, we assume the register route sets user if not admin.
      // But standard routes may ignore 'role'. Let's find admin directly:
      const User = require('../src/models/User');
      await User.findOneAndUpdate({ email: adminUser.email }, { role: 'admin' });
    }
  });

  const testProduct = {
    name: 'Test Charger',
    description: 'A test fast charger',
    price: 29.99,
    category: 'smartphone',
    stock: 10
  };

  test('POST /api/products without auth → 401', async () => {
    const res = await request(app)
      .post('/api/products')
      .send(testProduct);
    expect(res.statusCode).toBe(401);
  });

  test('POST /api/products with admin token → 201', async () => {
    const res = await request(app)
      .post('/api/products')
      .set('Authorization', `Bearer ${adminToken}`)
      .send(testProduct);
    expect(res.statusCode).toBe(201);
    if (res.body.product) {
       expect(res.body.product).toHaveProperty('_id');
    } else {
       expect(res.body).toHaveProperty('_id');
    }
  });

  test('GET /api/products → 200, has docs array', async () => {
    const res = await request(app).get('/api/products');
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('products');
    expect(Array.isArray(res.body.products)).toBe(true);
  });

  test('GET /api/products?category=smartphone → 200', async () => {
    const res = await request(app).get('/api/products?category=smartphone');
    expect(res.statusCode).toBe(200);
    if(res.body.products.length > 0) {
      expect(res.body.products[0]).toHaveProperty('category', 'smartphone');
    }
  });

  test('GET /api/products/invalidid → 500 or 400', async () => {
    const res = await request(app).get('/api/products/invalid123');
    // Usually invalid ObjectID throws a cast error (400 or 500 depending on handler)
    expect([400, 404, 500]).toContain(res.statusCode);
  });
});
