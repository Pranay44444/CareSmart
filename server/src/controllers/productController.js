const Product = require('../models/Product');

// ── GET /api/products ────────────────────────────────────────────────────────
/**
 * @desc    Get all products with pagination, filtering, and search
 * @route   GET /api/products
 * @access  Public
 * @query   page, limit, category, brand, search
 */
const getProducts = async (req, res) => {
  try {
    const { page = 1, limit = 12, category, brand, search } = req.query;

    // Build filter query
    const filter = {};

    if (category) {
      filter.category = category.toLowerCase();
    }

    if (brand) {
      // compatibleBrands is an array — match if brand is in it
      filter.compatibleBrands = { $in: [new RegExp(brand, 'i')] };
    }

    if (search) {
      filter.name = { $regex: search, $options: 'i' };
    }

    const options = {
      page: parseInt(page, 10),
      limit: parseInt(limit, 10),
      sort: { createdAt: -1 },
      lean: true,
    };

    const result = await Product.paginate(filter, options);

    res.status(200).json({
      products: result.docs,
      totalProducts: result.totalDocs,
      totalPages: result.totalPages,
      currentPage: result.page,
      hasNextPage: result.hasNextPage,
      hasPrevPage: result.hasPrevPage,
    });
  } catch (error) {
    console.error('getProducts error:', error);
    res.status(500).json({ message: 'Server error fetching products' });
  }
};

// ── GET /api/products/:id ────────────────────────────────────────────────────
/**
 * @desc    Get single product by ID
 * @route   GET /api/products/:id
 * @access  Public
 */
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.status(200).json({ product });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({ message: 'Invalid product ID format' });
    }
    console.error('getProductById error:', error);
    res.status(500).json({ message: 'Server error fetching product' });
  }
};

// ── POST /api/products ───────────────────────────────────────────────────────
/**
 * @desc    Create a new product
 * @route   POST /api/products
 * @access  Private / Admin
 */
const createProduct = async (req, res) => {
  try {
    const { name, description, price, category, subCategory, compatibleBrands, stock, image } =
      req.body;

    if (!name || !description || price == null || !category || stock == null) {
      return res.status(400).json({
        message: 'name, description, price, category, and stock are required',
      });
    }

    const product = await Product.create({
      name: name.trim(),
      description: description.trim(),
      price,
      category: category.toLowerCase(),
      subCategory: subCategory?.trim(),
      compatibleBrands: compatibleBrands || [],
      stock,
      image: image?.trim(),
    });

    res.status(201).json({ message: 'Product created successfully', product });
  } catch (error) {
    console.error('createProduct error:', error);
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({ message: messages.join(', ') });
    }
    res.status(500).json({ message: 'Server error creating product' });
  }
};

// ── PUT /api/products/:id ────────────────────────────────────────────────────
/**
 * @desc    Update a product
 * @route   PUT /api/products/:id
 * @access  Private / Admin
 */
const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const allowedFields = [
      'name',
      'description',
      'price',
      'category',
      'subCategory',
      'compatibleBrands',
      'stock',
      'image',
    ];

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        product[field] = req.body[field];
      }
    });

    const updated = await product.save();
    res.status(200).json({ message: 'Product updated successfully', product: updated });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({ message: 'Invalid product ID format' });
    }
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({ message: messages.join(', ') });
    }
    console.error('updateProduct error:', error);
    res.status(500).json({ message: 'Server error updating product' });
  }
};

// ── DELETE /api/products/:id ─────────────────────────────────────────────────
/**
 * @desc    Delete a product
 * @route   DELETE /api/products/:id
 * @access  Private / Admin
 */
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.status(200).json({ message: 'Product deleted successfully' });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({ message: 'Invalid product ID format' });
    }
    console.error('deleteProduct error:', error);
    res.status(500).json({ message: 'Server error deleting product' });
  }
};

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};
