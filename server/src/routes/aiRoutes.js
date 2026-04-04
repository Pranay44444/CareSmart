const express = require('express');
const router = express.Router();

const { getRecommendations, summarizeReviews } = require('../controllers/aiController');
const { protect } = require('../middleware/authMiddleware');

// ── Protected: personalised recommendations require a logged-in user ──────────
router.post('/recommend', protect, getRecommendations);

// ── Public: anyone can request a review summary ───────────────────────────────
router.post('/summarize-reviews', summarizeReviews);

module.exports = router;
