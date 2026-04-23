# CareSmart
### AI-Powered Device Care & Accessories Ecommerce Platform

---

## Overview

CareSmart is a full-stack ecommerce platform for device care accessories with an integrated AI advisor powered by Google Gemini. Users can browse products, manage a cart, place orders, and get AI-based product recommendations.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React, React Router, Axios, Vite |
| Backend | Node.js, Express |
| Database | MongoDB (Atlas) |
| AI | Google Gemini API |
| Auth | JWT + bcrypt |
| Containerization | Docker, Docker Compose |
| Registry | Amazon ECR |
| Orchestration | Amazon ECS (Fargate) |
| CI/CD | GitHub Actions |

---

## Project Structure

```
CareSmart/
├── client/              # React frontend
│   ├── src/
│   │   ├── pages/       # Home, Products, Cart, Orders, Profile, AI Advisor
│   │   └── components/
│   ├── Dockerfile
│   └── nginx.conf
├── server/              # Express backend
│   ├── src/
│   │   ├── routes/      # auth, product, cart, order, review, ai
│   │   ├── controllers/
│   │   ├── models/
│   │   └── middleware/
│   └── Dockerfile
├── ecs/                 # ECS task definitions
├── .github/workflows/   # CI/CD pipeline
└── docker-compose.yml
```

---

## Local Setup

### Prerequisites
- Node.js 18+
- MongoDB Atlas URI (or local MongoDB)
- Google Gemini API key

### Without Docker

```bash
# Backend
cd server
cp .env.example .env   # fill in MONGO_URI, JWT_SECRET, GEMINI_API_KEY
npm install
npm start

# Frontend (separate terminal)
cd client
npm install
npm run dev
```

- Frontend: `http://localhost:5173`
- Backend: `http://localhost:5001`

### With Docker

```bash
docker compose up
```

- App: `http://localhost`
- Backend: `http://localhost:5001`

---

## Environment Variables

**server/.env**
```
PORT=5001
MONGO_URI=<mongodb-connection-string>
JWT_SECRET=<secret>
GEMINI_API_KEY=<google-gemini-key>
NODE_ENV=development
```

**client** (build-time arg)
```
VITE_API_URL=http://localhost:5001
```

---

## API Endpoints

| Method | Route | Description |
|---|---|---|
| POST | `/api/auth/register` | Register user |
| POST | `/api/auth/login` | Login |
| GET | `/api/products` | List products |
| GET | `/api/products/:id` | Product detail |
| POST | `/api/cart` | Add to cart |
| GET | `/api/orders` | User orders |
| POST | `/api/ai/recommend` | AI product advice |
| GET | `/api/health` | Health check |

---

## CI/CD Pipeline

Push to `main` triggers the GitHub Actions workflow:

```
Run Tests → Build & Push to ECR → Deploy Backend to ECS → Deploy Frontend to ECS
```

GitHub Secrets required: `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `AWS_SESSION_TOKEN`, `AWS_ACCOUNT_ID`, `MONGO_URI`, `JWT_SECRET`, `GEMINI_API_KEY`, `VITE_API_URL`

---

## AWS Infrastructure

| Resource | Name |
|---|---|
| ECR Repos | `caresmart-backend`, `caresmart-frontend` |
| ECS Cluster | `caresmart-cluster` (Fargate) |
| ECS Services | `caresmart-backend-service`, `caresmart-frontend-service` |
| Logs | CloudWatch `/ecs/caresmart-backend`, `/ecs/caresmart-frontend` |

---

## Running Tests

```bash
cd server && npm test
```
