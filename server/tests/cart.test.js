const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../src/app');
const Product = require('../src/models/Product');
const User = require('../src/models/User');

describe('Cart Endpoints', () => {
    let userToken;
    let productId;

    beforeAll(async () => {
        if (mongoose.connection.readyState === 0) {
            await mongoose.connect(process.env.MONGO_URI);
        }
        await Product.deleteMany({});
        await User.deleteMany({});

        // Create user for testing
        const userRes = await request(app)
            .post('/api/auth/register')
            .send({
                name: "Cart User",
                email: "cart@example.com",
                password: "cartpassword"
            });
        
        userToken = userRes.body.token;

        // Create product for testing
        const prod = await Product.create({
            name: "Cart Item",
            description: "Test product for cart",
            price: 10,
            category: "smartphone",
            stock: 5
        });
        productId = prod._id.toString();
    });

    afterAll(async () => {
        await mongoose.connection.close();
    });

    describe('POST /api/cart/add', () => {
        it('should add item to cart', async () => {
            const res = await request(app)
                .post('/api/cart/add')
                .set('Authorization', `Bearer ${userToken}`)
                .send({
                    productId: productId,
                    qty: 1
                });
            
            expect(res.statusCode).toEqual(200);
            expect(res.body.cart.items.length).toBe(1);
            expect(res.body.cart.items[0].product._id).toBe(productId);
        });

        it('should return 401 without token', async () => {
            const res = await request(app)
                .post('/api/cart/add')
                .send({ productId: productId, qty: 1 });
            expect(res.statusCode).toEqual(401);
        });
    });

    describe('GET /api/cart', () => {
        it('should return the user cart', async () => {
            const res = await request(app)
                .get('/api/cart')
                .set('Authorization', `Bearer ${userToken}`);
            
            expect(res.statusCode).toEqual(200);
            expect(res.body.cart).toHaveProperty('user');
        });
    });

    describe('DELETE /api/cart/remove/:productId', () => {
        it('should remove item from cart', async () => {
            const res = await request(app)
                .delete(`/api/cart/remove/${productId}`)
                .set('Authorization', `Bearer ${userToken}`);
            
            expect(res.statusCode).toEqual(200);
            expect(res.body.cart.items.length).toBe(0);
        });
    });
});
