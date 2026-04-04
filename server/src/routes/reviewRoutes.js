const express = require('express');
const router = express.Router();

const {
  getProductReviews,
  addReview,
} = require('../controllers/reviewController');

const { protect } = require('../middleware/authMiddleware');

// ── Public ────────────────────────────────────────────────────────────────────
router.get('/product/:productId', getProductReviews);

// ── Protected ─────────────────────────────────────────────────────────────────
router.post('/', protect, addReview);

module.exports = router;
