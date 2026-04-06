const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../src/app');

jest.setTimeout(30000);

beforeAll(async () => {
  // app.js might have connected already, but we ensure connection here
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
  // Drop database to clean up tests
  if (mongoose.connection.readyState !== 0 && mongoose.connection.db) {
    try {
      await mongoose.connection.db.dropDatabase();
    } catch (e) {}
    await mongoose.connection.close();
  }
});

let token = '';

describe('Auth Endpoints', () => {
  const testUser = {
    name: 'Auth Test User',
    email: `test_auth_${Date.now()}@example.com`,
    password: 'password123',
    role: 'user',
  };

  test('POST /api/auth/register → 201, returns token', async () => {
    const res = await request(app).post('/api/auth/register').send(testUser);
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('token');
    token = res.body.token; // Save for later tests
  });

  test('POST /api/auth/register duplicate → 400', async () => {
    const res = await request(app).post('/api/auth/register').send(testUser);
    expect([400, 409]).toContain(res.statusCode);
  });

  test('POST /api/auth/login correct → 200, returns token', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: testUser.email, password: testUser.password });
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('token');
  });

  test('POST /api/auth/login wrong password → 401', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: testUser.email, password: 'wrongpassword' });
    expect(res.statusCode).toBe(401);
  });

  test('GET /api/auth/profile with token → 200, returns user', async () => {
    const res = await request(app).get('/api/auth/profile').set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    if (res.body.user) {
      expect(res.body.user).toHaveProperty('email', testUser.email);
    } else {
      expect(res.body).toHaveProperty('email', testUser.email);
    }
  });

  test('GET /api/auth/profile without token → 401', async () => {
    const res = await request(app).get('/api/auth/profile');
    expect(res.statusCode).toBe(401);
  });
});
