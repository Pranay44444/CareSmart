const express = require('express');
const router = express.Router();

const {
  placeOrder,
  getMyOrders,
  getAllOrders,
  updateOrderStatus,
} = require('../controllers/orderController');

const { protect, adminOnly } = require('../middleware/authMiddleware');

// ── User routes ───────────────────────────────────────────────────────────────
// NOTE: /my must be defined before /:id to avoid Express treating "my" as an ID
router.get('/my', protect, getMyOrders);
router.post('/', protect, placeOrder);

// ── Admin routes ──────────────────────────────────────────────────────────────
router.get('/', protect, adminOnly, getAllOrders);
router.put('/:id/status', protect, adminOnly, updateOrderStatus);

module.exports = router;
