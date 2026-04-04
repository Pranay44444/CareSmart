const express = require('express');
const router = express.Router();

const {
  register,
  login,
  getProfile,
  updateDeviceProfile,
} = require('../controllers/authController');

const { protect } = require('../middleware/authMiddleware');

// ── Public routes ────────────────────────────────────────────────────────────
router.post('/register', register);
router.post('/login', login);

// ── Protected routes (require valid JWT) ─────────────────────────────────────
router.get('/profile', protect, getProfile);
router.put('/device-profile', protect, updateDeviceProfile);

module.exports = router;
