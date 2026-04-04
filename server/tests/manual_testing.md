# Manual Testing Guide: CareSmart API

Use the following `curl` commands to test the CareSmart backend. Replace `<TOKEN>` with the JWT returned from the login or register response.

## 1. Auth Operations

### Register (User)
```bash
curl -X POST http://localhost:5001/api/auth/register \
-H "Content-Type: application/json" \
-d '{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "password": "password123",
  "role": "user"
}'
```

### Register (Admin)
```bash
curl -X POST http://localhost:5001/api/auth/register \
-H "Content-Type: application/json" \
-d '{
  "name": "Admin User",
  "email": "admin@example.com",
  "password": "adminpassword",
  "role": "admin"
}'
```

### Login
```bash
curl -X POST http://localhost:5001/api/auth/login \
-H "Content-Type: application/json" \
-d '{
  "email": "jane@example.com",
  "password": "password123"
}'
```

### Get Profile (Protected)
```bash
curl -X GET http://localhost:5001/api/auth/profile \
-H "Authorization: Bearer <TOKEN>"
```

### Update Device Profile (Protected)
```bash
curl -X PUT http://localhost:5001/api/auth/device-profile \
-H "Authorization: Bearer <TOKEN>" \
-H "Content-Type: application/json" \
-d '{
  "deviceType": "Smartphone",
  "brand": "Samsung",
  "model": "Galaxy S23",
  "usagePattern": "Heavy gaming"
}'
```

---

## 2. Product Operations

### Get All Products (Public)
```bash
curl -X GET "http://localhost:5001/api/products?page=1&limit=5"
```

### Get Single Product (Public)
```bash
curl -X GET http://localhost:5001/api/products/<PRODUCT_ID>
```

### Create Product (Admin Only)
```bash
curl -X POST http://localhost:5001/api/products \
-H "Authorization: Bearer <ADMIN_TOKEN>" \
-H "Content-Type: application/json" \
-d '{
  "name": "Protective Case",
  "description": "Durable silicon case",
  "price": 19.99,
  "category": "smartphone",
  "stock": 50,
  "compatibleBrands": ["Samsung", "iPhone"]
}'
```

---

## 3. Cart & Orders

### Add to Cart (Protected)
```bash
curl -X POST http://localhost:5001/api/cart/add \
-H "Authorization: Bearer <TOKEN>" \
-H "Content-Type: application/json" \
-d '{
  "productId": "<PRODUCT_ID>",
  "qty": 2
}'
```

### Get Cart (Protected)
```bash
curl -X GET http://localhost:5001/api/cart \
-H "Authorization: Bearer <TOKEN>"
```

### Place Order (Protected)
```bash
curl -X POST http://localhost:5001/api/orders \
-H "Authorization: Bearer <TOKEN>" \
-H "Content-Type: application/json" \
-d '{
  "shippingAddress": {
    "address": "123 Main St",
    "city": "Sample City",
    "postalCode": "12345"
  }
}'
```

---

## 4. AI Routes (Requires GEMINI_API_KEY)

### Get Recommendations (Protected)
```bash
curl -X POST http://localhost:5001/api/ai/recommend \
-H "Authorization: Bearer <TOKEN>" \
-H "Content-Type: application/json" \
-d '{
  "deviceType": "Smartphone",
  "brand": "Apple",
  "model": "iPhone 15",
  "usagePattern": "Travel photography",
  "issues": "Battery drains quickly"
}'
```

### Summarize Reviews (Public)
```bash
curl -X POST http://localhost:5001/api/ai/summarize-reviews \
-H "Content-Type: application/json" \
-d '{
  "reviews": [
    {"rating": 5, "comment": "Excellent case, very durable!"},
    {"rating": 4, "comment": "Fits well, but a bit bulky."},
    {"rating": 2, "comment": "Color faded after a week."}
  ]
}'
```
