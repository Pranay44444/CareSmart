const Cart = require('../models/Cart');
const Product = require('../models/Product');

// ── GET /api/cart ────────────────────────────────────────────────────────────
/**
 * @desc    Get (or create) the authenticated user's cart
 * @route   GET /api/cart
 * @access  Private
 */
const getCart = async (req, res) => {
  try {
    let cart = await Cart.findOne({ user: req.user._id }).populate(
      'items.product',
      'name price image stock category'
    );

    // Auto-create empty cart on first access
    if (!cart) {
      cart = await Cart.create({ user: req.user._id, items: [] });
    }

    res.status(200).json({ cart });
  } catch (error) {
    console.error('getCart error:', error);
    res.status(500).json({ message: 'Server error fetching cart' });
  }
};

// ── POST /api/cart/add ───────────────────────────────────────────────────────
/**
 * @desc    Add a product to cart, or increment quantity if already present
 * @route   POST /api/cart/add
 * @access  Private
 * @body    { productId, qty }
 */
const addToCart = async (req, res) => {
  try {
    const { productId, qty = 1 } = req.body;

    if (!productId) {
      return res.status(400).json({ message: 'productId is required' });
    }

    if (qty < 1) {
      return res.status(400).json({ message: 'Quantity must be at least 1' });
    }

    // Validate product exists and has stock
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    let cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      cart = new Cart({ user: req.user._id, items: [] });
    }

    const existingItem = cart.items.find((item) => item.product.toString() === productId);

    if (existingItem) {
      // Check combined qty doesn't exceed stock
      const newQty = existingItem.qty + qty;
      if (newQty > product.stock) {
        return res.status(400).json({
          message: `Only ${product.stock} units available. You already have ${existingItem.qty} in cart.`,
        });
      }
      existingItem.qty = newQty;
    } else {
      if (qty > product.stock) {
        return res.status(400).json({
          message: `Only ${product.stock} units available`,
        });
      }
      cart.items.push({ product: productId, qty });
    }

    await cart.save();

    // Return populated cart
    await cart.populate('items.product', 'name price image stock category');

    res.status(200).json({ message: 'Cart updated successfully', cart });
  } catch (error) {
    console.error('addToCart error:', error);
    if (error.name === 'CastError') {
      return res.status(400).json({ message: 'Invalid product ID format' });
    }
    res.status(500).json({ message: 'Server error updating cart' });
  }
};

// ── DELETE /api/cart/remove/:productId ───────────────────────────────────────
/**
 * @desc    Remove a specific product from the cart
 * @route   DELETE /api/cart/remove/:productId
 * @access  Private
 */
const removeFromCart = async (req, res) => {
  try {
    const { productId } = req.params;

    const cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    const initialLength = cart.items.length;
    cart.items = cart.items.filter((item) => item.product.toString() !== productId);

    if (cart.items.length === initialLength) {
      return res.status(404).json({ message: 'Product not found in cart' });
    }

    await cart.save();
    await cart.populate('items.product', 'name price image stock category');

    res.status(200).json({ message: 'Item removed from cart', cart });
  } catch (error) {
    console.error('removeFromCart error:', error);
    if (error.name === 'CastError') {
      return res.status(400).json({ message: 'Invalid product ID format' });
    }
    res.status(500).json({ message: 'Server error removing item from cart' });
  }
};

// ── DELETE /api/cart/clear ───────────────────────────────────────────────────
/**
 * @desc    Clear all items from the cart
 * @route   DELETE /api/cart/clear
 * @access  Private
 */
const clearCart = async (req, res) => {
  try {
    const cart = await Cart.findOneAndUpdate(
      { user: req.user._id },
      { $set: { items: [] } },
      { new: true }
    );

    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    res.status(200).json({ message: 'Cart cleared successfully', cart });
  } catch (error) {
    console.error('clearCart error:', error);
    res.status(500).json({ message: 'Server error clearing cart' });
  }
};

module.exports = { getCart, addToCart, removeFromCart, clearCart };
