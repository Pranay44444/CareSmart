const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Product = require('../models/Product');

// ── POST /api/orders ─────────────────────────────────────────────────────────
/**
 * @desc    Place a new order from the user's cart
 * @route   POST /api/orders
 * @access  Private
 * @body    { shippingAddress: { address, city, postalCode } }
 */
const placeOrder = async (req, res) => {
  try {
    const { shippingAddress } = req.body;

    if (!shippingAddress?.address || !shippingAddress?.city || !shippingAddress?.postalCode) {
      return res.status(400).json({
        message: 'shippingAddress with address, city, and postalCode is required',
      });
    }

    // Fetch user's cart with populated products
    const cart = await Cart.findOne({ user: req.user._id }).populate(
      'items.product',
      'name price image stock'
    );

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: 'Cart is empty, cannot place order' });
    }

    // Build order items & calculate total (snapshot prices at time of order)
    let totalPrice = 0;
    const orderItems = [];

    for (const item of cart.items) {
      const product = item.product;

      if (!product) {
        return res.status(400).json({ message: 'One or more cart products no longer exist' });
      }

      if (item.qty > product.stock) {
        return res.status(400).json({
          message: `Insufficient stock for "${product.name}". Available: ${product.stock}`,
        });
      }

      orderItems.push({
        product: product._id,
        name: product.name,
        qty: item.qty,
        price: product.price,
        image: product.image,
      });

      totalPrice += product.price * item.qty;
    }

    // Deduct stock for each product
    await Promise.all(
      orderItems.map((item) =>
        Product.findByIdAndUpdate(item.product, {
          $inc: { stock: -item.qty },
        })
      )
    );

    // Create order
    const order = await Order.create({
      user: req.user._id,
      items: orderItems,
      totalPrice: parseFloat(totalPrice.toFixed(2)),
      shippingAddress,
    });

    // Clear cart after successful order
    await Cart.findOneAndUpdate({ user: req.user._id }, { $set: { items: [] } });

    res.status(201).json({ message: 'Order placed successfully', order });
  } catch (error) {
    console.error('placeOrder error:', error);
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({ message: messages.join(', ') });
    }
    res.status(500).json({ message: 'Server error placing order' });
  }
};

// ── GET /api/orders/my ───────────────────────────────────────────────────────
/**
 * @desc    Get all orders for the authenticated user
 * @route   GET /api/orders/my
 * @access  Private
 */
const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .populate('items.product', 'name image category');

    res.status(200).json({ orders });
  } catch (error) {
    console.error('getMyOrders error:', error);
    res.status(500).json({ message: 'Server error fetching your orders' });
  }
};

// ── GET /api/orders (admin) ──────────────────────────────────────────────────
/**
 * @desc    Get all orders (admin)
 * @route   GET /api/orders
 * @access  Private / Admin
 */
const getAllOrders = async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const filter = {};
    if (status) filter.status = status;

    const skip = (parseInt(page, 10) - 1) * parseInt(limit, 10);

    const [orders, total] = await Promise.all([
      Order.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit, 10))
        .populate('user', 'name email')
        .populate('items.product', 'name image'),
      Order.countDocuments(filter),
    ]);

    res.status(200).json({
      orders,
      totalOrders: total,
      totalPages: Math.ceil(total / parseInt(limit, 10)),
      currentPage: parseInt(page, 10),
    });
  } catch (error) {
    console.error('getAllOrders error:', error);
    res.status(500).json({ message: 'Server error fetching all orders' });
  }
};

// ── PUT /api/orders/:id/status (admin) ───────────────────────────────────────
/**
 * @desc    Update order status (admin)
 * @route   PUT /api/orders/:id/status
 * @access  Private / Admin
 * @body    { status }
 */
const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ['pending', 'processing', 'shipped', 'delivered'];

    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({
        message: `status must be one of: ${validStatuses.join(', ')}`,
      });
    }

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { $set: { status } },
      { new: true, runValidators: true }
    ).populate('user', 'name email');

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.status(200).json({ message: 'Order status updated', order });
  } catch (error) {
    console.error('updateOrderStatus error:', error);
    if (error.name === 'CastError') {
      return res.status(400).json({ message: 'Invalid order ID format' });
    }
    res.status(500).json({ message: 'Server error updating order status' });
  }
};

module.exports = { placeOrder, getMyOrders, getAllOrders, updateOrderStatus };
