const Review = require('../models/Review');
const Product = require('../models/Product');

// ── GET /api/reviews/product/:productId ──────────────────────────────────────
/**
 * @desc    Get all reviews for a specific product
 * @route   GET /api/reviews/product/:productId
 * @access  Public
 */
const getProductReviews = async (req, res) => {
  try {
    const { productId } = req.params;

    // Validate product exists
    const product = await Product.findById(productId).select('name ratings numReviews');
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const reviews = await Review.find({ product: productId })
      .populate('user', 'name')
      .sort({ createdAt: -1 });

    res.status(200).json({
      product: {
        _id: product._id,
        name: product.name,
        ratings: product.ratings,
        numReviews: product.numReviews,
      },
      reviews,
    });
  } catch (error) {
    console.error('getProductReviews error:', error);
    if (error.name === 'CastError') {
      return res.status(400).json({ message: 'Invalid product ID format' });
    }
    res.status(500).json({ message: 'Server error fetching reviews' });
  }
};

// ── POST /api/reviews ─────────────────────────────────────────────────────────
/**
 * @desc    Add a review for a product (one per user per product)
 *          Product ratings and numReviews are auto-updated via Review model hooks
 * @route   POST /api/reviews
 * @access  Private
 * @body    { productId, rating, comment, aiSummary }
 */
const addReview = async (req, res) => {
  try {
    const { productId, rating, comment, aiSummary } = req.body;

    if (!productId || rating == null) {
      return res.status(400).json({ message: 'productId and rating are required' });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({ message: 'Rating must be between 1 and 5' });
    }

    // Validate product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Check for duplicate review (also enforced by compound index on schema)
    const existing = await Review.findOne({ user: req.user._id, product: productId });
    if (existing) {
      return res.status(409).json({
        message: 'You have already reviewed this product',
      });
    }

    const review = await Review.create({
      user: req.user._id,
      product: productId,
      rating,
      comment: comment?.trim(),
      aiSummary: aiSummary?.trim(),
    });

    // Populate user name for the response
    await review.populate('user', 'name');

    // Note: Product.ratings & numReviews are auto-updated by the post-save
    // hook defined in Review.js (calcAverageRatings static method)

    res.status(201).json({ message: 'Review added successfully', review });
  } catch (error) {
    console.error('addReview error:', error);

    // Duplicate key = compound index violation (race condition safety net)
    if (error.code === 11000) {
      return res.status(409).json({ message: 'You have already reviewed this product' });
    }
    if (error.name === 'CastError') {
      return res.status(400).json({ message: 'Invalid product ID format' });
    }
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({ message: messages.join(', ') });
    }
    res.status(500).json({ message: 'Server error adding review' });
  }
};

module.exports = { getProductReviews, addReview };
