const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../src/app');
const User = require('../src/models/User');

describe('Auth Endpoints', () => {
    let token;
    let userId;

    beforeAll(async () => {
        // Ensure connected to the test database
        if (mongoose.connection.readyState === 0) {
            await mongoose.connect(process.env.MONGO_URI);
        }
        // Clean up users before testing
        await User.deleteMany({});
    });

    afterAll(async () => {
        await mongoose.connection.close();
    });

    describe('POST /api/auth/register', () => {
        it('should register a new user', async () => {
            const res = await request(app)
                .post('/api/auth/register')
                .send({
                    name: "Test User",
                    email: "test@example.com",
                    password: "password123"
                });
            
            expect(res.statusCode).toEqual(201);
            expect(res.body).toHaveProperty('token');
            expect(res.body.user).toHaveProperty('email', 'test@example.com');
            userId = res.body.user._id;
        });

        it('should not register user with existing email', async () => {
            const res = await request(app)
                .post('/api/auth/register')
                .send({
                    name: "Test User 2",
                    email: "test@example.com",
                    password: "password123"
                });
            
            expect(res.statusCode).toEqual(409);
        });
    });

    describe('POST /api/auth/login', () => {
        it('should login an existing user', async () => {
            const res = await request(app)
                .post('/api/auth/login')
                .send({
                    email: "test@example.com",
                    password: "password123"
                });
            
            expect(res.statusCode).toEqual(200);
            expect(res.body).toHaveProperty('token');
            token = res.body.token;
        });

        it('should not login with wrong password', async () => {
            const res = await request(app)
                .post('/api/auth/login')
                .send({
                    email: "test@example.com",
                    password: "wrongpassword"
                });
            
            expect(res.statusCode).toEqual(401);
        });
    });

    describe('GET /api/auth/profile', () => {
        it('should return user profile with valid token', async () => {
            const res = await request(app)
                .get('/api/auth/profile')
                .set('Authorization', `Bearer ${token}`);
            
            expect(res.statusCode).toEqual(200);
            expect(res.body.user).toHaveProperty('email', 'test@example.com');
        });

        it('should return 401 without token', async () => {
            const res = await request(app).get('/api/auth/profile');
            expect(res.statusCode).toEqual(401);
        });
    });
});
