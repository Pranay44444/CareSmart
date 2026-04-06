const express = require('express');
const router = express.Router();

const { getCart, addToCart, removeFromCart, clearCart } = require('../controllers/cartController');

const { protect } = require('../middleware/authMiddleware');

// ── All cart routes require authentication ────────────────────────────────────
router.get('/', protect, getCart);
router.post('/add', protect, addToCart);
router.delete('/remove/:productId', protect, removeFromCart);
router.delete('/clear', protect, clearCart);

module.exports = router;
