const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../src/app');
const Product = require('../src/models/Product');
const User = require('../src/models/User');

describe('Product Endpoints', () => {
    let adminToken;

    beforeAll(async () => {
        if (mongoose.connection.readyState === 0) {
            await mongoose.connect(process.env.MONGO_URI);
        }
        await Product.deleteMany({});
        await User.deleteMany({});

        // Create admin user for testing
        const res = await request(app)
            .post('/api/auth/register')
            .send({
                name: "Admin User",
                email: "admin@example.com",
                password: "adminpassword",
                role: "admin"
            });
        
        adminToken = res.body.token;
    });

    afterAll(async () => {
        await mongoose.connection.close();
    });

    describe('POST /api/products', () => {
        it('should allow admin to create a product', async () => {
            const res = await request(app)
                .post('/api/products')
                .set('Authorization', `Bearer ${adminToken}`)
                .send({
                    name: "Test Case",
                    description: "Slim case for test phone",
                    price: 9.99,
                    category: "smartphone",
                    stock: 10
                });
            
            expect(res.statusCode).toEqual(201);
            expect(res.body.product).toHaveProperty('name', 'Test Case');
        });

        it('should return 401 without token', async () => {
            const res = await request(app)
                .post('/api/products')
                .send({
                    name: "Should Fail",
                    description: "Fail",
                    price: 1,
                    category: "smartphone",
                    stock: 1
                });
            expect(res.statusCode).toEqual(401);
        });
    });

    describe('GET /api/products', () => {
        it('should return products with pagination', async () => {
            const res = await request(app).get('/api/products?limit=1');
            expect(res.statusCode).toEqual(200);
            expect(res.body.products.length).toBeGreaterThan(0);
            expect(res.body).toHaveProperty('totalProducts');
        });
    });

    describe('GET /api/products/:id', () => {
        it('should return a single product', async () => {
             // Create one first to get ID
             const prodRes = await request(app)
                .post('/api/products')
                .set('Authorization', `Bearer ${adminToken}`)
                .send({
                    name: "Get Me",
                    description: "Find this",
                    price: 15,
                    category: "laptop",
                    stock: 5
                });
            
            const productId = prodRes.body.product._id;
            const res = await request(app).get(`/api/products/${productId}`);
            expect(res.statusCode).toEqual(200);
            expect(res.body.product).toHaveProperty('_id', productId);
        });

        it('should return 404 for non-existent product', async () => {
            const fakeId = new mongoose.Types.ObjectId();
            const res = await request(app).get(`/api/products/${fakeId}`);
            expect(res.statusCode).toEqual(404);
        });
    });
});
